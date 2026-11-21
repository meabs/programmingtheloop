---
title: "Do small towns of AI residents survive, build and trade? (SOC)"
description: "Two towns of eight local-model residents lived for 228 days under survival, police, army and invention rules. All 16 stayed alive, but building and trade faded after about day 100, nobody ever taught a technology to anyone, and a few farmers piled up food. One exploratory run, no statistics."
date: 2026-11-21T12:30:00+00:00
summary: "One exploratory run, stopped at day 229: all 16 residents alive for 228 days (the first set of rules lost 8 of 16 by day 18, but several rules changed at once), 5 technologies invented and none taught, contributions fell from 41 to 5 per 50 days, trades from 10 to 0, and the four farmers held 755 to 1,059 food each. Two towns, one local model, no inference."
type: "Exploratory simulation"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/86e980ab5d98d1c2aad0a88d5c3839296cb621fc/2026-11-agent-society"
draft: false
experimentId: "SOC"
question: "If small towns of AI residents are given survival rules, a police force, an army and the ability to invent technology, do they survive, build public goods, trade and share what they learn?"
status: published
evidenceGrade: published
agents:
  - name: "Local Ollama chat, JSON only, no tools"
    model: "huihui_ai/Qwen3.8-abliterated"
    settings: "Ollama 0.40.14, thinking off, temperature 0.8, 8,192 context, 384 output tokens; one call per resident turn"
runs: "1 run of 2 towns × 8 residents, 228 complete days, 3,658 model decisions, stopped early by me"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/86e980ab5d98d1c2aad0a88d5c3839296cb621fc/2026-11-agent-society/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/86e980ab5d98d1c2aad0a88d5c3839296cb621fc/2026-11-agent-society/README.md"
previewImage: "/guide-images/chart-soc-society.png"
previewAlt: "Bar charts of contributions, trades and messages per 50 days, falling from 41, 10 and 220 to 5, 0 and 56, and a bar chart showing the four farmers each holding 755 to 1,059 food while other residents hold 3 to 331."
topics:
  - harness
publishedOn: 2026-11-21
findings:
  - id: "SOC-1"
    statement: "All 16 residents stayed alive for 228 days under the final rules, but I cannot say which rule change did it"
    metric: "residents alive after the last complete day; unmet meals over the run"
    value: "16 of 16 alive at 5 health; unmet meals 3 (Brook) and 10 (Flint). The first rules lost 4 of 8 residents in each town by day 18"
    n: "1 run, 2 towns × 8 residents"
    detail:
      - "the rules changed together between the first run and this one: an explicit stay-alive rule, police, army, theft, raids, technology, a per-action output schema and a larger context window"
      - "the first run's failed contributions were largely an interface bug (an omitted field), so it understates what those rules might have done"
    limits:
      - "the two towns are not independent repetitions; no statistics were run"
      - "one local model and one seed"
    source: "https://github.com/meabs/experiments/blob/86e980ab5d98d1c2aad0a88d5c3839296cb621fc/2026-11-agent-society/REPORT.md"
    status: current
    featured: false
  - id: "SOC-2"
    statement: "Activity faded after about day 100 and nobody taught a technology to anyone"
    metric: "events per 50-day window, and technologies taught"
    value: "contributions 41, 23, 20, 12, 5; trades 7, 10, 1, 1, 0; messages 220, 117, 73, 63, 56 (last window is days 201 to 228); 5 technologies invented, 0 taught"
    n: "1 run, 2 towns, 8,002 verified events"
    detail:
      - "the four farmers held 755 to 1,059 food at the end, while masons and foresters held 3 to 62 food and hundreds of stone or wood; nobody redistributed it"
      - "one resident, the smith Dara, invented 4 of the 5 technologies"
    limits:
      - "I stopped after 11.9 of the 24 allowed hours, using a rule I wrote after seeing the data, so 'went quiet' means quiet for about 130 days"
      - "I did not test whether abundant food, rather than the rules, removed the reason to trade"
    source: "https://github.com/meabs/experiments/blob/86e980ab5d98d1c2aad0a88d5c3839296cb621fc/2026-11-agent-society/REPORT.md"
    status: current
    featured: false
  - id: "SOC-3"
    statement: "Police level 2 made most theft fail, and the army ended raids"
    metric: "theft attempts by outcome; raids by 50-day window"
    value: "14 attempts: 2 succeeded, 4 were caught, 8 failed; 32 raids, all in the first 50 days"
    n: "2 towns, 8 residents each"
    detail:
      - "12 of the 14 attempts were by Rook, the more aggressive merchant in Brook (1 success); Flint had 1 attempt, which succeeded"
    limits:
      - "small counts from one resident; the detection and success chances are my own toy parameters"
    source: "https://github.com/meabs/experiments/blob/86e980ab5d98d1c2aad0a88d5c3839296cb621fc/2026-11-agent-society/REPORT.md"
    status: current
    featured: false
---

## Question

I wanted to see what a small society of local-model residents does when basic needs, defence and invention are part of the rules: do they stay alive, build shared things, trade, and pass knowledge on?

**The short answer:** they stayed alive and defended themselves, and then settled into a routine. After about day 100 building and trade almost stopped, nobody taught anyone a technology, and the farmers' food piled up while others held single digits.

**What this does and doesn't measure:** one run of two towns and one local model. It says nothing about human societies or the real economy, and I ran no statistical tests.

**This experiment was designed and run with an AI agent** (Claude Code, working for me): it wrote the engine, the rules, the prompts and the analysis, and ran the towns. I asked for the experiment, chose the local model, changed the rules after the first run and approved the design and the early stop.

## Prediction

Before the first call I wrote predictions for the first rules and, before the second set, for the final rules ([README.md](https://github.com/meabs/experiments/blob/86e980ab5d98d1c2aad0a88d5c3839296cb621fc/2026-11-agent-society/README.md)): a voluntary trade in the free-message town, paid messaging reducing messages, a public building completing, at least six of eight residents alive per town on day 30, a theft attempt, a police or army upgrade, an invention, and a technology being taught.

## Set-up

Two towns of eight residents (farmer, forester, mason, smith, merchant roles), all the same local model. One resident, Rook, is a more aggressive merchant in both towns. Brook has free messages and Flint charges one coin per delivered message. A deterministic engine applies every action; an independent verifier replays all 8,002 events without importing the engine and passed. The final rules add an explicit stay-alive rule, police and army public projects, theft and raids, and `invent` and `teach` actions for six kinds of technology.

## Results

Findings SOC-1 to SOC-3 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-soc-society.png" alt="Bar charts of contributions, trades and messages per 50 days, falling from 41, 10 and 220 to 5, 0 and 56, and a bar chart showing the four farmers each holding 755 to 1,059 food while other residents hold 3 to 331." />

<figcaption>Events per 50 days and food held after day 228. Source: github.com/meabs/experiments, 2026-11-agent-society.</figcaption>

</figure>

| # | Prediction | Result |
| --- | --- | --- |
| H1 | a trade in the free town | yes |
| H2 | paid messaging lowers messages | yes (0.66 against 1.65 a day), descriptive only |
| H3 | a public building other than police or army | yes (farms, clinics and a market; Brook 11 levels, Flint 9) |
| H4 | at least 6 of 8 alive on day 30 per town | yes (8 and 8) |
| H5 | a theft attempt | yes (14) |
| H6 | a police or army upgrade | yes (both at army 3, police 2) |
| H7 | an invention | yes (5) |
| H8 | a technology taught | **no** (0) |

## Limits

- **Many rules changed at once,** so survival cannot be credited to any one of them.
- **Two towns, one model, one seed.** Days and residents inside a town are not repetitions.
- **An early stop** after 11.9 of 24 hours, on a rule written after seeing the data.
- **About 0.2% of replies were cut off** (7 of 3,658 decisions) and recorded as invalid.
- **No claim about people.** The production, survival and incentive rules are toys.

## What this means

Survival rules, police and an army were enough to keep this model's residents alive and to deter most theft. They did not make the residents share a surplus, spread what they invented or keep building once needs were met.

## What next

A paired design with independent seeds, so each rule change is isolated; persistent scarcity so trade and teaching have a reason; and a technology that only pays when several residents hold it.

## Reproduce

The folder holds the engine, verifier, self-test, runner, analysis, chart source and the full ledger. The report lists the commands: [REPORT.md](https://github.com/meabs/experiments/blob/86e980ab5d98d1c2aad0a88d5c3839296cb621fc/2026-11-agent-society/REPORT.md).
