---
# TEMPLATE — copy into src/content/experiments/ as short-slug.md
# Keep draft: true until ready. Drafts are not published (not in listings, nav counts, or public routes).
title: "A clear question? (experiment X)"
description: "One sentence for cards and social previews."
summary: "One-line card summary."
# Give a time when other posts may land the same day, so the order is stable:
date: 2026-11-01T09:00:00+00:00
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
status: published        # planned | running | published | superseded
evidenceGrade: published # published | unpublished
report: "https://github.com/meabs/example/blob/<commit-sha>/REPORT.md"   # pinned to a commit
topics:                  # ids from src/data/topics.ts; avoid "measurement" unless nothing else fits
  - verification
# previewImage / previewAlt: optional; cards draw their plot from the findings
findings:                # IDs <experimentId>-<n>; never reuse; leave empty rather than infer
  - id: "X-1"
    statement: "What was found, with the comparison and the counts."
    metric: "what is differenced, and against what"
    value: "+8.3 pts"    # or "1.98×" for a ratio
    interval:            # plain numbers, one unit: "+3.0 pts", "1.54" (ratio), "11%"
      low: "+3.0 pts"
      high: "+13.5 pts"
      method: "bootstrap 95% CI over N tasks; test and adjusted p; say 'no measurable difference' if that is the conclusion"
    n: 60
    limits:
      - "One model, N synthetic tasks"
    source: "https://github.com/meabs/example/blob/<commit-sha>/REPORT.md"
    status: current
---

## Question

Plain words. Only claims you can point to in a Guide chapter or a published repo write-up.

## Prediction

Link the pre-registration file if one exists. Otherwise say none was written down.

## Set-up

What was compared, on what repository, with which agent. Numbers only if the Guide or results file states them.

## Results

One-line lead-in to the generated findings (table on desktop; cards on small screens). Do not repeat the finding numbers here; put unique caveats in Limits.

## Limits

From the source's own caveats, in first-person British English. No hype, no new claims.

## Reproduce

Repository link and commands **only** if the source gives them.
