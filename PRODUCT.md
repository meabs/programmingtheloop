# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Software engineers and other technically minded readers who want to learn how coding agents behave in practice and assess engineering practices against evidence.

## Product Purpose

Programming the Loop is an independent technical learning and research publication about coding agents. It turns practical experiments and engineering judgement into readable lessons that help readers understand what agents do well, where they fail, and how to build better workflows.

## Positioning

The publication distinguishes measured findings from engineering recommendations and keeps experimental limitations close to the claims they qualify.

## Operating Context

Readers use the site as a static, self-directed technical resource. They can read structured lessons online, inspect experiment write-ups and evidence links, and download a permanent ebook edition.

## Capabilities and Constraints

- Astro, TypeScript, Starlight and MDX generate a static site for GitHub Pages.
- Production URLs use `https://programmingtheloop.com` at the domain root.
- Content is maintained in Markdown or MDX without a CMS, backend, database or authentication.
- Keep existing content, routes, research evidence, downloads, SEO and GitHub Pages deployment functional during the redesign.
- Research findings must retain their source, conditions and limitations. Do not invent results for planned experiments.
- The first edition ebook is a permanent edition; future web updates do not alter the original PDF.
- Keep the website responsive and accessible, and respect reduced-motion preferences.

## Brand Commitments

The name is Programming the Loop and the tagline is “Evidence-led engineering for coding agents.” The site is an independent engineering research and learning publication, not a commercial SaaS product. The user supplied a binding redesign direction: midnight navy, warm ivory, restrained brass or gold editorial accents, teal for active technical elements, orbital or feedback-loop geometry, and a recognisable relationship to the ebook identity.

## Evidence on Hand

- `public/downloads/Programming-the-Loop-1st-edition.pdf` is the supplied first edition, “Programming the Loop: What I Measured with Coding Agents,” by Garry Meaburn, October 2026.
- The ebook contains eleven chapters and reports small, controlled trials with stated limitations. It explicitly distinguishes findings from recommendations.
- Existing lessons, experiments, methodology and references under `src/content/docs/` are part of the publication and must be preserved.
- Experiment “Knowing When You Don’t Know” is planned and must not be presented as completed.
- Do not fabricate metrics, dates, sample sizes, citations, sources, or experimental outcomes.

## Product Principles

- Present observations, engineering judgement and open questions distinctly.
- Keep claims connected to their source and their limitations.
- Make technical learning readable, navigable and useful on small screens.
- Preserve the integrity of the permanent ebook edition and historical research.
- Prefer static, maintainable implementation over unnecessary services or client-side infrastructure.
