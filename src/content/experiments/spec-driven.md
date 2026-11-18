---
title: "Do spec-driven toolkits help a coding agent fix hard bugs? (SDD)"
description: "180 Codex runs on six hard Shopizer bug reports. Spec Kit's bug-fixing skills, OpenSpec and a research-plan-implement prompt did no better than no setup, and all three trailed the six-line disciplined setup. A 134-line AGENTS.md matched the short one. Spec Kit made the agent's summaries more candid, not more correct."
date: 2026-11-18T18:00:00+00:00
summary: "180 Codex runs, six hard tickets. Share of hidden tests passed: no setup 42.3%, Spec Kit 40.7%, OpenSpec 38.2%, research-plan-implement 42.6%, the six-line disciplined setup 53.5%, a 134-line AGENTS.md 52.8%. No process arm beat no setup. Every setup roughly doubled the tokens. Spec Kit's agent said 'partial' in 11 of 29 failing runs; the others almost never did."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/121485546003956824fa7b3dcd959730cb2399f7/2026-11-spec-driven"
draft: false
experimentId: "SDD"
question: "Do the most-adopted ways of giving a coding agent a process (Spec Kit's bug-fixing skills, OpenSpec, research then plan then implement) raise the share of hidden tests it passes on hard bug reports, compared with no setup and with a short disciplined setup? And does a long AGENTS.md do worse than a short one?"
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI 0.157"
    model: "gpt-5.6-luna (hosted)"
    settings: "medium effort, one turn per run, no one to ask, bubblewrap sandbox; Spec Kit 1.4.2 and OpenSpec 2.1.0 run unattended"
runs: "6 tickets × 6 arms × 5 runs = 180 runs, after a one-ticket pilot of every arm"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/121485546003956824fa7b3dcd959730cb2399f7/2026-11-spec-driven/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/121485546003956824fa7b3dcd959730cb2399f7/2026-11-spec-driven/README.md"
topics:
  - skills
  - briefs
  - verification
publishedOn: 2026-11-18
findings:
  - id: "SDD-1"
    statement: "Spec Kit's bug-fixing skills did not raise the share of hidden tests passed over no setup, though the agent followed them in every run"
    metric: "mean share of hidden acceptance tests passed per run, each ticket counted equally, Spec Kit minus no setup (higher is better)"
    value: "−1.6 pts (40.7% against 42.3%)"
    interval:
      low: "−11.3 pts"
      high: "+8.0 pts"
      method: "bootstrap 95% CI within ticket; pre-registered H1, one-sided permutation p 0.61, Holm p 1.00: no measurable difference"
    n: "6 tickets × 5 runs per arm"
    detail:
      - "all 30 runs wrote the three Spec Kit reports (assessment, fix, test); the skills were used, not skipped"
      - "runs that passed every hidden test: 1 of 30 against 1 of 30 with no setup"
      - "on PRODUCTDELETE, whose hidden cause is found or not, Spec Kit found it in 0 of 5 runs against 2 of 5 with no setup; without that ticket Spec Kit is about 5 points ahead, still within noise"
    limits:
      - "run unattended in one turn, without the human review it is designed around"
      - "only its bug-fixing extension, not its feature flow"
      - "one repository, one agent and model at one effort"
    source: "https://github.com/meabs/experiments/blob/121485546003956824fa7b3dcd959730cb2399f7/2026-11-spec-driven/REPORT.md"
    status: current
    featured: false
  - id: "SDD-2"
    statement: "OpenSpec did not raise the share of hidden tests passed over no setup, and made the biggest changes"
    metric: "mean share of hidden acceptance tests passed per run, each ticket counted equally, OpenSpec minus no setup (higher is better)"
    value: "−4.2 pts (38.2% against 42.3%)"
    interval:
      low: "−14.9 pts"
      high: "+5.8 pts"
      method: "bootstrap 95% CI within ticket; pre-registered H2, one-sided permutation p 0.75, Holm p 1.00: no measurable difference"
    n: "6 tickets × 5 runs per arm"
    detail:
      - "all 30 runs created an OpenSpec change; none stopped after the plan"
      - "0 of 30 runs passed every hidden test; on average 11.6 files changed per run against 5.9 with no setup"
      - "on SUPPORTORDERS OpenSpec passed 53% against 70% for every other arm except research-plan-implement"
    limits:
      - "run unattended in one turn, without the human review it is designed around"
      - "one repository, one agent and model at one effort"
    source: "https://github.com/meabs/experiments/blob/121485546003956824fa7b3dcd959730cb2399f7/2026-11-spec-driven/REPORT.md"
    status: current
    featured: false
  - id: "SDD-3"
    statement: "Asking for research, then a plan, then the change did not raise the share of hidden tests passed over no setup"
    metric: "mean share of hidden acceptance tests passed per run, each ticket counted equally, research-plan-implement minus no setup (higher is better)"
    value: "+0.3 pts (42.6% against 42.3%)"
    interval:
      low: "−10.7 pts"
      high: "+11.1 pts"
      method: "bootstrap 95% CI within ticket; pre-registered H3, one-sided permutation p 0.48, Holm p 1.00: no measurable difference"
    n: "6 tickets × 5 runs per arm"
    detail:
      - "all 30 runs wrote the research and plan notes it asked for"
    limits:
      - "the instruction is one paragraph in the prompt; other wordings may differ"
      - "one repository, one agent and model at one effort"
    source: "https://github.com/meabs/experiments/blob/121485546003956824fa7b3dcd959730cb2399f7/2026-11-spec-driven/REPORT.md"
    status: current
    featured: false
  - id: "SDD-4"
    statement: "None of the three process arms beat the six-line disciplined setup, and each trailed it"
    metric: "mean share of hidden acceptance tests passed per run, each ticket counted equally, Spec Kit minus the disciplined setup (higher is better)"
    value: "Spec Kit −12.8 pts, OpenSpec −15.3, research-plan-implement −10.9"
    interval:
      low: "−21.3 pts"
      high: "−3.6 pts"
      method: "bootstrap 95% CI within ticket for Spec Kit against the disciplined setup; pre-registered H4 (does not beat) holds for all three, Holm p 1.00; the 'worse than' reading is exploratory"
    n: "6 tickets × 5 runs per arm"
    detail:
      - "disciplined setup 53.5% of hidden tests passed; the same six tickets and setup as ELC round 1, so this is a repeat, not an independent set"
      - "every setup roughly doubled the tokens: about 1.9M per run with no setup against 3.1M to 3.7M with the others"
      - "cost per hidden test passed at list price: $0.013 no setup, $0.019 disciplined, $0.020 research-plan-implement, $0.023 Spec Kit, $0.026 OpenSpec"
    limits:
      - "the interval shown is for Spec Kit; those for the other two are in the report"
      - "the process arms were run unattended in one turn"
    source: "https://github.com/meabs/experiments/blob/121485546003956824fa7b3dcd959730cb2399f7/2026-11-spec-driven/REPORT.md"
    status: current
    featured: false
  - id: "SDD-5"
    statement: "A 134-line AGENTS.md did no worse than the short one"
    metric: "mean share of hidden acceptance tests passed per run, each ticket counted equally, long AGENTS.md minus the six-line setup (higher is better)"
    value: "−0.7 pts (52.8% against 53.5%)"
    interval:
      low: "−10.7 pts"
      high: "+9.6 pts"
      method: "bootstrap 95% CI within ticket; pre-registered H5 (the long file does worse), one-sided permutation p 0.45: not supported, no measurable difference"
    n: "6 tickets × 5 runs per arm"
    detail:
      - "the long file is the six lines plus about 125 lines of ordinary reference notes; the same three skills in both"
      - "against no setup, both were about 10 points ahead (exploratory: +11.1 and +10.4, Holm p 0.065 for both): not clearly different from no setup after correction"
    limits:
      - "one long file, written by the agent; other long files may differ"
      - "one repository, one agent and model at one effort"
    source: "https://github.com/meabs/experiments/blob/121485546003956824fa7b3dcd959730cb2399f7/2026-11-spec-driven/REPORT.md"
    status: current
    featured: false
  - id: "SDD-6"
    statement: "Spec Kit's agent often said what it had not verified; the other setups almost never did, and still it was no more correct"
    metric: "runs that missed hidden tests whose own verification line said 'partial' (exploratory)"
    value: "11 of 29 with Spec Kit, none with no setup, the disciplined setup or research-plan-implement"
    n: "29 failing Spec Kit runs of 30"
    detail:
      - "the final message said done and passed, admitting nothing unfinished, in 27 of 29 failing runs with no setup, 28 of 28 disciplined, 29 of 29 research-plan-implement, 28 of 30 OpenSpec and 13 of 29 Spec Kit"
    limits:
      - "a mechanical rule on the final message: it measures what the agent said, not what it knew"
      - "exploratory, not pre-registered"
    source: "https://github.com/meabs/experiments/blob/121485546003956824fa7b3dcd959730cb2399f7/2026-11-spec-driven/REPORT.md"
    status: current
    featured: false
---

## Question

Spec Kit, OpenSpec and "research, plan, implement" are the most-adopted ways of giving a coding agent a process. Every guide I found for them was a directory, a vendor post or a README, and none measured an outcome. So I measured it on the hardest tickets I have: six real Shopizer bug reports with hidden, interacting causes, the same ones as [ELC](/experiments/evidence-led/).

I also wanted to know whether the advice to keep an AGENTS.md short holds up.

**This experiment was designed and run with an AI agent** (Claude Code, working for me): it drafted the design, wrote the long AGENTS.md and the prompt wording for the process arms, installed the two toolkits and ran the analysis. I chose the arms and approved the design and the run.

## Prediction

Written before the runs: [the design README](https://github.com/meabs/experiments/blob/121485546003956824fa7b3dcd959730cb2399f7/2026-11-spec-driven/README.md). Spec Kit, OpenSpec and research-plan-implement each pass more hidden tests than no setup (H1 to H3); none of them passes more than the disciplined setup (H4); the long AGENTS.md passes fewer than the short one (H5).

## Set-up

Six arms, five runs per ticket and arm, all with Codex CLI and gpt-5.6-luna at medium effort in a sandbox with no one to ask:

- **No setup:** Shopizer as it is.
- **Disciplined:** ELC's six AGENTS.md lines and three small skills, unchanged.
- **Long AGENTS.md:** the same six lines and skills plus about 125 lines of ordinary reference notes.
- **Research, plan, implement:** asked for in the prompt, with notes written to a folder.
- **Spec Kit:** its bug-fixing skills (assess, fix, test), run in order in automated mode.
- **OpenSpec:** its propose, apply and archive skills, run in order.

Spec Kit and OpenSpec are built around a person reviewing each step. A single turn has no one to review, so these arms test their files and procedure run end to end, not how a team would use them.

## Results

A process was followed every time: all 90 runs of the three process arms left the files that show it. It did not help. The three process arms matched no setup at best and trailed the six-line setup; the long file matched the short one. Spec Kit's summaries were the exception: they said what had not been checked far more often than the others.

PRODUCTDELETE is all or nothing, a run either finds the hidden cause or passes one test of eleven, and neither Spec Kit nor OpenSpec found it in any of its five runs. That ticket accounts for their gap to no setup, and it is five runs per cell.

## What this means in practice

I'd treat these as leads, not rules: one repository, one agent, five runs per ticket.

- On hard bug tickets, a short general checklist did better than a heavier process, at a similar cost per run.
- A spec toolkit did not find hidden causes. It may make the agent more candid about what it did not check, which is worth something, but it did not make the fix more correct.
- The length of an instruction file was not what mattered here.

## Limits

- Spec Kit and OpenSpec were run unattended in one turn. Their intended, human-reviewed use is not tested.
- Only Spec Kit's bug-fixing extension was used, not its feature flow.
- One repository, one agent (Codex CLI 0.157), one model at one effort, five runs per ticket and arm. "No measurable difference" is not "the same".
- The long AGENTS.md is one file, written by the agent.
- The tickets, hidden tests and the disciplined setup are ELC's, so that arm is a repeat on the same six tickets.
- Hidden tests measure these tickets' behaviour, not code quality.
- The run was stopped part-way when my hosted-model credits ran out and resumed. Runs in flight at the stop were run again from scratch; no finished run was discarded.
