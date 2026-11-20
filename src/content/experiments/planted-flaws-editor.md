---
title: "Does giving a team an editor stop sceptics stalling? (PLE)"
description: "The planted-flaw review repeated with one agent in every team given the job of writing the revision. The editor ended the stalls and did not help the other teams."
date: 2026-11-20T23:00:00+00:00
summary: "20 sessions. With an editor, no sceptic team stalled (all five agreed; none of 20 sessions failed to agree against 2 of 20 before) and sceptic teams left 0.4 of ten flaws against 4.0. The editor did not help the other teams, and the neutral team left more. Exploratory, cross-run comparison."
type: "Exploratory trial"
github:
  - label: "Data, code and 20 agreed documents on GitHub"
    href: "https://github.com/meabs/experiments/tree/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor"
guideLinks:
  - label: "Replay the 20 sessions"
    href: "/planted-flaws-editor/"
draft: false
experimentId: "PLE"
question: "If one agent in every team is given the job of writing the revision, do teams of sceptics stop stalling, and do teams leave fewer planted flaws in the document they approve?"
status: published
evidenceGrade: published
agents:
  - name: "Nine chat agents (A to I)"
    model: "gpt-5.6-luna through OpenRouter"
    settings: "as the planted-flaw review (PLF), plus a paragraph making Agent E the team's editor; two blind coders (gpt-6-luna and claude-haiku-5.5) judge the outcome"
runs: "20 sessions: 4 team types x 5, after a one-session smoke test; 39 to 124 messages each"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/README.md"
previewImage: "/guide-images/chart-ple-results.png"
previewAlt: "Flaws left in the agreed document out of 10, one dot per session, without and with an editor. No personality: 1.0 without, 2.0 with. Belbin roles: 0.8 without, 1.0 with. All sceptics: 4.0 without (two sessions at 10 that never agreed), 0.4 with. All agreeable: 2.2 without, 1.8 with."
topics:
  - verification
  - review
  - parallel
publishedOn: 2026-11-20
findings:
  - id: "PLE-1"
    statement: "With an editor, no team stalled: all 20 sessions reached agreement, and sceptic teams left almost no planted flaws"
    metric: "sessions ending with all nine agents approving; planted flaws, out of ten, left in the agreed document by sceptic teams"
    value: "20 of 20 sessions agreed (before: 18 of 20); sceptic teams left 0.4 flaws on average (before: 4.0)"
    n: "20 sessions, 5 per team type, against 20 without an editor"
    detail:
      - "all five sceptic sessions agreed (before: three of five); the two that stalled before had nine agents agree the draft was wrong and nobody write the revision"
      - "sceptic values with an editor 1, 0, 0, 0, 1 against 0, 10, 10, 0, 0; the difference in means is -3.6 flaws with a bootstrap interval of -7.8 to 0.4, which includes zero"
      - "exploratory; the comparison sessions were run earlier the same day, not interleaved"
    limits:
      - "five sessions per team type, one model, one draft with ten flaws I wrote and checked myself; the 'before' is a separate run"
    source: "https://github.com/meabs/experiments/blob/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/REPORT.md"
    status: current
    featured: false
  - id: "PLE-2"
    statement: "An editor did not help the other teams, and the team with no personality left more flaws with one than without"
    metric: "planted flaws, out of ten, still in the agreed document (primary blind coder; lower is better), with an editor against without"
    value: "no personality 2.0 against 1.0; Belbin roles 1.0 against 0.8; all agreeable 1.8 against 2.2"
    n: "5 sessions per team type per run"
    detail:
      - "for the no-personality team the difference is +1.0 flaws with a bootstrap interval of 0.2 to 1.8; for Belbin +0.2 (-0.4 to 0.8) and for agreeable -0.4 (-1.2 to 0.4)"
      - "the agreeable team's gap to the no-personality team closed because the neutral team got worse, not because the agreeable team improved (1.8 against 2.0)"
      - "the mean over all 20 sessions fell from 2.0 to 1.3, only because the sceptic stalls disappeared"
    limits:
      - "a cross-run comparison of five sessions per side; part or all of the neutral team's rise could be run-to-run variation"
    source: "https://github.com/meabs/experiments/blob/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/REPORT.md"
    status: current
    featured: false
  - id: "PLE-3"
    statement: "The editor wrote a bit more than half of the accepted revisions, and nothing in seven of 20 sessions, because the job was often decided by whose edit landed first"
    metric: "accepted document edits written by Agent E, out of all accepted edits after the draft"
    value: "24 of 41 (58%); Agent I (the draft's author) wrote 10, five other agents 7; no edit by E in 7 of 20 sessions"
    n: "41 accepted edits in 20 sessions"
    detail:
      - "compare-and-swap rejects an edit based on an older version, so when several agents post a revision at once the first one in wins"
      - "I predicted at least 70%; that prediction failed"
    limits:
      - "the job is a two-sentence prompt, and the agent keeps its team temperament"
    source: "https://github.com/meabs/experiments/blob/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/REPORT.md"
    status: current
    featured: false
  - id: "PLE-4"
    statement: "Sessions with an editor ran longer and cost more"
    metric: "messages per session and cost at list price for 20 sessions"
    value: "four sessions ended at 117 to 124 messages, close to the 120-message cap (before: longest 89); $4.03 against $2.78"
    n: "20 sessions against 20"
    detail:
      - "two coders agree on 99.0% of the 'found' and 96.5% of the 'fixed' judgements (200 flaw-by-session judgements each)"
    limits:
      - "a longer cap might have changed the four sessions that ended near it"
    source: "https://github.com/meabs/experiments/blob/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/REPORT.md"
    status: current
    featured: false
---

## Question

In [the planted-flaw review](/experiments/planted-flaws/), two of five teams of sceptics agreed that a draft design was wrong, agreed on every correction, and never wrote the revision, so ten flaws went through. I read that as "nobody owned the revision". This tests it: in every team, one agent has the job of writing the revision.

**The short answer:** the stalls went away, and nothing else improved. No team failed to agree, and sceptic teams left almost no flaws. The editor did not help the other teams, and the team with no personality left more flaws with one. The comparison is with the earlier run, not a concurrent control, so treat differences as leads.

**Watch it:** [open the replay board →](/planted-flaws-editor/) to play, pause or scrub through all 20 sessions, with the draft and every revision in the shared-document panel.

**This experiment was designed and run with an AI agent** (Claude Code, working for me): it wrote the design, the room changes, the analysis and the page. I asked for the follow-up and approved the spending. I have not independently reviewed the flaws or the agreed documents.

## Prediction

Written before the main run, in the [design](https://github.com/meabs/experiments/blob/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/README.md):

- **H1.** No sceptic session stalls, and sceptic teams leave at most 1 flaw on average. *Supported (0.4).*
- **H2.** Agreeable teams still leave at least 0.5 more than no-personality teams. *Not supported (1.8 against 2.0).*
- **H3.** At most 1 of 20 sessions ends without agreement. *Supported (0 of 20).*
- **H4.** The editor writes at least 70% of the accepted edits. *Not supported (58%).*
- **H5.** The mean flaws left over all teams is at most 1.5. *Supported (1.3), but only because the sceptic stalls disappeared.*

## Set-up

Everything is as in [the planted-flaw review](/experiments/planted-flaws/): nine `gpt-5.6-luna` agents in a room with a shared document that starts as a draft containing ten planted flaws; the task asks the team to agree a design so the build can start; Agent I wrote the draft and defends it; four team types (no personality, Belbin roles, all sceptics, all agreeable), five sessions each; two blind coders judge which flaws are found and which are left in the agreed document. The system prompts for the room rules, the team paragraphs, the author and the task are on [that page](/experiments/planted-flaws/#the-system-prompts) and unchanged here.

**The one change:** Agent E, in every session, has one more paragraph:

```text
You have been asked to be the team's editor. Your job is to write the revised document: once the team has said what needs changing, you post the complete revised document with those changes made, and you post a new version whenever more changes are agreed. You write the revision from what the team has said; you are not the one who decides what is wrong, and you are not the author of the draft.
```

Agent E also keeps its team paragraph (a sceptical or agreeable temperament, or a Belbin role).

**The comparison** is the earlier run's five sessions per team type. Those sessions were run earlier the same day with the same code, prompts and draft, not interleaved with these, and model output varies from run to run.

## Results

Findings PLE-1 to PLE-4 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-ple-results.png" alt="Flaws left in the agreed document out of 10, one dot per session, without and with an editor. No personality: 1.0 without, 2.0 with. Belbin roles: 0.8 without, 1.0 with. All sceptics: 4.0 without (two sessions at 10 that never agreed), 0.4 with. All agreeable: 2.2 without, 1.8 with." loading="lazy" />

<figcaption>The editor ended the stalls and did not help the other teams. Source: github.com/meabs/experiments, 2026-11-planted-flaws-editor.</figcaption>

</figure>

| Team | With an editor | Mean | No editor | Mean | Difference (95% interval) |
| --- | --- | --- | --- | --- | --- |
| No personality | 3, 2, 2, 2, 1 | 2.0 | 1, 1, 0, 2, 1 | 1.0 | +1.0 (0.2 to 1.8) |
| Belbin roles | 1, 2, 0, 1, 1 | 1.0 | 1, 1, 0, 1, 1 | 0.8 | +0.2 (-0.4 to 0.8) |
| All sceptics | 1, 0, 0, 0, 1 | 0.4 | 0, 10, 10, 0, 0 | 4.0 | -3.6 (-7.8 to 0.4) |
| All agreeable | 2, 1, 2, 2, 2 | 1.8 | 2, 3, 3, 1, 2 | 2.2 | -0.4 (-1.2 to 0.4) |

Found in discussion stayed at 8.6 to 9.8 of 10 in every team. False alarms were rare (0.2 to 1.0 a session). The 20 sessions cost $4.03 at list price, about $4.9 of OpenRouter credit including the coders.

## Reports and data

- **[Full report (REPORT.md)](https://github.com/meabs/experiments/blob/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/REPORT.md):** the prediction, what happened, what surprised me, limits and next steps.
- **[Design (README.md)](https://github.com/meabs/experiments/blob/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/README.md):** the frozen design with its amendment log.
- **[The editor prompt](https://github.com/meabs/experiments/tree/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/arms/editor.md)** and **[the 20 final documents](https://github.com/meabs/experiments/tree/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/results/docs).**
- **[Numbers (analysis.json)](https://github.com/meabs/experiments/blob/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/results/analysis.json)** and **[the full event log (events.sqlite)](https://github.com/meabs/experiments/blob/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/results/events.sqlite).**
- **[A 12-session sample](https://github.com/meabs/experiments/blob/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/results/coded_sample_for_hand_check.csv)** of the coder's flaw-by-flaw judgements, for checking by hand.
- **[Prompts, scripts and tests](https://github.com/meabs/experiments/tree/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor).**
- The experiment before this one: [the planted-flaw report](https://github.com/meabs/experiments/blob/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws/REPORT.md).

## Limits

- **One model, one draft, ten flaws, five sessions per team.** Everything is exploratory.
- **The comparison is cross-run and not randomised.** The neutral team's rise from 1.0 to 2.0 could be run-to-run variation.
- **The editor's job is a two-sentence prompt,** the agent keeps its team temperament, and compare-and-swap decides who actually writes: the editor often loses the race.
- **I wrote the flaws and checked each against my own knowledge of Google Cloud,** with no independent review; the two coders agree closely but could share a misreading, and a sample is published for checking by hand.
- **Four sessions ended close to the message cap,** which a longer cap might have changed.

## What this means: impact and risks

This part is my interpretation, not a measurement. I'd treat these as leads, not rules.

**If agents block on "someone must write the fix", an explicit editor is a cheap remedy.** It removed the deadlock in every sceptic team.

**It is not a general improvement.** Naming an editor did not make neutral or agreeable teams leave fewer flaws, and for the neutral team it may have shifted responsibility: with an editor named, fewer agents may have checked the revision themselves. I did not measure that.

**A revision is not a check.** Nobody was assigned to check the editor's work. That is what the next experiment adds.

## What would be worth testing next?

These are proposals, not results.

- **An editor plus an independent checker of the revision** (running now).
- **No editor, an editor and an editor with a checker in the same run,** to remove the cross-run caveat.
- **Varying who the editor is:** the author, a sceptic, a neutral agent.

## Reproduce

Everything is in [experiments/2026-11-planted-flaws-editor](https://github.com/meabs/experiments/tree/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor), with the full write-up in [REPORT.md](https://github.com/meabs/experiments/blob/82846c33f1ee8586223538880b4ec052a30a480f/2026-11-planted-flaws-editor/REPORT.md). `python3 -I scripts/board.py` replays the sessions locally.
