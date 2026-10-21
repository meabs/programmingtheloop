---
title: "Click guide trials (experiment A)"
description: "On Click, a generated guide did not improve correctness and cost more tokens."
date: 2026-10-17
summary: "On Click, agents were already near ceiling with or without a guide; the default guide cost 1.30× then 1.07× tokens, and the thinnest guide was dearest (1.26 to 1.42×)."
type: "Controlled trial"
github:
  - label: "OKFExperiment"
    href: "https://github.com/meabs/OKFExperiment"
guideLinks:
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
draft: false
experimentId: "A"
question: "On a smaller library the agent can read, does a generated guide improve answers or change cost?"
status: published
evidenceGrade: published
publishedOn: 2026-10-12
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "medium reasoning"
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
topics:
  - context
  - measurement
findings:
  - id: "A-1"
    statement: "On Click, the default guide cost more tokens than no guide in one run and was near level in a rerun (accuracy already at ceiling with or without a guide)"
    metric: "relative token cost vs no-guide arm (default guide)"
    value: "1.30× (run 1); 1.07× (rerun)"
    n: "24 runs per arm (v1); 24 per arm (v2)"
    limits:
      - "one repository (Click)"
      - "one model"
      - "accuracy already at ceiling in every arm"
      - "v1 and v2 not run simultaneously"
    source: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
    status: current
    featured: false
  - id: "A-2"
    statement: "On Click, the thinnest (names-only) guide was reliably the dearest"
    metric: "relative token cost vs no-guide arm (minimal / names-only guide)"
    value: "1.26–1.42×"
    n: "24 runs per arm (v1); 24 per arm (v2)"
    limits:
      - "one repository (Click)"
      - "one model"
      - "accuracy already at ceiling in every arm"
      - "v1 and v2 not run simultaneously"
    source: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
    status: current
    featured: false
---

## Question

On a smaller library the agent can read, does a generated guide improve answers or change cost?

## Prediction

None written down for this trial in the Guide.

## Set-up

Click, with and without a generated guide, including a default guide and a thinnest (names-only) guide. Codex. Reported in OKFExperiment docs/RESULTS.md section A (v1 with a "confirm in source" pointer sentence; v2 without it).

## Results

Findings A-1 and A-2 are below.

### Run 1: pointer told the agent to confirm in the source (v1)

Baseline arm: **none**. Relative cost is each run's tokens divided by the baseline's mean for the same question; 1.00 means equal, lower is cheaper.

#### codex

| arm | runs | correct | tokens per run (95% CI) | relative cost (95% CI) | verdict | turns | used tool | seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| none | 24 | 15/15 (verified 9/9) | 139k (100k to 183k) | 1.00 | baseline | 4.7 | - | 25 |
| minimal | 24 | 15/15 (verified 9/9) | 173k (131k to 221k) | 1.42 (1.25 to 1.59) | dearer | 5.9 | 24/24 | 34 |
| nocalls | 24 | 14/15 (verified 9/9) | 155k (114k to 197k) | 1.21 (1.08 to 1.37) | dearer | 4.7 | 24/24 | 28 |
| default | 24 | 15/15 (verified 9/9) | 167k (122k to 216k) | 1.30 (1.14 to 1.47) | dearer | 5.1 | 24/24 | 32 |
| allcalls | 24 | 15/15 (verified 9/9) | 176k (126k to 228k) | 1.30 (1.18 to 1.43) | dearer | 4.9 | 24/24 | 27 |
| package | 24 | 14/15 (verified 8/9) | 167k (121k to 217k) | 1.26 (1.13 to 1.40) | dearer | 4.9 | 24/24 | 26 |
| noindex | 24 | 15/15 (verified 9/9) | 168k (117k to 225k) | 1.22 (1.08 to 1.38) | dearer | 5.3 | 24/24 | 30 |
| graph | 24 | 15/15 (verified 9/9) | 159k (110k to 216k) | 1.15 (1.03 to 1.28) | dearer | 5.1 | 23/24 | 27 |

Run-to-run spread (coefficient of variation of relative cost) is 0.29. To detect a 20% difference with 80% power you would need about **35 runs per arm** (larger differences need fewer); this trial has 24.

#### Tokens by question (mean, thousands)

| question | codex/allcalls | codex/default | codex/graph | codex/minimal | codex/nocalls | codex/noindex | codex/none | codex/package |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| callers | 62k | 72k | 49k | 83k | 61k | 62k | 67k | 62k |
| complete | 96k | 84k | 111k | 114k | 101k | 90k | 85k | 123k |
| getdefault | 88k | 69k | 90k | 101k | 81k | 85k | 71k | 94k |
| inherit | 61k | 63k | 49k | 82k | 73k | 67k | 36k | 64k |
| t1 | 328k | 275k | 247k | 216k | 243k | 288k | 218k | 268k |
| t2 | 348k | 368k | 346k | 352k | 304k | 425k | 302k | 373k |
| t3 | 348k | 303k | 325k | 355k | 310k | 268k | 286k | 299k |
| where | 77k | 105k | 56k | 86k | 63k | 57k | 50k | 56k |

Token totals are not comparable between agents (see adapters.py). Treat a verdict as evidence only when the interval excludes 1.00, and as provisional below 8 runs per arm.

Full report: [results/A-v1-pointer-told-agent-to-confirm.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/A-v1-pointer-told-agent-to-confirm.md) (pinned to commit `5a09027`).

### Rerun: no confirm sentence (v2)

Baseline arm: **none**. Relative cost is each run's tokens divided by the baseline's mean for the same question; 1.00 means equal, lower is cheaper.

#### codex

| arm | runs | correct | tokens per run (95% CI) | relative cost (95% CI) | verdict | turns | used tool | seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| none | 24 | 14/15 (verified 9/9) | 143k (106k to 182k) | 1.00 | baseline | 4.8 | - | 28 |
| minimal | 24 | 15/15 (verified 9/9) | 181k (130k to 237k) | 1.26 (1.14 to 1.39) | dearer | 5.9 | 24/24 | 29 |
| nocalls | 24 | 15/15 (verified 9/9) | 164k (115k to 215k) | 1.10 (0.97 to 1.25) | no clear difference | 5.0 | 24/24 | 25 |
| default | 24 | 15/15 (verified 9/9) | 161k (114k to 208k) | 1.07 (0.99 to 1.16) | no clear difference | 4.8 | 24/24 | 29 |
| graph | 24 | 15/15 (verified 9/9) | 182k (120k to 252k) | 1.14 (0.99 to 1.32) | no clear difference | 5.6 | 24/24 | 31 |

Run-to-run spread (coefficient of variation of relative cost) is 0.30. To detect a 20% difference with 80% power you would need about **35 runs per arm** (larger differences need fewer); this trial has 24.

#### Tokens by question (mean, thousands)

| question | codex/default | codex/graph | codex/minimal | codex/nocalls | codex/none |
| --- | --- | --- | --- | --- | --- |
| callers | 66k | 56k | 69k | 55k | 82k |
| complete | 86k | 132k | 111k | 113k | 97k |
| getdefault | 80k | 94k | 96k | 68k | 78k |
| inherit | 56k | 49k | 71k | 63k | 47k |
| t1 | 286k | 239k | 253k | 324k | 220k |
| t2 | 315k | 418k | 354k | 312k | 293k |
| t3 | 332k | 418k | 405k | 310k | 268k |
| where | 64k | 49k | 91k | 67k | 61k |

Token totals are not comparable between agents (see adapters.py). Treat a verdict as evidence only when the interval excludes 1.00, and as provisional below 8 runs per arm.

Full report: [results/A2-no-confirm-sentence.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/A2-no-confirm-sentence.md) (pinned to commit `5a09027`).

## Limits

One repository, one model, and accuracy already at the ceiling in every arm, so the trial is about cost. The Guide notes v1 and v2 were not run simultaneously. RESULTS.md Limits section also covers small cells and one-model scope for the OKF series.

## Reproduce

Repository: [OKFExperiment](https://github.com/meabs/OKFExperiment). Commands are not given in the Guide chapter; see the repository README for how to reproduce OKF trials.
