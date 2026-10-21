---
title: "Internal call-structure questions (experiment H2)"
description: "For internal call-structure questions, only the guide and the source worked (21 of 24 each)."
date: 2026-10-17
summary: "Internal call-structure questions: guide and source 21 of 24 each; contract 8; note 0 of 24."
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
experimentId: "H2"
question: "For questions about internal call structure across a boundary, which knowledge kind works?"
status: planned
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
runs: 120
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/main/results/H2-contract-vs-okf-questions.md"
topics:
  - context
  - measurement
findings:
  - id: "H2-1"
    statement: "For internal call-structure questions, only the guide and the source worked, 21 of 24 each, against 8 for the contract and 0 for the note"
    metric: "correct of 24"
    value: "guide/source 21/24; contract 8/24; note 0/24"
    n: "24 runs per arm"
    limits:
      - "measured answers, not better changes"
      - "one model"
      - "network-clone contamination noted for related H runs (Chapter 9)"
    source: "https://github.com/meabs/OKFExperiment/blob/main/results/H2-contract-vs-okf-questions.md"
    status: current
    featured: false
---

## Question

For questions about internal call structure across a boundary, which knowledge kind works?

## Prediction

None written down for H2 in the Guide.

## Set-up

Same knowledge arms as H1; questions about internal call structure. Codex. Chapter 3; results/H2-contract-vs-okf-questions.md.

## Results

Finding H2-1 is below. Chapter 9 notes that with network access on, 56 of 120 runs cloned the public repository; all 8 of the contract arm's correct answers were among them (README, H2).

## Limits

Guide: that measured answers, not better changes. One model. Contamination under network access is a separate methodological limit.

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment). See repository README.
