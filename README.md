# Programming the Loop

Site for **agentic build engineering** by Garry Meaburn. The **[Guide](https://programmingtheloop.com/guide/)** holds the full text of *Programming the Loop*, free to read. The October 2026 first-edition PDF is still available. Hosted at [programmingtheloop.com](https://programmingtheloop.com).

Built with Astro and Starlight for GitHub Pages.

## Local development

```sh
npm ci
npm run dev
```

- `npm run build` — type-check and build into `dist/`
- `npm run preview` — serve the production build
- `python3 scripts/build_guide_from_book.py` — regenerate Guide pages from the book Markdown master
- `python3 scripts/verify_book_coverage.py` — paragraph / checklist / figure coverage report

Node 22 is used in CI (see `.github/workflows/deploy.yml`).

## Information architecture

| Path | Purpose | In main nav? |
| --- | --- | --- |
| `/` | Site home | Yes |
| `/guide/` | Full-text Guide (chapters + back matter) | Yes |
| `/start/` | Route into the Guide by situation | Yes |
| `/views/` | Industry trends and tool/release takes | Yes |
| `/updates/` | Changelog | Yes |
| `/about/` | About (site voice) | Yes |
| `/downloads/` | October 2026 PDF | Footer |
| `/book/`, `/contents/` | Book hub / contents mirror | Via Guide |

Main nav: `src/site.ts` (`NAV`). Shared layout: `src/layouts/BaseLayout.astro`.

Do not invent posts, experiments, quotes or download counts.

## How to add a Views post

1. Copy the template: [`docs/templates/view-post.md`](docs/templates/view-post.md)
2. Save it under `src/content/views/` as `YYYY-MM-DD-short-slug.md` (or any `.md` / `.mdx` name).
3. Edit frontmatter and write the body. `draft: true` keeps a file unpublished.

## October 2026 PDF

- File: `public/downloads/Programming-the-Loop-1st-edition.pdf`
- Labelled as the October 2026 first edition; do not overwrite in place for later editions.

Licence: free to read; share unchanged with attribution and the copyright notice; no selling, no commercial use, no modified versions without permission.

## SEO and sharing

- `site` in `astro.config.mjs` is `https://programmingtheloop.com`.
- Absolute `https://programmingtheloop.com/og-cover.png` for social images.
- `public/CNAME` must remain `programmingtheloop.com`.

## Analytics

Cloudflare Web Analytics beacon once per page (`src/site.ts` token; `BaseLayout` + Starlight `head`).
