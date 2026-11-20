---
title: "Does giving AI agents Belbin team-role personalities change the design they write? (BLB)"
description: "Nine agents given the nine Belbin team roles as system prompts, against nine identical agents, writing a highly available GKE design on a shared board. The roles barely showed."
date: 2026-11-20T15:00:00+00:00
summary: "Four sessions. A blind coder named the assigned role for 2 of 14 Belbin agents (chance is 1.6); the roles read as one technical voice. Belbin rooms challenged more and ran a little longer; every design scored 23 of 24. Exploratory."
type: "Exploratory case study"
github:
  - label: "Data, code and agreed documents on GitHub"
    href: "https://github.com/meabs/experiments/tree/fbaf3575a534bfbdddf5dd23b4c36ea89b8a374c/2026-11-belbin-gke"
guideLinks:
  - label: "Replay the sessions"
    href: "/belbin-gke/"
draft: false
experimentId: "BLB"
question: "If each agent in a team is given a Belbin team role as its personality, do the roles show in how they talk, in how the team works, and in the design document they write?"
status: published
evidenceGrade: published
agents:
  - name: "Nine chat agents (A to I)"
    model: "gpt-5.6-luna through OpenRouter"
    settings: "low reasoning effort, temperature 1.0; one shared document with compare-and-swap edits; no memory between sessions; BELBIN agents get one role paragraph each, CONTROL agents none"
runs: "4 sessions: 2 with Belbin roles, 2 without; 34 to 45 messages each, plus a 30-message pilot"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/fbaf3575a534bfbdddf5dd23b4c36ea89b8a374c/2026-11-belbin-gke/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/fbaf3575a534bfbdddf5dd23b4c36ea89b8a374c/2026-11-belbin-gke/README.md"
previewImage: "/guide-images/chart-blb-roles.png"
previewAlt: "Which Belbin role a blind coder gave to each agent. Belbin-role agents: Completer Finisher 7, Specialist 4, Monitor Evaluator 2, Implementer 1; the coder was right for 2 of 14. Agents with no roles: Specialist 6, Implementer 1, Shaper 1, Co-ordinator 1."
topics:
  - parallel
  - harness
publishedOn: 2026-11-20
findings:
  - id: "BLB-1"
    statement: "Giving nine agents the nine Belbin roles as personalities did not make the roles recognisable: a blind coder named the assigned role for 2 of 14 agents"
    metric: "agents whose assigned Belbin role a blind coder (a different model) named from their messages, out of those with at least two substantive messages"
    value: "2 of 14 (14%); chance is 1.6 of 14 (11%)"
    n: "14 Belbin agents in 2 sessions; 9 agents with no role as comparison"
    detail:
      - "the coder called the Belbin agents Completer Finisher (7), Specialist (4), Monitor Evaluator (2) and Implementer (1); the nine agents with no role at all were called Specialist 6 times"
      - "exploratory: the coder saw each agent's few substantive messages (2 to about 6, not the 12 planned), with names removed"
    limits:
      - "four sessions, one model, one task with a clear technical right answer, which pulls every agent into the same register"
      - "the coder is another model and not hand-checked; a 40-message sample is in the repository"
    source: "https://github.com/meabs/experiments/blob/fbaf3575a534bfbdddf5dd23b4c36ea89b8a374c/2026-11-belbin-gke/REPORT.md"
    status: current
    featured: false
  - id: "BLB-2"
    statement: "Rooms with Belbin roles challenged more and used more messages than rooms without, in both repetitions, but each condition has only two sessions"
    metric: "messages until all nine agreed, and share of messages a blind coder labelled 'challenge'"
    value: "Belbin: 41 and 45 messages, 10% and 23% challenge; no roles: 34 and 35 messages, 0% and 6%"
    n: "4 sessions, 2 per condition"
    detail:
      - "session 3 (Belbin, roles reversed across the letters) was the only one to produce a second version of the document"
      - "rejected edits were 4 and 11 in the Belbin rooms and 6 and 6 in the others, so that comparison is within the range"
      - "exploratory, a lead rather than a result"
    limits:
      - "two sessions per cell; the difference between the two Belbin sessions (10% against 23%) is as large as the difference between conditions"
    source: "https://github.com/meabs/experiments/blob/fbaf3575a534bfbdddf5dd23b4c36ea89b8a374c/2026-11-belbin-gke/REPORT.md"
    status: current
    featured: false
  - id: "BLB-3"
    statement: "All four design documents scored 23 of 24 on a coverage checklist, so the checklist could not show any difference in design quality"
    metric: "blind coder's score against a 12-item checklist fixed beforehand (0 absent, 1 generic, 2 specific), per document"
    value: "23, 23, 23 and 23 of 24"
    n: "4 documents"
    detail:
      - "every document lost the same single point, on upgrades and maintenance"
      - "the coder also listed 3 to 4 doubtful claims per document (for example that Cloud NAT is zonal, or that automatic rollback on an SLO breach is built in); these are unscored and not verified by a person"
    limits:
      - "the checklist measures coverage and specificity, not correctness; a confident wrong design scores well. A platform engineer should read the four documents before anyone builds from them"
    source: "https://github.com/meabs/experiments/blob/fbaf3575a534bfbdddf5dd23b4c36ea89b8a374c/2026-11-belbin-gke/REPORT.md"
    status: current
    featured: false
  - id: "BLB-4"
    statement: "Agreement came cheaply: nine agents approved the first version in three of four sessions, including one where several of them had asked for changes that nobody made"
    metric: "document versions before all nine agents agreed, and edits rejected because the document had moved on"
    value: "versions 1, 1, 2 and 1; rejected edits 4, 6, 11 and 6"
    n: "4 sessions"
    detail:
      - "in session 1 several agents asked for the surviving-zone capacity checks to be added to the document and kept approving without anyone posting a revision"
      - "at the start every agent tried to post a draft; the compare-and-swap rule rejected the later ones"
    limits:
      - "the compare-and-swap rule changes how agents edit; the earlier emergent-room experiment had no such rule and its agents overwrote each other"
    source: "https://github.com/meabs/experiments/blob/fbaf3575a534bfbdddf5dd23b4c36ea89b8a374c/2026-11-belbin-gke/REPORT.md"
    status: current
    featured: false
---

## Question

If each agent in a team is given a Belbin team role as its personality, does the role show in how they talk, in how the team works, and in the design document they write?

**The short answer:** barely. A blind coder could not tell the roles apart (2 of 14 correct, against 1.6 by chance), the rooms with roles challenged a little more and took a few more messages, and every design scored the same on a coverage checklist. The task, a highly available GKE design, pulled every agent into one careful, technical voice.

**Watch it:** [open the replay board →](/belbin-gke/) to play, pause or scrub through all four sessions, with the roles, the shared document and the notices when an edit was rejected.

**This experiment was designed and run with an AI agent** (Claude Code, working for me): it wrote the design, the room, the analysis and the page. I asked for the experiment, chose the Belbin roles and the GKE task, and approved the spending.

## Prediction

Written before the runs, in the [design](https://github.com/meabs/experiments/blob/fbaf3575a534bfbdddf5dd23b4c36ea89b8a374c/2026-11-belbin-gke/README.md):

- **H1.** The roles are recognisable: a blind coder names the assigned role for at least a third of the agents, against one in nine by chance. *My prediction: yes.*
- **H2.** Belbin rooms do not write a more complete design than rooms without roles.
- **H3.** Belbin rooms challenge more and take more messages to agree.

I was wrong about H1.

## Set-up

Nine agents, A to I, all `gpt-5.6-luna` through OpenRouter, in one chat room with one shared document. The task asked for a detailed design for a highly available GKE platform: a customer-facing web app, 99.95% availability, about 5,000 requests a second, surviving the loss of a zone unattended, and a rehearsed recovery from the loss of a region. Any agent can post a message or stay silent, and nobody decides who speaks. A message starting `DOC:` replaces the document, but only if it was based on the current version; otherwise it is rejected and the room is told. `AGREE vN` approves a version, and the session ends when all nine have approved the same one.

| Condition | System prompt |
| --- | --- |
| Belbin roles | the shared room rules plus one paragraph per agent, built from [Belbin's page](https://www.belbin.com/about/belbin-team-roles): the role, its short description, its strengths and its allowable weaknesses, ending "work as yourself in this role; you are not told what to say" |
| No roles | the same shared room rules, nothing else |

Two sessions per condition, interleaved; in the second Belbin session the roles are assigned to the letters in reverse order, so a letter is not tied to a role. The personalities are only text in the system prompt. Nothing scripts who speaks or what they say.

## Results

Findings BLB-1 to BLB-4 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-blb-roles.png" alt="Which Belbin role a blind coder gave to each agent. Belbin-role agents: Completer Finisher 7, Specialist 4, Monitor Evaluator 2, Implementer 1; the coder was right for 2 of 14. Agents with no roles: Specialist 6, Implementer 1, Shaper 1, Co-ordinator 1." loading="lazy" />

<figcaption>Nine different personality prompts read as about two. Source: github.com/meabs/experiments, 2026-11-belbin-gke.</figcaption>

</figure>

<figure class="guide-figure">

<img src="/guide-images/chart-blb-sessions.png" alt="Messages until all nine agents agreed: Belbin session 1, 41; no roles session 2, 34; Belbin reversed session 3, 45; no roles session 4, 35. Share of messages coded as challenge: 10%, 0%, 23% and 6%." loading="lazy" />

<figcaption>Rooms with Belbin roles challenged more and ran longer, in both repetitions, with two sessions each.</figcaption>

</figure>

### The four documents

Each session ended with a design of 1,100 to 1,400 words that all nine agents approved. They share a design: a regional GKE Standard cluster over three zones, managed regional data services, a global load balancer, a warm second region for recovery, and stated recovery objectives. The agents also wrote near-identical messages asking for the same paragraph to be revised, which nobody did. The four documents and the messages are in the [repository](https://github.com/meabs/experiments/blob/fbaf3575a534bfbdddf5dd23b4c36ea89b8a374c/2026-11-belbin-gke) and in the replay board.

## Limits

- **Four sessions, one model, one task.** Everything is exploratory.
- **The checklist is at the ceiling** (23 of 24 everywhere) and measures coverage, not correctness. Nobody has reviewed the documents for technical errors; the coder's doubtful claims are unverified.
- **The coder is another model,** not hand-checked, and saw only 2 to about 6 substantive messages per agent, not the 12 planned (a change I made after the run and logged).
- **A Belbin paragraph is a thin version of a role.** Belbin's own page says people can play more than one.
- **The compare-and-swap rule changes how the agents edit.** There is no memory between sessions.
- **The first scoring pass of one checklist failed and I reran it,** and the role-recognition threshold was changed after seeing the run; both are in the amendment log.

## What this means: impact and risks

This part is my interpretation, not a measurement. I'd treat these as leads, not rules.

**A paragraph of temperament did not make a team of different voices.** On a task with a clear technical right answer, the agents wrote like careful specialists whatever they were told to be.

**A role that comes with a different job would probably do more than a temperament.** "Own the failure analysis" changes what an agent writes; "be creative" mostly does not.

**Risk: agreement is cheap.** Nine approvals did not mean nine reviews. A team of agents that agrees to version 1 while asking for changes has not reviewed it. If you rely on approval from agents, require a revision pass, or count a requested change as blocking.

## What would be worth testing next?

These are proposals, not results.

- **Roles with different responsibilities,** not only different temperaments.
- **A revision rule:** approval counts only after a revision pass, or after open requests are closed.
- **A contested design task,** so the checklist does not saturate, and a platform engineer rating the documents blind to the condition.
- **Two forceful agents** in the room, which is the next experiment.

## Reproduce

Everything is in [experiments/2026-11-belbin-gke](https://github.com/meabs/experiments/tree/fbaf3575a534bfbdddf5dd23b4c36ea89b8a374c/2026-11-belbin-gke), with the full write-up in [REPORT.md](https://github.com/meabs/experiments/blob/fbaf3575a534bfbdddf5dd23b4c36ea89b8a374c/2026-11-belbin-gke/REPORT.md). The event log, the four agreed documents, the analysis and the board are in the folder; `python3 -I scripts/board.py` replays the sessions locally. It cost about $0.55 of OpenRouter credit.
