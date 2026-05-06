// Ostranaut Data Explorer — v1 site frontend.
// Loads graph.json, indexes it client-side, drives a search box +
// folder sidebar + object detail panel via hash-based routing.
//
// Routes:
//   #/o/<folder>/<strName>   — object detail
//   #/f/<folder>             — folder index
//   (anything else)           — empty hint

const SCHEMA_VERSION = 6;
// Synthetic node folders for code-side graph nodes (PLAN-AST Phase 1).
// Code nodes are searchable + linkable but NOT shown in the folder sidebar.
const CODE_FOLDER_PREFIX = 'code-';
const isCodeFolder = (folder) => typeof folder === 'string' && folder.startsWith(CODE_FOLDER_PREFIX);
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
let folderCounts = [];     // [{folder, count}] sorted — DATA-side folders
let codeFolderCounts = []; // [{folder, count}] — synthetic code-* folders (PLAN-AST)
let rulesBySource = new Map(); // sourceFolder -> [rules]
let edgeCountByRule = new Map(); // "<sourceFolder>:<fieldName>" -> int
let ruleDescriptions = new Map(); // "<sourceFolder>:<fieldName>" -> description
// Auto-detected (phase 2 detector) — scalar top-level candidates only.
// fieldPath has no `[*]` / `.` for these. Used to decorate Fields block on
// detail pages with a "would link to <folder>" hint when schema doesn't cover.
let autoScalarByKey = new Map(); // "<folder>:<fieldName>" -> candidate (uncovered scalar only)
// Full candidate list (incl. nested + array paths) for the coverage health page.
let allCandidates = []; // candidate[]
// strName -> Set<folder>. Same name can live in multiple folders (loot/items/
// condowners often share Itm* names). Drives the "(also: folder, ...)" suffix
// on rendered ref values so a modder can navigate to the parallel entries.
let nameToFolders = new Map();
// Slice 4 / UX 1.1 — glossary cards. window.GLOSSARY (optional payload) is an
// array of { aliases, name, summary, wikiPage?, wikiSlug?, dataTerm: {folder, strName}, modderHint? }.
// Indexed at load time into a flat list of (alias, entry) pairs so substring
// matching against the user's query is cheap. Aliases are case-folded once.
let glossaryEntries = [];
let glossaryAliasIndex = []; // [{ alias, entry }]

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

  // Sibling payloads: properties + code_refs. Both optional — site degrades
  // gracefully if either is missing (no fields shown / no code-refs block).
  if (typeof window.NODE_PROPS === 'undefined') {
    console.info('properties.js not loaded — Fields block on detail pages will be empty.');
  }
  if (typeof window.CODE_REFS === 'undefined') {
    console.info('code_refs.js not loaded — Code references block will be omitted. Run utils/python/emit_code_refs.py to generate it.');
  }
  if (typeof window.REF_CANDIDATES === 'undefined') {
    console.info('ref_candidates.js not loaded — auto-detected refs will be hidden. Re-run the Builder to generate it.');
  }
  if (typeof window.GLOSSARY === 'undefined') {
    console.info('glossary.js not loaded — concept-search cards (UX 1.1) will be hidden.');
  }

  buildIndexes();
  buildGlossaryIndex();
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
    // The "(also: <folder>, ...)" suffix is for data-side cross-folder dups;
    // code-* folders are synthetic and shouldn't appear there.
    if (!isCodeFolder(node.folder)) {
      if (!nameToFolders.has(node.strName)) nameToFolders.set(node.strName, new Set());
      nameToFolders.get(node.strName).add(node.folder);
    }
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

  // (folder, fieldName) -> description (from rules that carry one).
  for (const rule of (graph.rules ?? [])) {
    if (rule.description) {
      ruleDescriptions.set(`${rule.sourceFolder}:${rule.fieldName}`, rule.description);
    }
  }
  // Slice 3 / UX 1.3 — non-ref-rule field descriptions (integers, booleans,
  // anything the schema describes but doesn't classify as a strName ref).
  // Builder emits these as a separate `fieldDescriptions` map keyed
  // `<folder>:<fieldName>`. Merge after rule descriptions so they fill gaps
  // without overriding (rule and field-description text are typically
  // identical when both exist; either source is fine).
  for (const [key, desc] of Object.entries(graph.fieldDescriptions ?? {})) {
    if (!ruleDescriptions.has(key) && typeof desc === 'string' && desc.length > 0) {
      ruleDescriptions.set(key, desc);
    }
  }

  folderCounts = [...nodesByFolder.entries()]
    .filter(([folder]) => !isCodeFolder(folder))
    .map(([folder, list]) => ({ folder, count: list.length }))
    .sort((a, b) => a.folder.localeCompare(b.folder));

  // PLAN-AST synthetic folders surface in their own sidebar section so they
  // read as a different KIND of object — derived from decomp, not data —
  // without burying the data folders. code-component first (small +
  // structurally meaningful), then code-class, then code-method (largest).
  const codeOrder = { 'code-component': 0, 'code-class': 1, 'code-method': 2 };
  codeFolderCounts = [...nodesByFolder.entries()]
    .filter(([folder]) => isCodeFolder(folder))
    .map(([folder, list]) => ({ folder, count: list.length }))
    .sort((a, b) => (codeOrder[a.folder] ?? 99) - (codeOrder[b.folder] ?? 99) || a.folder.localeCompare(b.folder));

  // Detector candidates — keep the full list for the coverage page, plus a fast
  // index of TOP-LEVEL SCALAR uncovered candidates for Fields-block decoration.
  // (Array/nested paths surface only on the coverage page, not inline.)
  const candPayload = window.REF_CANDIDATES;
  if (candPayload && Array.isArray(candPayload.candidates)) {
    allCandidates = candPayload.candidates;
    for (const c of allCandidates) {
      if (c.coveredBySchema) continue;
      // top-level scalar = no array marker, no nested-path dot.
      if (c.fieldPath.includes('[*]') || c.fieldPath.includes('.')) continue;
      autoScalarByKey.set(`${c.sourceFolder}:${c.fieldPath}`, c);
    }
  }
}

function renderFolderList() {
  folderListEl.innerHTML = '';
  const currentFolder = currentFolderFromHash();

  const appendFolderRow = ({ folder, count }) => {
    const li = document.createElement('li');
    if (folder === currentFolder) li.classList.add('active');
    li.innerHTML = `<span>${folder}</span><span class="count">${count}</span>`;
    li.addEventListener('click', () => { window.location.hash = `#/f/${encodeURIComponent(folder)}`; });
    folderListEl.appendChild(li);
  };

  for (const fc of folderCounts) appendFolderRow(fc);

  if (codeFolderCounts.length > 0) {
    const heading = document.createElement('li');
    heading.className = 'folder-section-heading';
    heading.innerHTML = `<span title="Synthetic graph nodes derived from the game's C# code — these surface refs the data files alone can't see.">Code</span>`;
    folderListEl.appendChild(heading);
    for (const fc of codeFolderCounts) appendFolderRow(fc);
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
    const glossary = glossaryMatches(q, 4);
    lastResults = matches;  // arrow nav still navigates strName matches only;
                           // glossary cards are mouse-click destinations
    activeIndex = -1;
    renderSearchResults(matches, glossary);
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

function buildGlossaryIndex() {
  glossaryEntries = Array.isArray(window.GLOSSARY) ? window.GLOSSARY : [];
  glossaryAliasIndex = [];
  for (const entry of glossaryEntries) {
    if (!entry || !Array.isArray(entry.aliases) || !entry.dataTerm) continue;
    for (const alias of entry.aliases) {
      if (typeof alias !== 'string' || !alias) continue;
      glossaryAliasIndex.push({ alias: alias.toLowerCase(), entry });
    }
  }
}

// UX 1.1 — query against the alias index. A match is "strong" when the alias
// is a prefix of the query OR the query is a prefix of the alias (so "atrophy"
// finds the Atrophy card and "atro" finds it too). Substring matches are also
// returned but ranked lower. Returns deduped entries (one per dataTerm).
function glossaryMatches(q, limit) {
  if (!q) return [];
  const seen = new Set();
  const out = [];
  for (const { alias, entry } of glossaryAliasIndex) {
    let score;
    if (alias === q) score = 0;
    else if (alias.startsWith(q)) score = 1;
    else if (q.startsWith(alias)) score = 2;
    else if (alias.includes(q) || q.includes(alias)) score = 3;
    else continue;
    const key = `${entry.dataTerm.folder}:${entry.dataTerm.strName}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ entry, score });
    if (out.length >= limit * 2) break;
  }
  out.sort((a, b) => a.score - b.score);
  return out.slice(0, limit).map(m => m.entry);
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

function renderSearchResults(nodes, glossary) {
  glossary = glossary || [];
  searchResultsEl.hidden = false;
  searchResultsEl.innerHTML = '';

  // UX 1.1 — glossary cards render above strName matches when the query
  // resolved to a known concept. Distinct visual treatment so the modder
  // registers "this is a concept, not an object."
  for (const entry of glossary) {
    const li = document.createElement('li');
    li.className = 'glossary-card';
    const dt = entry.dataTerm;
    const wikiLine = entry.wikiPage
      ? `<span class="wiki">📖 ${escapeHtml(entry.wikiPage)}</span>`
      : '';
    const hint = entry.modderHint
      ? `<div class="hint-line">💡 ${escapeHtml(entry.modderHint)}</div>`
      : '';
    li.innerHTML = `
      <div class="card-head">
        <span class="card-label">concept</span>
        <span class="card-name">${escapeHtml(entry.name || dt.strName)}</span>
      </div>
      <div class="card-summary">${escapeHtml(entry.summary || '')}</div>
      <div class="card-cta">
        <span class="cta-label">→ Game-data term:</span>
        <span class="folder">${escapeHtml(dt.folder)}:</span><span class="name">${escapeHtml(dt.strName)}</span>
      </div>
      ${hint}
      ${wikiLine}
    `;
    li.addEventListener('mousedown', () => navigateToObject({ folder: dt.folder, strName: dt.strName }));
    searchResultsEl.appendChild(li);
  }

  if (nodes.length === 0 && glossary.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'no matches';
    searchResultsEl.appendChild(li);
    return;
  }
  for (const node of nodes) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="name">${escapeHtml(formatCodeName(node.folder, node.strName))}</span><span class="folder">${escapeHtml(node.folder)}</span>`;
    li.addEventListener('mousedown', () => navigateToObject(node)); // mousedown fires before blur
    searchResultsEl.appendChild(li);
  }
}

function navigateToObject(node) {
  searchResultsEl.hidden = true;
  searchEl.blur();
  // UX 1.6 — drop any active filter state so pills don't bleed across object pages.
  activeFilters.clear();
  window.location.hash = `#/o/${encodeURIComponent(node.folder)}/${encodeURIComponent(node.strName)}`;
}

/* ─── routing ──────────────────────────────────────────────── */

function renderRoute() {
  const hash = window.location.hash;
  const objectMatch = hash.match(/^#\/o\/([^/]+)\/(.+)$/);
  const folderMatch = hash.match(/^#\/f\/([^/]+)$/);
  const schemaMatch = hash.match(/^#\/schema\/([^/]+)$/);
  const schemasIndex = hash === '#/schemas';
  const healthCoverage = hash === '#/health/coverage';
  const healthData = hash === '#/health/data';
  const llmCandidates = hash === '#/llm-candidates';

  if (objectMatch) {
    renderObjectDetail(decodeURIComponent(objectMatch[1]), decodeURIComponent(objectMatch[2]));
  } else if (folderMatch) {
    renderFolderIndex(decodeURIComponent(folderMatch[1]));
  } else if (schemaMatch) {
    renderSchemaDetail(decodeURIComponent(schemaMatch[1]));
  } else if (schemasIndex) {
    renderSchemasIndex();
  } else if (healthCoverage) {
    renderHealthCoverage();
  } else if (healthData) {
    renderHealthData();
  } else if (llmCandidates) {
    renderLlmCandidates();
  } else {
    detailEl.innerHTML = `
      <p class="hint">
        Pick an object from the search bar or a folder on the left, or pick a tab above.
      </p>`;
  }
  renderFolderList();
  highlightActiveTab(hash);
}

// Modder-pov blurbs surfaced at the top of each non-Explorer page. Title lines
// also appear as tab tooltips. Kept in one place so prose stays consistent.
const PAGE_BLURBS = {
  schemas:
    `<strong>Schemas</strong> — every reference rule the parser learned from <code>data/schemas/*-schema.json</code> and the <code>comment_mod/</code> overlay. ` +
    `Click a folder to see its per-field rules and how many edges each one produced. ` +
    `<em>Modder use:</em> when you're about to add a new field to a JSON file, look here first to see how similar fields are documented — the description text is what trains the parser to recognize cross-refs.`,
  coverage:
    `<strong>Extractor-integrity coverage</strong> — folders with zero out-edges are extractor blind spots: the data is loaded, but no schema rule tells the parser what's a reference. ` +
    `The candidates table below shows fields whose values look like cross-folder refs the schema doesn't yet cover. ` +
    `<em>Modder use:</em> when an object detail page seems empty, check here — your folder may need a schema overlay before its refs become visible. High-leverage candidates are the next overlays to write.`,
  'data-health':
    `<strong>Data health</strong> — refs to objects that don't exist (dangling), objects nothing references (orphans), and strNames that appear in multiple folders. ` +
    `Dangling and orphan rates are sometimes false positives (mod-only refs, top-level definitions), sometimes real data bugs. ` +
    `<em>Modder use:</em> if your mod's strName turns up dangling somewhere, you've got a typo or a missing dependency.`,
  llm:
    `<strong>LLM candidates</strong> — top objects by incoming-ref count, the highest-leverage targets for a folder template or per-object blurb. ` +
    `Each row has two clipboard buttons: copy a self-contained prompt, paste it into your LLM, paste the response into the template editor on the object's detail page. ` +
    `<em>Modder use:</em> the more incoming refs an object has, the more important its description is — start there when documenting a folder.`,
};

function pageBlurb(key) {
  const body = PAGE_BLURBS[key];
  return body ? `<div class="page-blurb">${body}</div>` : '';
}

// Per-folder anchor copy for folders whose name doesn't tell a modder what's
// inside. Currently seeded for the synthetic code-* folders; data folders rely
// on their schema descriptions / per-folder _README.md fallback.
const FOLDER_BLURBS = {
  'code-method':
    `<strong>code-method</strong> — one C# method in the game's source. The page lists every <code>strName</code> mention inside the method body, with file:line. ` +
    `<em>Modder use:</em> when you've changed a strName and want to find the code that consumes the literal.`,
  'code-class':
    `<strong>code-class</strong> — one C# class with literal <code>strName</code> references in its field initializers. ` +
    `Same shape as <code>code-method</code> but for class-level references that aren't inside a method (rare but real).`,
  'code-component':
    `<strong>code-component</strong> — one entry in the game's command table. The engine runs this when a condowner's <code>aUpdateCommands</code> line begins with <code>&lt;CommandName&gt;</code>. ` +
    `The page lists which condowners wire to it, what positional args it takes (with the data folder each one targets), and which conditions it manipulates.`,
};

function folderBlurb(folder) {
  const body = FOLDER_BLURBS[folder];
  return body ? `<div class="page-blurb">${body}</div>` : '';
}

function highlightActiveTab(hash) {
  const tabs = document.querySelectorAll('#tabs a');
  let active = 'home';
  if (hash === '#/schemas' || hash.startsWith('#/schema/')) active = 'schemas';
  else if (hash === '#/health/coverage') active = 'coverage';
  else if (hash === '#/health/data') active = 'data-health';
  else if (hash === '#/llm-candidates') active = 'llm';
  // Object / folder routes leave Explorer active.
  tabs.forEach(a => a.classList.toggle('active', a.dataset.tab === active));
}

/* ─── object detail ────────────────────────────────────────── */

// Tracks the last object detail page rendered so UX 1.6 filter state can be
// cleared when the user navigates to a *different* object (but preserved
// across renders triggered by clicking a pill on the same page).
let lastDetailId = null;

function renderObjectDetail(folder, strName) {
  const id = `${folder}:${strName}`;
  const node = nodesById.get(id);
  if (!node) {
    detailEl.innerHTML = `<p class="hint">No object known at <code>${escapeHtml(id)}</code>.</p>`;
    return;
  }
  if (id !== lastDetailId) {
    activeFilters.clear();
    lastDetailId = id;
  }

  if (isCodeFolder(folder)) {
    renderCodeNodeDetail(folder, strName, id, node);
    return;
  }

  const allOut = outgoing.get(id) || [];
  const allInc = incoming.get(id) || [];
  // PLAN-AST Phase 1: code-side incoming edges (literal hits in decomp) are
  // surfaced separately in renderCodeRefsBlock so the data-side "Referenced by"
  // block stays focused on data-to-data wiring.
  const out = allOut;
  const inc = allInc.filter(e => !isCodeRefEdge(e));

  const chatRef = `${folder}\\${strName}`;
  const props = (window.NODE_PROPS ?? {})[id];
  const isCodeEmitted = props && props.kind === 'code-emitted';
  const html = `
    <div class="detail-head">
      <div class="crumbs">${escapeHtml(folder)}</div>
      <h2>${escapeHtml(strName)}</h2>
      <div class="file">${escapeHtml(node.file)}</div>
      <button type="button" class="copy-ref" data-ref="${escapeHtml(chatRef)}" title="Copy '${escapeHtml(chatRef)}' to clipboard for pasting into chat">copy ref</button>
    </div>

    ${isCodeEmitted ? renderCodeEmittedHeader(folder, strName, props) : ''}
    ${renderPrefixExplainers(folder, strName)}
    ${renderFolderMismatchNote(folder, strName)}
    ${renderTemplateBlock(folder, strName, id)}
    ${isCodeEmitted ? '' : renderFieldsBlock(folder, props)}
    ${renderCodeRefsBlock(id)}

    <div class="refs-block">
      <h3>References out (${out.length})</h3>
      ${renderEdgeGroups(out, 'source-perspective', folder, `out/${id}`)}
    </div>

    <div class="refs-block">
      <h3>Referenced by (${inc.length})</h3>
      ${renderEdgeGroups(inc, 'target-perspective', folder, `in/${id}`)}
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
  // UX 1.3 — hide-descriptions toggle on the Fields block. Persists per-folder
  // in localStorage so a power user can mute Stat* descriptions without losing
  // them on loot/.
  detailEl.querySelectorAll('.fields-desc-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.folder;
      const next = !readFieldsBlockHidden(f);
      writeFieldsBlockHidden(f, next);
      renderRoute();
    });
  });
  // UX 1.6 — filter pills on incoming/outgoing ref panels. Click toggles a
  // pill in the active filter set; rerender the route to reapply.
  detailEl.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.dataset.panel;
      const dim = btn.dataset.dim;
      const value = btn.dataset.value;
      let state = activeFilters.get(panel);
      if (!state) { state = { folders: new Set(), strTypes: new Set() }; activeFilters.set(panel, state); }
      if (dim === 'clear') {
        state.folders.clear();
        state.strTypes.clear();
      } else if (dim === 'folder') {
        if (state.folders.has(value)) state.folders.delete(value); else state.folders.add(value);
      } else if (dim === 'strType') {
        if (state.strTypes.has(value)) state.strTypes.delete(value); else state.strTypes.add(value);
      }
      renderRoute();
    });
  });
  // UX 1.7 — DSL primer popovers on cond-string / loot-string / verb /
  // commandPos / portKey chips. Click to pin; click outside or × to dismiss.
  wireDslPrimers(detailEl);
  // UX 1.2 — per-prefix explainer banner dismiss. Persists to localStorage
  // keyed by explainer id, so dismissing on `StatGrav` hides it on every
  // other Stat* page across the site too.
  detailEl.querySelectorAll('.prefix-explainer .explainer-dismiss').forEach(btn => {
    btn.addEventListener('click', () => {
      const banner = btn.closest('.prefix-explainer');
      const id = banner?.dataset.explainerId;
      if (id) {
        writeExplainerDismissed(id, true);
        banner.remove();
      }
    });
  });
  // Wire copy-ref button — copies "<folder>\<strName>" for chat-paste.
  const copyBtn = detailEl.querySelector('.detail-head .copy-ref');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.ref);
        const orig = copyBtn.textContent;
        copyBtn.textContent = 'copied';
        copyBtn.classList.add('copied');
        setTimeout(() => { copyBtn.textContent = orig; copyBtn.classList.remove('copied'); }, 1500);
      } catch (err) {
        console.error('clipboard write failed', err);
        copyBtn.textContent = 'error';
      }
    });
  }
  // Wire template editor.
  wireTemplateBlock(folder, strName, id);
}

// PLAN-AST Phase 3.1A — code-emitted condition header. Synthesized for every
// RuntimeWiresTo target (in conditions/) that doesn't exist in data/conditions/.
// The producing component is captured as a scalar field by Program.BridgePhase2.
function renderCodeEmittedHeader(folder, strName, props) {
  const producer = props.producedBy || '';
  const producerLink = producer
    ? `<a href="#/o/${encodeURIComponent('code-component')}/${encodeURIComponent(producer)}" data-id="code-component:${escapeAttr(producer)}">code-component:${escapeHtml(producer)}</a>`
    : '<span class="muted">(unknown)</span>';
  return `
    <p class="page-blurb code-emitted-blurb">
      <strong>This condition isn't defined in <code>data/conditions/</code>.</strong>
      It's a code-emitted runtime signal — set / cleared by ${producerLink} via a dynamic
      <code>co.AddCondAmount(this.${escapeHtml(strName)}, …)</code>-style call whose first
      arg is driven by a guipropmap config key. The explorer surfaces it here so the
      cross-link from the guipropmaps that name it lands on a real page instead of
      <em>"No object known."</em>
    </p>
  `;
}

/* ─── code-side detail (PLAN-AST Phase 1) ──────────────────── */

const CODE_REF_KINDS = new Set(['LiteralInMethod', 'LiteralInClass']);
function isCodeRefEdge(edge) { return CODE_REF_KINDS.has(edge.kind); }

// Visual formatter for code-* node names. The graph IDs / strNames stay bare
// ("BodyTemp.Exposure") so overload-suffix disambiguation (#2, #3) and search
// keep working; this only affects what the modder sees rendered. Methods get
// a trailing "()" so "Exposure" reads as a callable rather than a field of
// BodyTemp; classes get nothing (the bare type name is unambiguous).
function formatCodeName(folder, strName) {
  if (folder === 'code-method') return `${strName}()`;
  return strName;
}

// Detail page for synthetic code-method / code-class nodes. Simpler shape than
// data nodes: no template / notes block, no incoming-data refs (a method is
// only ever the SOURCE of a literal-in-* edge). Outgoing edges list the data
// strNames the method body / class initializer mentions, with file:line pulled
// from the edge metadata so a modder can jump straight at the decomp source.
function renderCodeNodeDetail(folder, strName, id, node) {
  if (folder === 'code-component') {
    renderCodeComponentDetail(folder, strName, id, node);
    return;
  }
  const out = outgoing.get(id) || [];
  const fields = (window.NODE_PROPS ?? {})[id] ?? {};
  const lineRange = (fields.lineStart && fields.lineEnd)
    ? `${fields.lineStart}-${fields.lineEnd}` : '';
  const fileLine = lineRange
    ? `${node.file} : ${lineRange}`
    : node.file;
  const kindLabel = folder === 'code-class' ? 'class (initializer literals)' : 'method (body literals)';

  detailEl.innerHTML = `
    <div class="detail-head">
      <div class="crumbs">${escapeHtml(folder)}</div>
      <h2>${escapeHtml(formatCodeName(folder, strName))}</h2>
      <div class="file">${escapeHtml(fileLine)} · ${escapeHtml(kindLabel)}</div>
    </div>
    <p class="page-blurb">
      This page lists every reference this ${escapeHtml(folder === 'code-class' ? 'class initializer' : 'method body')}
      makes to data you can edit. Each row below is a hardcoded <code>strName</code> mention in the game's
      C# code; click through to see what depends on that name elsewhere. Useful when you've changed a strName
      and want to find what code expects it.
    </p>
    <div class="refs-block">
      <h3>String literals in body (${out.length})</h3>
      ${renderCodeOutgoing(out)}
    </div>
  `;

  detailEl.querySelectorAll('a[data-id]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = a.getAttribute('data-id');
      const [tf, tn] = splitId(target);
      window.location.hash = `#/o/${encodeURIComponent(tf)}/${encodeURIComponent(tn)}`;
    });
  });
}

// Detail page for code-component nodes (PLAN-AST Phase 2). Each node represents
// one entry in the CondOwner.AddCommand dispatcher table — i.e. one command a
// condowner's aUpdateCommands string can invoke. Renders three blocks:
//   - In-ports: positional arg specs from the dispatcher (typed where resolvable
//     via DataHandler.Get*; otherwise shown as untyped).
//   - Conditions touched: literal-string AddCond/RemCond/HasCond patterns
//     scanned out of the implementing class's method bodies.
//   - Wired-by: the condowners whose aUpdateCommands strings invoke this command.
function renderCodeComponentDetail(folder, strName, id, node) {
  const fields = (window.NODE_PROPS ?? {})[id] ?? {};
  const inPorts = Array.isArray(fields.inPorts) ? fields.inPorts : [];
  const runtimePorts = Array.isArray(fields.runtimePorts) ? fields.runtimePorts : [];
  const produces = Array.isArray(fields.produces) ? fields.produces : [];
  const arity = fields.arityMin ?? '?';
  const implType = fields.implementingType || '(none)';
  const dispLine = fields.dispatcherLine ?? '?';
  const dispFile = fields.dispatcherFile || '';
  const inc = (incoming.get(id) ?? []).filter(e => e.kind === 'WiresTo');
  const out = outgoing.get(id) ?? [];
  const condEdges = out.filter(e => e.kind === 'ProducesCondition' || e.kind === 'ConsumesCondition' || e.kind === 'ObservesCondition');

  // Group wired-by condowners — they're typically one edge per condowner+command,
  // so this is just a listing.
  const wiredCondowners = inc.map(e => {
    const [sf, sn] = splitId(e.source);
    return { sourceId: e.source, folder: sf, name: sn, raw: e.metadata?.raw ?? '' };
  });

  // Group cond edges by role for readability.
  const byRole = { produces: [], consumes: [], observes: [] };
  for (const e of condEdges) {
    const role = e.kind === 'ProducesCondition' ? 'produces'
      : e.kind === 'ConsumesCondition' ? 'consumes' : 'observes';
    byRole[role].push(e);
  }

  detailEl.innerHTML = `
    <div class="detail-head">
      <div class="crumbs">${escapeHtml(folder)}</div>
      <h2>${escapeHtml(strName)}</h2>
      <div class="file">implementing type: <code>${escapeHtml(implType)}</code> · arity ≥ ${escapeHtml(String(arity))} · dispatcher: ${escapeHtml(dispFile)}:${escapeHtml(String(dispLine))}</div>
    </div>
    <p class="page-blurb">
      A <code>code-component</code> is one entry in the game's command table — what the engine does when a
      condowner's <code>aUpdateCommands</code> line begins with <code>&lt;${escapeHtml(strName)}&gt;</code>.
      Below: which condowners wire to it, what positional args it accepts (with the data folder each one
      targets), and which conditions the component manipulates.
    </p>

    <div class="refs-block">
      <h3>In-ports (${inPorts.length})</h3>
      ${renderInPorts(inPorts)}
    </div>

    <div class="refs-block">
      <h3>Runtime ports (${runtimePorts.length})
        <span class="muted-note">— dict keys this component reads from its guipropmap at runtime, i.e. the inputs you can set in panel UI in-game</span>
      </h3>
      ${renderRuntimePorts(runtimePorts)}
    </div>

    <div class="refs-block">
      <h3>Conditions touched (${condEdges.length})</h3>
      ${renderConditionRoles(byRole)}
    </div>

    <div class="refs-block">
      <h3>Wired by ${wiredCondowners.length} condowner${wiredCondowners.length === 1 ? '' : 's'} via aUpdateCommands</h3>
      ${renderWiredCondowners(wiredCondowners)}
    </div>
  `;

  detailEl.querySelectorAll('a[data-id]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = a.getAttribute('data-id');
      const [tf, tn] = splitId(target);
      window.location.hash = `#/o/${encodeURIComponent(tf)}/${encodeURIComponent(tn)}`;
    });
  });
}

function renderRuntimePorts(rports) {
  if (rports.length === 0) return '<p class="empty">no dict-keyed runtime reads detected</p>';
  // Sort: typed-and-player-wired first (they're the highest-leverage), then
  // typed config keys, then untyped at the bottom.
  const sorted = [...rports].sort((a, b) => {
    const aw = a.playerWired ? 0 : (a.targetFolder ? 1 : 2);
    const bw = b.playerWired ? 0 : (b.targetFolder ? 1 : 2);
    return aw - bw || a.key.localeCompare(b.key);
  });
  const rows = sorted.map(p => {
    const folder = p.targetFolder || '';
    const folderHtml = folder
      ? `<a href="#/f/${encodeURIComponent(folder)}">${escapeHtml(folder)}</a>`
      : '<span class="muted">untyped</span>';
    const sourceLabel = p.source && p.source !== 'untyped'
      ? `<span class="muted">(${escapeHtml(p.source)})</span>` : '';
    const playerBadge = p.playerWired
      ? '<span class="player-wired-badge" title="strInput0N — player edits this in-game; default value is empty">player-wired</span>'
      : '';
    return `<li>
      <span class="port-key">${escapeHtml(p.key)}</span>
      → ${folderHtml} ${sourceLabel} ${playerBadge}
    </li>`;
  }).join('');
  return `<ul class="ports-list runtime-ports-list">${rows}</ul>`;
}

function renderInPorts(inPorts) {
  if (inPorts.length === 0) return '<p class="empty">no positional args</p>';
  const rows = inPorts.map(p => {
    const folder = p.targetFolder || '';
    const folderHtml = folder
      ? `<a href="#/f/${encodeURIComponent(folder)}">${escapeHtml(folder)}</a>`
      : '<span class="muted">untyped</span>';
    const sourceLabel = p.source && p.source !== 'untyped'
      ? `<span class="muted">(${escapeHtml(p.source)})</span>` : '';
    return `<li>
      <span class="port-index">[${escapeHtml(String(p.index))}]</span>
      → ${folderHtml} ${sourceLabel}
    </li>`;
  }).join('');
  return `<ul class="ports-list">${rows}</ul>`;
}

function renderConditionRoles(byRole) {
  const sections = ['produces', 'consumes', 'observes'].map(role => {
    const items = byRole[role];
    if (items.length === 0) return '';
    const rows = items.sort((a, b) => a.target.localeCompare(b.target)).map(e => {
      const [tf, tn] = splitId(e.target);
      const link = nodesById.has(e.target)
        ? `<a href="#/o/${encodeURIComponent(tf)}/${encodeURIComponent(tn)}" data-id="${escapeAttr(e.target)}">${escapeHtml(tn)}</a>`
        : `<span class="dangling">${escapeHtml(tn)}</span>`;
      const verb = e.metadata?.verb ?? e.sourceField ?? '';
      const method = e.metadata?.method ?? '';
      const line = e.metadata?.line ?? '';
      return `<li>${link} <span class="meta">[${escapeHtml(verb)} in ${escapeHtml(method)}:${escapeHtml(String(line))}]</span></li>`;
    }).join('');
    return `<div class="cond-role"><h4>${role} (${items.length})</h4><ul>${rows}</ul></div>`;
  });
  const nonEmpty = sections.filter(s => s !== '');
  return nonEmpty.length === 0 ? '<p class="empty">no literal-string AddCond/RemCond/HasCond calls in this component</p>' : nonEmpty.join('');
}

function renderWiredCondowners(rows) {
  if (rows.length === 0) return '<p class="empty">no condowners reference this component</p>';
  const sorted = rows.sort((a, b) => a.name.localeCompare(b.name));
  const items = sorted.slice(0, 200).map(r => `<li>
    <a href="#/o/${encodeURIComponent(r.folder)}/${encodeURIComponent(r.name)}" data-id="${escapeAttr(r.sourceId)}">${escapeHtml(r.name)}</a>
    <span class="meta"><code>${escapeHtml(r.raw)}</code></span>
  </li>`).join('');
  const truncated = sorted.length > 200 ? `<p class="meta">+${sorted.length - 200} more</p>` : '';
  return `<ul class="wired-list">${items}</ul>${truncated}`;
}

function renderCodeOutgoing(edges) {
  if (edges.length === 0) return '<p class="empty">none</p>';
  // Sort by line so the listing matches reading order in the decomp file.
  const sorted = [...edges].sort((a, b) => {
    const la = (a.metadata && a.metadata.line) ?? 0;
    const lb = (b.metadata && b.metadata.line) ?? 0;
    return la - lb;
  });

  // Bucket adjacent edges by their structural-parent containerKey so an
  // array initializer like `aDelaysIAReplaceOk = { "DropItem", "DropItemStack",
  // ... }` renders as one labeled block instead of N look-alike rows.
  // Edges without a containerKey stand alone in their own single-edge bucket.
  const buckets = [];
  for (const e of sorted) {
    const key = e.metadata?.containerKey ?? '';
    const last = buckets[buckets.length - 1];
    if (key && last && last.key === key) {
      last.edges.push(e);
    } else {
      buckets.push({ key, edges: [e] });
    }
  }

  return `<ul class="code-out">${buckets.map(b => b.edges.length > 1 ? renderCodeOutgoingGroup(b) : renderCodeOutgoingSingle(b.edges[0])).join('')}</ul>`;
}

function renderCodeOutgoingSingle(e) {
  const [tf, tn] = splitId(e.target);
  const known = nodesById.has(e.target);
  const link = known
    ? `<a href="#/o/${encodeURIComponent(tf)}/${encodeURIComponent(tn)}" data-id="${escapeAttr(e.target)}">${escapeHtml(tn)}</a>`
    : `<span class="dangling" title="not in index">${escapeHtml(tn)}</span>`;
  const altSuffix = known ? renderAltFolderSuffix(tf, tn) : '';
  const line = (e.metadata && e.metadata.line) ?? '?';
  const text = ((e.metadata && e.metadata.text) ?? '').trim();
  return `<li>
    <div><span class="arrow">→</span><span class="field">${escapeHtml(tf)}</span>:${link}${altSuffix}
      <span class="meta">[line ${escapeHtml(String(line))}]</span></div>
    <pre class="code-line">${escapeHtml(text)}</pre>
  </li>`;
}

function renderCodeOutgoingGroup(bucket) {
  const first = bucket.edges[0].metadata ?? {};
  const label = first.containerLabel || '{ … }';
  const lineStart = first.containerLineStart ?? bucket.edges[0].metadata?.line;
  const lineEnd = first.containerLineEnd ?? bucket.edges[bucket.edges.length - 1].metadata?.line;
  const lineRange = lineStart === lineEnd
    ? `line ${lineStart}`
    : `lines ${lineStart}–${lineEnd}`;
  const rows = bucket.edges.map(e => {
    const [tf, tn] = splitId(e.target);
    const known = nodesById.has(e.target);
    const link = known
      ? `<a href="#/o/${encodeURIComponent(tf)}/${encodeURIComponent(tn)}" data-id="${escapeAttr(e.target)}">${escapeHtml(tn)}</a>`
      : `<span class="dangling" title="not in index">${escapeHtml(tn)}</span>`;
    const altSuffix = known ? renderAltFolderSuffix(tf, tn) : '';
    return `<li><span class="arrow">→</span><span class="field">${escapeHtml(tf)}</span>:${link}${altSuffix}</li>`;
  }).join('');
  return `<li class="code-out-group">
    <div class="group-head"><code>${escapeHtml(label)}</code> <span class="meta">[${escapeHtml(lineRange)}]</span></div>
    <ul>${rows}</ul>
  </li>`;
}

/* ─── template engine ──────────────────────────────────────── */
//
// Two surfaces per object:
//   1. Folder-wide template — click to edit, applies to every object in this folder.
//      Mustache-style {{path}} interpolation against a context built from the
//      object's fields + outgoing/incoming ref groups.
//   2. Per-object note — free-form, per (folder, strName).
//
// Storage: localStorage. Templates live under "template:<folder>", notes under
// "note:<folder>:<strName>". Export buttons produce text drops for
// comment_mod/templates/<folder>.tmpl and comment_mod/notes/<folder>/<strName>.md
// — paste-to-promote workflow, mirrors the LLM-candidate page.

function templateKey(folder) { return `template:${folder}`; }
function noteKey(folder, strName) { return `note:${folder}:${strName}`; }

function getTemplate(folder) { return localStorage.getItem(templateKey(folder)) ?? ''; }
function setTemplate(folder, text) { localStorage.setItem(templateKey(folder), text); }
function getNote(folder, strName) { return localStorage.getItem(noteKey(folder, strName)) ?? ''; }
function setNote(folder, strName, text) { localStorage.setItem(noteKey(folder, strName), text); }

function buildTemplateContext(folder, strName, id) {
  const node = nodesById.get(id);
  const fields = (window.NODE_PROPS ?? {})[id] ?? {};
  const outAll = outgoing.get(id) ?? [];
  const inAll = incoming.get(id) ?? [];
  const outRefs = {};
  for (const e of outAll) {
    const k = e.sourceField;
    if (!outRefs[k]) outRefs[k] = { length: 0, first: '', list: [] };
    outRefs[k].length++;
    if (outRefs[k].first === '') outRefs[k].first = e.target;
    outRefs[k].list.push(e.target);
  }
  const inRefs = {};
  for (const e of inAll) {
    const k = e.sourceField;
    if (!inRefs[k]) inRefs[k] = { length: 0, first: '', list: [] };
    inRefs[k].length++;
    if (inRefs[k].first === '') inRefs[k].first = e.source;
    inRefs[k].list.push(e.source);
  }
  return {
    strName,
    folder,
    file: node?.file ?? '',
    outCount: outAll.length,
    inCount: inAll.length,
    fields,
    outRefs,
    inRefs,
  };
}

// Mustache-lite: {{path.to.value}} — dot-path lookup, '.length' suffix supported
// natively because objects can have a length property. Missing values render
// as empty string; never throws.
function applyTemplate(template, ctx) {
  return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, path) => {
    const parts = path.split('.');
    let v = ctx;
    for (const p of parts) {
      if (v == null) return '';
      v = v[p];
    }
    if (v == null) return '';
    return String(v);
  });
}

// "Magic words available" listing for the editor sidebar. Generated from the
// current object's context so users can click-to-insert fields that actually exist.
function magicWords(ctx) {
  const words = ['strName', 'folder', 'file', 'outCount', 'inCount'];
  for (const k of Object.keys(ctx.fields)) words.push(`fields.${k}`);
  for (const k of Object.keys(ctx.outRefs)) {
    words.push(`outRefs.${k}.length`);
    words.push(`outRefs.${k}.first`);
  }
  for (const k of Object.keys(ctx.inRefs)) {
    words.push(`inRefs.${k}.length`);
    words.push(`inRefs.${k}.first`);
  }
  return words;
}

function renderTemplateBlock(folder, strName, id) {
  const ctx = buildTemplateContext(folder, strName, id);
  const tmpl = getTemplate(folder);
  const note = getNote(folder, strName);

  const rendered = tmpl ? applyTemplate(tmpl, ctx) : '';
  const renderedHtml = tmpl
    ? `<div class="rendered">${escapeHtml(rendered)}</div>`
    : `<div class="rendered empty">No folder template yet for <code>${escapeHtml(folder)}</code> — click <em>Edit template</em> to write one. Magic words are listed in the editor.</div>`;

  const noteHtml = note
    ? `<div class="rendered">${escapeHtml(note)}</div>`
    : `<div class="rendered empty">No per-object note yet — click <em>Edit note</em> to add one.</div>`;

  return `
    <div class="template-block" data-folder="${escapeAttr(folder)}" data-strname="${escapeAttr(strName)}">
      <h3>
        Template (folder)
        <span class="head-actions">
          <button data-action="edit-template">edit template</button>
          <button data-action="export-template">copy for comment_mod</button>
        </span>
      </h3>
      <div class="template-view" data-which="template">${renderedHtml}</div>

      <h3 style="margin-top:1rem;">
        Note (per object)
        <span class="head-actions">
          <button data-action="edit-note">edit note</button>
          <button data-action="export-note">copy for comment_mod</button>
        </span>
      </h3>
      <div class="template-view" data-which="note">${noteHtml}</div>
    </div>
  `;
}

function wireTemplateBlock(folder, strName, id) {
  const block = detailEl.querySelector('.template-block');
  if (!block) return;

  block.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      switch (action) {
        case 'edit-template': openEditor(block, folder, strName, id, 'template'); break;
        case 'edit-note':     openEditor(block, folder, strName, id, 'note'); break;
        case 'export-template': exportToClipboard(btn, getTemplate(folder), `comment_mod/templates/${folder}.tmpl`); break;
        case 'export-note':     exportToClipboard(btn, getNote(folder, strName), `comment_mod/notes/${folder}/${strName}.md`); break;
      }
    });
  });
}

function openEditor(block, folder, strName, id, which) {
  const view = block.querySelector(`.template-view[data-which="${which}"]`);
  if (!view) return;
  const current = which === 'template' ? getTemplate(folder) : getNote(folder, strName);
  const ctx = buildTemplateContext(folder, strName, id);
  const words = which === 'template' ? magicWords(ctx) : null;

  const legend = words
    ? `<div class="legend">
         <div class="legend-title">click to insert · {{magic-word}}</div>
         <ul>
           ${words.map(w => `<li data-word="${escapeAttr(w)}">{{${escapeHtml(w)}}}</li>`).join('')}
         </ul>
       </div>`
    : `<div class="legend">
         <div class="legend-title">free-form note</div>
         <p style="color:var(--muted);margin:0">Plain text. No magic-word interpolation here — this is just a per-object jotting.</p>
       </div>`;

  view.innerHTML = `
    <div class="editor">
      <div>
        <textarea data-edit="${which}">${escapeHtml(current)}</textarea>
        <div class="editor-actions">
          <button data-do="save">save</button>
          <button data-do="cancel">cancel</button>
        </div>
      </div>
      ${legend}
    </div>
  `;

  const ta = view.querySelector('textarea');
  ta.focus();
  // Live-preview by saving on blur — but keep explicit save buttons for clarity.

  view.querySelectorAll('.legend li[data-word]').forEach(li => {
    li.addEventListener('click', () => {
      const word = `{{${li.dataset.word}}}`;
      const start = ta.selectionStart, end = ta.selectionEnd;
      ta.value = ta.value.slice(0, start) + word + ta.value.slice(end);
      ta.focus();
      const newPos = start + word.length;
      ta.setSelectionRange(newPos, newPos);
    });
  });

  view.querySelector('button[data-do="save"]').addEventListener('click', () => {
    const text = ta.value;
    if (which === 'template') setTemplate(folder, text);
    else setNote(folder, strName, text);
    // Re-render the whole detail page so the new template/note appears rendered.
    renderObjectDetail(folder, strName);
  });
  view.querySelector('button[data-do="cancel"]').addEventListener('click', () => {
    renderObjectDetail(folder, strName);
  });
}

async function exportToClipboard(btn, text, hintPath) {
  if (!text) {
    const orig = btn.textContent;
    btn.textContent = '(empty — nothing to copy)';
    setTimeout(() => { btn.textContent = orig; }, 1500);
    return;
  }
  // Prefix a comment with the suggested file path so the recipient knows where to paste.
  const payload = `# paste into ${hintPath}\n${text}`;
  try {
    await navigator.clipboard.writeText(payload);
    btn.classList.add('copied');
    const orig = btn.textContent;
    btn.textContent = `copied — paste to ${hintPath}`;
    setTimeout(() => { btn.classList.remove('copied'); btn.textContent = orig; }, 2000);
  } catch (e) {
    console.error('clipboard write failed', e);
    btn.textContent = 'error';
  }
}

// In-memory filter state. Keyed by a panel id (e.g. "in/conditions:StatGrav"
// or "out/loot:CONDApatheticPer"). Reset on every renderObjectDetail since
// pills are session/page-scoped, not persistent.
let activeFilters = new Map();

function renderEdgeGroups(edges, perspective, viewFolder, panelId) {
  if (edges.length === 0) return '<p class="empty">none</p>';

  // UX 1.6 — auto-suggest filter pills when the panel has more than ~5 rows.
  // For target-perspective (incoming refs), pills filter on SOURCE folder +
  // SOURCE strType. For source-perspective (outgoing), they filter on TARGET.
  const PILL_THRESHOLD = 5;
  let pillsHtml = '';
  let visibleEdges = edges;
  const filterState = activeFilters.get(panelId) || { folders: new Set(), strTypes: new Set() };
  if (edges.length > PILL_THRESHOLD) {
    const folderCounts = new Map();
    const strTypeCounts = new Map();
    for (const e of edges) {
      const otherId = perspective === 'source-perspective' ? e.target : e.source;
      const [otherFolder] = splitId(otherId);
      folderCounts.set(otherFolder, (folderCounts.get(otherFolder) || 0) + 1);
      const otherProps = (window.NODE_PROPS ?? {})[otherId];
      const t = otherProps && typeof otherProps.strType === 'string' ? otherProps.strType : null;
      if (t) strTypeCounts.set(t, (strTypeCounts.get(t) || 0) + 1);
    }
    if (folderCounts.size > 1 || strTypeCounts.size > 0) {
      const matches = (e) => {
        const otherId = perspective === 'source-perspective' ? e.target : e.source;
        const [f] = splitId(otherId);
        const props = (window.NODE_PROPS ?? {})[otherId];
        const t = props && typeof props.strType === 'string' ? props.strType : null;
        if (filterState.folders.size > 0 && !filterState.folders.has(f)) return false;
        if (filterState.strTypes.size > 0 && (!t || !filterState.strTypes.has(t))) return false;
        return true;
      };
      visibleEdges = edges.filter(matches);

      const folderPills = [...folderCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([f, n]) => {
          const active = filterState.folders.has(f) ? ' active' : '';
          return `<button type="button" class="filter-pill${active}" data-panel="${escapeAttr(panelId)}" data-dim="folder" data-value="${escapeAttr(f)}" title="Only ${escapeAttr(perspective === 'source-perspective' ? 'targets' : 'sources')} in ${escapeAttr(f)}/">${escapeHtml(f)} <span class="pill-count">${n}</span></button>`;
        }).join('');
      const strTypePills = [...strTypeCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([t, n]) => {
          const active = filterState.strTypes.has(t) ? ' active' : '';
          return `<button type="button" class="filter-pill strtype${active}" data-panel="${escapeAttr(panelId)}" data-dim="strType" data-value="${escapeAttr(t)}" title="Only entries with strType: ${escapeAttr(t)}">strType:${escapeHtml(t)} <span class="pill-count">${n}</span></button>`;
        }).join('');
      const hasActive = filterState.folders.size > 0 || filterState.strTypes.size > 0;
      const clearBtn = hasActive
        ? `<button type="button" class="filter-pill clear" data-panel="${escapeAttr(panelId)}" data-dim="clear">clear filters</button>`
        : '';
      const visibleHint = hasActive
        ? `<span class="filter-status">${visibleEdges.length} of ${edges.length}</span>`
        : '';
      pillsHtml = `
        <div class="filter-pills">
          ${folderPills}${strTypePills}${clearBtn}${visibleHint}
        </div>
      `;
    }
  }

  if (visibleEdges.length === 0) {
    return `${pillsHtml}<p class="empty">no edges match the active filters</p>`;
  }

  // Group by sourceField (perspective-source) or by sourceField as well — same key, different meaning.
  const groups = new Map();
  for (const e of visibleEdges) {
    const key = e.sourceField;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e);
  }

  const sortedGroupKeys = [...groups.keys()].sort();
  const groupsHtml = sortedGroupKeys.map(field => {
    const items = groups.get(field);
    // For source-perspective, the field is on the current folder.
    // For target-perspective, the field is on the source object (could be any folder).
    const descLookupFolder = perspective === 'source-perspective'
      ? viewFolder
      : (items[0]?.source.split(':', 1)[0] || viewFolder);
    const desc = ruleDescriptions.get(`${descLookupFolder}:${field}`);
    const titleAttr = desc ? ` title="${escapeAttr(desc)}"` : '';
    return `
      <div class="group">
        <div class="group-head"${titleAttr}>${escapeHtml(field)} · ${items.length}</div>
        <ul>
          ${items.map(e => renderEdgeRow(e, perspective)).join('')}
        </ul>
      </div>
    `;
  }).join('');
  return `${pillsHtml}${groupsHtml}`;
}

// PLAN-AST Phase 1: code refs are now real graph edges (LiteralInMethod /
// LiteralInClass), not a sidecar dict. Read the incoming edges, group by the
// source code-method/code-class node, render with file:line pulled from each
// edge's metadata. Falls back to legacy window.CODE_REFS only if no edges
// exist (lets pre-Phase-1 generated graphs still display refs).
//
// Phase 3.1C — within each source group, sibling edges sharing the same
// metadata.containerKey collapse into one block (mirrors renderCodeOutgoing's
// Phase 1.1 logic). Sibling-literal patterns like
// `co.GetGUIPropMap("FFWD", null, …)` called twice in the same arg list, or
// a `new[] { … }` array with multiple matches, render as one labeled block
// instead of N near-identical rows.
function renderCodeRefsBlock(id) {
  const inc = incoming.get(id) ?? [];
  const codeEdges = inc.filter(isCodeRefEdge);
  if (codeEdges.length === 0) return renderLegacyCodeRefsBlock(id);

  const bySource = new Map();
  for (const e of codeEdges) {
    if (!bySource.has(e.source)) bySource.set(e.source, []);
    bySource.get(e.source).push(e);
  }
  const sortedSourceIds = [...bySource.keys()].sort();
  const items = sortedSourceIds.map(sourceId => {
    const sourceNode = nodesById.get(sourceId);
    const [sFolder, sName] = splitId(sourceId);
    const file = sourceNode?.file ?? '';
    const kindLabel = sFolder === 'code-class' ? 'class' : 'method';
    const link = `<a href="#/o/${encodeURIComponent(sFolder)}/${encodeURIComponent(sName)}" data-id="${escapeAttr(sourceId)}">${escapeHtml(formatCodeName(sFolder, sName))}</a>`;
    const sortedEdges = bySource.get(sourceId)
      .sort((a, b) => ((a.metadata?.line ?? 0) - (b.metadata?.line ?? 0)));

    // Bucket adjacent edges by their structural-parent containerKey so an
    // array initializer / arg list with multiple matching literals renders
    // as one block instead of N look-alike rows.
    const buckets = [];
    for (const e of sortedEdges) {
      const ck = e.metadata?.containerKey ?? '';
      const last = buckets[buckets.length - 1];
      if (ck && last && last.key === ck) {
        last.edges.push(e);
      } else {
        buckets.push({ key: ck, edges: [e] });
      }
    }
    const occurrences = buckets.map(b => {
      if (b.edges.length > 1) return renderCodeRefsBlockGroup(b, file);
      const e = b.edges[0];
      const line = e.metadata?.line ?? '?';
      // Defensive trim — older indexers stored TrimEnd'd lines (leading
      // tabs preserved). New indexer emits Trim'd lines.
      const text = (e.metadata?.text ?? '').trim();
      return `<div class="code-loc">${escapeHtml(file)}:${escapeHtml(String(line))}</div>
              <pre class="code-line">${escapeHtml(text)}</pre>`;
    }).join('');
    return `<li>
      <div class="code-source">${link} <span class="muted">(${kindLabel})</span></div>
      ${occurrences}
    </li>`;
  }).join('');

  return `
    <div class="code-refs-block">
      <h3>Code references (${codeEdges.length})
        <span class="muted-note">— this strName appears as a hardcoded literal in the game's C# code</span>
      </h3>
      <ul>${items}</ul>
    </div>
  `;
}

// One bucket of N≥2 sibling edges from the same source sharing a
// containerKey. The labeled header (containerLabel, lineRange) replaces
// the per-edge file:line snippets — the rows below show each individual
// literal hit's line and trimmed source text.
function renderCodeRefsBlockGroup(bucket, file) {
  const meta = bucket.edges[0].metadata ?? {};
  const label = meta.containerLabel || '{ … }';
  const lineStart = meta.containerLineStart ?? bucket.edges[0].metadata?.line;
  const lineEnd = meta.containerLineEnd ?? bucket.edges[bucket.edges.length - 1].metadata?.line;
  const lineRange = lineStart === lineEnd
    ? `line ${lineStart}`
    : `lines ${lineStart}–${lineEnd}`;
  const inner = bucket.edges.map(e => {
    const line = e.metadata?.line ?? '?';
    const text = (e.metadata?.text ?? '').trim();
    return `<div class="code-loc">${escapeHtml(file)}:${escapeHtml(String(line))}</div>
            <pre class="code-line">${escapeHtml(text)}</pre>`;
  }).join('');
  return `<div class="code-refs-group">
    <div class="group-head"><code>${escapeHtml(label)}</code> <span class="meta">[${escapeHtml(lineRange)}]</span></div>
    ${inner}
  </div>`;
}

// Legacy path: window.CODE_REFS produced by utils/python/emit_code_refs.py.
// Kept so a graph.js generated by an older Builder still shows code references
// if the Python script has run. Phase 1 makes the AST-derived edges
// authoritative; this is only used when the new edges aren't present.
function renderLegacyCodeRefsBlock(id) {
  const [, strName] = splitId(id);
  const refs = (window.CODE_REFS ?? {})[strName];
  if (!refs || refs.length === 0) return '';
  const rows = refs.map(r => `<li>
    <span class="code-loc">${escapeHtml(r.file)}:${r.line}</span>
    <pre class="code-line">${escapeHtml(r.text)}</pre>
  </li>`).join('');
  return `
    <div class="code-refs-block">
      <h3>Code references (${refs.length})
        <span class="muted-note">— legacy code_refs.js (regex-grep); upgrade by running the Builder against ./decomp/</span>
      </h3>
      <ul>${rows}</ul>
    </div>
  `;
}

function renderFieldsBlock(folder, fields) {
  // node.fields is an object of scalar key/value pairs. Could be missing (small payload).
  if (!fields || typeof fields !== 'object' || Object.keys(fields).length === 0) {
    return '';
  }
  const keys = Object.keys(fields).sort();
  // UX 1.3 — collapsibility toggle persisted per-folder so a power user
  // landing on Stat* pages can hide descriptions site-wide for that folder
  // without losing them on, say, loot/. Default = expanded (newcomers don't
  // know to hover).
  const hidden = readFieldsBlockHidden(folder);
  const rows = keys.map(k => {
    const v = fields[k];
    const desc = ruleDescriptions.get(`${folder}:${k}`);
    const titleAttr = desc ? ` title="${escapeAttr(desc)}"` : '';

    let valueText;
    if (v === null) {
      valueText = '<em class="muted">null</em>';
    } else {
      const resolved = resolveAutoDetectedValue(folder, k, String(v));
      if (resolved) {
        // Render as link with auto-detected badge. Tooltip names the candidate
        // hit-rate so you can judge confidence.
        const tipParts = [
          `auto-detected: ${resolved.candidate.fieldPath} → ${resolved.targetFolder}`,
          `hit-rate ${(resolved.candidate.targets[0]?.hitRate * 100).toFixed(0)}%`,
          `${resolved.candidate.distinctValues} distinct / ${resolved.candidate.sampleSize} samples`,
          'no schema rule yet',
        ];
        const altSuffix = renderAltFolderSuffix(resolved.targetFolder, String(v));
        valueText =
          `<a class="auto-detected" href="#/o/${encodeURIComponent(resolved.targetFolder)}/${encodeURIComponent(String(v))}" title="${escapeAttr(tipParts.join(' — '))}">` +
          `<span class="folder-prefix">${escapeHtml(resolved.targetFolder)}:</span>${escapeHtml(String(v))}` +
          `<span class="auto-badge" aria-label="auto-detected, no schema rule">🔍</span>` +
          `</a>${altSuffix}`;
      } else {
        valueText = escapeHtml(String(v));
      }
    }
    const descRow = desc
      ? `<div class="field-desc">${escapeHtml(desc)}</div>`
      : '';
    return `<li class="field-row">
      <div class="field-line">
        <span class="field-name"${titleAttr}>${escapeHtml(k)}</span>
        <span class="field-value">${valueText}</span>
      </div>
      ${descRow}
    </li>`;
  }).join('');
  const descCount = keys.filter(k => ruleDescriptions.has(`${folder}:${k}`)).length;
  const toggleLabel = hidden
    ? `Show ${descCount} description${descCount === 1 ? '' : 's'}`
    : `Hide ${descCount} description${descCount === 1 ? '' : 's'}`;
  const toggleHtml = descCount > 0
    ? `<button type="button" class="fields-desc-toggle" data-folder="${escapeAttr(folder)}">${escapeHtml(toggleLabel)}</button>`
    : '';
  return `
    <div class="fields-block ${hidden ? 'descriptions-hidden' : ''}">
      <h3>Fields (${keys.length})${toggleHtml ? ' ' + toggleHtml : ''}</h3>
      <ul>${rows}</ul>
    </div>
  `;
}

const FIELDS_BLOCK_HIDDEN_KEY = 'fieldsBlockDescHidden';
function readFieldsBlockHidden(folder) {
  try {
    const raw = localStorage.getItem(FIELDS_BLOCK_HIDDEN_KEY);
    if (!raw) return false;
    const set = new Set(JSON.parse(raw));
    return set.has(folder);
  } catch { return false; }
}
function writeFieldsBlockHidden(folder, hidden) {
  try {
    const raw = localStorage.getItem(FIELDS_BLOCK_HIDDEN_KEY);
    const set = new Set(raw ? JSON.parse(raw) : []);
    if (hidden) set.add(folder); else set.delete(folder);
    localStorage.setItem(FIELDS_BLOCK_HIDDEN_KEY, JSON.stringify([...set]));
  } catch {}
}

// Returns { targetFolder, candidate } if `value` resolves to a known node in
// any of the candidate's target folders. Used to render auto-detected links
// inline on the Fields block. Walks targets in order of declared hit-rate.
function resolveAutoDetectedValue(folder, fieldName, value) {
  const cand = autoScalarByKey.get(`${folder}:${fieldName}`);
  if (!cand || !cand.targets) return null;
  for (const t of cand.targets) {
    if (nodesById.has(`${t.targetFolder}:${value}`)) {
      return { targetFolder: t.targetFolder, candidate: cand };
    }
  }
  return null;
}

function renderEdgeRow(edge, perspective) {
  const linkId = perspective === 'source-perspective' ? edge.target : edge.source;
  const known = nodesById.has(linkId);
  const [linkFolder, linkName] = splitId(linkId);

  const linkHtml = known
    ? `<a href="#/o/${encodeURIComponent(linkFolder)}/${encodeURIComponent(linkName)}" data-id="${escapeAttr(linkId)}">${escapeHtml(formatCodeName(linkFolder, linkName))}</a>`
    : `<span class="dangling" title="not in index">${escapeHtml(linkName)}</span>`;

  // UX 1.5 — folder badge with stable per-folder color (picked via hash from a
  // ~12-color palette). Replaces the prior plain `<span class="field">`. The
  // strType badge appears alongside when the *other* node has a strType field
  // (e.g. on Loot entries — strType: condition / item / interaction / ...).
  const folderTag = renderFolderBadge(linkFolder);
  const strTypeTag = renderStrTypeBadge(linkId);
  const altSuffix = known ? renderAltFolderSuffix(linkFolder, linkName) : '';
  const meta = edge.metadata ? renderMetadata(edge.metadata) : '';
  const arrow = perspective === 'source-perspective' ? '→' : '←';
  // PLAN-AST Phase 3 — runtime-wired edges render dashed; the binding is
  // either set by data-author defaults in the guipropmap or established at
  // game-runtime by the player.
  const isRuntime = edge.kind === 'RuntimeWiresTo';
  const liClass = isRuntime ? ' class="runtime-edge"' : '';

  return `<li${liClass}><span class="arrow">${arrow}</span>${folderTag}${strTypeTag} ${linkHtml}${altSuffix}${meta}</li>`;
}

// UX 1.2 — per-prefix explainer banners. Keyed on strName naming convention
// patterns (Stat*, Thresh*, COND*, Itm*, ACT*, DRUG*). Each banner is
// dismissible per-prefix-class via localStorage so a user who clicks "got it"
// on `StatGrav` won't see the same banner on `StatHunger`. Default = visible
// (newcomers don't know to expect a banner; power users dismiss).
//
// Each entry: { id, prefix: regex, folders?: [restrict to these folders],
//   title, body, wikiPage?, wikiSlug? }. Order matters — first match wins,
//   so list more-specific patterns ahead of broader ones.
const PREFIX_EXPLAINERS = [
  {
    id: 'thresh-conditions',
    prefix: /^Thresh[A-Z]/,
    folders: ['conditions', 'conditions_simple'],
    title: 'About threshold-shift conditions',
    body: 'An entity holding a Thresh<StatName> condition has the trigger thresholds for <StatName> shifted by the cond-string\'s value. Higher value = more tolerance before consequences fire. Modders typically tune G-LOC, hunger tolerance, etc. by editing values on existing Thresh* entries — not by adding new ones.',
    wikiPage: 'Conditions',
    wikiSlug: 'Conditions',
  },
  {
    id: 'stat-conditions',
    prefix: /^Stat[A-Z]/,
    folders: ['conditions', 'conditions_simple'],
    title: 'About Stat conditions',
    body: 'Stat conditions hold a continuous numeric value the game tracks every tick. The stat itself is rarely tuned directly — instead modders adjust the Thresh<StatName> conditions that shift when this stat triggers in-game consequences. Visibility in the needs panel is controlled by nDisplaySelf (0 = hidden when healthy, 1 = secondary list, 2 = primary).',
    wikiPage: 'Conditions',
    wikiSlug: 'Conditions',
  },
  {
    id: 'dc-conditions',
    prefix: /^Dc[A-Z]/,
    folders: ['conditions', 'conditions_simple'],
    title: 'About Dc* discomfort conditions',
    body: 'Dc<X> conditions are the human-readable consequence tier of a Stat<X> stat — fired by condrules when the underlying stat crosses a threshold. Editing thresholds means editing the matching condrules entry, not the Dc* condition itself.',
    wikiPage: 'Condition Rules',
    wikiSlug: 'Condition_Rules',
  },
  {
    id: 'cond-loot',
    prefix: /^COND/,
    folders: ['loot'],
    title: 'About wearable / payload condition grants',
    body: 'A loot/ entry whose strName starts with COND is a condition grant — the Loot dispatcher applies its aCOs payload to whoever rolls the loot. Common pattern for clothing (per-wear conditions) and tick-effect entries (CONDTick1Hour*). The grant target follows the cond-string DSL: Name=value xduration.',
  },
  {
    id: 'drug-loot',
    prefix: /^(DRUG|CONDOssifex|CONDStim|CONDDrug)/,
    folders: ['loot', 'condowners'],
    title: 'About drug / consumable items',
    body: 'DRUG* and similar consumables typically grant Per/Stim conditions on use (their aCOs is a list of Thresh*-or-stat-rate cond-strings). Tune dosage by editing the value field of the matching cond-string; tune duration via the xduration token.',
  },
  {
    id: 'itm-condowners',
    prefix: /^Itm[A-Z]/,
    folders: ['condowners'],
    title: 'About installable items (condowners)',
    body: 'Itm* condowner entries are the per-instance state container for a piece of furniture, equipment, or salvageable. Most Itm* items have an installed and a *Loose variant — the installed one carries IsInstalled in aStartingConds and is referenced by an installables/ entry; the loose one lives in inventory.',
  },
  {
    id: 'act-interactions',
    prefix: /^ACT[A-Z]/,
    folders: ['interactions'],
    title: 'About ACT* interactions',
    body: 'ACT* is the convention for interactions a CondOwner can perform or have performed on it. Behavior chains via aInverse (priority-ordered fallback list); gates via CTTestUs / CTTestThem (condtrigs); state changes via LootCTsUs / LootCTsThem (condition grants).',
    wikiPage: 'Modding/Interactions',
    wikiSlug: 'Modding__Interactions',
  },
];

// UX 1.9 — "Why is this in X/?" inline note. Detected automatically: when an
// entry's strName matches a naming convention that "should" map to folder Y
// but it actually lives in folder X, render an explainer naming the override
// mechanism (typically strType on Loot entries).
const PREFIX_FOLDER_MAPPING = [
  // (prefix regex, expected folder, override note)
  { prefix: /^COND/, expected: 'conditions', note: (folder) => folder === 'loot'
      ? `strName prefixes (COND…, Itm…, ACT…) follow naming convention but do not determine folder. The strType field does. This entry's strType: condition means it lives in loot/ because Loot is the engine's grant-dispatcher folder, not because of the COND… prefix.`
      : null
  },
  { prefix: /^Itm[A-Z]/, expected: 'items', note: (folder) => folder === 'condowners'
      ? `strName prefixes don't determine folder. Itm* condowner entries are the per-instance state container; the matching items/ entry (often same strName) holds the visual definition that's referenced via strItemDef.`
      : (folder === 'loot'
        ? `strName prefixes don't determine folder. This Itm*-named entry lives in loot/ because its strType routes it as a Loot payload — typically initial spawn contents or salvage drops, not a freestanding item entry.`
        : null)
  },
  { prefix: /^ACT[A-Z]/, expected: 'interactions', note: (folder) => folder === 'loot'
      ? `strName prefixes don't determine folder. An ACT*-named loot entry is a Loot delegate for an interaction (strType: interaction) — the aUpdateCommands Destructable wiring uses this pattern to fire an interaction when an item takes lethal damage.`
      : null
  },
  { prefix: /^StatDamage/, expected: 'conditions', note: (folder) => folder === 'conditions_simple'
      ? `Stat-prefixed conditions are usually defined inline in conditions/ entries; conditions_simple/ is the shorthand format (one row per condition as a 7-tuple). StatDamage and StatDamageMax happen to be declared in conditions_simple/ because they're flagged-only stats with no per-stat overrides.`
      : null
  },
];

const EXPLAINER_DISMISS_KEY = 'prefixExplainerDismissed';
function readExplainerDismissed(id) {
  try {
    const raw = localStorage.getItem(EXPLAINER_DISMISS_KEY);
    if (!raw) return false;
    return new Set(JSON.parse(raw)).has(id);
  } catch { return false; }
}
function writeExplainerDismissed(id, dismissed) {
  try {
    const raw = localStorage.getItem(EXPLAINER_DISMISS_KEY);
    const set = new Set(raw ? JSON.parse(raw) : []);
    if (dismissed) set.add(id); else set.delete(id);
    localStorage.setItem(EXPLAINER_DISMISS_KEY, JSON.stringify([...set]));
  } catch {}
}

// Walk the explainer library; return all matching entries that haven't been
// dismissed. Multiple banners can stack on a single page (e.g. Stat* + Thresh*
// — though Thresh wins as more-specific via first-match).
function matchingExplainers(folder, strName) {
  const out = [];
  for (const exp of PREFIX_EXPLAINERS) {
    if (exp.folders && !exp.folders.includes(folder)) continue;
    if (!exp.prefix.test(strName)) continue;
    if (readExplainerDismissed(exp.id)) continue;
    out.push(exp);
  }
  return out;
}
function renderPrefixExplainers(folder, strName) {
  const explainers = matchingExplainers(folder, strName);
  if (explainers.length === 0) return '';
  return explainers.map(exp => {
    const wikiLink = exp.wikiPage
      ? `<a class="explainer-wiki" href="https://ostranauts.wiki.gg/wiki/${encodeURIComponent(exp.wikiSlug || exp.wikiPage.replace(/ /g, '_'))}" target="_blank" rel="noopener">📖 ${escapeHtml(exp.wikiPage)} ↗</a>`
      : '';
    return `
      <div class="prefix-explainer" data-explainer-id="${escapeAttr(exp.id)}">
        <button type="button" class="explainer-dismiss" aria-label="dismiss banner">×</button>
        <div class="explainer-title">${escapeHtml(exp.title)}</div>
        <div class="explainer-body">${escapeHtml(exp.body)}</div>
        ${wikiLink}
      </div>
    `;
  }).join('');
}

// UX 1.9 — folder-mismatch note. Returns the inline note HTML when the
// strName's prefix would predict a different folder than the one we're on.
function renderFolderMismatchNote(folder, strName) {
  for (const m of PREFIX_FOLDER_MAPPING) {
    if (!m.prefix.test(strName)) continue;
    if (m.expected === folder) continue;
    const noteText = m.note(folder);
    if (!noteText) continue;
    return `
      <div class="folder-mismatch-note">
        <strong>Why is this in <code>${escapeHtml(folder)}/</code>?</strong>
        ${escapeHtml(noteText)}
      </div>
    `;
  }
  return '';
}

// UX 1.5 — stable folder color vocabulary. Hash the folder name into a
// 12-color palette so loot=X-color, condowners=Y-color across the whole site.
const FOLDER_PALETTE = [
  '#6cb4ff', '#ff8a65', '#9ccc65', '#ba68c8', '#ffd54f', '#4dd0e1',
  '#f06292', '#aed581', '#7986cb', '#ffb74d', '#4db6ac', '#dce775',
];
function folderColor(folder) {
  let h = 0;
  for (let i = 0; i < folder.length; i++) h = ((h << 5) - h + folder.charCodeAt(i)) | 0;
  return FOLDER_PALETTE[Math.abs(h) % FOLDER_PALETTE.length];
}
function renderFolderBadge(folder) {
  return `<span class="folder-badge" style="--badge-color:${folderColor(folder)}" data-folder="${escapeAttr(folder)}" title="folder: ${escapeAttr(folder)}">${escapeHtml(folder)}</span>`;
}
// UX 1.5 — strType badge surfaces the engine's enum-tag dispatch on Loot,
// Pledges, etc. Pulls from the node's properties; renders only when present.
function renderStrTypeBadge(nodeId) {
  const props = (window.NODE_PROPS ?? {})[nodeId];
  const t = props && typeof props.strType === 'string' ? props.strType : null;
  if (!t) return '';
  return `<span class="strtype-badge" data-strtype="${escapeAttr(t)}" title="strType: ${escapeAttr(t)} — controls how this entry is dispatched at runtime">${escapeHtml(t)}</span>`;
}

// When a strName lives in multiple folders (Itm* names commonly hit loot/,
// condowners/, and items/ at once), append a "(also: <folder>, ...)" suffix
// of clickable links to the parallel entries. Helps modders find the right
// place to edit when the schema's primary target may not be the only relevant
// one — explicitly addresses the multi-strName-source pattern.
function renderAltFolderSuffix(primaryFolder, strName) {
  const folders = nameToFolders.get(strName);
  if (!folders || folders.size <= 1) return '';
  const alts = [...folders].filter(f => f !== primaryFolder).sort();
  if (alts.length === 0) return '';
  const links = alts.map(f =>
    `<a href="#/o/${encodeURIComponent(f)}/${encodeURIComponent(strName)}" class="alt-folder">${escapeHtml(f)}</a>`
  ).join(', ');
  return ` <span class="alt-folders" title="strName also exists in these folders — schema's primary target is &quot;${escapeAttr(primaryFolder)}&quot;">(also: ${links})</span>`;
}

function renderMetadata(metadata) {
  // UX 1.7 — DSL chips. Each labeled chip carries data attributes naming
  // the surrounding DSL kind (cond-string / loot-string / port / verb)
  // so a click handler can render a primer popover anchored to it.
  const chips = [];
  // PLAN-AST Phase 2: WiresTo edges carry the full aUpdateCommands raw string
  // and the position of the resolved arg. Show position [N] inline so modders
  // can map "Referenced by aUpdateCommands" entries back to the right token.
  if ('commandName' in metadata && 'position' in metadata) {
    chips.push(`<span class="meta-chip" data-dsl="commandPos">pos=${escapeHtml(String(metadata.position))}</span>`);
  }
  // PLAN-AST Phase 3: RuntimeWiresTo edges carry the dict key.
  if ('portKey' in metadata) {
    chips.push(`<span class="meta-chip" data-dsl="portKey">${escapeHtml(String(metadata.portKey))}</span>`);
  }
  // PLAN-AST Phase 2: ProducesCondition / ConsumesCondition / ObservesCondition.
  if ('verb' in metadata) {
    chips.push(`<span class="meta-chip meta-verb" data-dsl="verb">${escapeHtml(String(metadata.verb))}</span>`);
  }
  // Cond-string DSL: Name=value xduration → value, dur are the editable dials.
  if ('value' in metadata) {
    chips.push(`<span class="meta-chip dsl-condstring" data-dsl="condstring" data-key="value">value=${escapeHtml(String(metadata.value))}</span>`);
  }
  if ('duration' in metadata) {
    chips.push(`<span class="meta-chip dsl-condstring" data-dsl="condstring" data-key="duration">dur=${escapeHtml(String(metadata.duration))}</span>`);
  }
  // Loot-string DSL: Name=chance x min[-max], with optional leading - for negative.
  if ('chance' in metadata) {
    chips.push(`<span class="meta-chip dsl-lootstring" data-dsl="lootstring" data-key="chance">chance=${escapeHtml(String(metadata.chance))}</span>`);
  }
  if ('min' in metadata) {
    chips.push(`<span class="meta-chip dsl-lootstring" data-dsl="lootstring" data-key="min">min=${escapeHtml(String(metadata.min))}</span>`);
  }
  if ('max' in metadata) {
    chips.push(`<span class="meta-chip dsl-lootstring" data-dsl="lootstring" data-key="max">max=${escapeHtml(String(metadata.max))}</span>`);
  }
  if ('positive' in metadata && metadata.positive === false) {
    chips.push(`<span class="meta-chip dsl-lootstring" data-dsl="lootstring" data-key="positive">negative</span>`);
  }
  return chips.length ? ` <span class="meta">${chips.join(' ')}</span>` : '';
}

// UX 1.7 — DSL primer popover. One handler bound at detail-render time;
// click on a labeled meta-chip renders a small explainer at the chip and
// pins it until dismissed. Hover triggers a transient version too. Designed
// to teach the cond-string / loot-string DSL in place: what each named part
// means in game, no jargon.
const DSL_PRIMERS = {
  condstring: {
    title: 'Cond-string format',
    example: 'ThreshStatGrav=1.0x0.03125',
    parts: [
      ['name', 'ThreshStatGrav', 'the strName of the condition being applied'],
      ['value', '1.0', 'magnitude of the effect — the editable dial for "more" or "less"'],
      ['duration', '0.03125', 'per-game-tick persistence — how long each application lasts'],
    ],
    tip: 'A leading - on the name (e.g. "-StatHunger=1.0x0.05") makes the application subtractive — drains the stat instead of adding to it.',
  },
  lootstring: {
    title: 'Loot-string format',
    example: 'ItmFoo=0.5x1-3',
    parts: [
      ['name', 'ItmFoo', 'the strName of the entry being granted (folder routed by parent strType)'],
      ['chance', '0.5', 'roll probability (0.0-1.0)'],
      ['min', '1', 'minimum count when the roll succeeds'],
      ['max', '3', 'maximum count when the roll succeeds'],
    ],
    tip: 'Leading - means a negative payout (subtract from the recipient). | within an aCOs slot defines a cumulative-probability sub-list — only one of the variants is chosen.',
  },
  verb: {
    title: 'Condition verb',
    example: 'AddCond / RemoveCond / HasCond',
    parts: [
      ['AddCond', '', 'this code-component WRITES this condition — produces the effect'],
      ['RemoveCond', '', 'this code-component CLEARS the condition — removes the state'],
      ['HasCond', '', 'this code-component READS the condition — gates a behavior on its presence'],
    ],
    tip: 'Producers and Observers of the same condition are typically different code-components; useful for tracing a runtime signal.',
  },
  commandPos: {
    title: 'aUpdateCommands position',
    example: '"GasPump,strInput01,strCondMonitor01,…"',
    parts: [
      ['pos=0', '', 'head — the command name itself (selects which code-component runs)'],
      ['pos=1', '', 'first positional arg, often a strInput01 / source key'],
      ['pos=2+', '', 'further args; each typed against a folder when the dispatcher resolves it'],
    ],
    tip: 'Edit the condowner\'s aUpdateCommands string to wire it to a different component or change positional args.',
  },
  portKey: {
    title: 'guipropmap dict key',
    example: 'strInput01 / strCondMonitor01',
    parts: [
      ['portKey', '', 'the dictionary key the code-component reads at runtime to find this binding'],
    ],
    tip: 'The actual value (a strName or instance id) is set in the guipropmap entry\'s dictGUIPropMap. Player wiring of panel UI typically writes here.',
  },
};
function renderDslPrimer(kind, anchorRect) {
  const primer = DSL_PRIMERS[kind];
  if (!primer) return '';
  const partsHtml = primer.parts.map(([k, v, d]) =>
    `<li><code>${escapeHtml(k)}</code>${v ? ` = <code>${escapeHtml(v)}</code>` : ''} <span class="primer-desc">${escapeHtml(d)}</span></li>`
  ).join('');
  return `
    <div class="dsl-primer" role="tooltip">
      <button type="button" class="dsl-primer-close" aria-label="dismiss">×</button>
      <div class="primer-title">${escapeHtml(primer.title)}</div>
      <div class="primer-example"><code>${escapeHtml(primer.example)}</code></div>
      <ul class="primer-parts">${partsHtml}</ul>
      <div class="primer-tip">${escapeHtml(primer.tip)}</div>
    </div>
  `;
}
function wireDslPrimers(rootEl) {
  let pinned = null; // currently-pinned popover element
  const dismiss = () => {
    if (pinned) { pinned.remove(); pinned = null; }
  };
  rootEl.querySelectorAll('.meta-chip[data-dsl]').forEach(chip => {
    chip.addEventListener('click', e => {
      e.stopPropagation();
      const kind = chip.dataset.dsl;
      const html = renderDslPrimer(kind);
      if (!html) return;
      dismiss();
      const wrap = document.createElement('div');
      wrap.innerHTML = html;
      const popover = wrap.firstElementChild;
      chip.parentElement.appendChild(popover);
      pinned = popover;
      popover.querySelector('.dsl-primer-close').addEventListener('click', ev => {
        ev.stopPropagation();
        dismiss();
      });
    });
  });
  // Click outside the popover dismisses it.
  document.addEventListener('click', ev => {
    if (pinned && !pinned.contains(ev.target)) dismiss();
  });
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
    ${folderBlurb(folder)}
    <div class="folder-index">
      ${truncated ? `<p class="meta">showing first ${FOLDER_LIMIT.toLocaleString()} of ${list.length.toLocaleString()}</p>` : ''}
      <ul>
        ${visible.map(n => {
          const inCount = incoming.get(n.id)?.length ?? 0;
          const outCount = outgoing.get(n.id)?.length ?? 0;
          const marker = (inCount === 0 && outCount === 0) ? '❌' : '⭕';
          return `<li><span class="ref-marker">${marker}</span><a href="#/o/${encodeURIComponent(folder)}/${encodeURIComponent(n.strName)}">${escapeHtml(formatCodeName(folder, n.strName))}</a><span class="ref-counts">(${inCount}/${outCount})</span></li>`;
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
    ${pageBlurb('schemas')}
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

/* ─── health: coverage (extractor-integrity) ───────────────── */

function renderHealthCoverage() {
  // Per-folder coverage stats.
  const stats = folderCounts.map(({ folder, count }) => {
    const list = nodesByFolder.get(folder) ?? [];
    let inEdges = 0, outEdges = 0;
    for (const n of list) {
      inEdges += incoming.get(n.id)?.length ?? 0;
      outEdges += outgoing.get(n.id)?.length ?? 0;
    }
    const ruleCount = rulesBySource.get(folder)?.length ?? 0;
    const candCount = allCandidates.filter(c => c.sourceFolder === folder && !c.coveredBySchema).length;
    return { folder, count, inEdges, outEdges, ruleCount, candCount };
  });
  // Sort by suspicion: zero out-edges first (likely blind spot), then ascending by outEdges.
  stats.sort((a, b) => {
    if ((a.outEdges === 0) !== (b.outEdges === 0)) return a.outEdges === 0 ? -1 : 1;
    return a.outEdges - b.outEdges;
  });

  const totalCands = allCandidates.length;
  const uncoveredCands = allCandidates.filter(c => !c.coveredBySchema).length;
  const folderTbl = stats.map(s => {
    const blindSpot = s.outEdges === 0 && s.count > 0;
    const cls = blindSpot ? ' class="zero-edges"' : '';
    return `<tr${cls}>
      <td><a href="#/f/${encodeURIComponent(s.folder)}">${escapeHtml(s.folder)}</a></td>
      <td class="num">${s.count.toLocaleString()}</td>
      <td class="num${s.inEdges === 0 ? ' warn' : ''}">${s.inEdges.toLocaleString()}</td>
      <td class="num${s.outEdges === 0 ? ' bad' : ''}">${s.outEdges.toLocaleString()}</td>
      <td class="num">${s.ruleCount}</td>
      <td class="num${s.candCount > 0 ? ' warn' : ''}">${s.candCount}</td>
    </tr>`;
  }).join('');

  // Top uncovered candidates by leverage. Cap render so the page stays snappy on huge result sets.
  const sortedCands = [...allCandidates]
    .filter(c => !c.coveredBySchema)
    .sort((a, b) => leverageScore(b) - leverageScore(a));
  const candCap = 200;
  const renderedCands = sortedCands.slice(0, candCap);
  const candTbl = renderedCands.map(candidateRow).join('');

  // Covered candidates with MULTIPLE target folders — surfaces the multi-strName-
  // source pattern (same name lives in loot/condowners/items at once). The schema
  // picks one primary; the others are still reachable from the detail-page
  // "(also: …)" suffix, but modders editing the data should know all three exist.
  const multiTargetCovered = allCandidates
    .filter(c => c.coveredBySchema && (c.targets?.length ?? 0) >= 2)
    .sort((a, b) => leverageScore(b) - leverageScore(a));
  const multiCoveredCap = 100;
  const multiTbl = multiTargetCovered.slice(0, multiCoveredCap).map(candidateRow).join('');

  const blindSpotCount = stats.filter(s => s.outEdges === 0 && s.count > 0).length;

  detailEl.innerHTML = `
    <div class="detail-head">
      <div class="crumbs">health · coverage</div>
      <h2>Extractor-integrity coverage</h2>
      <div class="file">
        ${stats.length} folders · ${blindSpotCount} with zero out-edges · ${uncoveredCands} uncovered candidates (of ${totalCands} total)
      </div>
    </div>
    ${pageBlurb('coverage')}

    <div class="health-block">
      <h3>Folders</h3>
      <p class="filter-row">
        Highlighted rows have zero out-edges — extractor isn't seeing any refs from this folder.
        That's often a missing schema overlay (see candidates below for what it should declare).
      </p>
      <table>
        <thead><tr>
          <th>folder</th>
          <th>objects</th>
          <th>in-edges</th>
          <th>out-edges</th>
          <th>rules</th>
          <th>candidates</th>
        </tr></thead>
        <tbody>${folderTbl}</tbody>
      </table>
    </div>

    <div class="health-block">
      <h3>Auto-detected candidates (uncovered)</h3>
      <p class="filter-row">
        Top ${Math.min(candCap, sortedCands.length).toLocaleString()} by leverage (sampleSize × hit-rate).
        ${sortedCands.length > candCap ? `${sortedCands.length - candCap} more not shown — refine the detector thresholds in the Builder if you need a tighter list.` : ''}
        Use these to write <code>comment_mod/data/schemas/&lt;folder&gt;-schema.json</code> overlays
        — promotion to real edges is phase 6 of the v1 plan.
      </p>
      <table>
        <thead><tr>
          <th>source folder</th>
          <th>field path</th>
          <th>samples</th>
          <th>distinct</th>
          <th>top target / hit-rate</th>
        </tr></thead>
        <tbody>${candTbl}</tbody>
      </table>
    </div>

    <div class="health-block">
      <h3>Covered fields with multi-folder targets (${multiTargetCovered.length})</h3>
      <p class="filter-row">
        These fields already have a schema rule (the parser routes edges to the primary target),
        but the same strName values exist in multiple folders simultaneously — the
        <code>Itm*</code> pattern where the same name is a loot entry, a condowner, and an item DTO.
        The detail-page <em>(also: …)</em> suffix on every reference link uses this same data.
        Showing top ${Math.min(multiCoveredCap, multiTargetCovered.length).toLocaleString()} by leverage.
      </p>
      <table>
        <thead><tr>
          <th>source folder</th>
          <th>field path</th>
          <th>samples</th>
          <th>distinct</th>
          <th>targets / hit-rate</th>
        </tr></thead>
        <tbody>${multiTbl || '<tr><td colspan="5" class="targets-cell">none</td></tr>'}</tbody>
      </table>
    </div>
  `;
}

function candidateRow(c) {
  const top = c.targets?.[0];
  const enc = c.encoded;
  const targetCell = top
    ? `<strong>${escapeHtml(top.targetFolder)}</strong> ${(top.hitRate * 100).toFixed(0)}% (${top.hits}/${c.sampleSize})`
    : (enc
        ? `<strong>${escapeHtml(enc.targets?.[0]?.targetFolder ?? '?')}</strong> ${enc.targets?.[0] ? (enc.targets[0].hitRate * 100).toFixed(0) + '%' : ''}<span class="encoded-tag">split "${escapeHtml(enc.separator)}"</span>`
        : '—');
  const otherTargets = (c.targets ?? []).slice(1).concat(enc?.targets?.slice(1) ?? []);
  const others = otherTargets.length > 0
    ? `<br><span class="targets-cell">also: ${otherTargets.map(t => `${escapeHtml(t.targetFolder)} ${(t.hitRate * 100).toFixed(0)}%`).join(', ')}</span>`
    : '';
  return `<tr>
    <td><a href="#/f/${encodeURIComponent(c.sourceFolder)}">${escapeHtml(c.sourceFolder)}</a></td>
    <td><code>${escapeHtml(c.fieldPath)}</code></td>
    <td class="num">${c.sampleSize.toLocaleString()}</td>
    <td class="num">${c.distinctValues.toLocaleString()}</td>
    <td>${targetCell}${others}</td>
  </tr>`;
}

function leverageScore(c) {
  const top = c.targets?.[0] ?? c.encoded?.targets?.[0];
  if (!top) return 0;
  // Multiply by distinctValues so 7-distinct-values × 100% rate doesn't outrank
  // a 1000-distinct × 60% finding (the latter is a much stronger signal).
  return top.hitRate * Math.min(c.distinctValues, c.sampleSize);
}

/* ─── health: data (dangling, orphans, dup strNames) ───────── */

function renderHealthData() {
  // Dangling: edges whose target id isn't in nodesById.
  const dangling = graph.edges.filter(e => !nodesById.has(e.target));
  const danglingByFolder = new Map();
  for (const e of dangling) {
    const tf = e.target.split(':', 1)[0];
    if (!danglingByFolder.has(tf)) danglingByFolder.set(tf, 0);
    danglingByFolder.set(tf, danglingByFolder.get(tf) + 1);
  }
  const danglingTopFolders = [...danglingByFolder.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);

  // Orphans: nodes with zero in + zero out edges.
  // Skip synthetic code-* nodes — they always have outgoing literals by construction
  // so they'd never qualify, and their folders would clutter the per-folder breakdown.
  let orphanCount = 0;
  const orphansByFolder = new Map();
  for (const node of graph.nodes) {
    if (isCodeFolder(node.folder)) continue;
    const inN = incoming.get(node.id)?.length ?? 0;
    const outN = outgoing.get(node.id)?.length ?? 0;
    if (inN + outN === 0) {
      orphanCount++;
      orphansByFolder.set(node.folder, (orphansByFolder.get(node.folder) ?? 0) + 1);
    }
  }
  const orphanTopFolders = [...orphansByFolder.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30);

  // Cross-folder duplicate strNames: same strName in 2+ different folders.
  // Skip code-* nodes — qualified names (Type.Method) wouldn't collide with
  // regular strNames anyway, and excluding them keeps the tally honest.
  const nameToFolders = new Map();
  for (const node of graph.nodes) {
    if (isCodeFolder(node.folder)) continue;
    if (!nameToFolders.has(node.strName)) nameToFolders.set(node.strName, new Set());
    nameToFolders.get(node.strName).add(node.folder);
  }
  const crossDups = [...nameToFolders.entries()]
    .filter(([, set]) => set.size > 1)
    .map(([name, set]) => ({ name, folders: [...set].sort() }))
    .sort((a, b) => b.folders.length - a.folders.length || a.name.localeCompare(b.name));

  // Top sample of dangling targets so users can see the actual missing names.
  const danglingSample = dangling.slice(0, 50);

  detailEl.innerHTML = `
    <div class="detail-head">
      <div class="crumbs">health · data</div>
      <h2>Data health</h2>
      <div class="file">
        ${dangling.length.toLocaleString()} dangling edges ·
        ${orphanCount.toLocaleString()} orphan objects ·
        ${crossDups.length.toLocaleString()} cross-folder duplicate strNames
      </div>
    </div>
    ${pageBlurb('data-health')}

    <div class="health-block">
      <h3>Dangling edges by target folder</h3>
      <p class="filter-row">Edges whose target node isn't in the index. Could be missing data, mod-only refs, or false-positive schema rules.</p>
      <table>
        <thead><tr><th>target folder</th><th>dangling count</th></tr></thead>
        <tbody>
          ${danglingTopFolders.map(([f, n]) =>
            `<tr><td>${escapeHtml(f)}</td><td class="num bad">${n.toLocaleString()}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="health-block">
      <h3>Sample dangling edges (first 50)</h3>
      <table>
        <thead><tr><th>source</th><th>field</th><th>missing target</th><th>kind</th></tr></thead>
        <tbody>
          ${danglingSample.map(e => {
            const [sf, sn] = splitId(e.source);
            const [tf, tn] = splitId(e.target);
            // Dangling target doesn't exist in the schema-routed folder — but the
            // same strName might live in a sibling folder. Surface that as a
            // navigable hint so the modder isn't sent to a dead end.
            const altFolders = [...(nameToFolders.get(tn) ?? new Set())]
              .filter(f => f !== tf)
              .sort();
            const altHint = altFolders.length > 0
              ? `<br><span class="targets-cell">actually exists in: ${altFolders.map(f =>
                  `<a href="#/o/${encodeURIComponent(f)}/${encodeURIComponent(tn)}">${escapeHtml(f)}</a>`
                ).join(', ')}</span>`
              : '';
            return `<tr>
              <td><a href="#/o/${encodeURIComponent(sf)}/${encodeURIComponent(sn)}">${escapeHtml(sf)}:${escapeHtml(sn)}</a></td>
              <td><code>${escapeHtml(e.sourceField)}</code></td>
              <td class="bad">${escapeHtml(tf)}:${escapeHtml(tn)}${altHint}</td>
              <td class="targets-cell">${escapeHtml(e.kind)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <div class="health-block">
      <h3>Orphans by folder (top 30)</h3>
      <p class="filter-row">Objects with no in-edges and no out-edges. Some are intentional (top-level definitions), some are missing-extraction signals — cross-reference with the coverage page.</p>
      <table>
        <thead><tr><th>folder</th><th>orphan count</th></tr></thead>
        <tbody>
          ${orphanTopFolders.map(([f, n]) =>
            `<tr><td><a href="#/f/${encodeURIComponent(f)}">${escapeHtml(f)}</a></td><td class="num warn">${n.toLocaleString()}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="health-block">
      <h3>Cross-folder duplicate strNames</h3>
      <p class="filter-row">Same strName lives in multiple folders. Often intentional (a condition StatFood + a condtrig TIsHungry both keyed elsewhere), occasionally a real conflict.</p>
      <table>
        <thead><tr><th>strName</th><th>folders</th></tr></thead>
        <tbody>
          ${crossDups.slice(0, 100).map(d => `
            <tr>
              <td><code>${escapeHtml(d.name)}</code></td>
              <td>${d.folders.map(f =>
                `<a href="#/o/${encodeURIComponent(f)}/${encodeURIComponent(d.name)}">${escapeHtml(f)}</a>`
              ).join(' · ')}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      ${crossDups.length > 100 ? `<p class="filter-row">…and ${crossDups.length - 100} more.</p>` : ''}
    </div>
  `;
}

/* ─── LLM candidate page ───────────────────────────────────── */

function renderLlmCandidates() {
  // Two surfaces: top-50 globally by incoming-ref count, plus top-10 per folder.
  // For each entry, two clipboard buttons: "folder template prompt" and "object blurb prompt".

  // Compute incoming counts per node.
  const ranked = graph.nodes
    .map(n => ({ node: n, incoming: incoming.get(n.id)?.length ?? 0 }))
    .filter(r => r.incoming > 0)
    .sort((a, b) => b.incoming - a.incoming);

  const globalTop = ranked.slice(0, 50);

  // Per-folder top-10.
  const perFolder = new Map();
  for (const r of ranked) {
    if (!perFolder.has(r.node.folder)) perFolder.set(r.node.folder, []);
    const list = perFolder.get(r.node.folder);
    if (list.length < 10) list.push(r);
  }
  const folderSections = [...perFolder.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  detailEl.innerHTML = `
    <div class="detail-head">
      <div class="crumbs">llm candidates</div>
      <h2>LLM-assist candidates</h2>
      <div class="file">
        Top objects by incoming-ref count.
      </div>
    </div>
    ${pageBlurb('llm')}

    <div class="llm-block">
      <h3>Global top 50</h3>
      <ul>
        ${globalTop.map(r => llmRow(r)).join('')}
      </ul>
    </div>

    ${folderSections.map(([folder, rows]) => `
      <div class="llm-block">
        <h3>${escapeHtml(folder)} (top ${rows.length})</h3>
        <ul>
          ${rows.map(r => llmRow(r)).join('')}
        </ul>
      </div>
    `).join('')}
  `;

  // Wire clipboard buttons. Stash payloads per-button to avoid re-computing on click.
  detailEl.querySelectorAll('button[data-prompt]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const kind = btn.dataset.prompt;
      const folder = btn.dataset.folder;
      const strName = btn.dataset.strname;
      const text = kind === 'folder-template'
        ? buildFolderTemplatePrompt(folder, strName)
        : buildObjectBlurbPrompt(folder, strName);
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add('copied');
        const orig = btn.textContent;
        btn.textContent = 'copied';
        setTimeout(() => { btn.classList.remove('copied'); btn.textContent = orig; }, 1500);
      } catch (e) {
        console.error('clipboard write failed', e);
        btn.textContent = 'error';
      }
    });
  });
}

function llmRow(r) {
  const id = r.node.id;
  const [folder, strName] = [r.node.folder, r.node.strName];
  return `<li>
    <span class="ref-count">${r.incoming.toLocaleString()}</span>
    <a href="#/o/${encodeURIComponent(folder)}/${encodeURIComponent(strName)}">${escapeHtml(folder)}:${escapeHtml(strName)}</a>
    <span class="actions">
      <button data-prompt="folder-template" data-folder="${escapeAttr(folder)}" data-strname="${escapeAttr(strName)}">copy folder-template prompt</button>
      <button data-prompt="object-blurb" data-folder="${escapeAttr(folder)}" data-strname="${escapeAttr(strName)}">copy object-blurb prompt</button>
    </span>
  </li>`;
}

function buildObjectBlurbPrompt(folder, strName) {
  const id = `${folder}:${strName}`;
  const node = nodesById.get(id);
  if (!node) return `(object ${id} not in graph)`;
  const fields = (window.NODE_PROPS ?? {})[id] ?? {};
  const out = (outgoing.get(id) ?? []).slice(0, 60);
  const inc = (incoming.get(id) ?? []).slice(0, 60);

  return [
    `# Task`,
    `Write a 1-2 sentence plain-English blurb for the Ostranauts data object below. Mention what role it plays in the game and how it connects to other objects. Keep it factual and human — no marketing tone, no list of fields.`,
    ``,
    `# Object`,
    `- folder: ${folder}`,
    `- strName: ${strName}`,
    `- file: ${node.file}`,
    ``,
    `## Scalar fields`,
    Object.keys(fields).length === 0 ? '(none)' : Object.entries(fields).map(([k, v]) => `- ${k}: ${JSON.stringify(v)}`).join('\n'),
    ``,
    `## Outgoing references (${(outgoing.get(id) ?? []).length} total, first ${out.length} shown)`,
    out.length === 0 ? '(none)' : out.map(e => `- ${e.sourceField} → ${e.target} (${e.kind})`).join('\n'),
    ``,
    `## Incoming references (${(incoming.get(id) ?? []).length} total, first ${inc.length} shown)`,
    inc.length === 0 ? '(none)' : inc.map(e => `- ${e.source} via ${e.sourceField} (${e.kind})`).join('\n'),
    ``,
    `# Output format`,
    `Just the blurb, no preamble. 1-2 sentences. ~25-50 words.`,
  ].join('\n');
}

function buildFolderTemplatePrompt(folder, strName) {
  // Use the named object as an exemplar but tell the LLM to write a TEMPLATE
  // that interpolates against any object in the folder.
  const id = `${folder}:${strName}`;
  const node = nodesById.get(id);
  if (!node) return `(object ${id} not in graph)`;
  const fields = (window.NODE_PROPS ?? {})[id] ?? {};
  const exampleSibling = (nodesByFolder.get(folder) ?? []).find(n => n.strName !== strName);

  // Outgoing-ref groups (by sourceField) for the magic-word inventory.
  const out = outgoing.get(id) ?? [];
  const outGroups = new Map();
  for (const e of out) {
    const k = e.sourceField;
    if (!outGroups.has(k)) outGroups.set(k, []);
    outGroups.get(k).push(e);
  }

  return [
    `# Task`,
    `Write a Mustache-style template for the Ostranauts \`${folder}/\` folder. The site renders this template against any object in the folder by interpolating \`{{path}}\` against a context object containing the object's fields and references. The output should read as a 2-3 sentence plain-English description, factual and human, that any object in the folder can be passed through.`,
    ``,
    `# Magic words available`,
    `- \`{{strName}}\` — the object's strName`,
    `- \`{{folder}}\` — "${folder}"`,
    `- \`{{file}}\` — source file path`,
    `- \`{{fields.<key>}}\` — scalar field value (string/number/bool)`,
    `- \`{{outRefs.<sourceField>.length}}\` — number of outgoing refs of that field`,
    `- \`{{outRefs.<sourceField>.first}}\` — first outgoing ref's target id (e.g. "items:ItmCoffee")`,
    `- \`{{outCount}}\` / \`{{inCount}}\` — total ref counts`,
    ``,
    `# Folder context`,
    `- folder: ${folder}`,
    `- objects in folder: ${(nodesByFolder.get(folder) ?? []).length}`,
    ``,
    `# Exemplar object — ${strName}`,
    `## Scalar fields`,
    Object.keys(fields).length === 0 ? '(none)' : Object.entries(fields).map(([k, v]) => `- ${k}: ${JSON.stringify(v)}`).join('\n'),
    ``,
    `## Outgoing-ref groups`,
    [...outGroups.entries()].map(([f, list]) => `- ${f}: ${list.length} refs (e.g. ${list[0].target})`).join('\n') || '(none)',
    ``,
    exampleSibling ? `# Sibling exemplar — ${exampleSibling.strName}` : '',
    exampleSibling ? `## Scalar fields` : '',
    exampleSibling ? Object.entries((window.NODE_PROPS ?? {})[exampleSibling.id] ?? {}).slice(0, 12).map(([k, v]) => `- ${k}: ${JSON.stringify(v)}`).join('\n') || '(none)' : '',
    ``,
    `# Output format`,
    `Just the template, no preamble. Use Mustache \`{{...}}\` syntax. Keep it 2-3 sentences. Don't list every field — pick the ones that tell a clear story across all objects in the folder.`,
  ].filter(Boolean).join('\n');
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
