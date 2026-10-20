# Programming the Loop

Site for Garry Meaburn’s free ebook **Programming the Loop: What I Measured with Coding Agents** (first edition, October 2026). Built with Astro and Starlight, deployed to GitHub Pages at [programmingtheloop.com](https://programmingtheloop.com).

## Local development

```sh
npm ci
npm run dev
```

- `npm run build` — type-check and build static files into `dist/`
- `npm run preview` — serve the production build locally

Node 22 is used in CI (see `.github/workflows/deploy.yml`).

## Site map

| Path | Purpose |
| --- | --- |
| `/` | Book landing page (summary, measured findings, licence, download, feedback) |
| `/contents/` | Chapter list |
| `/downloads/` | PDF download and licence |
| `/learn/` | Short web notes for each chapter |
| `/notes/` | Notes/articles that are **not** only the book (add pages here) |
| `/experiments/` | Experiment index and planned work |
| `/updates/` | Dated updates and corrections |
| `/about/` | Author, licence, feedback links |

Custom pages (home, contents, 404) live under `src/pages/` and share `src/layouts/BaseLayout.astro` plus `src/site.ts`. Starlight content lives under `src/content/docs/`.

## How to add a new section page

1. Create a Markdown or MDX file under the right folder, for example:
   - Note: `src/content/docs/notes/my-note.mdx`
   - Experiment: `src/content/docs/experiments/my-experiment.mdx`
   - Update: `src/content/docs/updates/2026-11-correction.mdx`
2. Put YAML frontmatter at the top:

   ```md
   ---
   title: My note title
   description: One sentence for search and social previews.
   ---

   # My note title

   Body text…
   ```

3. The URL is the file path under `docs/`, e.g. `notes/my-note.mdx` → `/notes/my-note/`.
4. If it should appear in the Starlight sidebar, add a link in `astro.config.mjs` under `sidebar`.
5. If it should appear in the home-page header, add it to `NAV` in `src/site.ts`.
6. Run `npm run build` and check the new route.

Keep **findings** (measured, with limits) separate from **recommendations** and **open questions**. Do not invent numbers, quotes, testimonials or download counts.

## Ebook PDF

- File: `public/downloads/Programming-the-Loop-1st-edition.pdf`
- Do not overwrite the first edition in place. Publish a later edition under a new filename and update links.

Licence (site wording): free to read; share the unchanged PDF free of charge with attribution and the copyright notice; no selling, no commercial use, no modified versions without permission. This site offers PDF only.

## SEO and sharing

- `site` in `astro.config.mjs` is `https://programmingtheloop.com` (canonical base, sitemap).
- `public/CNAME` must remain `programmingtheloop.com` for the custom domain.
- Social image: `public/og-cover.png` (absolute URLs in meta tags — never localhost).
- `public/robots.txt` allows indexing and points at the generated sitemap.

No analytics or tracking scripts. No API keys in the repository.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml` (GitHub Pages via Actions). The workflow checks that `dist/CNAME` equals `programmingtheloop.com`.

In the repository: **Settings → Pages → GitHub Actions**. DNS for the apex domain is configured at the registrar (GitHub’s documented A/AAAA records). Enable **Enforce HTTPS** after the certificate is ready.
