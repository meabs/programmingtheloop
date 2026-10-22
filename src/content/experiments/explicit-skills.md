---
title: "Telling the agent to use its skills (experiment ESK)"
description: "Told to use the repository's skills, the agent read them every time, but mostly ran a smoke test instead of testing its change; its changes were correct a little more often, not measurably, at about twice the cost."
date: 2026-10-22
summary: "On 20 tasks in a Java online-shop backend, telling Codex to use its repository skills, in the prompt or in AGENTS.md, made it read the verification skill in every run (against 3 of 60 when left to find it) and raised the pass rate from 37 to 42 or 43 of 60, too little to rule out chance."
type: "Controlled trial"
github:
  - label: "experiments"
    href: "https://github.com/meabs/experiments/tree/b753910ec4d5e9439c81731c1b9f81e95b1c7842/2026-10-explicit-skills"
draft: false
experimentId: "ESK"
question: "With the same repository guidance in place, does telling the agent to use its skills, in the prompt or in AGENTS.md, raise the share of changes that pass independent acceptance tests?"
status: published
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "low reasoning, isolation on"
runs: 240
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/b753910ec4d5e9439c81731c1b9f81e95b1c7842/2026-10-explicit-skills/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/b753910ec4d5e9439c81731c1b9f81e95b1c7842/2026-10-explicit-skills/README.md"
topics:
  - verification
  - measurement
publishedOn: 2026-10-22
findings:
  - id: "ESK-1"
    statement: "Telling the agent to use its skills did not measurably raise the pass rate: 42 of 60 runs passed when told in the prompt and 43 when told in AGENTS.md, against 37 with no guidance and 39 with the guidance left to discover"
    metric: "told in AGENTS.md vs none, mean per-task difference in pass rate"
    value: "+10.0 pts"
    interval:
      low: "−5.0 pts"
      high: "+26.7 pts"
      method: "bootstrap 95% CI over 20 tasks"
    n: 240
    limits:
      - "one repository"
      - "one model at low reasoning effort"
      - "one set of guidance, written by an agent"
    source: "https://github.com/meabs/experiments/blob/b753910ec4d5e9439c81731c1b9f81e95b1c7842/2026-10-explicit-skills/REPORT.md"
    status: current
    featured: false
  - id: "ESK-2"
    statement: "Told to follow the verification skill, the agent read it in every run, but wrote a test of its change in only 15 of 60 (prompt) and 10 of 60 (AGENTS.md); most runs ran the skill's example smoke test instead"
    metric: "runs that wrote an API-level test of the change, when told"
    value: "15/60 and 10/60"
    n: 120
    limits:
      - "counted from the commands the agent ran and the change it left"
      - "one model at low reasoning effort"
    source: "https://github.com/meabs/experiments/blob/b753910ec4d5e9439c81731c1b9f81e95b1c7842/2026-10-explicit-skills/REPORT.md"
    status: current
    featured: false
  - id: "ESK-3"
    statement: "A one-line entry in AGENTS.md got the verification skill read as reliably as an instruction in the prompt, and the two gave the same pass rate"
    metric: "runs that read the verification skill: AGENTS.md entry, prompt, left to discover"
    value: "60/60, 60/60, 3/60"
    n: 180
    limits:
      - "the AGENTS.md arm ran later than the others"
    source: "https://github.com/meabs/experiments/blob/b753910ec4d5e9439c81731c1b9f81e95b1c7842/2026-10-explicit-skills/REPORT.md"
    status: current
    featured: false
  - id: "ESK-4"
    statement: "Being told cost about twice as much per correct change as no guidance: 1.98 times when told in the prompt and 1.77 times in AGENTS.md"
    metric: "cost per run that passed, told in the prompt vs none"
    value: "1.98×"
    interval:
      low: "1.54"
      high: "2.41"
      method: "bootstrap 95% CI over 20 tasks"
    n: 120
    limits:
      - "list prices"
      - "one repository"
    source: "https://github.com/meabs/experiments/blob/b753910ec4d5e9439c81731c1b9f81e95b1c7842/2026-10-explicit-skills/REPORT.md"
    status: current
    featured: false
---

## Question

In my [repository skills experiment](/experiments/repo-skills/), an agent wrote guidance for one codebase: an `AGENTS.md` file and three *skills* (short instruction files the agent can open when it judges them relevant). The guidance sat in the repository for the agent to find. It did not measurably help.

The agent read two of the skills every time. It opened the third, `verify-api`, on how to check a change through the shop's API, in only 8 of 60 runs. So that experiment measured guidance the agent chose to read, not guidance it followed.

**This experiment tells the agent to use the skills.** The guidance is the same, byte for byte. The difference is an instruction to use it, given in one of two places:

- **in the prompt**, which a user writes for each task;
- **in `AGENTS.md`**, the file Codex reads for project instructions, which a team writes once.

## Prediction

Before any run, I wrote down and published the design, the hypotheses and how the results would be compared ([README.md](https://github.com/meabs/experiments/blob/b753910ec4d5e9439c81731c1b9f81e95b1c7842/2026-10-explicit-skills/README.md)).

The hypotheses: told in the prompt, a larger share of runs pass than with no guidance (H1), and than with the guidance left to discover (H2).

The `AGENTS.md` arm was added while the first three were running, before I had looked at any result, with two hypotheses of its own: it beats no guidance (H3), and it beats the guidance left to discover (H4). It is recorded in the README's amendment log.

## Set-up

**The agent.** OpenAI's Codex command-line agent, model `gpt-5.6-luna`, at *low* reasoning effort (how long the model thinks before acting). Each run started from a clean configuration.

**The code.** [shopizer](https://github.com/shopizer-ecommerce/shopizer), an open-source online-shop backend written in Java, served over a REST API. Every run started from the same version.

**Four ways of running the agent** (called *arms*):

| Arm | What the agent gets |
| --- | --- |
| No guidance | The task, nothing else. This is the baseline |
| Left to discover | The task, plus the guidance in the repository. This repeats the repository skills experiment |
| Told in the prompt | The guidance, and the prompt starts with an instruction to use it (below) |
| Told in `AGENTS.md` | The guidance, with one entry added to the end of `AGENTS.md` (below). The prompt is the task only |

The instruction at the start of the prompt:

> Use this repository's skills in .agents/skills for this task:
> 1. Before you change any code, read and follow .agents/skills/safe-change/SKILL.md.
> 2. To build and run tests, follow .agents/skills/build-test/SKILL.md.
> 3. Before you say you are done, read and follow .agents/skills/verify-api/SKILL.md, and check your change through the API as it says.
>
> The task:

The entry added to `AGENTS.md` uses the same words as step 3:

> ## Before you finish
>
> Before you say you are done, read and follow `.agents/skills/verify-api/SKILL.md`, and check your change through the API as it says.

It names only the verification skill, because the agent already read the other two in every run when left to discover them.

**The work.** 20 tasks, each run three times in each arm: 20 × 4 × 3 = 240 runs, all completed.

### The guidance

Written by Codex at high effort in the repository skills experiment, without sight of the tasks or tests, and used unedited:

- **`AGENTS.md`**: 8 lines on how the code is organised, the key commands, and which skill to use when.
- **`build-test`**: how to build, run every test, or run one test class without a network connection.
- **`safe-change`**: how a request passes through the code, which errors become which HTTP status codes, and to search for every other user of shared code before changing it.
- **`verify-api`**: the shop does not start on its own here, so check a change with a test that starts it and sends real requests. It gives, first, the command for an existing *smoke test*, which only checks that the shop starts and answers a health check. Then it says: "For an API change, add or update a focused … integration test", calling the endpoint as a client would, and checking both the status and the body.

### The tasks

The same 20 tasks as the [verification experiment](/experiments/verify-vs-skills/#the-tasks), unchanged, each written the way a shop owner or support team would report it.

- **Runtime traps (18).** The obvious change compiles and looks right, but is wrong when the shop runs.
- **Neighbour breaks (2).** The obvious change breaks another feature that shares the code: REVEDIT (editing reviews, where creating reviews must keep working) and BOXVIS (hiding content boxes from shoppers, where the back office must still see them).

### How a run is graded

The agent never sees how it will be judged. When it finishes, a grader adds *hidden tests* (65 across the 20 tasks) and runs the project's whole test suite. The hidden tests start the shop and use its API as a real client would. A run passes only if every hidden test passes and none of the project's existing tests breaks.

## Results

Findings ESK-1 to ESK-4 are at the top of the page. In short:

| Arm | Runs passed | Tokens per run | Cost per correct change | Typical run time |
| --- | --- | --- | --- | --- |
| No guidance | 37 of 60 | 0.40M | 2.8¢ | 53 s |
| Left to discover | 39 of 60 | 0.56M | 3.4¢ | 73 s |
| Told in the prompt | 42 of 60 | 1.10M | 5.4¢ | 113 s |
| Told in `AGENTS.md` | 43 of 60 | 0.99M | 4.9¢ | 117 s |

Tokens are the units of text the model reads and writes, and what you pay for; M is millions. Costs are estimates at list prices; the 240 runs cost $6.70 together. Run time is the median.

### How the arms were compared

The unit is the task, not the run, because some tasks are simply harder than others. For each task, I took the number of passing runs in one arm (0 to 3) and subtracted the number in the other. To ask whether the result could easily be chance, the test flips the sign of each task's difference in every possible way, and counts how often the total comes out at least as large as the real one. Because there are two tests in each pair, the counts are adjusted upwards (Holm's method).

| Comparison | Tasks better / same / worse | Difference in pass rate (95% interval) | Chance (adjusted) |
| --- | --- | --- | --- |
| Told in the prompt vs no guidance | 5 / 13 / 2 | +8 pts (−5 to +23) | 0.41 |
| Told in the prompt vs left to discover | 4 / 14 / 2 | +5 pts (−3 to +15) | 0.41 |
| Told in `AGENTS.md` vs no guidance | 5 / 13 / 2 | +10 pts (−5 to +27) | 0.33 |
| Told in `AGENTS.md` vs left to discover | 5 / 13 / 2 | +7 pts (−3 to +17) | 0.33 |

None is close to the usual 0.05 threshold. Being told points the right way in all four, but a gain of 8 to 10 points is smaller than this experiment can show.

The two places for the instruction made no difference: told in the prompt and told in `AGENTS.md` came out the same on 17 tasks, 42 against 43 runs. Left to discover, the guidance gained 2 runs over none, as in the repository skills experiment (40 against 38 there).

<figure class="guide-figure">

![Hidden tests passed, by task and arm](/guide-images/chart-esk-passes.png)

<figcaption>Runs passed of 3, per task and arm. Most tasks came out the same in every arm. Being told helped most on SUPERDEL (1 to 3 of 3) and TAXRATE (0 to 3 of 3). On CUSTREVIEW, every arm with guidance passed 0 of 3, against 2 without; in the repository skills experiment, the guidance arm passed it 2 of 3.</figcaption>

</figure>

### What the agent did when told

<figure class="guide-figure">

![What the agent did, by arm](/guide-images/chart-esk-process.png)

<figcaption>Told to use the skills, in the prompt or in AGENTS.md, the agent read the verification skill and ran tests in almost every run. It wrote a test of its own change in only 15 and 10 runs.</figcaption>

</figure>

- **It read the skill.** Told, in either place, the agent opened `verify-api` in all 60 runs. Left to discover it, 3.
- **It took the shortcut.** Most runs then ran the skill's smoke test, which checks only that the shop starts. It ran in 49 runs told in the prompt and 47 told in `AGENTS.md`. In 23 and 37 runs it was the only test the agent ran. The step the skill asks for next, writing a test of the change, was done in 15 and 10 runs.
- **It said so.** Its end-of-run notes often admitted the gap, for example: "the specific customer address PATCH/GET flow was not covered by an existing integration test". It still reported success.
- **Writing a test went with passing.** Runs that wrote a test of their change passed 13 of 15 (prompt) and 9 of 10 (`AGENTS.md`), against 29 of 45 and 34 of 50 that did not. This does not show that the test caused the pass: the agent may write one more readily when it already understands the task.
- **What it claimed.** Every failed run, in all four arms (79 runs), still said its change worked.
- **Neighbour breaks.** Being told to use `safe-change`, which says to check every other user of shared code, did not prevent them: 4 to 5 runs broke a neighbouring feature in each arm.

### Checks on the runs

Before writing up, I checked these counts against the record of every command the agent ran:

- **The guidance was where it should be.** It was present in every run of the three arms with guidance, and in none without.
- **The skills were really read.** In the two arms that were told, the skill's text shows in the logged output of 118 of 120 runs; in the other two, the log kept only part of a long output.
- **The `AGENTS.md` entry was in effect.** That arm had no instruction in its prompt, yet it opened `verify-api` in every run, against 3 of 60 for the same guidance without the entry.
- **Every run was fully graded**, except one whose change did not compile, which counts as a fail.
- **No run could see the hidden tests.**

## Limits

- One codebase; one agent and model; low reasoning effort only.
- One set of guidance, written by an agent. The verification skill puts the smoke-test command first and the advice to write a focused test second. A skill that gave only the second might be followed more fully. This experiment cannot say.
- The instruction adds emphasis on checking, not only a pointer to the skills. Any gain could come from either.
- The `AGENTS.md` arm ran later than the other three, in a second batch.
- Only 2 tasks were neighbour breaks.
- The tasks were chosen in the verification experiment using runs without guidance, which slightly favours that arm.
- I wrote the tasks and hidden tests; all are published for checking.

## Across the last four experiments

| What was added (Codex, low effort unless stated) | Runs passed vs nothing added | Cost per correct change vs nothing added |
| --- | --- | --- |
| Superpowers skill pack | 24 vs 24 of 32; 37 vs 36 of 60 | about 2.5 times |
| A paragraph telling it to verify | 39 vs 36 of 60 | 1.5 times |
| Repository guidance, left to discover | 40 vs 38; 39 vs 37 of 60 | 1.2 to 1.3 times |
| Repository guidance, told in the prompt | 42 vs 37 of 60 | 2.0 times |
| Repository guidance, told in `AGENTS.md` | 43 vs 37 of 60 | 1.8 times |
| Medium reasoning effort, nothing else | 49 vs 36 of 60 (significant) | 1.4 times |

Telling the agent to use the guidance gave the largest gain of anything written down so far, but still not a measurable one, and it doubled the cost per correct change. Letting the agent think a little longer gained more, for less.

If you want your agent to use a skill, one line in `AGENTS.md` is enough to get it read. Getting it followed is a different matter: here, the agent read the instruction to write a test, and ran the example instead.

## Reproduce

Everything is in [experiments/2026-10-explicit-skills](https://github.com/meabs/experiments/tree/b753910ec4d5e9439c81731c1b9f81e95b1c7842/2026-10-explicit-skills):

- the guidance exactly as used (`arms/guidance/`, and `arms/guidance-agentsmd/` with the extra entry);
- the prompt instruction (`arms/explicit-prefix.md`);
- the tasks and hidden tests (`tasks/`, `hidden/`);
- the raw runs (`results/stage1`, `results/stage1-agentsmd`);
- the analysis and chart scripts (`scripts/`).

The commands are in REPORT.md, section Reproducing.
