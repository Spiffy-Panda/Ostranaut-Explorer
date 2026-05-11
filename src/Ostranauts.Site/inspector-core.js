// inspector-core.js — shared rendering core for the ship/save inspectors.
//
// Both consumer pages (ship-inspector.html, save-inspector.html) build the
// header/picker UI themselves, then call InspectorCore.init({...}) once to
// stand up the progress / visual / rooms / components sections, and call
// InspectorCore.activateShip(key, shipDict, label) whenever the user picks
// a ship from their picker.
//
// Module-private STATE persists for the lifetime of the page. The only
// thing the consumer page needs to swap when it has multiple "ships" to
// show in one session (e.g. browsing ships inside a save zip) is the
// `key` — that drives the localStorage namespace for counts/pinned-specs.
//
// LocalStorage layout (under <lsPrefix>):
//   bucket-filters                  global per-page  { walls: true, ... }
//   counts:<key>                    per ship         { strName: built-count }
//   pinned-specs:<key>              per ship         [ "Reactor", ... ]
// Higher-level keys (active-ship, upload-cache, etc.) are the picker
// page's responsibility — core never reads or writes them.

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

  // Coarse render palette for the 2D grid. Three colors: wall / floor / empty.
  const GRID_COLOR = {
    wall:  "#6cb4ff",
    floor: "#3a4250",
    empty: "transparent",
  };

  // ─── state ──────────────────────────────────────────────────────────────

  const STATE = {
    lsPrefix: "inspector:",       // overridden by init()
    rootEl: null,
    friendlyNames: {},
    rooms: [],

    activeShipKey: null,          // localStorage key for per-ship state
    activeShipLabel: "",          // friendly label for header
    shipDict: null,               // the parsed ship dict (the [0] of the array)
    pinnedSpecs: [],              // [room-spec-name]   (e.g. "Reactor")
    counts: {},                   // { strName: count-built }
    bucketFilters: {},            // { walls: true, ... }
    searchQuery: "",
  };

  // ─── localStorage helpers ──────────────────────────────────────────────

  function lsGet(key, fallback) {
    try {
      const v = localStorage.getItem(STATE.lsPrefix + key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  }
  function lsSet(key, value) {
    try {
      localStorage.setItem(STATE.lsPrefix + key, JSON.stringify(value));
    } catch (e) {
      console.warn("inspector-core: localStorage write failed:", e);
    }
  }
  function lsDel(key) {
    try { localStorage.removeItem(STATE.lsPrefix + key); } catch (e) {}
  }

  // ─── tiny hash (used by callers for upload identity; exported) ─────────

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

  // Best-effort bucket guess for items missing _bucket (uploads + saves).
  // The data-driven classifier in build_ship_inspector_data.py is more
  // accurate but only runs over the canned ships at site-build time.
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

  // ─── ship payload validation ───────────────────────────────────────────

  // True if `payload` looks like an Ostranauts ship JSON: a single-element
  // array wrapping a dict that has at least an `aItems` array. Save-format
  // per-ship JSONs (inside save zips) satisfy this too — they're a runtime
  // superset of the static ships/<reg>.json shape.
  function isShipShaped(payload) {
    if (!Array.isArray(payload) || payload.length !== 1) return false;
    const d = payload[0];
    if (!d || typeof d !== "object") return false;
    if (!Array.isArray(d.aItems)) return false;
    return true;
  }

  // ─── empty / error UI ──────────────────────────────────────────────────

  function setEmptyState(empty) {
    if (STATE.rootEl) STATE.rootEl.classList.toggle("is-empty", !!empty);
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
    STATE.counts = {};
    lsDel("counts:" + STATE.activeShipKey);
    renderComponents();
    renderProgress();
  }

  // Count of items per strName across this ship.
  function tallyByStrName(items) {
    const out = {};
    for (const it of items) {
      const sn = it.strName || "(unnamed)";
      out[sn] = (out[sn] || 0) + 1;
    }
    return out;
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
    const totals = tallyByStrName(items);
    let built = 0;
    for (const sn in totals) {
      const want = totals[sn];
      const have = Math.max(0, Math.min(want, STATE.counts[sn] || 0));
      built += have;
    }
    const pct = total ? (built / total) * 100 : 0;

    label.textContent = `${STATE.activeShipLabel} — ${built.toLocaleString()} of ${total.toLocaleString()} components built`;
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
    // Game coords are +Y up; canvas pixel coords are +Y down — flip Y so
    // the ship doesn't render mirrored relative to its in-game silhouette.
    const grid = new Array(cols * rows);
    for (const it of items) {
      const bk = itemBucket(it);
      if (bk !== "walls" && bk !== "floors") continue;
      const x = Math.round(it.fX) - minX;
      const y = (rows - 1) - (Math.round(it.fY) - minY);
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

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  function renderComponents() {
    const list = document.getElementById("components-list");
    if (!list || !STATE.shipDict) return;
    clear(list);

    const items = STATE.shipDict.aItems || [];
    // Group items by bucket → strName → required count.
    const groupedByBucket = {};
    for (const b of BUCKETS) groupedByBucket[b] = {};
    for (const it of items) {
      const bk = itemBucket(it);
      const slot = groupedByBucket[bk] || (groupedByBucket[bk] = {});
      const sn = it.strName || "(unnamed)";
      slot[sn] = (slot[sn] || 0) + 1;
    }

    const q = STATE.searchQuery || "";
    for (const bucket of BUCKETS) {
      if (!STATE.bucketFilters[bucket]) continue;
      const byName = groupedByBucket[bucket] || {};
      const allNames = Object.keys(byName);
      if (allNames.length === 0) continue;

      // Filter by search.
      const matchedNames = allNames.filter((sn) => {
        if (!q) return true;
        const fn = friendlyName(sn).toLowerCase();
        return fn.includes(q) || sn.toLowerCase().includes(q);
      });
      if (!matchedNames.length && q) continue;

      const totalAll = allNames.reduce((a, sn) => a + byName[sn], 0);
      let builtAll = 0;
      for (const sn of allNames) {
        builtAll += clamp(STATE.counts[sn] || 0, 0, byName[sn]);
      }

      matchedNames.sort((a, b) => friendlyName(a).localeCompare(friendlyName(b)));

      const det = el("details", { class: "bucket-foldout" });
      const summary = el("summary", { class: "bucket-summary" }, [
        el("span", { class: "bucket-name", text: BUCKET_LABELS[bucket] }),
        el("span", { class: "bucket-count", text: `${builtAll} of ${totalAll}` }),
      ]);
      det.appendChild(summary);

      const inner = el("div", { class: "bucket-body" });
      for (const sn of matchedNames) {
        inner.appendChild(buildItemLine(sn, byName[sn]));
      }
      det.appendChild(inner);
      list.appendChild(det);
    }

    if (!list.firstChild) {
      list.appendChild(el("p", { class: "muted small", text:
        q ? "No components match your search." : "No components in any selected bucket." }));
    }
  }

  // Refresh the per-bucket "X of Y" summary count without re-rendering.
  function refreshBucketCount(bucket) {
    const dets = document.querySelectorAll("details.bucket-foldout");
    for (const det of dets) {
      const name = det.querySelector(".bucket-name");
      if (!name || name.textContent !== BUCKET_LABELS[bucket]) continue;
      const items = (STATE.shipDict && STATE.shipDict.aItems) || [];
      let total = 0, built = 0;
      const byName = {};
      for (const it of items) {
        if (itemBucket(it) !== bucket) continue;
        const sn = it.strName || "(unnamed)";
        byName[sn] = (byName[sn] || 0) + 1;
      }
      for (const sn in byName) {
        total += byName[sn];
        built += clamp(STATE.counts[sn] || 0, 0, byName[sn]);
      }
      const sumCount = det.querySelector(".bucket-count");
      if (sumCount) sumCount.textContent = `${built} of ${total}`;
      break;
    }
  }

  function buildItemLine(strName, required) {
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
    line.appendChild(el("div", { class: "item-label" }, labelChunks));

    const current = clamp(STATE.counts[strName] || 0, 0, required);

    const input = el("input", {
      type: "number",
      class: "item-count",
      min: "0",
      max: String(required),
      step: "1",
      value: String(current),
      "aria-label": `${fn} placed`,
    });
    const denom = el("span", { class: "item-required",
      text: required === 1 ? "/ 1 needed" : `/ ${required} needed` });

    const setCount = (n) => {
      const next = clamp(Math.floor(n) || 0, 0, required);
      input.value = String(next);
      if (next === 0) delete STATE.counts[strName];
      else STATE.counts[strName] = next;
      lsSet("counts:" + STATE.activeShipKey, STATE.counts);
      renderProgress();
      const bucket = itemBucket({ strName, _bucket: STATE.shipDict.aItems.find((it) => it.strName === strName)?._bucket });
      if (bucket) refreshBucketCount(bucket);
      // Visual: complete row gets a tick.
      line.classList.toggle("is-complete", next >= required);
    };
    input.addEventListener("input", () => setCount(parseInt(input.value, 10)));
    input.addEventListener("blur", () => setCount(parseInt(input.value, 10)));

    const allBtn = el("button", {
      type: "button", class: "item-all-btn",
      title: "Mark all as built",
      text: "all",
      onclick: () => setCount(required),
    });
    const noneBtn = el("button", {
      type: "button", class: "item-none-btn",
      title: "Clear",
      text: "0",
      onclick: () => setCount(0),
    });

    if (current >= required) line.classList.add("is-complete");

    line.appendChild(el("div", { class: "item-counter" }, [
      noneBtn, input, denom, allBtn,
    ]));
    return line;
  }

  // ─── rooms (pinned + unpinned) ─────────────────────────────────────────

  function buildPinnedRooms(root) {
    root.appendChild(el("section", { class: "section", id: "pinned-section" }, [
      el("h2", { text: "Pinned rooms" }),
      el("div", { id: "pinned-list", class: "rooms-list" }),
      el("p", { id: "pinned-empty", class: "muted small",
        text: "No pinned rooms. Pin one from the list below the component checklist to keep its requirements at the top of the page." }),
    ]));
  }

  function buildUnpinnedRooms(root) {
    root.appendChild(el("section", { class: "section", id: "rooms-section" }, [
      el("h2", { text: "Rooms" }),
      el("p", { class: "muted small", text:
        "One card per room spec in the ship (×N if it appears more than once). Pin the cards relevant to your build to surface them above the component checklist." }),
      el("div", { id: "rooms-list", class: "rooms-list" }),
    ]));
  }

  function findRoomSpec(name) {
    if (!name || !STATE.rooms) return null;
    for (const r of STATE.rooms) if (r.name === name) return r;
    return null;
  }

  // Deduplicate rooms by roomSpec name → { specName: count }.
  function specCountsForShip(rooms) {
    const out = {};
    for (const r of rooms) {
      const sn = r.roomSpec;
      if (!sn) continue;
      out[sn] = (out[sn] || 0) + 1;
    }
    return out;
  }

  function renderRooms() {
    const pinnedList = document.getElementById("pinned-list");
    const pinnedEmpty = document.getElementById("pinned-empty");
    const roomsList = document.getElementById("rooms-list");
    if (!pinnedList || !roomsList || !STATE.shipDict) return;
    clear(pinnedList);
    clear(roomsList);

    const rooms = STATE.shipDict.aRooms || [];
    const counts = specCountsForShip(rooms);
    const pinnedSet = new Set(STATE.pinnedSpecs);

    let pinnedRendered = 0;

    // Pinned: in saved order, one card per spec name.
    for (const specName of STATE.pinnedSpecs) {
      const spec = findRoomSpec(specName);
      if (!spec) continue;
      if (!counts[specName]) continue;  // ship doesn't have this spec
      const card = renderSpecCard(spec, counts[specName], true);
      pinnedList.appendChild(card);
      pinnedRendered++;
    }
    pinnedEmpty.style.display = pinnedRendered ? "none" : "block";

    // Unpinned: dedup'd by spec, sorted by priority desc.
    const unpinnedSpecs = Object.keys(counts).filter((sn) => !pinnedSet.has(sn));
    unpinnedSpecs.sort((a, b) => {
      const sa = findRoomSpec(a);
      const sb = findRoomSpec(b);
      const pa = sa ? sa.priority : -1;
      const pb = sb ? sb.priority : -1;
      if (pa !== pb) return pb - pa;
      return a.localeCompare(b);
    });

    let unpinnedRendered = 0;
    for (const specName of unpinnedSpecs) {
      const spec = findRoomSpec(specName);
      if (!spec) continue;
      const card = renderSpecCard(spec, counts[specName], false);
      roomsList.appendChild(card);
      unpinnedRendered++;
    }
    if (!unpinnedRendered) {
      roomsList.appendChild(el("p", { class: "muted small", text:
        pinnedRendered
          ? "All room specs on this ship are pinned."
          : "No classified rooms on this ship — every enclosed area falls back to Blank, " +
            "or the ship has no flood-fill rooms." }));
    }
  }

  function renderSpecCard(spec, count, pinned) {
    const card = window.renderRoomCard(spec, {
      idPrefix: pinned ? "pinned-" : "room-",
      pinned: pinned,
      openByDefault: pinned,
      onPin: () => togglePin(spec.name),
    });
    // Add the "×N" badge into the summary so the modder sees how many of
    // this spec the ship contains.
    if (count > 1) {
      const summary = card.querySelector("summary");
      const pinBtn = summary.querySelector(".room-pin-btn");
      const badge = el("span", { class: "summary-meta room-count-badge", text: "×" + count });
      if (pinBtn) summary.insertBefore(badge, pinBtn);
      else summary.appendChild(badge);
    }
    return card;
  }

  function togglePin(specName) {
    const i = STATE.pinnedSpecs.indexOf(specName);
    if (i === -1) STATE.pinnedSpecs.push(specName);
    else STATE.pinnedSpecs.splice(i, 1);
    lsSet("pinned-specs:" + STATE.activeShipKey, STATE.pinnedSpecs);
    renderRooms();
  }

  // ─── activate / clear ──────────────────────────────────────────────────

  function activateShip(key, shipDict, label) {
    if (!shipDict || typeof shipDict !== "object" || !Array.isArray(shipDict.aItems)) {
      uploadError("Ship payload is malformed (missing aItems[]); ignoring.");
      return false;
    }
    STATE.activeShipKey = key;
    STATE.activeShipLabel = label || key;
    STATE.shipDict = shipDict;
    STATE.counts = lsGet("counts:" + key, {}) || {};
    STATE.pinnedSpecs = lsGet("pinned-specs:" + key, []) || [];

    setEmptyState(false);
    renderProgress();
    renderVisual();
    renderRooms();
    renderComponents();
    return true;
  }

  function clearShip() {
    STATE.activeShipKey = null;
    STATE.activeShipLabel = "";
    STATE.shipDict = null;
    STATE.counts = {};
    STATE.pinnedSpecs = [];
    setEmptyState(true);
    renderProgress();
  }

  // ─── init ──────────────────────────────────────────────────────────────

  function init(opts) {
    STATE.lsPrefix = opts.lsPrefix || "inspector:";
    STATE.rootEl = opts.rootEl;
    STATE.friendlyNames = opts.friendlyNames || {};
    STATE.rooms = opts.rooms || (window.ROOMS || []);

    // bucket filters: default all on, restore user's saved subset if any.
    const savedFilters = lsGet("bucket-filters", null);
    for (const b of BUCKETS) STATE.bucketFilters[b] = savedFilters ? !!savedFilters[b] : true;

    buildProgress(opts.rootEl);
    buildVisual(opts.rootEl);
    buildPinnedRooms(opts.rootEl);
    buildComponents(opts.rootEl);
    buildUnpinnedRooms(opts.rootEl);
    renderFilterPills();
  }

  // Re-render when the page resizes (canvas tracks container width).
  window.addEventListener("resize", () => {
    if (STATE.shipDict) renderVisual();
  });

  // ─── exports ───────────────────────────────────────────────────────────

  window.InspectorCore = {
    init,
    activateShip,
    clearShip,
    setEmptyState,
    uploadError,
    isShipShaped,
    el,
    djb2,
    friendlyName,
    isFriendlyKnown,
    BUCKETS,
    BUCKET_LABELS,
  };
})();
