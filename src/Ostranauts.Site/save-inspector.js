// save-inspector.js — picker + boot for the save inspector page.
//
// Audience: modders inspecting the ships inside an Ostranauts save zip
// (the <name>_<epoch>.zip file the game writes to Saves/<name>_<epoch>/).
// The save-format per-ship JSON is a runtime superset of
// data/ships/<reg>.json — same aItems[]/aRooms[] plus extras like
// aCondOverrides[] (per-item damage). The shared inspector-core renders
// it identically; this module only owns the zip parse + per-save ship
// dropdown.
//
// Inputs (all loaded as <script src> globals — no fetch, runs from file://):
//   * window.SHIP_FRIENDLY_NAMES       — { strName: strNameFriendly }
//   * window.ROOMS, window.renderRoomCard — from rooms.js
//   * window.InspectorCore             — from inspector-core.js
//   * window.SaveZipReader             — from save-zip-reader.js
//
// localStorage keys (under "save-inspector:" prefix):
//   counts:<key>                 { strName: built-count }     (managed by core)
//   pinned-specs:<key>           [ "<room-spec-name>", ... ]  (managed by core)
//   bucket-filters               { walls: true, ... }         (managed by core)
//
// Active-save key shape: "<saveHash>:<shipReg>" — two saves with the same
// ship reg get isolated checkbox state. The zip itself is NOT persisted
// across reloads (way too big for localStorage); the modder must re-upload.
// Re-uploading the same save bytes produces the same djb2 hash, so the
// per-ship state comes back.

(function () {
  "use strict";

  const LS_PREFIX = "save-inspector:";

  const STATE = {
    saveHash: null,            // djb2 of zip bytes
    saveName: null,            // display name for the loaded save
    shipEntries: [],           // [{ reg, name, getText }] from the zip
    shipCache: new Map(),      // reg → parsed ship dict
    activeReg: null,
  };

  // ─── tiny djb2 over a Uint8Array (parallels InspectorCore.djb2 for str) ─

  function djb2Bytes(bytes) {
    let h = 5381;
    // The save zip is potentially 50+ MB. Hash sample: first 64KB +
    // middle 64KB + last 64KB. djb2 over the full file is fine
    // performance-wise but eats memory pressure for nothing — sample is
    // enough for "is this the same file?" identity.
    const chunks = [];
    const N = bytes.length;
    chunks.push([0, Math.min(N, 65536)]);
    if (N > 200000) {
      const mid = Math.floor(N / 2);
      chunks.push([mid - 32768, mid + 32768]);
    }
    if (N > 131072) chunks.push([Math.max(0, N - 65536), N]);
    for (const [lo, hi] of chunks) {
      for (let i = lo; i < hi; i++) h = ((h << 5) + h + bytes[i]) | 0;
    }
    // Mix in the length too so trivially-different files of the same head
    // don't collide.
    h = ((h << 5) + h + (N | 0)) | 0;
    return (h >>> 0).toString(16).padStart(8, "0");
  }

  // ─── header / picker ───────────────────────────────────────────────────

  function buildPicker(root) {
    const Core = window.InspectorCore;

    const select = Core.el("select", { id: "ship-select", class: "ship-select", disabled: "" });
    select.appendChild(Core.el("option", { value: "", text: "— upload a save zip first —" }));
    select.addEventListener("change", () => {
      const reg = select.value;
      if (!reg) return;
      loadShipFromSave(reg);
    });

    const fileInput = Core.el("input", {
      type: "file", id: "save-upload", accept: ".zip,application/zip,application/x-zip-compressed",
      class: "ship-upload",
    });
    fileInput.addEventListener("change", () => onSaveChosen(fileInput));

    const uploadLabel = Core.el("label", { class: "ship-upload-label", for: "save-upload" }, [
      "Upload your save zip",
    ]);

    const privacy = Core.el("p", {
      class: "ship-privacy",
      text: "Stays in your browser, nothing sent to a server. The zip is not " +
        "persisted across reloads — but your checkbox state is.",
    });

    const summary = Core.el("p", {
      id: "save-summary", class: "save-summary",
      style: "display:none",
    });

    const links = Core.el("p", { class: "ship-links" }, [
      Core.el("a", { href: "save-map.html", text: "→ Save map (positions of all ships)" }),
      "  ",
      Core.el("a", { href: "ship-inspector.html", text: "→ Ship inspector (vanilla ships)" }),
      "  ",
      Core.el("a", { href: "rooms-reference.html", text: "→ Rooms reference" }),
      "  ",
      Core.el("a", { href: "data/id-friendly-names.json", text: "→ ID-to-friendly-name JSON" }),
    ]);

    const clearBtn = Core.el("button", {
      type: "button", class: "clear-ship-btn", id: "clear-ship-btn",
      text: "← Clear save",
      onclick: clearSave,
    });

    root.appendChild(Core.el("div", { class: "ship-picker" }, [
      select,
      uploadLabel,
      fileInput,
      summary,
      privacy,
      links,
      clearBtn,
    ]));

    // Persistent empty-state hint.
    root.appendChild(Core.el("div", { class: "empty-hint", id: "empty-hint" }, [
      Core.el("p", { html:
        "<strong>No save loaded.</strong> Upload an Ostranauts save zip to " +
        "see the list of ships inside it. The zip file is the " +
        "<code>&lt;name&gt;_&lt;epoch&gt;.zip</code> next to the " +
        "<code>saveInfo.json</code>/<code>screenshot.png</code> in any " +
        "save folder under your Ostranauts <code>Saves/</code> directory." }),
      Core.el("p", { class: "small muted", text:
        "Each ship's checkbox / pinned-room state is keyed by both the save " +
        "you uploaded and the ship's registration — so two saves with the " +
        "same ship reg stay isolated. Re-upload the same save zip later to " +
        "pick up where you left off." }),
    ]));
  }

  function clearSave() {
    window.InspectorCore.clearShip();
    STATE.saveHash = null;
    STATE.saveName = null;
    STATE.shipEntries = [];
    STATE.shipCache.clear();
    STATE.activeReg = null;
    const sel = document.getElementById("ship-select");
    if (sel) {
      sel.disabled = true;
      while (sel.firstChild) sel.removeChild(sel.firstChild);
      sel.appendChild(window.InspectorCore.el("option",
        { value: "", text: "— upload a save zip first —" }));
    }
    const fileInput = document.getElementById("save-upload");
    if (fileInput) fileInput.value = "";
    const summary = document.getElementById("save-summary");
    if (summary) { summary.style.display = "none"; summary.textContent = ""; }
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  }

  // ─── zip upload + ship-list build ──────────────────────────────────────

  async function onSaveChosen(input) {
    const Core = window.InspectorCore;
    const file = input.files && input.files[0];
    if (!file) return;

    Core.uploadError("");
    setSummary(`Reading ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)…`);

    let bytes;
    try {
      bytes = new Uint8Array(await file.arrayBuffer());
    } catch (e) {
      Core.uploadError("Could not read file: " + e.message);
      input.value = "";
      setSummary("");
      return;
    }

    let entries;
    try {
      entries = await window.SaveZipReader.readEntries(bytes);
    } catch (e) {
      Core.uploadError("Not a valid ZIP: " + e.message);
      input.value = "";
      setSummary("");
      return;
    }

    // Filter to ships/<reg>.json. Exclude nested-folder PNGs and the
    // top-level GameSave / saveInfo / portrait / screenshot.
    const shipEntries = entries
      .filter((e) => /^ships\/[^/]+\.json$/.test(e.name))
      .map((e) => ({
        reg: e.name.replace(/^ships\//, "").replace(/\.json$/, ""),
        size: e.uncompressedSize,
        compressedSize: e.compressedSize,
        getText: e.getText,
      }));

    if (shipEntries.length === 0) {
      Core.uploadError("This zip has no ships/<reg>.json entries. Did you " +
        "upload the right file?");
      input.value = "";
      setSummary("");
      return;
    }

    STATE.saveHash = djb2Bytes(bytes);
    STATE.saveName = file.name.replace(/\.zip$/i, "");
    STATE.shipEntries = shipEntries;
    STATE.shipCache.clear();
    STATE.activeReg = null;

    // Try to pull friendlier metadata from the bundled saveInfo.json
    // (just the player + ship + version line, not the giant strSaveLog).
    let savePlayer = null;
    let saveShipName = null;
    let saveVersion = null;
    try {
      const infoEntry = entries.find((e) => e.name === "saveInfo.json");
      if (infoEntry) {
        const text = await infoEntry.getText();
        const parsed = JSON.parse(text);
        const info = Array.isArray(parsed) ? parsed[0] : parsed;
        if (info) {
          savePlayer    = info.playerName  || null;
          saveShipName  = info.shipName    || null;
          saveVersion   = info.version     || null;
        }
      }
    } catch (e) {
      // Non-fatal — saveInfo metadata is for header polish only.
    }

    populateShipSelect();
    const parts = [
      `<strong>${escapeHtml(STATE.saveName)}</strong>`,
      `${shipEntries.length} ship${shipEntries.length === 1 ? "" : "s"}`,
    ];
    if (savePlayer)   parts.push(`player <strong>${escapeHtml(savePlayer)}</strong>`);
    if (saveShipName) parts.push(`flagship <strong>${escapeHtml(saveShipName)}</strong>`);
    if (saveVersion)  parts.push(`<code>${escapeHtml(saveVersion)}</code>`);
    setSummary(parts.join(" · "), /*asHtml*/ true);
  }

  function populateShipSelect() {
    const Core = window.InspectorCore;
    const sel = document.getElementById("ship-select");
    if (!sel) return;
    while (sel.firstChild) sel.removeChild(sel.firstChild);
    sel.appendChild(Core.el("option", { value: "", text: "— choose a ship from this save —" }));
    const sorted = STATE.shipEntries.slice().sort((a, b) => a.reg.localeCompare(b.reg));
    for (const e of sorted) {
      const label = `${e.reg} (${formatBytes(e.size)})`;
      sel.appendChild(Core.el("option", { value: e.reg, text: label }));
    }
    sel.disabled = false;
  }

  function formatBytes(n) {
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    return (n / 1024 / 1024).toFixed(1) + " MB";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setSummary(text, asHtml) {
    const summary = document.getElementById("save-summary");
    if (!summary) return;
    summary.style.display = text ? "" : "none";
    if (asHtml) summary.innerHTML = text;
    else summary.textContent = text;
  }

  // ─── ship activation from zip ──────────────────────────────────────────

  async function loadShipFromSave(reg) {
    const Core = window.InspectorCore;
    if (!reg) return;
    if (STATE.activeReg === reg && STATE.shipCache.has(reg)) return;

    let payload = STATE.shipCache.get(reg);
    if (!payload) {
      const entry = STATE.shipEntries.find((e) => e.reg === reg);
      if (!entry) {
        Core.uploadError("Ship '" + reg + "' is not present in the loaded save.");
        return;
      }
      Core.uploadError("");
      const label = document.getElementById("progress-label");
      if (label) label.textContent = `Decompressing ${reg}…`;
      try {
        const text = await entry.getText();
        payload = JSON.parse(text);
      } catch (e) {
        Core.uploadError(`Could not parse ships/${reg}.json: ${e.message}`);
        return;
      }
      if (!Core.isShipShaped(payload)) {
        Core.uploadError(`ships/${reg}.json doesn't look ship-shaped ` +
          `(expected a single-element array wrapping a dict with aItems[]).`);
        return;
      }
      STATE.shipCache.set(reg, payload);
    }

    STATE.activeReg = reg;
    const dict = payload[0];
    const shipName = dict.strName || reg;
    const friendlyShipName = window.SHIP_FRIENDLY_NAMES?.[shipName] || shipName;
    const label = friendlyShipName === reg
      ? `${reg} (from save)`
      : `${friendlyShipName} — ${reg} (from save)`;
    const key = STATE.saveHash + ":" + reg;
    Core.activateShip(key, dict, label);

    // Mirror to URL hash. The hash by itself can't load anything (zip
    // bytes live only in this tab), but it round-trips for "share my
    // current ship within the save" if the modder reopens the same save.
    location.hash = "#/ship/" + encodeURIComponent(reg);

    // Sync the select to reflect the active ship (in case loadShipFromSave
    // was driven by hash change rather than the dropdown).
    const sel = document.getElementById("ship-select");
    if (sel && sel.value !== reg) sel.value = reg;
  }

  // ─── hash routing ──────────────────────────────────────────────────────

  function readHashShip() {
    const m = /^#\/ship\/([^/?]+)/.exec(location.hash || "");
    return m ? decodeURIComponent(m[1]) : null;
  }

  function onHashChange() {
    const reg = readHashShip();
    if (!reg) return;
    if (!STATE.shipEntries.length) return;  // no save loaded yet
    if (STATE.activeReg === reg) return;
    if (!STATE.shipEntries.some((e) => e.reg === reg)) return;
    loadShipFromSave(reg);
  }

  // ─── boot ──────────────────────────────────────────────────────────────

  function boot() {
    const main = document.getElementById("inspector-root");
    if (!main) {
      console.error("save-inspector: missing #inspector-root");
      return;
    }
    if (typeof DecompressionStream === "undefined") {
      const warn = window.InspectorCore.el("p", {
        class: "upload-error",
        style: "display:block",
        text: "This browser doesn't support DecompressionStream. Use a recent " +
          "Chrome, Firefox, or Safari (113+ / 113+ / 16.4+) to read save zips.",
      });
      main.appendChild(warn);
      return;
    }

    buildPicker(main);
    window.InspectorCore.init({
      rootEl: main,
      lsPrefix: LS_PREFIX,
      friendlyNames: window.SHIP_FRIENDLY_NAMES || {},
      rooms: window.ROOMS || [],
    });

    window.addEventListener("hashchange", onHashChange);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
