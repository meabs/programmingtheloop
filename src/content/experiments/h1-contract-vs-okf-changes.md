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

Baseline arm: **none**. Relative cost is each run's tokens divided by the baseline's mean for the same question; 1.00 means equal, lower is cheaper.

### codex

| arm | runs | correct | tokens per run (95% CI) | relative cost (95% CI) | verdict | turns | used tool | seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| none | 16 | - (verified 4/16) | 277k (186k to 389k) | 1.00 | baseline | 6.9 | - | 42 |
| contract | 16 | - (verified 13/16) | 192k (172k to 214k) | 0.79 (0.65 to 0.92) | cheaper | 6.3 | 16/16 | 30 |
| notes | 16 | - (verified 14/16) | 128k (114k to 144k) | 0.52 (0.44 to 0.61) | cheaper | 4.6 | 16/16 | 24 |
| okf | 16 | - (verified 14/16) | 282k (249k to 319k) | 1.21 (0.93 to 1.54) | no clear difference | 5.9 | 16/16 | 34 |
| source | 16 | - (verified 14/16) | 334k (277k to 403k) | 1.35 (1.07 to 1.63) | dearer | 6.9 | 16/16 | 33 |

Run-to-run spread (coefficient of variation of relative cost) is 0.58. To detect a 20% difference with 80% power you would need about **131 runs per arm** (larger differences need fewer); this trial has 16.

### Tokens by question (mean, thousands)

| question | codex/contract | codex/none | codex/notes | codex/okf | codex/source |
| --- | --- | --- | --- | --- | --- |
| h1_g1_delete_item | 190k | 405k | 133k | 240k | 285k |
| h1_g2_add_voucher | 190k | 193k | 131k | 259k | 301k |
| h1_g3_checkout_request | 227k | 362k | 153k | 338k | 483k |
| h1_g4_orders_list | 160k | 149k | 98k | 292k | 266k |

Token totals are not comparable between agents (see adapters.py). Treat a verdict as evidence only when the interval excludes 1.00, and as provisional below 8 runs per arm.


### Pass counts and pairwise tests (scripts/analyse_h.py)

**All 80 runs**

| Arm | Passed | Tokens per run | Against `none` |
| --- | --- | --- | --- |
| `none` | 4 of 16 | 277k | 1.00 |
| `contract` | 13 of 16 | 192k | 0.69 |
| `notes` | 14 of 16 | 128k | 0.46 |
| `okf` | 14 of 16 | 282k | 1.02 |
| `source` | 14 of 16 | 334k | 1.21 |

Pairs (two-sided Fisher exact):

- `contract` 13/16 against `okf` 14/16: p = 1.000
- `notes` 14/16 against `okf` 14/16: p = 1.000
- `okf` 14/16 against `source` 14/16: p = 1.000
- `contract` 13/16 against `notes` 14/16: p = 1.000
- `none` 4/16 against `contract` 13/16: p = 0.004 (reliable)
- `none` 4/16 against `okf` 14/16: p = 0.001 (reliable)

Per task (passed of runs):

| Task | `none` | `contract` | `notes` | `okf` | `source` |
| --- | --- | --- | --- | --- | --- |
| h1_g1_delete_item | 4/4 | 4/4 | 2/4 | 4/4 | 4/4 |
| h1_g2_add_voucher | 0/4 | 4/4 | 4/4 | 4/4 | 3/4 |
| h1_g3_checkout_request | 0/4 | 1/4 | 4/4 | 2/4 | 4/4 |
| h1_g4_orders_list | 0/4 | 4/4 | 4/4 | 4/4 | 3/4 |

Runs that used the network: 2 of 80 {'none': 2}

**Without the 2 network runs**

| Arm | Passed | Tokens per run | Against `none` |
| --- | --- | --- | --- |
| `none` | 3 of 14 | 203k | 1.00 |
| `contract` | 13 of 16 | 192k | 0.94 |
| `notes` | 14 of 16 | 128k | 0.63 |
| `okf` | 14 of 16 | 282k | 1.39 |
| `source` | 14 of 16 | 334k | 1.64 |

Pairs (two-sided Fisher exact):

- `contract` 13/16 against `okf` 14/16: p = 1.000
- `notes` 14/16 against `okf` 14/16: p = 1.000
- `okf` 14/16 against `source` 14/16: p = 1.000
- `contract` 13/16 against `notes` 14/16: p = 1.000
- `none` 3/14 against `contract` 13/16: p = 0.003 (reliable)
- `none` 3/14 against `okf` 14/16: p = 0.001 (reliable)

Full report: [results/H1-contract-vs-okf-changes.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/H1-contract-vs-okf-changes.md) (pinned to commit `5a09027`).

## Limits

From the Guide: I wrote the note knowing the tasks, which favours it; the contract was generated from the source by a script; with 16 runs per arm, gaps under about 30 points can't be separated, so "level" doesn't mean "equivalent". Results file: ~131 runs per arm would be needed to detect a 20% cost difference.

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment). See repository README; Guide does not list commands.
