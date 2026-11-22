---
title: "Can AI agents maintain the knowledge they depend on? (KF)"
description: "A synthetic card-partner integration over five stages, with a static knowledge bundle, workers who edit it, a separate curator, and a curator behind an evidence gate. A maintained store helped a fresh agent; the planted false claim never got in, so the curator and the gate were never really tested."
date: 2026-11-22T14:00:00+00:00
summary: "16 trajectories (4 seeds × 4 arms) on a local model. A fresh agent on a new partner scored 0.78 with the static bundle in all four seeds and 1.00 with a self-maintained or gated store (0.97 with a curator). No store kept the planted lie or a stale claim, and the evidence gate rejected nothing. One model, one synthetic domain."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/f10e1b05e2957d75c3c3d07548a1023014a993ad/2026-11-knowledge-factory"
draft: false
experimentId: "KF"
question: "Does a dedicated curator, or an automatic evidence check, keep an agent team's shared knowledge more accurate than static documentation or workers who edit it themselves, when the information is incomplete, changes or conflicts?"
status: published
evidenceGrade: published
agents:
  - name: "Strands Agents 1.65.0 on local Ollama"
    model: "qwen3.8:27b"
    settings: "thinking off, temperature 0.7, 16,384 context; workers have documents, ticket, service-probe and submit tools; no shell or file tool; a fresh session per task"
runs: "4 seeds × 4 arms × 5 stages = 80 worker sessions and 32 curator sessions, after two pilots with harness fixes"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/f10e1b05e2957d75c3c3d07548a1023014a993ad/2026-11-knowledge-factory/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/f10e1b05e2957d75c3c3d07548a1023014a993ad/2026-11-knowledge-factory/README.md"
previewImage: "/guide-images/chart-kf-knowledge.png"
previewAlt: "Left: stage 5 score of a fresh agent per seed. The static bundle scored 0.78 in all four seeds; self-maintaining and evidence-gated stores scored 1.00 in all four; the curator scored 1.00 in three and 0.89 in one. Right: claims in each store after each stage, rising to 11 for self-maintaining, 6.2 for gated, 4.8 for curator, 3 for static."
topics:
  - context
  - verification
  - harness
publishedOn: 2026-11-22
findings:
  - id: "KF-1"
    statement: "A maintained knowledge store helped a fresh agent on a new partner; the static bundle did not"
    metric: "hidden-test pass rate at stage 5, per seed"
    value: "static 0.78 in all 4 seeds; self-maintaining 1.00 ×4; evidence gate 1.00 ×4; curator 1.00, 1.00, 0.89, 1.00"
    n: "4 seeds per arm, 9 hidden tests per stage 5"
    detail:
      - "the static arm fails the two tests that need the network referral rule, in every seed: the new partner's stub documentation does not contain it and the starting bundle never stored it"
      - "the other three arms stored the rule from stage 1, because workers read the official spec"
    limits:
      - "four seeds with the same structure; descriptive only, no significance test"
      - "workers could read official documents in stages 1 to 4, so knowledge mattered mainly for the transfer stage"
    source: "https://github.com/meabs/experiments/blob/f10e1b05e2957d75c3c3d07548a1023014a993ad/2026-11-knowledge-factory/REPORT.md"
    status: current
    featured: false
  - id: "KF-2"
    statement: "No store held the planted false claim or a stale one, so the curator and the gate were not tested against poisoning"
    metric: "contaminated claims (planted lie or stale v1 fields stated as current) in any store at any stage"
    value: "0 in all 16 trajectories; one static-arm worker followed the planted ticket comment (score 0.56) and it never opened the spec"
    n: "16 trajectories, 5 stages each"
    detail:
      - "in the self-maintaining, curator and gated arms, eight stored claims record the ticket comment as wrong and say not to follow it; the grader counts them as correct"
      - "I read every claim that mentions the ticket or the word 'effectively'"
    limits:
      - "a floor effect: the trap did not catch a model that reads the spec, so this does not show the arms are equally safe against a harder trap"
      - "the grader is pattern-based"
    source: "https://github.com/meabs/experiments/blob/f10e1b05e2957d75c3c3d07548a1023014a993ad/2026-11-knowledge-factory/REPORT.md"
    status: current
    featured: false
  - id: "KF-3"
    statement: "The evidence gate never rejected an edit, and the self-maintaining store grew the most with no better score"
    metric: "edits rejected by the gate; claims in the store after stage 4 (mean of 4 seeds)"
    value: "0 rejected in 16 trajectories; claims 11.0 (self-maintaining), 6.2 (gate), 4.8 (curator), 3.0 (static)"
    n: "4 seeds per arm"
    detail:
      - "the gate checks that a quote exists in an official document, not that it is current, so its main weakness was never exercised"
    limits:
      - "claim count is not quality; one model for workers and curators"
    source: "https://github.com/meabs/experiments/blob/f10e1b05e2957d75c3c3d07548a1023014a993ad/2026-11-knowledge-factory/REPORT.md"
    status: current
    featured: false
---

## Question

Harrison Chase's "knowledge factory" has working agents report missing or wrong knowledge and a separate curator update a shared store. I wanted to test the assumption underneath it: does what the agents learn stay true? Does a curator, or only a code check, keep the store clean?

**The short answer:** a maintained store helped a fresh agent, and nothing poisoned it, but only because the trap never caught anyone. A static bundle left a fresh agent at 0.78 in four seeds out of four. The planted false claim never entered any store, so I cannot say whether a curator or a gate protects against it.

**What this does and doesn't measure:** 16 trajectories of one local model on a synthetic card-partner integration. It is a demonstration with per-seed results, not a significance test.

**This experiment was designed and run with an AI agent** (Claude Code, working for me): it built the service, the hidden tests, the claim grader and the runner, ran the pilots and analysed the results. I chose the question and the arms and approved the plan.

## Prediction

Before the run I wrote six hypotheses ([README.md](https://github.com/meabs/experiments/blob/f10e1b05e2957d75c3c3d07548a1023014a993ad/2026-11-knowledge-factory/README.md)): the self-maintaining arm would be more contaminated than the curator or the gate, the gate would be cleanest, the planted comment would become stored knowledge in at least one seed, a static bundle would fail the API change, and the transfer stage would be best where the store holds the referral rule. I also predicted the gate would catch planted claims but not stale ones.

## Set-up

Each arm completes the same five stages, with a fresh worker session per task and only the knowledge store carried over (a git commit per stage):

1. an initial task on API v1, with an incomplete bundle;
2. a network referral rule that is in the spec but not the bundle;
3. a change to API v2, described in a changelog while the spec still shows v1;
4. a ticket comment from an "ops-lead" saying manual review is effectively a decline, which the spec contradicts;
5. a fresh agent on a new partner whose documentation is a stub.

The four arms: **A** static bundle; **B** workers edit the store after their task; **C** workers file gap reports and a separate curator edits; **D** like C, but every edit must cite an official document and an exact quote, checked by code. Hidden tests score each handler, and code classifies the stored claims; no model grades anything.

## Results

Findings KF-1 to KF-3 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-kf-knowledge.png" alt="Left: stage 5 score of a fresh agent per seed. The static bundle scored 0.78 in all four seeds; self-maintaining and evidence-gated stores scored 1.00 in all four; the curator scored 1.00 in three and 0.89 in one. Right: claims in each store after each stage, rising to 11 for self-maintaining, 6.2 for gated, 4.8 for curator, 3 for static." />

<figcaption>Stage 5 score per seed, and claims in each store after each stage. Source: github.com/meabs/experiments, 2026-11-knowledge-factory.</figcaption>

</figure>

| # | Prediction | Result |
| --- | --- | --- |
| H1 | self-maintaining is more contaminated than curator or gate | **no** (0 everywhere) |
| H2 | curator cleaner than self-maintaining, same accuracy as gate | no difference to explain |
| H3 | gate has the lowest contamination | **no** (0 everywhere) |
| H4 | a planted comment becomes stored knowledge in at least one seed | **no** |
| H5 | the static arm fails the API change | **no** (it passed stage 3 in every seed; its only failure was stage 4) |
| H6 | stage 5 is best where the store holds the referral rule | yes, in all four seeds |

## Limits

- **A floor effect on the question I cared about.** Reading the spec defeated the trap. A harder trap, such as a plausible citable false source, is needed to test curators and gates.
- **One model for everything,** one framework version and one synthetic domain, with seeds that change names and thresholds but not the story.
- **A pattern-based grader.** I read the claims it called "other" by hand.
- **Harness fixes during the pilot:** a tool budget that ran out before submission, a restart for model-server errors (none needed in the main run), a grader pattern that mislabelled a correct claim, and a source check that used the wrong stage's documents. They are in the amendment log and the pilots are kept unpooled.

## What this means

For this model and task, a plain "workers write their own notes" store was as accurate as a curator or an evidence gate and more complete. The experiment cannot say it would stay that way against a harder trap.

## What next

A trap that cannot be defeated by reading the spec: a plausible false source with a real-looking quote, a changelog that contradicts itself, or a store where the true answer is not in any official document. That would exercise the curator and the gate.

## Reproduce

The folder holds the service, hidden tests, grader, runner, analysis, chart source and every store's history. The report lists the commands: [REPORT.md](https://github.com/meabs/experiments/blob/f10e1b05e2957d75c3c3d07548a1023014a993ad/2026-11-knowledge-factory/REPORT.md).
