---
title: "Skill packs across 16 tasks (experiment SKT)"
description: "Skill packs did not reliably raise the pass rate; Superpowers cost about three times the tokens."
date: 2026-10-21
summary: "On 16 shopizer tasks, neither Superpowers nor Matt Pocock's skills reliably raised the pass rate; Superpowers used 3.07× the tokens."
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
    statement: "Neither skill pack reliably raised the pass rate: Superpowers passed 24 of 32 runs, the same as the control, and Pocock passed 27 of 32 (Holm p = 0.38)"
    metric: "Pocock vs control, mean per-task difference in pass rate"
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
    statement: "Superpowers used about three times the control's tokens per task; it wrote tests in 23 of 32 runs, where the control wrote none"
    metric: "per-task token ratio vs control"
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

On a varied set of real change tasks, do Superpowers or Matt Pocock's skills raise the share of changes that pass independent acceptance tests, and at what cost in tokens?

## Prediction

Hypotheses, analysis and task selection rule written down before the measured runs: [README.md](https://github.com/meabs/experiments/blob/main/2026-10-skills-tasks/README.md). Superpowers raises the pass rate (T1); Pocock raises the pass rate (T2); a placebo skill does not (T3, the check on the other two).

## Set-up

shopizer, a Java e-commerce backend (Maven, JDK 21), at a fixed commit. Codex `gpt-5.6-luna` at low reasoning, with a clean home folder so it could only see the skills in its arm. 16 tasks × 4 arms × 2 runs = 128 runs.

The four arms:

- **No skills**: the task prompt only.
- **Placebo skill**: one generic "careful engineering" skill, to separate the effect of having *a* skill from the effect of these skills.
- **Superpowers**: the Superpowers pack, which pushes test-first development and planning.
- **Pocock**: Matt Pocock's skills pack.

### The tasks

Ten are real bugs I found in shopizer by calling its REST API; one is a bug I planted; five are small features. Each prompt is written the way a merchant or support team would report it, with no hint of where the cause is.

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

### How a run is graded

After the agent finishes, the grader copies in hidden JUnit tests the agent never saw (48 across the 16 tasks) and runs the whole Maven build. The hidden tests start the application and call its REST API as a client would: they send requests and check status codes and stored data, not the code.

A run passes only if every hidden test ran and passed and no existing test failed.

Before any run, each task was checked three ways:

- the hidden tests fail on the starting code;
- they pass with my reference fix, and so does the full existing suite;
- for the planted bug, the existing suite still passes with the bug in place, so it gives no hint.

For example, the TAXRATE tests create rates of 0, 7.5 and 100 (accepted and stored), then 150, −1 and a missing rate (each must answer 400 and store nothing), then update a stored rate of 5 to 101 (400, and the stored rate must still be 5).

Tasks were picked by a rule fixed before calibration: run the no-skills arm twice on 18 candidates, keep the 16 it found hardest. Calibration runs are not counted.

## Results

Findings SKT-1 to SKT-3 are below; the charts show what sits behind them.

<figure class="guide-figure">

![Hidden tests passed, by task and arm](/guide-images/chart-skt-passes.png)

<figcaption>Runs passed of 2, per task and arm. Six tasks were passed by every run and one, HREVIEW, by none. The arms differ on the other nine, mostly by a single run. No run in any arm broke an existing test.</figcaption>

</figure>

<figure class="guide-figure">

![Tokens per task relative to the no-skills arm](/guide-images/chart-skt-tokens.png)

<figcaption>Each dot is one task: the arm's mean tokens per run divided by the no-skills mean for the same task. Bar: mean and 95% bootstrap interval over tasks. The placebo cost little; Superpowers cost more on every task.</figcaption>

</figure>

<figure class="guide-figure">

![What the agent did, by arm](/guide-images/chart-skt-process.png)

<figcaption>Superpowers changed how the agent worked: it ran Maven tests in 28 of 32 runs and wrote tests in 23. Without skills, the agent ran Maven tests once in 32 runs. The placebo was read every time and changed little.</figcaption>

</figure>

<figure class="guide-figure">

![Runs that passed, or failed while saying they worked](/guide-images/chart-skt-claims.png)

<figcaption>At the end of each run the agent reports whether its change works. Nearly every failure came with a claim of success, in every arm. The agent could not see the hidden tests, so these claims rested on compiling, the existing suite, or its own tests.</figcaption>

</figure>

### Where writing tests helped, and where nothing did

**TAXRATE.** The obvious fix is to add range annotations to the request object. The API never validates that object, so the annotations do nothing: out-of-range rates were still accepted. Both no-skills runs and both placebo runs made that fix and failed. Both Superpowers runs made it too, but also wrote an integration test that calls the endpoint and added a range check in the API that answers 400; one of them is confirmed to have seen its test fail first. It was the only task where any arm went from 0 of 2 to 2 of 2. On ADDR, CARTCALC and PAGE, Superpowers did worse than no skills.

**HREVIEW.** All eight runs failed. In seven, the change broke *creating* a review, which had worked before: to support edits, the agent made the shared review mapper look up the existing review by id; on create the id is 0, the lookup throws, and the API's catch-all turns that into 503. No existing test covers review creation, so the agent's own checks stayed green. I hit the same trap while writing the reference fix.

## Limits

One repository; one model; low reasoning effort only. Sixteen tasks are too few to settle an effect the size of Pocock's: roughly 60 would be needed. Two runs per task is coarse: the placebo, which should do nothing, moved 4 of 16 tasks by one run. I wrote the tasks, hidden tests and reference fixes; they are published for checking. Pass rates are not comparable with the high-effort [skills-impact](https://github.com/meabs/experiments/tree/main/2026-10-skills-impact) experiment; the token cost of Superpowers matches it.

## Reproduce

[experiments/2026-10-skills-tasks](https://github.com/meabs/experiments/tree/main/2026-10-skills-tasks): task prompts in `tasks/`, hidden tests in `hidden/`, raw runs in `results/stage1`, analysis in `scripts/analyse.py`, charts in `scripts/charts.py`; commands in REPORT.md, section Reproducing.
