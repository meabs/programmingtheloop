---
title: "Incomplete OpenAPI success codes (experiment H3)"
description: "A contract that listed only one success code led agents to treat the service's other success code as an error."
date: 2026-10-17
summary: "Guide recommendation note: an incomplete success-code list in a contract led agents to treat another success code as an error."
type: "Controlled trial"
github:
  - label: "OKFExperiment"
    href: "https://github.com/meabs/OKFExperiment"
guideLinks:
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
draft: false
experimentId: "H3"
question: "What goes wrong if a provider contract lists only one of the service's success codes?"
status: published
evidenceGrade: published
publishedOn: 2026-10-13
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/main/README.md"
topics:
  - context
  - verification
findings:
  - id: "H3-1"
    statement: "A contract that listed only one success code led agents to treat the service's other success code as an error"
    limits:
      - "described in the Guide as one small trial"
      - "one model (OKF series)"
      - "pass-rate tables in results/H3-runnable-service.md measure a broader H3 harness; the success-code claim is cited from the README / Guide recommendation, not restated as a pass count here"
    source: "https://github.com/meabs/OKFExperiment/blob/main/README.md"
    status: current
    featured: false
---

## Question

What goes wrong if a provider contract lists only one of the service's success codes?

## Prediction

None written down for H3 in the Guide.

## Set-up

Guide recommendation (Chapter 3): supply a versioned API contract listing every success and error response. The Guide cites OKFExperiment README, experiment H3, for the incomplete success-code failure mode. A related trial table lives in results/H3-runnable-service.md (broader contract/note/guide/source comparison on a runnable service).

## Results

Finding H3-1 is below. I have left `value` and `n` empty rather than pull a pass count from H3-runnable-service.md that may not be the same claim.

## Limits

Guide frames it as one small trial. See also RESULTS / README Limits for the OKF series (one model; small cells).

## Reproduce

[OKFExperiment](https://github.com/meabs/OKFExperiment) README (experiment H3). Guide does not list commands.
