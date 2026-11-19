/** Rough reading time in whole minutes (at 200 words a minute) for a Markdown body; HTML tags and code fences are ignored. */
export function readingMinutes(markdown, wordsPerMinute = 200) {
  const text = String(markdown ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1');
  const words = text.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
