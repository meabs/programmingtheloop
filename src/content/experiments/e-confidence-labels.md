---
title: "Confidence labels on wrong entries (experiment E)"
description: "Labels with a disclose-guesses instruction raised disclosure; accuracy did not reliably improve."
date: 2026-10-17
summary: "With an instruction to disclose guesses, agents said they relied on a guess in 6 of 16 answers instead of 0 of 16; accuracy did not reliably improve."
type: "Controlled trial"
github:
  - label: "OKFExperiment"
    href: "https://github.com/meabs/OKFExperiment"
guideLinks:
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
draft: false
experimentId: "E"
question: "Do confidence labels change what agents do when some guide entries are wrong and the source is unread?"
status: published
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
findings:
  - id: "E-1"
    statement: "With an instruction to disclose guesses, agents said they relied on a guess in 6 of 16 answers instead of 0 of 16; wrong answers fell only a little (11 to 8 of 16), not a reliable accuracy gain"
    metric: "disclosure of [medium] guess (of 16)"
    value: "0/16 → 6/16"
    n: "4 runs per question"
    limits:
      - "one model"
      - "backend source not available"
      - "accuracy change not reliable (Guide / RESULTS.md)"
    source: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
    status: current
    featured: false
---

## Question

Do confidence labels change what agents do when some guide entries are wrong and the source is unread?

## Prediction

None written down for E in the Guide.

## Set-up

Storefront working repo; backend guide present; backend source not available; some `[medium]` call entries made wrong on purpose. Codex. RESULTS.md section E; nested in Chapter 3 stale-knowledge discussion.

## Results

Finding E-1 is below.

## Limits

One model; unread backend; planted wrong entries. Guide: labels did not prevent stale answers in D2; disclosure is a keyword match checked by sampling.

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment). See repository README.
