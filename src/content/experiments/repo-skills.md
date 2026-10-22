---
title: "Repository skills (experiment RSK)"
description: "Guidance written for this repository, left for the agent to find, did not measurably make its changes more often correct; the agent rarely opened the part on checking its work."
date: 2026-10-22
summary: "On 20 tasks in a Java online-shop backend, an agent-written AGENTS.md and three repository skills raised Codex's pass rate from 38 to 40 of 60 runs, too little to rule out chance; the agent opened the verification skill in only 8 runs."
type: "Controlled trial"
github:
  - label: "experiments"
    href: "https://github.com/meabs/experiments/tree/4eb88a9ef2dce98b987b0076b614ab206723f1ab/2026-10-repo-skills"
draft: false
experimentId: "RSK"
question: "Does guidance written for one repository (an AGENTS.md and skills on how to build, test, verify and change it) raise the share of changes that pass independent acceptance tests, when the agent is left to discover it?"
status: published
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "low reasoning, isolation on"
runs: 120
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/4eb88a9ef2dce98b987b0076b614ab206723f1ab/2026-10-repo-skills/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/4eb88a9ef2dce98b987b0076b614ab206723f1ab/2026-10-repo-skills/README.md"
topics:
  - verification
  - measurement
publishedOn: 2026-10-22
findings:
  - id: "RSK-1"
    statement: "Repository guidance left for the agent to discover did not measurably raise the pass rate: 40 of 60 runs passed, against 38 of 60 without it (p = 0.40)"
    metric: "guidance vs none, mean per-task difference in pass rate"
    value: "+3.3 pts"
    interval:
      low: "−8.3 pts"
      high: "+16.7 pts"
      method: "bootstrap 95% CI over 20 tasks"
    n: 120
    limits:
      - "one repository"
      - "one model at low reasoning effort"
      - "one set of guidance, written by an agent"
    source: "https://github.com/meabs/experiments/blob/4eb88a9ef2dce98b987b0076b614ab206723f1ab/2026-10-repo-skills/REPORT.md"
    status: current
    featured: false
  - id: "RSK-2"
    statement: "The agent read the skills on building and on changing code in every run, but opened the skill on checking a change through the API in only 8 of 60, and wrote a test of its own change in 2"
    metric: "runs that read the verification skill"
    value: "8/60"
    n: 60
    limits:
      - "reads counted from the commands the agent ran"
      - "one model at low reasoning effort"
    source: "https://github.com/meabs/experiments/blob/4eb88a9ef2dce98b987b0076b614ab206723f1ab/2026-10-repo-skills/REPORT.md"
    status: current
    featured: false
  - id: "RSK-3"
    statement: "The guidance cost little: each correct change cost 1.29 times as much as without it, against about 2.5 times for the Superpowers pack in earlier experiments"
    metric: "cost per run that passed, guidance vs none"
    value: "1.29×"
    interval:
      low: "1.01"
      high: "1.55"
      method: "bootstrap 95% CI over 20 tasks"
    n: 120
    limits:
      - "list prices"
      - "one repository"
    source: "https://github.com/meabs/experiments/blob/4eb88a9ef2dce98b987b0076b614ab206723f1ab/2026-10-repo-skills/REPORT.md"
    status: current
    featured: false
---

## Question

In my [verification experiment](/experiments/verify-vs-skills/), a paragraph telling the agent to check its change against the running application did not help. The agent tried to start the shop in 47 of 60 runs, but the shop does not start on its own here, and almost no run found the route that works. The instruction said *what* to do, not *how* to do it in this codebase.

Generic skill packs have not helped either, in [two](/experiments/skills-tasks/) [experiments](/experiments/verify-vs-skills/). So the question was whether guidance written for *this* repository does better:

- how to build and test it;
- how to check a change through its API;
- how to change it without breaking other features.

The guidance sat in the repository, as most teams would set it up. The agent was not told to use it; it was left to find and read what it wanted. A [follow-up experiment](#what-comes-next) now tests the same guidance with the agent told to use it.

## Prediction

Before generating the guidance or making any run, I wrote down and published the design, the one hypothesis, how the guidance would be written and how the results would be compared ([README.md](https://github.com/meabs/experiments/blob/4eb88a9ef2dce98b987b0076b614ab206723f1ab/2026-10-repo-skills/README.md)).

The hypothesis: with repository guidance in place, a larger share of runs pass than without it.

## Set-up

**The agent.** OpenAI's Codex command-line agent, model `gpt-5.6-luna`, at *low* reasoning effort (how long the model thinks before acting). At medium effort, it already passed 49 of 60 runs on these tasks, which leaves little room to improve. Each run started from a clean configuration.

**The code.** [shopizer](https://github.com/shopizer-ecommerce/shopizer), an open-source online-shop backend written in Java: products, carts, customers, reviews, content, served over a REST API. Every run started from the same version.

**Two ways of running the agent** (called *arms*):

| Arm | What the agent gets |
| --- | --- |
| No guidance | The task, nothing else. This is the baseline |
| Repository guidance | The task, plus an `AGENTS.md` file at the top of the repository (the file Codex reads for project instructions) and three *skills*: short instruction files the agent can open when it judges them relevant |

**The work.** 20 tasks, each run three times in each arm: 20 × 2 × 3 = 120 runs, all completed.

### Who wrote the guidance

An agent wrote it, not me. I wrote the tasks and know what causes each bug, so any guidance I wrote would lean towards the answers.

- **The writer.** Codex, at high reasoning effort, in one run, from a fixed brief. The brief asked for guidance on building and testing, on checking a change through the running application, and on changing code safely, and said to try every command it recommended.
- **What it could not see.** It worked in a fresh copy of shopizer, with my experiments, earlier runs and notes hidden from it. It never saw the tasks or the tests.
- **Used as written.** I published the guidance before any run and did not edit it.

It took three minutes and produced:

- **`AGENTS.md`**: 8 lines on how the code is organised, the key commands, and which skill to use when.
- **`build-test`**: how to build, run every test, or run one test class without a network connection.
- **`verify-api`**: how to check a change through the API. It found that the shop does not start on its own here, because a database settings file exists only for the tests. The route that works is a test that starts the shop and sends it real requests, and the skill gives the exact command. This is the route the agent in the verification experiment almost never found.
- **`safe-change`**: how a request passes through the code, which errors become which HTTP status codes, and to search for every other user of shared code before changing it.

I checked it for anything that gives away a task's answer and found nothing. One statement is slightly wrong: it says one kind of error always becomes a 400, but without an underlying cause it becomes a 500, which is the trap in some tasks. I recorded this before the runs and left it in.

### The tasks

The same 20 tasks as the [verification experiment](/experiments/verify-vs-skills/), unchanged, with the same hidden tests. Each is written the way a shop owner or support team would report it.

- **Runtime traps (18).** The obvious change compiles and looks right, but is wrong when the shop runs.
- **Neighbour breaks (2).** The obvious change breaks another feature that shares the code: REVEDIT (editing reviews, where creating reviews must keep working) and BOXVIS (hiding content boxes from shoppers, where the back office must still see them).

The [verification experiment's page](/experiments/verify-vs-skills/#the-tasks) lists every task.

### How a run is graded

The agent never sees how it will be judged. When it finishes, a grader adds *hidden tests* (65 across the 20 tasks) and runs the project's whole test suite. The hidden tests start the shop and use its API as a real client would. A run passes only if every hidden test passes and none of the project's existing tests breaks.

## Results

Findings RSK-1 to RSK-3 are at the top of the page. In short:

| Arm | Runs passed | Tokens per run | Cost per run | Cost per correct change | Typical run time |
| --- | --- | --- | --- | --- | --- |
| No guidance | 38 of 60 | 0.38M | 1.6¢ | 2.6¢ | 43 s |
| Repository guidance | 40 of 60 | 0.55M | 2.2¢ | 3.3¢ | 61 s |

Tokens are the units of text the model reads and writes, and what you pay for; M is millions. Costs are estimates at list prices; the 120 runs cost $2.30 together. Run time is the median.

### How the arms were compared

The unit is the task, not the run, because some tasks are simply harder than others. For each task, I took the number of passing runs with guidance (0 to 3) and subtracted the number without it. Guidance did better on 5 tasks, worse on 5, and the same on 10.

To ask whether that could easily be chance, the test flips the sign of each task's difference in every possible way, and counts how often the total comes out at least as large as the real one. Here, 4 times in 10: the result is inconclusive. The 95% interval runs from −8 to +17 percentage points. A modest gain is still possible, but this experiment could not show it.

The baseline was steady. Without guidance, the agent passed 38 of 60 runs here, and 36 of 60 on the same tasks in the verification experiment.

<figure class="guide-figure">

![Hidden tests passed, by task and arm](/guide-images/chart-rsk-passes.png)

<figcaption>Runs passed of 3, per task and arm. Ten tasks came out the same in both arms. Guidance helped most on SUPERDEL and CUSTREVIEW (0 to 2 of 3), and lost a single run on five tasks the agent nearly always passed without it.</figcaption>

</figure>

### What the agent did with the guidance

<figure class="guide-figure">

![What the agent did, by arm](/guide-images/chart-rsk-process.png)

<figcaption>With guidance, every run began by reading the skills on changing code and on building and testing. Only 8 runs opened the skill on checking a change through the API. The agent ran tests far more often with guidance (26 runs against 5), but wrote a test of its own change in only 2.</figcaption>

</figure>

- **Which skills it read.** In every run with guidance, the agent's first action was to read two of the three skills. The verification skill was opened in 8 runs, although `AGENTS.md` says to use it "for endpoint/client behavior".
- **What testing it did.** When it tested, the agent usually ran one existing test class from the project. Those tests start the shop and call its API, but they check what the code did *before* the change, so passing them says little about whether the change is right.
- **What it stopped doing.** No run tried to start the shop on its own, as 47 runs did in the verification experiment. The guidance said that route does not work here.
- **What it claimed.** Every failed run, in both arms, still said its change worked.

I checked these counts against the record of every command the agent ran. The guidance was present in every run with guidance and in none without. Every skill read succeeded. The agent used commands taken from `AGENTS.md` (`mvn -o` in 59 runs with guidance, against none without). No run could see the hidden tests.

### Two tasks in detail

**SUPERDEL** (the super administrator account can be deleted; deleting it must be refused with a 400). Without guidance, all three runs failed. With guidance, two passed. Both used a kind of error that the `safe-change` skill lists as becoming a 400; none of the runs without guidance did. That is a plausible reason, not a proven one.

**REVEDIT** (editing and deleting product reviews fails; creating reviews must keep working). No run passed in either arm. With guidance, all three runs broke creating a review, even though `safe-change` says to search for every other user of shared code before changing it. Without guidance, the agent did not break review creation, but did not get editing right either.

## Limits

One codebase; one agent and model; low reasoning effort only. One set of guidance, written by an agent in a single run. Guidance a team refined over time could do better. Only 2 tasks were neighbour breaks. The tasks were chosen in the verification experiment using runs without guidance, which slightly favours that arm. I wrote the tasks and hidden tests; all are published for checking.

Above all, this tests guidance the agent may choose to read. It read most of it, but not the part about checking its work.

## What comes next

The obvious question is what happens when the agent is **told to use the skills**. A follow-up experiment, [explicit-skills](https://github.com/meabs/experiments/tree/6224f3b0ba00eb043bb961be37e2505315ab29ce/2026-10-explicit-skills), is running now. It uses the same guidance, byte for byte, with three arms run side by side:

- no guidance;
- the guidance left to discover, repeating this experiment;
- the guidance explicitly called. The prompt starts by telling the agent to read the change and test skills before it starts, and to follow the verification skill before it says it is done.

That separates two questions this experiment could not: whether the guidance helps when it is followed, and whether the agent follows it when it is only available.

## Reproduce

Everything is in [experiments/2026-10-repo-skills](https://github.com/meabs/experiments/tree/4eb88a9ef2dce98b987b0076b614ab206723f1ab/2026-10-repo-skills):

- the generation brief and record (`generate/`);
- the guidance exactly as used (`arms/repo-skills/`);
- the tasks and hidden tests (`tasks/`, `hidden/`);
- the raw runs (`results/stage1`);
- the analysis and chart scripts (`scripts/`).

The commands are in REPORT.md, section Reproducing.
