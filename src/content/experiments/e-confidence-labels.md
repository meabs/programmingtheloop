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
    statement: "When some entries in a backend guide were deliberately wrong and the source could not be checked, labelling facts [high] or [medium] and telling the agent to say when it relied on a guess raised disclosure from 0 of 16 answers to 6 of 16. Wrong answers fell only from 11 to 8 of 16, which is not reliable."
    metric: "disclosure of [medium] guess (of 16)"
    value: "0/16 → 6/16"
    n: "4 runs per question"
    detail:
      - "Set-up: storefront as the working repository, backend guide copied in, backend source unavailable. 7 questions: 4 where a [medium] call entry was made wrong on purpose (a plausible name from elsewhere in the guide), 3 unchanged controls. 4 runs per question per condition, 112 runs."
      - "Followed the wrong entry (of 16): no labels 11; labels, no instruction 10; labels with the instruction 8; wrong entries marked [high] 10."
      - "Said it relied on a [medium] guess (of 16): 0, 0, 6 and 0. Disclosure 6 against 0 is reliable (Fisher exact p about 0.02); the drop in wrong answers is not (p about 0.47)."
      - "Marking the wrong entries [high] removed all disclosure: agents trusted the label."
      - "On the three control questions (12 answers per condition) the agent hedged on 0, 0, 2 and 3, so labels cost a little over-caution."
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

Finding E-1 is above.

Baseline arm: **plain**. Relative cost is each run's tokens divided by the baseline's mean for the same question; 1.00 means equal, lower is cheaper.

### codex

| arm | runs | correct | tokens per run (95% CI) | relative cost (95% CI) | verdict | turns | used tool | seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| plain | 28 | 14/28 | 203k (171k to 239k) | 1.00 | baseline | 5.1 | 28/28 | 24 |
| labels | 28 | 12/28 | 227k (179k to 286k) | 1.09 (0.96 to 1.22) | no clear difference | 5.4 | 28/28 | 24 |
| labels_rule | 28 | 11/28 | 192k (166k to 223k) | 0.98 (0.89 to 1.07) | no clear difference | 5.0 | 28/28 | 28 |
| mislabelled_rule | 28 | 14/28 | 197k (165k to 235k) | 0.97 (0.88 to 1.07) | no clear difference | 4.8 | 28/28 | 25 |

Run-to-run spread (coefficient of variation of relative cost) is 0.29. To detect a 20% difference with 80% power you would need about **34 runs per arm** (larger differences need fewer); this trial has 28.

### Tokens by question (mean, thousands)

| question | codex/labels | codex/labels_rule | codex/mislabelled_rule | codex/plain |
| --- | --- | --- | --- | --- |
| e1_login | 189k | 165k | 225k | 223k |
| e2_search | 162k | 155k | 133k | 141k |
| e3_cart_delete | 153k | 159k | 162k | 147k |
| e4_cart_add | 179k | 177k | 129k | 151k |
| e5_shipping | 524k | 344k | 376k | 392k |
| e6_cart_update | 257k | 201k | 214k | 201k |
| e7_register | 127k | 147k | 144k | 166k |

Token totals are not comparable between agents (see adapters.py). Treat a verdict as evidence only when the interval excludes 1.00, and as provisional below 8 runs per arm.

Full report: [results/E-confidence-labels-crossrepo-questions.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/E-confidence-labels-crossrepo-questions.md) (pinned to commit `5a09027`).

## Limits

One model; unread backend; planted wrong entries. Guide: labels did not prevent stale answers in D2; disclosure is a keyword match checked by sampling.

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment). See repository README.
