// Ostranaut Data Explorer — pre-v1 scaffold.
// Real app logic lands once the parser emits a non-stub graph.json.

const status = document.getElementById('status');
const summary = document.getElementById('graph-summary');

async function main() {
  try {
    const res = await fetch('data/graph.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const graph = await res.json();
    status.textContent = `loaded data/graph.json (schema v${graph.$schema_version})`;
    summary.textContent = JSON.stringify(graph, null, 2);
  } catch (err) {
    status.textContent = `no graph.json yet — run \`make\` (or \`build.bat\`) to generate it. (${err.message})`;
  }
}

main();
