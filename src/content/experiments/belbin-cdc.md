---
title: "Do two forceful agents change how a Belbin team writes a design? (BLC)"
description: "The Belbin GKE design task made harder with Cloud SQL and change data capture into BigQuery, with and without two agents told to argue forcefully. Telling them to be forceful made them quieter."
date: 2026-11-20T18:00:00+00:00
summary: "Four sessions. Two agents told to be forceful wrote 3 and 6 messages against 10 and 19 without the instruction, and the rooms with them agreed sooner (20 and 43 messages against 64 and 81). Exploratory."
type: "Exploratory case study"
github:
  - label: "Data, code and agreed documents on GitHub"
    href: "https://github.com/meabs/experiments/tree/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc"
guideLinks:
  - label: "Replay the sessions"
    href: "/belbin-cdc/"
draft: false
experimentId: "BLC"
question: "If two of nine Belbin-role agents are told to hold strong opinions and argue forcefully, do they dominate the room, and does the design document change, on a harder task with Cloud SQL and change data capture into BigQuery?"
status: published
evidenceGrade: published
agents:
  - name: "Nine chat agents (A to I)"
    model: "gpt-5.6-luna through OpenRouter"
    settings: "low reasoning effort, temperature 1.0; one shared document with compare-and-swap edits; a Belbin role paragraph each; agents D and H also get a forceful paragraph in two of the four sessions"
runs: "4 sessions: 2 with roles only, 2 with two forceful agents; 20 to 81 messages each, plus a 30-message pilot"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/README.md"
previewImage: "/guide-images/chart-blc-sessions.png"
previewAlt: "Messages until all nine agents agreed: roles only session 1, 64; two forceful agents session 2, 20; roles only session 3, 81; two forceful agents session 4, 43. Messages written by agents D and H: 10, 3, 19 and 6."
topics:
  - parallel
  - harness
publishedOn: 2026-11-20
findings:
  - id: "BLC-1"
    statement: "Telling two agents to be forceful and opinionated did not make them louder: they wrote fewer messages than the same two agents without the instruction"
    metric: "messages written by agents D and H, and the share of them a blind coder marked forceful"
    value: "3 and 6 messages in the forceful rooms against 10 and 19 in the rooms with roles only"
    n: "4 sessions, 2 per condition"
    detail:
      - "in the forceful rooms the coder marked 1 of 3 and 2 of 6 of their messages forceful, against 5 of 16 and 24 of 36 for the other seven agents"
      - "D and H authored no document version in either forceful session; in session 4 they were asked 17 times and chose to stay silent 9 times"
      - "exploratory; my prediction (twice as forceful as the others, and more than 30% of the messages) was wrong"
    limits:
      - "very few messages to code, and two sessions per condition; the two repetitions give D and H different Belbin roles"
      - "the forceful paragraph asks for forceful argument without insulting anyone, which limits how aggressive an agent can sound"
    source: "https://github.com/meabs/experiments/blob/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/REPORT.md"
    status: current
    featured: false
  - id: "BLC-2"
    statement: "Rooms with two forceful agents agreed sooner and with fewer document versions, the opposite of my prediction"
    metric: "messages until all nine agents agreed, and document versions posted"
    value: "forceful rooms: 20 and 43 messages, 1 version each; roles only: 64 and 81 messages, 2 and 3 versions"
    n: "4 sessions"
    detail:
      - "the shortest session (20 messages) ended with agents D and H each posting AGREE v1"
      - "the share of messages a blind coder labelled challenge does not separate the conditions: 16% and 36% in the forceful rooms, 29% and 24% in the others"
    limits:
      - "two sessions per cell, and the two roles-only sessions differ from each other by as much as the conditions do"
    source: "https://github.com/meabs/experiments/blob/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/REPORT.md"
    status: current
    featured: false
  - id: "BLC-3"
    statement: "The forceful rooms' documents scored higher on a coverage checklist, but a pairwise judge preferred the other documents in three of four judgements"
    metric: "blind coder's score against a 16-item checklist fixed beforehand (0 absent, 1 generic, 2 specific), and a blind pairwise choice between the two documents of each repetition, in both orders"
    value: "checklist 32 and 31 of 32 (forceful) against 27 and 30 (roles only); pairwise: roles only 3 wins, forceful 1"
    n: "4 documents; 4 pairwise judgements"
    detail:
      - "in the first repetition the judge chose 'Document 2' in both orders, so that pair shows position bias, not a preference; in the second it preferred the roles-only document both times"
      - "the checklist measures coverage and specificity, not correctness"
    limits:
      - "one model's judgement, not hand-checked; the mean checklist gap of 3 is on the edge of what I defined as the same"
    source: "https://github.com/meabs/experiments/blob/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/REPORT.md"
    status: current
    featured: false
  - id: "BLC-4"
    statement: "The harder task kept the checklist from saturating, and the coder flagged three to five doubtful claims per document, mostly about change data capture through a database failover"
    metric: "checklist range across the four documents; unscored doubtful claims the coder listed per document"
    value: "27 to 32 of 32 (BLB's easier task scored 23 of 24 in all four); 3 to 5 doubtful claims per document"
    n: "4 documents"
    detail:
      - "recurring flags: whether a logical replication slot or checkpoint survives a promotion, what the initial backfill reads from the source database, and which metadata Datastream exposes"
      - "these are the coder's, not verified by a person"
    limits:
      - "a platform engineer should read the four documents before anyone builds from them"
    source: "https://github.com/meabs/experiments/blob/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/REPORT.md"
    status: current
    featured: false
---

## Question

If two of nine agents are told to hold strong opinions and argue forcefully, do they dominate the room, and does the design document change? This follows [the Belbin experiment](/experiments/belbin-gke/), where nine agents with nine team roles wrote a highly available GKE design, barely sounded different, and agreed to the first version. I changed two things: a harder task, and two forceful agents.

**The short answer:** the instruction did not work the way I expected. The two agents wrote fewer messages than the same agents without it, and the rooms with them agreed sooner, not later. The coverage checklist scored those documents higher, but a pairwise judge did not prefer them. This is a small exploratory case study of four sessions.

**Watch it:** [open the replay board →](/belbin-cdc/) to play, pause or scrub through all four sessions. The two forceful agents are labelled on the board, with the shared document and the notices when an edit was rejected.

**This experiment was designed and run with an AI agent** (Claude Code, working for me): it wrote the design, the room, the analysis and the page. I asked for the harder task and for two aggressive, opinionated agents, and I approved the spending.

## Prediction

Written before the runs, in the [design](https://github.com/meabs/experiments/blob/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/README.md):

- **H1.** D and H are marked forceful at least twice as often as the other seven in the forceful rooms.
- **H2.** They write more than 30% of the messages and author a document version.
- **H3.** Forceful rooms challenge more, take more messages and make more document versions.
- **H4.** No better documents: checklist within 3 of 32, and the pairwise judge prefers the forceful one in at most half of the judgements.

I was wrong about H1, H2 and H3.

## Set-up

Nine agents, A to I, all `gpt-5.6-luna` through OpenRouter, in one chat room with one shared document, as in the Belbin experiment: any agent can post or stay silent, nobody decides who speaks, `DOC:` replaces the document only if it was based on the current version, `AGREE vN` approves a version, and the session ends when all nine have approved the same one. Each agent has a Belbin team role. In two of the four sessions, agents **D and H** also get a paragraph telling them to be forceful. In the second repetition the roles are assigned to the letters in reverse order, so D and H hold Plant and Implementer in the first and Specialist and Teamworker in the second.

The task is the GKE design from before with two additions: the transactional database is Cloud SQL (PostgreSQL), and every committed change must reach BigQuery within about five minutes, without endangering the primary, through a failover, with a defined behaviour in a regional recovery, and with personal data in the tables.

## The system prompts

These are the exact texts the agents received, copied from the experiment's `arms/` folder ([browse it](https://github.com/meabs/experiments/tree/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/arms)). An agent's system prompt is the shared room rules, then its Belbin paragraph, then (for D and H in the forceful sessions only) the forceful paragraph. Nothing scripts who speaks or what anyone says. The task is the first message in the room.

**1. The shared room rules (every agent, every session)**

```text
You are one member of a team of nine people working together in a chat room. You can see everything posted in the room.

Each turn you either post one message or stay silent. To stay silent, reply with exactly: PASS
You may reply to anyone, ask questions, challenge a point, change your mind, propose, or say nothing. Nobody decides who
speaks or in what order. Keep messages short unless you are posting the document. To reply to a specific earlier
message, start with `>> 12` (its number) on its own line, then your message.

There is one shared document, shown above the room at every turn. To change it, post a message that starts with `DOC:`
followed by the complete new text; that replaces the shared document. If someone else changed the document after the
version you were shown, your replacement is rejected and you will see a notice. To approve the current version, put a line
`AGREE vN` on its own, where N is the version number. A new version clears all agreements. The session finishes when all
nine of you have agreed to the same version. You are not required to agree.
```

**2. The Belbin paragraph (one per agent; the Plant's, as an example)**

```text
Your natural team role, in Belbin's model, is Plant. In that model this role tends to be highly creative and good at solving problems in unconventional ways. Its strengths: Creative, imaginative, free-thinking, generates ideas and solves difficult problems. Its allowable weaknesses (the flip side of the strengths): Might ignore incidentals, and may be too preoccupied to communicate effectively. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

The nine paragraphs are built from [Belbin's page](https://www.belbin.com/about/belbin-team-roles): the role, its short description, its strengths and its allowable weaknesses. The other eight are below.

<details>
<summary>All nine role paragraphs</summary>

**Resource Investigator** (Social roles)

```text
Your natural team role, in Belbin's model, is Resource Investigator. In that model this role uses their inquisitive nature to find ideas to bring back to the team. Its strengths: Outgoing, enthusiastic. Explores opportunities and develops contacts. Its allowable weaknesses (the flip side of the strengths): Might be over-optimistic, and can lose interest once the initial enthusiasm has passed. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Teamworker** (Social roles)

```text
Your natural team role, in Belbin's model, is Teamworker. In that model this role helps the team to gel, using their versatility to identify the work required and complete it on behalf of the team. Its strengths: Co-operative, perceptive and diplomatic. Listens and averts friction. Its allowable weaknesses (the flip side of the strengths): Can be indecisive in crunch situations and tends to avoid confrontation. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Co-ordinator** (Social roles)

```text
Your natural team role, in Belbin's model, is Co-ordinator. In that model this role needed to focus on the team's objectives, draw out team members and delegate work appropriately. Its strengths: Mature, confident, identifies talent. Clarifies goals. Its allowable weaknesses (the flip side of the strengths): Can be seen as manipulative and might offload their own share of the work. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Plant** (Thinking roles)

```text
Your natural team role, in Belbin's model, is Plant. In that model this role tends to be highly creative and good at solving problems in unconventional ways. Its strengths: Creative, imaginative, free-thinking, generates ideas and solves difficult problems. Its allowable weaknesses (the flip side of the strengths): Might ignore incidentals, and may be too preoccupied to communicate effectively. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Monitor Evaluator** (Thinking roles)

```text
Your natural team role, in Belbin's model, is Monitor Evaluator. In that model this role provides a logical eye, making impartial judgements where required and weighs up the team's options in a dispassionate way. Its strengths: Sober, strategic and discerning. Sees all options and judges accurately. Its allowable weaknesses (the flip side of the strengths): Sometimes lacks the drive and ability to inspire others and can be overly critical. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Specialist** (Thinking roles)

```text
Your natural team role, in Belbin's model, is Specialist. In that model this role brings in-depth knowledge of a key area to the team. Its strengths: Single-minded, self-starting and dedicated. They provide specialist knowledge and skills. Its allowable weaknesses (the flip side of the strengths): Tends to contribute on a narrow front and can dwell on the technicalities. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Shaper** (Task roles)

```text
Your natural team role, in Belbin's model, is Shaper. In that model this role provides the necessary drive to ensure that the team keeps moving and does not lose focus or momentum. Its strengths: Challenging, dynamic, thrives on pressure. Has the drive and courage to overcome obstacles. Its allowable weaknesses (the flip side of the strengths): Can be prone to provocation, and may sometimes offend people's feelings. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Implementer** (Task roles)

```text
Your natural team role, in Belbin's model, is Implementer. In that model this role needed to plan a workable strategy and carry it out as efficiently as possible. Its strengths: Practical, reliable, efficient. Turns ideas into actions and organises work that needs to be done. Its allowable weaknesses (the flip side of the strengths): Can be a bit inflexible and slow to respond to new possibilities. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Completer Finisher** (Task roles)

```text
Your natural team role, in Belbin's model, is Completer Finisher. In that model this role most effectively used at the end of tasks to polish and scrutinise the work for errors, subjecting it to the highest standards of quality control. Its strengths: Painstaking, conscientious, anxious. Searches out errors. Polishes and perfects. Its allowable weaknesses (the flip side of the strengths): Can be inclined to worry unduly, and reluctant to delegate. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

</details>

**3. The forceful paragraph (agents D and H, in the two forceful sessions only)**

```text
You hold strong opinions about how this should be built and you argue for them forcefully. You are blunt, you push your
position hard and repeat it when it is ignored, you call out choices you think are wrong, and you do not give way easily:
you change your mind only when someone gives you a compelling reason. It is the ideas you attack, never the people.
```

**4. The task (the first message in the room)**

```text
Task for this session: produce a detailed design document for a highly available Google Kubernetes Engine (GKE) cluster platform, including a transactional database and change data capture into an analytics warehouse.

Context: a customer-facing web application (stateless API and web tier, plus a message queue) for users in one continent.
The transactional database is Cloud SQL (PostgreSQL). Target: 99.95% monthly availability for the service. Peak traffic is
about 5,000 requests a second. The platform must survive the loss of a single zone without anyone having to intervene,
and a loss of a whole region must have a documented, rehearsed recovery. The team is eight engineers on a managed-service
budget.

The analytics team also needs every committed change in the transactional database available in BigQuery within about
five minutes (change data capture). This must not endanger the availability or performance of the primary database. It
must keep working through a database failover, and the document must say what happens to it in a regional recovery. The
tables hold personal data.

The document should be something a platform team could build from. It should cover at least: cluster and node topology;
workload placement and disruption handling; traffic entry; the transactional database and its high availability; the
change data capture pipeline into BigQuery (how it is built, its effect on the source, failover behaviour, ordering and
duplicates, schema changes, the first backfill, and the handling of personal data); failure behaviour (zone and region);
upgrades and maintenance; networking; observability and service-level objectives including the freshness of the analytics
copy; security that affects availability; testing of failures; and the risks, assumptions and trade-offs you accept.

The shared document starts empty. Write it together and agree a version.
```

## Results

Findings BLC-1 to BLC-4 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-blc-sessions.png" alt="Messages until all nine agents agreed: roles only session 1, 64; two forceful agents session 2, 20; roles only session 3, 81; two forceful agents session 4, 43. Messages written by agents D and H: 10, 3, 19 and 6." loading="lazy" />

<figcaption>The rooms with two forceful agents were shorter, and the two forceful agents wrote less. Source: github.com/meabs/experiments, 2026-11-belbin-cdc.</figcaption>

</figure>

| Session | Condition | Messages | Versions | Rejected edits | Challenge share | Checklist (of 32) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Roles only | 64 | 2 | 5 | 29% | 27 |
| 2 | Two forceful | 20 | 1 | 5 | 16% | 32 |
| 3 | Roles only, reversed | 81 | 3 | 9 | 24% | 30 |
| 4 | Two forceful, reversed | 43 | 1 | 6 | 36% | 31 |

All four sessions ended with all nine agents agreeing, and none hit the 150-message cap. They cost $0.73 at list price, about $1.0 of OpenRouter credit including the blind coder.

## Reports and data

- **[Full report (REPORT.md)](https://github.com/meabs/experiments/blob/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/REPORT.md):** what I predicted, what happened, what surprised me, limits and next steps.
- **[Design (README.md)](https://github.com/meabs/experiments/blob/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/README.md):** the design, frozen before the main run, with its amendment log.
- **[The four agreed design documents](https://github.com/meabs/experiments/tree/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/results/docs):** one per session.
- **[Numbers (analysis.json)](https://github.com/meabs/experiments/blob/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/results/analysis.json)** and **[the full event log (events.sqlite)](https://github.com/meabs/experiments/blob/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/results/events.sqlite):** every message, pass, document version and notice.
- **[Prompts, scripts and tests](https://github.com/meabs/experiments/tree/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc):** the room, the analysis and the board.
- **[A 40-message sample](https://github.com/meabs/experiments/blob/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/results/coded_sample_for_hand_check.csv)** for checking the blind coder by hand.
- The first experiment in this series: [the Belbin GKE report](https://github.com/meabs/experiments/blob/fbaf3575a534bfbdddf5dd23b4c36ea89b8a374c/2026-11-belbin-gke/REPORT.md).

## Limits

- **Four sessions, one model, one task.** Everything is exploratory.
- **D and H wrote only 3 to 6 messages in the forceful sessions,** so the forceful share is computed on very few messages.
- **Nobody has checked the documents for technical correctness.** The checklist measures coverage, the pairwise judge is one model with position bias in the first repetition, and the doubtful claims are unverified.
- **The forceful paragraph says to attack ideas, never people,** which limits how aggressive an agent can sound; the instruction is a prompt, so this tests what the model does when told to be forceful, not how people behave.
- **The roles differ between the two repetitions,** so they are not the same comparison.

## What this means: impact and risks

This part is my interpretation, not a measurement. I'd treat these as leads, not rules.

**A paragraph of attitude does not give an agent the floor.** The room's rules decide who gets heard: turn-taking, who can edit, whether silence is free. In this room a strongly opinionated agent still said `PASS` when others had made its point.

**A voice with a job would probably do more than a voice with an attitude.** "Own the failover section, and you can block approval" is a different instruction from "argue forcefully".

**Risk: fast agreement can look like a good outcome.** The rooms with forceful agents finished in 20 and 43 messages with one version each. Short is not the same as reviewed.

## What would be worth testing next?

These are proposals, not results.

- **Forceful agents with a responsibility,** such as an owner of one section or a veto, as well as an attitude.
- **A rule that a request for a change blocks approval** until it is closed.
- **Longer sessions with more turns per agent,** and a platform engineer rating the documents blind to the condition.

## Reproduce

Everything is in [experiments/2026-11-belbin-cdc](https://github.com/meabs/experiments/tree/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc), with the full write-up in [REPORT.md](https://github.com/meabs/experiments/blob/a105307ce577ca4d21cc37e0602d8e244a002df2/2026-11-belbin-cdc/REPORT.md). `python3 -I scripts/board.py` replays the sessions locally.
