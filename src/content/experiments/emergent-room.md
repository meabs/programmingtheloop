---
title: "Do AI agents left to talk develop their own styles, or is it the model? (EMR)"
description: "Three agents in a chat room with no assigned roles and their own memory notes, over five sessions, with a model swap between two of them. The differences I saw were the models', not the agents'."
date: 2026-11-20T09:00:00+00:00
summary: "Six sessions, 286 messages in the first five. Two agents on the same model were indistinguishable by their words; after two agents swapped models, style and challenging moved with the model, not with the agent's memory. Exploratory."
type: "Exploratory case study"
github:
  - label: "Data, code and replay board on GitHub"
    href: "https://github.com/meabs/experiments/tree/b0f032fff2b3ac7f9f83736d926aebd607b6c429/2026-11-emergent-room"
guideLinks:
  - label: "Replay the sessions"
    href: "/emergent-room/"
draft: false
experimentId: "EMR"
question: "When AI agents talk repeatedly without assigned personalities and keep their own memory notes, do they become distinguishable, and is that the agent, the model or the turn order?"
status: published
evidenceGrade: published
agents:
  - name: "Three chat agents (A, B, C)"
    model: "gpt-5.6-luna and Claude Haiku 5.5, through OpenRouter"
    settings: "one shared system prompt of about 150 words, no roles; luna at low reasoning effort; temperature 1.0; private notes rewritten after each session"
runs: "6 sessions (5 planned plus a design-document session): 286 messages in sessions 1 to 5, 12 in session 6"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/b0f032fff2b3ac7f9f83736d926aebd607b6c429/2026-11-emergent-room/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/b0f032fff2b3ac7f9f83736d926aebd607b6c429/2026-11-emergent-room/README.md"
previewImage: "/guide-images/chart-emr-classifier.png"
previewAlt: "Balanced accuracy of a text-only classifier telling agents apart. Two luna agents, sessions 1 to 3: 0.52, chance 0.50. Luna against haiku, sessions 1 to 3: 0.96. Both luna after the model swap: 0.48. Haiku against luna after the swap: 0.89."
topics:
  - parallel
  - harness
publishedOn: 2026-11-20
findings:
  - id: "EMR-1"
    statement: "Two agents on the same model could not be told apart from their words alone, while a luna agent and a haiku agent could"
    metric: "balanced accuracy of a text-only classifier, leave one session out, telling agent A from agent B (both gpt-5.6-luna) in sessions 1 to 3; chance is 0.50"
    value: "0.52 (chance 0.50); luna against haiku 0.96"
    n: "135 messages for A against B, 114 for the luna-against-haiku control"
    detail:
      - "a shuffled-label null (10,000 shuffles within each session) has a mean of 0.50 and a 95th percentile of 0.58; A against B sits inside it (p 0.36)"
      - "the same classifier separates luna from haiku at 0.96, so it can see a real difference; dropping each agent's first three messages per session changes neither result"
      - "exploratory: a count of 286 messages, no adjusted test"
    limits:
      - "the classifier reads wording only, on a few hundred messages: it says the two luna agents were not distinguishable by their words, not that nothing differed"
      - "one scenario per session, five sessions, one run each"
    source: "https://github.com/meabs/experiments/blob/b0f032fff2b3ac7f9f83736d926aebd607b6c429/2026-11-emergent-room/REPORT.md"
    status: current
    featured: false
  - id: "EMR-2"
    statement: "After two agents swapped models, their style followed the model they were now running on, not the notes and history they carried"
    metric: "agent label a classifier trained on sessions 1 to 3 gives to the messages of sessions 4 and 5"
    value: "A (now haiku): 21 of 22 messages labelled as the old haiku agent; C (now luna): 40 of 40 labelled as luna"
    n: "103 messages in sessions 4 and 5"
    detail:
      - "B against C, both luna after the swap: 0.48 (null 0.50); A against B, haiku against luna: 0.89"
      - "exploratory: nearest-centroid classifier on word and bigram weights, agent names removed"
    limits:
      - "the swap ran once; messages from parallel turns are often written before newer ones land, which may shape wording"
      - "notes were the only channel for memory, and the agents seldom referred back to earlier sessions, so this cannot say what stronger memory would do"
    source: "https://github.com/meabs/experiments/blob/b0f032fff2b3ac7f9f83736d926aebd607b6c429/2026-11-emergent-room/REPORT.md"
    status: current
    featured: false
  - id: "EMR-3"
    statement: "Challenging a peer moved with the model: haiku challenged often, luna almost never, whichever agent it was running"
    metric: "share of messages that a blind coder labelled 'challenge' (disputes or corrects an earlier message)"
    value: "agent A: 1 of 69 as luna, 7 of 22 as haiku; agent C: 31 of 48 as haiku, 2 of 40 as luna"
    n: "286 messages, coded by one model"
    detail:
      - "agent B, luna throughout: 2 of 107; the other 79% to 92% of messages in each session were coded as agreeing with an earlier message"
      - "exploratory: one coding pass by gpt-6-luna on anonymised speakers; a 40-message sample is in the repository for checking by hand"
    limits:
      - "the coder is a single model's judgement, not hand-checked; messages that endorse and then add count as agreeing, which flatters the agree share"
    source: "https://github.com/meabs/experiments/blob/b0f032fff2b3ac7f9f83736d926aebd607b6c429/2026-11-emergent-room/REPORT.md"
    status: current
    featured: false
  - id: "EMR-4"
    statement: "Disagreement did not fall steadily across sessions, and none of the three agents revised a position after the contradicting evidence"
    metric: "share of messages coded 'challenge' by session; explicit revisions after the session 4 evidence card, per agent"
    value: "challenge share 19%, 18%, 14%, 6%, 16% in sessions 1 to 5; 0 of 3 agents revised in the room"
    n: "5 sessions; 3 agents in session 4"
    detail:
      - "agent C's notes record that the evidence moved it to wait, although the coder found no revision in its messages; the room had already leaned that way"
      - "continuity was not tested: no message in sessions 1 to 5 mentions an earlier session, and the planned replay with the notes removed was not run"
    limits:
      - "exploratory, coded by one model, not hand-checked; five sessions are too few for a trend"
    source: "https://github.com/meabs/experiments/blob/b0f032fff2b3ac7f9f83736d926aebd607b6c429/2026-11-emergent-room/REPORT.md"
    status: current
    featured: false
  - id: "EMR-5"
    statement: "Asked to write and agree a design document, the three agents each drafted a whole document at once, then agreed one version in 12 messages"
    metric: "messages and document versions to reach agreement in session 6"
    value: "3 drafts, agreement on version 3 after 12 messages, about 1,000 words"
    n: "1 session"
    detail:
      - "two of the three first drafts overwrote text their authors had not seen, because every agent started from an empty document"
      - "one agent first approved the wrong version, was told it was superseded, and then approved version 3"
    limits:
      - "descriptive only: one session, added after sessions 1 to 5, with two earlier attempts invalidated by faults in my scheduler and kept in the log"
    source: "https://github.com/meabs/experiments/blob/b0f032fff2b3ac7f9f83736d926aebd607b6c429/2026-11-emergent-room/REPORT.md"
    status: current
    featured: false
---

## Question

When AI agents talk to each other repeatedly with no assigned personalities, and each keeps its own private notes, do they become distinguishable? And if they do, is it the agent, the model underneath, or just who happened to speak first?

**The short answer:** in this setup the differences were the models'. Two agents on the same model could not be told apart by their words. When two agents swapped models, their style and their habit of challenging others moved with the model, even though each kept its own notes. This is a small exploratory case study, not a test of whether agents can develop personalities in general.

**Watch it:** [open the replay board →](/emergent-room/) to play, pause, speed up or scrub through every session, with the shared document and each agent's notes.

**This experiment was designed and run with an AI agent** (Claude Code, working for me): it drafted the design, built the room and board, ran the sessions and wrote the analysis. I chose the question and the two models, and approved the design and the spending.

## Prediction

Written before the runs, in the [design](https://github.com/meabs/experiments/blob/b0f032fff2b3ac7f9f83736d926aebd607b6c429/2026-11-emergent-room/README.md):

- **H1.** Agents on the same model are not distinguishable.
- **H2.** After two agents swap models, style follows the model.
- **H3.** Disagreement falls across sessions.
- **H4.** At least two of three agents revise a position when contradicting evidence arrives, and the notes record it, less often than the transcript suggests.
- **H5.** The notes carry continuity between sessions.

## Set-up

Three agents, A, B and C, share one chat room and the same short system prompt: reply, ask, challenge, change your mind, or stay silent. No names for roles, no tone instructions. There is **no speaking order**: after each message, every agent that has not yet seen it is asked, in parallel, whether to reply. Each agent rewrites its own private notes after every session, and sees only its own.

| Sessions | A | B | C |
| --- | --- | --- | --- |
| 1 to 3 | gpt-5.6-luna | gpt-5.6-luna | Claude Haiku 5.5 |
| 4 and 5 | Claude Haiku 5.5 | gpt-5.6-luna | gpt-5.6-luna |

A and C swap models between sessions 3 and 4 and keep their notes. B stays on luna as the control. The five scenarios were written in advance: an open design challenge, a payments release decision, a creative problem, the same payments decision with contradicting evidence delivered by a scripted card, and the first question again with a new constraint. A sixth session, added after I had seen the first five, asked them to write and agree a design document.

Every session ended when the room went quiet; none hit the 120-message cap. The whole run cost about $0.69 through OpenRouter.

## Results

Findings EMR-1 to EMR-5 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-emr-classifier.png" alt="Balanced accuracy of a text-only classifier telling agents apart. Two luna agents, sessions 1 to 3: 0.52, chance 0.50. Luna against haiku, sessions 1 to 3: 0.96. Both luna after the model swap: 0.48. Haiku against luna after the swap: 0.89." loading="lazy" />

<figcaption>Wording identifies the model, not the agent. Source: github.com/meabs/experiments, 2026-11-emergent-room.</figcaption>

</figure>

<figure class="guide-figure">

<img src="/guide-images/chart-emr-challenge.png" alt="Share of messages coded as challenge. Agent A: 1 of 69 as luna, 7 of 22 as haiku. Agent C: 2 of 40 as luna, 31 of 48 as haiku." loading="lazy" />

<figcaption>Challenging a peer followed the model through the swap. Coded by a single model; exploratory.</figcaption>

</figure>

### What did not show up

- **Disagreement fell across sessions (H3):** no steady fall. The challenge share was 19%, 18%, 14%, 6% and 16%; session 4 is the low point.
- **Revising after the evidence (H4):** the coder found no explicit change of position in the room for any agent. Agent C's notes say the evidence moved it to wait, which the transcript does not show.
- **Continuity (H5):** not tested. The agents never referred back to an earlier session by name, and I did not run the replay with the notes removed.

### The design-document session

All three agents posted a complete document in the first round, each from an empty start. They then converged on Agent C's version in 12 messages; one agent first approved the wrong version and was corrected by the others. Two earlier attempts at this session failed because of faults in my scheduler (it stopped too early; it missed an agreement written at the end of a message). Both are kept in the log, labelled invalid.

## Limits

- **Five sessions, one scenario each, two cheap models, one run each.** Everything here is exploratory; no confirmatory test was possible.
- **The classifier reads wording only** and has a few hundred messages. It cannot see anything else that might differ between agents.
- **The challenge, agree and revision labels come from one model's judgement,** not checked by hand. A 40-message sample is in the repository for that.
- **Parallel turns shape the conversation:** between 53% and 78% of messages in each session were written before newer ones had landed.
- **The notes are text the agent writes about itself.** Agent C's final notes mislabel which topic session 4 was.
- **I added session 6 after seeing the first five,** and the notes-removed replay for continuity was not run.
- **Cost figures:** my token count at list price is $0.57; OpenRouter's balance moved by $0.69, which includes the coder and the two invalid attempts.

## What this means: impact and risks

This part is my interpretation, not a measurement. I'd treat these as leads, not rules.

**If identical prompts give three agents different personalities, check the models first.** In this setup the "personalities" were each model's defaults, and an agent did not carry a role from its history into a new model.

**A mixed-model room is the cheap way to get real disagreement.** The haiku agents were the room's sceptic wherever they sat; the luna agents mostly built on each other's points. A room of one model mostly agreed with itself.

**Risk: a convincing transcript is not evidence of an individual.** Without a model swap and a null test, I could have read the sceptic as "Agent C's character" and I'd have been wrong.

## What would be worth testing next?

These are proposals, not results.

- **A luna-only room and a haiku-only room,** five sessions each, to see whether a haiku-only room still produces a sceptic or the role comes from the mix.
- **A replay of each session's last 40 messages with and without the notes,** to measure continuity directly.
- **Hand-checking the coded sample** and a second coder from a different family.

## Reproduce

Everything is in [experiments/2026-11-emergent-room](https://github.com/meabs/experiments/tree/b0f032fff2b3ac7f9f83736d926aebd607b6c429/2026-11-emergent-room), with the full write-up in [REPORT.md](https://github.com/meabs/experiments/blob/b0f032fff2b3ac7f9f83736d926aebd607b6c429/2026-11-emergent-room/REPORT.md). The event log, per-agent notes, both analyses and the board are in the folder. Run `python3 -I scripts/board.py` to replay the sessions locally.
