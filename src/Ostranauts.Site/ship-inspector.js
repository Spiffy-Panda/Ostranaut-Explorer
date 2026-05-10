// ship-inspector.js — interactive ship-build checklist for Ostranauts modders.
//
// Audience: modders building (or analyzing) a ship from JSON. The page lets
// them pick a canned ship from data/canned-ships-manifest.js or upload one
// of their own, then ticks components off as they're placed in their own
// build. State persists in localStorage per ship.
//
// Inputs (all loaded as <script src> globals — no fetch, runs from file://):
//   * window.SHIP_INSPECTOR_MANIFEST   — array, dropdown driver
//   * window.SHIP_FRIENDLY_NAMES       — { strName: strNameFriendly }
//   * window.SHIP_INSPECTOR_CANNED     — populated lazily as <script> tags
//                                        for each per-ship .js are injected
//   * window.ROOMS, window.renderRoomCard — from rooms.js
//
// localStorage keys (see PLAN-BUILDER.md):
//   ship-inspector:active-ship           "<reg>" | "upload:<hash>"
//   ship-inspector:checkboxes:<key>      { "<co-strID>": true, ... }
//   ship-inspector:pinned-rooms:<key>    [ "<room-strID>", ... ]
//   ship-inspector:upload-cache:<hash>   uploaded JSON text
//   ship-inspector:upload-meta:<hash>    { name, dateUploaded, summary }
//
// v1 caveat: uploaded ships are stored uncompressed. The script refuses
// uploads larger than UPLOAD_MAX_BYTES so localStorage doesn't fill up.
// A future phase can plumb lz-string if real-world ships push past that.

(function () {
  "use strict";

  // ─── constants ──────────────────────────────────────────────────────────

  const BUCKETS = [
    "walls", "floors", "doors", "conduits",
    "containers", "equipment", "decorative", "other",
  ];

  const BUCKET_LABELS = {
    walls: "Walls", floors: "Floors", doors: "Doors", conduits: "Conduits",
    containers: "Containers", equipment: "Equipment",
    decorative: "Decorative", other: "Other",
  };

  const UPLOAD_MAX_BYTES = 4 * 1024 * 1024;  // 4 MB raw text — stored uncompressed
  const LS_PREFIX = "ship-inspector:";

  // Coarse render palette for the 2D grid. Three colors: wall / floor / empty.
  const GRID_COLOR = {
    wall:  "#6cb4ff",
    floor: "#3a4250",
    empty: "transparent",
  };

  // ─── state ──────────────────────────────────────────────────────────────

  const STATE = {
    activeShipKey: null,        // "<reg>" | "upload:<hash>"
    activeShipLabel: "",        // friendly label for header
    shipDict: null,             // the parsed ship dict (the [0] of the array)
    manifest: [],               // canned-ships manifest array
    friendlyNames: {},          // strName → strNameFriendly
    pinnedRooms: [],            // [room.strID]
    checkboxes: {},             // { item.strID: true }
    bucketFilters: {},          // { walls: true, ... }
    searchQuery: "",
  };

  // ─── localStorage helpers ──────────────────────────────────────────────

  function lsGet(key, fallback) {
    try {
      const v = localStorage.getItem(LS_PREFIX + key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  }
  function lsSet(key, value) {
    try {
      localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn("ship-inspector: localStorage write failed:", e);
    }
  }
  function lsDel(key) {
    try { localStorage.removeItem(LS_PREFIX + key); } catch (e) {}
  }

  // ─── tiny hash for upload identity ─────────────────────────────────────

  function djb2(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(16).padStart(8, "0");
  }

  // ─── friendly names + bucket inference ─────────────────────────────────

  function friendlyName(strName) {
    if (!strName) return "(unknown)";
    return STATE.friendlyNames[strName] || strName;
  }

  function isFriendlyKnown(strName) {
    return Object.prototype.hasOwnProperty.call(STATE.friendlyNames, strName);
  }

  // Best-effort bucket guess for uploaded ships whose items are missing
  // _bucket (we can't redo the data-driven classifier in the browser).
  function inferBucket(strName) {
    if (!strName) return "other";
    const s = strName;
    if (/^Itm(Lit)?Wall/.test(s) || /^Wall/.test(s)) return "walls";
    if (/^ItmFloor/.test(s) || /^Floor/.test(s)) return "floors";
    if (/^ItmDoor/.test(s) || /DockSys/.test(s) || /Hatch/.test(s)) return "doors";
    if (/^ItmConduit/.test(s) || /^ItmWire/.test(s) || /^ItmPower/.test(s)) return "conduits";
    if (/Container|StorageBin|Rack/.test(s)) return "containers";
    return "other";
  }

  function itemBucket(item) {
    return item._bucket || inferBucket(item.strName);
  }

  // ─── DOM helpers ────────────────────────────────────────────────────────

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null) continue;
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k === "html") node.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") {
          node.addEventListener(k.slice(2).toLowerCase(), v);
        } else {
          node.setAttribute(k, v);
        }
      }
    }
    if (children) {
      for (const c of children) {
        if (c == null) continue;
        node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      }
    }
    return node;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  // ─── ship-data loading ──────────────────────────────────────────────────

  function injectScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("failed to load " + src));
      document.head.appendChild(s);
    });
  }

  async function loadCannedShip(reg) {
    const cache = window.SHIP_INSPECTOR_CANNED || {};
    if (cache[reg]) return cache[reg];
    const safeReg = encodeURIComponent(reg);
    await injectScript("data/canned-ships/" + safeReg + ".js");
    const after = window.SHIP_INSPECTOR_CANNED || {};
    if (!after[reg]) throw new Error("ship payload missing after script load: " + reg);
    return after[reg];
  }

  function isShipShaped(payload) {
    if (!Array.isArray(payload) || payload.length !== 1) return false;
    const d = payload[0];
    if (!d || typeof d !== "object") return false;
    if (!Array.isArray(d.aItems)) return false;
    return true;
  }

  // ─── header / picker ───────────────────────────────────────────────────

  function buildPicker(root) {
    const select = el("select", { id: "ship-select", class: "ship-select" });
    select.appendChild(el("option", { value: "", text: "— choose a canned ship —" }));
    for (const m of STATE.manifest) {
      const label = m.friendlyName === m.reg ? m.reg : `${m.friendlyName} (${m.reg})`;
      select.appendChild(el("option", { value: m.reg, text: label }));
    }
    select.addEventListener("change", () => {
      const reg = select.value;
      if (!reg) return;
      location.hash = "#/ship/" + encodeURIComponent(reg);
    });

    const fileInput = el("input", {
      type: "file", id: "ship-upload", accept: ".json,application/json",
      class: "ship-upload",
    });
    fileInput.addEventListener("change", () => onUploadChosen(fileInput));

    const uploadLabel = el("label", { class: "ship-upload-label", for: "ship-upload" }, [
      "Upload your own ship JSON",
    ]);

    const privacy = el("p", {
      class: "ship-privacy",
      text: "Stays in your browser, nothing sent to a server.",
    });

    const links = el("p", { class: "ship-links" }, [
      el("a", { href: "rooms-reference.html", text: "→ Rooms reference" }),
      "  ",
      el("a", { href: "data/id-friendly-names.json", text: "→ ID-to-friendly-name JSON" }),
    ]);

    root.appendChild(el("div", { class: "ship-picker" }, [
      select,
      uploadLabel,
      fileInput,
      privacy,
      links,
    ]));
  }

  function onUploadChosen(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    if (file.size > UPLOAD_MAX_BYTES) {
      uploadError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). ` +
        `Max ${UPLOAD_MAX_BYTES / 1024 / 1024} MB so the cache fits in localStorage.`);
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      let parsed;
      try { parsed = JSON.parse(text); }
      catch (e) {
        uploadError("Could not parse JSON: " + e.message);
        input.value = "";
        return;
      }
      if (!isShipShaped(parsed)) {
        uploadError("This doesn't look like a ship JSON (expected a single-element array " +
          "wrapping a dict with aItems[]).");
        input.value = "";
        return;
      }
      const hash = djb2(text);
      const key = "upload:" + hash;
      lsSet("upload-cache:" + hash, text);
      lsSet("upload-meta:" + hash, {
        name: file.name,
        dateUploaded: new Date().toISOString(),
        summary: {
          itemCount: parsed[0].aItems.length,
          regName: parsed[0].strName || parsed[0].strRegID || file.name,
        },
      });
      uploadError("");
      activateShip(key, parsed);
    };
    reader.onerror = () => {
      uploadError("Failed to read file.");
      input.value = "";
    };
    reader.readAsText(file);
  }

  function uploadError(msg) {
    let banner = document.getElementById("upload-error");
    if (!banner) {
      banner = el("div", { id: "upload-error", class: "upload-error" });
      const picker = document.querySelector(".ship-picker");
      if (picker) picker.appendChild(banner);
    }
    banner.textContent = msg || "";
    banner.style.display = msg ? "block" : "none";
  }

  function tryRehydrateUpload(key) {
    const hash = key.slice("upload:".length);
    const text = lsGet("upload-cache:" + hash, null);
    if (!text) return null;
    try {
      const parsed = JSON.parse(text);
      if (!isShipShaped(parsed)) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  // ─── progress bar (sticky) ──────────────────────────────────────────────

  function buildProgress(root) {
    const wrap = el("div", { id: "progress-wrap", class: "progress-wrap" }, [
      el("div", { class: "progress-header" }, [
        el("span", { id: "progress-label", class: "progress-label", text: "No ship loaded" }),
        el("button", {
          id: "reset-checklist", class: "btn-secondary", type: "button",
          text: "Reset checklist",
          onclick: onResetChecklist,
        }),
      ]),
      el("div", { class: "progress-bar" }, [
        el("div", { id: "progress-fill", class: "progress-fill" }),
      ]),
      el("div", { id: "progress-counts", class: "progress-counts", text: "" }),
    ]);
    root.appendChild(wrap);
  }

  function onResetChecklist() {
    if (!STATE.activeShipKey) return;
    if (!confirm("Reset the build checklist for this ship?")) return;
    STATE.checkboxes = {};
    lsDel("checkboxes:" + STATE.activeShipKey);
    renderComponents();
    renderProgress();
  }

  function renderProgress() {
    const label = document.getElementById("progress-label");
    const fill = document.getElementById("progress-fill");
    const counts = document.getElementById("progress-counts");
    if (!label || !fill || !counts) return;

    if (!STATE.shipDict) {
      label.textContent = "No ship loaded";
      fill.style.width = "0%";
      counts.textContent = "";
      return;
    }

    const items = STATE.shipDict.aItems || [];
    const total = items.length;
    let checked = 0;
    for (const it of items) if (STATE.checkboxes[it.strID]) checked++;
    const pct = total ? (checked / total) * 100 : 0;

    label.textContent = `${STATE.activeShipLabel} — ${checked.toLocaleString()} of ${total.toLocaleString()} components built`;
    fill.style.width = pct.toFixed(1) + "%";
    counts.textContent = `${pct.toFixed(1)}% complete`;
  }

  // ─── visual layout ─────────────────────────────────────────────────────

  function buildVisual(root) {
    root.appendChild(el("section", { class: "section" }, [
      el("h2", { text: "Visual layout" }),
      el("p", { class: "muted small", text:
        "Coarse 2D plan: walls in accent, floors in dim. Components binned to integer tiles by their (fX, fY)." }),
      el("canvas", { id: "ship-grid", class: "ship-grid" }),
    ]));
  }

  function renderVisual() {
    const canvas = document.getElementById("ship-grid");
    if (!canvas || !STATE.shipDict) return;
    const items = STATE.shipDict.aItems || [];
    if (items.length === 0) {
      canvas.width = 0; canvas.height = 0; return;
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const it of items) {
      const x = Math.round(it.fX), y = Math.round(it.fY);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const cols = maxX - minX + 1;
    const rows = maxY - minY + 1;

    // Pixel size: aim ~10 px per tile, capped by the page width.
    const containerWidth = (canvas.parentElement && canvas.parentElement.clientWidth) || 800;
    const px = Math.max(2, Math.min(12, Math.floor((containerWidth - 24) / cols)));
    canvas.width = cols * px;
    canvas.height = rows * px;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // First pass: paint floors. Second pass: paint walls on top.
    const grid = new Array(cols * rows);
    for (const it of items) {
      const bk = itemBucket(it);
      if (bk !== "walls" && bk !== "floors") continue;
      const x = Math.round(it.fX) - minX;
      const y = Math.round(it.fY) - minY;
      if (x < 0 || x >= cols || y < 0 || y >= rows) continue;
      const idx = y * cols + x;
      // walls override floors
      if (bk === "walls") grid[idx] = "wall";
      else if (grid[idx] !== "wall") grid[idx] = "floor";
    }
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = grid[y * cols + x];
        if (!cell) continue;
        ctx.fillStyle = cell === "wall" ? GRID_COLOR.wall : GRID_COLOR.floor;
        ctx.fillRect(x * px, y * px, px, px);
      }
    }
  }

  // ─── component list ────────────────────────────────────────────────────

  function buildComponents(root) {
    const filterPills = el("div", { id: "filter-pills", class: "filter-pills" });
    for (const b of BUCKETS) {
      const btn = el("button", {
        type: "button",
        class: "filter-pill",
        "data-bucket": b,
        text: BUCKET_LABELS[b],
        onclick: () => {
          STATE.bucketFilters[b] = !STATE.bucketFilters[b];
          lsSet("bucket-filters", STATE.bucketFilters);
          btn.classList.toggle("is-off", !STATE.bucketFilters[b]);
          renderComponents();
        },
      });
      filterPills.appendChild(btn);
    }

    const search = el("input", {
      type: "search",
      id: "comp-search",
      class: "comp-search",
      placeholder: "Search components by name or ID…",
      oninput: (e) => {
        STATE.searchQuery = e.target.value.toLowerCase();
        renderComponents();
      },
    });

    root.appendChild(el("section", { class: "section components-section", id: "components-section" }, [
      el("h2", { text: "Components" }),
      el("div", { class: "components-controls" }, [search, filterPills]),
      el("div", { id: "components-list", class: "components-list" }),
    ]));
  }

  function renderFilterPills() {
    const pills = document.querySelectorAll("#filter-pills .filter-pill");
    pills.forEach((btn) => {
      const b = btn.getAttribute("data-bucket");
      btn.classList.toggle("is-off", !STATE.bucketFilters[b]);
    });
  }

  function renderComponents() {
    const list = document.getElementById("components-list");
    if (!list || !STATE.shipDict) return;
    clear(list);

    const items = STATE.shipDict.aItems || [];
    const groupedByBucket = {};
    for (const b of BUCKETS) groupedByBucket[b] = {};
    for (const it of items) {
      const bk = itemBucket(it);
      const slot = groupedByBucket[bk] || (groupedByBucket[bk] = {});
      const sn = it.strName || "(unnamed)";
      (slot[sn] = slot[sn] || []).push(it);
    }

    const q = STATE.searchQuery || "";
    for (const bucket of BUCKETS) {
      if (!STATE.bucketFilters[bucket]) continue;
      const byName = groupedByBucket[bucket] || {};

      // Filter strNames by search query.
      const matchedNames = Object.keys(byName).filter((sn) => {
        if (!q) return true;
        const fn = friendlyName(sn).toLowerCase();
        return fn.includes(q) || sn.toLowerCase().includes(q);
      });
      if (!matchedNames.length && q) continue;

      const total = Object.values(byName).reduce((a, arr) => a + arr.length, 0);
      let checked = 0;
      for (const arr of Object.values(byName)) {
        for (const it of arr) if (STATE.checkboxes[it.strID]) checked++;
      }
      if (total === 0) continue;

      matchedNames.sort((a, b) => friendlyName(a).localeCompare(friendlyName(b)));

      const det = el("details", { class: "bucket-foldout" });
      const summary = el("summary", { class: "bucket-summary" }, [
        el("span", { class: "bucket-name", text: BUCKET_LABELS[bucket] }),
        el("span", { class: "bucket-count", text: `${checked} of ${total}` }),
      ]);
      det.appendChild(summary);

      const inner = el("div", { class: "bucket-body" });
      for (const sn of matchedNames) {
        const instances = byName[sn];
        inner.appendChild(buildItemLine(sn, instances));
      }
      det.appendChild(inner);
      list.appendChild(det);
    }

    if (!list.firstChild) {
      list.appendChild(el("p", { class: "muted small", text:
        q ? "No components match your search." : "No components in any selected bucket." }));
    }
  }

  function buildItemLine(strName, instances) {
    const fn = friendlyName(strName);
    const known = isFriendlyKnown(strName);
    const line = el("div", { class: "item-line" });

    const labelChunks = [
      el("span", { class: "item-friendly", text: fn }),
    ];
    if (!known) {
      labelChunks.push(el("span", {
        class: "item-mod-tag",
        title: "This ID isn't in the shipped name table — likely a mod component.",
        text: "mod?",
      }));
    } else if (fn !== strName) {
      labelChunks.push(el("code", { class: "item-strname", text: strName }));
    }
    labelChunks.push(el("span", { class: "item-qty", text: "×" + instances.length }));
    line.appendChild(el("div", { class: "item-label" }, labelChunks));

    const boxes = el("div", { class: "item-boxes" });
    for (const it of instances) {
      const id = it.strID;
      const cb = el("input", {
        type: "checkbox",
        class: "item-cb",
        title: id || "(no strID)",
      });
      cb.checked = !!STATE.checkboxes[id];
      cb.addEventListener("change", () => {
        if (cb.checked) STATE.checkboxes[id] = true;
        else delete STATE.checkboxes[id];
        lsSet("checkboxes:" + STATE.activeShipKey, STATE.checkboxes);
        renderProgress();
        // Update the bucket count in the closest <summary>.
        const det = line.closest("details.bucket-foldout");
        if (det) {
          const sumCount = det.querySelector(".bucket-count");
          if (sumCount) {
            const allCBs = det.querySelectorAll(".item-cb");
            let chk = 0;
            allCBs.forEach((b) => { if (b.checked) chk++; });
            sumCount.textContent = `${chk} of ${allCBs.length}`;
          }
        }
      });
      boxes.appendChild(cb);
    }
    line.appendChild(boxes);
    return line;
  }

  // ─── rooms (pinned + unpinned) ─────────────────────────────────────────

  function buildRooms(root) {
    root.appendChild(el("section", { class: "section", id: "pinned-section" }, [
      el("h2", { text: "Pinned rooms" }),
      el("div", { id: "pinned-list", class: "rooms-list" }),
      el("p", { id: "pinned-empty", class: "muted small",
        text: "No pinned rooms. Pin one from the list below to keep its requirements at the top of the page." }),
    ]));

    root.appendChild(el("section", { class: "section", id: "rooms-section" }, [
      el("h2", { text: "Rooms" }),
      el("p", { class: "muted small", text:
        "One card per room in the ship. Pin the cards relevant to your build to surface them at the top." }),
      el("div", { id: "rooms-list", class: "rooms-list" }),
    ]));
  }

  function findRoomSpec(name) {
    if (!name || !window.ROOMS) return null;
    for (const r of window.ROOMS) if (r.name === name) return r;
    return null;
  }

  function renderRooms() {
    const pinnedList = document.getElementById("pinned-list");
    const pinnedEmpty = document.getElementById("pinned-empty");
    const roomsList = document.getElementById("rooms-list");
    if (!pinnedList || !roomsList || !STATE.shipDict) return;
    clear(pinnedList);
    clear(roomsList);

    const rooms = STATE.shipDict.aRooms || [];
    const pinnedSet = new Set(STATE.pinnedRooms);

    let pinnedRendered = 0;
    let unpinnedRendered = 0;

    // Stable ordering: pinned in the order saved, unpinned by spec priority.
    const idToRoom = {};
    for (const r of rooms) idToRoom[r.strID] = r;

    // pinned section (in saved order)
    for (const id of STATE.pinnedRooms) {
      const room = idToRoom[id];
      if (!room) continue;
      const spec = findRoomSpec(room.roomSpec);
      if (!spec) continue;
      const card = window.renderRoomCard(spec, {
        idPrefix: "pinned-" + room.strID + "-",
        pinned: true,
        openByDefault: true,
        onPin: () => unpinRoom(room.strID),
      });
      pinnedList.appendChild(card);
      pinnedRendered++;
    }
    pinnedEmpty.style.display = pinnedRendered ? "none" : "block";

    // unpinned section, sorted by spec priority desc then by strID for stability
    const unpinned = rooms.filter((r) => !pinnedSet.has(r.strID));
    unpinned.sort((a, b) => {
      const sa = findRoomSpec(a.roomSpec);
      const sb = findRoomSpec(b.roomSpec);
      const pa = sa ? sa.priority : -1;
      const pb = sb ? sb.priority : -1;
      if (pa !== pb) return pb - pa;
      return (a.strID || "").localeCompare(b.strID || "");
    });
    for (const room of unpinned) {
      const spec = findRoomSpec(room.roomSpec);
      if (!spec) continue;
      const card = window.renderRoomCard(spec, {
        idPrefix: "room-" + room.strID + "-",
        onPin: () => pinRoom(room.strID),
      });
      roomsList.appendChild(card);
      unpinnedRendered++;
    }
    if (!unpinnedRendered) {
      roomsList.appendChild(el("p", { class: "muted small", text:
        "No classified rooms on this ship — every enclosed area falls back to Blank, " +
        "or the ship has no flood-fill rooms." }));
    }
  }

  function pinRoom(strID) {
    if (STATE.pinnedRooms.indexOf(strID) !== -1) return;
    STATE.pinnedRooms.push(strID);
    lsSet("pinned-rooms:" + STATE.activeShipKey, STATE.pinnedRooms);
    renderRooms();
  }
  function unpinRoom(strID) {
    const i = STATE.pinnedRooms.indexOf(strID);
    if (i === -1) return;
    STATE.pinnedRooms.splice(i, 1);
    lsSet("pinned-rooms:" + STATE.activeShipKey, STATE.pinnedRooms);
    renderRooms();
  }

  // ─── activate ship ──────────────────────────────────────────────────────

  function activateShip(key, payload) {
    if (!isShipShaped(payload)) {
      uploadError("Active ship payload is malformed; ignoring.");
      return;
    }
    STATE.activeShipKey = key;
    STATE.shipDict = payload[0];
    STATE.checkboxes = lsGet("checkboxes:" + key, {}) || {};
    STATE.pinnedRooms = lsGet("pinned-rooms:" + key, []) || [];

    if (key.startsWith("upload:")) {
      const meta = lsGet("upload-meta:" + key.slice("upload:".length), null);
      const name = (meta && meta.name) || STATE.shipDict.strName || "(uploaded ship)";
      STATE.activeShipLabel = name + " (uploaded)";
    } else {
      const m = STATE.manifest.find((m) => m.reg === key);
      const friendly = (m && m.friendlyName) || STATE.shipDict.strName || key;
      STATE.activeShipLabel = friendly === key ? key : `${friendly} (${key})`;
    }
    lsSet("active-ship", key);

    // sync select (for canned ships)
    const sel = document.getElementById("ship-select");
    if (sel) sel.value = key.startsWith("upload:") ? "" : key;

    renderProgress();
    renderVisual();
    renderRooms();
    renderComponents();
  }

  // ─── hash routing ──────────────────────────────────────────────────────

  function readHashShip() {
    const m = /^#\/ship\/([^/?]+)/.exec(location.hash || "");
    return m ? decodeURIComponent(m[1]) : null;
  }

  async function onHashChange() {
    const reg = readHashShip();
    if (!reg) return;
    if (STATE.activeShipKey === reg) return;
    try {
      const payload = await loadCannedShip(reg);
      activateShip(reg, payload);
    } catch (e) {
      uploadError("Could not load ship '" + reg + "': " + e.message);
    }
  }

  // ─── boot ──────────────────────────────────────────────────────────────

  async function boot() {
    STATE.manifest = (window.SHIP_INSPECTOR_MANIFEST || []).slice();
    STATE.manifest.sort((a, b) =>
      (a.friendlyName || a.reg).localeCompare(b.friendlyName || b.reg));
    STATE.friendlyNames = window.SHIP_FRIENDLY_NAMES || {};

    // bucket filters: default all on, restore user's saved subset if any.
    const savedFilters = lsGet("bucket-filters", null);
    for (const b of BUCKETS) STATE.bucketFilters[b] = savedFilters ? !!savedFilters[b] : true;

    const main = document.getElementById("inspector-root");
    if (!main) {
      console.error("ship-inspector: missing #inspector-root");
      return;
    }

    buildPicker(main);
    buildProgress(main);
    buildVisual(main);
    buildRooms(main);
    buildComponents(main);
    renderFilterPills();

    // Decide what to load:
    // 1. URL hash #/ship/<reg>  (canned only)
    // 2. localStorage active-ship
    // 3. nothing (waiting for picker)
    const hashReg = readHashShip();
    if (hashReg) {
      try {
        const payload = await loadCannedShip(hashReg);
        activateShip(hashReg, payload);
      } catch (e) {
        uploadError("Could not load ship '" + hashReg + "': " + e.message);
      }
    } else {
      const lastKey = lsGet("active-ship", null);
      if (lastKey) {
        if (lastKey.startsWith("upload:")) {
          const payload = tryRehydrateUpload(lastKey);
          if (payload) activateShip(lastKey, payload);
        } else {
          try {
            const payload = await loadCannedShip(lastKey);
            activateShip(lastKey, payload);
            // mirror to URL hash so deep-link is shareable
            location.hash = "#/ship/" + encodeURIComponent(lastKey);
          } catch (e) {
            // stale localStorage, ignore
          }
        }
      }
    }

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("resize", () => {
      // Re-render the canvas so it tracks container width.
      if (STATE.shipDict) renderVisual();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
