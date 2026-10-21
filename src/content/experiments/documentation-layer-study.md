---
title: "Documentation-layer study"
description: "Unpublished comparison of documentation layouts: heavy always-loaded context cost more; lean skills were discovered unprompted."
date: 2026-10-17
summary: "Lower-grade unpublished study: heavy layout +40.3% tokens on a simple change; lean skills opened in 24 of 24 cells without prompts."
type: "Controlled trial"
github:
  - label: "AgentTrialRig (trial set-up)"
    href: "https://github.com/meabs/AgentTrialRig"
guideLinks:
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
  - label: "Chapter 9 — Tools and honest measurement"
    href: "/guides/programming-the-loop/tools-measurement/"
draft: false
experimentId: "DOCLAYER"
question: "Given that you have some documentation for agents, which layout costs least, and do agents find the right parts unprompted?"
status: published
evidenceGrade: unpublished
publishedOn: 2026-10-11
agents: []
repo: "https://github.com/meabs/AgentTrialRig"
report: "https://github.com/meabs/AgentTrialRig/blob/main/examples/fastapi-doc-layers/README.md"
topics:
  - context
  - measurement
findings:
  - id: "DOCLAYER-1"
    statement: "The heavy design was dearer on the simple change in all four rounds: +40.3% tokens, +28.7% cost"
    metric: "token delta vs comparison arm on simple change"
    value: "+40.3% tokens; +28.7% cost"
    n: "four independent rounds per design and task"
    limits:
      - "author's unpublished document; numbers can't be independently checked"
      - "heavy design also run with prescriptive prompts (prompt and layout confounded)"
      - "lower-grade evidence than published OKF / J trials"
    source: "https://github.com/meabs/AgentTrialRig/blob/main/examples/fastapi-doc-layers/README.md"
    status: current
    featured: false
  - id: "DOCLAYER-2"
    statement: "With prompts that never mentioned any of the documentation, the lean design was discovered and the task-relevant skills opened in 24 of 24 measured cells"
    metric: "cells where lean skills were opened unprompted"
    value: "24 / 24"
    limits:
      - "unpublished document; numbers can't be independently checked"
      - "lower-grade evidence"
    source: "https://github.com/meabs/AgentTrialRig/blob/main/examples/fastapi-doc-layers/README.md"
    status: current
    featured: false
---

## Question

Given that you have some documentation for agents, which layout costs least, and do agents find the right parts unprompted?

## Prediction

None published. The study document itself is unpublished.

## Set-up

Six documentation layouts on copies of one FastAPI and React application; four independent rounds per design and task; cost from the provider transcript. External check on five other open-source repositories (one run per cell). Guide Chapter 3 case study. Trial set-up published as AgentTrialRig examples/fastapi-doc-layers; figures from the unpublished study document.

## Results

Findings DOCLAYER-1 and DOCLAYER-2 are below. Guide also: lean cheaper than baseline in 7 of 8 rounds on both change tasks (two-sided binomial p = 0.07) — suggestive, not confirmed; external repos: comprehension cheaper in four of five, code-change cost both ways, three of five generated layers contained a task-relevant factual error.

### The trial set-up

Does an agent-facing documentation layer change what a coding agent spends on real change tasks? This trial is ported from the original Codex task matrix: one FastAPI, SQLModel and PostgreSQL application (the upstream [full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template)) cloned with byte-identical code and different documentation layers.

| Arm | Repository | Layer |
| --- | --- | --- |
| `baseline` | `repo-baseline` | none |
| `skill` | `repo-agent-skill` | `AGENTS.md` index plus six task-scoped skills |
| `recommended` | `repo-agent-recommended` | the same skills, with the load-bearing facts folded into the knowledge docs |

Two tasks: `simple_change` (add an `order_by` parameter to the item listing) and `complex` (an archive and soft-delete feature across backend, migration and frontend). The prompts are the original baseline prompts; the self-reported metrics block is dropped because trialrig measures tokens and tool calls itself.

### What a pilot showed

Three runs per arm of `simple_change` with Codex, baseline against the recommended layer: 2 of 3 verified in each arm, and a relative cost of 1.12 (interval 0.78 to 1.47) for the recommended layer, which is no clear difference. After a single run each it had looked like baseline failing and recommended passing. Three runs per arm is far too few to rank the layers; the report estimates about 39 runs per arm to detect a 20% difference at that spread.


### The complex task

Three runs per arm of `complex` (the archive feature across backend, migration and frontend) with Codex `gpt-5.6-luna`, baseline against the recommended layer: all six verified, and the mean cost was the same, about 5.1 million tokens per run in both arms (relative cost 1.00, interval 0.83 to 1.09). The runs were long (3.4 to 6.6 million tokens each, mostly cached input). At that spread about 9 runs per arm would be needed to detect a 20% difference. On this task and agent the documentation layer made no measurable difference to cost or correctness.


Source: [AgentTrialRig examples/fastapi-doc-layers](https://github.com/meabs/AgentTrialRig/blob/e54514ae9575c3f878031cce4fc45fcfc749f409/examples/fastapi-doc-layers/README.md) (pinned to commit `e54514a`).

## Limits

Guide's own framing: lower-grade evidence; you can't check its numbers against a public results file; heavy arm confounded with prompts; external cells are single runs; where this study and Experiment J pull in different directions, the book follows J.

## Reproduce

Trial set-up: [AgentTrialRig examples/fastapi-doc-layers](https://github.com/meabs/AgentTrialRig/blob/main/examples/fastapi-doc-layers/README.md). The study document is unpublished, so the figures cannot be re-derived from a public table.
