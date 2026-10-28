---
title: "Does a team of coding agents beat one agent? (experiment SWT)"
description: "I gave Codex six feature tasks, either alone or as a team: a planner, a coder and a reviewer. One agent passed 56.8% of the hidden acceptance tests; the team passed 25.7%, at higher cost. The reason was the hand-off: only the planner saw the task, and its summary lost the details. Giving every agent the task file brought the team level with one agent (54.1%), still at higher cost."
date: 2026-10-26
summary: "On six features, one Codex agent passed 56.8% of hidden acceptance tests and a planner–coder–reviewer team 25.7%. A bigger team reached 48.1% at 3.7 times the cost. Giving every team member the task file closed most of the gap (54.1%), but the team never beat one agent. Every reviewer approval went to code that failed the tests."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/c899021a4298bb4f24c8b8fdae703b61739242b7/2026-10-swarm-tax"
draft: false
experimentId: "SWT"
question: "Does a team of coding agents (planner, coder, reviewer) get more of a feature right than one agent, and does any gain survive when one agent gets the same spend?"
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI 0.157, subagents via multi_agent_v2 (team arms)"
    model: "gpt-5.6-luna (hosted)"
    settings: "medium reasoning effort in every agent and subagent; each run in a fresh clone in a sandbox"
runs: 144
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/c899021a4298bb4f24c8b8fdae703b61739242b7/2026-10-swarm-tax/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/c899021a4298bb4f24c8b8fdae703b61739242b7/2026-10-swarm-tax/README.md"
previewImage: "/guide-images/chart-swt-teams.png"
previewAlt: "Share of hidden tests passed, higher is better: one agent 56.8%, team of planner, coder and reviewer 25.7%, bigger team with two coders and three reviews 48.1%, team with the task file for every agent 54.1%. Cost per run, lower is better: $0.073, $0.107, $0.272, $0.116."
topics:
  - review
  - measurement
  - safety-cost
  - parallel
publishedOn: 2026-10-26
findings:
  - id: "SWT-1"
    statement: "A planner–coder–reviewer team passed 25.7% of the hidden acceptance tests; one agent alone passed 56.8%, for less money"
    metric: "share of hidden tests passed (higher is better), team minus one agent, mean over six features"
    value: "−31.2 pts"
    interval:
      low: "−40.8 pts"
      high: "−21.9 pts"
      method: "bootstrap 95% CI within tasks; one-sided permutation test for the team doing better, Holm p 1.0"
    n: 72
    detail:
      - "the team was below one agent on 5 of 6 features and level on the sixth"
      - "cost per run: one agent $0.073, team $0.107; median time 2.3 and 3.9 minutes"
      - "one agent given the team's spend as two attempts did no better than one attempt here: every attempt compiled and none wrote a test, so nothing a user could see told the attempts apart"
    limits:
      - "one model at one effort level, six features in one Java codebase, team instructions written by me"
    source: "https://github.com/meabs/experiments/blob/c899021a4298bb4f24c8b8fdae703b61739242b7/2026-10-swarm-tax/REPORT.md"
    status: current
    featured: false
  - id: "SWT-2"
    statement: "Giving every team member the task file raised the team from 25.7% to 54.1% of hidden tests passed, level with one agent, at about 1.6 times its cost"
    metric: "share of hidden tests passed (higher is better), team with the task file minus team"
    value: "+28.5 pts"
    interval:
      low: "+18.4 pts"
      high: "+38.2 pts"
      method: "bootstrap 95% CI within tasks; one-sided permutation test, Holm p < 0.0001"
    n: 72
    detail:
      - "against one agent: −2.7 points (−13.7 to +8.2), Holm p 0.67, no measurable difference"
      - "in all 36 runs both the coder and the reviewer opened the task file (from their own commands)"
      - "without it, the team's code compiled but broke the interface the task stated: wrong JSON shapes and status codes"
    limits:
      - "designed after the main results and before it ran; run a few hours later than the main runs"
    source: "https://github.com/meabs/experiments/blob/c899021a4298bb4f24c8b8fdae703b61739242b7/2026-10-swarm-tax/REPORT.md"
    status: current
    featured: false
  - id: "SWT-3"
    statement: "Every time an agent reviewer approved a change, the change failed hidden acceptance tests: 24 of 24 approvals"
    metric: "final reviews that approved, and of those, changes failing hidden tests"
    value: "24 of 24"
    n: 108
    detail:
      - "team 3 of 3, bigger team 18 of 18, team with the task file 3 of 3"
      - "107 of 108 main-run final reports said their checks passed; 104 of those failed hidden tests, usually after checking only that the code compiled"
    limits:
      - "the hidden tests are stricter than what the reviewer was asked to check; the reviewer was told to run the relevant tests, and no agent wrote any"
    source: "https://github.com/meabs/experiments/blob/c899021a4298bb4f24c8b8fdae703b61739242b7/2026-10-swarm-tax/REPORT.md"
    status: current
    featured: false
---

## Question

Multi-agent coding is sold as the next step after a single agent: a planner splits the work, coders write it, a reviewer checks it. The demos usually show the team doing better, but they rarely hold the budget fixed. A team spends several agents' worth of tokens against one agent's.

The short version: on six real features, the team did worse than one agent, and cost more. The main reason was the hand-off. Only the planner saw the task, and the details the coder needed got lost in its summary. When every agent could read the task itself, the team caught up with one agent, but never beat it. And the agent reviewer approved broken code every time it approved anything.

I wanted to know two things:

- does a team of coding agents get more of a feature right than one agent?
- if it does, is that the team's structure, or just that it spends more?

## Prediction

Before the runs, I published the design and three hypotheses ([README.md](https://github.com/meabs/experiments/blob/c899021a4298bb4f24c8b8fdae703b61739242b7/2026-10-swarm-tax/README.md)):

- **H1.** The team scores higher than one agent.
- **H2.** The team and one agent given the same spend, as several attempts, differ.
- **H3.** A bigger team scores higher than the small one.

The follow-up (the task file for every agent) was designed after the main results, before it ran, with its own two hypotheses and a rule fixed in advance for reading the result.

## Set-up

**The agent:**
- **Codex CLI 0.157** with the hosted `gpt-5.6-luna` model at medium reasoning effort, in every agent and subagent.
- **Teams use Codex's own subagents.** Each starts with no conversation history, so the reviewer really looks with fresh eyes. There's no outside framework, so the only difference between setups is how the work is organised.
- **Each run in a fresh copy** of shopizer, an open-source Java shop, in a sandbox that shows the agent only its own copy.

**Four setups:**

| Setup | What happens |
| --- | --- |
| One agent | Gets the task and does it |
| Team | A planner (not allowed to edit files) plans and briefs one coder; a fresh reviewer checks the change and approves it or asks for changes; one round of fixes |
| Bigger team | As the team, with up to two coders and up to three rounds of review |
| Team + task file (follow-up) | As the team, but the task is also in the repository as `TASK.md`, and the coder and reviewer are told to read it |

The team with the task file still breaks the work down: the planner plans and hands it on. The only change is that the requirements aren't lost along the way, the way every developer in a human team can still read the ticket.

**The tasks:** six features, each written as a need with the interface fixed (web addresses, JSON fields, status codes, rules): discount codes, quantity price tiers, a wishlist, back-in-stock alerts, product questions with moderation, and cart limits. Each has 13 to 16 **hidden acceptance tests** that the agents never see, and a reference implementation I wrote that passes them all.

**Scoring:** the share of a feature's hidden tests the code passes. **Higher is better**: 100% means the feature works as the task asked. 6 runs per feature per setup: 108 runs, plus 36 for the follow-up.

## Results

Findings SWT-1 to SWT-3 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-swt-teams.png" alt="Share of hidden tests passed, higher is better: one agent 56.8%, team of planner, coder and reviewer 25.7%, bigger team with two coders and three reviews 48.1%, team with the task file for every agent 54.1%. Cost per run, lower is better: $0.073, $0.107, $0.272, $0.116." width="1800" height="920" loading="lazy" />

<figcaption>One agent passed more of the hidden tests than any team, for the least money. Giving every team member the task file brought the team level, at higher cost. Source: github.com/meabs/experiments, 2026-10-swarm-tax/results (Codex 0.157, gpt-5.6-luna, medium effort).</figcaption>

</figure>

### One agent beat the team

Share of hidden tests passed, by feature (higher is better):

| Feature | One agent | Team | Bigger team | Team + task file |
| --- | --- | --- | --- | --- |
| Back-in-stock alerts | 21.8% | 17.9% | 21.8% | 30.8% |
| Cart limits | 63.1% | 26.2% | 59.5% | 67.9% |
| Discount codes | 39.6% | 18.8% | 31.2% | 22.9% |
| Product questions | 91.7% | 27.4% | 54.8% | 76.2% |
| Price tiers | 38.1% | 38.1% | 69.0% | 53.6% |
| Wishlist | 86.7% | 25.6% | 52.2% | 73.3% |
| **Mean over features** | **56.8%** | **25.7%** | **48.1%** | **54.1%** |

The team did as it was told. Every team run spawned its coder and reviewer, no planner edited a file, and in 34 of 36 runs the planner sent the reviewer's faults back for a round of fixes. It still built less of each feature than one agent did.

The bigger team was better than the small one on all six features (+22.4 points), but still below one agent on four, at 3.7 times the cost per run.

### Why: the requirements were lost in the hand-off

The team's code compiled, but it broke the interface the task spelled out. In one product-questions run, the public list came back as a plain array where the task asked for `{"count": …, "items": […]}`, and an unknown question gave 400 where the task asked for 404. Of the field names and status codes each task stated, one agent's code contained 84%, the team's 63%. In four runs a reviewer went searching the folders above its copy for the task description it had never been given.

Codex stores the messages between agents encrypted, so I couldn't read what the planner passed on. So I tested it: the same team, with the task also in the repository for every agent to read. Both the coder and the reviewer opened it in all 36 runs. The team went from 25.7% to 54.1% (+28.5 points, 95% interval +18.4 to +38.2), closing about nine-tenths of the gap. Against one agent, the difference was −2.7 points (−13.7 to +8.2): no measurable difference.

### The reviewer approved broken code every time

Every time an agent reviewer ended with "approve", the change failed hidden tests: 24 approvals out of 24 across the three team setups. And 107 of 108 final reports in the main runs said their checks had passed. 104 of those failed hidden tests, usually after checking only that the code compiled.

### No agent wrote a test

Across all 144 runs, no agent added a single test, although every task described behaviour that tests could pin down. That's why "one agent, given the team's budget as two attempts" did no better than one: every attempt compiled, and with no tests there was nothing to tell a good attempt from a bad one. If you could pick the better of two attempts (which needs the hidden tests, so it's an upper bound only), the score would rise to 68.9%.

### Hypotheses

| # | Comparison | Difference (points of hidden tests passed) | 95% interval | Holm p | Verdict |
| --- | --- | --- | --- | --- | --- |
| H1 | team − one agent | −31.2 | −40.8 to −21.9 | 1.0 | Not supported: the team did worse |
| H2 | team − one agent with the same spend | −31.2 | −40.8 to −21.9 | < 0.0001 | They differ, in one agent's favour |
| H3 | bigger team − team | +22.4 | +13.0 to +31.5 | 0.0001 | Supported |
| H4 | team + task file − team | +28.5 | +18.4 to +38.2 | < 0.0001 | Supported |
| H5 | team + task file − one agent | −2.7 | −13.7 to +8.2 | 0.67 | No measurable difference |

A negative difference means the first setup did worse. The Holm p is the chance of a difference this large if there were really none, corrected for testing several hypotheses; below 0.05 counts as measurable. H4 and H5 are the follow-up, corrected together.

### Cost

| | One agent | Team | Bigger team | Team + task file |
| --- | --- | --- | --- | --- |
| Cost per run (lower is better) | $0.073 | $0.107 | $0.272 | $0.116 |
| Cost per hidden test passed (lower is better) | $0.009 | $0.029 | $0.040 | $0.015 |
| Median time per run (lower is faster) | 2.3 min | 3.9 min | 6.9 min | 3.4 min |

### Checks on the runs

- **All 144 runs finished and were graded;** none timed out.
- **Model and effort** were checked in every session file, subagents included.
- **No agent could see the hidden tests:** every command was audited from the session files, and the reviewers' searches above their copy found only their own copy.
- **A first attempt at the team runs stalled.** My instructions named a messaging tool that doesn't wake an agent that has finished, so in 3 of the first 9 team runs the planner waited an hour for a reply that never came, with no error. I stopped those runs, corrected the instructions and reran both team setups; the stopped runs are published but not analysed.

## Limits

- **One model at one effort level,** six features in one Java codebase, and team instructions I wrote. Other team designs, models or kinds of work could come out differently.
- **Six features is few.** The tests say how confident to be about these six; across features, the team was below one agent on 5 of 6 and level on the sixth.
- **The budget was matched afterwards, by cost, not time.** A team's agents can work in parallel.
- **The follow-up was designed after seeing the main results** (before it ran) and tests one way of sharing the requirements.
- **A real split wasn't tested:** a planner dividing a feature into parts, each coder given only its part and that part's requirements.

## What this means: impact and risks

This part is my interpretation, not a measurement.

**A team of agents is not a free upgrade.** The standard planner–coder–reviewer setup got less of each feature right than one agent, cost more and took longer. If you're adopting agent teams on the strength of demos, measure them on your own work against one agent with the same budget.

**Hand-offs are where requirements get lost.** When one agent summarises a task for another, the exact details go missing: field names, status codes, edge cases. Those are the details that break integrations, and the loss is invisible: the code compiles and the reviewer approves. **If you use agent teams, put the original requirements where every agent reads them, not only in the planner's prompt.** Even then, on work of this size, the team only caught up.

**An agent reviewer gives false assurance.** Every approval in these runs went to code that failed its acceptance tests. A process that treats "the reviewer agent approved" as a quality gate would have shipped all of them, and a person who sees that approval may check less.

**Agent teams can fail silently.** One wrong tool name left the team waiting an hour with no error and no fix round. A team has more moving parts that can stall without anyone noticing.

**More attempts need a way to choose.** Running an agent several times only helps if you can tell the best attempt. With no tests written, every attempt looked equally good. Require tests, or keep your own acceptance tests, before paying for extra attempts.

**Don't take an agent's word that it's done.** 104 of 107 reports of passing checks were wrong about the feature, alone or in teams.

**What to do about it:**
- Compare any team setup against one agent on your own tasks, with cost recorded.
- Give every agent the original requirements, not a summary.
- Don't treat an agent reviewer's approval as evidence; run independent acceptance tests.
- Ask agents to write tests for the stated interface, and check that they did.
- Watch team runs for stalls: a hand-off can fail with no error.

## What would be worth testing next?

These are proposals, not results.

- **A real split:** a planner that divides a feature into parts, with each coder given its part and that part's requirements, against one agent with the same budget.
- **Teams that must write tests:** a coder told to add tests for the stated interface, and a reviewer that writes acceptance tests from the requirements before reading the change.
- **A realistic way to choose between attempts,** such as a judge model, to see how close it gets to the 68.9% upper bound.

## Reproduce

Everything is in [experiments/2026-10-swarm-tax](https://github.com/meabs/experiments/tree/c899021a4298bb4f24c8b8fdae703b61739242b7/2026-10-swarm-tax):

- the tasks, hidden tests and reference implementations (`tasks/`, `hidden/`, `reference/`);
- the team instructions (`arms/`);
- the grader and trial generator (`scripts/`);
- every run's grading files, diff, event stream and session audit (`results/`);
- the analysis and chart scripts (`scripts/analyse.py`, `scripts/analyse_followup.py`, `scripts/charts.py`).

The commands are in REPORT.md, section 10.
