# Programming the Loop

Site for **agentic engineering** (working with coding agents: practices, measurements, experiments and notes), by Garry Meaburn. Hosted at [programmingtheloop.com](https://programmingtheloop.com).

Built with Astro and Starlight for GitHub Pages. The free ebook *Programming the Loop: What I Measured with Coding Agents* (first edition, October 2026) is a featured section, not the whole site identity.

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
| `/` | Site home (agentic engineering) | Yes |
| `/book/` | Ebook hub (summary, findings, licence, download) | Yes |
| `/contents/`, `/downloads/`, `/learn/…` | Book contents, PDF, chapter notes | Via Book |
| `/about/` | About the site and author | Yes |
| `/notes/` | Notes/writing (empty until published) | No until content exists |
| `/experiments/` | Experiment write-ups (empty until published) | No until content exists |
| `/updates/` | Dated updates (empty until published) | No until content exists |

Main nav is defined in `src/site.ts` (`NAV`). Shared chrome for custom pages is `src/layouts/BaseLayout.astro`. Starlight sidebar is in `astro.config.mjs`.

**What exists today:** the book (PDF + chapter notes) and the [worked example](https://github.com/meabs/ProgrammingTheLoop-WorkedExample). Do not invent articles, experiments, quotes or download counts to fill sections.

## How to add a new section page

1. Add Markdown/MDX under the right folder, e.g. `src/content/docs/notes/my-note.mdx`.
2. Frontmatter:

   ```md
   ---
   title: My note title
   description: One sentence for search and social previews.
   ---
   ```

3. URL follows the path: `notes/my-note.mdx` → `/notes/my-note/`.
4. When the section has real content, add it to `NAV` in `src/site.ts` and optionally to the Starlight `sidebar` in `astro.config.mjs`.
5. Run `npm run build`.

Keep **findings** (measured, with limits) separate from **recommendations** and **open questions**.

## Ebook PDF

- File: `public/downloads/Programming-the-Loop-1st-edition.pdf`
- Do not overwrite the first edition in place; use a new filename for later editions.

Licence (site wording): free to read; share the unchanged PDF free of charge with attribution and the copyright notice; no selling, no commercial use, no modified versions without permission. PDF only on this site.

## SEO and sharing

- `site` in `astro.config.mjs` is `https://programmingtheloop.com`.
- Site-level title/description: agentic engineering (`src/site.ts`).
- Book pages (`/book/`, `/contents/`, downloads, chapter notes): book-specific description; `og:image` / `twitter:image` use absolute `https://programmingtheloop.com/og-cover.png`.
- `public/CNAME` must remain `programmingtheloop.com`.
- `public/robots.txt` allows indexing and points at the sitemap.

No analytics or tracking scripts. No API keys in the repository.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`. The workflow checks that `dist/CNAME` equals `programmingtheloop.com`.

**Settings → Pages → GitHub Actions.** Configure DNS for the apex domain at the registrar. Enable **Enforce HTTPS** after the certificate is ready.
