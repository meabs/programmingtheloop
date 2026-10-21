---
title: "Skill packs across 16 tasks (experiment SKT)"
description: "Skill packs did not reliably raise the pass rate; Superpowers cost about three times the tokens."
date: 2026-10-21
summary: "On 16 shopizer tasks, neither Superpowers nor Matt Pocock's skills reliably raised the pass rate; Superpowers used 3.07× the tokens."
type: "Controlled trial"
github:
  - label: "experiments"
    href: "https://github.com/meabs/experiments/tree/main/2026-10-skills-tasks"
draft: false
experimentId: "SKT"
question: "On a varied set of real change tasks, do Superpowers or Matt Pocock's skills raise the share of changes that pass independent acceptance tests, and at what cost in tokens?"
status: published
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "low reasoning, isolation on"
runs: 128
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/main/2026-10-skills-tasks/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/main/2026-10-skills-tasks/README.md"
topics:
  - verification
  - measurement
publishedOn: 2026-10-21
findings:
  - id: "SKT-1"
    statement: "Neither skill pack reliably raised the pass rate: Superpowers passed 24 of 32 runs, the same as the control, and Pocock passed 27 of 32 (Holm p = 0.38)"
    metric: "Pocock vs control, mean per-task difference in pass rate"
    value: "+9.4 pts"
    interval:
      low: "−3.1 pts"
      high: "+21.9 pts"
      method: "bootstrap 95% CI over 16 tasks"
    n: 128
    limits:
      - "one repository"
      - "one model at low reasoning effort"
      - "16 tasks, 2 runs per task per arm"
    source: "https://github.com/meabs/experiments/blob/main/2026-10-skills-tasks/REPORT.md"
    status: current
    featured: false
  - id: "SKT-2"
    statement: "Superpowers used about three times the control's tokens per task; it wrote tests in 23 of 32 runs, where the control wrote none"
    metric: "per-task token ratio vs control"
    value: "3.07×"
    interval:
      low: "2.50"
      high: "3.68"
      method: "bootstrap 95% CI over 16 tasks"
    n: 64
    limits:
      - "one repository"
      - "one model at low reasoning effort"
    source: "https://github.com/meabs/experiments/blob/main/2026-10-skills-tasks/REPORT.md"
    status: current
    featured: false
  - id: "SKT-3"
    statement: "In 28 of the 30 failed runs, the agent said its change worked; this held in every arm"
    metric: "failed runs that claimed success"
    value: "28/30"
    n: 128
    limits:
      - "the agent could not see the hidden tests"
      - "one model at low reasoning effort"
    source: "https://github.com/meabs/experiments/blob/main/2026-10-skills-tasks/REPORT.md"
    status: current
    featured: false
---

## Question

On a varied set of real change tasks, do Superpowers or Matt Pocock's skills raise the share of changes that pass independent acceptance tests, and at what cost in tokens?

## Prediction

Hypotheses and task selection rule written down before the measured runs: [README.md](https://github.com/meabs/experiments/blob/main/2026-10-skills-tasks/README.md).

## Set-up

shopizer (Java); arms none, placebo, Superpowers, Pocock; 16 tasks (10 real bugs, 1 planted bug, 5 features); 2 runs per task per arm; hidden API tests the agent never saw. Codex, low reasoning. REPORT.md in experiments/2026-10-skills-tasks.

## Results

Findings SKT-1 to SKT-3 are below.

## Limits

One repository; one model; low reasoning effort only; 16 tasks, too few to settle an effect the size of Pocock's; the placebo moved 4 of 16 tasks by one run. I wrote the tasks and hidden tests. Pass rates are not comparable with the high-effort [skills-impact](https://github.com/meabs/experiments/tree/main/2026-10-skills-impact) experiment.

## Reproduce

[experiments/2026-10-skills-tasks](https://github.com/meabs/experiments/tree/main/2026-10-skills-tasks); commands in REPORT.md, section Reproducing.
