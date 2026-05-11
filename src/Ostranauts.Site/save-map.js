// save-map.js — picker + canvas-map for the save-map page.
//
// Plots every ship in an Ostranauts save zip at its `objSS.(vPosx, vPosy)`
// position. Icons are sqrt-scaled by `fShallowMass` and colored by
// `fLastVisit > 0` (visited) vs. `0.0` (never visited). Hover for a
// tooltip; click to lock a detail panel + grab a deep link into the
// save inspector.
//
// Inputs:
//   * window.SHIP_FRIENDLY_NAMES   — { strName: strNameFriendly }
//   * window.SaveZipReader         — from save-zip-reader.js
//
// Per-ship metadata fields live near the END of each ship's JSON (after
// the giant `aItems[]` / `aRooms[]` blocks). That means we must fully
// decompress each ship to read its position + mass — there's no quick
// header-only path. We parallelize 4 decompressions at a time and show
// a progress indicator while the map fills in.

(function () {
  "use strict";

  // ─── constants ──────────────────────────────────────────────────────────

  const COLOR_VISITED = "#6cb4ff";      // accent — ships you've stepped onto
  const COLOR_UNVISITED = "#5a6470";    // muted slate — ships you haven't
  const COLOR_VISITED_DIM = "#2d4860";  // visited but dim (for selected-other state)
  const COLOR_BG = "#1a1d22";

  const RADIUS_MIN = 2.5;
  const RADIUS_MAX = 22;

  const CANVAS_PADDING_PX = 30;
  const PARALLEL_DECOMPRESS = 4;

  // Zoom / pan limits + per-tick deltas.
  const ZOOM_MIN = 0.4;
  // Headroom enough to resolve sub-km separations between ships sharing
  // a station/body. Two ships ~1e-8 AU apart need scale on the order of
  // 1e8 px/unit to be a pixel apart; autoFit is ~160 px/unit, so the
  // multiplier is ~6e5. Setting MAX to 1e9 gives ~3 orders of magnitude
  // of headroom past what the data needs.
  const ZOOM_MAX = 1e9;
  const ZOOM_WHEEL_FACTOR = 1.25;   // per wheel tick — bumped up so deep zoom is fewer clicks
  const ZOOM_BUTTON_FACTOR = 1.6;   // per +/- button click
  const DRAG_THRESHOLD_PX = 4;      // mouse move beyond this → it's a drag, not a click
  const STACK_LIST_LIMIT = 10;      // tooltip/selection: max ships shown before "+N others"

  // ─── state ──────────────────────────────────────────────────────────────

  const STATE = {
    saveName: null,
    saveHash: null,
    shipEntries: [],
    ships: [],          // see extractMeta() for shape
    bounds: null,       // { minX, maxX, minY, maxY }
    transform: null,    // { scale, offsetX, offsetY } world→canvas (auto-fit)
    // User view transform layered on top of the auto-fit transform:
    //   visible_canvas_x = (autoFit_x - cx) * viewZoom + cx + viewPanX
    // (cx = cssWidth/2; same for y). Reset to (1, 0, 0) on every load.
    viewZoom: 1,
    viewPanX: 0,
    viewPanY: 0,
    hoveredReg: null,
    selectedReg: null,
    canvas: null,
    ctx: null,
    cssWidth: 0,
    cssHeight: 0,
    dpr: 1,
    tooltipEl: null,
    drag: null,         // active pan-drag: { startX, startY, initPanX, initPanY, moved }
    suppressNextClick: false,
  };

  // ─── DOM helpers ───────────────────────────────────────────────────────

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

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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

  function formatMass(kg) {
    if (kg < 1000)  return kg.toFixed(0) + " kg";
    if (kg < 1e6)  return (kg / 1000).toFixed(1) + " t";
    return (kg / 1e6).toFixed(2) + " kt";
  }

  // ─── tiny djb2 over a Uint8Array (parallels save-inspector.js) ─────────

  function djb2Bytes(bytes) {
    let h = 5381;
    const N = bytes.length;
    const chunks = [];
    chunks.push([0, Math.min(N, 65536)]);
    if (N > 200000) {
      const mid = Math.floor(N / 2);
      chunks.push([mid - 32768, mid + 32768]);
    }
    if (N > 131072) chunks.push([Math.max(0, N - 65536), N]);
    for (const [lo, hi] of chunks) {
      for (let i = lo; i < hi; i++) h = ((h << 5) + h + bytes[i]) | 0;
    }
    h = ((h << 5) + h + (N | 0)) | 0;
    return (h >>> 0).toString(16).padStart(8, "0");
  }

  // ─── header / picker ───────────────────────────────────────────────────

  function buildPicker(root) {
    const fileInput = el("input", {
      type: "file", id: "save-upload", accept: ".zip,application/zip,application/x-zip-compressed",
      class: "ship-upload",
    });
    fileInput.addEventListener("change", () => onSaveChosen(fileInput));

    const uploadLabel = el("label", { class: "ship-upload-label", for: "save-upload" }, [
      "Upload your save zip",
    ]);

    const filler = el("span"); // grid-col-1 placeholder so upload sits in col-2

    const privacy = el("p", {
      class: "ship-privacy",
      text: "Stays in your browser, nothing sent to a server. " +
        "Decompressing every ship to read positions takes a few seconds.",
    });

    const summary = el("p", {
      id: "save-summary", class: "save-summary",
      style: "display:none",
    });

    const links = el("p", { class: "ship-links" }, [
      el("a", { href: "save-inspector.html", text: "→ Save inspector (drill into one ship)" }),
      "  ",
      el("a", { href: "ship-inspector.html", text: "→ Ship inspector (vanilla ships)" }),
      "  ",
      el("a", { href: "rooms-reference.html", text: "→ Rooms reference" }),
    ]);

    const clearBtn = el("button", {
      type: "button", class: "clear-ship-btn", id: "clear-save-btn",
      text: "← Clear save",
      onclick: clearSave,
    });

    root.appendChild(el("div", { class: "ship-picker" }, [
      filler,
      uploadLabel,
      fileInput,
      summary,
      privacy,
      links,
      clearBtn,
    ]));

    // Empty-state hint shown until a save is loaded.
    root.appendChild(el("div", { class: "empty-hint", id: "empty-hint" }, [
      el("p", { html:
        "<strong>No save loaded.</strong> Upload an Ostranauts save zip " +
        "(<code>&lt;name&gt;_&lt;epoch&gt;.zip</code>) to plot every ship's " +
        "<code>objSS</code> position in this system." }),
      el("p", { class: "small muted", text:
        "Personal pods and station hulks share the same canvas. Icon area " +
        "is proportional to mass (sqrt-scaled), and blue means you've been " +
        "aboard at least once (fLastVisit > 0) — gray means you haven't." }),
    ]));
  }

  function setSummary(text, asHtml) {
    const summary = document.getElementById("save-summary");
    if (!summary) return;
    summary.style.display = text ? "" : "none";
    if (asHtml) summary.innerHTML = text;
    else summary.textContent = text;
  }

  function clearSave() {
    STATE.saveName = null;
    STATE.saveHash = null;
    STATE.shipEntries = [];
    STATE.ships = [];
    STATE.bounds = null;
    STATE.hoveredReg = null;
    STATE.selectedReg = null;
    STATE.selectedStack = null;
    resetView();
    const fileInput = document.getElementById("save-upload");
    if (fileInput) fileInput.value = "";
    setSummary("");
    uploadError("");
    hideMap();
    setEmptyState(true);
  }

  function setEmptyState(empty) {
    const root = document.getElementById("map-root");
    if (root) root.classList.toggle("is-empty", !!empty);
  }

  // ─── zip upload + ship list ────────────────────────────────────────────

  async function onSaveChosen(input) {
    const file = input.files && input.files[0];
    if (!file) return;

    uploadError("");
    setSummary(`Reading ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)…`);

    let bytes;
    try {
      bytes = new Uint8Array(await file.arrayBuffer());
    } catch (e) {
      uploadError("Could not read file: " + e.message);
      input.value = "";
      setSummary("");
      return;
    }

    let entries;
    try {
      entries = await window.SaveZipReader.readEntries(bytes);
    } catch (e) {
      uploadError("Not a valid ZIP: " + e.message);
      input.value = "";
      setSummary("");
      return;
    }

    const shipEntries = entries.filter((e) => /^ships\/[^/]+\.json$/.test(e.name));
    if (shipEntries.length === 0) {
      uploadError("This zip has no ships/<reg>.json entries.");
      input.value = "";
      setSummary("");
      return;
    }

    STATE.saveHash = djb2Bytes(bytes);
    STATE.saveName = file.name.replace(/\.zip$/i, "");
    STATE.shipEntries = shipEntries;
    STATE.ships = [];
    STATE.bounds = null;
    STATE.hoveredReg = null;
    STATE.selectedReg = null;
    resetView();

    // Pull save metadata from the bundled saveInfo.json — same approach
    // as save-inspector, kept independent so this page is standalone.
    let savePlayer = null, saveShipName = null, saveVersion = null;
    try {
      const infoEntry = entries.find((e) => e.name === "saveInfo.json");
      if (infoEntry) {
        const text = await infoEntry.getText();
        const parsed = JSON.parse(text);
        const info = Array.isArray(parsed) ? parsed[0] : parsed;
        if (info) {
          savePlayer    = info.playerName || null;
          saveShipName  = info.shipName   || null;
          saveVersion   = info.version    || null;
        }
      }
    } catch (e) { /* non-fatal */ }

    const summaryParts = [`<strong>${escapeHtml(STATE.saveName)}</strong>`,
      `${shipEntries.length} ship${shipEntries.length === 1 ? "" : "s"}`];
    if (savePlayer)   summaryParts.push(`player <strong>${escapeHtml(savePlayer)}</strong>`);
    if (saveShipName) summaryParts.push(`flagship <strong>${escapeHtml(saveShipName)}</strong>`);
    if (saveVersion)  summaryParts.push(`<code>${escapeHtml(saveVersion)}</code>`);

    setSummary(summaryParts.join(" · "), /*asHtml*/ true);
    setEmptyState(false);
    buildMap();
    showMapProgress(0, shipEntries.length);
    await loadAllShips(shipEntries);
  }

  // Parses each ship's JSON in parallel batches (4 at a time), extracting
  // the small subset of fields the map needs and discarding the rest.
  async function loadAllShips(shipEntries) {
    let done = 0;
    const total = shipEntries.length;
    const results = new Array(total);
    let cursor = 0;

    async function worker() {
      while (true) {
        const idx = cursor++;
        if (idx >= total) return;
        const entry = shipEntries[idx];
        try {
          const text = await entry.getText();
          const parsed = JSON.parse(text);
          const ship = extractMeta(parsed);
          if (ship) results[idx] = ship;
        } catch (e) {
          console.warn(`save-map: failed to parse ${entry.name}: ${e.message}`);
        }
        done++;
        if (done % 4 === 0 || done === total) {
          showMapProgress(done, total);
          // Re-render every batch so the map fills in visibly while loading.
          STATE.ships = results.filter(Boolean);
          recomputeBounds();
          renderMap();
        }
      }
    }

    await Promise.all(
      Array.from({ length: Math.min(PARALLEL_DECOMPRESS, total) }, () => worker())
    );

    STATE.ships = results.filter(Boolean);
    recomputeBounds();
    showMapProgress(total, total, /*done*/ true);
    renderMap();
  }

  function extractMeta(parsed) {
    const d = Array.isArray(parsed) ? parsed[0] : parsed;
    if (!d || typeof d !== "object") return null;
    const ss = d.objSS;
    if (!ss || typeof ss.vPosx !== "number" || typeof ss.vPosy !== "number") return null;
    return {
      reg: d.strRegID || d.strName || "(unknown)",
      strName: d.strName || null,
      publicName: d.publicName || null,
      designation: d.designation || null,
      make: d.make || null,
      model: d.model || null,
      dimensions: d.dimensions || null,
      mass: typeof d.fShallowMass === "number" ? d.fShallowMass : 0,
      lastVisit: typeof d.fLastVisit === "number" ? d.fLastVisit : 0,
      firstVisit: typeof d.fFirstVisit === "number" ? d.fFirstVisit : 0,
      bAIShip: !!d.bAIShip,
      x: ss.vPosx,
      y: ss.vPosy,
      body: ss.boPORShip || null,
    };
  }

  // ─── map canvas ────────────────────────────────────────────────────────

  function buildMap() {
    const root = document.getElementById("map-root");
    if (document.getElementById("map-section")) return;  // already built

    const section = el("section", { class: "section map-section", id: "map-section" });

    section.appendChild(el("div", { class: "map-progress", id: "map-progress", text: "" }));

    const legend = el("div", { class: "map-legend" }, [
      el("span", {}, [
        el("span", { class: "map-legend-dot", style: `background:${COLOR_VISITED}` }),
        "visited (fLastVisit > 0)",
      ]),
      el("span", {}, [
        el("span", { class: "map-legend-dot", style: `background:${COLOR_UNVISITED}` }),
        "not visited",
      ]),
      el("span", { class: "muted small",
        text: "Icon area ∝ √(fShallowMass). Y axis flipped to match the in-game star map. " +
          "Drag to pan, scroll to zoom (around the cursor). Ships docked at the same body stack into one dot — hover to see the list, click to lock and drill in." }),
    ]);
    section.appendChild(legend);

    const wrap = el("div", { class: "map-canvas-wrap", id: "map-canvas-wrap" });
    const canvas = el("canvas", { class: "map-canvas", id: "map-canvas" });
    wrap.appendChild(canvas);

    // Zoom controls overlay (top-right). Buttons rather than a slider —
    // the wheel handles fine-grained zoom; these are for when the modder
    // is on a trackpad, can't easily wheel, or just wants the reset.
    const zoomCtl = el("div", { class: "map-zoom-controls", id: "map-zoom-controls" }, [
      el("button", {
        type: "button", class: "map-zoom-btn", title: "Zoom in",
        text: "+",
        onclick: () => zoomBy(ZOOM_BUTTON_FACTOR),
      }),
      el("button", {
        type: "button", class: "map-zoom-btn", title: "Zoom out",
        text: "−",
        onclick: () => zoomBy(1 / ZOOM_BUTTON_FACTOR),
      }),
      el("button", {
        type: "button", class: "map-zoom-btn", title: "Reset view",
        text: "⟲",
        onclick: () => { resetView(); renderMap(); },
      }),
    ]);
    wrap.appendChild(zoomCtl);

    const tooltip = el("div", { class: "map-tooltip", id: "map-tooltip", style: "display:none" });
    wrap.appendChild(tooltip);

    section.appendChild(wrap);
    section.appendChild(el("div", { class: "map-selected", id: "map-selected" }));

    root.appendChild(section);

    STATE.canvas = canvas;
    STATE.ctx = canvas.getContext("2d");
    STATE.tooltipEl = tooltip;

    canvas.addEventListener("mousemove", onCanvasMouseMove);
    canvas.addEventListener("mouseleave", onCanvasMouseLeave);
    canvas.addEventListener("click", onCanvasClick);
    canvas.addEventListener("mousedown", onCanvasMouseDown);
    canvas.addEventListener("wheel", onCanvasWheel, { passive: false });
    // Pan-drag must continue tracking even if the mouse leaves the canvas.
    document.addEventListener("mousemove", onDocumentMouseMove);
    document.addEventListener("mouseup", onDocumentMouseUp);
    window.addEventListener("resize", onResize);

    sizeCanvas();
  }

  // Zoom centered on the canvas center (from the +/- buttons).
  function zoomBy(factor) {
    if (!STATE.canvas) return;
    applyZoomAtPoint(factor, STATE.cssWidth / 2, STATE.cssHeight / 2);
    renderMap();
  }

  function hideMap() {
    const sec = document.getElementById("map-section");
    if (sec) sec.remove();
    STATE.canvas = null;
    STATE.ctx = null;
    STATE.tooltipEl = null;
  }

  function sizeCanvas() {
    if (!STATE.canvas) return;
    const wrap = document.getElementById("map-canvas-wrap");
    const cssWidth = wrap.clientWidth || 800;
    // Aspect: prefer 1:1 (world units are AU-ish, so a square map is honest),
    // capped by a viewport-relative max so it doesn't push the page absurdly.
    const cssHeight = Math.min(cssWidth, Math.max(420, Math.floor(window.innerHeight * 0.62)));
    const dpr = window.devicePixelRatio || 1;

    STATE.cssWidth = cssWidth;
    STATE.cssHeight = cssHeight;
    STATE.dpr = dpr;

    STATE.canvas.width = Math.round(cssWidth * dpr);
    STATE.canvas.height = Math.round(cssHeight * dpr);
    STATE.canvas.style.width = cssWidth + "px";
    STATE.canvas.style.height = cssHeight + "px";

    STATE.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    recomputeTransform();
  }

  function recomputeBounds() {
    if (!STATE.ships.length) { STATE.bounds = null; return; }
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const s of STATE.ships) {
      if (s.x < minX) minX = s.x;
      if (s.x > maxX) maxX = s.x;
      if (s.y < minY) minY = s.y;
      if (s.y > maxY) maxY = s.y;
    }
    STATE.bounds = { minX, maxX, minY, maxY };
    recomputeTransform();
  }

  // (Earlier revisions clustered nearby ships with a phyllotaxis spiral
  // to "spread out" stations and their docked craft. That hid the data:
  // the spread was synthetic, not in the save file. Now we plot each
  // ship at its raw `vPos`. Overlapping icons just stack — the multi-
  // hit code in findShipsAtCanvasPx() lets the modder hover/click any
  // stack and see every ship at that pixel.)

  function recomputeTransform() {
    const b = STATE.bounds;
    if (!b || !STATE.cssWidth || !STATE.cssHeight) { STATE.transform = null; return; }
    const dx = Math.max(1e-9, b.maxX - b.minX);
    const dy = Math.max(1e-9, b.maxY - b.minY);
    const availW = STATE.cssWidth  - 2 * CANVAS_PADDING_PX;
    const availH = STATE.cssHeight - 2 * CANVAS_PADDING_PX;
    // Uniform scale (don't distort the system geometry).
    const scale = Math.min(availW / dx, availH / dy);
    const cxWorld = (b.minX + b.maxX) / 2;
    const cyWorld = (b.minY + b.maxY) / 2;
    STATE.transform = {
      scale,
      offsetX: STATE.cssWidth  / 2 - cxWorld * scale,
      // Note: canvas Y grows downward; world (in-game) Y typically grows
      // upward. Negate the Y component of the transform so the map
      // matches the orientation a player sees on the in-game star map.
      offsetY: STATE.cssHeight / 2 + cyWorld * scale,
      flipY: true,
    };
  }

  // Maps a world (vPosx, vPosy) point to the auto-fit canvas position.
  // Use shipScreen() to also include user zoom/pan + cluster spiral offset.
  function worldToAutoFitCanvas(wx, wy) {
    const t = STATE.transform;
    return {
      x: wx * t.scale + t.offsetX,
      y: -wy * t.scale + t.offsetY,
    };
  }

  // Apply user zoom/pan to an auto-fit canvas position (or any other
  // canvas-pixel position that should follow the view transform, like
  // the per-ship spiral offsets).
  function applyView(ax, ay) {
    const cx = STATE.cssWidth / 2;
    const cy = STATE.cssHeight / 2;
    return {
      x: (ax - cx) * STATE.viewZoom + cx + STATE.viewPanX,
      y: (ay - cy) * STATE.viewZoom + cy + STATE.viewPanY,
    };
  }

  // Inverse of applyView — convert a viewport canvas-px point back to
  // its auto-fit canvas-px position.
  function unapplyView(vx, vy) {
    const cx = STATE.cssWidth / 2;
    const cy = STATE.cssHeight / 2;
    return {
      x: (vx - cx - STATE.viewPanX) / STATE.viewZoom + cx,
      y: (vy - cy - STATE.viewPanY) / STATE.viewZoom + cy,
    };
  }

  // The on-screen canvas position for a ship — autoFit then view.
  function shipScreen(s) {
    const auto = worldToAutoFitCanvas(s.x, s.y);
    return applyView(auto.x, auto.y);
  }

  // ─── view (zoom + pan) ─────────────────────────────────────────────────

  function clampZoom(z) {
    return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));
  }

  // Zoom around a viewport pixel (canvasX, canvasY) so the world point
  // currently under that pixel stays under it after zoom.
  function applyZoomAtPoint(factor, canvasX, canvasY) {
    if (!STATE.transform) return;
    const newZoom = clampZoom(STATE.viewZoom * factor);
    if (newZoom === STATE.viewZoom) return;
    // The autoFit position currently under the cursor:
    const auto = unapplyView(canvasX, canvasY);
    STATE.viewZoom = newZoom;
    // Re-pin: viewPan such that applyView(auto.x, auto.y) === (canvasX, canvasY).
    const cx = STATE.cssWidth / 2;
    const cy = STATE.cssHeight / 2;
    STATE.viewPanX = canvasX - (auto.x - cx) * STATE.viewZoom - cx;
    STATE.viewPanY = canvasY - (auto.y - cy) * STATE.viewZoom - cy;
  }

  function resetView() {
    STATE.viewZoom = 1;
    STATE.viewPanX = 0;
    STATE.viewPanY = 0;
  }

  function radiusForMass(mass) {
    if (!mass || mass <= 0) return RADIUS_MIN;
    // sqrt scaling: a 132 t station vs a 1 t pod is ~11× area, not 130×.
    const r = Math.sqrt(mass / 100) * 0.45 + 2;
    return Math.max(RADIUS_MIN, Math.min(RADIUS_MAX, r));
  }

  function colorForShip(ship, dim) {
    if (ship.lastVisit > 0) return dim ? COLOR_VISITED_DIM : COLOR_VISITED;
    return COLOR_UNVISITED;
  }

  function renderMap() {
    if (!STATE.ctx || !STATE.transform) return;
    const ctx = STATE.ctx;

    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, STATE.cssWidth, STATE.cssHeight);

    // Draw an axes hint — a faint cross at the bounds origin so the
    // viewer has some sense of scale. Don't overdo it.
    drawScaleHint(ctx);

    // Stable draw order: unvisited first, visited on top so the
    // "interesting" ones aren't occluded by background traffic.
    const order = STATE.ships.slice().sort((a, b) => {
      const va = a.lastVisit > 0 ? 1 : 0;
      const vb = b.lastVisit > 0 ? 1 : 0;
      if (va !== vb) return va - vb;
      // For same visit-state, smaller-mass on top so big stations don't
      // hide tiny pods that happen to share their tile.
      return b.mass - a.mass;
    });

    const hovered = STATE.hoveredReg;
    const selected = STATE.selectedReg;

    for (const s of order) {
      const screen = shipScreen(s);
      const px = screen.x;
      const py = screen.y;
      const r = radiusForMass(s.mass);
      const isHover = hovered === s.reg;
      const isSel   = selected === s.reg;

      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = colorForShip(s, /*dim*/ false);
      ctx.fill();

      if (isSel || isHover) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = isSel ? "#ffffff" : "#d6e3ee";
        ctx.stroke();
      }
    }
  }

  function drawScaleHint(ctx) {
    const b = STATE.bounds;
    if (!b) return;
    const dx = b.maxX - b.minX;
    const dy = b.maxY - b.minY;
    const span = Math.max(dx, dy);
    if (span <= 0) return;
    // Effective scale = autoFit scale * user view zoom.
    const effScale = STATE.transform.scale * STATE.viewZoom;
    // Pick a "nice" round number whose pixel-width is ~150 px on screen,
    // adapting as the user zooms in.
    const targetPx = 150;
    const target = targetPx / effScale;
    const mag = Math.pow(10, Math.floor(Math.log10(target)));
    let tick = mag;
    if (target / mag >= 5) tick = mag * 5;
    else if (target / mag >= 2) tick = mag * 2;

    const tickPx = tick * effScale;

    ctx.strokeStyle = "rgba(150,160,170,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(CANVAS_PADDING_PX, STATE.cssHeight - 18);
    ctx.lineTo(CANVAS_PADDING_PX + tickPx, STATE.cssHeight - 18);
    ctx.stroke();

    ctx.fillStyle = "rgba(180,190,200,0.6)";
    ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    let label;
    if (tick >= 1) label = `${tick.toFixed(tick >= 10 ? 0 : 1)} AU-ish`;
    else if (tick >= 0.001) label = `${(tick * 1000).toFixed(tick * 1000 >= 10 ? 0 : 1)} milli-AU`;
    else label = `${(tick * 1e6).toFixed(0)} micro-AU`;
    ctx.fillText(label, CANVAS_PADDING_PX, STATE.cssHeight - 22);

    // Show current zoom multiplier in the corner if it's not 1×.
    if (STATE.viewZoom !== 1) {
      ctx.fillText(`${STATE.viewZoom.toFixed(2)}× zoom`,
        STATE.cssWidth - 96, STATE.cssHeight - 22);
    }
  }

  // ─── hit testing + tooltip ─────────────────────────────────────────────

  // Find every ship whose icon overlaps the cursor pixel, sorted by
  // distance from the cursor. When ships share a `vPos` (a station and
  // everything docked at it), or just visually overlap at the current
  // zoom level, the array length is > 1 and the UI surfaces all of them
  // via the stack list. The closest match is `hits[0]` for backward
  // compatibility with single-target callers.
  function findShipsAtCanvasPx(px, py) {
    if (!STATE.transform) return [];
    const hits = [];
    for (const s of STATE.ships) {
      const screen = shipScreen(s);
      const dx = screen.x - px, dy = screen.y - py;
      const distSq = dx * dx + dy * dy;
      const r = radiusForMass(s.mass) + 3;  // +3 so tiny icons are still clickable
      if (distSq <= r * r) hits.push({ s, distSq });
    }
    hits.sort((a, b) => a.distSq - b.distSq);
    return hits.map((h) => h.s);
  }

  function onCanvasMouseMove(evt) {
    if (STATE.drag) return;  // pan-drag handled at document-level
    const rect = STATE.canvas.getBoundingClientRect();
    const cx = evt.clientX - rect.left;
    const cy = evt.clientY - rect.top;
    const hits = findShipsAtCanvasPx(cx, cy);
    const newHover = hits.length ? hits[0].reg : null;
    if (newHover !== STATE.hoveredReg) {
      STATE.hoveredReg = newHover;
      renderMap();
    }
    if (hits.length) showTooltip(hits, cx, cy);
    else hideTooltip();
  }

  function onCanvasMouseLeave() {
    if (STATE.drag) return;  // keep hover state during a drag
    if (STATE.hoveredReg) {
      STATE.hoveredReg = null;
      renderMap();
    }
    hideTooltip();
  }

  function onCanvasClick(evt) {
    if (STATE.suppressNextClick) {
      STATE.suppressNextClick = false;
      return;
    }
    const rect = STATE.canvas.getBoundingClientRect();
    const hits = findShipsAtCanvasPx(evt.clientX - rect.left, evt.clientY - rect.top);
    if (!hits.length) {
      // Clicking empty space clears the lock.
      if (STATE.selectedReg) {
        STATE.selectedReg = null;
        STATE.selectedStack = null;
        hideSelection();
        renderMap();
      }
      return;
    }
    STATE.selectedReg = hits[0].reg;
    STATE.selectedStack = hits;
    showSelection(hits, hits[0]);
    renderMap();
  }

  function onCanvasMouseDown(evt) {
    if (evt.button !== 0) return;  // left-button only
    STATE.drag = {
      startX: evt.clientX,
      startY: evt.clientY,
      initPanX: STATE.viewPanX,
      initPanY: STATE.viewPanY,
      moved: false,
    };
  }

  function onDocumentMouseMove(evt) {
    const drag = STATE.drag;
    if (!drag) return;
    const dx = evt.clientX - drag.startX;
    const dy = evt.clientY - drag.startY;
    if (!drag.moved && (dx * dx + dy * dy) > DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
      drag.moved = true;
      if (STATE.canvas) STATE.canvas.style.cursor = "grabbing";
      hideTooltip();
    }
    if (drag.moved) {
      STATE.viewPanX = drag.initPanX + dx;
      STATE.viewPanY = drag.initPanY + dy;
      renderMap();
    }
  }

  function onDocumentMouseUp() {
    const drag = STATE.drag;
    if (!drag) return;
    STATE.drag = null;
    if (STATE.canvas) STATE.canvas.style.cursor = "";
    if (drag.moved) {
      // Eat the click that fires on mouseup so a pan doesn't also select
      // a ship under the cursor.
      STATE.suppressNextClick = true;
    }
  }

  function onCanvasWheel(evt) {
    // preventDefault keeps the page from scrolling when the modder spins
    // the wheel on the canvas; we'd rather they zoom the map.
    evt.preventDefault();
    if (!STATE.canvas) return;
    const rect = STATE.canvas.getBoundingClientRect();
    const cx = evt.clientX - rect.left;
    const cy = evt.clientY - rect.top;
    const factor = evt.deltaY < 0 ? ZOOM_WHEEL_FACTOR : 1 / ZOOM_WHEEL_FACTOR;
    applyZoomAtPoint(factor, cx, cy);
    renderMap();
    // Re-evaluate hover at the same screen pixel after zoom.
    onCanvasMouseMove(evt);
  }

  function onResize() {
    if (!STATE.canvas) return;
    sizeCanvas();
    renderMap();
  }

  function showTooltip(hits, cx, cy) {
    if (!STATE.tooltipEl) return;
    STATE.tooltipEl.innerHTML = hits.length > 1
      ? tooltipStackHtml(hits)
      : tooltipSingleHtml(hits[0]);
    STATE.tooltipEl.style.display = "block";
    // Position with offset, clamp to canvas wrap so it doesn't push the page.
    const wrap = document.getElementById("map-canvas-wrap");
    const wrapRect = wrap.getBoundingClientRect();
    const ttRect = STATE.tooltipEl.getBoundingClientRect();
    let left = cx + 14;
    let top  = cy + 14;
    if (left + ttRect.width  > wrapRect.width)  left = cx - ttRect.width  - 14;
    if (top  + ttRect.height > wrapRect.height) top  = cy - ttRect.height - 14;
    STATE.tooltipEl.style.left = Math.max(0, left) + "px";
    STATE.tooltipEl.style.top  = Math.max(0, top)  + "px";
  }

  function hideTooltip() {
    if (STATE.tooltipEl) STATE.tooltipEl.style.display = "none";
  }

  function tooltipSingleHtml(ship) {
    const visited = ship.lastVisit > 0;
    const lines = [];
    const headline = ship.publicName || ship.strName || ship.reg;
    lines.push(`<strong>${escapeHtml(headline)}</strong>`);
    lines.push(`<span class="reg">${escapeHtml(ship.reg)}</span>` +
      (ship.designation ? ` · ${escapeHtml(ship.designation)}` : ""));
    const makeModel = [ship.make, ship.model].filter(Boolean).join(" ");
    if (makeModel) lines.push(`<div class="meta">${escapeHtml(makeModel)}</div>`);
    const massStr = ship.mass ? formatMass(ship.mass) : "?";
    lines.push(`<div class="meta">mass ${escapeHtml(massStr)}` +
      (ship.body ? ` · orbiting <strong>${escapeHtml(ship.body)}</strong>` : "") +
      `</div>`);
    lines.push(`<div class="meta">${visited ? "visited" : "not visited"}` +
      (ship.bAIShip ? " · AI ship" : "") + `</div>`);
    return lines.join("");
  }

  // Stack-style tooltip: a header + up to STACK_LIST_LIMIT rows of
  // (regID, mass, visited dot) + "+ N others" if the stack is larger.
  // Triggered when two or more ship icons overlap the cursor pixel —
  // either because they share a `vPos` (station and its docked craft)
  // or just because they're packed too close to resolve at this zoom.
  function tooltipStackHtml(hits) {
    const shown = hits.slice(0, STACK_LIST_LIMIT);
    const extra = hits.length - shown.length;
    const headBody = mostCommonBody(hits);
    const rows = shown.map((s) => {
      const visited = s.lastVisit > 0;
      const dot = `<span class="stack-dot${visited ? " v" : ""}"></span>`;
      const massStr = s.mass ? formatMass(s.mass) : "—";
      const name = escapeHtml(s.publicName || s.strName || s.reg);
      return `<div class="stack-row">` +
        dot +
        `<span class="reg">${escapeHtml(s.reg)}</span> ` +
        `<span class="stack-name">${name}</span> ` +
        `<span class="stack-mass">${escapeHtml(massStr)}</span>` +
        `</div>`;
    }).join("");
    const head = `<strong>${hits.length} ships at this pixel</strong>` +
      (headBody ? ` <span class="meta">· near <strong>${escapeHtml(headBody)}</strong></span>` : "");
    const more = extra > 0
      ? `<div class="meta stack-more">+ ${extra} other${extra === 1 ? "" : "s"} — click to see full list</div>`
      : `<div class="meta stack-more">click to lock + drill in</div>`;
    return head + rows + more;
  }

  // Pick the most common boPORShip across a stack of ships. Used as a
  // soft "this is K-Leg / 1036 Ganymed / Sol" label on stack tooltips
  // when most members of the stack agree on a parent body.
  function mostCommonBody(hits) {
    const counts = new Map();
    for (const s of hits) {
      if (!s.body) continue;
      counts.set(s.body, (counts.get(s.body) || 0) + 1);
    }
    let best = null, bestN = 0;
    for (const [body, n] of counts) {
      if (n > bestN) { best = body; bestN = n; }
    }
    return best;
  }

  // Render the selection panel. `stack` is every ship at the clicked
  // pixel (sorted closest-first). `active` is the one whose details are
  // shown in full; defaults to stack[0]. When stack.length > 1, render
  // a clickable list of all stack members above the active ship's
  // details. The active swap is purely client-side — no re-fetching.
  function showSelection(stack, active) {
    const panel = document.getElementById("map-selected");
    if (!panel) return;
    active = active || stack[0];
    STATE.selectedReg = active.reg;
    STATE.selectedStack = stack;

    panel.innerHTML = "";
    panel.classList.add("is-active");

    if (stack.length > 1) {
      const headBody = mostCommonBody(stack);
      const stackHead = el("div", { class: "stack-list-head" }, [
        el("strong", { text: `${stack.length} ships at this pixel` }),
        headBody
          ? el("span", { class: "meta", html: " · near <strong>" + escapeHtml(headBody) + "</strong>" })
          : null,
      ]);
      panel.appendChild(stackHead);

      const list = el("div", { class: "stack-list" });
      for (const s of stack) {
        const isActive = s.reg === active.reg;
        const visited = s.lastVisit > 0;
        const row = el("button", {
          type: "button",
          class: "stack-list-row" + (isActive ? " is-active" : ""),
          onclick: () => showSelection(stack, s),
        }, [
          el("span", { class: "stack-dot" + (visited ? " v" : "") }),
          el("code", { class: "reg", text: s.reg }),
          el("span", { class: "stack-name", text: s.publicName || s.strName || s.reg }),
          el("span", { class: "stack-mass", text: s.mass ? formatMass(s.mass) : "—" }),
        ]);
        list.appendChild(row);
      }
      panel.appendChild(list);
    }

    const visited = active.lastVisit > 0;
    const massStr = active.mass ? formatMass(active.mass) : "—";
    const visitStr = visited
      ? `epoch ${active.lastVisit.toFixed(1)} (first ${active.firstVisit.toFixed(1)})`
      : "never";

    const headline = active.publicName || active.strName || active.reg;
    panel.appendChild(el("h3", {}, [
      el("span", { text: headline }),
      " ",
      el("code", { class: "reg", text: active.reg }),
    ]));

    const dl = el("dl", {});
    function row(k, v, isProse) {
      if (v == null || v === "") return;
      dl.appendChild(el("dt", { text: k }));
      dl.appendChild(el("dd", { class: isProse ? "prose" : null, text: v }));
    }
    row("Strname",     active.strName);
    row("Designation", active.designation, true);
    row("Make",        active.make, true);
    row("Model",       active.model, true);
    row("Dimensions",  active.dimensions);
    row("Mass",        massStr);
    row("Orbit body",  active.body);
    row("Position",    `${active.x.toFixed(8)}, ${active.y.toFixed(8)}`);
    row("Visited",     visitStr);
    row("AI ship",     active.bAIShip ? "yes" : "no");
    panel.appendChild(dl);

    const link = el("a", {
      class: "deep-link",
      href: "save-inspector.html#/ship/" + encodeURIComponent(active.reg),
      text: "→ Open " + active.reg + " in save inspector",
      title: "You'll need to re-upload the same save zip on the save inspector page — " +
        "your per-ship state is preserved by save+ship key.",
    });
    panel.appendChild(link);
  }

  function hideSelection() {
    const panel = document.getElementById("map-selected");
    if (panel) { panel.classList.remove("is-active"); panel.innerHTML = ""; }
  }

  function showMapProgress(done, total, finished) {
    const el = document.getElementById("map-progress");
    if (!el) return;
    if (finished) {
      const visited = STATE.ships.filter((s) => s.lastVisit > 0).length;
      el.textContent =
        `${STATE.ships.length} ships plotted · ${visited} visited, ${STATE.ships.length - visited} not.`;
    } else {
      el.textContent = `Decompressing ships: ${done} / ${total}…`;
    }
  }

  // ─── boot ──────────────────────────────────────────────────────────────

  function boot() {
    const main = document.getElementById("map-root");
    if (!main) {
      console.error("save-map: missing #map-root");
      return;
    }
    if (typeof DecompressionStream === "undefined") {
      main.appendChild(el("p", {
        class: "upload-error",
        style: "display:block",
        text: "This browser doesn't support DecompressionStream. Use a recent " +
          "Chrome, Firefox, or Safari (113+ / 113+ / 16.4+) to read save zips.",
      }));
      return;
    }
    buildPicker(main);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
