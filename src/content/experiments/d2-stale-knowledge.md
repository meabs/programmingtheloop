---
title: "Stale knowledge across a boundary (experiment D2)"
description: "After planted backend renames, a stale guide gave the old answer in 14 of 16 drift answers."
date: 2026-10-17
summary: "Headline finding lives once as OKF-1 on the published okf-worked-example record. This page is the D2 trial write-up."
type: "Controlled trial"
github:
  - label: "OKFExperiment"
    href: "https://github.com/meabs/OKFExperiment"
guideLinks:
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
  - label: "Foreword"
    href: "/guides/programming-the-loop/foreword/"
  - label: "Published record (OKF-1)"
    href: "/experiments/okf-worked-example/"
draft: false
experimentId: "D2"
question: "When a guide is stale and the agent cannot read the dependency, does it repeat old facts?"
status: planned
evidenceGrade: published
publishedOn: 2026-10-12
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
topics:
  - context
  - verification
findings: []
---

## Question

When a guide is stale and the agent cannot read the dependency, does it repeat old facts?

## Prediction

None written down for D2 in the Guide.

## Set-up

Backend renamed after the guide was generated; agent had the stale guide and no backend source. Codex. RESULTS.md section D2.

## Results

**Finding defined once:** [OKF-1](/experiments/okf-worked-example/) on the published okf-worked-example record. This page does not redefine that finding. Guide also reports the source-arm, confirm-sentence, `stale_after`, and control arms — see RESULTS.md section D2.

## Limits

Planted drift; 4 runs per question; one model. From the Guide's own caveat: the drift was planted, so it tells you nothing about how often drift happens in real pipelines.

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment); RESULTS.md section D2 and results/D2-cross-repo-stale-shopizer.md.
