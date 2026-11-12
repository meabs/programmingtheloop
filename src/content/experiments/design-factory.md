---
title: "If I give an agent design knowledge, does it design better? (DFX)"
description: "60 runs. The same Codex agent, with live web search, asked to research banking-app design trends and storyboard a banking scenario, either with nothing else or with a Design Factory: an OKF knowledge bundle, 12 skills including Impeccable, and a mandatory design review. Blind model judges saw no clear preference for the whole design and preferred the plain agent's look. The factory was far ahead on completeness and on accessibility checks, at about three times the cost."
date: 2026-11-12T12:00:00+00:00
summary: "60 runs, six banking briefs. Whole design: no preference shown (0.53, 0.39 to 0.66). Looks only: the plain agent preferred (0.32, Holm p 0.031). Checklist 85% against 59%. axe violations per screen 0.06 against 1.00. Cost $0.065 against $0.020 a run. The factory was used in every run."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/a4348f50a62cc29af8d13eebf6faf3f75ef39ec0/2026-11-design-factory"
draft: false
experimentId: "DFX"
question: "If an agent is given a design factory (an OKF knowledge bundle, skills including Impeccable, a six-stage workflow and a mandatory review), does it produce a better researched and storyboarded banking design than the same agent given only the task?"
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI 0.167.1"
    model: "gpt-5.6-luna (hosted)"
    settings: "medium effort in both arms; live web search in both arms; each run in its own bubblewrap sandbox; the factory's use checked in the session log of every run"
runs: "6 briefs × 2 arms × 5 runs = 60 runs, 30 pairs judged blind by two vision models in both orders, after a pilot"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/a4348f50a62cc29af8d13eebf6faf3f75ef39ec0/2026-11-design-factory/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/1b80cc254aa7977e6e46b1bb1c32e6650a458a48/2026-11-design-factory/README.md"
previewImage: "/guide-images/dfx-2-results.png"
previewAlt: "Mean share of judge votes for the factory design over 30 pairs, 0.5 meaning no preference. Whole design 0.53, interval 0.39 to 0.66. Looks only 0.32, interval 0.19 to 0.45, below 0.5 so the plain agent is preferred. Cropped re-score: whole design 0.38, looks 0.32."
topics:
  - skills
  - context
  - harness
  - safety-cost
publishedOn: 2026-11-12
findings:
  - id: "DFX-1"
    statement: "Blind judges saw no clear preference for the factory's whole design over the plain agent's, and preferred the plain agent's look"
    metric: "share of judge votes for the factory design per pair, mean over 30 pairs; 0.5 is no preference, below 0.5 favours the plain agent"
    value: "whole design 0.53, looks only 0.32"
    n: "30 pairs, two vision-model judges, both orders"
    detail:
      - "pre-registered H1, whole design: 0.53, 95% interval 0.39 to 0.66, p 0.80; factory won 14 pairs, plain 11, split 5"
      - "pre-registered H2, looks (first six screens): 0.32, interval 0.19 to 0.45, Holm p 0.031; factory won 6, plain 21, split 3"
      - "exploratory cropped re-score: whole design 0.38 (0.25 to 0.53, p 0.15), looks 0.32 (0.21 to 0.43, p 0.009)"
      - "the pre-registered tie is probably flattered: the first capture squeezed the plain agent's phone frames, and 83% of the votes the factory won faulted layout defects in the plain design, against 40% after cropping"
    limits:
      - "model judges, not designers; one judge favours whichever design it sees first (68%) and the two judges agree on 62% of pair-views"
      - "not significant is not the same as equal"
    source: "https://github.com/meabs/experiments/blob/a4348f50a62cc29af8d13eebf6faf3f75ef39ec0/2026-11-design-factory/REPORT.md"
    status: current
    featured: false
  - id: "DFX-2"
    statement: "The factory's storyboards were more complete: 85% of a 12-item journey checklist against 59%"
    metric: "share of the brief's 12 checklist items present in the visible screen text, mean per pair (higher is better)"
    value: "+26 pts"
    n: "30 pairs"
    detail:
      - "pre-registered H3: 0.59 to 0.85, difference +0.26, 95% interval +0.19 to +0.32, Holm p 0.0004"
      - "savings (D2): the plain agent had no summary box, no AER explanation, no FSCS mention and no 14-day cancellation right in any of 5 runs; the factory had a summary box and FSCS in 5 of 5"
      - "overdraft (D3): only the factory told a declined customer a credit reference agency was used (5 of 5 against 0)"
    limits:
      - "circular by construction: I wrote the checklist from the factory's own knowledge, so it shows the factory gets its knowledge into the design, not that the knowledge is complete"
    source: "https://github.com/meabs/experiments/blob/a4348f50a62cc29af8d13eebf6faf3f75ef39ec0/2026-11-design-factory/REPORT.md"
    status: current
    featured: false
  - id: "DFX-3"
    statement: "A program found almost no accessibility violations in the factory's screens and about one per screen in the plain agent's"
    metric: "axe-core WCAG 2.x A and AA violations per screen (lower is better)"
    value: "0.06 against 1.00 per screen"
    n: "30 pairs, 509 screens"
    detail:
      - "pre-registered H4: difference −0.94, 95% interval −1.11 to −0.77, Holm p 0.0004"
      - "screens with no violation: 10% plain, 94% factory"
      - "27 of 30 plain runs had a colour-contrast violation, 1 of 30 factory runs; 29 of 30 factory runs ran the contrast tool"
      - "controls at least 44 px both ways: 51% plain, 92% factory"
    limits:
      - "a program finds only part of the failures; no claim of conformance for either arm"
    source: "https://github.com/meabs/experiments/blob/a4348f50a62cc29af8d13eebf6faf3f75ef39ec0/2026-11-design-factory/REPORT.md"
    status: current
    featured: false
  - id: "DFX-4"
    statement: "The factory's design review and skills were used in every factory run, and its research was thinner and no better applied"
    metric: "factory runs that opened the index, workflow and each stage skill, from the Codex session logs; share of the agent's own research decisions visibly applied (blind model judge)"
    value: "30 of 30 runs; research applied 68% against 81%"
    n: "60 runs"
    detail:
      - "all 30 factory runs opened okf/index.md, okf/workflow.md and all 11 stage and specialist skills, and wrote a review file with the Impeccable review, accessibility table, legal register and banking checklist"
      - "pre-registered H6, share of research decisions applied, factory minus plain: −0.13, interval −0.29 to +0.03, Holm p 0.28, no difference shown"
      - "plain research averaged 830 words and 7.5 distinct web addresses, factory 521 words and 4.4"
    limits:
      - "the factory keeps its research trace in the review file, which the research judge does not read"
      - "keyword checks on headings, not a check of quality"
    source: "https://github.com/meabs/experiments/blob/a4348f50a62cc29af8d13eebf6faf3f75ef39ec0/2026-11-design-factory/REPORT.md"
    status: current
    featured: false
  - id: "DFX-5"
    statement: "The factory cost about three times as much per run as the plain agent"
    metric: "cost per run at gpt-5.6-luna list price (lower is better)"
    value: "$0.065 against $0.020 per run"
    n: "60 runs"
    detail:
      - "input tokens 1,321k against 192k (6.9 times); time 435 s against 192 s"
      - "the 60 runs cost about $2.55; the judging about $11"
    limits:
      - "token prices only; the time of a person reading five more design files per run is not counted and was not measured"
    source: "https://github.com/meabs/experiments/blob/a4348f50a62cc29af8d13eebf6faf3f75ef39ec0/2026-11-design-factory/REPORT.md"
    status: current
    featured: false
---

## Question

Teams are starting to give agents bundles of written knowledge: an index, rules, skills, checklists. I wanted to know whether that pays off for design. **If I give an agent design knowledge, does it produce a better design than the same agent given only the task?** The point of the test was "design looking against just build", so the main measure is how the result looks to a reviewer, not how many documents it wrote.

**This experiment was written by an AI agent** (Claude Code, working for me): the factory, the briefs, the graders and the analysis. I set the question, chose the two arms and approved the design before any measured run.

**The short answer:**

- **No clear preference for the whole design**, which matches my prediction of "little difference", but on looks alone the judges preferred the plain agent.
- **The factory was far ahead on completeness and on accessibility checks**, and it cost about three times as much.
- **The first tie is probably flattering.** My capture method squeezed the plain agent's phone frames, and when I re-captured the screens at a fair width the whole-design score leaned to the plain agent.

## Prediction

My prediction, written down before the pilot: **"Little difference"** (the option read: a capable plain agent already does this well). Six hypotheses, H1 to H6, were pre-registered before the main run. The [design](https://github.com/meabs/experiments/blob/1b80cc254aa7977e6e46b1bb1c32e6650a458a48/2026-11-design-factory/README.md) was pushed first.

## Set-up

<figure class="guide-figure">

<img src="/guide-images/dfx-1-setup.png" alt="The two arms. Both: Codex with gpt-5.6-luna at medium effort and live web search, the same prompt, a fictional UK bank called Brindle Bank, six briefs, five runs each. Arm A, plain: a README only. Arm B, Design Factory: AGENTS.md pointing to an OKF index, a six-stage workflow, rules, design, accessibility, UK legal and banking knowledge, 12 skills including Impeccable, and three tools for contrast, lint and rendering. Each run delivers research.md, a storyboard page and screens.json. Two blind vision-model judges compare the pairs in both orders." width="1800" height="880" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-design-factory (diagrams/setup.html).</figcaption>

</figure>

Both arms got the same short ticket: research current trends and styles in mobile banking app design, write them up with sources ending in numbered design decisions, then develop a storyboard of a banking scenario as a web page of 390 px phone screens. Nobody answered questions.

- **Plain:** a README saying this is the bank's design workspace, and nothing else.
- **Design Factory:** an `AGENTS.md` telling the agent to read an OKF (Open Knowledge Format) index first, a six-stage workflow (brief, research, storyboard, visual direction, prototype, critique), 12 skills including Impeccable's design guidance, design, accessibility, UK legal and banking knowledge, and three small tools. The review stage was mandatory.
- **Six briefs** for Brindle Bank, a fictional UK bank: pay someone new, open a savings account, an arranged overdraft, a missing card, where my money went this month, and account home. Five runs of each brief in each arm.

Two vision models from other providers judged each plain run against the matching factory run, blind, in both orders, on seven criteria, once on the whole design and once on the first six screens ("looks"). A checklist, axe-core, a research-to-design judge and the agents' own session logs gave the secondary measures.

## Results

Findings DFX-1 to DFX-5 are at the top of the page.

Pair score is the share of judge votes for the factory design, averaged over 30 pairs: 0.5 means no preference, higher favours the factory, lower favours the plain agent.

| Question | Factory wins | Plain wins | Split | Mean score (95% interval) | p after Holm |
| --- | --- | --- | --- | --- | --- |
| H1 whole design | 14 | 11 | 5 | 0.53 (0.39 to 0.66) | 0.80 |
| H2 looks only | 6 | 21 | 3 | 0.32 (0.19 to 0.45) | 0.031 |
| Whole design, cropped (exploratory) | 11 | 17 | 2 | 0.38 (0.25 to 0.53) | not tested |
| Looks only, cropped (exploratory) | 6 | 19 | 5 | 0.32 (0.21 to 0.43) | not tested |

<figure class="guide-figure">

<img src="/guide-images/dfx-2-results.png" alt="Pair scores for the whole design and for looks, in the original captures and in the cropped re-score, with intervals against the 0.5 no-preference line. Whole design original 0.53, cropped 0.38. Looks original 0.32, cropped 0.32." width="1800" height="960" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-design-factory (results/main/analysis.md and analysis-crop.md).</figcaption>

</figure>

### What the screens look like

The plain agent built an illustrated presentation: numbered steps, captions, device frames, research tags on each frame and a bolder palette. The factory's own storyboard skills define the storyboard as a working prototype of every screen and state, one screen at a time, with demo controls to reach error states. Savings (D2), plain then factory:

<figure class="guide-figure">

<img src="/guide-images/dfx-D2-plain.jpg" alt="The first screens of the plain agent's savings-account storyboard: an accounts home with a coloured prompt, then the product and application steps." width="1266" height="1188" loading="lazy" />

<img src="/guide-images/dfx-D2-factory.jpg" alt="The first screens of the factory's savings-account storyboard: a product page with the summary box and FSCS questions, then the application steps." width="1266" height="1188" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-design-factory (report/samples). First screens of run 1, cropped to the phone screen; chosen before looking at results.</figcaption>

</figure>

Account home (D6), plain then factory:

<figure class="guide-figure">

<img src="/guide-images/dfx-D6-plain.jpg" alt="The first screens of the plain agent's account-home storyboard: a dark balance card and tinted accents." width="1266" height="1188" loading="lazy" />

<img src="/guide-images/dfx-D6-factory.jpg" alt="The first screens of the factory's account-home storyboard: flat screens including a loading state and an error state." width="1266" height="1188" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-design-factory (report/samples).</figcaption>

</figure>

### Why the judges chose what they chose

Each judge wrote a sentence explaining its choice. I coded all 480 sentences into ten themes with a model that saw only the sentence and which design won, not the arm. Counts are approximate.

| Theme | Decided the vote when plain won | Decided the vote when factory won |
| --- | --- | --- |
| Looks polished, finished, like a real bank app | 42% | 1% |
| Distinctive, deliberate look | 11% | 1% |
| Complete journey, states, branches | 32% | 64% |
| Trust, honesty, protective information | 1% | 9% |

When the plain agent won it was mostly how it looked, and half of those wins faulted the factory's prototype scaffolding (demo buttons such as "Show amount error", draft legal wording on screen, a "web form" feel). When the factory won it was about the journey and the protective information (FSCS cover, scam warnings). Looks almost never decided a factory win.

### The cropped re-score

After the main analysis I suspected presentation (device frames, captions, a coloured page) explained the plain agent's lead on looks. I recaptured every screen at desktop width, cropped it to the phone screen and re-judged the same pairs. This is exploratory.

- **The looks result did not move** (0.32 both ways), so presentation does not explain the lead.
- **The whole-design tie leaned to plain** (0.53 to 0.38, not significant). The original capture rendered the plain agent's frames squeezed to about 255 px with overlapping text. 83% of the votes the factory won faulted layout defects in the plain design, against 40% after cropping. I report the pre-registered number as the result and this as the caveat.

### Completeness and accessibility

<figure class="guide-figure">

<img src="/guide-images/dfx-3-checks.png" alt="Checklist and accessibility favour the factory; research applied favours plain. Checklist items present: plain 59%, factory 85%. axe violations per screen: plain 1.00, factory 0.06. Research decisions applied: plain 81%, factory 68%." width="1800" height="960" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-design-factory (results/main/analysis.md).</figcaption>

</figure>

The biggest accessibility gap was a single rule, colour contrast, which the factory's contrast tool checks. The factory's own faults: 4 runs misused definition lists and 4 used a prohibited ARIA attribute.

### Tokens, time and cost

<figure class="guide-figure">

<img src="/guide-images/dfx-4-tokens.png" alt="Mean tokens per run: plain 192 thousand input and 9.7 thousand output, factory 1.32 million input and 22 thousand output. Cost per run $0.020 and $0.065." width="1800" height="880" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-design-factory (Codex session logs; gpt-5.6-luna list price).</figcaption>

</figure>

| Arm | Input tokens (lower is better) | Output tokens (lower is better) | Seconds per run (lower is better) | Cost per run (lower is better) |
| --- | --- | --- | --- | --- |
| Plain | 192k | 9.7k | 192 | $0.020 |
| Factory | 1,321k | 22.0k | 435 | $0.065 |

Cost is at gpt-5.6-luna list prices ($0.20 per million input tokens, $0.02 cached, $1.20 output).

## What this means in practice

Bounded to what was tested: this agent at medium effort with search on, six banking briefs, unattended.

- **For complete, accessible, regulated journeys** (a savings summary box, decline reasons, error states, contrast, target sizes) the factory made a large, measured difference.
- **For a better-looking design** this factory did not deliver. The judges preferred the plain agent's look in 19 to 21 of 30 pairs.
- So the factory as built is a completeness and accessibility tool, not yet a design-quality tool.

**Risks this exposes:**

- **A model judge is not a designer.** The judges disagreed in 38% of pair-views and one is heavily order-sensitive. A design team should vote on pairs blind before acting.
- **The checklist is circular.** The accessibility and preference measures are not.
- **The regulatory content is draft.** Neither arm's output should be treated as compliant.
- **An unattended agent ships what it does not know to include.** The plain agent never mentioned FSCS in any of its 5 savings runs.
- **The factory can look finished while being thin on research.**

## Configuration recommendations

Limited to the tested configuration:

- **Keep the factory's accessibility and regulated-content parts for banking work.** Whether a smaller version would do as well was not tested.
- **Keep demo controls and draft text out of the frames a reviewer sees first**, or set them apart. Whether that changes the preference was not tested.
- **Keep the research trace visible on the frames**, as the plain agent did with R1, R2 tags.
- **Show reviewers screens cropped to the phone at natural width, blind.** The capture method changed the whole-design result.
- **Do not expect it to improve visual identity.** A presentation and brand stage is untested.

## Limits

- **The factory is a bundle.** It combines knowledge, a workflow, skills and tools. There is no arm with the knowledge as one file and no ablation, so no single part can be credited.
- One agent and model, one fictional bank, six short briefs, five runs per cell, 30 pairs. With 30 pairs the test can miss a moderate preference.
- Judges were two vision models; no people voted. A blind human-vote gallery is described in the repository but not built.
- The cropped re-score was done after seeing the main results and is exploratory.
- One AI agent wrote the factory, the briefs, the checklist and the graders. I did not tune the factory to the judges.
