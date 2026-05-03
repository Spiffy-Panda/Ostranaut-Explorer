// Ostranaut Data Explorer — v1 site frontend.
// Loads graph.json, indexes it client-side, drives a search box +
// folder sidebar + object detail panel via hash-based routing.
//
// Routes:
//   #/o/<folder>/<strName>   — object detail
//   #/f/<folder>             — folder index
//   (anything else)           — empty hint

const SCHEMA_VERSION = 1;
const SEARCH_LIMIT = 50;
const FOLDER_LIMIT = 500; // cap per-folder list to keep render snappy

const $ = sel => document.querySelector(sel);
const statusEl = $('#status');
const searchEl = $('#search');
const searchResultsEl = $('#search-results');
const folderListEl = $('#folder-list');
const detailEl = $('#detail');

let graph = null;          // raw payload
let nodesById = new Map(); // id -> node
let outgoing = new Map();  // sourceId -> [edges]
let incoming = new Map();  // targetId -> [edges]
let nodesByFolder = new Map(); // folder -> [nodes] (sorted by strName)
let folderCounts = [];     // [{folder, count}] sorted

async function main() {
  try {
    const res = await fetch('data/graph.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    graph = await res.json();
  } catch (err) {
    statusEl.textContent = `couldn't load data/graph.json — run \`make\` (or \`build.bat\`) first. (${err.message})`;
    return;
  }

  if (graph.$schema_version !== SCHEMA_VERSION) {
    statusEl.textContent = `graph.json schema v${graph.$schema_version} not understood (expected v${SCHEMA_VERSION}).`;
    return;
  }

  buildIndexes();
  renderFolderList();
  wireSearch();
  window.addEventListener('hashchange', renderRoute);
  renderRoute();

  statusEl.textContent =
    `${graph.nodes.length.toLocaleString()} objects · ${graph.edges.length.toLocaleString()} refs`;
}

function buildIndexes() {
  for (const node of graph.nodes) {
    nodesById.set(node.id, node);
    if (!nodesByFolder.has(node.folder)) nodesByFolder.set(node.folder, []);
    nodesByFolder.get(node.folder).push(node);
  }
  for (const arr of nodesByFolder.values()) arr.sort((a, b) => a.strName.localeCompare(b.strName));

  for (const edge of graph.edges) {
    if (!outgoing.has(edge.source)) outgoing.set(edge.source, []);
    outgoing.get(edge.source).push(edge);
    if (!incoming.has(edge.target)) incoming.set(edge.target, []);
    incoming.get(edge.target).push(edge);
  }

  folderCounts = [...nodesByFolder.entries()]
    .map(([folder, list]) => ({ folder, count: list.length }))
    .sort((a, b) => a.folder.localeCompare(b.folder));
}

function renderFolderList() {
  folderListEl.innerHTML = '';
  const currentFolder = currentFolderFromHash();
  for (const { folder, count } of folderCounts) {
    const li = document.createElement('li');
    if (folder === currentFolder) li.classList.add('active');
    li.innerHTML = `<span>${folder}</span><span class="count">${count}</span>`;
    li.addEventListener('click', () => { window.location.hash = `#/f/${encodeURIComponent(folder)}`; });
    folderListEl.appendChild(li);
  }
}

function currentFolderFromHash() {
  const m = window.location.hash.match(/^#\/[fo]\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/* ─── search ───────────────────────────────────────────────── */

function wireSearch() {
  let activeIndex = -1;
  let lastResults = [];

  function update() {
    const q = searchEl.value.trim().toLowerCase();
    if (!q) { hide(); return; }

    const matches = searchMatches(q, SEARCH_LIMIT);
    lastResults = matches;
    activeIndex = -1;
    renderSearchResults(matches);
  }

  searchEl.addEventListener('input', debounce(update, 80));
  searchEl.addEventListener('focus', update);
  searchEl.addEventListener('blur', () => setTimeout(hide, 120)); // delay so click fires first

  searchEl.addEventListener('keydown', e => {
    if (searchResultsEl.hidden) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(lastResults.length - 1, activeIndex + 1);
      highlightActive(activeIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(0, activeIndex - 1);
      highlightActive(activeIndex);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      navigateToObject(lastResults[activeIndex]);
    } else if (e.key === 'Escape') {
      hide();
    }
  });

  function highlightActive(i) {
    [...searchResultsEl.children].forEach((el, idx) => el.classList.toggle('active', idx === i));
    const active = searchResultsEl.children[i];
    if (active) active.scrollIntoView({ block: 'nearest' });
  }

  function hide() { searchResultsEl.hidden = true; }
}

function searchMatches(q, limit) {
  // Simple ranking: prefix match on strName > infix match on strName > infix on folder.
  const matches = [];
  for (const node of graph.nodes) {
    const nameLower = node.strName.toLowerCase();
    let score;
    if (nameLower.startsWith(q)) score = 0;
    else if (nameLower.includes(q)) score = 1;
    else if (node.folder.toLowerCase().includes(q)) score = 2;
    else continue;
    matches.push({ node, score });
    // Cheap early bail: don't scan past a multiple of the limit
    if (matches.length > limit * 4) break;
  }
  matches.sort((a, b) => a.score - b.score || a.node.strName.length - b.node.strName.length);
  return matches.slice(0, limit).map(m => m.node);
}

function renderSearchResults(nodes) {
  searchResultsEl.hidden = false;
  searchResultsEl.innerHTML = '';
  if (nodes.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'no matches';
    searchResultsEl.appendChild(li);
    return;
  }
  for (const node of nodes) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="name">${escapeHtml(node.strName)}</span><span class="folder">${escapeHtml(node.folder)}</span>`;
    li.addEventListener('mousedown', () => navigateToObject(node)); // mousedown fires before blur
    searchResultsEl.appendChild(li);
  }
}

function navigateToObject(node) {
  searchResultsEl.hidden = true;
  searchEl.blur();
  window.location.hash = `#/o/${encodeURIComponent(node.folder)}/${encodeURIComponent(node.strName)}`;
}

/* ─── routing ──────────────────────────────────────────────── */

function renderRoute() {
  const hash = window.location.hash;
  const objectMatch = hash.match(/^#\/o\/([^/]+)\/(.+)$/);
  const folderMatch = hash.match(/^#\/f\/([^/]+)$/);

  if (objectMatch) {
    renderObjectDetail(decodeURIComponent(objectMatch[1]), decodeURIComponent(objectMatch[2]));
  } else if (folderMatch) {
    renderFolderIndex(decodeURIComponent(folderMatch[1]));
  } else {
    detailEl.innerHTML = '<p class="hint">Pick an object from the search bar or a folder on the left.</p>';
  }
  renderFolderList();
}

/* ─── object detail ────────────────────────────────────────── */

function renderObjectDetail(folder, strName) {
  const id = `${folder}:${strName}`;
  const node = nodesById.get(id);
  if (!node) {
    detailEl.innerHTML = `<p class="hint">No object known at <code>${escapeHtml(id)}</code>.</p>`;
    return;
  }

  const out = outgoing.get(id) || [];
  const inc = incoming.get(id) || [];

  const html = `
    <div class="detail-head">
      <div class="crumbs">${escapeHtml(folder)}</div>
      <h2>${escapeHtml(strName)}</h2>
      <div class="file">${escapeHtml(node.file)}</div>
    </div>

    <div class="refs-block">
      <h3>References out (${out.length})</h3>
      ${renderEdgeGroups(out, 'source-perspective')}
    </div>

    <div class="refs-block">
      <h3>Referenced by (${inc.length})</h3>
      ${renderEdgeGroups(inc, 'target-perspective')}
    </div>
  `;
  detailEl.innerHTML = html;

  // Wire edge clicks
  detailEl.querySelectorAll('a[data-id]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = a.getAttribute('data-id');
      const [tf, tn] = splitId(target);
      window.location.hash = `#/o/${encodeURIComponent(tf)}/${encodeURIComponent(tn)}`;
    });
  });
}

function renderEdgeGroups(edges, perspective) {
  if (edges.length === 0) return '<p class="empty">none</p>';

  // Group by sourceField (perspective-source) or by sourceField as well — same key, different meaning.
  const groups = new Map();
  for (const e of edges) {
    const key = e.sourceField;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e);
  }

  const sortedGroupKeys = [...groups.keys()].sort();
  return sortedGroupKeys.map(field => {
    const items = groups.get(field);
    return `
      <div class="group">
        <div class="group-head">${escapeHtml(field)} · ${items.length}</div>
        <ul>
          ${items.map(e => renderEdgeRow(e, perspective)).join('')}
        </ul>
      </div>
    `;
  }).join('');
}

function renderEdgeRow(edge, perspective) {
  const linkId = perspective === 'source-perspective' ? edge.target : edge.source;
  const known = nodesById.has(linkId);
  const [linkFolder, linkName] = splitId(linkId);

  const linkHtml = known
    ? `<a href="#/o/${encodeURIComponent(linkFolder)}/${encodeURIComponent(linkName)}" data-id="${escapeAttr(linkId)}">${escapeHtml(linkName)}</a>`
    : `<span class="dangling" title="not in index">${escapeHtml(linkName)}</span>`;

  const folderTag = `<span class="field">${escapeHtml(linkFolder)}</span>`;
  const meta = edge.metadata ? renderMetadata(edge.metadata) : '';
  const arrow = perspective === 'source-perspective' ? '→' : '←';

  return `<li><span class="arrow">${arrow}</span>${folderTag}:${linkHtml}${meta}</li>`;
}

function renderMetadata(metadata) {
  const parts = [];
  if ('value' in metadata) parts.push(`value=${metadata.value}`);
  if ('duration' in metadata) parts.push(`dur=${metadata.duration}`);
  return parts.length ? ` <span class="meta">[${parts.join(' ')}]</span>` : '';
}

/* ─── folder index ─────────────────────────────────────────── */

function renderFolderIndex(folder) {
  const list = nodesByFolder.get(folder);
  if (!list) {
    detailEl.innerHTML = `<p class="hint">Unknown folder: <code>${escapeHtml(folder)}</code>.</p>`;
    return;
  }
  const visible = list.slice(0, FOLDER_LIMIT);
  const truncated = list.length > FOLDER_LIMIT;

  detailEl.innerHTML = `
    <div class="detail-head">
      <div class="crumbs">folder</div>
      <h2>${escapeHtml(folder)}</h2>
      <div class="file">${list.length.toLocaleString()} objects</div>
    </div>
    <div class="folder-index">
      ${truncated ? `<p class="meta">showing first ${FOLDER_LIMIT.toLocaleString()} of ${list.length.toLocaleString()}</p>` : ''}
      <ul>
        ${visible.map(n => `<li><a href="#/o/${encodeURIComponent(folder)}/${encodeURIComponent(n.strName)}">${escapeHtml(n.strName)}</a></li>`).join('')}
      </ul>
    </div>
  `;
}

/* ─── utilities ────────────────────────────────────────────── */

function splitId(id) {
  const i = id.indexOf(':');
  return i < 0 ? [id, ''] : [id.slice(0, i), id.slice(i + 1)];
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
function escapeAttr(s) { return escapeHtml(s); }

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

main();
