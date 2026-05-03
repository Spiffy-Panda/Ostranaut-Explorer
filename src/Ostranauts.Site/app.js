// Ostranaut Data Explorer — v1 site frontend.
// Loads graph.json, indexes it client-side, drives a search box +
// folder sidebar + object detail panel via hash-based routing.
//
// Routes:
//   #/o/<folder>/<strName>   — object detail
//   #/f/<folder>             — folder index
//   (anything else)           — empty hint

const SCHEMA_VERSION = 3;
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
let rulesBySource = new Map(); // sourceFolder -> [rules]
let edgeCountByRule = new Map(); // "<sourceFolder>:<fieldName>" -> int

function main() {
  graph = window.GRAPH_DATA;
  if (!graph) {
    statusEl.textContent = `data/graph.js didn't load — run the builder first (see README).`;
    return;
  }

  if (graph.$schema_version !== SCHEMA_VERSION) {
    statusEl.textContent = `graph schema v${graph.$schema_version} not understood (expected v${SCHEMA_VERSION}).`;
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

    const srcFolder = edge.source.split(':', 1)[0];
    const ruleKey = `${srcFolder}:${edge.sourceField}`;
    edgeCountByRule.set(ruleKey, (edgeCountByRule.get(ruleKey) ?? 0) + 1);
  }

  for (const rule of (graph.rules ?? [])) {
    if (!rulesBySource.has(rule.sourceFolder)) rulesBySource.set(rule.sourceFolder, []);
    rulesBySource.get(rule.sourceFolder).push(rule);
  }
  for (const list of rulesBySource.values()) list.sort((a, b) => a.fieldName.localeCompare(b.fieldName));

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
  const schemaMatch = hash.match(/^#\/schema\/([^/]+)$/);
  const schemasIndex = hash === '#/schemas';

  if (objectMatch) {
    renderObjectDetail(decodeURIComponent(objectMatch[1]), decodeURIComponent(objectMatch[2]));
  } else if (folderMatch) {
    renderFolderIndex(decodeURIComponent(folderMatch[1]));
  } else if (schemaMatch) {
    renderSchemaDetail(decodeURIComponent(schemaMatch[1]));
  } else if (schemasIndex) {
    renderSchemasIndex();
  } else {
    detailEl.innerHTML = '<p class="hint">Pick an object from the search bar or a folder on the left, or visit <a href="#/schemas">Schemas</a> to see what reference rules are loaded.</p>';
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
        ${visible.map(n => {
          const inCount = incoming.get(n.id)?.length ?? 0;
          const outCount = outgoing.get(n.id)?.length ?? 0;
          const marker = (inCount === 0 && outCount === 0) ? '❌' : '⭕';
          return `<li><span class="ref-marker">${marker}</span><a href="#/o/${encodeURIComponent(folder)}/${encodeURIComponent(n.strName)}">${escapeHtml(n.strName)}</a><span class="ref-counts">(${inCount}/${outCount})</span></li>`;
        }).join('')}
      </ul>
    </div>
  `;
}

/* ─── schema inspector ─────────────────────────────────────── */

function renderSchemasIndex() {
  // One row per source folder that has rules. Show rule count + total
  // edges those rules emitted. Lets you spot under-covered folders.
  const sourceFolders = [...rulesBySource.keys()].sort();
  if (sourceFolders.length === 0) {
    detailEl.innerHTML = '<p class="hint">No schema rules loaded. Either no schemas were found, or your graph.js was generated by an older Builder (predates the rules export).</p>';
    return;
  }

  const totalRules = (graph.rules ?? []).length;
  const totalGhosts = (graph.rules ?? []).filter(r => r.isGhost).length;
  const totalEdges = graph.edges.length;
  const folderRows = sourceFolders.map(folder => {
    const rules = rulesBySource.get(folder);
    const edges = rules.reduce((sum, r) => sum + (edgeCountByRule.get(`${folder}:${r.fieldName}`) ?? 0), 0);
    const ghostCount = rules.filter(r => r.isGhost).length;
    return { folder, ruleCount: rules.length, ghostCount, edgeCount: edges };
  }).sort((a, b) => b.edgeCount - a.edgeCount);

  detailEl.innerHTML = `
    <div class="detail-head">
      <div class="crumbs">schema inspector</div>
      <h2>Schemas</h2>
      <div class="file">
        ${totalRules} rules across ${sourceFolders.length} source folders · ${totalEdges.toLocaleString()} edges total
        ${totalGhosts > 0 ? ` · <span class="ghost">${totalGhosts} 👻 ghost rule${totalGhosts === 1 ? '' : 's'}</span>` : ''}
      </div>
    </div>
    <div class="folder-index">
      <p class="meta">Folders sorted by total edges produced. Click a folder to drill into its per-field rules. <span class="ghost">👻 = ghost field</span> (in schema but not deserialized by the game's C# class — preserved for modder reference).</p>
      <ul>
        ${folderRows.map(({ folder, ruleCount, ghostCount, edgeCount }) => `
          <li>
            <a href="#/schema/${encodeURIComponent(folder)}">${escapeHtml(folder)}</a>
            <span class="field"> · ${ruleCount} rule${ruleCount === 1 ? '' : 's'}${ghostCount > 0 ? ` (<span class="ghost">${ghostCount} 👻</span>)` : ''} · ${edgeCount.toLocaleString()} edges</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

function renderSchemaDetail(folder) {
  const rules = rulesBySource.get(folder);
  if (!rules) {
    detailEl.innerHTML = `<p class="hint">No schema rules for folder <code>${escapeHtml(folder)}</code>. <a href="#/schemas">Back to schema index</a>.</p>`;
    return;
  }

  // Group by shape so the user can scan structure at a glance.
  const byShape = new Map();
  for (const r of rules) {
    if (!byShape.has(r.shape)) byShape.set(r.shape, []);
    byShape.get(r.shape).push(r);
  }
  const shapes = [...byShape.keys()].sort();

  const html = `
    <div class="detail-head">
      <div class="crumbs"><a href="#/schemas">schemas</a></div>
      <h2>${escapeHtml(folder)}</h2>
      <div class="file">${rules.length} rules · grouped by FieldShape</div>
    </div>
    ${shapes.map(shape => {
      const items = byShape.get(shape).sort((a, b) => a.fieldName.localeCompare(b.fieldName));
      return `
        <div class="refs-block">
          <h3>${escapeHtml(shape)} (${items.length})</h3>
          <ul>
            ${items.map(r => {
              const edges = edgeCountByRule.get(`${folder}:${r.fieldName}`) ?? 0;
              const dim = edges === 0 && !r.isGhost ? ' style="opacity:0.6"' : '';
              const ghostBadge = r.isGhost
                ? ' <span class="ghost" title="In schema but not deserialized by game C#; preserved for modder reference">👻 ghost</span>'
                : '';
              const edgesNote = edges === 0
                ? (r.isGhost ? '' : ' (no values matched)')
                : '';
              return `<li${dim}>
                <span class="field">${escapeHtml(r.fieldName)}</span>${ghostBadge}
                <span class="arrow">→</span>
                <a href="#/f/${encodeURIComponent(r.targetFolder)}">${escapeHtml(r.targetFolder)}</a>
                <span class="meta">${edges.toLocaleString()} edges${edgesNote}</span>
              </li>`;
            }).join('')}
          </ul>
        </div>
      `;
    }).join('')}
  `;
  detailEl.innerHTML = html;
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
