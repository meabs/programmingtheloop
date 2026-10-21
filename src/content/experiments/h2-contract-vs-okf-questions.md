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
draft: false
experimentId: "H2"
question: "For questions about internal call structure across a boundary, which knowledge kind works?"
status: published
evidenceGrade: published
publishedOn: 2026-10-12
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
runs: 120
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/H2-contract-vs-okf-questions.md"
topics:
  - context
  - measurement
findings:
  - id: "H2-1"
    statement: "On six internal call-structure questions, the guide and the backend source each answered 21 of 24 correctly, against 8 of 24 for the contract, 0 of 24 for the hand-written note and 1 of 24 with nothing."
    metric: "correct of 24"
    value: "guide/source 21/24; contract 8/24; note 0/24"
    n: "24 runs per arm"
    detail:
      - "Tokens per run: nothing 447k; contract 464k; note 476k; guide 170k; source 207k. Relative cost against nothing: guide 0.40 (95% CI 0.35 to 0.46), source 0.47 (0.42 to 0.52); contract and note no clear difference."
      - "Guide against contract (21 of 24 against 8 of 24) and against note (21 against 0): p < 0.001. Nothing against contract: p = 0.023."
      - "Contamination: the network was on, and 56 of 120 runs cloned the public Shopizer repository (nothing 19 of 24, contract 18, note 19, guide and source none). All 8 contract passes were among them."
      - "Without those 56 runs: nothing 1 of 5, contract 0 of 6, note 0 of 5, guide 21 of 24, source 21 of 24."
    limits:
      - "measured answers, not better changes"
      - "one model"
      - "network-clone contamination noted for related H runs (Chapter 9)"
    source: "https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/H2-contract-vs-okf-questions.md"
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

Finding H2-1 is above. Chapter 9 notes that with network access on, 56 of 120 runs cloned the public repository; all 8 of the contract arm's correct answers were among them (README, H2).

Baseline arm: **none**. Relative cost is each run's tokens divided by the baseline's mean for the same question; 1.00 means equal, lower is cheaper.

### codex

| arm | runs | correct | tokens per run (95% CI) | relative cost (95% CI) | verdict | turns | used tool | seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| none | 24 | 1/24 | 447k (385k to 509k) | 1.00 | baseline | 7.2 | - | 53 |
| contract | 24 | 8/24 | 464k (401k to 535k) | 1.10 (0.91 to 1.29) | no clear difference | 7.9 | 24/24 | 57 |
| notes | 24 | 0/24 | 476k (413k to 550k) | 1.13 (0.93 to 1.37) | no clear difference | 7.8 | 24/24 | 52 |
| okf | 24 | 21/24 | 170k (155k to 186k) | 0.40 (0.35 to 0.46) | cheaper | 4.6 | 24/24 | 22 |
| source | 24 | 21/24 | 207k (181k to 234k) | 0.47 (0.42 to 0.52) | cheaper | 5.3 | 23/24 | 28 |

Run-to-run spread (coefficient of variation of relative cost) is 0.66. To detect a 20% difference with 80% power you would need about **169 runs per arm** (larger differences need fewer); this trial has 24.

### Tokens by question (mean, thousands)

| question | codex/contract | codex/none | codex/notes | codex/okf | codex/source |
| --- | --- | --- | --- | --- | --- |
| h2_e1_login | 305k | 487k | 337k | 146k | 214k |
| h2_e2_search | 450k | 254k | 500k | 166k | 136k |
| h2_e3_cart_delete | 443k | 472k | 487k | 148k | 156k |
| h2_e4_cart_add | 569k | 484k | 421k | 196k | 265k |
| h2_e5_shipping | 514k | 515k | 692k | 198k | 272k |
| h2_e7_register | 501k | 471k | 421k | 164k | 201k |

Token totals are not comparable between agents (see adapters.py). Treat a verdict as evidence only when the interval excludes 1.00, and as provisional below 8 runs per arm.


### Pass counts and pairwise tests (scripts/analyse_h.py)

**All 120 runs**

| Arm | Passed | Tokens per run | Against `none` |
| --- | --- | --- | --- |
| `none` | 1 of 24 | 447k | 1.00 |
| `contract` | 8 of 24 | 464k | 1.04 |
| `notes` | 0 of 24 | 476k | 1.07 |
| `okf` | 21 of 24 | 170k | 0.38 |
| `source` | 21 of 24 | 207k | 0.46 |

Pairs (two-sided Fisher exact):

- `contract` 8/24 against `okf` 21/24: p = 0.000 (reliable)
- `notes` 0/24 against `okf` 21/24: p = 0.000 (reliable)
- `okf` 21/24 against `source` 21/24: p = 1.000
- `contract` 8/24 against `notes` 0/24: p = 0.004 (reliable)
- `none` 1/24 against `contract` 8/24: p = 0.023 (reliable)
- `none` 1/24 against `okf` 21/24: p = 0.000 (reliable)

Per task (passed of runs):

| Task | `none` | `contract` | `notes` | `okf` | `source` |
| --- | --- | --- | --- | --- | --- |
| h2_e1_login | 0/4 | 3/4 | 0/4 | 4/4 | 4/4 |
| h2_e2_search | 1/4 | 1/4 | 0/4 | 4/4 | 4/4 |
| h2_e3_cart_delete | 0/4 | 2/4 | 0/4 | 4/4 | 4/4 |
| h2_e4_cart_add | 0/4 | 0/4 | 0/4 | 1/4 | 3/4 |
| h2_e5_shipping | 0/4 | 0/4 | 0/4 | 4/4 | 2/4 |
| h2_e7_register | 0/4 | 2/4 | 0/4 | 4/4 | 4/4 |

Runs that used the network: 56 of 120 {'contract': 18, 'notes': 19, 'none': 19}

**Without the 56 network runs**

| Arm | Passed | Tokens per run | Against `none` |
| --- | --- | --- | --- |
| `none` | 1 of 5 | 259k | 1.00 |
| `contract` | 0 of 6 | 368k | 1.42 |
| `notes` | 0 of 5 | 351k | 1.35 |
| `okf` | 21 of 24 | 170k | 0.65 |
| `source` | 21 of 24 | 207k | 0.80 |

Pairs (two-sided Fisher exact):

- `contract` 0/6 against `okf` 21/24: p = 0.000 (reliable)
- `notes` 0/5 against `okf` 21/24: p = 0.000 (reliable)
- `okf` 21/24 against `source` 21/24: p = 1.000
- `contract` 0/6 against `notes` 0/5: p = 1.000
- `none` 1/5 against `contract` 0/6: p = 0.455
- `none` 1/5 against `okf` 21/24: p = 0.007 (reliable)

Full report: [results/H2-contract-vs-okf-questions.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/H2-contract-vs-okf-questions.md) (pinned to commit `5a09027`).

## Limits

Guide: that measured answers, not better changes. One model. Contamination under network access is a separate methodological limit.

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment). See repository README.

Longer write-up: [Test H in the OKFExperiment details](/notes/okf-details/#test-h-does-a-guide-add-anything-beyond-an-api-contract-yes-for-call-structure-no-for-field-names).
