// Ostranaut Data Explorer — v1 site frontend.
// Loads graph.json, indexes it client-side, drives a search box +
// folder sidebar + object detail panel via hash-based routing.
//
// Routes:
//   #/o/<folder>/<strName>   — object detail
//   #/f/<folder>             — folder index
//   (anything else)           — empty hint

const SCHEMA_VERSION = 5;
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
    console.info('code_refs.js not loaded — Code references block will be omitted. Run scrap_scripts/python/10_emit_code_refs.py to generate it.');
  }
  if (typeof window.REF_CANDIDATES === 'undefined') {
    console.info('ref_candidates.js not loaded — auto-detected refs will be hidden. Re-run the Builder to generate it.');
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
    if (!nameToFolders.has(node.strName)) nameToFolders.set(node.strName, new Set());
    nameToFolders.get(node.strName).add(node.folder);
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

  folderCounts = [...nodesByFolder.entries()]
    .map(([folder, list]) => ({ folder, count: list.length }))
    .sort((a, b) => a.folder.localeCompare(b.folder));

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

    ${renderTemplateBlock(folder, strName, id)}
    ${renderFieldsBlock(folder, (window.NODE_PROPS ?? {})[id])}
    ${renderCodeRefsBlock(strName)}

    <div class="refs-block">
      <h3>References out (${out.length})</h3>
      ${renderEdgeGroups(out, 'source-perspective', folder)}
    </div>

    <div class="refs-block">
      <h3>Referenced by (${inc.length})</h3>
      ${renderEdgeGroups(inc, 'target-perspective', folder)}
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
  // Wire template editor.
  wireTemplateBlock(folder, strName, id);
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

function renderEdgeGroups(edges, perspective, viewFolder) {
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
}

function renderCodeRefsBlock(strName) {
  // window.CODE_REFS keys by strName (decomp doesn't know our folder
  // namespacing). Hits look like { file, line, text }.
  const refs = (window.CODE_REFS ?? {})[strName];
  if (!refs || refs.length === 0) return '';
  const rows = refs.map(r => `<li>
    <span class="code-loc">${escapeHtml(r.file)}:${r.line}</span>
    <pre class="code-line">${escapeHtml(r.text)}</pre>
  </li>`).join('');
  return `
    <div class="code-refs-block">
      <h3>Code references (${refs.length})
        <span class="muted-note">— ${escapeHtml(strName)}<wbr> appears as a hardcoded string literal in decomp</span>
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
    return `<li>
      <span class="field-name"${titleAttr}>${escapeHtml(k)}</span>
      <span class="field-value">${valueText}</span>
    </li>`;
  }).join('');
  return `
    <div class="fields-block">
      <h3>Fields (${keys.length})</h3>
      <ul>${rows}</ul>
    </div>
  `;
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
    ? `<a href="#/o/${encodeURIComponent(linkFolder)}/${encodeURIComponent(linkName)}" data-id="${escapeAttr(linkId)}">${escapeHtml(linkName)}</a>`
    : `<span class="dangling" title="not in index">${escapeHtml(linkName)}</span>`;

  const folderTag = `<span class="field">${escapeHtml(linkFolder)}</span>`;
  const altSuffix = known ? renderAltFolderSuffix(linkFolder, linkName) : '';
  const meta = edge.metadata ? renderMetadata(edge.metadata) : '';
  const arrow = perspective === 'source-perspective' ? '→' : '←';

  return `<li><span class="arrow">${arrow}</span>${folderTag}:${linkHtml}${altSuffix}${meta}</li>`;
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
  let orphanCount = 0;
  const orphansByFolder = new Map();
  for (const node of graph.nodes) {
    const inN = incoming.get(node.id)?.length ?? 0;
    const outN = outgoing.get(node.id)?.length ?? 0;
    if (inN + outN === 0) {
      orphanCount++;
      orphansByFolder.set(node.folder, (orphansByFolder.get(node.folder) ?? 0) + 1);
    }
  }
  const orphanTopFolders = [...orphansByFolder.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30);

  // Cross-folder duplicate strNames: same strName in 2+ different folders.
  const nameToFolders = new Map();
  for (const node of graph.nodes) {
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
