---
title: "AgentGraphWorkTree evaluation"
description: "Code-graph accuracy and agent token cost: multi-hop questions cheapen; simple lookups do not overall."
date: 2026-10-17
summary: "Graph facts are mostly correct when sampled; multi-hop callers of callers cut tokens; simple lookups were level or dearer overall."
type: "Evaluation"
github:
  - label: "AgentGraphWorkTree"
    href: "https://github.com/meabs/AgentGraphWorkTree"
guideLinks:
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
  - label: "Chapter 9 — Tools and honest measurement"
    href: "/guides/programming-the-loop/tools-measurement/"
draft: true
experimentId: "AGWT"
question: "Are the graph's facts correct, and when does the graph reduce agent tokens?"
status: planned
evidenceGrade: published
repo: "https://github.com/meabs/AgentGraphWorkTree"
report: "https://github.com/meabs/AgentGraphWorkTree/blob/main/docs/EVALUATION.md"
topics:
  - context
  - measurement
findings:
  - id: "AGWT-1"
    statement: "On Shopizer, high-confidence Java call links matched bytecode 13,380 of 13,380; medium-confidence 8,947 of 8,957"
    metric: "call links correct vs bytecode"
    value: "13,380 / 13,380 high; 8,947 / 8,957 medium"
    limits:
      - "Java figures carried over from an earlier project and not re-derived for EVALUATION.md"
      - "two Java projects in the write-up"
    source: "https://github.com/meabs/AgentGraphWorkTree/blob/main/docs/EVALUATION.md"
    status: current
    featured: false
  - id: "AGWT-2"
    statement: "For callers-of-callers questions, the graph cut tokens sharply (Codex 84k against 196k; Cursor 121k against 414k; Copilot 161k against 181k)"
    metric: "tokens per question (callers --depth)"
    value: "Codex 84k vs 196k"
    n: "36 runs across Click and Express (Guide fig. 3.3)"
    limits:
      - "token totals are not comparable between agents"
      - "provisional cells with few runs per arm in places"
      - "one question type"
    source: "https://github.com/meabs/AgentGraphWorkTree/blob/main/docs/EVALUATION.md"
    status: current
    featured: false
  - id: "AGWT-3"
    statement: "Across 192 runs on Python and TypeScript repositories the graph did not reduce tokens overall; agents ran kg and then checked with grep"
    metric: "overall token cost vs plain"
    value: "no overall reduction"
    n: 192
    limits:
      - "accuracy at ceiling in those arms"
      - "questions chosen to have clean checkable answers"
    source: "https://github.com/meabs/AgentGraphWorkTree/blob/main/docs/EVALUATION.md"
    status: current
    featured: false
---

## Question

Are the graph's facts correct, and when does the graph reduce agent tokens?

## Prediction

None recorded as a pre-registration link in the Guide for this evaluation.

## Set-up

AgentGraphWorkTree: deterministic code graph, no language model in the extractor. Accuracy checks (bytecode, runtime tracer, hand samples, `kgen audit`) and controlled agent token-cost trials. Chapter 3 and Chapter 9; docs/EVALUATION.md.

## Results

Findings AGWT-1..3 are in the table below. Further accuracy and audit figures are in Chapter 9 and EVALUATION.md.

## Limits

EVALUATION.md threats: small samples; Java figures carried over and not re-derived; answer keys written by the tool authors; questions favour clean `grep`-able answers; models and CLIs change.

## Reproduce

[AgentGraphWorkTree](https://github.com/meabs/AgentGraphWorkTree). EVALUATION.md describes `kgen audit` and trial set-ups; follow the repository docs for commands.
