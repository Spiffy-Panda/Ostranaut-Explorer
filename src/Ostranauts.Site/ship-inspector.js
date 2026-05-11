// ship-inspector.js — picker + boot for the ship inspector page.
//
// Audience: modders building (or analyzing) a ship from JSON. The page lets
// them pick a canned ship from data/canned-ships-manifest.js or upload one
// of their own, then ticks components off as they're placed in their own
// build. State persists in localStorage per ship.
//
// All rendering (progress / visual / rooms / components) is handled by
// inspector-core.js — this file only owns the canned-ship dropdown, the
// single-JSON upload flow, and URL hash routing.
//
// Inputs (all loaded as <script src> globals — no fetch, runs from file://):
//   * window.SHIP_INSPECTOR_MANIFEST   — array, dropdown driver
//   * window.SHIP_FRIENDLY_NAMES       — { strName: strNameFriendly }
//   * window.SHIP_INSPECTOR_CANNED     — populated lazily as <script> tags
//                                        for each per-ship .js are injected
//   * window.ROOMS, window.renderRoomCard — from rooms.js
//   * window.InspectorCore             — from inspector-core.js
//
// localStorage keys (under "ship-inspector:" prefix):
//   active-ship                 "<reg>" | "upload:<hash>"
//   counts:<key>                { strName: built-count }       (managed by core)
//   pinned-specs:<key>          [ "<room-spec-name>", ... ]    (managed by core)
//   bucket-filters              { walls: true, ... }           (managed by core)
//   upload-cache:<hash>         uploaded JSON text
//   upload-meta:<hash>          { name, dateUploaded, summary }
//
// v1 caveat: uploaded ships are stored uncompressed. The script refuses
// uploads larger than UPLOAD_MAX_BYTES so localStorage doesn't fill up.

(function () {
  "use strict";

  const LS_PREFIX = "ship-inspector:";
  const UPLOAD_MAX_BYTES = 4 * 1024 * 1024;  // 4 MB raw text

  const STATE = {
    manifest: [],
  };

  // localStorage helpers scoped to this page's prefix. Distinct from the
  // core's lsGet/lsSet (which uses the same prefix but is module-private
  // there) — these manage the picker-owned active-ship / upload-cache /
  // upload-meta keys.
  function lsGet(key, fallback) {
    try {
      const v = localStorage.getItem(LS_PREFIX + key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  }
  function lsSet(key, value) {
    try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(value)); }
    catch (e) { console.warn("ship-inspector: localStorage write failed:", e); }
  }
  function lsDel(key) {
    try { localStorage.removeItem(LS_PREFIX + key); } catch (e) {}
  }

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

  // ─── header / picker ───────────────────────────────────────────────────

  function buildPicker(root) {
    const Core = window.InspectorCore;

    const select = Core.el("select", { id: "ship-select", class: "ship-select" });
    select.appendChild(Core.el("option", { value: "", text: "— choose a vanilla ship —" }));
    for (const m of STATE.manifest) {
      const label = m.friendlyName === m.reg ? m.reg : `${m.friendlyName} (${m.reg})`;
      select.appendChild(Core.el("option", { value: m.reg, text: label }));
    }
    select.addEventListener("change", () => {
      const reg = select.value;
      if (!reg) return;
      location.hash = "#/ship/" + encodeURIComponent(reg);
    });

    const fileInput = Core.el("input", {
      type: "file", id: "ship-upload", accept: ".json,application/json",
      class: "ship-upload",
    });
    fileInput.addEventListener("change", () => onUploadChosen(fileInput));

    const uploadLabel = Core.el("label", { class: "ship-upload-label", for: "ship-upload" }, [
      "Upload your own ship JSON",
    ]);

    const privacy = Core.el("p", {
      class: "ship-privacy",
      text: "Stays in your browser, nothing sent to a server.",
    });

    const links = Core.el("p", { class: "ship-links" }, [
      Core.el("a", { href: "save-inspector.html", text: "→ Save inspector (browse a save zip)" }),
      "  ",
      Core.el("a", { href: "rooms-reference.html", text: "→ Rooms reference" }),
      "  ",
      Core.el("a", { href: "data/id-friendly-names.json", text: "→ ID-to-friendly-name JSON" }),
      "  ",
      Core.el("a", { href: "data/id-component-categories.json",
        title: "Per-strName bucket + friendly name + price + mass + damage tint, grouped by category. Useful for modders cross-checking which bucket their custom component lands in.",
        text: "→ Component categories JSON" }),
    ]);

    const clearBtn = Core.el("button", {
      type: "button", class: "clear-ship-btn", id: "clear-ship-btn",
      text: "← Clear selection",
      onclick: clearShip,
    });

    root.appendChild(Core.el("div", { class: "ship-picker" }, [
      select,
      uploadLabel,
      fileInput,
      privacy,
      links,
      clearBtn,
    ]));

    // Persistent empty-state hint, shown only when no ship is active.
    root.appendChild(Core.el("div", { class: "empty-hint", id: "empty-hint" }, [
      Core.el("p", { html:
        "<strong>No ship selected.</strong> Pick a vanilla ship from the " +
        "dropdown above to see its component checklist and floor plan, " +
        "or upload a ship JSON file to inspect a build of your own." }),
      Core.el("p", { class: "small muted", text:
        "Your checkboxes and pinned rooms are saved per-ship in this " +
        "browser — switch between ships freely without losing state." }),
    ]));
  }

  function clearShip() {
    window.InspectorCore.clearShip();
    lsDel("active-ship");
    const sel = document.getElementById("ship-select");
    if (sel) sel.value = "";
    const fileInput = document.getElementById("ship-upload");
    if (fileInput) fileInput.value = "";
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  }

  function onUploadChosen(input) {
    const Core = window.InspectorCore;
    const file = input.files && input.files[0];
    if (!file) return;
    if (file.size > UPLOAD_MAX_BYTES) {
      Core.uploadError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). ` +
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
        Core.uploadError("Could not parse JSON: " + e.message);
        input.value = "";
        return;
      }
      if (!Core.isShipShaped(parsed)) {
        Core.uploadError("This doesn't look like a ship JSON (expected a single-element array " +
          "wrapping a dict with aItems[]).");
        input.value = "";
        return;
      }
      const hash = Core.djb2(text);
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
      Core.uploadError("");
      activateUpload(key, parsed, file.name);
    };
    reader.onerror = () => {
      Core.uploadError("Failed to read file.");
      input.value = "";
    };
    reader.readAsText(file);
  }

  function tryRehydrateUpload(key) {
    const hash = key.slice("upload:".length);
    const text = lsGet("upload-cache:" + hash, null);
    if (!text) return null;
    try {
      const parsed = JSON.parse(text);
      if (!window.InspectorCore.isShipShaped(parsed)) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function activateCanned(reg, payload) {
    const m = STATE.manifest.find((m) => m.reg === reg);
    const friendly = (m && m.friendlyName) || payload[0].strName || reg;
    const label = friendly === reg ? reg : `${friendly} (${reg})`;
    const ok = window.InspectorCore.activateShip(reg, payload[0], label);
    if (!ok) return;
    lsSet("active-ship", reg);
    const sel = document.getElementById("ship-select");
    if (sel) sel.value = reg;
  }

  function activateUpload(key, payload, fileName) {
    const meta = lsGet("upload-meta:" + key.slice("upload:".length), null);
    const name = (meta && meta.name) || fileName || payload[0].strName || "(uploaded ship)";
    const ok = window.InspectorCore.activateShip(key, payload[0], name + " (uploaded)");
    if (!ok) return;
    lsSet("active-ship", key);
    const sel = document.getElementById("ship-select");
    if (sel) sel.value = "";
  }

  // ─── hash routing ──────────────────────────────────────────────────────

  function readHashShip() {
    const m = /^#\/ship\/([^/?]+)/.exec(location.hash || "");
    return m ? decodeURIComponent(m[1]) : null;
  }

  async function onHashChange() {
    const reg = readHashShip();
    if (!reg) return;
    try {
      const payload = await loadCannedShip(reg);
      activateCanned(reg, payload);
    } catch (e) {
      window.InspectorCore.uploadError("Could not load ship '" + reg + "': " + e.message);
    }
  }

  // ─── boot ──────────────────────────────────────────────────────────────

  async function boot() {
    STATE.manifest = (window.SHIP_INSPECTOR_MANIFEST || []).slice();
    STATE.manifest.sort((a, b) =>
      (a.friendlyName || a.reg).localeCompare(b.friendlyName || b.reg));

    const main = document.getElementById("inspector-root");
    if (!main) {
      console.error("ship-inspector: missing #inspector-root");
      return;
    }

    buildPicker(main);
    window.InspectorCore.init({
      rootEl: main,
      lsPrefix: LS_PREFIX,
      friendlyNames: window.SHIP_FRIENDLY_NAMES || {},
      rooms: window.ROOMS || [],
    });

    // Decide what to load:
    // 1. URL hash #/ship/<reg>  (canned only)
    // 2. localStorage active-ship
    // 3. nothing (waiting for picker)
    const hashReg = readHashShip();
    if (hashReg) {
      try {
        const payload = await loadCannedShip(hashReg);
        activateCanned(hashReg, payload);
      } catch (e) {
        window.InspectorCore.uploadError("Could not load ship '" + hashReg + "': " + e.message);
      }
    } else {
      const lastKey = lsGet("active-ship", null);
      if (lastKey) {
        if (lastKey.startsWith("upload:")) {
          const payload = tryRehydrateUpload(lastKey);
          if (payload) activateUpload(lastKey, payload, null);
        } else {
          try {
            const payload = await loadCannedShip(lastKey);
            activateCanned(lastKey, payload);
            // mirror to URL hash so deep-link is shareable
            location.hash = "#/ship/" + encodeURIComponent(lastKey);
          } catch (e) {
            // stale localStorage, ignore
          }
        }
      }
    }

    window.addEventListener("hashchange", onHashChange);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
