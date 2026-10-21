---
title: "Stale knowledge across a boundary (experiment D2)"
description: "After planted backend renames, a stale guide gave the old answer in 14 of 16 drift answers."
date: 2026-10-17
summary: "Headline finding lives once as OKF-1 on the published okf-worked-example record. This page is the D2 trial write-up."
type: "Controlled trial"
github:
  - label: "OKFExperiment"
    href: "https://github.com/meabs/OKFExperiment"
guideLinks:
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
  - label: "Foreword"
    href: "/guides/programming-the-loop/foreword/"
  - label: "Published record (OKF-1)"
    href: "/experiments/okf-worked-example/"
draft: false
experimentId: "D2"
question: "When a guide is stale and the agent cannot read the dependency, does it repeat old facts?"
status: planned
evidenceGrade: published
publishedOn: 2026-10-12
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/RESULTS.md"
topics:
  - context
  - verification
findings: []
---

## Question

When a guide is stale and the agent cannot read the dependency, does it repeat old facts?

## Prediction

None written down for D2 in the Guide.

## Set-up

Backend renamed after the guide was generated; agent had the stale guide and no backend source. Codex. RESULTS.md section D2.

## Results

**Finding defined once:** [OKF-1](/experiments/okf-worked-example/) on the published okf-worked-example record. This page does not redefine that finding. Guide also reports the source-arm, confirm-sentence, `stale_after`, and control arms — see RESULTS.md section D2.

#### D2. Backend refactored after the bundle was generated (128 runs: 8 questions x 4 arms x 4 runs)

Four renames on the backend (a handler method, a request-class field, a path variable, a request class): four questions have a new answer, four are controls. The bundle is from before the refactor. Efficiency prompt ("use the repository knowledge ... avoid unnecessary file reads"), as in B2.

| Arm | Gave the **old** fact | Gave the new fact | Controls correct | Tokens per run |
| --- | --- | --- | --- | --- |
| Backend source (refactored) | 0 / 16 | 16 / 16 | 16 / 16 | 148k |
| Stale bundle | **14 / 16** | 0 / 16 | 16 / 16 | 157k |
| Stale bundle + the confirm sentence | **16 / 16** | 0 / 16 | 16 / 16 | 158k |
| Stale bundle + the sentence + `stale_after` on the 7 changed concepts | **16 / 16** | 0 / 16 | 16 / 16 | 156k |

- Every drift answer from a bundle arm was wrong, and none of the 46 stale answers carried a caveat.
- The confirm sentence could not help: there was no backend source to confirm against.
- `stale_after` did not help either. The seven marked concepts included the routes concept and the packages the questions touched, the pointer explained the field, and still not one of 32 answers in that arm mentioned staleness.
- Unchanged facts stayed correct (controls 16/16 in every arm), so the harm is exactly the drifted facts.
- No run in D2 reached outside its own workspace.

The set-up (the storefront, the renamed backend and the eight questions) is described under [D1](/experiments/d1-cross-repo-questions/).

Source: [docs/RESULTS.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/RESULTS.md) (pinned to commit `5a09027`).

### Trial report (raw output)

Baseline arm: **source_drift**. Relative cost is each run's tokens divided by the baseline's mean for the same question; 1.00 means equal, lower is cheaper.

#### codex

| arm | runs | correct | tokens per run (95% CI) | relative cost (95% CI) | verdict | turns | used tool | seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source_drift | 32 | 31/32 | 148k (128k to 171k) | 1.00 | baseline | 4.1 | 32/32 | 21 |
| bundle_nosent | 32 | 16/32 | 157k (132k to 187k) | 1.08 (0.91 to 1.26) | no clear difference | 4.4 | 32/32 | 20 |
| bundle_sent | 32 | 16/32 | 158k (132k to 187k) | 1.07 (0.92 to 1.24) | no clear difference | 4.5 | 32/32 | 21 |
| bundle_t_sent | 32 | 16/32 | 156k (127k to 191k) | 1.04 (0.89 to 1.23) | no clear difference | 4.3 | 32/32 | 21 |

Run-to-run spread (coefficient of variation of relative cost) is 0.46. To detect a 20% difference with 80% power you would need about **83 runs per arm** (larger differences need fewer); this trial has 32.

#### Tokens by question (mean, thousands)

| question | codex/bundle_nosent | codex/bundle_sent | codex/bundle_t_sent | codex/source_drift |
| --- | --- | --- | --- | --- |
| x1_cart_add | 182k | 154k | 116k | 108k |
| x2_cart_update | 106k | 115k | 114k | 119k |
| x3_cart_delete | 103k | 72k | 93k | 146k |
| x4_login | 113k | 157k | 162k | 122k |
| x5_search | 223k | 160k | 136k | 162k |
| x6_config | 254k | 227k | 299k | 181k |
| x7_reviews | 103k | 126k | 102k | 117k |
| x8_shipping | 173k | 252k | 227k | 232k |

Token totals are not comparable between agents (see adapters.py). Treat a verdict as evidence only when the interval excludes 1.00, and as provisional below 8 runs per arm.

Full report: [results/D2-cross-repo-stale-shopizer.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/D2-cross-repo-stale-shopizer.md) (pinned to commit `5a09027`).

## Limits

Planted drift; 4 runs per question; one model. From the Guide's own caveat: the drift was planted, so it tells you nothing about how often drift happens in real pipelines.

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment); RESULTS.md section D2 and results/D2-cross-repo-stale-shopizer.md.

Longer write-up: [Test D in the OKFExperiment details](/notes/okf-details/#test-d-cross-repo-questions-dependency-unreadable-a-guide-makes-the-difference-and-an-out-of-date-one-is-the-worst-case).
