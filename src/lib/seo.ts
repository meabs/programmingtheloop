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
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(path, SITE_URL).href;
}

/**
 * Share-preview image: use frontmatter `previewImage` when set, else the site default.
 * Paths under /public become absolute https URLs.
 */
export function resolveOgImage(
  previewImage?: string | null,
): { url: string; alt: string; isDefault: boolean } {
  if (previewImage && previewImage.trim()) {
    return {
      url: absoluteUrl(previewImage.trim()),
      alt: SITE_OG_IMAGE_ALT,
      isDefault: false,
    };
  }
  return { url: SITE_OG_IMAGE, alt: SITE_OG_IMAGE_ALT, isDefault: true };
}

export function resolveOgImageWithAlt(
  previewImage?: string | null,
  previewAlt?: string | null,
): { url: string; alt: string; isDefault: boolean } {
  const base = resolveOgImage(previewImage);
  if (!base.isDefault && previewAlt && previewAlt.trim()) {
    return { ...base, alt: previewAlt.trim() };
  }
  return base;
}

/** Person JSON-LD for Garry (no employer). */
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
