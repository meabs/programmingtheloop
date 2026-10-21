---
title: "Cross-repo change tasks, harder (experiment G)"
description: "Harder cross-repo changes: 3 of 20 with nothing, 18 of 20 with a backend guide (level with source)."
date: 2026-10-17
summary: "Harder cross-repo changes: 3 of 20 with nothing, 18 of 20 with a guide, level with readable source. Foreword composite OKF-2 also covers F."
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
experimentId: "G"
question: "Does a backend guide still help on harder cross-repo changes that need several facts or parent-class fields?"
status: planned
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
runs: 80
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/main/results/G-harder-crossrepo-change-tasks.md"
topics:
  - context
  - measurement
findings:
  - id: "G-1"
    statement: "On harder cross-repository change tasks, hidden-test passes went from 3 of 20 with nothing to 18 of 20 with a backend guide, level with readable source (18 of 20)"
    metric: "hidden-test passes of 20"
    value: "3 / 20 → 18 / 20"
    n: "5 runs per task × 4 tasks"
    limits:
      - "5 runs per task"
      - "extra renames on inherited fields"
      - "one model"
    source: "https://github.com/meabs/OKFExperiment/blob/main/results/G-harder-crossrepo-change-tasks.md"
    status: current
    featured: false
---

## Question

Does a backend guide still help on harder cross-repo changes that need several facts or parent-class fields?

## Prediction

None written down for G in the Guide.

## Set-up

Four harder tasks; arms include no OKF, backend source, OKF, OKF with labels. Codex. RESULTS.md section G; results/G-harder-crossrepo-change-tasks.md.

## Results

Finding G-1 is below. Foreword composite [OKF-2](/experiments/okf-worked-example/) also covers F and is not redefined here.

## Limits

5 runs per task; one model; Guide notes where the name wasn't guessable, no-guide agents passed 0 of 15 here (0 of 30 across F and G).

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment). See repository README.
