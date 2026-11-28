---
title: "Does agent coordination add value beyond a mature CI/CD pipeline? (TRX2)"
description: "TRX again, but every arm gets a rehearsal pipeline with mixed-version rollout, rollback and repair rounds. Independent agents were safe in 11 of 25 hazard trajectories, told about each other 20 of 25, with a release plan 22 of 25. The plan's clear gain was efficiency, not final safety."
date: 2026-11-28T10:00:00+00:00
summary: "90 trajectories on TRX's estate with a pipeline in every arm. Independent agents: 44% safe (TRX had 0%). Awareness: 80%. Plus a release plan: 88%, no measurable gain over awareness, but first-time success 84% against 40% and 0%, and cheaper and faster."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/0d5f32b0f9e96b58121b96fcf5864b97d6cf8e26/2026-11-mature-pipeline"
draft: false
experimentId: "TRX2"
question: "With a rehearsal pipeline in every arm, do awareness of the other change and an executable release plan still improve safe delivery, repairs, cost and time?"
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI 0.157"
    model: "gpt-5.6-luna (hosted)"
    settings: "medium effort, one turn per run, no one to ask, bubblewrap sandbox; one run per changed service, runs cannot talk to each other; held releases go back for up to two repair rounds"
runs: "6 scenarios × 3 arms × 5 repetitions = 90 trajectories after a 12-trajectory pilot"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/0d5f32b0f9e96b58121b96fcf5864b97d6cf8e26/2026-11-mature-pipeline/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/0d5f32b0f9e96b58121b96fcf5864b97d6cf8e26/2026-11-mature-pipeline/README.md"
previewImage: "/guide-images/chart-trx2-outcomes.png"
previewAlt: "Outcome by arm over 25 hazard trajectories each. Independent agents: 11 safe after repair, 1 released not safe, 13 held. Told about the other change: 10 safe first time, 10 safe after repair, 5 held. With a release plan: 21 safe first time, 1 after repair, 2 released not safe, 1 held."
topics:
  - parallel
  - verification
  - safety-cost
publishedOn: 2026-11-28
findings:
  - id: "TRX2-1"
    statement: "With a rehearsal pipeline in place, independent agents delivered safely in under half of hazard trajectories, against none in TRX"
    metric: "safe delivery, arm A (hazard scenarios)"
    value: "44% (11 of 25)"
    n: "5 hazard scenarios × 5 trajectories"
    detail:
      - "the pipeline held every unsafe candidate that reached it; 13 trajectories ended held, never released, and 1 released a candidate that no longer met the ticket"
      - "S3 (retries) and S5 (decision model) need both services to change together: arm A was held 5 of 5 in both"
    limits:
      - "the pipeline is my own rehearsal, built from the same rules and simulator as the oracle, so this is a best case for conventional controls; toy estate, one model, five repetitions per cell; the comparison with TRX's 0 of 25 is descriptive because it is a different experiment"
    source: "https://github.com/meabs/experiments/blob/0d5f32b0f9e96b58121b96fcf5864b97d6cf8e26/2026-11-mature-pipeline/REPORT.md"
    status: current
    featured: false
  - id: "TRX2-2"
    statement: "Telling the agents about the other change raised final safe delivery even with the pipeline present"
    metric: "safe delivery, B minus A (hazard scenarios, mean over scenarios)"
    value: "+36 pts (80% against 44%)"
    interval:
      low: "20.0 pts"
      high: "52.0 pts"
      method: "bootstrap 95% CI within scenario; one-sided permutation p 0.001, Holm p 0.002"
    n: "5 scenarios × 5 trajectories per arm"
    detail:
      - "B was safe in 20 of 25 and A in 11 of 25"
      - "B bundles the other ticket's title, a note on rolling rollouts and read-only copies of the peer services; I did not separate them"
    limits:
      - "the pipeline is my own rehearsal, built from the same rules and simulator as the oracle, so this is a best case for conventional controls; toy estate, one model, five repetitions per cell; contradicts my prediction that B would be within 10 points of A"
    source: "https://github.com/meabs/experiments/blob/0d5f32b0f9e96b58121b96fcf5864b97d6cf8e26/2026-11-mature-pipeline/REPORT.md"
    status: current
    featured: false
  - id: "TRX2-3"
    statement: "A release plan added no measurable final safety over awareness alone"
    metric: "safe delivery, C minus B (hazard scenarios, mean over scenarios)"
    value: "+8 pts (88% against 80%)"
    interval:
      low: "−4.0 pts"
      high: "20.0 pts"
      method: "bootstrap 95% CI within scenario; one-sided permutation p 0.33, Holm p 0.33: no measurable difference"
    n: "5 scenarios × 5 trajectories per arm"
    detail:
      - "C was safe in 22 of 25; consent (S4) was 2 of 5, with two candidates admitted by the pipeline that still sent offers without consent"
      - "12 of C's 22 safe hazard releases were safe only because of the plan (unsafe in the default order) and 10 were safe either way (exploratory)"
    limits:
      - "the interval includes no benefit and a gain above 10 points, so 25 trajectories per arm do not show that the plan adds nothing"
    source: "https://github.com/meabs/experiments/blob/0d5f32b0f9e96b58121b96fcf5864b97d6cf8e26/2026-11-mature-pipeline/REPORT.md"
    status: current
    featured: false
  - id: "TRX2-4"
    statement: "A release plan made delivery safe at the first candidate far more often, with fewer repairs, at lower cost and time"
    metric: "safe at the first candidate, C minus B (hazard scenarios, mean over scenarios)"
    value: "+44 pts (84% against 40%)"
    interval:
      low: "40.0 pts"
      high: "52.0 pts"
      method: "bootstrap 95% CI within scenario; one-sided permutation p 0.00001, Holm p 0.00003; the interval is narrow because arm B's rate is 0 or 1 in most scenarios"
    n: "5 scenarios × 5 trajectories per arm"
    detail:
      - "repair rounds per trajectory: A 1.64, B 0.84, C 0.20"
      - "cost per trajectory: A $0.055, B $0.045, C $0.032; time: A 264 s, B 220 s, C 154 s"
      - "0 of 157 candidates were held when the oracle judged them safe"
    limits:
      - "the pipeline is my own rehearsal, built from the same rules and simulator as the oracle, so this is a best case for conventional controls; toy estate, one model, five repetitions per cell"
    source: "https://github.com/meabs/experiments/blob/0d5f32b0f9e96b58121b96fcf5864b97d6cf8e26/2026-11-mature-pipeline/REPORT.md"
    status: current
    featured: false
---

## Question

TRX found that independent agents released an unsafe estate every time, with green CI, and that telling them about each other fixed most of it. A reviewer pointed out that TRX's arm A was a basic pipeline, so I may have measured the value of adding release engineering where there was none. This time every arm gets a pipeline that rehearses the rollout. Does coordination still add anything?

**The short answer:** the pipeline did the safety work. Independent agents went from 0 of 25 in TRX to 11 of 25 safe, and the pipeline never let an unsafe candidate through in arms A or B. Awareness still mattered: B reached 20 of 25, because two of the scenarios need both services to change together and agents that cannot talk to each other could not find a joint fix. The release plan did not add measurable final safety (22 of 25, p = 0.33), but it made delivery safe at the first candidate far more often, and cheaper and faster.

**This experiment was designed and run with an AI agent** (Claude Code, working for me): it reused TRX's estate and simulator, built the pipeline change, ran the pilot and the main run, analysed it and wrote it up. I asked for it after the critique of TRX and approved publishing it.

## Prediction

Written into the [README](https://github.com/meabs/experiments/blob/0d5f32b0f9e96b58121b96fcf5864b97d6cf8e26/2026-11-mature-pipeline/README.md) before the pilot:

- **H1.** Arm A is far above TRX's 0% and below 100%, about 70%. (Direction supported, size lower: 44%.)
- **H2.** Awareness improves first-time success and repairs, with final safe delivery within 10 points of A. (Half contradicted: it improved final safety by 36 points.)
- **H3.** The plan is within 10 points of B on final safety. (Not shown different; the interval is too wide to show "within 10".)
- **H4.** Cost per safe release is lowest for B. (Contradicted: C was cheapest. Exploratory.)
- **H5.** Unnecessary blocking is under 10% of candidates. (Holds: 0 of 157. Exploratory.)
- **H6.** Most of C's gain over B is plan dependence, not safer code. (Partly: 12 of 22. Exploratory.)

## Set-up

Codex CLI 0.157 with hosted `gpt-5.6-luna`, medium effort. A trajectory is two agent runs, one per changed service, that cannot talk to each other. The estate, scenarios (a control and five hazards), simulator and oracle are TRX's.

After the two changes are merged, every arm runs the same pipeline: unit tests, a CI estate smoke, and a mixed-version rolling deployment rehearsal with an injected failed rollout and rollback, checked by generic rules. A held release goes back to both agents for up to two repair rounds.

| Arm | What the agents get beyond the ticket |
| --- | --- |
| A | nothing; the pipeline releases alphabetically |
| B | the other ticket's title, a note on rolling rollouts, read-only copies of the peer services; no plan |
| C | B plus an instruction to write a release plan; the pipeline rehearses and executes the merged plan |

Safe delivery needs a release, working requirements, no oracle violation and a recovered rollback. The oracle reads the simulator's final state, not the agents' reports.

## Results

Findings TRX2-1 to TRX2-4 are at the top of the page. The main run cost $3.53.

<figure class="guide-figure">

<img src="/guide-images/chart-trx2-outcomes.png" alt="Outcome by arm over 25 hazard trajectories each. Independent agents: 11 safe after repair, 1 released not safe, 13 held. Told about the other change: 10 safe first time, 10 safe after repair, 5 held. With a release plan: 21 safe first time, 1 after repair, 2 released not safe, 1 held." />

<figcaption>Outcome by arm. Source: github.com/meabs/experiments, 2026-11-mature-pipeline.</figcaption>

</figure>

<figure class="guide-figure">

<img src="/guide-images/chart-trx2-scenarios.png" alt="Outcome per scenario and arm, five trajectories each. Arm A is held in all five trajectories of retries and decision model. Consent is the weak spot in every arm." />

<figcaption>Per scenario and arm. Retries and the decision model stall without awareness; consent is hardest for everyone.</figcaption>

</figure>

- **Event schema and migration:** A needed repairs every time and mostly got there (3 of 5 and 5 of 5); B and C were safe first time in all ten.
- **Consent:** A 3 of 5, B 4 of 5, C 2 of 5. In C two candidates passed the pipeline and still sent an offer without consent.
- **One bad release in A:** after two failed repairs the pipeline admitted a candidate that had dropped the ticket's behaviour to get through. The oracle caught it because it checks requirements as well as safety.
- **Control:** 5 of 5 safe first time in every arm, no repairs, no false holds.

## Limits

- **The pipeline is my gate**, built from the same rules and simulator as the oracle, and in a free check it held all five reference hazards. That is a best case for conventional controls. A real pipeline would catch some of these and miss others, so arm A is probably optimistic and the gaps could be larger or smaller.
- The pipeline's first verdict matched the oracle's in all 90 trajectories, which is not independent evidence for either.
- A toy estate, one fault schedule, one model, five repetitions per cell.
- The comparison with TRX is descriptive. B bundles awareness with a note about rollouts.
- It says nothing about scale, many concurrent changes, or the economics of preventing against discovering problems at scale. That was the more interesting question in the critique and this experiment does not answer it.
- During analysis I fixed a sign bug in how the script printed differences for lower-is-better measures, before reading any result.

## What this means

Leads, not rules. A pipeline that rehearses the rollout is what made delivery safe here. Awareness and a release plan made it cheaper, faster and more likely to converge, which reads as coordination being an efficiency tool on top of release engineering rather than a replacement for it. Where the fix needs two changes to agree, independent agents and a rejecting pipeline stall.

## What would be worth testing next?

These are proposals, not results.

- A pipeline that was not built around these hazards.
- Hazards the generic rules cannot see; consent was the weak spot.
- Twenty agents over twelve services, to get at scale.
- Letting agents run the rehearsal themselves while they work.
- A stronger model.

## Reproduce

Everything is in [experiments/2026-11-mature-pipeline](https://github.com/meabs/experiments/tree/0d5f32b0f9e96b58121b96fcf5864b97d6cf8e26/2026-11-mature-pipeline), with the full write-up in [REPORT.md](https://github.com/meabs/experiments/blob/0d5f32b0f9e96b58121b96fcf5864b97d6cf8e26/2026-11-mature-pipeline/REPORT.md).
