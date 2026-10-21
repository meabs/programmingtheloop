---
title: "Skill packs across 16 tasks (experiment SKT)"
description: "Two popular skill packs for coding agents did not reliably make the agent's changes more correct; one cost about three times as much."
date: 2026-10-21
summary: "On 16 bug fixes and features in a Java online-shop backend, neither Superpowers nor Matt Pocock's skills reliably raised the pass rate; Superpowers used 3.07× the tokens."
type: "Controlled trial"
github:
  - label: "experiments"
    href: "https://github.com/meabs/experiments/tree/main/2026-10-skills-tasks"
draft: false
experimentId: "SKT"
question: "On a varied set of real change tasks, do Superpowers or Matt Pocock's skills raise the share of changes that pass independent acceptance tests, and at what cost in tokens?"
status: published
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "low reasoning, isolation on"
runs: 128
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/main/2026-10-skills-tasks/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/main/2026-10-skills-tasks/README.md"
topics:
  - verification
  - measurement
publishedOn: 2026-10-21
findings:
  - id: "SKT-1"
    statement: "Neither skill pack reliably raised the pass rate: Superpowers passed 24 of 32 runs, the same as with no skills, and Pocock passed 27 of 32, a gap small enough to be chance (Holm p = 0.38)"
    metric: "Pocock vs no skills, mean per-task difference in pass rate"
    value: "+9.4 pts"
    interval:
      low: "−3.1 pts"
      high: "+21.9 pts"
      method: "bootstrap 95% CI over 16 tasks"
    n: 128
    limits:
      - "one repository"
      - "one model at low reasoning effort"
      - "16 tasks, 2 runs per task per arm"
    source: "https://github.com/meabs/experiments/blob/main/2026-10-skills-tasks/REPORT.md"
    status: current
    featured: false
  - id: "SKT-2"
    statement: "Superpowers used about three times the tokens of no skills on the same task; it wrote tests in 23 of 32 runs, where the agent with no skills wrote none"
    metric: "per-task token ratio vs no skills"
    value: "3.07×"
    interval:
      low: "2.50"
      high: "3.68"
      method: "bootstrap 95% CI over 16 tasks"
    n: 64
    limits:
      - "one repository"
      - "one model at low reasoning effort"
    source: "https://github.com/meabs/experiments/blob/main/2026-10-skills-tasks/REPORT.md"
    status: current
    featured: false
  - id: "SKT-3"
    statement: "In 28 of the 30 failed runs, the agent said its change worked; this held in every arm"
    metric: "failed runs that claimed success"
    value: "28/30"
    n: 128
    limits:
      - "the agent could not see the hidden tests"
      - "one model at low reasoning effort"
    source: "https://github.com/meabs/experiments/blob/main/2026-10-skills-tasks/REPORT.md"
    status: current
    featured: false
---

## Question

Skill packs are sets of written instructions that a coding agent reads before it works: how to plan, when to write tests, how to check its own work. Two of the most widely shared are [Superpowers](https://github.com/obra/superpowers) and [Matt Pocock's skills](https://github.com/mattpocock/skills). The question: on a varied set of real bug fixes and small features, does either pack make the agent's changes more often correct, and what does it cost in tokens?

## Prediction

Before any measured run I wrote down the design, the hypotheses and how tasks would be chosen ([README.md](https://github.com/meabs/experiments/blob/main/2026-10-skills-tasks/README.md)). The hypotheses: Superpowers raises the pass rate; Pocock's skills raise the pass rate; a placebo skill (below) does not.

## Set-up

**The agent.** OpenAI's Codex command-line agent, model `gpt-5.6-luna`, set to *low* reasoning effort (how long the model thinks before acting). At high effort the agent solved almost every task with or without skills, which leaves nothing to measure, so I used low. Each run started from a clean configuration, so the agent could see only the skills it was meant to have.

**The code.** [shopizer](https://github.com/shopizer-ecommerce/shopizer), an open-source online-shop backend written in Java: products, carts, customers, tax, reviews, served over a REST API. It is split into several modules and has its own test suite. Every run started from the same version.

**Four ways of running the agent** (called *arms*), identical except for the skills installed:

- **No skills**: the agent gets the task and nothing else. This is the baseline.
- **Placebo skill**: one skill of generic working habits, called "careful engineering" (read the request twice, map the code before changing it, and so on). If the real packs only help because the agent has *some* skill to read, the placebo should help as much.
- **Superpowers**: the full pack. It pushes the agent to plan, then write a failing test before changing code.
- **Pocock**: Matt Pocock's pack.

**The work.** 16 tasks, each run twice in each arm: 16 × 4 × 2 = 128 runs. Two runs rather than one because the same agent on the same task does not always do the same thing.

### The tasks

Ten are real bugs I found in shopizer by calling its API and checking the answers; one is a bug I planted; five are small features. Each task is written the way a shop owner or support team would report it ("our accountant entered a tax rate of 150 and it was accepted"), with no hint of where in the code the cause is. Some have several causes in different files.

| Task | Kind | What is wrong or wanted | Hidden tests |
| --- | --- | --- | --- |
| ADDR | Bug | A changed delivery address loses its street, and the state lands in the postal code | 2 |
| AMBIG | Bug | Fetching a category by id or by URL answers 500 | 4 |
| AVAIL | Bug | A product created as unavailable comes back available | 3 |
| CARTCALC | Planted bug | Cart line and cart totals ignore quantities | 2 |
| CATCOUNT | Feature | A category's product count includes its subcategories, each product once | 1 |
| CATDUP | Bug | A duplicate category code answers 500 with a raw SQL error | 3 |
| CONTENT | Bug | Listing content pages without paging parameters answers 500 | 2 |
| CUSTDUP | Bug | Registering with an email already in use answers 500 | 4 |
| HCUST | Feature | Admin customer search with correct paging and totals | 4 |
| HREVIEW | Bug | Editing or deleting a review fails, and product ratings go stale (six causes) | 3 |
| MANCODE | Feature | Manufacturer code format (400) and uniqueness (409) | 4 |
| MANINUSE | Bug | Deleting a manufacturer still in use answers 503 | 3 |
| MANORDER | Feature | Store manufacturer sort order and list by it across pages | 3 |
| NOTFOUND | Bug | A missing manufacturer answers 503 and a missing product 400, not 404 | 4 |
| PAGE | Bug | The product list ignores the page asked for | 1 |
| TAXRATE | Feature | Tax rates must be 0 to 100, on create and update | 5 |

Numbers such as 400, 404, 500 and 503 are the HTTP status codes the API answers with: 4xx means the request was wrong, 5xx means the server failed.

### How a run is graded

The agent never sees how it will be judged. When it finishes, a grader adds *hidden tests* (48 across the 16 tasks) and runs the project's whole test suite. The hidden tests start the shop and use its API as a real client would: they send requests and check the answers and what was stored. They do not look at how the code was written, so any correct fix passes.

A run passes only if every hidden test passes and none of the project's existing tests breaks.

For example, the TAXRATE tests create tax rates of 0, 7.5 and 100 (all must be accepted and stored), then 150, −1 and a missing rate (each must be refused with 400 and nothing stored), then try to change a stored rate of 5 to 101 (refused, and the stored rate must still be 5).

Before any run, I checked every task three ways: the hidden tests fail on the original code; they pass with my own fix, as does the rest of the suite; and for the planted bug, the existing tests still pass with the bug in place, so they give the agent no clue.

**Choosing the tasks.** I wrote 18 candidates and ran the no-skills agent twice on each, then kept the 16 it found hardest, by a rule fixed beforehand. Those trial runs are not counted in the results.

## Results

Findings SKT-1 to SKT-3 are below; the charts show what sits behind them.

<figure class="guide-figure">

![Hidden tests passed, by task and arm](/guide-images/chart-skt-passes.png)

<figcaption>Runs passed of 2, per task and arm. Six tasks were passed by every run and one, HREVIEW, by none. The arms differ on the other nine, mostly by a single run. No run in any arm broke an existing test.</figcaption>

</figure>

<figure class="guide-figure">

![Tokens per task relative to the no-skills arm](/guide-images/chart-skt-tokens.png)

<figcaption>Tokens are the units of text the model reads and writes, and what you pay for. Each dot is one task: the arm's average tokens per run divided by the no-skills average on the same task, so 1 means the same cost. Bar: the average over tasks, with a 95% interval. The placebo cost little more; Superpowers cost more on every task.</figcaption>

</figure>

<figure class="guide-figure">

![What the agent did, by arm](/guide-images/chart-skt-process.png)

<figcaption>Superpowers changed how the agent worked: it ran the project's tests in 28 of 32 runs and wrote new tests in 23. With no skills, the agent ran the tests once in 32 runs and wrote none. The placebo was read every time and changed little.</figcaption>

</figure>

<figure class="guide-figure">

![Runs that passed, or failed while saying they worked](/guide-images/chart-skt-claims.png)

<figcaption>At the end of each run the agent reports whether its change works. Nearly every failed run said it did, in every arm. The agent could not see the hidden tests, so it was relying on the code compiling, the existing tests passing, or tests it wrote itself.</figcaption>

</figure>

### Where writing tests helped, and where nothing did

**TAXRATE.** The obvious fix is to mark the tax rate field with "must be between 0 and 100" annotations. In this code nothing checks those annotations, so they change nothing: rates of 150 were still accepted. Both no-skills runs and both placebo runs made only that fix and failed. Both Superpowers runs made it too, but also wrote a test that calls the API and added a range check in the code that refuses bad rates; one of them is confirmed to have seen its test fail before the fix. It was the only task where any arm went from 0 of 2 to 2 of 2. On ADDR, CARTCALC and PAGE, Superpowers did worse than no skills.

**HREVIEW.** All eight runs failed. In seven, the change broke *creating* a review, which had worked before. To support editing, the agent changed shared code to look up the existing review by its id; a new review has no id yet (it is 0), so the lookup fails, and the API turns that failure into a 503. None of the project's existing tests creates a review, so the agent's own checks stayed green. I made the same mistake when writing my own fix.

## Limits

One codebase; one agent and model; low reasoning effort only. Sixteen tasks are too few to settle a difference the size of Pocock's: roughly 60 would be needed. Two runs per task is coarse: the placebo, which should do nothing, moved 4 of 16 tasks by one run. I wrote the tasks, hidden tests and reference fixes; all are published for checking. Pass rates are not comparable with my earlier [skills-impact](https://github.com/meabs/experiments/tree/main/2026-10-skills-impact) experiment, which ran at high effort; the extra token cost of Superpowers matches it.

## Reproduce

Everything is in [experiments/2026-10-skills-tasks](https://github.com/meabs/experiments/tree/main/2026-10-skills-tasks): the task prompts (`tasks/`), hidden tests (`hidden/`), raw runs (`results/stage1`), the analysis script (`scripts/analyse.py`) and the chart script (`scripts/charts.py`). The commands are in REPORT.md, section Reproducing.
