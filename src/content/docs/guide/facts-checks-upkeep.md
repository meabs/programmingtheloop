---
title: "1. Facts, checks and upkeep"
description: "From Programming the Loop — 1. Facts, checks and upkeep."
---

<p class="guide-edition-note">Living web edition of the October 2026 first edition. <a href="/downloads/">Archived PDF</a> · <a href="/updates/">Updates</a></p>

First, some groundwork: the terms, the evidence in outline, and the example we'll follow through the book. The thesis is in the Foreword, and the rest of the book tests it a chapter at a time.

Speed was never the problem I wanted to solve with coding agents. They already type faster than any of us ever will. I wanted to stop them being confidently, plausibly wrong: writing code against guessed APIs, trusting stale documentation, or reporting "all tests pass" when the test suite never actually ran. If you can't trust the loop, speed just means you arrive at the wrong destination with a bigger diff to unpick.

## What a coding agent is

Simon Willison's definition is the cleanest: “Agents run tools in a loop to achieve a goal” (Simon Willison, [“What is agentic engineering?” (Agentic Engineering Patterns)](https://simonwillison.net/guides/agentic-engineering-patterns/what-is-agentic-engineering/)). The agent reads files, runs commands, edits code, looks at the result and decides what to do next, until *it* judges the goal met. That last part is the trap. A chatbot hands you text and you decide what to do with it. An agent acts, and checks in when it thinks it's finished.

So the questions that matter are: what does the agent know when it starts, how does it find out the rest, and how does it, and you, know when it's actually done?

## The evidence, in outline

My experiments are published as four repositories. I'll refer to them throughout:

| Repository | What it is | Licence |
|---|---|---|
| [OKFExperiment](https://github.com/meabs/OKFExperiment) | About 1,650 controlled runs on generated knowledge, contracts and stale documentation | MIT |
| [AgentTrialRig](https://github.com/meabs/AgentTrialRig) | The harness for repeated A/B trials of agents, with intervals | MIT |
| [AgentGraphWorkTree](https://github.com/meabs/AgentGraphWorkTree) | A deterministic code graph for agents, and its evaluation | MIT |
| [AgentFrictionLoop](https://github.com/meabs/AgentFrictionLoop) | Agent friction notes via git hooks, plus a weekly review | MIT |

The headline results are in the Foreword. Put side by side, they point one way:

- **Where the agent can read the code, extra knowledge mostly adds cost** and not correctness (Foreword, finding 1).
- **Where it can't, the right facts decide the outcome** (finding 3).
- **Out-of-date facts get repeated as fact,** and agents don't flag them: with a stale guide and no source to check, agents gave the old answers without hedging, where agents reading the current source did not (finding 2).
- **Executable checks beat prose.** When a test prerequisite moved from a sentence in `AGENTS.md` into a script, agents stopped tripping on it ([Chapter 5](/guide/proof-not-promises/)).

[Chapter 3](/guide/right-facts/) analyses the first three.

Those are findings, with limits given where each is introduced; what follows from them is labelled as recommendation.

## Where practitioners agree, and where they don't

The practitioners I read mostly agree about responsibility and verification, and are more divided about how much context to give.

On responsibility there's no disagreement at all. Armin Ronacher, on a project where most of the code was agent-written: “I still treat every line as my responsibility, judged as if I wrote it myself.” (Armin Ronacher, [“90%” (29 Sep 2025)](https://lucumr.pocoo.org/2025/9/29/90-percent/)) Your name is on the commit. The agent doesn't get paged.

On where agents fit, Andrej Karpathy coined "vibe coding" for prompting while you “forget that the code even exists” (Andrej Karpathy, [“vibe coding” post on X (2 Feb 2025)](https://x.com/karpathy/status/1886192184808149383)), and was clear it suits throwaway projects. Kent Beck draws the line for everything else: in what he calls augmented coding you care about the code, its complexity and its tests. If nobody but you will run it and it touches nothing you can't lose, vibe away. The rest of this book is about the other case.

How much context to give is where opinions really do differ. Some practitioners frontload rich context before any coding; Beck deliberately tells the agent only what it needs for the next step. My data sits closer to Beck for *knowledge about the code*, and closer to the frontloaders for *knowledge about the task*. Chapters 2 and 3 take that apart.

And on what the engineer's job becomes, Geoffrey Huntley's phrase gave this book its title. He describes himself as “programming the loop” (Geoffrey Huntley, [“everything is a ralph loop” (17 Jan 2026)](https://ghuntley.com/loop/)): still an engineer, but building the system that produces the code rather than typing it. A shipyard is a useful picture. The great yards on the Wear and the Tyne didn't build ships by having more people hammer rivets faster; they built jigs, cranes, slipways and inspection regimes. Your agents are the riveters now. You're building the yard.

## The worked example we'll follow

Abstract advice is easy to agree with and hard to apply, so one small, realistic change runs through the book: **add an API endpoint with a cross-repository dependency.** A `storefront-api` service must expose `GET /products/{sku}/availability`. The number it reports comes from an `inventory-service` owned by another team, whose code the agent can't see. It's the situation where my experiments found facts matter most.

| Stage | What happens | Chapter |
|---|---|---|
| 1 | Brief and acceptance criteria | 2 |
| 2 | Discover the code and the contract | 3 |
| 3 | Choose the smallest useful context | 3 |
| 4 | Implement a focused change, test first | 4 |
| 5 | Run the tests and verify real behaviour | 5 |
| 6 | Record friction and improve the tooling | 6 |
| 7 | Review the diff and the evidence | 8 |

The example is a **reproducible engineering demonstration of the failure modes the agent experiments found**, published at [meabs/ProgrammingTheLoop-WorkedExample](https://github.com/meabs/ProgrammingTheLoop-WorkedExample). It is not a recorded agent session. **The worked example's code was written by hand: the changes, the guessed-names variant and the friction note**, and the prompts in the text are illustrative. Every test run, `curl` response, diff summary and friction record shown is genuine output of its scripts, and `reproduce.sh` fails if any of them stops matching what the book says. In worked-example sections, "the agent" means "an agent doing this task". Separately, real agent trials were run on the same task, with and without the contract (12 runs of Cursor's `composer-2.5`); [Chapter 3](/guide/right-facts/) reports what they got right and [Chapter 5](/guide/proof-not-promises/) what they reported.

## Recommendation: three questions before any practice

Before you adopt any agent practice, including mine, ask three questions. *What facts does this give the agent that it couldn't get for itself? How will the agent prove its work, with something that runs? And what will this cost to maintain?* If you can't answer the third, you don't yet know what you're signing up for.

Distrust any claim based on a single run, including your own. In one of my trials, run-to-run spread was large enough that about 131 runs per arm would have been needed to detect a 20% cost difference; the trial had 16 ([results/H1-contract-vs-okf-changes.md](https://github.com/meabs/OKFExperiment/blob/main/results/H1-contract-vs-okf-changes.md)). When someone tells you a prompt trick doubled their productivity, ask how many runs. Usually the answer is one, on a Tuesday, with a following wind.

## Try this on your repository

1. Pick three recent, small, real tasks from your history: one bug fix, one feature, one refactor.
2. For each, write down in one line what the agent would need to know that it *can't* find by reading the repository (another team's API, a business rule, a deployment constraint).
3. Write down how the agent would prove the change works with a command that runs. If there's no such command, note that too.
4. Look at the two lists. The first is your real context problem; the second is your real verification problem.

## Checklist

- [ ] Use an agent that can run things, not a chat window, for real work.
- [ ] Own every line the agent writes.
- [ ] Before adopting a practice, ask: what facts, what check, what upkeep?
- [ ] Distrust single runs, including your own.
