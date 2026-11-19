---
title: "Does design knowledge make an agent's futuristic bank app better or safer? (FUT)"
description: "A small follow-up to DFX: 10 runs, five per arm. The same Codex agent, with web search, asked to research the next generation of banking customers, pick the features and storyboard a futuristic mobile banking app, either with nothing else or with the Design Factory. The plain agent's design won all 25 blind pairs on overall, novelty, fit and identity. The factory's design was judged more plausible as a UK bank's app, and had no accessibility violations."
date: 2026-11-12T16:00:00+00:00
summary: "10 runs, one open brief. Plain agent preferred in 25 of 25 pairs overall (factory score 0.03, p 0.008, the test's floor). Novelty, fit and identity 0.00. Plausible as a UK bank: factory ahead (0.61 uncropped, 0.73 cropped). axe violations per screen 0.00 against 0.41. Factory features were 69% ordinary banking functions, plain 27%. Cost $0.068 against $0.028 a run."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/ea5448bdaf106023e996d8ea96b95c83ca0aad25/2026-11-future-bank"
draft: false
experimentId: "FUT"
question: "On an open brief to design a futuristic mobile banking app for a new generation of users, does giving an agent the Design Factory make its design better, or does it make it safer and less novel?"
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI 0.167.1"
    model: "gpt-5.6-luna (hosted)"
    settings: "medium effort in both arms; live web search in both arms; each run in its own bubblewrap sandbox; the factory's use checked in every session log"
runs: "1 brief × 2 arms × 5 runs = 10 runs; 25 plain-against-factory pairs judged blind by two vision models in both orders (100 judgements per capture method), after a one-run-per-arm pilot"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/ea5448bdaf106023e996d8ea96b95c83ca0aad25/2026-11-future-bank/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/e7c3936370474af903989ab13edc06b263c9b576/2026-11-future-bank/README.md"
previewImage: "/guide-images/fut-1-results.png"
previewAlt: "Share of judge votes for the factory design over 25 pairs, 0.5 meaning no preference. Overall 0.03, novelty 0.00, fit for a new generation 0.00, plausible as a UK bank 0.61, hierarchy 0.29, polish 0.41, identity 0.00. Cropped re-score: overall 0.01, plausible 0.73."
topics:
  - skills
  - context
  - harness
  - safety-cost
publishedOn: 2026-11-12
findings:
  - id: "FUT-1"
    statement: "On an open futuristic-app brief, blind judges preferred the plain agent's design in all 25 pairs"
    metric: "share of judge votes for the factory design per pair, mean over 25 pairs; 0.5 is no preference, below 0.5 favours the plain agent"
    value: "overall 0.03; novelty, fit and identity 0.00"
    n: "25 pairs (5 × 5 runs), two vision-model judges, both orders"
    detail:
      - "overall: factory won 0 pairs, plain 25; 95% bootstrap interval 0.00 to 0.10; run-level permutation p 0.008, the smallest the test can give"
      - "novelty, fit for a new generation and identity: plain won every pair in each judge alone"
      - "cropped re-score (declared beforehand): overall 0.01; dropping the one run whose uncropped capture was blank: 0.04"
      - "both judges chose the same design in both orders in 88% to 100% of pairs"
    limits:
      - "one brief, one wording of 'futuristic', one model, five runs a cell; the p value is approximate because the 25 pairs share 10 runs"
      - "model judges, not designers; no people voted"
    source: "https://github.com/meabs/experiments/blob/ea5448bdaf106023e996d8ea96b95c83ca0aad25/2026-11-future-bank/REPORT.md"
    status: current
    featured: false
  - id: "FUT-2"
    statement: "The factory's design was judged more plausible as a UK bank's app, but only clearly on cropped screens"
    metric: "share of judge votes for the factory design on 'plausible as a UK bank's app', mean over 25 pairs (higher favours the factory)"
    value: "0.61 uncropped, 0.73 cropped"
    n: "25 pairs"
    detail:
      - "uncropped: factory won 16 pairs, plain 5, split 4; interval 0.30 to 0.85; p 0.22, not significant"
      - "cropped: factory won 22, plain 1, split 2; interval 0.63 to 0.81; p 0.008"
      - "the two judges differed: Sonnet 5.5 0.79, Gemini 0.43 on the uncropped screens"
    limits:
      - "the plausibility criterion was mine; the judges were asked about credibility as a regulated UK bank, not a legal review"
    source: "https://github.com/meabs/experiments/blob/ea5448bdaf106023e996d8ea96b95c83ca0aad25/2026-11-future-bank/REPORT.md"
    status: current
    featured: false
  - id: "FUT-3"
    statement: "The factory agents chose mostly ordinary banking features; the plain agents chose mostly new capabilities"
    metric: "share of each run's listed features coded by a model as an ordinary banking function (the rest mostly new capabilities)"
    value: "69% factory, 27% plain"
    n: "36 factory features and 48 plain features, 10 runs"
    detail:
      - "features per run: factory 7.2, plain 9.6; categories used per run 4.4 against 7.8"
      - "all five factory runs chose payments, balances and security; all five plain runs chose savings or goals, balances or spending, security and an AI assistant"
      - "overlap between runs within an arm (mean Jaccard of category sets) was 0.59 for the factory and 0.66 for plain: the factory runs were not more alike"
    limits:
      - "coded by a model that saw only the feature list; the categories and 'new capability' are judgements"
    source: "https://github.com/meabs/experiments/blob/ea5448bdaf106023e996d8ea96b95c83ca0aad25/2026-11-future-bank/REPORT.md"
    status: current
    featured: false
  - id: "FUT-4"
    statement: "A program found no accessibility violations in the factory's screens and 0.41 per screen in the plain agent's"
    metric: "axe-core WCAG 2.x A and AA violations per screen (lower is better)"
    value: "0.00 against 0.41 per screen"
    n: "51 factory screens, 49 plain screens"
    detail:
      - "screens with no violation: 100% factory, 59% plain; 20 plain screens had a colour-contrast violation"
      - "all five factory runs opened the index, workflow and all 11 stage and specialist skills, and ran the lint and render checks; four of five ran the contrast tool"
    limits:
      - "a program finds only part of the failures; no claim of conformance for either arm; exploratory, since an open brief has no checklist"
    source: "https://github.com/meabs/experiments/blob/ea5448bdaf106023e996d8ea96b95c83ca0aad25/2026-11-future-bank/REPORT.md"
    status: current
    featured: false
  - id: "FUT-5"
    statement: "The factory cost about 2.4 times as much per run as the plain agent"
    metric: "cost per run at gpt-5.6-luna list price (lower is better)"
    value: "$0.068 against $0.028 per run"
    n: "10 runs"
    detail:
      - "input tokens 1,377k against 286k (4.8 times); time 459 s against 263 s"
      - "the 10 runs cost about $0.48; the judging about $5.35"
    limits:
      - "token prices only; the time of a person reading the factory's five extra design files per run is not counted"
    source: "https://github.com/meabs/experiments/blob/ea5448bdaf106023e996d8ea96b95c83ca0aad25/2026-11-future-bank/REPORT.md"
    status: current
    featured: false
---

## Question

[DFX](/experiments/design-factory/) gave an agent a Design Factory (an OKF knowledge bundle, 12 skills including Impeccable, a mandatory review) or nothing, on six defined banking journeys. The factory made storyboards more complete and more accessible, and the plain agent's look was preferred. Those briefs named the journey. **This one is open: design a futuristic version of a mobile banking app for a new generation of users.** The agent has to decide who the users are, what they will need and which features to build. Does design knowledge help that, or does it pull the agent towards conventional banking?

"Futuristic" was defined as a next-generation app based on what the agent judges the future needs of future users to be. The brief said that and nothing more.

**This experiment was written by an AI agent** (Claude Code, working for me): the design, scripts, graders and analysis. I set the question, the brief, the number of runs and the definition of "futuristic", and approved the design before any measured run.

**The short answer:**

- **The plain agent's design won every one of the 25 blind pairs on overall**, and every pair on novelty, fit for a new generation and identity.
- **The factory's design was judged more plausible as a UK bank's app**, and its screens had no accessibility violations.
- **The factory chose ordinary banking features** (69% of them) where the plain agent chose new capabilities (73%).

## Prediction

Written before any run, in the [design](https://github.com/meabs/experiments/blob/e7c3936370474af903989ab13edc06b263c9b576/2026-11-future-bank/README.md): no preference on the whole design, a lean to plain on novelty and identity, the factory ahead on plausibility, research applied and accessibility, and factory runs converging on a more similar feature set. **The first was wrong** (the preference for plain was complete) and the last was not supported.

## Set-up

Same agent as DFX (Codex CLI with `gpt-5.6-luna` at medium effort, live web search in both arms, each run sandboxed). Plain: a README only. Factory: the DFX factory, unchanged. **One brief, five runs per arm.** Each agent did its own research: nothing was shared between runs. Each delivered `research.md` (sources, then numbered features with the supporting finding), a storyboard page of 8 to 12 frames, each 390 × 844 px, and a frame list.

Each plain run was compared with each factory run, 25 pairs, blind, by two vision models from other providers, in both orders. The criteria were overall, **novelty**, **fit for a new generation**, **plausible as a UK bank's app**, hierarchy, polish and identity. The primary result uses the original uncropped screen captures (I was asked not to crop); I also ran, and declared beforehand, a re-score on screens cropped to the phone. The test is a permutation across the 10 runs, whose smallest possible p is 0.008.

## Results

Findings FUT-1 to FUT-5 are at the top of the page.

Pair score is the share of judge votes for the factory design, averaged over 25 pairs: 0.5 is no preference, higher favours the factory, lower favours plain.

| Criterion | Score, uncropped (95% interval) | Factory wins / plain wins / split | Cropped re-score |
| --- | --- | --- | --- |
| overall | 0.03 (0.00 to 0.10) | 0 / 25 / 0 | 0.01 |
| novelty | 0.00 (0.00 to 0.00) | 0 / 25 / 0 | 0.00 |
| fit for a new generation | 0.00 (0.00 to 0.00) | 0 / 25 / 0 | 0.00 |
| plausible as a UK bank | 0.61 (0.30 to 0.85) | 16 / 5 / 4 | 0.73 |
| hierarchy | 0.29 (0.07 to 0.60) | 4 / 16 / 5 | 0.32 |
| polish | 0.41 (0.13 to 0.72) | 8 / 14 / 3 | 0.38 |
| identity | 0.00 (0.00 to 0.00) | 0 / 25 / 0 | 0.00 |

<figure class="guide-figure">

<img src="/guide-images/fut-1-results.png" alt="Pair scores by criterion, uncropped captures with 95% intervals and the cropped re-score, against the 0.5 no-preference line. Overall 0.03, novelty 0.00, fit 0.00, plausible as a UK bank 0.61 (cropped 0.73), hierarchy 0.29, polish 0.41, identity 0.00." width="1800" height="920" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-future-bank (results/main/analysis.md and analysis-crop.md).</figcaption>

</figure>

The judges explained their choices in a sentence. For the plain designs: "a distinctive, forward-looking product (cashflow forecast, an explainable money guide, guarded goals, shared pots, human handoff with context, privacy centre)". For the factory's: "a competent, honest but conventional safe-to-spend and payment-with-scam-warning flow" and "a safe, honest but generic payment flow that barely feels futuristic, even though it is more clearly shippable for a UK bank". The judges named the factory's UK credibility and still chose plain, because the brief asked for futuristic.

### What the screens look like

Run 2 of each arm, first screens, cropped to the phone (the judges' primary scores used uncropped captures). Plain, then factory.

<figure class="guide-figure">

<img src="/guide-images/fut-plain-2.jpg" alt="First screens of the plain agent's run 2 storyboard." width="1266" height="950" loading="lazy" />

<img src="/guide-images/fut-factory-2.jpg" alt="First screens of the factory's run 2 storyboard." width="1266" height="950" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-future-bank (report/samples).</figcaption>

</figure>

### The features they chose

A model read each run's feature list without seeing the arm.

| Arm | Features per run | Backed by a named source | New capability | Ordinary banking function | Categories per run |
| --- | --- | --- | --- | --- | --- |
| Plain | 9.6 | 79% | 73% | 27% | 7.8 |
| Factory | 7.2 | 61% | 28% | 69% | 4.4 |

### Tokens, time and cost

<figure class="guide-figure">

<img src="/guide-images/fut-2-tokens.png" alt="Total tokens per run: plain runs between about 190 thousand and 490 thousand, mean 300 thousand; factory runs between about 920 thousand and 1.7 million, mean 1.4 million." width="1800" height="540" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-future-bank (Codex session logs; gpt-5.6-luna list price).</figcaption>

</figure>

| Arm | Input tokens (lower is better) | Seconds per run (lower is better) | Cost per run (lower is better) |
| --- | --- | --- | --- |
| Plain | 286k | 263 | $0.028 |
| Factory | 1,377k | 459 | $0.068 |

Cost is at gpt-5.6-luna list prices ($0.20 per million input tokens, $0.02 cached, $1.20 output).

### A broken capture

One factory page hides every frame except the first at phone-width browser sizes, so its uncropped capture showed one screen and ten blank ones. It displays correctly at the 1280 px the brief asked for. I found it when checking the captures, before judging, and logged it. Dropping that run leaves overall at 0.04, and the cropped re-score, which captures it correctly, gives 0.01.

## What this means in practice

Bounded to what was tested: this agent at medium effort with search on, one open brief, unattended.

- **For a bold, next-generation concept, this factory made the result worse.** Every judge vote went to the plain agent on novelty and fit.
- **For a concept that has to survive a bank's risk and regulatory review, the factory's output had the edge** and a clean accessibility check.
- The factory is a **delivery** tool: it makes what you ask for safe and accessible, and it narrows what the agent chooses to build.

**Risks this exposes:**

- **Design knowledge can make an agent conservative.** A team that adds a pack and a mandatory review may be buying safety at the cost of imagination without noticing.
- **The criteria you choose decide the winner.** Plausibility went to the factory; novelty, fit and identity went to plain.
- **The plain agent's concepts were not checked for regulation.** Open-banking aggregation and an AI cashflow assistant raise consent and conduct questions nobody reviewed.
- **A capture fault can corrupt a comparison.** Look at the screens before trusting a score.

## Configuration recommendations

Limited to what was tested:

- **For concept and exploration work, don't run the factory's workflow as it is.** Use the plain agent, or the factory without its banking and payments pack and its "keep everyday banking familiar" steer; the second was not tested.
- **For a concept that will be built, running it through the factory afterwards as a safety and accessibility pass** is what the two arms' strengths suggest. This sequence was not tested.
- **Ask for a range of ideas explicitly.** A brief that asks for novel features was not tested.

## Limits

- **One brief, five runs per arm**, one model, one wording of "futuristic". The test can only detect a large difference, and a p of 0.008 is its floor. It says nothing about how large the effect is elsewhere.
- **The factory is a bundle** (knowledge, workflow, skills, tools, a mandatory review). No arm separates them. The payments pack is the likely reason all five factory runs built a payment flow, but that was not tested.
- **Model judges, no people.** The criteria (novelty, fit, plausibility) are mine.
- The feature coding is by a model; the p values are approximate because the pairs share runs.
- The research-applied judge ran on the uncropped captures only. The blind human-vote gallery is described in the DFX repository but not built.
- One AI agent wrote the factory, the brief, the graders and the analysis.
