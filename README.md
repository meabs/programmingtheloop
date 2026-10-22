# Programming the Loop

Site for **agentic build engineering** by Garry Meaburn: articles, experiments and guides on working with coding agents. Hosted at [programmingtheloop.com](https://programmingtheloop.com).

Built with Astro and Starlight for GitHub Pages.

## Local development

```sh
npm ci
npm run dev
```

- `npm run build` — type-check and build into `dist/`
- `npm run preview` — serve the production build
- `npm run check:content` — experiment finding IDs, published/superseded rules, topics, route baseline, and that evidence links to other GitHub repos (in experiments, Notes and Guide chapters) name a commit SHA rather than a branch
- `npm run test:content` — fixture tests for check:content failures
- `npm run guide:verify` — book fact-number / citation / checklist coverage (`scripts/verify_book_coverage.py`)
- `python3 scripts/build_guide_from_book.py` — legacy: regenerates the Guide pages from a book Markdown master that is not kept in this repo. Guide pages are now edited directly; running it would overwrite the commit-pinned links, which `check:content` would then flag

`check:content` and `guide:verify` are separate: the former guards collection integrity; the latter guards Guide facts against the book.

Node 22 is used in CI (see `.github/workflows/deploy.yml`).

## Information architecture

| Path | Purpose | In main nav? |
| --- | --- | --- |
| `/` | Site home | Yes |
| `/articles/` | Short writing (collection) | Yes |
| `/experiments/` | Experiment write-ups (collection) | Yes |
| `/guides/` | Guide catalog | Yes |
| `/guides/programming-the-loop/` | Multi-page guide (Starlight) | Via Guides |
| `/guides/programming-the-loop/start/` | Chapter routing table | Inside the guide |
| `/about/` | About | Yes |
| `/notes/` | Long-form notes outside the Guide (e.g. `/notes/okf-details/`) | No |
| `/updates/` | Site changelog | Footer |
| `/downloads/` | October 2026 PDF | Footer |

Old URLs (`/guide/…`, `/start/`, `/views/…`, `/book/`) redirect to the new paths.

Main nav: `src/site.ts` (`NAV`). Shared layout: `src/layouts/BaseLayout.astro`.

Do not invent posts, experiments, quotes or metrics.

## How to add an article

1. Copy [`docs/templates/article.md`](docs/templates/article.md) into `src/content/articles/` as `YYYY-MM-DD-short-slug.md`.
2. Fill frontmatter. Keep `draft: true` until ready.
3. Write the body. It appears on `/articles/`, home Latest, and the Articles preview when published.

## How to add an experiment

1. Copy [`docs/templates/experiment.md`](docs/templates/experiment.md) into `src/content/experiments/` as `short-slug.md`.
2. Fill title, summary, type tag, date, GitHub and Guide links. Only use facts you can point to in a Guide chapter or published repo.
3. Keep `draft: true` until ready. Published items appear on `/experiments/` and home.

## How to add a guide

1. Copy [`docs/templates/guide.md`](docs/templates/guide.md) into `src/content/guides/` (catalog card).
2. Add multi-page Markdown under `src/content/docs/guides/<slug>/`.
3. Wire the Starlight sidebar in `astro.config.mjs`.
4. Set `href` on the catalog entry to `/guides/<slug>/`.

## October 2026 PDF

- File: `public/downloads/Programming-the-Loop-1st-edition.pdf`
- Labelled as the October 2026 first edition; do not overwrite in place for later editions.

Licence: free to read; share unchanged with attribution and the copyright notice; no selling, no commercial use, no modified versions without permission.

## SEO and sharing

- `site` in `astro.config.mjs` is `https://programmingtheloop.com`.
- Absolute `https://programmingtheloop.com/og/default.png` for social images (1200×630 typographic preview; book cover stays on the page, not in OG tags).
- `public/CNAME` must remain `programmingtheloop.com`.

## Analytics

Cloudflare Web Analytics beacon once per page (`src/site.ts` token; `BaseLayout` + Starlight `head`).
