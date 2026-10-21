---
# TEMPLATE — copy into src/content/experiments/ as short-slug.md
# Keep draft: true until ready. Drafts are not published (not in listings, nav counts, or public routes).
title: "Short clear title"
description: "One sentence for cards and social previews."
summary: "One-line card summary."
date: 2026-11-01
type: "Controlled trial"
github:
  - label: "Repository name"
    href: "https://github.com/meabs/example"
guideLinks:
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
draft: true
experimentId: "X"
question: "One sentence."
# status: planned | running | published | superseded  (omit until structured)
# evidenceGrade: published | unpublished
# report: "https://github.com/…/results/….md"
# findings: []  # IDs <experimentId>-<n>; never reuse; leave empty rather than infer
---

## Question

Plain words. Only claims you can point to in a Guide chapter or a published repo write-up.

## Prediction

Link the pre-registration file if one exists. Otherwise say none was written down.

## Set-up

What was compared, on what repository, with which agent. Numbers only if the Guide or results file states them.

## Results

One-line lead-in to the generated findings table (or cards on small screens). Do not repeat the finding numbers here; put unique caveats in Limits.

## Limits

From the source's own caveats, in first-person British English. No hype, no new claims.

## Reproduce

Repository link and commands **only** if the source gives them.
