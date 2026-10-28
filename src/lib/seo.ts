import fs from 'node:fs';
import path from 'node:path';
import {
  SITE_URL,
  SITE_NAME,
  SITE_AUTHOR,
  SITE_OG_IMAGE,
  SITE_OG_IMAGE_ALT,
  LINKS,
} from '../site';

/** Absolute URL for a site path or already-absolute URL. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const pathPart = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(pathPart, SITE_URL).href;
}

export type OgImageResolution = {
  url: string;
  alt: string;
  /** True when the image is known to be 1200×630 (default or letterboxed OG). */
  hasStandardSize: boolean;
};

/**
 * Share-preview image: use frontmatter `previewImage` when set, else the site default.
 * Paths under /public become absolute https URLs.
 */
export function resolveOgImage(
  previewImage?: string | null,
): OgImageResolution {
  if (previewImage && previewImage.trim()) {
    return {
      url: absoluteUrl(previewImage.trim()),
      alt: SITE_OG_IMAGE_ALT,
      hasStandardSize: false,
    };
  }
  return { url: SITE_OG_IMAGE, alt: SITE_OG_IMAGE_ALT, hasStandardSize: true };
}

export function resolveOgImageWithAlt(
  previewImage?: string | null,
  previewAlt?: string | null,
): OgImageResolution {
  const base = resolveOgImage(previewImage);
  if (previewImage && previewAlt && previewAlt.trim()) {
    return { ...base, alt: previewAlt.trim() };
  }
  return base;
}

/**
 * Experiment share image priority:
 * 1. public/og/experiments/<id>.png (letterboxed 1200×630)
 * 2. SITE_URL + previewImage
 * 3. site default
 * Alt always prefers previewAlt when provided.
 */
export function resolveExperimentOgImage(
  experimentId: string,
  previewImage?: string | null,
  previewAlt?: string | null,
): OgImageResolution {
  const letterboxedRel = `/og/experiments/${experimentId}.png`;
  const letterboxedFs = path.join(process.cwd(), 'public', 'og', 'experiments', `${experimentId}.png`);
  const alt =
    previewAlt && previewAlt.trim() ? previewAlt.trim() : SITE_OG_IMAGE_ALT;

  if (fs.existsSync(letterboxedFs)) {
    return {
      url: absoluteUrl(letterboxedRel),
      alt,
      hasStandardSize: true,
    };
  }
  if (previewImage && previewImage.trim()) {
    return {
      url: absoluteUrl(previewImage.trim()),
      alt,
      hasStandardSize: false,
    };
  }
  return { url: SITE_OG_IMAGE, alt, hasStandardSize: true };
}

/** RSS discovery links for BaseLayout / Starlight head. */
export const RSS_FEEDS = [
  { href: '/news/rss.xml', title: `${SITE_NAME} — News` },
  { href: '/experiments/rss.xml', title: `${SITE_NAME} — Experiments` },
  { href: '/articles/rss.xml', title: `${SITE_NAME} — Articles` },
  { href: '/architecture/rss.xml', title: `${SITE_NAME} — Architecture` },
] as const;

/** Person JSON-LD for Garry Meaburn (public profiles only). */
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_AUTHOR,
    url: absoluteUrl('/about/'),
    sameAs: [
      LINKS.x,
      LINKS.githubAuthor,
      LINKS.linkedin,
      LINKS.youtube,
    ],
  };
}

/** Article JSON-LD for experiment / article / architecture / news detail pages. */
export function articleJsonLd(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: Date | string;
  dateModified?: Date | string;
  image: string;
}) {
  const datePublished =
    opts.datePublished instanceof Date
      ? opts.datePublished.toISOString()
      : opts.datePublished;
  const dateModified = opts.dateModified
    ? opts.dateModified instanceof Date
      ? opts.dateModified.toISOString()
      : opts.dateModified
    : datePublished;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    datePublished,
    dateModified,
    image: [opts.image],
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR,
      url: absoluteUrl('/about/'),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/favicon.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': opts.url,
    },
  };
}
