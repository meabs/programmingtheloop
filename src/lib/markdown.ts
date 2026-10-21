import { micromark } from 'micromark';

/** Render a short markdown string (news item bodies) to HTML. */
export function renderMarkdown(source: string): string {
  return micromark(source ?? '', { allowDangerousHtml: false });
}
