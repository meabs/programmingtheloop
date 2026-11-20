---
title: "Do patches make an architecture safer, or just bigger? (AMA)"
description: "A red-team agent attacked a model of a small system (APIs, an agent, credentials, trust zones) and, after each verified attack, a defender changed the live design. On four generated systems and two local models, the defenders closed most attack paths without measurably growing the system; a defender that could only remove or narrow things broke a business flow more often than the free one, the opposite of what I predicted."
date: 2026-11-20T21:55:00+00:00
summary: "96 games (2 local models × 4 arms × 12), with an engine that counts every attack path. Open paths fell from 2.75 to 0.1–0.4 with a free-redesign defender and to 0–0.1 with a remove-or-narrow defender; the free defender ended 0.5–0.7 parts bigger (not measurable) and opened a new path in 1 of 24 games. Remove-or-narrow broke a business flow in 3 of 12 games per model, free redesign in 1 of 12. A toy model, small numbers."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/f39bebca216f0b9b9ee63db359d5922d9a9e3304/2026-11-attack-architecture"
draft: false
experimentId: "AMA"
question: "When every successful attack on an architecture is followed by a defender's change to the live design, do the working attack paths fall, or does the system just accumulate parts?"
status: published
evidenceGrade: published
agents:
  - name: "Local Ollama chat, JSON only, no tools"
    model: "qwen3.8:27b"
    settings: "Ollama 0.40.14, thinking off, temperature 0.7, 8,192 context; red team and defender"
  - name: "Local Ollama chat, JSON only, no tools"
    model: "huihui_ai/Qwen3.8-abliterated"
    settings: "same settings; a second full run for comparison (exploratory)"
runs: "2 models × 4 arms × 12 games = 96 games of up to 8 rounds, after a 4-game pilot"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/f39bebca216f0b9b9ee63db359d5922d9a9e3304/2026-11-attack-architecture/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/f39bebca216f0b9b9ee63db359d5922d9a9e3304/2026-11-attack-architecture/README.md"
previewImage: "/guide-images/chart-ama-curves.png"
previewAlt: "Mean open attack paths and complexity by round for four arms on two local models, 12 games per arm. With no defender, paths stay at 2.8. With a free-redesign, subtractive or minimal-fix defender they fall to between 0 and 0.6 by round 8. Complexity stays near 37 with the free defender and falls to about 34 to 35 with the subtractive one."
topics:
  - safety-cost
  - harness
publishedOn: 2026-11-20
findings:
  - id: "AMA-1"
    statement: "Letting a defender patch the live design after each verified attack closed most attack paths, for both a free-redesign defender and a remove-or-narrow one"
    metric: "open attack paths found by the engine at the end of a game, against the 2.75 at the start (mean of 12 games)"
    value: "free redesign 2.75 to 0.08 (qwen3.8:27b) and 0.42 (abliterated); remove-or-narrow 0 and 0.08; scripted minimal fix 0.17 and 0.58; no defender 2.75"
    interval:
      low: "91%"
      high: "100%"
      method: "share of the starting paths closed by the free defender on qwen3.8:27b, bootstrap 95% CI within system (the engine's −2.50 to −2.75 paths divided by 2.75, my conversion); pre-registered H1, one-sided permutation, Holm p below 0.001. The abliterated model gave −2.00 to −2.67 paths (Holm p below 0.001)"
    n: "12 games per arm per model, 4 systems × 3 repetitions"
    detail:
      - "the remove-or-narrow defender closed about as many as the free one: the difference was +0.08 paths (qwen3.8:27b, Holm p 0.50) and +0.33 (abliterated, Holm p 0.14), no measurable difference"
      - "with no defender red kept breaching in 97% and 99% of rounds 3 to 8; with a defender in 13% to 35%"
    limits:
      - "a model of a system with 3 to 5 planted weaknesses each fixable by one edit; real weaknesses are harder to fix and to find"
      - "red stopped finding paths after a few rounds, so 'closed' means closed against this red agent as well as in the engine's count"
      - "two local models of similar size, thinking off"
    source: "https://github.com/meabs/experiments/blob/f39bebca216f0b9b9ee63db359d5922d9a9e3304/2026-11-attack-architecture/REPORT.md"
    status: current
    featured: false
  - id: "AMA-2"
    statement: "The free defender did not measurably grow the system, and mostly removed or narrowed things rather than adding layers"
    metric: "change in complexity (components + edges + credentials + mitigations; 36.75 at the start) from the start to the end of a game, free redesign"
    value: "+0.67 parts on qwen3.8:27b (37.4 at round 8), +0.50 on the abliterated model"
    n: "12 games per arm per model"
    detail:
      - "intervals include no change: [−0.58, +2.17] and [−0.33, +1.33] parts (bootstrap 95%, within system); pre-registered H2 part c predicted +3 or more, Holm p 0.50 for both: not shown"
      - "operations the free and remove-or-narrow defenders proposed on qwen3.8:27b: 56 remove-edge, 33 change-credential, 14 add-mitigation, 10 add-edge, 8 narrow-edge, 4 add-component, 4 add-credential, 1 remove-credential"
      - "the free defender added more complexity than the remove-or-narrow one (+3.42 and +2.50 parts, Holm p 0.002 and 0.005), but mostly because the latter got smaller (−2.75 and −2.00); it did not measurably differ from the scripted minimal fix (+0.67, Holm p 0.50)"
    limits:
      - "complexity is a count of parts and wiring, not how hard the system is to run or understand"
      - "12 games per arm; 'not shown' does not mean the same"
    source: "https://github.com/meabs/experiments/blob/f39bebca216f0b9b9ee63db359d5922d9a9e3304/2026-11-attack-architecture/REPORT.md"
    status: current
    featured: false
  - id: "AMA-3"
    statement: "The remove-or-narrow defender broke a business flow more often than the free one, the opposite of what I predicted"
    metric: "games in which a business flow was broken at some round, out of 12"
    value: "remove-or-narrow 3 of 12, free redesign 1 of 12, in each model; scripted minimal fix and no defender 0 of 12"
    n: "12 games per arm per model"
    detail:
      - "every broken flow was the same one, 'agent reads the ticket', broken by cutting the edge that carries tickets to the agent"
      - "pre-registered H3 predicted free redesign would break more flows: Holm p 0.98 and 0.95 for the observed direction, not supported"
    limits:
      - "one flow, three games; exploratory beyond the pre-registered test, and the numbers are small"
    source: "https://github.com/meabs/experiments/blob/f39bebca216f0b9b9ee63db359d5922d9a9e3304/2026-11-attack-architecture/REPORT.md"
    status: current
    featured: false
  - id: "AMA-4"
    statement: "A patch opened a new attack path in 1 of 24 free-defender games, far below the third I predicted"
    metric: "free-redesign games in which any patch created an attack path that did not exist before, out of 12 per model"
    value: "1 of 12 (qwen3.8:27b), 0 of 12 (abliterated)"
    n: "24 games"
    detail:
      - "pre-registered H4: more than a third; not met"
      - "the one case was system B, repetition 3, round 4 on qwen3.8:27b; in the other 23 free-defender games no patch created a new path"
    limits:
      - "the model only lets a new component open a path if the engine's few rules allow it; real added components carry more ways to fail"
    source: "https://github.com/meabs/experiments/blob/f39bebca216f0b9b9ee63db359d5922d9a9e3304/2026-11-attack-architecture/REPORT.md"
    status: current
    featured: false
  - id: "AMA-5"
    statement: "The abliterated model left more paths open and produced more invalid patches than qwen3.8:27b, but I did not test the difference"
    metric: "open paths at the end of a game (mean of 12) and proposals the engine rejected as invalid"
    value: "free redesign 0.42 against 0.08, scripted minimal fix 0.58 against 0.17, remove-or-narrow 0.08 against 0; rejected proposals 6 of 79 defended rounds against 1 of 62"
    n: "12 games per arm per model"
    detail:
      - "exploratory, no test run: the cause (abliteration, a different base, or chance with 12 games) is not separable here"
    limits:
      - "two models, one quantisation each; exploratory comparison"
    source: "https://github.com/meabs/experiments/blob/f39bebca216f0b9b9ee63db359d5922d9a9e3304/2026-11-attack-architecture/REPORT.md"
    status: current
    featured: false
---

## Question

Advice for agent systems is mostly "add a layer": a gateway, a vault, a broker, an approval step. Each layer is also a new component, credential and trust boundary. I wanted to know what happens when the design is changed by the attacks themselves:

- do the working attack paths fall, or does the system just accumulate parts?
- does it matter what the defender is allowed to do: anything, only remove or narrow things, or just fix the exact step the attacker used?
- how often does a fix break something the business needs?

**The short answer:** in this toy set-up the defenders closed most of the attack paths and did not measurably grow the system. The free-redesign defender mostly cut edges and tightened credentials rather than adding layers. A defender that could only remove or narrow broke a business flow more often (3 of 12 games, against 1 of 12), which is the opposite of what I predicted.

**What this does and doesn't measure:** a model of a system on a small engine, four generated systems, two local models, 12 games per arm per model. It says nothing about real organisations, human red teams or software I did not model.

**This experiment was designed and run with an AI agent** (Claude Code, working for me): it wrote the engine, the systems, the prompts and the analysis, and ran the games. I asked for the experiment, chose to use local models, and approved the design and the runs.

## Prediction

Before the main run, I published the design and five hypotheses ([README.md](https://github.com/meabs/experiments/blob/f39bebca216f0b9b9ee63db359d5922d9a9e3304/2026-11-attack-architecture/README.md)):

- **H1.** The free defender ends with fewer open paths than it started with, but by less than the remove-or-narrow one.
- **H2.** The free defender ends with more complexity than the other defenders and than it started (three or more components).
- **H3.** The free defender breaks a business flow in more games than the remove-or-narrow one.
- **H4.** In more than a third of free-defender games, a patch creates a path that did not exist.
- **H5.** Red succeeds more in later rounds against the undefended system than against defended ones.

## Set-up

**The system under attack is a model.** Components (a public web app, a partner webhook, a ticket API, a support agent that reads untrusted ticket text, CRM and billing APIs, a CI runner, three crown jewels: customer data, a payments ledger and a secrets vault), credentials with exposure and lifetime, edges with scopes, and trust zones. Four generated systems, each with 3 to 5 planted weaknesses (an injectable agent, remote code execution on a public service, plaintext or long-lived keys, a flat route to data) and six business flows that must stay possible.

**An engine decides, not the agents.** It counts every minimal attack path from the internet to a crown jewel and replays the business flows after each patch. Red's steps work only if the rules allow them. Forty checks confirm that known attacks work, forged steps fail, and a harmful shortcut (delete every edge into the data) removes all paths and is caught as breaking flows.

| Arm | After each verified attack |
| --- | --- |
| N | nothing changes (a baseline) |
| F | a free defender proposes any change |
| S | a defender may only remove or narrow things |
| M | a script revokes only the exact credential or edge used (no model) |

**The agents:** red sees the documented architecture, not the weaknesses, and gets up to three attempts a round. Red and the defenders in F and S are local models through Ollama (`qwen3.8:27b`, and `huihui_ai/Qwen3.8-abliterated` as a second full run), one JSON reply per call, no tools. Each system, arm and repetition is a game of up to 8 rounds. Provider cost was $0.

## Results

Findings AMA-1 to AMA-5 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-ama-curves.png" alt="Mean open attack paths and complexity by round for four arms on two local models, 12 games per arm. With no defender, paths stay at 2.8. With a free-redesign, subtractive or minimal-fix defender they fall to between 0 and 0.6 by round 8. Complexity stays near 37 with the free defender and falls to about 34 to 35 with the subtractive one." />

<figcaption>Open attack paths (left) and complexity (right) by round; a stopped game keeps its last value. Source: github.com/meabs/experiments, 2026-11-attack-architecture.</figcaption>

</figure>

| Model | Arm | Paths at the end | Complexity change | Games that broke a flow | Games with a new path |
| --- | --- | --- | --- | --- | --- |
| qwen3.8:27b | none | 2.75 | 0 | 0 | 0 |
| | free | 0.08 | +0.67 | 1 | 1 |
| | remove or narrow | 0 | −2.75 | 3 | 0 |
| | minimal fix | 0.17 | 0 | 0 | 0 |
| abliterated | none | 2.75 | 0 | 0 | 0 |
| | free | 0.42 | +0.50 | 1 | 0 |
| | remove or narrow | 0.08 | −2.00 | 3 | 0 |
| | minimal fix | 0.58 | 0 | 0 | 0 |

### Hypotheses

| # | Result | Reading |
| --- | --- | --- |
| H1 | free: 2.75 to 0.08 and 0.42, Holm p below 0.001; remove-or-narrow no better (p 0.50 and 0.14) | supported (first part); second part not shown |
| H2 | free against remove-or-narrow +3.42 and +2.50 parts, Holm p 0.002 and 0.005; against the minimal fix and against its own start, no measurable difference | partly supported; the three-component rise was not seen |
| H3 | free 1 of 12, remove-or-narrow 3 of 12 in each model | not supported, opposite direction |
| H4 | 1 of 12 and 0 of 12 | not met |
| H5 | red 97% and 99% in later rounds with no defender, 13% to 35% with one; Holm p below 0.001 | supported |

- **"Holm p"** is the chance of a difference this large if there were really none, corrected for the planned comparisons. Below 0.05 counts as measurable.
- **"No measurable difference"** means the test couldn't tell the arms apart, not that they're equal.

### Watch a game

The replay shows red's path lighting up step by step, then the defender's changes (additions in green, removals dashed): [open the replay ↗](/attack-architecture/replay.html). Pick a system and a defender, then press play. It replays the engine's recorded games for `qwen3.8:27b`; it computes nothing itself.

## Limits

- **A toy model.** The weaknesses are planted from a short list and each can be fixed with one edit. The result may depend on how easy the model makes removal.
- **Small numbers.** Four systems, 12 games per arm per model, so intervals are wide. The same planted weaknesses recur across repetitions.
- **"Converged" is partly red running out of ideas.** The defender sees only the paths red found.
- **One attacker prompt, three attempts.** A stronger or more persistent red might reopen closed paths. No human red team took part.
- **Complexity is a count,** not how hard the system is to operate.
- **Two local models,** one quantisation each, thinking off. The model comparison is exploratory.

## What this means

Within this toy, an attack-driven loop where the defender may redesign converged, did not pile on parts, and rarely made things worse. If it carried over, the cost to watch would be what the loop takes away (here, an edge a business flow needed) rather than how big the design gets. It would only carry over where a cheap removal exists that the business can survive, which real systems often lack.

## What next

Held-out systems whose weaknesses cannot be fixed by cutting one edge, a complexity budget on the defender, a stronger red model and a hosted model as a check on the local ones, and real software in place of the model, with independent seeds for a confirmatory test.

## Reproduce

The folder holds the engine, the four systems, the runner, the pilot and main scripts, the analysis and every game record. The report lists the commands: [REPORT.md](https://github.com/meabs/experiments/blob/f39bebca216f0b9b9ee63db359d5922d9a9e3304/2026-11-attack-architecture/REPORT.md). It needs Ollama with the two models.
