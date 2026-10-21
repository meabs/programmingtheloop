---
title: "Cross-repo questions, unread backend (experiment D1)"
description: "With the backend unread, agents answered 1 of 24 storefront-to-backend questions correctly."
date: 2026-10-17
summary: "With nothing, agents answered 1 of 24 cross-repo questions correctly at about 785k tokens per question; a guide or source reached 24 of 24."
type: "Controlled trial"
plainTitle: "Can an agent answer storefront-to-backend questions when it cannot read the backend?"
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
report: "https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/RESULTS.md"
topics:
  - context
  - measurement
findings:
  - id: "D1-1"
    statement: "With the backend unread, agents answered 1 of 24 storefront-to-backend questions correctly, at about 785k tokens per question on average"
    metric: "correct answers of 24 (no-backend arm)"
    value: "1 / 24"
    n: "3 runs per question × 8 questions"
    detail:
      - "Eight questions, each tracing one storefront call to the backend: the controller method, the request class, and a field or path variable. The backend is 1,173 Java files with 325 routes. Question-relevant identifiers were renamed so answers cannot come from memory of the public repository."
      - "24 runs per arm. Correct and tokens per run: no backend 1 of 24 at 785k; backend source 24 of 24 at 181k; guide with the confirm sentence 24 of 24 at 189k; guide without it 24 of 24 at 169k."
      - "Cost against no backend: source 0.43 (95% CI 0.25 to 0.65), guide with sentence 0.41 (0.26 to 0.61), guide without 0.34 (0.24 to 0.45). The no-backend cost is the cost of failing."
      - "The no-backend runs varied from 55k to 3.0M tokens (median 722k), so the intervals on the ratios are wide; the accuracy gap is not in doubt."
      - "Contamination: 3 of 24 no-backend runs searched the disk. One found another run's guide in its work folder and answered correctly (the 1 of 24), so that arm is if anything flattered. Two found copies of the backend source and still answered wrongly."
    limits:
      - "identifiers renamed so answers cannot come from memory of the public repo"
      - "one model"
      - "3 of 24 no-backend runs searched outside the workspace (contamination note in RESULTS.md)"
    source: "https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/RESULTS.md"
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

### D. A complex repository as a dependency the agent cannot read

The working repository is the real [Shopizer React storefront](https://github.com/shopizer-ecommerce/shopizer-shop-reactjs). It calls a backend, [Shopizer](https://github.com/shopizer-ecommerce/shopizer) (1,173 Java files, 325 routes), that is **not available** to the agent. Eight questions each trace one storefront call to the backend: the controller method, the request class, and a field or path variable. Examples: the cart POST in `cartActions.js`, the login request in `LoginRegister.js`, the search request, the config request.

**The backend's question-relevant identifiers were renamed** (`scripts/privatize.py`), so the answers cannot come from memory of a famous public repository. A first attempt without this let the agent answer from memory (it found `AuthenticateCustomerApi` unaided); that was caught in a smoke test before any trial run.


#### D1. Backend current (96 runs: 8 questions x 4 arms x 3 runs)

| Arm | Correct | Tokens per run (95% CI) | Cost vs no backend |
| --- | --- | --- | --- |
| No backend | **1 / 24** | 785k (513k to 1118k) | 1.00 |
| Backend source checked out (read-only) | 24 / 24 | 181k (155k to 212k) | 0.43 (0.25 to 0.65) |
| Backend bundle, with the confirm sentence | 24 / 24 | 189k (161k to 219k) | 0.41 (0.26 to 0.61) |
| Backend bundle, without it | 24 / 24 | 169k (138k to 208k) | 0.34 (0.24 to 0.45) |

- A bundle gave the same accuracy as the full source at the same cost, and a fraction of what searching blind cost. The "no backend" cost is the cost of failing.
- The intervals on the ratios are wide (the no-backend runs vary from 55k to 3.0M tokens, median 722k); the accuracy gap is not in doubt.
- **Contamination.** Codex can read the whole disk. 3 of 24 no-backend runs searched it. One found another run's bundle in its work folder and answered correctly (the 1 of 24), so the no-backend arm is, if anything, flattered. Two found copies of the backend source and still answered wrongly. No bundle-arm run reached outside its own workspace (`scripts/leak_check.py`); the source arm was given the path.

Source: [docs/RESULTS.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/RESULTS.md) (pinned to commit `5a09027`).

### Trial report (raw output)

Codex, 24 runs per arm (3 runs × 8 questions). The baseline arm is **none**: no backend available. Relative cost is each run's tokens divided by the baseline's mean for the same question; 1.00 means equal, lower is cheaper.

| Arm | Runs | Correct | Tokens per run (95% CI) | Relative cost (95% CI) | Verdict | Turns | Used tool | Seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| none | 24 | 1/24 | 785k (513k to 1118k) | 1.00 | baseline | 4.2 | - | 60 |
| source | 24 | 24/24 | 181k (155k to 212k) | 0.43 (0.25 to 0.65) | cheaper | 4.4 | 24/24 | 24 |
| bundle_sent | 24 | 24/24 | 189k (161k to 219k) | 0.41 (0.26 to 0.61) | cheaper | 4.9 | 24/24 | 22 |
| bundle_nosent | 24 | 24/24 | 169k (138k to 208k) | 0.34 (0.24 to 0.45) | cheaper | 4.5 | 24/24 | 21 |

Run-to-run spread (coefficient of variation of relative cost) is 1.08. To detect a 20% difference with 80% power you would need about 461 runs per arm; this trial has 24. Treat a verdict as evidence only when the interval excludes 1.00.

#### Tokens by question

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

Finding D1-1 is at the top of the page. (Foreword finding OKF-2 is about *change* tasks F/G, not these questions.)

Full report: [results/D1-cross-repo-fresh-shopizer.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/D1-cross-repo-fresh-shopizer.md) (pinned to commit `5a09027`).

## Limits

Renamed identifiers; one model; contamination: 3 of 24 no-backend runs searched the disk (RESULTS.md / Chapter 9). Token intervals on the no-backend arm are wide.

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment). See repository README; Guide does not list commands.

Longer write-up: [Test D in the OKFExperiment details](/notes/okf-details/#test-d-cross-repo-questions-dependency-unreadable-a-guide-makes-the-difference-and-an-out-of-date-one-is-the-worst-case).
