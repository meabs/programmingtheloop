---
title: "Is a code guide worth more to a small local model? (experiment OKL)"
description: "OKF test G's four cross-repo changes, rerun with Codex on a small open-weight model on my own machine. With the backend's generated guide, it got all 20 changes right, against 4 of 20 with no guide. With the backend's source code it got 19 of 20, slightly more cheaply. As for the hosted model, the guide stands in for the code but doesn't beat it."
date: 2026-10-28
summary: "With the backend's guide, a small local model (qwen3.8:27b) passed 20 of 20 cross-repo changes, against 4 of 20 with no guide. With the backend's source it passed 19 of 20, and runs were slightly faster and cheaper. The guide is a stand-in for the code, for a small model as for a large one."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/6a6517cc1d9f5c73e552f5a614f6872474169229/2026-10-okf-local"
draft: false
experimentId: "OKL"
question: "When a small local model must change a storefront to match a backend it can't see, does a generated guide to the backend help it, and does the guide help more than the backend's source code?"
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI 0.157"
    model: "qwen3.8:27b (local, Ollama, 4-bit, 65,536-token context)"
    settings: "medium reasoning effort; web search off; each run in a sandbox that shows only its own copy of the storefront"
runs: 60
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/6a6517cc1d9f5c73e552f5a614f6872474169229/2026-10-okf-local/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/0d18df2be35f875e35731843295965791e5896c3/2026-10-okf-local/README.md"
previewImage: "/guide-images/chart-okl-guide.png"
previewAlt: "Changes passing the hidden test, of 20, higher is better. No guide: 4 local, 3 hosted. The backend's guide: 20 local, 18 hosted. The backend's source: 19 local, 18 hosted. Median minutes per local run, lower is better: 7.4, 4.3 and 4.0; hosted runs took about 0.7 minutes."
topics:
  - context
  - measurement
publishedOn: 2026-10-28
findings:
  - id: "OKL-1"
    statement: "With the backend's generated guide, a small local model got 20 of 20 cross-repo changes right, against 4 of 20 with no guide"
    metric: "changes passing their hidden test (higher is better), guide minus no guide, mean over four tasks"
    value: "+80 pts"
    interval:
      low: "+75 pts"
      high: "+90 pts"
      method: "bootstrap 95% CI within tasks; one-sided permutation test, Holm p < 0.001"
    n: 40
    detail:
      - "the hosted model in OKF test G: 18 of 20 with the guide, 3 of 20 with no guide"
      - "all 20 guide runs opened the guide"
      - "the 4 passes with no guide were all on task 1, whose endpoint and SKU match the model knew from the public project"
    limits:
      - "one local model, one storefront and backend, four tasks, five runs each; the backend's field names were renamed so memory couldn't help"
    source: "https://github.com/meabs/experiments/blob/6a6517cc1d9f5c73e552f5a614f6872474169229/2026-10-okf-local/REPORT.md"
    status: current
    featured: false
  - id: "OKL-2"
    statement: "The guide did no better than the backend's own source code: 20 of 20 against 19 of 20, and source runs were slightly faster and cheaper"
    metric: "changes passing their hidden test (higher is better), guide minus source, mean over four tasks"
    value: "+5 pts"
    interval:
      low: "0 pts"
      high: "+15 pts"
      method: "bootstrap 95% CI within tasks; one-sided permutation test, Holm p 1.0: no measurable difference"
    n: 40
    detail:
      - "median time per run: guide 4.3 minutes, source 4.0; energy 8.4 and 7.0 Wh"
      - "the small model searched the 1,173-file Java backend and read only the few classes it needed, including fields in parent classes"
      - "the hosted model in OKF test G: 18 of 20 in both"
    limits:
      - "four tasks can show only large differences; a gap of a run or two would read as no measurable difference"
    source: "https://github.com/meabs/experiments/blob/6a6517cc1d9f5c73e552f5a614f6872474169229/2026-10-okf-local/REPORT.md"
    status: current
    featured: false
  - id: "OKL-3"
    statement: "Without the backend, the agent presented guessed field names as checked facts in 9 of 15 failed runs"
    metric: "failed no-guide runs whose final report gave guessed field names as the backend's, without saying the backend was unavailable"
    value: "9 of 15"
    n: 15
    detail:
      - "14 of the 15 used the storefront's own names or the public project's original names instead of the backend's"
      - "6 said the backend wasn't available, so the names were unconfirmed"
    limits:
      - "read from the agents' final messages after the runs; not part of the design"
    source: "https://github.com/meabs/experiments/blob/6a6517cc1d9f5c73e552f5a614f6872474169229/2026-10-okf-local/REPORT.md"
    status: current
    featured: false
---

## Question

In [OKF test G](/experiments/g-crossrepo-change-hard/), a hosted model had to change a shop's storefront to match a backend that lived in another repository. Without any help it got 3 of 20 changes right. With a generated guide to the backend it got 18, and with the backend's source code readable it also got 18. So for that model, the guide was a good stand-in for the code, but no better.

A small model running on my own machine should be different. It has a quarter of the context (65,536 tokens against 272,000) and works far more slowly, so reading a 1,173-file Java backend should cost it much more than reading a short guide. If reading code is its bottleneck, the guide should beat the source.

I wanted to know three things:

- does the backend's guide help a small local model, as it helped the hosted one?
- does the guide help it more than the backend's source does?
- are runs with the guide faster than runs with the source?

**The short answer:** the guide helped hugely, but the source helped just as much, and runs with it were slightly cheaper. The small model read the Java backend far better than I expected.

## Prediction

Before the runs, I published the design, three hypotheses and how I'd read each result ([README.md](https://github.com/meabs/experiments/blob/0d18df2be35f875e35731843295965791e5896c3/2026-10-okf-local/README.md)):

- **H1.** With the guide, the model passes more changes than with no guide.
- **H2.** With the guide, it passes more changes than with the backend's source: for a small model, the guide is worth more than the code.
- **H3.** Runs with the guide take less time than runs with the source.

## Set-up

**The agent:**
- **Codex CLI 0.157** running `qwen3.8:27b`, an open-weight model, on my own machine (Ollama on the machine's AMD graphics, 4-bit, 65,536-token context), at medium reasoning effort, as in test G.
- **Each run in a sandbox** that shows the agent only its own copy of the storefront.
- **Web search off.** In the first attempt, two runs with no guide tried web search, which on this setup needs an Ollama account, and crashed. I stopped the run and, with my go-ahead, restarted from scratch with search off for everyone. The 10 runs from the first attempt aren't counted.

**Three setups:**

| Setup | What the agent has |
| --- | --- |
| No guide | The storefront only, and a note that the backend is a separate repository and isn't available |
| Guide | The storefront, its own guide, and the backend's guide, generated by OKF's tool |
| Source | The storefront, and the backend's source code, read-only |

**The tasks:** test G's four, with the prompts unchanged. Each needs facts that only the backend states:

1. fix a cart delete that sends the wrong identifier;
2. add a discount code under the backend's field name;
3. build a checkout request with six renamed fields;
4. read an order list whose paging fields come from a parent class.

The backend's field names were renamed beforehand, so the model couldn't answer from memory of the public project.

**Scoring:** each task has a **hidden test** that no agent sees. It checks the change against the backend's real field names. A pass means the run finished and the hidden test passed. **Higher is better.** 5 runs per task per setup: 60 runs, overnight, one round at a time with the setups in rotating order.

## Results

Findings OKL-1 to OKL-3 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-okl-guide.png" alt="Changes passing the hidden test, of 20, higher is better. No guide: 4 local, 3 hosted. The backend's guide: 20 local, 18 hosted. The backend's source: 19 local, 18 hosted. Median minutes per local run, lower is better: 7.4, 4.3 and 4.0; hosted runs took about 0.7 minutes." width="1800" height="920" loading="lazy" />

<figcaption>With the backend's guide or its source, the small local model got nearly every change right; with neither, it got 4 in 20. Source: github.com/meabs/experiments, 2026-10-okf-local/results (Codex 0.157, qwen3.8:27b, medium effort; hosted results from OKF test G).</figcaption>

</figure>

### Passes by task

Each cell is runs passed out of runs (higher is better). The hosted results are test G's, not rerun.

| Task | No guide, local | Guide, local | Source, local | No guide, hosted | Guide, hosted | Source, hosted |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Fix cart delete | 4/5 | 5/5 | 5/5 | 3/5 | 5/5 | 5/5 |
| 2. Discount code | 0/5 | 5/5 | 5/5 | 0/5 | 5/5 | 4/5 |
| 3. Checkout request | 0/5 | 5/5 | 4/5 | 0/5 | 3/5 | 4/5 |
| 4. Order list | 0/5 | 5/5 | 5/5 | 0/5 | 5/5 | 5/5 |
| **Total** | **4/20** | **20/20** | **19/20** | **3/20** | **18/20** | **18/20** |

Without the backend, the model passed only task 1. Its endpoint and the SKU match aren't renamed, and the model knew them from the public project.

### The small model read the code well

I expected a 1,173-file backend to swamp a 65,536-token context. It didn't. The source runs searched the backend, read only the few classes they needed, and found the right fields, including fields in parent classes and the right one of two classes with the same name. Runs with the source were slightly faster than runs with the guide.

### Hypotheses

| # | Comparison | Difference | 95% interval | Holm p | Verdict |
| --- | --- | --- | --- | --- | --- |
| H1 | guide − no guide, passes | +80 points | +75 to +90 | < 0.001 | **Confirmed** |
| H2 | guide − source, passes | +5 points | 0 to +15 | 1.0 | No measurable difference |
| H3 | guide − source, time per run | +60 s | −60 to +188 | 1.0 | No measurable difference |

- **The difference** is the first setup minus the second. For passes, it's in percentage points of pass rate; for time, it's in seconds, where negative would mean the guide was faster.
- **The Holm p** is the chance of a difference this large if there were really none, corrected for testing three hypotheses. Below 0.05 counts as measurable.
- **"No measurable difference"** means the test couldn't tell the setups apart, not that they're proven equal. With four tasks, a gap of a run or two would look like this.

### Cost and time

| Per run | No guide | Guide | Source |
| --- | --- | --- | --- |
| Median time (lower is better) | 7.4 min | 4.3 min | **4.0 min** |
| Median tokens (lower is better) | 308k | 260k | **251k** |
| Energy, Wh (lower is better) | 11.5 | 8.4 | **7.0** |
| Electricity at £0.25/kWh (lower is better) | £0.003 | £0.002 | £0.002 |
| The same tokens at hosted list prices (lower is better) | $0.023 | $0.018 | **$0.015** |

The local model was about 6 to 10 times slower than the hosted one, which took about 40 seconds a run in test G. On Java coding tasks in an earlier local rerun, it was 30 to 60 times slower. A run cost about a fifth of a penny in electricity.

### When the agent couldn't see the backend, it guessed

15 runs with no guide finished and failed. In 14 of them, the agent used field names from the storefront's own code or from the public project instead of the backend's. Only 6 said the backend wasn't available, so their names were unconfirmed. The other 9 presented the guesses as the backend's fields. One called its guess "the field the Shopizer cart-item model defines".

### Checks on the runs

- **All 60 runs were graded.** 59 finished, and 1 hit the 20-minute limit (no guide), counted as a failure. None crashed or tried web search.
- **Grading:** every pass or fail matches the hidden test's own log.
- **Model and effort** were checked in all 60 session files.
- **No agent could see the hidden tests.** Only the source setup could see the backend, and all 20 of its runs read it; all 20 guide runs opened the guide.

## Limits

- **The scope is narrow:** one local model at one size and context length, one storefront and one backend, four tasks, five runs each.
- **Four tasks can show only large differences.** A small advantage for the guide or the source can't be ruled out.
- **The comparison with the hosted model is informal:** different dates, machines, sandboxes and rig versions. The hosted runs also had web search, and these didn't.
- **The backend's names were renamed** so memory couldn't help. On a real, well-known backend, memory might rescue the no-guide setup more often.
- **The explanations of the failures** come from reading the agents' final messages after the runs.

## What this means: impact and risks

This part is my interpretation, not a measurement.

**A local agent working across repositories needs the other side.** Without the backend, the small model got 4 changes in 20 right; with the backend's guide or its code, it got 19 or 20. That gap is far bigger than any difference between the local and hosted models.

**A generated guide is a good stand-in when the code can't be shared.** If the other side is another company's service or a restricted repository, a guide generated from it worked as well as the code itself, for a small model as for a large one.

**When the code can be shared, the guide adds nothing.** On these tasks the source was as accurate and slightly cheaper. Don't build and maintain guides just because the model is small.

**Risk: without the other side, the agent's report can't be trusted.** In 9 of 15 failed runs, the agent reported guessed field names as if it had checked them. Shipped, those changes would send fields the backend doesn't recognise, and nothing in the agent's report would warn you.

**Risk: guides go out of date.** The guide here matched the backend exactly. An out-of-date guide gives wrong names with the same confidence; [OKF test D2](/experiments/d2-stale-knowledge/) looked at that with the hosted model.

**What to do about it:**
- Give a cross-repo agent the other repository, or a guide or contract generated from its current code.
- Test changes against the real backend or its contract, not against the agent's report.
- If you run agents locally to save money, expect several minutes a task; the accuracy here was there, the speed wasn't.

## What would be worth testing next?

These are proposals, not results.

- **A stale guide, on the small model:** does it check the source, as the guide tells it to, or trust an out-of-date guide?
- **A contract instead of a guide:** in [OKF test H1](/experiments/h1-contract-vs-okf-changes/), an API contract did nearly as well as the guide for the hosted model, and it's cheaper to keep up to date.
- **A smaller model or a shorter context,** to find where reading the source stops being affordable and the guide starts to pay.

## Reproduce

Everything is in [experiments/2026-10-okf-local](https://github.com/meabs/experiments/tree/6a6517cc1d9f5c73e552f5a614f6872474169229/2026-10-okf-local):

- the set-up scripts, which rebuild the workspaces and guides (`setup/`);
- the sandbox wrapper (`setup/`); the local model's Codex settings are in [2026-10-test-skill-local/setup](https://github.com/meabs/experiments/tree/6a6517cc1d9f5c73e552f5a614f6872474169229/2026-10-test-skill-local/setup);
- the hidden tests and grader (`hidden/`, `harness/`, `scripts/verify_g.sh`);
- every run's grading log, record and event stream (`results/main`);
- the analysis, extra checks and chart scripts (`scripts/`).

The commands are in REPORT.md, section 10.
