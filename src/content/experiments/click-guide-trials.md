---
title: "Click guide trials (experiment A)"
description: "On Click, a generated guide did not improve correctness and cost more tokens."
date: 2026-10-17
summary: "On Click, agents were already near ceiling with or without a guide; the default guide cost 1.07–1.30× tokens, and the thinnest guide was dearest."
type: "Controlled trial"
github:
  - label: "OKFExperiment"
    href: "https://github.com/meabs/OKFExperiment"
guideLinks:
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
draft: true
experimentId: "A"
question: "On a smaller library the agent can read, does a generated guide improve answers or change cost?"
status: planned
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "medium reasoning"
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
topics:
  - context
  - measurement
findings:
  - id: "A-1"
    statement: "On Click, agents answered near ceiling with or without a guide; the default guide cost more tokens, and the thinnest (names-only) guide was reliably the dearest"
    metric: "relative token cost vs no-guide arm"
    value: "1.07–1.42×"
    n: "24 runs per arm (v1); 24 per arm (v2)"
    limits:
      - "one repository (Click)"
      - "one model"
      - "accuracy already at ceiling in every arm"
      - "v1 and v2 not run simultaneously"
    source: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
    status: current
    featured: false
---

## Question

On a smaller library the agent can read, does a generated guide improve answers or change cost?

## Prediction

None written down for this trial in the Guide.

## Set-up

Click, with and without a generated guide, including a default guide and a thinnest (names-only) guide. Codex. Reported in OKFExperiment docs/RESULTS.md section A (v1 with a "confirm in source" pointer sentence; v2 without it).

## Results

Findings are in the table below.

## Limits

One repository, one model, and accuracy already at the ceiling in every arm, so the trial is about cost. The Guide notes v1 and v2 were not run simultaneously. RESULTS.md Limits section also covers small cells and one-model scope for the OKF series.

## Reproduce

Repository: [OKFExperiment](https://github.com/meabs/OKFExperiment). Commands are not given in the Guide chapter; see the repository README for how to reproduce OKF trials.
