---
title: "Does an editor plus a checker leave fewer flaws? (PLC)"
description: "The planted-flaw review with one agent writing the revision and one checking each revision. The checker brought the neutral team's flaws back down; agreeable teams still left the most."
date: 2026-11-21T01:00:00+00:00
summary: "20 sessions. An editor plus a checker left the fewest planted flaws of three set-ups (0.95 of ten across all teams, against 1.3 with an editor alone and 2.0 with neither), reversing the neutral team's rise. Agreeable teams still left the most, and two sessions never agreed. Exploratory, cross-run comparison."
type: "Exploratory trial"
github:
  - label: "Data, code and 20 agreed documents on GitHub"
    href: "https://github.com/meabs/experiments/tree/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker"
guideLinks:
  - label: "Replay the 20 sessions"
    href: "/planted-flaws-checker/"
draft: false
experimentId: "PLC"
question: "If one agent writes the revision and another is given the job of checking each revision, do teams leave fewer of ten planted flaws in the document they approve than with an editor alone?"
status: published
evidenceGrade: published
agents:
  - name: "Nine chat agents (A to I)"
    model: "gpt-5.6-luna through OpenRouter"
    settings: "as the planted-flaw review (PLF) and editor experiment (PLE), plus a paragraph making Agent C the team's checker; two blind coders (gpt-6-luna and claude-haiku-5.5) judge the outcome"
runs: "20 sessions: 4 team types x 5, after a one-session smoke test; 45 to 124 messages each"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/README.md"
previewImage: "/guide-images/chart-plc-results.png"
previewAlt: "Flaws left in the agreed document out of 10, one dot per session, for three set-ups. No personality: 1.0 neither, 2.0 editor, 0.8 editor and checker. Belbin roles: 0.8, 1.0, 1.2. All sceptics: 4.0, 0.4, 0.4. All agreeable: 2.2, 1.8, 1.4."
topics:
  - verification
  - review
  - parallel
publishedOn: 2026-11-21
findings:
  - id: "PLC-1"
    statement: "A checker reversed the rise that an editor alone caused in the team with no personality"
    metric: "planted flaws, out of ten, left in the agreed document (primary blind coder; lower is better), no-personality team"
    value: "0.8 with an editor and a checker, against 2.0 with an editor alone and 1.0 with neither"
    n: "5 sessions per set-up"
    detail:
      - "difference from the editor-only run -1.2 flaws, bootstrap 95% interval -1.8 to -0.6; from neither -0.2 (-0.8 to 0.4)"
      - "exploratory; the other runs were done earlier the same day, not interleaved"
    limits:
      - "five sessions per cell, one model; the neutral team's mean went 1.0, 2.0, 0.8 across the three runs, which shows how large run-to-run variation can be"
    source: "https://github.com/meabs/experiments/blob/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/REPORT.md"
    status: current
    featured: false
  - id: "PLC-2"
    statement: "Across all teams the editor and checker left the fewest flaws of the three set-ups, though not as few as I predicted"
    metric: "mean planted flaws, out of ten, left in the agreed (or last) document over all 20 sessions"
    value: "0.95 with an editor and a checker; 1.3 with an editor alone; 2.0 with neither"
    n: "20 sessions per set-up"
    detail:
      - "I predicted at most 0.8; that prediction narrowly failed"
      - "sceptic teams left 0.4 (the same as with an editor alone), Belbin 1.2 (1.0), agreeable 1.4 (1.8); only the neutral team's change is clearly outside noise"
    limits:
      - "cross-run comparisons, not randomised; two coders agree on 99.5% of 'found' and 94.5% of 'fixed' judgements but differ more on the sceptic and agreeable teams (the second coder gives 1.0 and 2.4)"
    source: "https://github.com/meabs/experiments/blob/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/REPORT.md"
    status: current
    featured: false
  - id: "PLC-3"
    statement: "Agreeable teams still left the most flaws, whatever jobs were assigned"
    metric: "planted flaws, out of ten, left in the agreed document by the agreeable team against the no-personality team, with an editor and a checker"
    value: "1.4 against 0.8 (the second coder: 2.4 against 1.0)"
    n: "5 sessions per team"
    detail:
      - "the same ordering as with neither (2.2 against 1.0) and the editor alone (1.8 against 2.0, where the neutral team had got worse)"
    limits:
      - "exploratory, five sessions per cell; a temperament that avoids confrontation did not change when the team was given an editor and a checker"
    source: "https://github.com/meabs/experiments/blob/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/REPORT.md"
    status: current
    featured: false
  - id: "PLC-4"
    statement: "The checker made sessions longer, and two of 20 ended at the message cap without anyone agreeing"
    metric: "median messages per session; sessions reaching unanimous approval; cost at list price"
    value: "median 86.5 messages (editor alone 64); 18 of 20 agreed; $5.41 (editor alone $4.03)"
    n: "20 sessions per set-up"
    detail:
      - "the two sessions that hit the 120-message cap were a sceptic team and a Belbin team; their last versions left 0 and 1 flaws"
      - "the checker wrote 5 to 18 messages a session; sceptic teams had the longest sessions and the most rejected edits"
    limits:
      - "a longer cap might have changed those two sessions"
    source: "https://github.com/meabs/experiments/blob/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/REPORT.md"
    status: current
    featured: false
---

## Question

[The editor experiment](/experiments/planted-flaws-editor/) named one agent to write the revision. Nobody was assigned to check it, and the team with no personality left more flaws than without an editor. If one more agent is given the job of checking each revision, do teams leave fewer of the ten planted flaws in what they approve?

**The short answer:** somewhat. An editor and a checker together left the fewest flaws of the three set-ups tried (0.95 of ten over all teams), and they reversed the neutral team's rise. But agreeable teams still left the most, two sessions never reached agreement, and the sessions were longer and cost more. This is an exploratory trial of 20 sessions compared with two earlier runs, not with a concurrent control.

**Watch it:** [open the replay board →](/planted-flaws-checker/) to play, pause or scrub through all 20 sessions, with the draft and every revision in the shared-document panel.

**This experiment was designed and run with an AI agent** (Claude Code, working for me): it wrote the design, the room changes, the analysis and the page. I asked for the follow-up and approved the spending. I have not independently reviewed the flaws or the agreed documents.

## Prediction

Written before the main run, in the [design](https://github.com/meabs/experiments/blob/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/README.md):

- **H1.** The mean flaws left over all 20 sessions is at most 0.8. *Not supported (0.95).*
- **H2.** The neutral team leaves at most 1.2 flaws. *Supported (0.8).*
- **H3.** At least 19 of 20 sessions reach agreement. *Not supported (18 of 20).*
- **H4.** Sessions are longer: the median is at least 10 messages above the editor-only run's. *Supported (86.5 against 64).*
- **H5.** False alarms do not rise: at most 1 a session on average in every team type. *Not supported (Belbin 1.2).*

## Set-up

Everything is as in [the planted-flaw review](/experiments/planted-flaws/) and [the editor experiment](/experiments/planted-flaws-editor/): nine `gpt-5.6-luna` agents in a room with a shared document that starts as a draft containing ten planted flaws; the task asks the team to agree a design so the build can start; Agent I wrote the draft and defends it; Agent E is the editor; four team types (no personality, Belbin roles, all sceptics, all agreeable), five sessions each; two blind coders judge which flaws are found and which are left in the agreed document. The system prompts for the room rules, the team paragraphs, the author and the task are on [the planted-flaw page](/experiments/planted-flaws/#the-system-prompts) and unchanged here.

**The two job paragraphs** (Agent E and Agent C, in every session; each agent also keeps its team paragraph):

**Editor (Agent E)**

```text
You have been asked to be the team's editor. Your job is to write the revised document: once the team has said what needs changing, you post the complete revised document with those changes made, and you post a new version whenever more changes are agreed. You write the revision from what the team has said; you are not the one who decides what is wrong, and you are not the author of the draft.
```

**Checker (Agent C), the new one**

```text
You have been asked to be the team's checker. Whenever a new version of the document is posted, you check it, against what the team said needed changing and against what you know, and you say which problems it fixes, which remain and which it introduces, before anyone approves. You do not write the revision. You approve a version only when you have checked it and know of no remaining problem.
```

**The comparison** is the earlier two runs: neither job (the planted-flaw review) and the editor alone. They were done earlier the same day with the same code, prompts and draft, one after another, not interleaved with these sessions, and model output varies from run to run.

## Results

Findings PLC-1 to PLC-4 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-plc-results.png" alt="Flaws left in the agreed document out of 10, one dot per session, for three set-ups. No personality: 1.0 neither, 2.0 editor, 0.8 editor and checker. Belbin roles: 0.8, 1.0, 1.2. All sceptics: 4.0, 0.4, 0.4. All agreeable: 2.2, 1.8, 1.4." loading="lazy" />

<figcaption>The checker brought the neutral team back down; sceptic teams stayed low; agreeable teams still left the most. Source: github.com/meabs/experiments, 2026-11-planted-flaws-checker.</figcaption>

</figure>

| Team | Editor and checker | Mean | Editor only | Mean | Neither | Mean |
| --- | --- | --- | --- | --- | --- | --- |
| No personality | 1, 1, 0, 1, 1 | 0.8 | 3, 2, 2, 2, 1 | 2.0 | 1, 1, 0, 2, 1 | 1.0 |
| Belbin roles | 0, 1, 1, 3, 1 | 1.2 | 1, 2, 0, 1, 1 | 1.0 | 1, 1, 0, 1, 1 | 0.8 |
| All sceptics | 1, 1, 0, 0, 0 | 0.4 | 1, 0, 0, 0, 1 | 0.4 | 0, 10, 10, 0, 0 | 4.0 |
| All agreeable | 2, 2, 1, 1, 1 | 1.4 | 2, 1, 2, 2, 2 | 1.8 | 2, 3, 3, 1, 2 | 2.2 |
| **All teams** | | **0.95** | | **1.3** | | **2.0** |

Agent E wrote 32 of the 51 accepted edits (63%). Found in discussion was 8.6 to 9.6 of 10 in every team. The 20 sessions cost $5.41 at list price (the editor experiment $4.03, the first $2.78); about $6.7 of OpenRouter credit including the coders.

## Reports and data

- **[Full report (REPORT.md)](https://github.com/meabs/experiments/blob/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/REPORT.md):** the prediction, what happened, what surprised me, limits and next steps.
- **[Design (README.md)](https://github.com/meabs/experiments/blob/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/README.md):** the frozen design with its amendment log, including a correction to a median I quoted wrongly.
- **[The checker prompt](https://github.com/meabs/experiments/tree/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/arms/checker.md)** and **[the 20 final documents](https://github.com/meabs/experiments/tree/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/results/docs).**
- **[Numbers (analysis.json)](https://github.com/meabs/experiments/blob/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/results/analysis.json)** and **[the full event log (events.sqlite)](https://github.com/meabs/experiments/blob/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/results/events.sqlite).**
- **[A 12-session sample](https://github.com/meabs/experiments/blob/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/results/coded_sample_for_hand_check.csv)** of the coder's flaw-by-flaw judgements, for checking by hand.
- **[Prompts, scripts and tests](https://github.com/meabs/experiments/tree/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker).**

## Limits

- **One model, one draft, ten flaws, five sessions per team.** Everything is exploratory.
- **The comparisons are cross-run and not randomised.** The neutral team's mean was 1.0, 2.0 and 0.8 across the three runs; a difference of that size can be run-to-run variation.
- **The two coders disagree more here** (94.5% on "fixed"): the second coder gives higher flaws-left for the sceptic and agreeable teams. A sample is published for checking by hand.
- **I wrote the flaws and checked each against my own knowledge of Google Cloud,** with no independent review.
- **Two sessions hit the cap without agreement;** a longer cap might have changed them. The job prompts are short and the agents keep their team temperaments.

## What this means: impact and risks

This part is my interpretation, not a measurement. I'd treat these as leads, not rules.

**An editor fixes a deadlock; a checker keeps an editor honest.** Together they gave the lowest flaws left of the three set-ups, at the price of longer sessions and sometimes no agreement within a cap.

**A temperament that avoids confrontation is not repaired by assigning jobs.** Agreeable teams left the most flaws in all three set-ups.

**Risk: extra roles add rounds.** The checker added about a third more messages, and two teams never closed. If agents run to a message or cost budget, a checker can run out of room before the team agrees.

## What would be worth testing next?

These are proposals, not results.

- **All three set-ups in the same run, interleaved,** to remove the cross-run caveat.
- **Varying who the checker is:** a sceptic, a neutral agent, or the author's critic.
- **A platform engineer rating the final documents blind to the team,** and a larger set of harder flaws.

## Reproduce

Everything is in [experiments/2026-11-planted-flaws-checker](https://github.com/meabs/experiments/tree/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker), with the full write-up in [REPORT.md](https://github.com/meabs/experiments/blob/d32157612262e40ca09d32616c45bd25418ee594/2026-11-planted-flaws-checker/REPORT.md). `python3 -I scripts/board.py` replays the sessions locally.
