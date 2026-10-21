---
title: "What kind of facts? Change tasks (experiment H1)"
description: "On harder cross-repo changes, contract, note, guide and source all beat nothing and did not differ reliably from each other."
date: 2026-10-17
summary: "Harder changes, five arms: nothing 4/16; contract 13; note 14; guide 14; source 14 of 16. The note was cheapest (~128k tokens)."
type: "Controlled trial"
github:
  - label: "OKFExperiment"
    href: "https://github.com/meabs/OKFExperiment"
guideLinks:
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
draft: false
experimentId: "H1"
question: "For harder cross-repo changes, what kind of facts help — contract, short note, guide, or source?"
status: published
evidenceGrade: published
publishedOn: 2026-10-12
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
runs: 80
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/main/results/H1-contract-vs-okf-changes.md"
topics:
  - context
  - measurement
findings:
  - id: "H1-1"
    statement: "On harder change tasks, nothing passed 4 of 16; contract 13, note 14, guide 14 and source 14 of 16 — the four knowledge arms beat nothing and did not differ reliably from each other"
    metric: "hidden-test passes of 16"
    value: "nothing 4/16; contract 13; note 14; guide 14; source 14 of 16"
    n: "16 runs per arm"
    limits:
      - "I wrote the note knowing the tasks, which favours it"
      - "contract generated from source by a script"
      - "with 16 runs per arm, gaps under about 30 points can't be separated"
      - "one model"
    source: "https://github.com/meabs/OKFExperiment/blob/main/results/H1-contract-vs-okf-changes.md"
    status: current
    featured: false
  - id: "H1-2"
    statement: "Among knowledge arms on those change tasks, the hand-written 3 KB note was cheapest at about 128k tokens per run"
    metric: "mean tokens per run"
    value: "~128k"
    n: "16 runs (notes arm)"
    limits:
      - "same H1 limits as H1-1"
      - "token totals favour the note I wrote knowing the tasks"
    source: "https://github.com/meabs/OKFExperiment/blob/main/results/H1-contract-vs-okf-changes.md"
    status: current
    featured: false
---

## Question

For harder cross-repo changes, what kind of facts help — an OpenAPI contract, a short note, a generated guide, or the source?

## Prediction

None written down for H1 in the Guide.

## Set-up

Harder change tasks again; five arms (nothing, OpenAPI contract, hand-written 3 KB note, generated guide, source); 16 runs each. Codex. Chapter 3 experiment H case study; results/H1-contract-vs-okf-changes.md.

## Results

Findings H1-1 and H1-2 are below.

## Limits

From the Guide: I wrote the note knowing the tasks, which favours it; the contract was generated from the source by a script; with 16 runs per arm, gaps under about 30 points can't be separated, so "level" doesn't mean "equivalent". Results file: ~131 runs per arm would be needed to detect a 20% cost difference.

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment). See repository README; Guide does not list commands.
