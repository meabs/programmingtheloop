# Programming the Loop

Site for **agentic build engineering** by Garry Meaburn: building software with coding agents, practical engineering of the agent loop, measurements and experiments, views on industry trends, and a free ebook. Hosted at [programmingtheloop.com](https://programmingtheloop.com).

Built with Astro and Starlight for GitHub Pages.

## Local development

```sh
npm ci
npm run dev
```

- `npm run build` — type-check and build into `dist/`
- `npm run preview` — serve the production build

Node 22 is used in CI (see `.github/workflows/deploy.yml`).

## Information architecture

| Path | Purpose | In main nav? |
| --- | --- | --- |
| `/` | Site home (what the site is / will be) | Yes |
| `/views/` | Industry trends and tool/release takes | Yes |
| `/book/` | Ebook hub | Yes |
| `/contents/`, `/downloads/`, `/learn/…` | Book contents, PDF, chapter notes | Via Book |
| `/about/` | About | Yes |
| `/experiments/` | Experiment write-ups (empty until published) | No until content exists |

Main nav: `src/site.ts` (`NAV`). Shared layout: `src/layouts/BaseLayout.astro`.

Do not invent posts, experiments, quotes or download counts.

## How to add a Views post

1. Copy the template: [`docs/templates/view-post.md`](docs/templates/view-post.md)
2. Save it under `src/content/views/` as `YYYY-MM-DD-short-slug.md` (or any `.md` / `.mdx` name).
3. Edit frontmatter:

   ```yaml
   title: "Short clear title"
   description: "One sentence for the home page and social previews."
   date: 2026-11-01
   draft: false
   ```

4. Write the body. Keep measured findings apart from opinion.
5. `draft: true` means the file is kept but **not** published (not on `/views/`, not on the home page).
6. Run `npm run build`. The home page lists the latest published views automatically.

## How to add other section pages

1. Add Markdown/MDX under `src/content/docs/<section>/`, e.g. `experiments/my-trial.mdx`.
2. Frontmatter needs `title` and `description`.
3. URL follows the path under `docs/`.
4. Add to `NAV` in `src/site.ts` and optionally the Starlight `sidebar` in `astro.config.mjs` when the section should appear in navigation.

## Ebook PDF

- File: `public/downloads/Programming-the-Loop-1st-edition.pdf`
- Do not overwrite the first edition in place; use a new filename for later editions.

Licence (site wording): free to read; share the unchanged PDF free of charge with attribution and the copyright notice; no selling, no commercial use, no modified versions without permission. PDF only on this site.

## SEO and sharing

- `site` in `astro.config.mjs` is `https://programmingtheloop.com`.
- Book pages use book-specific meta and absolute `https://programmingtheloop.com/og-cover.png`.
- `public/CNAME` must remain `programmingtheloop.com`.
- `public/robots.txt` allows indexing and points at the sitemap.

Cloudflare Web Analytics (cookie-free page views) is loaded once per page via `CF_WEB_ANALYTICS_TOKEN` in `src/site.ts`. No API secrets in the repository.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`. The workflow checks that `dist/CNAME` equals `programmingtheloop.com`.
