import type { APIRoute } from 'astro';
import { SITE_URL } from '../site';

/**
 * /sitemap.xml is the first place many crawlers look. The sitemap integration writes
 * sitemap-index.xml and sitemap-0.xml, so this serves a one-entry index over sitemap-0.xml.
 */
export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${SITE_URL}/sitemap-0.xml</loc></sitemap></sitemapindex>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
