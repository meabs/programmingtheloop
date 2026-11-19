/**
 * Prose enhancements shared by experiment, article and architecture pages:
 * table layout that works on phones, and tap-to-enlarge figures.
 */
// Tables: short numeric ones stay tables when they actually fit the width, so rows can be compared.
// Anything wider stacks into cards on phones (a table that scrolls sideways hid its later columns).
const tables = Array.from(document.querySelectorAll<HTMLTableElement>('.view-prose table'));
for (const table of tables) {
  const rows = Array.from(table.rows);
  if (rows.length === 0) continue;
  const labels = Array.from(rows[0].cells).map((c) => (c.textContent ?? '').trim());
  for (const row of rows) {
    Array.from(row.cells).forEach((cell, i) => {
      if (cell.tagName === 'TD' && labels[i]) cell.dataset.label = labels[i];
      // Wrap mixed text/code children so stacked layout does not split them
      // into separate grid items (e.g. `AGENTS.md` on its own label row).
      if (cell.tagName === 'TD' && cell.childNodes.length > 1) {
        const wrap = document.createElement('span');
        wrap.className = 'table-cell-text';
        while (cell.firstChild) wrap.appendChild(cell.firstChild);
        cell.appendChild(wrap);
      }
    });
  }
}
const shortCells = (table: HTMLTableElement) =>
  table.rows[0].cells.length <= 5 &&
  Array.from(table.rows[0].cells).every((c) => c.tagName === 'TH') &&
  Array.from(table.rows)
    .slice(1)
    .every((r) => Array.from(r.cells).every((c) => (c.textContent ?? '').trim().length <= 30));
const layoutTables = () => {
  for (const table of tables) {
    if (table.rows.length === 0) continue;
    table.classList.remove('table-compact', 'table-prose');
    if (shortCells(table)) {
      table.classList.add('table-compact');
      if (table.scrollWidth <= table.clientWidth + 1) continue;
      table.classList.remove('table-compact');
    }
    table.classList.add('table-prose');
  }
};
layoutTables();
let resizeTimer: number | undefined;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(layoutTables, 150);
});

// Charts: wrap each figure image in a link to the full-size file (tap to enlarge).
document.querySelectorAll<HTMLImageElement>('.view-prose .guide-figure img').forEach((img) => {
  if (img.closest('a')) return;
  const href = img.currentSrc || img.src;
  if (!href) return;
  const link = document.createElement('a');
  link.href = href;
  link.className = 'guide-figure-link';
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.setAttribute('aria-label', 'Open full-size chart');
  img.replaceWith(link);
  link.appendChild(img);
  if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
});
