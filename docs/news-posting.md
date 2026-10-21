# News posting format

Weekday GenAI / coding-agent roundups live in `src/content/news/`. A daily automation should add **one** markdown file on a dedicated branch and open a PR against `main` — no other site files need editing for a normal post.

## Branch and auto-merge

| | |
| --- | --- |
| Branch name | `news/YYYY-MM-DD` (must start with `news/`) |
| Changed files | **Only** `src/content/news/*.md` (verified via the GitHub PR files API) |
| Base | `main`, same repo (not a fork) |

When those conditions hold, `.github/workflows/news-automerge.yml` runs `npm ci`, `check:content`, `test:content`, `guide:verify`, and the full build. If all pass it **squash-merges** the PR with `GITHUB_TOKEN`, deletes the branch, and **dispatches** `Deploy to GitHub Pages` (`workflow_dispatch` on `main`). Merges made with `GITHUB_TOKEN` do not fire `push` workflows; dispatch is the reliable way to redeploy without duplicating the deploy job.

If the branch name is wrong, the PR touches any non-news path, checks fail, or the PR is from a fork, the workflow exits without merging.

## Path and filename

```
src/content/news/YYYY-MM-DD.md
```

Use the **publish date** (UK calendar day the roundup goes live), e.g. `2026-10-22.md`. The content-collection id is the filename without `.md`, so the public URL is `/news/YYYY-MM-DD/`. Match the branch date to the filename (`news/2026-10-22` → `src/content/news/2026-10-22.md`).

## Frontmatter schema

```yaml
---
title: "Wednesday roundup — 22 Oct 2026"
date: 2026-10-22
summary: "One sentence for cards and RSS."
draft: false
items:
  - vendor: "OpenAI"
    title: "Product or release name as the source states it"
    releasedOn: "22 Oct 2026, 14:00 UK"
    body: |
      Short markdown: what shipped. No hype. Link detail lives in `sourceUrl`.
    whoItAffects: "Optional one-liner: who should care."
    sourceUrl: "https://example.com/announcement"
    sourceLabel: "OpenAI blog"
---
```

### Field rules

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Roundup headline |
| `date` | yes | Publish date (same as filename) |
| `summary` | yes | Card / RSS blurb |
| `draft` | no | **Defaults to `false`** — posts go live when merged |
| `items` | yes | ≥1 item |
| `items[].vendor` | yes | Company / org |
| `items[].title` | yes | Product or release title |
| `items[].releasedOn` | yes | As the source states it (include time in UK when given) |
| `items[].body` | yes | Markdown; non-empty |
| `items[].whoItAffects` | no | Practical note |
| `items[].sourceUrl` | yes | `http://` or `https://` |
| `items[].sourceLabel` | yes | Short link label |

Do **not** invent release times. Prefer the source’s wording for `releasedOn`.

## Checks

`npm run check:content` rejects published posts whose items lack `sourceUrl`, `releasedOn`, or body. Keep the collection placeholder `do-not-publish-placeholder.md` (`draft: true`) until the first real post exists; delete it when the first live file lands if you prefer.

## Nav gate

News appears in header nav, home, footer, and Starlight “Site” sidebar only when there are **≥ 3** published (`draft: false`) posts (`NAV_MIN_ITEMS`).

## RSS

`/news/rss.xml` lists published posts (empty until the first live roundup).
