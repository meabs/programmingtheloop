---
title: "Confirm-in-source sentence (experiment B3)"
description: "Where the agent could read the code, one sentence cut stale answers from 8 of 12 to 0 of 12."
date: 2026-10-17
summary: "Where the agent could read the code, “read the source to confirm…” cut stale answers from 8 of 12 to 0 of 12 at the same cost."
type: "Controlled trial"
plainTitle: "Does one sentence telling the agent to confirm in source stop it trusting a stale guide?"
github:
  - label: "OKFExperiment"
    href: "https://github.com/meabs/OKFExperiment"
guideLinks:
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
draft: false
experimentId: "B3"
question: "Where the agent can read the code, does telling it to confirm in source reduce stale answers from a bundle?"
status: published
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
findings:
  - id: "B3-1"
    statement: "On Click after three planted refactors, an agent under an efficiency prompt followed the out-of-date guide in 8 of 12 drift answers. Adding one sentence to the pointer, to read the source to confirm before relying on it, cut that to 0 of 12 at the same cost (77k against 79k tokens)."
    metric: "followed-stale answers of 12"
    value: "8/12 → 0/12"
    n: "12 drift answers per arm"
    detail:
      - "The drifts: a renamed function (_resolve_context became _resolve_completion_context), a new intermediate base class (PositionalParameter), and a call moved behind a helper (_ordered_params). 12 drift answers per arm: 3 questions, 4 runs each."
      - "Followed the stale guide: 8 of 12 without the sentence, 0 of 12 with it (Fisher exact, two-sided, p about 0.001). With no guide at all the same prompt gave 0 of 12."
      - "Nothing else changed between the two arms: same guide, same efficiency prompt."
      - "Tags, banners and provenance fields did not help (pooled 26 of 36 followed stale, against 8 of 12 with no flags, p = 0.77). stale_after helped a little in a post-hoc pooled comparison (p = 0.025): suggestive, not settled."
    limits:
      - "planted drift on Click (same series as B)"
      - "one model"
      - "4 runs per question"
    source: "https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/RESULTS.md"
    status: current
    featured: false
---

## Question

Where the agent can read the code, does telling it to confirm in source reduce stale answers from a bundle?

## Prediction

None written down for B3 in the Guide.

## Set-up

Same bundle as the "no flags" arm in the B series, same efficiency prompt, with one sentence added to the pointer: "read the source to confirm before you rely on it". Codex. Nested in the Chapter 3 stale-knowledge case study; RESULTS.md section B3.

## Results

Finding B3-1 is above.

### B. Confidence flags (Click after three planted refactors; the bundle is from before them)

Drifts: a renamed function (`_resolve_context` to `_resolve_completion_context`), a new intermediate base class (`PositionalParameter`) and a call moved behind a helper (`_ordered_params`). Two further questions were unchanged (controls). 12 drift answers per arm (3 questions x 4 runs). "Followed stale" = the answer gives the old fact and not the new one.

**v1 (the pointer told the agent to confirm in source): 1 of 84 drift answers followed a stale claim across all seven bundle arms.** The flags could not be compared, because every arm already had a verification instruction.

**v2 (that sentence removed, and an efficiency prompt: "use the repository knowledge ... avoid unnecessary file reads"):**

| arm | followed stale (of 12) | correct on the 2 control questions | relative cost |
| --- | --- | --- | --- |
| no bundle | 0 | 7/8 | 1.00 |
| bundle, no flags | **8** | 7/8 | 1.42 |
| + OKF-native fields (`generated`, `sources`, `status`) and a trust-tier sentence | 9 | 8/8 | 1.25 |
| + per-line `[high]/[medium]` tags | 8 | 7/8 | 1.31 |
| + banner telling the reader to check the source | 10 | 6/8 | 1.28 |
| + tags, banner and `verified` stamps | 8 | 8/8 | 1.32 |
| + `stale_after` only on concepts whose source changed | 5 | 8/8 | 1.29 |
| + `stale_after` on every concept | 6 | 8/8 | 1.34 |

- An unflagged bundle is harmful under efficiency pressure: 8/12 against 0/12 with no bundle (Fisher exact, two-sided p about 0.001).
- Tags, banners and OKF-native provenance did not help (pooled 26/36 against 8/12, p = 0.77). The banner arm was the worst.
- `stale_after` helped a little: 11/24 against 43/60 for the arms without it (one-sided, post-hoc pooled, p = 0.025). Targeted against no flags was 5/12 against 8/12 (p = 0.21). Suggestive, not settled.
- The renamed function was followed most often: agents answered from the bundle without searching for the new name.

**B3, the clean test of the sentence** (same bundle as "no flags", same efficiency prompt, one sentence added to the pointer: "read the source to confirm before you rely on it"): **0 of 12 followed stale, against 8 of 12 without it** (p about 0.001), at the same cost (77k against 79k tokens). Nothing else changed.

Source: [docs/RESULTS.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/RESULTS.md) (pinned to commit `5a09027`).

### Trial report (raw output)

Baseline arm: **noflag_confirm**. Relative cost is each run's tokens divided by the baseline's mean for the same question; 1.00 means equal, lower is cheaper.

#### codex

| arm | runs | correct | tokens per run (95% CI) | relative cost (95% CI) | verdict | turns | used tool | seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| noflag_confirm | 20 | 19/20 | 77k (70k to 84k) | 1.00 | baseline | 3.1 | 20/20 | 17 |

#### Tokens by question (mean, thousands)

| question | codex/noflag_confirm |
| --- | --- |
| callers | 65k |
| complete | 91k |
| getdefault | 68k |
| inherit | 74k |
| where | 86k |

Token totals are not comparable between agents (see adapters.py). Treat a verdict as evidence only when the interval excludes 1.00, and as provisional below 8 runs per arm.

Full report: [results/B3-confirm-sentence-only.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/B3-confirm-sentence-only.md) (pinned to commit `5a09027`).

## Limits

Planted drift; one model; 4 runs per question. The Guide's D2 case study notes this result applies where the agent *could* read the code — unlike D2, where there was no source to confirm against.

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment); see repository README. Guide chapter does not list commands.

Longer write-up: [Test B in the OKFExperiment details](/notes/okf-details/#test-b-same-repo-guide-out-of-date-a-guide-made-agents-repeat-old-facts-and-one-sentence-fixed-it).
