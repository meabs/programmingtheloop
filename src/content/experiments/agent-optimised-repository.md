---
title: "Agent-optimised repository"
description: "Experiment J: a fully set-up repository cost more tokens with no reliable gain in correctness."
date: 2026-10-17
summary: "On a readable Java backend, the recommended agent set-up used 35–48% more tokens with no reliable correctness gain."
type: "Controlled trial"
github:
  - label: "OKFExperiment"
    href: "https://github.com/meabs/OKFExperiment"
guideLinks:
  - label: "Foreword findings"
    href: "/guides/programming-the-loop/foreword/"
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
draft: false
featured: true
experimentId: "J"
question: "Does a repository set up for agents do better than the same repository left as it is?"
status: published
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "medium reasoning, isolation on"
runs: 112
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/J-optimised-repo.md"
prediction: "https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/EXPERIMENT_J.md"
topics:
  - context
  - measurement
publishedOn: 2026-10-17
findings:
  - id: "J-1"
    statement: "On a 1,173-file Java backend, the copy set up for agents (generated guide, code graph, three skills, configured AGENTS.md) used 35–48% more tokens per run than the plain copy, and its pass rate was not reliably different."
    metric: "relative token cost vs plain arm"
    value: "+35–48%"
    interval:
      low: "1.38"
      high: "1.60"
      method: "bootstrap 95% CI on relative cost (task-equalized mean 1.48×)"
    n: 112
    detail:
      - "Tokens per run: plain 297k, optimised 401k. Relative cost 1.48 (95% CI 1.38 to 1.60), 56 runs per arm."
      - "Four change tasks: plain passed 28 of 32, optimised 29 of 32 (p = 1.000). Tokens 407k against 526k."
      - "Three structure questions: plain passed 16 of 24, optimised 19 of 24 (p = 0.517). Tokens 150k against 234k."
      - "Hardest task, renaming an entity and deleting it (j7): plain 4 of 8, optimised 6 of 8, at 1,046k against 1,278k tokens. The first grader missed four AspectJ pointcut strings that every run had updated, so j7 is re-scored."
      - "The set-up was used: the graph tool ran and the okf/ guide was opened in all 56 optimised runs."
    limits:
      - "one repository"
      - "one model"
      - "mechanical edits and structure questions"
      - "8 runs per task per arm"
      - "four ingredients tested together"
    source: "https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/J-optimised-repo.md"
    status: current
    featured: true
---

## What I asked

Does a repository *set up for agents* do better than the same repository left as it is? On a 1,173-file Java backend the agent could read, I compared a plain copy with one that had a generated guide, a code graph, three operating skills and a configured `AGENTS.md`.

## What I measured

**112 runs** (experiment J): four mechanical changes and three structure questions, 8 runs per task per arm, Codex with isolation on. The set-up was used: the agent ran the graph tool and opened the guide in all 56 optimised runs, and read the navigation skill in 55.

Changes passed 28 of 32 (plain) against 29 of 32 (optimised). Structure questions 16 of 24 against 19 of 24. Neither difference is reliable. Tokens: **35–48% more** on the optimised arm (depending how you ratio them), with a bootstrap interval that stays above 1.

*Limits (as in the book):* one repository, one model, mechanical edits and structure questions, 8 runs per task per arm, four ingredients tested together.

## Full results

The trial report and the analysis, copied from the source. 56 runs per arm: plain against optimised.

> **Read this first.** The trialrig table below counts j7 with the first grader (0 of 8 in each arm). That grader missed four AspectJ pointcut strings that every run had correctly updated, so the reported j7 figures are the re-scored ones in the analysis at the end (plain 4 of 8, optimised 6 of 8; changes 28 and 29 of 32). See Deviations in docs/EXPERIMENT_J.md.

Baseline arm: **plain**. Relative cost is each run's tokens divided by the baseline's mean for the same question; 1.00 means equal, lower is cheaper.

### codex

| arm | runs | correct | tokens per run (95% CI) | relative cost (95% CI) | verdict | turns | used tool | seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| plain | 56 | 16/24 (verified 24/32) | 297k (219k to 388k) | 1.00 | baseline | 5.9 | - | 45 |
| optimised | 56 | 19/24 (verified 23/32) | 401k (304k to 511k) | 1.48 (1.38 to 1.60) | dearer | 8.8 | 56/56 | 68 |

Run-to-run spread (coefficient of variation of relative cost) is 0.29. To detect a 20% difference with 80% power you would need about **33 runs per arm** (larger differences need fewer); this trial has 56.

### Tokens by question (mean, thousands)

| question | codex/optimised | codex/plain |
| --- | --- | --- |
| j1_rename_payment_method | 188k | 117k |
| j2_add_param_to_overload | 359k | 235k |
| j3_remove_unused_param | 277k | 231k |
| j4_overload_callers | 186k | 98k |
| j5_shipping_chain | 220k | 150k |
| j6_checkout_path | 297k | 203k |
| j7_rename_entity_delete | 1278k | 1046k |

Token totals are not comparable between agents (see adapters.py). Treat a verdict as evidence only when the interval excludes 1.00, and as provisional below 8 runs per arm.


### Analysis (`python scripts/analyse_j.py`, with j7 re-scored by `scripts/regrade_j.py`)

#### Changes

plain 28/32 (407k tokens); optimised 29/32 (526k, 1.29 times); p = 1.000

| Task | plain | optimised | tokens plain | tokens optimised |
| --- | --- | --- | --- | --- |
| j1_rename_payment_method | 8/8 | 8/8 | 117k | 188k |
| j2_add_param_to_overload | 8/8 | 7/8 | 235k | 359k |
| j3_remove_unused_param | 8/8 | 8/8 | 231k | 277k |
| j7_rename_entity_delete | 4/8 | 6/8 | 1046k | 1278k |

#### Questions

plain 16/24 (150k tokens); optimised 19/24 (234k, 1.56 times); p = 0.517

| Task | plain | optimised | tokens plain | tokens optimised |
| --- | --- | --- | --- | --- |
| j4_overload_callers | 1/8 | 3/8 | 98k | 186k |
| j5_shipping_chain | 7/8 | 8/8 | 150k | 220k |
| j6_checkout_path | 8/8 | 8/8 | 203k | 297k |

Adoption in the optimised arm (56 runs): ran kg 56; opened okf/ 56; read navigate 55, change 32, check 34; read no skill 0

plain: network runs 0; runs with a refused access 4

optimised: network runs 0; runs with a refused access 6

optimised runs that used kg: passed 48 of 56; did not: 0 of 0

Full report: [results/J-optimised-repo.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/J-optimised-repo.md) (pinned to commit `5a09027`). Design and deviations: [docs/EXPERIMENT_J.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/EXPERIMENT_J.md).

## Where to read more

- Full write-up and charts: [Chapter 3](/guides/programming-the-loop/right-facts/)
- Headline finding: [Foreword](/guides/programming-the-loop/foreword/)
- Source tables: [OKFExperiment, results/J-optimised-repo.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/J-optimised-repo.md)
- Longer write-up: [Test J in the OKFExperiment details](/notes/okf-details/#test-j-a-repository-set-up-for-agents-against-one-left-as-it-is-no-reliable-gain-and-about-48-more-tokens)
