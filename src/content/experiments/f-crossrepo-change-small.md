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
draft: false
experimentId: "F"
question: "When the agent must change the storefront using facts only the backend states, how much does a backend guide help?"
status: published
evidenceGrade: published
publishedOn: 2026-10-12
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
    statement: "On four small cross-repository change tasks, hidden-test passes went from 3 of 20 with no guide to 19 of 20 with a guide to the backend, at about half the tokens (242k against 482k per run)."
    metric: "hidden-test passes of 20"
    value: "3 / 20 → 19 / 20"
    n: "5 runs per task × 4 tasks"
    detail:
      - "Four tasks, each to create a small storefront module using a fact only the backend states: the discount-code field on an add-to-cart request, the backend's paging names (size, offset), the reviews path (product/{id}/reviews), and the purchase flag in the public config response (purchasingEnabled). Hidden Node tests, 5 runs per task per condition."
      - "Passes by task (f1, f2, f3, f4): no guide 3, 0, 0, 0; guide 5, 5, 4, 5; guide with confidence labels 5, 3, 2, 5."
      - "The 3 passes without a guide were all on the first task, where the field name (voucher) is a word an agent can guess. No guide against guide: 3 against 19 of 20, p < 0.001."
      - "Labels did not help: 15 of 20 against 19 of 20 for the plain guide (p about 0.18, not a reliable difference), at 235k tokens per run."
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

Finding F-1 is above. Foreword composite [OKF-2](/experiments/okf-worked-example/) also covers G and is not redefined here.

Baseline arm: **no_okf**. Relative cost is each run's tokens divided by the baseline's mean for the same question; 1.00 means equal, lower is cheaper.

### codex

| arm | runs | correct | tokens per run (95% CI) | relative cost (95% CI) | verdict | turns | used tool | seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| no_okf | 20 | - (verified 3/20) | 482k (301k to 681k) | 1.00 | baseline | 5.0 | - | 48 |
| okf | 20 | - (verified 19/20) | 242k (203k to 286k) | 0.80 (0.51 to 1.15) | no clear difference | 5.2 | 20/20 | 27 |
| okf_confidence | 20 | - (verified 15/20) | 235k (205k to 270k) | 0.74 (0.51 to 1.02) | no clear difference | 5.2 | 20/20 | 30 |

Run-to-run spread (coefficient of variation of relative cost) is 0.87. To detect a 20% difference with 80% power you would need about **296 runs per arm** (larger differences need fewer); this trial has 20.

### Tokens by question (mean, thousands)

| question | codex/no_okf | codex/okf | codex/okf_confidence |
| --- | --- | --- | --- |
| f1_cart_request | 652k | 165k | 193k |
| f2_search_request | 357k | 221k | 242k |
| f3_reviews_request | 130k | 247k | 210k |
| f4_store_config | 790k | 335k | 294k |

Token totals are not comparable between agents (see adapters.py). Treat a verdict as evidence only when the interval excludes 1.00, and as provisional below 8 runs per arm.

Full report: [results/F-crossrepo-change-tasks.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/F-crossrepo-change-tasks.md) (pinned to commit `5a09027`).

## Limits

5 runs per task; renamed identifiers; one model. Guide/RESULTS note task-wording issues on a prefix and an ambiguous config field (fixed before counted runs).

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment). See repository README.
