---
title: "Cross-repo questions, unread backend (experiment D1)"
description: "With the backend unread, agents answered 1 of 24 storefront-to-backend questions correctly."
date: 2026-10-17
summary: "With nothing, agents answered 1 of 24 cross-repo questions correctly at about 785k tokens per question; a guide or source reached 24 of 24."
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
experimentId: "D1"
question: "When a storefront change depends on a backend the agent cannot read, can it answer questions that need backend facts?"
status: published
evidenceGrade: published
publishedOn: 2026-10-12
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
runs: 96
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
topics:
  - context
  - measurement
findings:
  - id: "D1-1"
    statement: "With the backend unread, agents answered 1 of 24 storefront-to-backend questions correctly, at about 785k tokens per question on average"
    metric: "correct answers of 24 (no-backend arm)"
    value: "1 / 24"
    n: "3 runs per question × 8 questions"
    limits:
      - "identifiers renamed so answers cannot come from memory of the public repo"
      - "one model"
      - "3 of 24 no-backend runs searched outside the workspace (contamination note in RESULTS.md)"
    source: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
    status: current
    featured: false
---

## Question

When a storefront change depends on a backend the agent cannot read, can it answer questions that need backend facts?

## Prediction

None written down for D1 in the Guide.

## Set-up

Shopizer React storefront; Shopizer Java backend not available; question-relevant identifiers renamed. Arms: no backend; backend source; backend bundle with/without confirm sentence. Codex. RESULTS.md section D1; results/D1-cross-repo-fresh-shopizer.md.

## Results

Codex, 24 runs per arm (3 runs × 8 questions). The baseline arm is **none**: no backend available. Relative cost is each run's tokens divided by the baseline's mean for the same question; 1.00 means equal, lower is cheaper.

| Arm | Runs | Correct | Tokens per run (95% CI) | Relative cost (95% CI) | Verdict | Turns | Used tool | Seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| none | 24 | 1/24 | 785k (513k to 1118k) | 1.00 | baseline | 4.2 | - | 60 |
| source | 24 | 24/24 | 181k (155k to 212k) | 0.43 (0.25 to 0.65) | cheaper | 4.4 | 24/24 | 24 |
| bundle_sent | 24 | 24/24 | 189k (161k to 219k) | 0.41 (0.26 to 0.61) | cheaper | 4.9 | 24/24 | 22 |
| bundle_nosent | 24 | 24/24 | 169k (138k to 208k) | 0.34 (0.24 to 0.45) | cheaper | 4.5 | 24/24 | 21 |

Run-to-run spread (coefficient of variation of relative cost) is 1.08. To detect a 20% difference with 80% power you would need about 461 runs per arm; this trial has 24. Treat a verdict as evidence only when the interval excludes 1.00.

### Tokens by question

Mean tokens per run, in thousands.

| Question | none | source | bundle_sent | bundle_nosent |
| --- | --- | --- | --- | --- |
| x1_cart_add | 1613k | 178k | 187k | 157k |
| x2_cart_update | 683k | 169k | 189k | 140k |
| x3_cart_delete | 576k | 148k | 142k | 90k |
| x4_login | 393k | 182k | 119k | 172k |
| x5_search | 575k | 104k | 172k | 160k |
| x6_config | 1631k | 214k | 242k | 202k |
| x7_reviews | 103k | 167k | 152k | 93k |
| x8_shipping | 704k | 284k | 310k | 339k |

On `x7_reviews` the no-backend arm was cheaper than the source arm; the other seven questions go the other way. Token totals are not comparable between agents.

Finding D1-1 is in the table above. (Foreword finding OKF-2 is about *change* tasks F/G, not these questions.)

Full report: [results/D1-cross-repo-fresh-shopizer.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/D1-cross-repo-fresh-shopizer.md) (pinned to commit `5a09027`).

## Limits

Renamed identifiers; one model; contamination: 3 of 24 no-backend runs searched the disk (RESULTS.md / Chapter 9). Token intervals on the no-backend arm are wide.

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment). See repository README; Guide does not list commands.
