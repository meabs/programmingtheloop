---
title: "Cross-repo change tasks, small (experiment F)"
description: "Hidden-test passes on small cross-repo changes: 3 of 20 with nothing, 19 of 20 with a backend guide."
date: 2026-10-17
summary: "Small cross-repo changes: 3 of 20 with nothing, 19 of 20 with a backend guide. Foreword composite OKF-2 also covers G."
type: "Controlled trial"
github:
  - label: "OKFExperiment"
    href: "https://github.com/meabs/OKFExperiment"
guideLinks:
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
  - label: "Published composite (OKF-2)"
    href: "/experiments/okf-worked-example/"
draft: true
experimentId: "F"
question: "When the agent must change the storefront using facts only the backend states, how much does a backend guide help?"
status: planned
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
runs: 60
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/main/results/F-crossrepo-change-tasks.md"
topics:
  - context
  - measurement
findings:
  - id: "F-1"
    statement: "On small cross-repository change tasks, hidden-test passes went from 3 of 20 with nothing to 19 of 20 with a backend guide"
    metric: "hidden-test passes of 20"
    value: "3 / 20 → 19 / 20"
    n: "5 runs per task × 4 tasks"
    limits:
      - "5 runs per task"
      - "identifiers renamed by me"
      - "one model"
      - "task wording ambiguity noted for one prefix case (RESULTS.md F)"
    source: "https://github.com/meabs/OKFExperiment/blob/main/results/F-crossrepo-change-tasks.md"
    status: current
    featured: false
---

## Question

When the agent must change the storefront using facts only the backend states, how much does a backend guide help on small tasks?

## Prediction

None written down for F in the Guide.

## Set-up

Four small ES-module tasks; hidden Node tests; arms include no OKF, OKF, OKF with confidence labels. Codex. RESULTS.md section F; results/F-crossrepo-change-tasks.md.

## Results

Finding F-1 is in the table below. Foreword composite [OKF-2](/experiments/okf-worked-example/) also covers G and is not redefined here.

## Limits

5 runs per task; renamed identifiers; one model. Guide/RESULTS note task-wording issues on a prefix and an ambiguous config field (fixed before counted runs).

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment). See repository README.
