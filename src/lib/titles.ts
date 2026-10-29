/**
 * Experiment titles carry a trailing "(experiment EM)" for search results and feeds.
 * On the page the ID is already shown as a label, so visible headings drop it.
 */
export function displayTitle(title: string): string {
  return title.replace(/\s*\((?:experiment|exp\.?)\s+[A-Za-z0-9-]+\)\s*$/i, '').trim();
}
