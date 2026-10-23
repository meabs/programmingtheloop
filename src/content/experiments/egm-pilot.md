---
title: "Spec first with the Elephant-Goldfish Model, and an AI approver (pilot EGM)"
description: "On a hard feature, a Claude approver reviewing the design lifted Codex from 4 of 16 hidden tests to as many as 16, whether the design came from Google's Elephant-Goldfish spec process or from a plain plan. EGM added nothing over the plain plan, at about five times the cost. A pilot: three runs per arm."
date: 2026-10-23
summary: "On one hard feature in a Java online-shop backend, plain Codex at medium effort passed 4 of 16 hidden tests twice. With a fresh Claude agent approving the design before the build, EGM runs passed 16, 5 and 16, and plain plan-first runs 6, 13 and 16. EGM cost $0.95 of Codex per run against $0.19. What decided the score was one sentence the approver put in the design."
type: "Pilot"
previewImage: "/guide-images/chart-egm-approver.png"
previewAlt: "Hidden tests passed of 16, one bar per run: plain Codex 4 and 4; plan plus approver 6, 13, 16; EGM plus approver 16, 5, 16"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/45265e75c3219d3b49bac9e46dd11e523e1bf396/2026-10-egm-pilot"
draft: false
experimentId: "EGM"
question: "Does writing a spec with Google's Elephant-Goldfish Model before any code is written make a coding agent build a hard feature more correctly, and how much of any gain comes from the person who approves the spec?"
status: published
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "low then medium reasoning, isolation on"
  - name: "Claude (approver)"
    model: "claude-opus-5-5"
    settings: "fresh subagent per run, read-only, never saw the hidden tests"
runs: 16
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/45265e75c3219d3b49bac9e46dd11e523e1bf396/2026-10-egm-pilot/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/45265e75c3219d3b49bac9e46dd11e523e1bf396/2026-10-egm-pilot/README.md"
topics:
  - briefs
  - review
  - measurement
publishedOn: 2026-10-23
findings:
  - id: "EGM-1"
    statement: "A Claude approver reviewing the design before the build lifted Codex on a hard feature: three of six approver runs passed all 16 hidden tests, against 4 of 16 in both runs of plain Codex at the same effort"
    metric: "hidden tests passed of 16, per run"
    value: "approver runs 16, 5, 16, 6, 13, 16 vs plain 4, 4"
    n: 8
    limits:
      - "one feature, three runs per approver arm"
      - "the approver was another AI agent, not a person"
      - "the approver's own Claude usage is not counted in the cost"
    source: "https://github.com/meabs/experiments/blob/45265e75c3219d3b49bac9e46dd11e523e1bf396/2026-10-egm-pilot/REPORT.md"
    status: current
    featured: false
  - id: "EGM-2"
    statement: "EGM did no better than a plain plan reviewed by the same kind of approver, and cost about five times as much in Codex usage"
    metric: "mean hidden tests passed; Codex cost per run"
    value: "12.3 vs 11.7 of 16; $0.95 vs $0.19"
    n: 6
    limits:
      - "three runs per arm: a difference of a test or two means nothing"
      - "one feature"
    source: "https://github.com/meabs/experiments/blob/45265e75c3219d3b49bac9e46dd11e523e1bf396/2026-10-egm-pilot/REPORT.md"
    status: current
    featured: false
  - id: "EGM-3"
    statement: "The score followed one sentence in the approved design, naming the cart's discount line \"discount\" as the task asks. Every run whose design said so scored 13 or 16; the two that did not scored 5 and 6. The name always came from the approver, never from EGM's reviewers"
    metric: "hidden tests passed, design names the line vs does not"
    value: "13 to 16 vs 5 and 6"
    n: 6
    limits:
      - "found after the runs, though whether the design names the line was a measure fixed before them"
      - "one interface detail on one feature"
    source: "https://github.com/meabs/experiments/blob/45265e75c3219d3b49bac9e46dd11e523e1bf396/2026-10-egm-pilot/REPORT.md"
    status: current
    featured: false
  - id: "EGM-4"
    statement: "Without an approver's judgement, EGM's thorough designs did not help: built at low effort they produced skeletons (3 and 1 of 16), and built at medium effort they scored 4 of 16, the same as plain Codex with the task alone"
    metric: "hidden tests passed: EGM designs, low and medium build, vs plain Codex"
    value: "3, 1 (low); 4, 4 (medium) vs 4, 2 (low); 4, 4 (medium)"
    n: 8
    limits:
      - "the approver followed a fixed rule and added no requirement of its own"
      - "two runs per arm"
    source: "https://github.com/meabs/experiments/blob/45265e75c3219d3b49bac9e46dd11e523e1bf396/2026-10-egm-pilot/REPORT.md"
    status: current
    featured: false
---

## Question

[The Elephant-Goldfish Model](https://egm.dev) (EGM) is an open-source plugin, from Google, for writing a design spec with AI agents before any code is written. Its site says thousands of Google engineers use it. It publishes no measure of whether the code built from the spec is more correct.

It has three parts:

- **The Elephant**, the main agent, which has the whole conversation, drafts the design section by section.
- **The Goldfish** are reviewer agents started with no memory of the conversation. They read only the draft and the code, and report what the draft assumes without saying. The review has five stages, up to three reviewers each.
- **A person approves** each drafted section and each review stage. The approved spec then goes to a coding agent.

My earlier experiments used 20 small fixes. EGM is meant for features, where a spec has decisions to make. So I asked: on a hard feature, does EGM make the code more correct? And because EGM expects a person at every step, how much of any gain comes from that person?

This is a **pilot**, not a full trial: two or three runs per arm, to check the method works and what it costs.

## Prediction

Before any run, I wrote down and published the design of the pilot and of each follow-up ([README.md](https://github.com/meabs/experiments/blob/45265e75c3219d3b49bac9e46dd11e523e1bf396/2026-10-egm-pilot/README.md)). With so few runs, it fixes what is measured, not hypotheses to test.

## Set-up

**The agent.** OpenAI's Codex command-line agent, model `gpt-5.6-luna`. EGM was installed from its repository into a clean configuration used only by the EGM runs.

**The code.** [shopizer](https://github.com/shopizer-ecommerce/shopizer), an open-source online-shop backend written in Java, served over a REST API.

**The feature.** Discount codes that a merchant manages, replacing shopizer's single hard-coded promotion rule. The task states the need and fixes only what the tests use: the admin API's paths and fields, and the existing endpoint for applying a code to a cart. It touches the database, an admin API, validation, cart totals, the category tree and the existing promotion code.

- **16 hidden tests** cover percentage and fixed-amount discounts, rounding, categories and their subcategories, minimum spend, dates, replacing codes, dropping codes when they stop applying, validation, uniqueness, separate stores and admin-only access.
- **My reference implementation** passes all 16 and the project's whole existing suite. It changes 7 files and adds about 440 lines.
- A first, easier feature was dropped before any EGM run: plain Codex passed all its tests in under a minute, leaving nothing for a spec to add.

**How a run is graded.** As in earlier experiments, the agent never sees the hidden tests. When it finishes, a grader adds them and runs the project's whole test suite. The score is the number of hidden tests passed, out of 16. No run broke an existing test.

### Who approved

EGM expects a person to approve every step. A full trial of 60 or more EGM runs is too many for a person to sit through, so **Claude, the AI assistant that runs these experiments for me, took the person's place**. This happened in two ways:

- **In the pilot and follow-up 1, by a fixed rule.** That Claude knew the hidden tests, so it added nothing of its own. It quoted the task when asked, approved each section unless it contradicted the task, and moved the review on.
- **In follow-up 2, with judgement.** Each run got a fresh Claude agent (Opus 5.5) that had never seen the hidden tests or the reference. It was given the task and could read the run's copy of the code. It answered as the engineer who asked for the feature: approve, push back, ask for changes. Its replies went to Codex word for word, and every one is published.

### Three rounds

| Round | Arms | Runs |
| --- | --- | --- |
| Pilot | Plain Codex, task only; EGM with the rule approver; both at low effort | 2 + 2 |
| Follow-up 1 | The two approved EGM designs built again at medium effort; plain Codex at medium effort | 2 + 2 |
| Follow-up 2 | EGM with a Claude approver; a plain plan with a Claude approver; all at medium effort | 3 + 3 |

In the **plan arm**, Codex without EGM wrote a design to a file, and the approver reviewed it as often as it wanted. It controls for the approver: if EGM plus approver does no better than plan plus approver, the gain is the approver's. In every EGM and plan run, a fresh Codex session then built from the approved design.

## Results

Findings EGM-1 to EGM-4 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-egm-approver.png" alt="Hidden tests passed of 16, one bar per run, all at medium effort. Plain Codex 4 and 4; plan plus approver 6, 13, 16; EGM plus approver 16, 5, 16. Accepting either name for the discount line: plain 13 and 13; plan plus approver 16, 13, 16; EGM plus approver 16, 15, 16" width="1800" height="920" loading="lazy" />

<figcaption>Follow-up 2 against plain Codex, one bar per run, all at medium effort. With an approver, both processes did better than plain Codex, and EGM did no better than a plain plan. The right panel accepts either name for the cart's discount line. Source: github.com/meabs/experiments, 2026-10-egm-pilot/results (Codex gpt-5.6-luna, medium reasoning).</figcaption>

</figure>

### Without judgement: thorough designs, no better code

| Run | Hidden tests passed | Codex cost | Time |
| --- | --- | --- | --- |
| Plain Codex, low effort | 4 and 2 of 16 | $0.03 each | 1 to 1.5 min |
| EGM, low-effort build | 3 and 1 of 16 | $0.22 to $0.29 | 7 to 9 min |
| Plain Codex, medium effort | 4 and 4 of 16 | $0.08 and $0.13 | 2 to 4 min |
| EGM designs, medium-effort build | 4 and 4 of 16 | $0.29 and $0.57 | build 3 min; one build stalled |

- **The reviews found real problems**, ones my reference also had to deal with: the old hard-coded rule, an existing calculator that cannot cap a fixed amount at cart level, and existing code for walking the category tree. The final designs ran to 405 and 132 lines.
- **At low effort, the build wrote a skeleton and stopped**, about 80 lines each time, and said it had finished.
- **At medium effort, every run wrote the whole feature**, about 600 lines, EGM or not. Every one named the cart's discount line `order.total.discount`, shopizer's existing name, instead of `discount`, which the task asks for. That one name fails every test that checks an amount. Neither EGM design, nor any of its reviews, mentions it.
- **A diagnostic** reran each run's change with the hidden test accepting either name. All four medium runs then passed 13 of 16, with the same three failures in error handling.

### With judgement: the approver is the gain

| Run | Hidden tests | Diagnostic | Approver replies | Codex cost | Time |
| --- | --- | --- | --- | --- | --- |
| EGM + approver 1 | **16** | 16 | 20 | $1.45 | 28 min |
| EGM + approver 2 | 5 | 15 | 11 | $0.54 | 12 min |
| EGM + approver 3 | **16** | 16 | 12 | $0.85 | 20 min |
| Plan + approver 1 | 6 | 16 | 3 | $0.15 | 5 min |
| Plan + approver 2 | 13 | 13 | 4 | $0.23 | 6 min |
| Plan + approver 3 | **16** | 16 | 4 | $0.20 | 6 min |
| Plain Codex (follow-up 1) | 4, 4 | 13, 13 | 0 | $0.08, $0.13 | 2 to 4 min |

Costs are Codex's, at list prices, across every session in the run: the draft, each reviewer and the build. The approver's own Claude usage is not included.

- **Both approver arms beat plain Codex.** No plain run had ever passed all 16. With an approver, three did. On the diagnostic, approver runs scored 13 to 16; in four of them, the approver had also got the error handling right.
- **One sentence decided the score.** Runs whose approved design named the line `"discount"` scored 13 or 16. The two that did not scored 5 and 6, but 15 and 16 on the diagnostic.
- **The name always came from the approver.** The plan arm has no reviewers, and in the EGM runs no review report raised it. In EGM run 2, the approver asked for `"discount"` early on, then at the last step told Codex to use a constant it wrongly believed held that name. In plan run 1, the approver never raised it.
- **EGM added nothing measurable over the plain plan.** Mean score 12.3 against 11.7, and 15.7 against 15.0 on the diagnostic. EGM cost about five times as much, took about three times as long, and needed three to five times as many approver replies.

### Checks on the runs

- **The reviewers were really separate.** In the pilot, Codex at first started its reviewers with the whole conversation copied in, so they were not Goldfish. The rule approver asked for the review to be rerun as EGM says, and from then on, and in every follow-up 2 run, each reviewer started fresh. I checked this from Codex's session files, not from its own account.
- **The approvers never saw the hidden tests.** The tests enter the code only at grading, after approval. Every tool call the approvers made was a read inside their own run's copy of the code, and none changed a file.
- **What Claude added beyond relaying,** in follow-up 2: the fixed start messages, one sentence telling each EGM approver that fresh reviewers were now reviewing its draft, and one note to an approver that approved too early that four review stages were still to come. Neither said anything about the requirements.
- **Every run was fully graded:** all 16 hidden tests and the whole existing suite ran.

## Limits

- A pilot: one feature, two or three runs per arm. The approver's effect is large and consistent; the difference between EGM and the plain plan is not a result.
- The approver was Claude, not a person. A person might catch different things, or the same.
- I wrote the feature, its tests and the reference. The task fixes the line's name in one phrase, and every unaided run missed it. A different feature might turn on something the reviewers would catch.
- One agent and model, at low and medium effort.
- The approver's own Claude usage is not counted, so the approver arms cost more than the table shows.

## What it means

Across my last five experiments, the only thing that made changes measurably more correct was more reasoning effort. On this feature, a reviewer who reads the design as the person asking for the feature did more: from 4 of 16 to as many as 16. EGM's reviewers found real problems in the code, but not the one that mattered most, because it lay in what the person wanted, not in the code. If you write a spec before your agent builds, the review that counts is the one by whoever knows what they asked for. A plain plan, read that way, did as well as EGM, for a fifth of the cost.

## Reproduce

Everything is in [experiments/2026-10-egm-pilot](https://github.com/meabs/experiments/tree/45265e75c3219d3b49bac9e46dd11e523e1bf396/2026-10-egm-pilot):

- the task, hidden tests and reference (`tasks/`, `hidden/`, `reference/`);
- the start, review, build and approver briefs exactly as used (`arms/`);
- the driver, the diagnostic and the audits (`scripts/`);
- every run: its messages, approved design, Codex sessions, grade, session audit, and in follow-up 2 the approver's log and audit (`results/`).

The commands are in REPORT.md, section Reproducing.
