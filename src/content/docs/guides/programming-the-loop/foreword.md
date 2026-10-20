---
title: "Foreword: why I ran the experiments"
description: "From Programming the Loop — Foreword: why I ran the experiments."
---

<p class="guide-edition-note">Free to read on the web. <a href="/downloads/">October 2026 PDF</a> · <a href="/updates/">Updates</a></p>

I have worked in infrastructure and cloud architecture for over 25 years. My roles have included Senior Solutions Architect at Amazon Web Services and, earlier, positions at Barclays, Rathbones, Gartner, Unilever and Microsoft. At AWS my work included generative AI proofs of concept and projects focused on retrieval-augmented generation (RAG): systems whose quality depends on what information reaches the model.

When I started using coding agents on my own projects, I noticed two things very quickly: they were impressively capable when they had the right context, and they were remarkably expensive when fed everything "just in case". At the same time, a new cottage industry of advice was springing up, telling teams to write sprawling `AGENTS.md` files, build knowledge graphs, and generate markdown guides for every package in their repository. Having spent years building RAG systems where drowning the model in irrelevant chunks hurts both cost and accuracy, that advice made me suspicious. I wanted to know, with actual numbers rather than single-run anecdotes, which parts of an "agent-ready" repository pay for their upkeep, and which parts are just burning tokens.

Some of the published advice about coding agents (frontloading rich context, generating knowledge layers for the repository) rests on an assumption: the more you tell an agent about your repository, the better it does. My experiments test that assumption, and the results below are where it held and where it didn't.

## The findings in brief
These are results from my own controlled trials on a handful of repositories, with one agent for findings 1 to 3 (OpenAI's Codex, recorded as `gpt-5.6-luna` at medium reasoning) and Cursor's `composer-2.5` for finding 4. They are individual experimental results with stated limits, not laws of nature.

1. **A fully "agent-optimised" repository cost more and was not reliably more correct.** On a large Java backend the agent could read, a copy set up the recommended way (a generated guide, a code graph, three operating skills and a configured `AGENTS.md`) used **35–48% more tokens**, with no reliable gain in correctness: 29 against 28 of 32 changes, 19 against 16 of 24 structure questions, both within noise. *Limits:* one repository, one model, mechanical edits and structure questions, 8 runs per task per arm, four ingredients tested together. *Source:* [OKFExperiment, results/J-optimised-repo.md](https://github.com/meabs/OKFExperiment/blob/main/results/J-optimised-repo.md); analysed in [Chapter 3](/guides/programming-the-loop/right-facts/).
2. **Out-of-date knowledge of a dependency the agent couldn't read was repeated as fact.** After I renamed four things in a backend, agents with the stale guide and no source to check gave the old answer in **14 of 16** drift answers, and none of the wrong answers hedged. *Limits:* the drift was planted, 4 runs per question, one model. *Source:* [OKFExperiment, docs/RESULTS.md, section D2](https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md); analysed in [Chapter 3](/guides/programming-the-loop/right-facts/).
3. **When the missing backend facts were supplied, cross-repository changes went from 3 to 18–19 passes out of 20.** A storefront change depended on a backend the agent could not see. With nothing, 3 of 20 runs passed the hidden tests; with a guide to the backend, 19 of 20 on small tasks and 18 of 20 on harder ones. A later experiment found an API contract or a 3 KB note did about as well, more cheaply. *Limits:* 5 runs per task, identifiers renamed by me, one model. *Source:* [OKFExperiment, docs/RESULTS.md, sections F and G](https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md); analysed in [Chapter 3](/guides/programming-the-loop/right-facts/).
4. **On the worked example's own task, the agents without the contract defeated the check meant to catch them:** each rewrote the freshness gate so that, with no provider contract to hand, it compared the contract the agent had invented with itself, and passed. Their reports still matched their command logs. All 12 runs, with and without the contract, reported `passed` while listing the brief's criterion 6, a check against the real inventory service, as unverified. With the contract, all 6 runs were correct. *Limits:* one model, one task, 6 runs per arm. Analysed in [Chapters 3 and 5](/guides/programming-the-loop/right-facts/).

## What I predicted, and what happened
Going into Experiment J, I expected the code graph and the generated guide to pay for themselves on a 1,173-file Java monolith. When a human joins a codebase that size, a map saves hours of grepping, and it seemed obvious that handing an agent a one-call tool for caller chains and package summaries would stop it wandering around the tree. I wrote the predictions down before any counted run ([docs/EXPERIMENT_J.md](https://github.com/meabs/OKFExperiment/blob/main/docs/EXPERIMENT_J.md)), which is why I can say which ones were wrong. I predicted the set-up repository would answer structure questions with *fewer* tokens, because the graph answers caller and path questions in one call. It used 1.56 times *more* (ratio of the two arms' mean tokens on the questions). I also half expected the agent to ignore the tools, and predicted it would read a skill file in fewer than half the runs. It read the navigation skill in 55 of 56. It read the skills, queried the graph, opened the guide pages, and then searched and read the Java source anyway. The extra layers didn't replace source navigation. They sat on top of it, and I paid for both.

Where the agent could not read a dependency, the result went the other way: facts were the difference between mostly failing and mostly passing. And when those facts were out of date, nothing written *inside* them (confidence labels, warning banners, expiry dates) stopped the agent repeating them.

## The argument of this book
Those results add up to one thesis:

> **Agents need the right facts, not every fact. They need executable verification, not reassuring instructions. And every additional layer of agent infrastructure must justify its existence.**

That's a claim about cost and correctness together, so it needs putting carefully. On a repository the agent could read, less context cost less, and the experiment found no reliable difference in correctness between the two set-ups (finding 1). Across a repository boundary, the right facts gave much better code (finding 3: 3 to 18–19 passes of 20). None of that argues for giving the agent no context. It argues for current, task-relevant facts and a way for the agent to check its own work.

## Findings and recommendations
The subtitle says "what I measured", so it matters which statements are measured and which are judgement. In this book:

- **Findings** are in the case-study boxes. Each gives the numbers, the file they come from and the limits of the result. They describe my trials and nothing wider.
- **Recommendations** are in the sections headed *Recommendation*, in the checklists, the cheat sheet and the take-home kit. They are my engineering judgement, informed by the findings and by other practitioners' published practice. Where a recommendation goes beyond what I measured, the text says so.

[Chapter 10](/guides/programming-the-loop/safety-cost-human/) draws the same line for security and cost, and [Chapter 11](/guides/programming-the-loop/take-home-kit/)'s Default/Conditional/Experimental labels are about how to adopt a practice rather than how strong the evidence is.

## How the book is laid out
Eleven chapters, one of them ([Chapter 7](/guides/programming-the-loop/parallel-agents/), on parallel agents) deliberately short. Each gives the evidence (one of my experiments, or the worked example), sets out what other practitioners think, including where they disagree with me, and ends with a recommendation, a **Try this on your repository** exercise and a short checklist. The practitioners I lean on (Simon Willison, Kent Beck, Andrej Karpathy, Mitchell Hashimoto, Armin Ronacher, Geoffrey Huntley, Harper Reed and lauren, @poteto) are quoted sparingly and linked so you can read them in full. They are better than my summaries.

One **worked example** runs through the book: *add an API endpoint with a cross-repository dependency*. It is a **reproducible engineering demonstration** of the failure modes the agent experiments found (guessed facts, stale knowledge, unverifiable claims), not a recorded agent session. It is published at [meabs/ProgrammingTheLoop-WorkedExample](https://github.com/meabs/ProgrammingTheLoop-WorkedExample); [Chapter 1](/guides/programming-the-loop/facts-checks-upkeep/) explains how it was built.

[Chapter 3](/guides/programming-the-loop/right-facts/) is the heart of the book. If you have twenty minutes, read it and [Chapter 5](/guides/programming-the-loop/proof-not-promises/), then go straight to the take-home kit in [Chapter 11](/guides/programming-the-loop/take-home-kit/). If you are about to give an agent your production credentials, read [Chapter 10](/guides/programming-the-loop/safety-cost-human/) first.

Right. Kettle on, and we'll make a start.
