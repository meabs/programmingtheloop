---
title: "Telling the agent to test, with and without a skill (experiment TSK)"
description: "One paragraph asking for a focused API test got the agent to write a real test of its change in 56 of 60 runs. Adding the repository's verification skill added nothing. A hook that sent the agent back once did as well. None of it made the changes measurably more correct."
date: 2026-10-23
summary: "On 20 tasks in a Java online-shop backend, an instruction to write a focused API test got Codex to write one that fails without its change and passes with it in 56 of 60 runs (none without it); adding the verification skill gave 52 and 54, and a stop hook that sent the agent back once gave 58. The pass rate stayed between 40 and 47 of 60; only medium reasoning effort, at 49, was clearly higher."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/e3908706a9278546408fdd462a0ae685ef98255b/2026-10-test-skill"
draft: false
experimentId: "TSK"
question: "When the agent is told to write a focused API test of its change, does giving it the repository's verification skill help it write one that really checks the change, does the skill's design matter, and does a gate that checks for such a test work better than telling it?"
status: published
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "low reasoning (one arm medium), isolation on"
runs: 360
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/e3908706a9278546408fdd462a0ae685ef98255b/2026-10-test-skill/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/e3908706a9278546408fdd462a0ae685ef98255b/2026-10-test-skill/README.md"
topics:
  - verification
  - measurement
  - skills
publishedOn: 2026-10-23
findings:
  - id: "TSK-1"
    statement: "A one-paragraph instruction to write a focused API test got the agent to write one that fails without its change and passes with it in 56 of 60 runs; given only the task, it wrote none"
    metric: "runs with a relevant test: told vs not told"
    value: "56/60 vs 0/60"
    n: 120
    limits:
      - "relevance checked automatically, by running the agent's tests with its change and on the original code"
      - "one model at low reasoning effort"
    source: "https://github.com/meabs/experiments/blob/e3908706a9278546408fdd462a0ae685ef98255b/2026-10-test-skill/REPORT.md"
    status: current
    featured: false
  - id: "TSK-2"
    statement: "Adding the repository's verification skill to the instruction did not help: 52 of 60 runs wrote a relevant test with the original skill and 54 with a revised one that puts the focused test first, against 56 with the instruction alone"
    metric: "runs with a relevant test: instruction, plus original skill, plus revised skill"
    value: "56, 52, 54 of 60"
    n: 180
    limits:
      - "one skill, in one repository"
      - "the instruction already said what the skill says"
    source: "https://github.com/meabs/experiments/blob/e3908706a9278546408fdd462a0ae685ef98255b/2026-10-test-skill/REPORT.md"
    status: current
    featured: false
  - id: "TSK-3"
    statement: "A stop hook that checked for a relevant test when the agent tried to finish, and sent it back once if there was none, worked as well as the instruction: it blocked every run, and 58 of 60 then had a relevant test"
    metric: "runs with a relevant test after one block"
    value: "58/60"
    n: 60
    limits:
      - "low reasoning effort only"
      - "the agent could see the hook's files; none touched them"
    source: "https://github.com/meabs/experiments/blob/e3908706a9278546408fdd462a0ae685ef98255b/2026-10-test-skill/REPORT.md"
    status: current
    featured: false
  - id: "TSK-4"
    statement: "Real tests of the change did not measurably raise the pass rate: 41 to 47 of 60 in the arms that wrote them, against 40 with no guidance; medium reasoning effort, with no tests, passed 49"
    metric: "medium effort vs no guidance, pass rate"
    value: "+15 pts"
    interval:
      low: "+5.0 pts"
      high: "+26.7 pts"
      method: "bootstrap 95% CI over 20 tasks"
    n: 360
    limits:
      - "20 tasks can show a gain of about 15 points, not 10"
      - "one repository"
    source: "https://github.com/meabs/experiments/blob/e3908706a9278546408fdd462a0ae685ef98255b/2026-10-test-skill/REPORT.md"
    status: current
    featured: false
---

## Question

In my [explicit skills experiment](/experiments/explicit-skills/), I told the agent to use the repository's skills. It then read the verification skill, `verify-api`, in every run. But it mostly did not do what the skill asks. The skill says to write a focused test of the change; instead, most runs ran its first example, a smoke test that only checks the shop starts.

That left two questions:

1. **Does the skill add anything beyond telling the agent to write the test?** In that experiment, the skill and the instruction to use it came together.
2. **Was the shortcut caused by the skill's design?** It gave the smoke-test command first, and the advice to write a focused test second.

I also added a third: **does checking the agent's work beat telling it?** Codex can run a *hook*, a command it calls at fixed points. A *stop hook* runs when the agent tries to finish, and can send it back with a reason.

## Prediction

Before any run, I wrote down and published the design, the hypotheses and how the results would be compared ([README.md](https://github.com/meabs/experiments/blob/e3908706a9278546408fdd462a0ae685ef98255b/2026-10-test-skill/README.md)).

The hypotheses, about how many runs wrote a relevant test (defined below):

- **H1.** The instruction plus the skill beats the instruction alone.
- **H2.** The revised skill beats the original.
- **H3.** The gate beats the instruction.

## Set-up

**The agent.** OpenAI's Codex command-line agent, model `gpt-5.6-luna`, at *low* reasoning effort (how long the model thinks before acting), except one arm. Each run started from a clean configuration.

**The code.** [shopizer](https://github.com/shopizer-ecommerce/shopizer), an open-source online-shop backend written in Java, served over a REST API. Every run started from the same version.

**Six ways of running the agent** (called *arms*):

| Arm | What the agent gets |
| --- | --- |
| No guidance | The task, nothing else. This is the baseline |
| Told to write a test | The prompt starts with the instruction below |
| Told, plus the skill | The instruction, a pointer to the skill, and the original `verify-api` skill, unedited |
| Told, plus the revised skill | As above, with a revised skill that puts the focused test first |
| Gate | The task only, and a stop hook that checks for a relevant test (below) |
| Medium effort | The task only, at medium reasoning effort |

The instruction:

```text
Before you say you are done, add a focused test that checks your change through the API, calling the endpoint the way a client would, and run it. It should fail without your change and pass with it.

The task:
```

The two skill arms add one sentence: "Read and follow .agents/skills/verify-api/SKILL.md, which explains how to do this in this repository."

**The revised skill** only reorders and rewords the original, which an agent wrote in the [repository skills experiment](/experiments/repo-skills/). It now asks first for a focused test that calls the changed endpoint, and should fail without the change and pass with it. The smoke test comes second, as a pattern to copy, with the note that it only checks the shop starts, "so running it does not verify a change".

**The gate.** When the agent tries to finish, the hook runs the same relevance check as the grader (below), on the agent's copy of the code. If there is no relevant test, it sends the agent back once, saying what failed but not how to fix it. For example: "Before you finish: no test of your own was found in your change. Add a test that checks your change through the API, and run it. It should fail without your change and pass with it." The second time, it always lets the agent finish.

**The work.** The same 20 tasks as the last three experiments, each run three times in each arm: 20 × 6 × 3 = 360 runs, all completed.

### What counts as a relevant test

In the last experiment, I counted tests by looking for certain names in the code the agent added. This time the grader checks each one by running it:

1. It runs the tests the agent added or changed, with its change. All must pass.
2. It takes the original code, adds the agent's test files, and runs them again. At least one must fail.

A test that passes both times does not check the change. I checked this method on the last experiment's 27 test-writing runs before starting. All 27 were relevant, so the earlier counts had been slightly low, not inflated.

### How a run is graded

The agent never sees how it will be judged. When it finishes, a grader adds *hidden tests* (65 across the 20 tasks) and runs the project's whole test suite. The hidden tests start the shop and use its API as a real client would. A run passes only if every hidden test passes and none of the project's existing tests breaks.

## Results

Findings TSK-1 to TSK-4 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-ts-testpass.png" alt="Runs out of 60 per arm. Wrote a test that fails without the change and passes with it: no guidance 0, told 56, told plus skill 52, told plus revised skill 54, gate 58, medium effort 0. Passed the hidden tests: 40, 41, 41, 43, 47, 49" width="1800" height="920" loading="lazy" />

<figcaption>Runs out of 60 per arm. Told to write a test, or sent back by the gate, the agent wrote a real test of its change in almost every run. The skill did not add to that. Few more runs passed the hidden tests. Medium effort wrote no tests and passed the most. Source: github.com/meabs/experiments, 2026-10-test-skill/results (Codex gpt-5.6-luna, low reasoning unless stated).</figcaption>

</figure>

| Arm | Relevant test | Runs passed | Tokens per run | Cost per correct change | Typical run time |
| --- | --- | --- | --- | --- | --- |
| No guidance | 0 of 60 | 40 of 60 | 0.44M | 2.6¢ | 52 s |
| Told to write a test | 56 of 60 | 41 of 60 | 1.33M | 6.3¢ | 116 s |
| Told, plus the skill | 52 of 60 | 41 of 60 | 1.77M | 7.9¢ | 137 s |
| Told, plus the revised skill | 54 of 60 | 43 of 60 | 1.78M | 7.5¢ | 134 s |
| Gate | 58 of 60 | 47 of 60 | 1.67M | 6.6¢ | 220 s |
| Medium effort | 0 of 60 | 49 of 60 | 0.88M | 3.9¢ | 94 s |

Tokens are the units of text the model reads and writes, and what you pay for; M is millions. Costs are estimates at list prices; the 360 runs cost $15.12 together. Run time is the median.

### Telling was enough

- **The instruction worked.** Told to write a focused test, the agent wrote and ran one in every run. In 56 of 60, the test failed on the original code and passed with the change. Given only the task, it never wrote one.
- **The skill added nothing.** With the original skill, 52 of 60 runs wrote a relevant test; with the revised one, 54. Both are within chance of the instruction alone. The skill also made each run about a quarter more expensive.
- **The shortcut disappeared.** No run, in any arm, ran only the smoke test. In the last experiment, told to follow the same original skill, most runs did. What changed was the direct instruction, not the skill's order.
- **The misses** were tests left failing (4 to 7 runs per told arm), or tests that also passed on the original code (0 to 2).

### The gate

- **Every run was sent back.** Given only the task, the agent never wrote a test before trying to finish.
- **After one block, 58 of 60 had a relevant test.** The other two were let through, as designed: one with a failing test, one with a test that did not check the change.
- **The gate agreed with the grader** in all 60 runs.
- **It knew.** The agent's notes referred to the hook: "The repository hook requires a regression test of the API itself, so I'm adding endpoint-level assertions". None touched the hook's files.
- **It took longer.** Runs took a median of 220 seconds, because each check runs the agent's tests twice. Cost per correct change was about the same as the instruction's.

### Tests and correct changes

The arms that wrote real tests passed 41 to 47 of 60, against 40 with no guidance.

- **Telling, with or without the skill, made no difference** to the pass rate (41 to 43).
- **The gate passed 47**, 7 more than no guidance and 6 more than the instruction. That is not significant here, but it is the most of any guided arm. After being sent back, 20 gated runs changed the code itself, not only tests, and 14 of those passed. Writing the test after the fix sometimes exposed a gap in it. This was found after the results, and does not show those runs would otherwise have failed.
- **Medium reasoning effort passed 49**, with no tests at all. It is the only arm that is clearly better than no guidance.
- **A relevant test is not a correct change.** 11 gated runs had one and still failed the hidden tests. On the two tasks where the obvious change breaks another feature, the guided arms wrote relevant tests in most runs, and passed 0 or 1 of 6 each. A test of the change does not catch a break elsewhere.
- **Failed runs still mostly said they had worked:** 55 of 68 in the arms that wrote tests, 30 of 31 in the two that did not.

### How the arms were compared

The unit is the task, not the run, because some tasks are simply harder than others. For each task, I took the number of runs with a relevant test in one arm (0 to 3) and subtracted the number in the other. To ask whether the result could easily be chance, the test flips the sign of each task's difference in every possible way, and counts how often the total comes out at least as large as the real one. Because there are three hypotheses, the results are adjusted upwards (Holm's method).

| Hypothesis | Tasks better / same / worse | Difference (95% interval) | Chance (adjusted) |
| --- | --- | --- | --- |
| H1: plus the skill vs told only | 1 / 15 / 4 | −7 pts (−17 to +2) | 1.0 |
| H2: revised skill vs original | 3 / 15 / 2 | +3 pts (−5 to +13) | 1.0 |
| H3: gate vs told only | 4 / 14 / 2 | +3 pts (−5 to +12) | 1.0 |

None is supported. On pass rate, compared the same way but without adjustment: medium effort against no guidance, +15 points (+5 to +27, chance 0.03); the gate against no guidance, +12 points (0 to +25, chance 0.15); the gate against the instruction, +10 points (−2 to +23, chance 0.22).

### Checks on the runs

Before writing up, I checked these counts against the record of every command the agent ran:

- **Every run was fully graded.** In all 360, every hidden test ran.
- **Every run has a relevance result,** and no check failed to run.
- **Only the two skill arms read the skill,** in all of their runs.
- **No run could see the hidden tests.**

## Limits

- One codebase; one agent and model; low reasoning effort except one arm. The gate was not tried at medium effort.
- One verification skill, revised by me. I know the tasks, but the revision only reorders the original.
- The instruction already said what the skill says. A skill carrying knowledge the agent lacks might add more.
- The medium-effort and gate arms ran in their own batches, alongside the others but not interleaved with them.
- The relevance check shows a test tells the change from the original code, not that it tests what the task asked for.
- Only 2 tasks were neighbour breaks.
- I wrote the tasks and hidden tests; all are published for checking.

## Across the last five experiments

| What was added (Codex, low effort unless stated) | Runs passed vs nothing added | Cost per correct change vs nothing added |
| --- | --- | --- |
| Superpowers skill pack | 24 vs 24 of 32; 37 vs 36 of 60 | about 2.5 times |
| A paragraph telling it to verify | 39 vs 36 of 60 | 1.5 times |
| Repository guidance, left to discover | 40 vs 38; 39 vs 37 of 60 | 1.2 to 1.3 times |
| Repository guidance, agent told to use it | 42 and 43 vs 37 of 60 | 1.8 to 2.0 times |
| A paragraph telling it to write a focused test | 41 vs 40 of 60 | 2.4 times |
| The same, plus the verification skill | 41 and 43 vs 40 of 60 | 2.9 to 3.0 times |
| A stop hook that requires a relevant test | 47 vs 40 of 60 | 2.5 times |
| Medium reasoning effort, nothing else | 49 vs 36; 49 vs 40 of 60 (both significant) | 1.4 to 1.5 times |

If you want your agent to write a test of its change, say so plainly, or check for one when it tries to finish. Both worked here, and the skill added nothing to either. But a test of the change did not make the change measurably more correct. In five experiments, the only thing that did was more reasoning effort.

## Reproduce

Everything is in [experiments/2026-10-test-skill](https://github.com/meabs/experiments/tree/e3908706a9278546408fdd462a0ae685ef98255b/2026-10-test-skill):

- the instruction and both skills exactly as used (`arms/`);
- the relevance check and the gate (`scripts/relevance.sh`, `scripts/gate.sh`);
- the tasks and hidden tests (`tasks/`, `hidden/`);
- the raw runs (`results/stage1`, `results/stage1-medium`, `results/stage1-gate`);
- the analysis and chart scripts (`scripts/`).

The commands are in REPORT.md, section Reproducing.
