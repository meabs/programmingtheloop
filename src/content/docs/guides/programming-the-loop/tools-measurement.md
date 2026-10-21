---
title: "9. Tools and honest measurement"
description: "From Programming the Loop — 9. Tools and honest measurement."
---

<p class="guide-edition-note">Free to read on the web. <a href="/downloads/">October 2026 PDF</a> · <a href="/updates/">Updates</a></p>

Boring tools win. An agent is only as useful as the tools it can reach, and the best ones are mostly fast, quiet command-line tools with clear errors. Specialised tools, such as a code graph, earn a place for specific question types rather than everywhere. And any change to your agent set-up should be measured with repeated runs and intervals, because a single before-and-after comparison tells you almost nothing. Those runs also have to be kept from seeing each other, because agents use whatever they can reach.

## What makes a tool agent-friendly

In rough order of importance:

1. **Fast.** An agent may call a tool dozens of times a session. A thirty-second test command that could be a three-second filtered one costs minutes per task.
2. **Clear errors.** The error message is the agent's next prompt. "Database has no tables: run `alembic upgrade head`" fixes itself; "exit 1" starts a search. The worked example's freshness gate prints `STALE: pinned inventory.openapi.yaml 2.1.0, provider publishes 3.0.0 (major change)`, which says what's wrong and where.
3. **Concise output.** Every line goes into the context window. Quiet by default, verbose on request.
4. **Hard to misuse.** Validate arguments; make destructive operations need an explicit flag.
5. **One command for one job,** set-up included ([Chapter 5](/guides/programming-the-loop/proof-not-promises/)).

Armin Ronacher's warning belongs on every internal tool's README: “Tools need to be protected against an LLM chaos monkey using them completely wrong.” (Armin Ronacher, [“Agentic Coding Recommendations” (12 Jun 2025)](https://lucumr.pocoo.org/2025/6/12/agentic-coding/)) His broader point is that anything can be a tool: a shell script, an MCP server (MCP, the Model Context Protocol, is a standard for exposing tools and data to agents), a log file. Before building an integration, ask whether a ten-line script in `scripts/` would do. Simon Willison makes the same observation: coding agents work very well with dedicated CLIs.

## Skills and saved prompts

Instructions you type again and again are candidates for a task-scoped skill, but the evidence here is mixed. The documentation-layer study (author's unpublished document; lower-grade evidence, see [Chapter 3](/guides/programming-the-loop/right-facts/)) found small skills were discovered and selected without prompting. Experiment J, which is published, found its three general operating skills were read (the navigation skill in 55 of 56 runs) and the set-up still cost more with no reliable gain. So put a procedure in a script if you can. Create a skill only for a procedure that really does recur, or is error-prone, and that a script can't carry, and check that it changes behaviour, because an unmaintained skill is another stale document.

## A code graph, measured

[Chapter 3](/guides/programming-the-loop/right-facts/) covered what [AgentGraphWorkTree](https://github.com/meabs/AgentGraphWorkTree) did for agents' costs. The other half is whether its facts are right, because a fast tool that gives wrong answers does more harm than no tool.

> **Case study: graph accuracy.** For Java, call links were checked against compiled bytecode: 13,380 of 13,380 high-confidence and 8,947 of 8,957 medium-confidence links correct on a large e-commerce backend (figures carried over from an earlier project, not re-derived). For Python, 378 of the 433 call edges whose caller ran (87%) were observed at runtime in Click's test suite. For TypeScript and JavaScript, 32 of 32 sampled edges were correct by hand. A built-in audit later measured precision at 100% on samples from Click and Express, but recall (how many real call sites the graph covers) at 74% for Click and 18% for Express, where untyped JavaScript gives no receiver type to resolve. *Source: [AgentGraphWorkTree, docs/EVALUATION.md](https://github.com/meabs/AgentGraphWorkTree/blob/aa98666dedd9eb3a2a2c9d3f0b89547f59c57988/docs/EVALUATION.md).* So what the graph says is almost always true, and what it leaves out depends heavily on the language. That's still no reason for agents to trust it unchecked, and in practice they didn't ([Chapter 3](/guides/programming-the-loop/right-facts/)).

The same evaluation lists alternatives tried: a model-built graph that cost $1.50 and 29 minutes for one small project and found 3 of 16 routes, and two other parsers with 48.5% and 83% correct call links. Deterministic parsing won on accuracy; it didn't win on cost for simple questions.

## Measuring honestly

Agent runs are expensive and noisy. In one arm of one trial, runs on the same questions ranged from 55k to 3.0 million tokens ([OKFExperiment, docs/RESULTS.md, D1](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/RESULTS.md)).

> **Case study: the trial rig.** [AgentTrialRig](https://github.com/meabs/AgentTrialRig) runs the same tasks across *arms* (variants of your set-up), agents and repetitions, each in a fresh clone. It measures tokens and tool calls from the agent's own output rather than its self-report, scores answers against keys you write, and reports each arm's cost relative to a baseline with a bootstrap interval. If the interval contains 1.00, the verdict is "no clear difference"; under 8 runs per arm, verdicts are marked provisional. The README is blunt: expect to need **20 or more runs per arm to detect a 20% difference**. Experiment H1's spread implied about 131 runs per arm; J's, about 33 ([results/H1](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/H1-contract-vs-okf-changes.md), [results/J](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results/J-optimised-repo.md)). It can't tell you whether an answer is *useful*, only whether it matches your key and what it cost. Answer keys can be wrong too.

### Agents use whatever they can reach

My trials are many agent runs side by side, and a trial is only valid if each run sees exactly what it should. Several didn't, and the failures are instructive.

> **Case study: agents find things.** In one experiment the agent was not supposed to have the backend source, but Codex could read the whole disk. Three of 24 runs in the "no backend" arm searched it; one found *another run's* generated guide in its work folder and answered correctly from it; two found copies of the backend source and still answered wrongly ([OKFExperiment, docs/RESULTS.md, D1](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/RESULTS.md)). In another, with network access on, 56 of 120 runs cloned the public repository from the internet; all 8 of the contract arm's correct answers were among them (README, H2). A third was contaminated badly enough that I drew no conclusions from it and archived it. The remedies are now part of the tooling: a fresh clone per run; a leak check ([OKFExperiment, scripts/leak_check.py](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/scripts/leak_check.py)) that flags any run reaching outside its workspace; a separate database per run in the FastAPI trial ([examples/fastapi-doc-layers](https://github.com/meabs/AgentTrialRig/blob/e54514ae9575c3f878031cce4fc45fcfc749f409/examples/fastapi-doc-layers/README.md)); and, on macOS, an option to deny the agent reads and writes outside its own work folder ([AgentTrialRig README](https://github.com/meabs/AgentTrialRig/blob/e54514ae9575c3f878031cce4fc45fcfc749f409/README.md)). Agents are resourceful, and isolation has to be enforced. None of this says anything about intent: searching the disk is a reasonable thing for an agent to do, and deciding what's reachable is the harness's job.

For parallel work in your own team the lesson is the same, and [Chapter 7](/guides/programming-the-loop/parallel-agents/) covers it: if two agents can see each other's files, databases or outputs, they will eventually interfere.

### Mistakes I made and kept

Honest measurement includes publishing your mistakes. From the OKF experiments ([README, Limits](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/README.md)):

- Early runs told the agent to verify in *every* arm, which hid the differences between arms. I reran them.
- The first version of one experiment let the agent answer from learned knowledge of the public project, so I renamed the identifiers before the real runs.
- Two experiments had grading defects found after the runs. In J, the first grader scored the hardest task 0 of 8 in both arms because it missed four strings every run had correctly updated; re-scored, it was 4 of 8 against 6 of 8 ([docs/EXPERIMENT_J.md, Deviations](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/EXPERIMENT_J.md)).
- One contaminated run is archived and unreported.

One more, from this book's own worked example. Its 9-test suite was meant to double as the hidden grader for the agent trials, but it is coupled to the hand-written implementation: it patches `inventory.get_stock(sku, transport=...)` and expects a tuple back. None of the 12 agents wrote that signature, so even the correct runs passed only 3 of 9. It grades conformity to my code, not correctness. The live check and a 7-check black-box behaviour test were the independent measures in the trials ([Chapter 3](/guides/programming-the-loop/right-facts/) and [Chapter 5](/guides/programming-the-loop/proof-not-promises/)), and the write-up says so.

Each is recorded next to the results it affected. Unnoticed, mistakes like these are how exciting blog posts get written.

## Will any of this last?

Harper Reed's caveat applies to every recommendation in this chapter, mine included: “This is working well NOW, it will probably not work in 2 weeks, or it will work twice as well.” (Harper Reed, [“My LLM codegen workflow atm” (16 Feb 2025)](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/)) Model names and tool versions in any source date fast; the measuring habit doesn't.

Is this much rigour necessary? Many experienced practitioners work by careful observation rather than controlled trials, and get excellent results. For a personal workflow, that's grand. For a team decision that adds maintenance to every repository, it isn't: the most "obvious" improvement I tested, the fully set-up repository, was reliably dearer with no reliable gain ([Chapter 3](/guides/programming-the-loop/right-facts/)).

## Recommendation: boring tools, measured changes

Prefer plain CLIs and small scripts. Make them fast, quiet and clear in their errors. Add specialised tools for the question types where they've been shown to help. Before keeping any change to your set-up, measure it: real tasks, several runs per arm, fresh clones, intervals, and a monthly re-run, because models and tools change under you.

## Try this on your repository

1. Time your test command from a fresh clone, and count the lines of output on a passing run. If it's slow or noisy, add a fast, quiet variant for agents.
2. Break something deliberately and read the error as if you were an agent. Does it say what to do next? Rewrite the one that doesn't.
3. Pick one change you've made to your agent set-up recently. Did you measure it? If not, set up two arms (with and without), run three tasks three times each, and look at the spread before you look at the mean.

## Checklist

- [ ] Prefer plain CLIs and small scripts to bespoke integrations.
- [ ] Fast, quiet, clear errors, hard to misuse; one command per job.
- [ ] Specialised tools for the questions they help; not everywhere.
- [ ] Check a tool's accuracy before trusting its output.
- [ ] Measure set-up changes with repeated runs and intervals.
- [ ] Fresh clone per run; check no run can reach another's files, or the network.
- [ ] Publish your mistakes and re-scores with your results.
