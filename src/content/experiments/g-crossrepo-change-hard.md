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
draft: false
experimentId: "G"
question: "Does a backend guide still help on harder cross-repo changes that need several facts or parent-class fields?"
status: published
evidenceGrade: published
publishedOn: 2026-10-12
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
    statement: "On four harder cross-repository change tasks, hidden-test passes went from 3 of 20 with no guide to 18 of 20 with a guide to the backend, level with the agent being able to read the backend source (18 of 20)."
    metric: "hidden-test passes of 20"
    value: "3 / 20 → 18 / 20"
    n: "5 runs per task × 4 tasks"
    detail:
      - "Four tasks: fix deleteFromCart (the backend identifies the cart line by SKU), add an optional promoCode to addToCart, write a checkout request using six backend field names (some defined in parent classes), and normalise an orders-list response whose paging fields are in a parent class. Hidden Node tests, 5 runs per task per condition."
      - "Passes of 20: no guide 3; backend source 18; guide 18; guide with labels 17. Tokens per run: 294k, 333k, 301k, 308k."
      - "By task (g1 delete, g2 voucher, g3 checkout, g4 orders list), no guide: 3, 0, 0, 0 of 5. Guide: 5, 5, 3, 5. Source: 5, 4, 4, 5."
      - "The 3 passes without a guide were all on g1, where the SKU could be guessed. Where the name was not guessable, no-guide agents passed 0 of 15 here, and 0 of 30 across F and G."
      - "g3 (checkout) was hardest in every condition. Guide against source: 18 against 18 of 20 (p = 1.0). Both beat no guide (p < 0.001)."
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

Finding G-1 is above. Foreword composite [OKF-2](/experiments/okf-worked-example/) also covers F and is not redefined here.

Baseline arm: **no_okf**. Relative cost is each run's tokens divided by the baseline's mean for the same question; 1.00 means equal, lower is cheaper.

### codex

| arm | runs | correct | tokens per run (95% CI) | relative cost (95% CI) | verdict | turns | used tool | seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| no_okf | 20 | - (verified 3/20) | 294k (235k to 366k) | 1.00 | baseline | 6.3 | - | 42 |
| source | 20 | - (verified 18/20) | 333k (284k to 389k) | 1.16 (1.02 to 1.31) | dearer | 7.3 | 19/20 | 45 |
| okf | 20 | - (verified 18/20) | 301k (257k to 351k) | 1.12 (0.89 to 1.39) | no clear difference | 6.7 | 20/20 | 38 |
| okf_confidence | 20 | - (verified 17/20) | 308k (267k to 353k) | 1.10 (0.94 to 1.29) | no clear difference | 7.7 | 20/20 | 38 |

Run-to-run spread (coefficient of variation of relative cost) is 0.41. To detect a 20% difference with 80% power you would need about **66 runs per arm** (larger differences need fewer); this trial has 20.

### Tokens by question (mean, thousands)

| question | codex/no_okf | codex/okf | codex/okf_confidence | codex/source |
| --- | --- | --- | --- | --- |
| g1_delete_item | 399k | 259k | 304k | 313k |
| g2_add_voucher | 237k | 378k | 278k | 295k |
| g3_checkout_request | 342k | 292k | 381k | 490k |
| g4_orders_list | 197k | 274k | 269k | 234k |

Token totals are not comparable between agents (see adapters.py). Treat a verdict as evidence only when the interval excludes 1.00, and as provisional below 8 runs per arm.

Full report: [results/G-harder-crossrepo-change-tasks.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/G-harder-crossrepo-change-tasks.md) (pinned to commit `5a09027`).

## Limits

5 runs per task; one model; Guide notes where the name wasn't guessable, no-guide agents passed 0 of 15 here (0 of 30 across F and G).

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment). See repository README.
