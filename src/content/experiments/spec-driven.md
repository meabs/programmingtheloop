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
previewImage: "/guide-images/chart-sdd-process.png"
previewAlt: "Share of hidden tests passed, mean over six tickets, higher is better: no setup 42.3%, six-line disciplined setup 53.5%, long AGENTS.md 52.8%, research-plan-implement 42.6%, Spec Kit 40.7%, OpenSpec 38.2%. Cost per hidden test passed, lower is better: no setup $0.013, disciplined $0.019, research-plan-implement $0.020, Spec Kit $0.023, OpenSpec $0.026."
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

Spec Kit, OpenSpec and "research, plan, implement" are the most-adopted ways of giving a coding agent a process. Every guide I found for them was a directory, a vendor post or a README, and none measured an outcome. I wanted to know:

- whether any of them makes a coding agent pass more hidden tests on hard bug reports than no setup at all;
- whether a heavier process beats a short, general checklist;
- whether the advice to keep an AGENTS.md short holds up.

I measured it on the hardest tickets I have: six real Shopizer bug reports with hidden, interacting causes, the same ones as [ELC](/experiments/evidence-led/).

**The short answer:** none of the three process setups beat no setup, and all three trailed the six-line disciplined setup. A 134-line AGENTS.md did as well as the short one. Spec Kit's agent was more candid about what it hadn't checked, but no more correct.

**This experiment was designed and run with an AI agent** (Claude Code, working for me): it drafted the design, wrote the long AGENTS.md and the prompt wording for the process arms, installed the two toolkits and ran the analysis. I chose the arms and approved the design and the run.

## Prediction

Before the runs, I published the design and five hypotheses ([README.md](https://github.com/meabs/experiments/blob/121485546003956824fa7b3dcd959730cb2399f7/2026-11-spec-driven/README.md)):

- **H1.** Spec Kit passes more hidden tests than no setup.
- **H2.** OpenSpec passes more than no setup.
- **H3.** Research-plan-implement passes more than no setup.
- **H4.** None of the three passes more than the disciplined setup.
- **H5.** The long AGENTS.md passes fewer than the short one.

## Set-up

**The agent:** Codex CLI 0.157 with hosted `gpt-5.6-luna` at medium effort, one turn per run, no one to ask, in a bubblewrap sandbox. Spec Kit 1.4.2 and OpenSpec 2.1.0 ran unattended.

**The tickets:** six real Shopizer bug reports with hidden, interacting causes, the same tickets, hidden tests and disciplined setup as ELC.

**Six arms, differing only in files and prompt:**

| Setup | What the repository or prompt adds |
| --- | --- |
| No setup | Shopizer as it is |
| Disciplined | ELC's six `AGENTS.md` lines and three small skills, unchanged |
| Long AGENTS.md | The same six lines and skills plus about 125 lines of ordinary reference notes |
| Research, plan, implement | Asked for in the prompt, with notes written to a folder |
| Spec Kit | Its bug-fixing skills (assess, fix, test), run in order in automated mode |
| OpenSpec | Its propose, apply and archive skills, run in order |

Spec Kit and OpenSpec are built around a person reviewing each step. A single turn has no one to review, so these arms test their files and procedure run end to end, not how a team would use them.

**Scoring:**
- After each run, a grader runs the hidden acceptance tests for that ticket.
- The score is the share of those tests passed, with each ticket counted equally.
- **Higher is better.**

5 runs per ticket and arm: 180 runs, after a one-ticket pilot of every arm.

## Results

Findings SDD-1 to SDD-6 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-sdd-process.png" alt="Share of hidden tests passed, mean over six tickets, higher is better: no setup 42.3%, six-line disciplined setup 53.5%, long AGENTS.md 52.8%, research-plan-implement 42.6%, Spec Kit 40.7%, OpenSpec 38.2%. Cost per hidden test passed, lower is better: no setup $0.013, disciplined $0.019, research-plan-implement $0.020, Spec Kit $0.023, OpenSpec $0.026." width="1800" height="920" loading="lazy" />

<figcaption>The three process setups did no better than no setup, and cost more per hidden test passed. The six-line setup did best. Source: github.com/meabs/experiments, 2026-11-spec-driven (Codex 0.157, gpt-5.6-luna, medium effort).</figcaption>

</figure>

A process was followed every time: all 90 runs of the three process arms left the files that show it. It did not help.

### Passes by setup

Each cell is the mean share of hidden tests passed per run, each ticket counted equally (higher is better).

| Setup | Hidden tests passed | Cost per hidden test passed |
| --- | --- | --- |
| No setup | 42.3% | $0.013 |
| Disciplined | 53.5% | $0.019 |
| Long AGENTS.md | 52.8% | not reported |
| Research, plan, implement | 42.6% | $0.020 |
| Spec Kit | 40.7% | $0.023 |
| OpenSpec | 38.2% | $0.026 |

Costs are estimates at list prices.

### Hypotheses

| # | Comparison | Result | Reading |
| --- | --- | --- | --- |
| H1 | Spec Kit − no setup | −1.6 points (−11.3 to +8.0), Holm p 1.00 | no measurable difference |
| H2 | OpenSpec − no setup | −4.2 points (−14.9 to +5.8), Holm p 1.00 | no measurable difference |
| H3 | research-plan-implement − no setup | +0.3 points (−10.7 to +11.1), Holm p 1.00 | no measurable difference |
| H4 | each process arm vs the disciplined setup | Spec Kit −12.8 (−21.3 to −3.6), OpenSpec −15.3, research-plan-implement −10.9 | none beat it; "worse than" is exploratory |
| H5 | long AGENTS.md − short | −0.7 points (−10.7 to +9.6), one-sided p 0.45 | not supported |

- **The difference** is in percentage points of hidden tests passed, averaged over the six tickets, with a 95% interval within ticket.
- **The Holm p** is the chance of a difference this large if there were really none, corrected for testing three hypotheses. Below 0.05 counts as measurable.
- **"No measurable difference"** means the test couldn't tell the setups apart, not that they're equal.
- **Against no setup,** the disciplined and long files were each about 10 points ahead (exploratory: +11.1 and +10.4, Holm p 0.065 for both), which is not clearly different from no setup after correction.

### Where the failures were

- **PRODUCTDELETE is all or nothing:** a run either finds the hidden cause or passes one test of eleven. Spec Kit found it in 0 of 5 runs against 2 of 5 with no setup, and OpenSpec found it in none of its five. That ticket accounts for their gap to no setup, and it is five runs per cell. Without it, Spec Kit is about 5 points ahead, still within noise.
- **SUPPORTORDERS:** OpenSpec passed 53% against 70% for every other arm except research-plan-implement.
- **Few runs passed everything:** 1 of 30 with Spec Kit and 1 of 30 with no setup; 0 of 30 with OpenSpec.

### Cost

Every setup roughly doubled the tokens: about 1.9 million per run with no setup against 3.1 to 3.7 million with the others. OpenSpec's changes were the largest, 11.6 files per run on average against 5.9 with no setup. At list prices, a hidden test passed cost $0.013 with no setup and $0.019 to $0.026 with the others.

### What the agent said about its own work

Among runs that missed hidden tests, the final message said the work was done and passed, admitting nothing unfinished, in 27 of 29 with no setup, 28 of 28 disciplined, 29 of 29 research-plan-implement, 28 of 30 OpenSpec and 13 of 29 Spec Kit. Spec Kit's agent said "partial" in 11 of its 29 failing runs; none of the no-setup, disciplined or research-plan-implement runs did. It was more candid, not more correct. This is exploratory and a mechanical rule on the final message: it measures what the agent said, not what it knew.

## Limits

- **Spec Kit and OpenSpec were run unattended in one turn.** Their intended, human-reviewed use is not tested.
- **Only Spec Kit's bug-fixing extension was used,** not its feature flow.
- **The scope is narrow:** one repository, one agent (Codex CLI 0.157), one model at one effort, five runs per ticket and arm. "No measurable difference" is not "the same".
- **The long AGENTS.md is one file,** written by the agent.
- **The disciplined arm is a repeat.** The tickets, hidden tests and setup are ELC's, so it is not an independent set.
- **Hidden tests measure these tickets' behaviour,** not code quality.
- **The run was interrupted.** It stopped part-way when my hosted-model credits ran out and resumed. Runs in flight at the stop were run again from scratch; no finished run was discarded.

## What this means: impact and risks

This part is my interpretation, not a measurement. I'd treat these as leads, not rules.

**A short general checklist did better than a heavier process.** On hard bug tickets, the six-line setup passed more hidden tests than any of the three processes, at a lower cost per test passed.

**A spec toolkit did not find hidden causes.** It made the agent more candid about what it hadn't checked, which is worth something, but it did not make the fix more correct.

**The length of an instruction file was not what mattered here.** The 134-line file did as well as the six-line one.

**Risk: a process can make the agent look more diligent than it is.** All 90 process runs left the files that show the process, and the results didn't change. Check the outcome, not the paperwork.

## What would be worth testing next?

These are proposals, not results.

- **The toolkits as designed:** with a person reviewing each step, instead of one unattended turn.
- **Spec Kit's feature flow,** on feature work rather than bug fixing, where a spec may matter more.
- **Another repository, or easier tickets,** where the hidden cause isn't the whole difference.
- **Why Spec Kit's agent said "partial":** does that candour help a reviewer catch the gap?

## Reproduce

Everything is in [experiments/2026-11-spec-driven](https://github.com/meabs/experiments/tree/121485546003956824fa7b3dcd959730cb2399f7/2026-11-spec-driven), with the full write-up in [REPORT.md](https://github.com/meabs/experiments/blob/121485546003956824fa7b3dcd959730cb2399f7/2026-11-spec-driven/REPORT.md).
