---
title: "Can AI agents that each deliver a correct change break an estate together? (TRX)"
description: "Four small Java services in a release simulator with a failed rollout and a rollback. Agents working on separate tickets shipped an unsafe change in 25 of 25 trajectories, every one with green CI. Telling them about the other change and asking for a release plan raised safe delivery to 20 of 25; adding a deterministic gate gave 22 of 25, not distinguishable from that."
date: 2026-11-26T09:30:00+00:00
summary: "90 trajectories (two Codex runs each) on a toy estate. Independent agents: 0 of 25 hazard changes safe, all with green CI. Told to coordinate and write a release plan: 20 of 25. Plus a gate: 22 of 25 (no measurable difference from coordinating). Consent was the weak spot in both."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/36e1ea17f6d857384c00420716027b72e7e729ca/2026-11-release-transition"
draft: false
experimentId: "TRX"
question: "Can several AI agents, each delivering a correct change that passes its own tests, still break a multi-service estate when the changes are deployed together, and does coordination or an external transition gate change that?"
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI 0.157"
    model: "gpt-5.6-luna (hosted)"
    settings: "medium effort, one turn per run, no one to ask, bubblewrap sandbox; one run per changed service, runs cannot talk to each other"
runs: "6 scenarios × 3 arms × 5 repetitions = 90 trajectories after a 15-trajectory pilot"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/36e1ea17f6d857384c00420716027b72e7e729ca/2026-11-release-transition/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/36e1ea17f6d857384c00420716027b72e7e729ca/2026-11-release-transition/README.md"
previewImage: "/guide-images/chart-trx-outcomes.png"
previewAlt: "Safe delivery by arm over 25 hazard trajectories each. Independent agents: 25 released unsafe. Told to coordinate: 20 safe, 5 unsafe. With the gate: 22 safe, 3 unsafe."
topics:
  - parallel
  - verification
  - safety-cost
publishedOn: 2026-11-26
findings:
  - id: "TRX-1"
    statement: "Agents working on separate tickets each delivered a working change and still released an unsafe estate every time, with green CI"
    metric: "arm A hazard trajectories that released unsafe, and of those how many had green CI first"
    value: "25 of 25 unsafe, 25 of 25 with green CI"
    n: "5 hazard scenarios × 5 trajectories"
    detail:
      - "all 25 also delivered their tickets; safe delivery was 0%"
      - "the control scenario with no hazard (S0) delivered safely in 5 of 5"
    limits:
      - "a toy estate, scenarios I chose to contain a transition hazard, one model; this shows the hazard can occur, not how often it does in real estates"
    source: "https://github.com/meabs/experiments/blob/36e1ea17f6d857384c00420716027b72e7e729ca/2026-11-release-transition/REPORT.md"
    status: current
    featured: false
  - id: "TRX-2"
    statement: "Telling the agents about the other change and asking for a release plan raised safe delivery from none to most"
    metric: "safe delivery, B minus A (hazard scenarios, mean over scenarios)"
    value: "+80 pts (80% against 0%)"
    interval:
      low: "72.0 pts"
      high: "88.0 pts"
      method: "bootstrap 95% CI within scenario; one-sided permutation p 0.00001; contradicts my prediction that B would gain only a little"
    n: "5 scenarios × 5 trajectories per arm"
    detail:
      - "B was safe in 20 of 25; the 5 unsafe were 1 in retries and 4 in consent"
      - "B bundles awareness of the other change with the instruction to write a plan; I did not separate them"
    limits:
      - "one model, five repetitions per cell"
    source: "https://github.com/meabs/experiments/blob/36e1ea17f6d857384c00420716027b72e7e729ca/2026-11-release-transition/REPORT.md"
    status: current
    featured: false
  - id: "TRX-3"
    statement: "The deterministic gate added no measurable safe delivery over telling the agents to coordinate"
    metric: "safe delivery, C minus B (hazard scenarios, mean over scenarios)"
    value: "+8 pts (88% against 80%)"
    interval:
      low: "−4.0 pts"
      high: "20.0 pts"
      method: "bootstrap 95% CI within scenario; one-sided permutation p 0.29, Holm p 0.29: no measurable difference"
    n: "5 scenarios × 5 trajectories per arm"
    detail:
      - "C was safe in 22 of 25; consent (S4) was 2 of 5 for C and 1 of 5 for B"
      - "in S4 the gate rejected the first candidate in 4 of 5 trajectories, admitted all five after one repair round, and three of those still sent offers without consent"
      - "C delivered 92% of trajectories (23 of 25, both tickets' requirements working) against B's 100%: the gate cost some deliveries (difference −8 points, 95% interval −16 to 0)"
      - "the gate and the oracle share an author, simulator and hazard vocabulary, so C is an upper bound for hazards the gate was not built around"
    limits:
      - "the gate was built by the same AI agent that built the oracle; 25 trajectories per arm cannot rule out a small benefit"
    source: "https://github.com/meabs/experiments/blob/36e1ea17f6d857384c00420716027b72e7e729ca/2026-11-release-transition/REPORT.md"
    status: current
    featured: false
---

## Question

Each agent was given one ticket for one service. Each change was correct and passed its tests. I wanted to know whether the estate still breaks when the changes are deployed together, one instance at a time, with a failed rollout and a rollback in the middle, and whether coordination or an external gate changes that.

**The short answer:** in this toy estate, yes it breaks, every time, with green CI. Telling the agents about the other change and asking for a release plan fixed most of it (80% safe). My deterministic gate added 8 points that I can't tell from zero, and neither helped much on consent.

**This experiment was designed and run with an AI agent** (Claude Code, working for me): it wrote the estate, the release simulator, the oracle, the gate, the runner and the analysis, and ran the agents. I proposed the idea and approved the outline, then asked it to carry on through the pilot, the main run and publication.

## Prediction

Written into the [README](https://github.com/meabs/experiments/blob/36e1ea17f6d857384c00420716027b72e7e729ca/2026-11-release-transition/README.md) before the pilot:

- **H1.** In arm A at least half the unsafe releases have green CI.
- **H2.** Telling agents to coordinate does not lift safe delivery above A's by much. (Contradicted.)
- **H3.** The gate beats B and A. (Half supported: beats A, not shown to beat B.)
- **H4.** The gate is not a wall: control delivered at least 4 of 5, overall within 10 points of B. (Holds.)
- **H5.** The gate costs more per trajectory but less per safe delivery than A. (Holds against A, not against B; exploratory.)

My guesses for safe delivery were A about 25%, B about 40%, C about 70%. The measured values were 0%, 80% and 88%.

## Set-up

Codex CLI 0.157 with hosted `gpt-5.6-luna`, medium effort. A trajectory is two agent runs, one per changed service, that cannot talk to each other. The estate is four plain Java services run as two instances each in an in-process simulator with delayed events.

| Arm | What the agents get |
| --- | --- |
| A | ticket and service contracts; normal CI; changed services deploy in alphabetical order, one instance at a time; one repair round on a CI failure |
| B | A, plus the other ticket's title, read-only copies of the peer services, a paragraph on rolling deployment, rollback and persisted state, and an instruction to keep versions compatible and write a release plan (the plan's constraints are merged and executed) |
| C | B, plus a deterministic gate that rehearses the plan; one repair round on a reject |

Five hazard scenarios (event schema, database migration, retries, consent, decision model) and a control. Safe delivery needs a release, working requirements, no oracle violation and a recovered rollback. The oracle reads the simulator's final state, not the agents' reports.

## Results

Findings TRX-1 to TRX-3 are at the top of the page. Cost was $0.0185 per trajectory for A, $0.0269 for B and $0.0327 for C; the main run cost $2.34.

<figure class="guide-figure">

<img src="/guide-images/chart-trx-outcomes.png" alt="Safe delivery by arm over 25 hazard trajectories each. Independent agents: 25 released unsafe. Told to coordinate: 20 safe, 5 unsafe. With the gate: 22 safe, 3 unsafe." />

<figcaption>Safe delivery by arm. Source: github.com/meabs/experiments, 2026-11-release-transition.</figcaption>

</figure>

<figure class="guide-figure">

<img src="/guide-images/chart-trx-scenarios.png" alt="Outcome per scenario and arm, five trajectories each. Arm A is all unsafe in the five hazard scenarios. Arms B and C are all safe except retries B (4 of 5), consent B (1 of 5) and consent C (2 of 5)." />

<figcaption>Per scenario and arm. Consent is the weak spot for coordination and for the gate.</figcaption>

</figure>

The release plan was present in 30 of 30 B and 30 of 30 C trajectories, and the merged plan used its constraints every time.

## Limits

- A toy estate, one fault schedule, one model, five repetitions per cell.
- The gate and the oracle share an author, simulator and hazard vocabulary, and both were built by the same AI agent (Claude Code). The result is about this gate, a rehearsal of the release plan on a staging copy with eight generic rules, not about deterministic gates in general.
- I chose the scenarios to contain a hazard; how often real changes do is not measured.
- B changes several things at once: awareness of the other change (its ticket title and its code), a paragraph on rolling deployment, rollback and persisted state, and the instruction to write a plan. I did not separate them.
- The default deployment order is alphabetical, so arm A's complete failure depends partly on that convention; B and C can change the order.
- Delivery is measured per trajectory (both tickets' requirements working): C delivered 23 of 25 trajectories against 25 of 25 for A and B.
- **A mistake of mine:** the first main run was invalid. Per-run copies of the Codex login rotated its refresh token and I threw the new one away, so 163 of 180 sessions failed. I kept that data labelled invalid, fixed the runner and reran all 90.

## What this means

Leads, not rules. Here the missing ingredient was awareness of the other change and somewhere to put release constraints, more than a verifier. A gate whose rules can be satisfied by editing the plan is only as good as its rules, and consent showed that.

## What would be worth testing next?

These are proposals, not results.

- Separate awareness from the instruction to write a plan.
- Hazards the gate was not built around, such as a feature-flag removal or a cache-key change.
- A stronger model, and agents that can run the gate while they work.
- Real services with latency instead of an in-process simulator.

## Reproduce

Everything is in [experiments/2026-11-release-transition](https://github.com/meabs/experiments/tree/36e1ea17f6d857384c00420716027b72e7e729ca/2026-11-release-transition), with the full write-up in [REPORT.md](https://github.com/meabs/experiments/blob/36e1ea17f6d857384c00420716027b72e7e729ca/2026-11-release-transition/REPORT.md).
