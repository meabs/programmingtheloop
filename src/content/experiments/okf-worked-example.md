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
