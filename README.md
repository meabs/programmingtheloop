# Programming the Loop

An independent engineering research and learning website about coding agents. The site uses Astro and Starlight, generates static files, and is configured for `https://programmingtheloop.com`.

## Local development

```sh
npm ci
npm run dev
```

Run `npm run build` to type-check and build the static site. Preview the production output with `npm run preview`.

## Content

- Add lessons as Markdown or MDX under `src/content/docs/learn/` and link them in `astro.config.mjs` when they should appear in the sidebar.
- Add an experiment page under `src/content/docs/experiments/`. Include the research question, hypothesis, setup, results, limitations, practical implications and evidence register. State unknown metadata as unavailable; do not infer it.
- Publish results only after definitions and evidence are stable. Link the task definitions, source code, run logs, commit and deviations where available. Keep historical findings and corrections traceable.
- Label direct observations as measured findings; distinguish recommendations and open questions. Keep limitations next to the claim.
- Update a recommendation by linking its evidence, explaining what changed and preserving the prior result record.
- Put downloads in `public/downloads/` and add an entry under `src/content/docs/downloads/` or `resources/`.
- The permanent ebook file is the original October 2026 PDF. Replace it only with a separately named edition, never overwrite the first edition.

## Analytics

No analytics script is enabled by default. To enable privacy-conscious Cloudflare Web Analytics, add the site token in Cloudflare and include its beacon snippet through an environment-driven build setting or a reviewed source change. Do not commit account credentials. Cloudflare Web Analytics runs without adding an application backend; ebook click measurement is intentionally not enabled until a privacy-appropriate, static-compatible approach is selected.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds on pushes to `main` and deploys with the supported Pages artifact and deploy actions. The Astro site URL is the apex domain, so it is built for `/`, not a repository subpath. `public/CNAME` ensures the custom-domain file is copied into the deployment artifact.

1. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
2. Configure the apex domain `programmingtheloop.com` at the DNS provider. GitHub Pages currently documents four A records (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) and an optional AAAA set (`2606:50c0:8000::153`, `:8001::153`, `:8002::153`, `:8003::153`). Confirm the current values in GitHub’s Pages custom-domain documentation before applying them. This repository does not change registrar settings.
3. Optionally create `www.programmingtheloop.com` as a CNAME to `meabs.github.io` if you want GitHub Pages to redirect the `www` name. Configure it in Pages after the apex domain is verified.
4. Wait for DNS and certificate provisioning, then enable **Enforce HTTPS** in Pages settings.
5. Verify the latest Actions workflow succeeded, visit `https://programmingtheloop.com`, and check the certificate, canonical URLs, sitemap and PDF download.

### Troubleshooting

- A Pages build failure is shown in the Actions run; reproduce it with `npm ci && npm run build` locally.
- A missing custom-domain file means `public/CNAME` is absent or incorrect; the workflow checks the deployed `dist/CNAME` value.
- DNS changes can take time to propagate. Check the apex A/AAAA records and remove conflicting records. Use GitHub’s current domain setup guidance rather than changing records by guesswork.
- If HTTPS is unavailable, wait for GitHub to provision the certificate and verify the domain records before enabling enforcement.
- If a route is missing, ensure the Markdown/MDX file is under `src/content/docs/` and use its generated route (for example, `src/content/docs/learn/getting-started.mdx` becomes `/learn/getting-started/`).

## Source and publication status

The original first-edition PDF is the source of the initial learning content. New content must preserve the distinction between an observation and a recommendation. Experiment K is a plan only; no results are published.
