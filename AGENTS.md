# Working on programmingtheloop.com

Astro + Starlight site for Garry Meaburn's controlled experiments on coding agents. The audience is engineers. The content is the product; the design should look like engineering documentation, not a marketing template.

## Before you start

- `git fetch origin main` and branch from `origin/main`. Other sessions publish to `main` in parallel (experiments, news, articles).
- A merged PR cannot take new commits. Restart the branch from `origin/main`.
- Node 22.18 or newer.

## Before you push

All of these must pass; CI runs the same:

```sh
npm run check:content   # frontmatter, finding ids, intervals, topics, pinned links, route baseline
npm run test:content    # fixture and unit tests
npm run build           # astro check (type errors fail) + build + search index
```

For any visual change, also load the built page at 390px and 1440px, light and dark, and confirm there is no horizontal scroll. `npm run preview` serves `dist/`.

## Content rules

- **Do not invent** results, numbers, quotes, experiments or sources. Every figure comes from a published report.
- **Findings are the single source of truth for numbers.** Define them once in the experiment's `findings:` frontmatter. Pages, cards, the hero and `/measured/` read from there. Never retype a finding's number elsewhere, and never hard-code one on a landing page (`check:content` flags it).
- **Intervals must be plottable.** `interval.low` and `interval.high` are plain numbers in one unit: `"+8.3 pts"`, `"−5.0 pts"`, `"1.38"` for a ratio (value written `"1.98×"`), or `"11%"`. `check:content` rejects anything else. Put the method and test in `interval.method`; if an adjusted test finds no difference, say "no measurable difference" there, and the page labels it that way even when the raw interval excludes zero.
- **Evidence links are pinned** to a commit SHA, never a branch (`.../blob/<sha>/...`).
- **Dates:** give a time when several posts can land the same day, e.g. `date: 2026-10-24T21:08:00+01:00`, so ordering is stable.
- **Titles:** a question, ending `(experiment ID)`. The page hides the suffix and shows the ID as a label; the suffix stays in the `<title>`, feeds and search.
- **Topics** are a fixed list in `src/data/topics.ts` (and mirrored in `scripts/check-content.mjs`). Tag an experiment with the topics it informs, not with "measurement" unless it has no other topic.
- **Voice:** first person, British English, limits next to the numbers. Say when a result is exploratory, unadjusted, or from one model.
- **Next experiments** go in `src/data/next.ts`, only if a published page already proposes them. When one is run, it becomes an experiment page and leaves that list.
- Use `docs/templates/` to start a new article, experiment or guide, and `docs/news-posting.md` for news.

## Design rules

- Use the tokens in `src/styles/global.css` (`--ink`, `--ink-muted`, `--ink-faint`, `--accent`, `--surface`, …). No new hard-coded colours.
- Muted text must keep 4.5:1 contrast on the page and card surfaces in both themes. Don't use `--accent` as small text on tinted panels (about 4:1).
- Display type: letter-spacing no tighter than `-0.02em`.
- Show results with `ResultPlot` and the findings block, not with large coloured figures. A result whose interval includes no change, or whose adjusted test found no difference, must look neutral.
- Experiment cards derive their preview from the findings. Use a chart image only for in-page figures, with real alt text. Don't add decorative chips, gradients or icons.
- Keep the Starlight Guide visually consistent with the main site: change tokens, not one-off styles.

## Where things are

- Experiments: `src/content/experiments/*.md`; schema in `src/content.config.ts`.
- Results plot: `src/lib/results.ts`, `src/components/experiments/ResultPlot.astro`, `FindingsTable.astro`, `ExperimentCard.astro`.
- Home, `/experiments/`, `/measured/`, `/topics/`, `/findings/`: `src/pages/`.
- Guide (Starlight) chrome: `src/components/starlight/Header.astro` (same brand and main nav as the site) and `src/styles/starlight.css` (tokens mapped to the site's). The theme is shared between the two via `ptl-theme` / `starlight-theme`; keep that in sync if you touch either toggle.
- Redirects and sitemap filter: `astro.config.mjs`. Don't add old redirect stubs to the sitemap.
- Route baseline: `docs/route-baseline.txt`; add new routes there.
