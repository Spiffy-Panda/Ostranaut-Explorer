// Theme toggle · light ↔ dark · persisted in localStorage
// Adapted from notes/design/hifi-prototype/theme-toggle.js. Two halves:
//
// 1. The IIFE body runs synchronously when this script tag is parsed.
//    Putting the <script> tag in <head> BEFORE the <link rel="stylesheet">
//    means the data-theme attribute is set before the stylesheet's CSS
//    variables resolve, avoiding a flash of incorrect theme.
//
// 2. mount() runs on DOMContentLoaded (or immediately if late) and inserts
//    a button into the explorer's <header>. The button flips the attribute
//    and persists the choice. Storage key is namespaced
//    "ostranauts-explorer-theme".

(function () {
  const KEY = "ostranauts-explorer-theme";
  const stored = (function () {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  })();
  const initial = stored === "dark" || stored === "light"
    ? stored
    : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", initial);

  function render(btn, theme) {
    const isDark = theme === "dark";
    btn.innerHTML =
      '<span class="glyph" aria-hidden="true">' + (isDark ? "◐" : "◑") + "</span>" +
      '<span class="label">' + (isDark ? "Light" : "Dark") + "</span>";
    btn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    btn.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode (industrial)");
  }

  function setTheme(theme, btn) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    if (btn) render(btn, theme);
  }

  function mount() {
    // Mount target: explicit slot, else end of <header>, else body.
    let host = document.querySelector("[data-theme-toggle-mount]")
      || document.querySelector("header")
      || document.querySelector("body");
    if (!host) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    render(btn, document.documentElement.getAttribute("data-theme") || "dark");
    btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      setTheme(cur === "dark" ? "light" : "dark", btn);
    });
    host.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
