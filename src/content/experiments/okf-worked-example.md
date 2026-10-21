---
title: "OKFExperiment and the worked example"
description: "Controlled trials on facts across a repository boundary, stale knowledge, and a reproducible worked example with agent trials."
date: 2026-10-17
summary: "Where the agent can't read a dependency, the right facts decide the outcome. Stale facts get repeated. Agents without a contract defeated the freshness gate."
type: "Controlled trials"
github:
  - label: "OKFExperiment"
    href: "https://github.com/meabs/OKFExperiment"
  - label: "Worked example"
    href: "https://github.com/meabs/ProgrammingTheLoop-WorkedExample"
guideLinks:
  - label: "Foreword findings"
    href: "/guides/programming-the-loop/foreword/"
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
  - label: "Chapter 5 — Proof, not promises"
    href: "/guides/programming-the-loop/proof-not-promises/"
  - label: "About the evidence"
    href: "/guides/programming-the-loop/about-the-evidence/"
draft: false
experimentId: "OKF"
question: "When a dependency is unread or stale, and when verification can be rewritten, what decides the outcome?"
status: published
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "medium reasoning (findings OKF-1 and OKF-2)"
  - name: "Cursor composer-2.5"
    model: "composer-2.5"
    settings: "worked-example agent trials (finding OKF-3)"
runs: "~1,650"
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
topics:
  - context
  - verification
  - measurement
publishedOn: 2026-10-17
findings:
  - id: "OKF-1"
    statement: "Out-of-date knowledge of a dependency the agent could not read was repeated as fact; none of the wrong answers hedged"
    metric: "drift answers that gave the old fact (stale bundle arm)"
    value: "14 / 16"
    n: "4 runs per question"
    limits:
      - "the drift was planted"
      - "4 runs per question"
      - "one model"
    source: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
    status: current
    featured: true
  - id: "OKF-2"
    statement: "When missing backend facts were supplied, cross-repository changes went from failing to mostly passing"
    metric: "hidden-test passes out of 20"
    value: "3 → 18–19"
    n: "5 runs per task"
    limits:
      - "5 runs per task"
      - "identifiers renamed by me"
      - "one model"
    source: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
    status: current
    featured: true
  - id: "OKF-3"
    statement: "On the worked example's task, agents without the contract defeated the freshness gate; all runs reported passed while criterion 6 stayed unverified"
    metric: "agent trials (with and without contract)"
    value: "12 runs"
    n: "6 runs per arm"
    limits:
      - "one model (composer-2.5)"
      - "one task"
      - "6 runs per arm"
    source: "https://github.com/meabs/ProgrammingTheLoop-WorkedExample/blob/main/agent-trials/results.md"
    status: current
    featured: true
---

## What this covers

[OKFExperiment](https://github.com/meabs/OKFExperiment) holds about **1,650 controlled runs** on generated knowledge, contracts and stale documentation (Chapter 1 evidence table). Through the book it supplies the cross-repository and drift trials. The [worked example](https://github.com/meabs/ProgrammingTheLoop-WorkedExample) is a reproducible demonstration of the failure modes those trials found, with separate agent trials on its own task.

## Headline results (with limits in the Guide)

**Stale knowledge.** After I renamed four things in a backend the agent couldn't read, agents with the stale guide gave the old answer in **14 of 16** drift answers, and none of the wrong answers hedged. *Limits:* planted drift, 4 runs per question, one model.

**Facts across a boundary.** A storefront change depended on a backend the agent could not see. With nothing, **3 of 20** runs passed the hidden tests; with a guide to the backend, **19 of 20** on small tasks and **18 of 20** on harder ones. *Limits:* 5 runs per task, identifiers renamed by me, one model.

**Worked-example agent trials.** On the worked example's task, agents without the provider contract rewrote the freshness gate so it compared an invented contract with itself. All **12 runs** (with and without the contract) reported `passed` while listing the brief's check against the real inventory service as unverified. With the contract, all 6 runs were correct. *Limits:* one model (`composer-2.5`), one task, 6 runs per arm.

## Where to read more

- Findings in brief: [Foreword](/guides/programming-the-loop/foreword/)
- Cross-repo, stale knowledge, and contracts: [Chapter 3](/guides/programming-the-loop/right-facts/)
- Freshness gates and independent checks: [Chapter 5](/guides/programming-the-loop/proof-not-promises/)
- How the worked example was built: [Chapter 1](/guides/programming-the-loop/facts-checks-upkeep/) and [About the evidence](/guides/programming-the-loop/about-the-evidence/)
