---
title: "Agent-optimised repository"
description: "Experiment J: a fully set-up repository cost more tokens with no reliable gain in correctness."
date: 2026-10-17
summary: "On a readable Java backend, the recommended agent set-up used 35–48% more tokens with no reliable correctness gain."
type: "Controlled trial"
github:
  - label: "OKFExperiment"
    href: "https://github.com/meabs/OKFExperiment"
guideLinks:
  - label: "Foreword findings"
    href: "/guides/programming-the-loop/foreword/"
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
draft: false
experimentId: "J"
question: "Does a repository set up for agents do better than the same repository left as it is?"
status: published
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "medium reasoning, isolation on"
runs: 112
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/main/results/J-optimised-repo.md"
prediction: "https://github.com/meabs/OKFExperiment/blob/main/docs/EXPERIMENT_J.md"
topics:
  - context
  - measurement
publishedOn: 2026-10-17
findings:
  - id: "J-1"
    statement: "A fully agent-optimised repository cost more tokens with no reliable correctness gain"
    metric: "relative token cost vs plain arm"
    value: "+35–48%"
    interval:
      low: "1.38"
      high: "1.60"
      method: "bootstrap 95% CI on relative cost (task-equalized mean 1.48×)"
    n: 112
    limits:
      - "one repository"
      - "one model"
      - "mechanical edits and structure questions"
      - "8 runs per task per arm"
      - "four ingredients tested together"
    source: "https://github.com/meabs/OKFExperiment/blob/main/results/J-optimised-repo.md"
    status: current
    featured: true
---

## What I asked

Does a repository *set up for agents* do better than the same repository left as it is? On a 1,173-file Java backend the agent could read, I compared a plain copy with one that had a generated guide, a code graph, three operating skills and a configured `AGENTS.md`.

## What I measured

**112 runs** (experiment J): four mechanical changes and three structure questions, 8 runs per task per arm, Codex with isolation on. The set-up was used: the agent ran the graph tool and opened the guide in all 56 optimised runs, and read the navigation skill in 55.

Changes passed 28 of 32 (plain) against 29 of 32 (optimised). Structure questions 16 of 24 against 19 of 24. Neither difference is reliable. Tokens: **35–48% more** on the optimised arm (depending how you ratio them), with a bootstrap interval that stays above 1.

*Limits (as in the book):* one repository, one model, mechanical edits and structure questions, 8 runs per task per arm, four ingredients tested together.

## Where to read more

- Full write-up and charts: [Chapter 3](/guides/programming-the-loop/right-facts/)
- Headline finding: [Foreword](/guides/programming-the-loop/foreword/)
- Source tables: [OKFExperiment, results/J-optimised-repo.md](https://github.com/meabs/OKFExperiment/blob/main/results/J-optimised-repo.md)
