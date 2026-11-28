import { LINKS, SITE_AUTHOR } from '../site.ts';

/** YouTube helpers. The site only links to videos that exist; ids are read from the plain URL forms. */

/** The 11-character video id from youtube.com/shorts/ID, youtube.com/watch?v=ID, youtu.be/ID or /embed/ID, else null. */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '');
    let id: string | null = null;
    if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
    else if (host === 'youtube.com') {
      const m = u.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/);
      id = m ? m[1] : u.searchParams.get('v');
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function youtubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/**
 * VideoObject JSON-LD for a page's explainer video. Needs the upload date (Google requires it), so it is only
 * emitted when the page records `video.uploadedOn`; otherwise returns null.
 */
export function videoJsonLd(opts: {
  name: string;
  description: string;
  video: { url: string; uploadedOn?: Date | string };
}) {
  const id = youtubeId(opts.video.url);
  if (!id || !opts.video.uploadedOn) return null;
  const uploaded = opts.video.uploadedOn instanceof Date ? opts.video.uploadedOn.toISOString() : opts.video.uploadedOn;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: opts.name,
    description: opts.description,
    thumbnailUrl: [youtubeThumbnail(id)],
    uploadDate: uploaded,
    contentUrl: opts.video.url,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    author: { '@type': 'Person', name: SITE_AUTHOR },
    publisher: { '@type': 'Organization', name: 'Frugal AI Engineer', url: LINKS.youtube },
  };
}
