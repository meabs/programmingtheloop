---
title: "Cross-repo questions, unread backend (experiment D1)"
description: "With the backend unread, agents answered 1 of 24 storefront-to-backend questions correctly."
date: 2026-10-17
summary: "With nothing, agents answered 1 of 24 cross-repo questions correctly at about 785k tokens per question; a guide or source reached 24 of 24."
type: "Controlled trial"
github:
  - label: "OKFExperiment"
    href: "https://github.com/meabs/OKFExperiment"
guideLinks:
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
  - label: "Chapter 9 — Tools and honest measurement"
    href: "/guides/programming-the-loop/tools-measurement/"
draft: true
experimentId: "D1"
question: "When a storefront change depends on a backend the agent cannot read, can it answer questions that need backend facts?"
status: planned
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
runs: 96
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
topics:
  - context
  - measurement
findings:
  - id: "D1-1"
    statement: "With the backend unread, agents answered 1 of 24 storefront-to-backend questions correctly, at about 785k tokens per question on average"
    metric: "correct answers of 24 (no-backend arm)"
    value: "1 / 24"
    n: "3 runs per question × 8 questions"
    limits:
      - "identifiers renamed so answers cannot come from memory of the public repo"
      - "one model"
      - "3 of 24 no-backend runs searched outside the workspace (contamination note in RESULTS.md)"
    source: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
    status: current
    featured: false
---

## Question

When a storefront change depends on a backend the agent cannot read, can it answer questions that need backend facts?

## Prediction

None written down for D1 in the Guide.

## Set-up

Shopizer React storefront; Shopizer Java backend not available; question-relevant identifiers renamed. Arms: no backend; backend source; backend bundle with/without confirm sentence. Codex. RESULTS.md section D1; results/D1-cross-repo-fresh-shopizer.md.

## Results

Finding D1-1 is below. (Foreword finding OKF-2 is about *change* tasks F/G, not these questions.)

## Limits

Renamed identifiers; one model; contamination: 3 of 24 no-backend runs searched the disk (RESULTS.md / Chapter 9). Token intervals on the no-backend arm are wide.

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment). See repository README; Guide does not list commands.
