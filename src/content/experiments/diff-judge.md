---
title: "Can an AI reviewer tell a broken change from a working one? (experiment DJ)"
description: "Shown a task and a coding agent's change, gpt-5.6-luna called 57 of 96 right, no better than tossing a coin. The agent's own success report did not sway it, a doubtful one made it reject more of everything, and its confidence meant nothing."
date: 2026-10-24T08:32:00+01:00
summary: "96 changes that coding agents made to a Java online-shop backend, half of which failed hidden tests, were shown to an AI judge (Codex gpt-5.6-luna). It caught 21 of the 48 broken changes and passed 36 of the 48 working ones: no measurable difference from guessing. Adding the agent's own report changed little; adding a doubtful one made it reject more working changes as well as broken ones."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/29b0a53eca06ab66cb15d16fda72e747b9504696/2026-10-diff-judge"
draft: false
experimentId: "DJ"
question: "Shown a task and the change a coding agent made for it, can a model tell whether the change passes the hidden tests, and does the agent's own success report sway it?"
status: published
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "judge only: low reasoning, read-only, no tools or files"
runs: 312
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/29b0a53eca06ab66cb15d16fda72e747b9504696/2026-10-diff-judge/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/29b0a53eca06ab66cb15d16fda72e747b9504696/2026-10-diff-judge/README.md"
topics:
  - review
  - verification
  - measurement
publishedOn: 2026-10-24
findings:
  - id: "DJ-1"
    statement: "Shown the task and the diff, the AI judge called 57 of 96 changes right: it caught 21 of 48 broken changes and passed 36 of 48 working ones, no measurable difference from guessing"
    metric: "balanced accuracy (mean of catch and accept rates) above 0.5"
    value: "0.59"
    interval:
      low: "+1.0 pts"
      high: "+19.8 pts"
      method: "bootstrap 95% CI over 12 tasks; exact sign-flip test p 0.07, Holm p 0.14"
    n: 96
    limits:
      - "the judge is the same model that wrote the changes"
      - "one repository, 12 tasks, low reasoning effort"
    source: "https://github.com/meabs/experiments/blob/29b0a53eca06ab66cb15d16fda72e747b9504696/2026-10-diff-judge/REPORT.md"
    status: current
    featured: false
  - id: "DJ-2"
    statement: "Showing the judge the agent's own success report did not make it miss more broken changes: it caught 20 of 48 with the report and 21 without"
    metric: "broken changes caught: without vs with the agent's report"
    value: "21/48 vs 20/48"
    n: 96
    limits:
      - "the agents' reports nearly all claimed success, so there was little to learn from them"
    source: "https://github.com/meabs/experiments/blob/29b0a53eca06ab66cb15d16fda72e747b9504696/2026-10-diff-judge/REPORT.md"
    status: current
    featured: false
  - id: "DJ-3"
    statement: "A fixed doubtful report ('I could not run the tests') made the judge catch more broken changes (30 of 48) but pass fewer working ones (22 of 48); it got no more accurate overall"
    metric: "doubtful vs the agent's report: broken caught, working passed"
    value: "+21 pts, −25 pts"
    n: 96
    limits:
      - "secondary comparison, not adjusted for multiple tests"
    source: "https://github.com/meabs/experiments/blob/29b0a53eca06ab66cb15d16fda72e747b9504696/2026-10-diff-judge/REPORT.md"
    status: current
    featured: false
  - id: "DJ-4"
    statement: "The judge's confidence did not track whether it was right: it averaged 87 out of 100 when right and 86 when wrong"
    metric: "mean confidence: right vs wrong"
    value: "87 vs 86"
    n: 96
    limits:
      - "self-reported confidence from one prompt wording"
    source: "https://github.com/meabs/experiments/blob/29b0a53eca06ab66cb15d16fda72e747b9504696/2026-10-diff-judge/REPORT.md"
    status: current
    featured: false
---

## Question

"Use a second model to review the first" is a common answer to agents that make mistakes. AI code review and "LLM as a judge" are sold as a safety net.

My earlier experiments give a hard test of that. Across four of them, coding agents made 960 changes to the same 20 tasks, and an independent grader ran hidden tests on every one. Almost every agent said its change worked, including the ones that failed: in [the test-skill experiment](/experiments/test-skill/), 85 of 99 failed runs claimed success.

So I asked: **can a model reading the change tell which ones fail?** And **does the agent's own confident report sway it?**

## Prediction

Before any judgement, I wrote down and published the design, the hypotheses and how the results would be compared ([README.md](https://github.com/meabs/experiments/blob/29b0a53eca06ab66cb15d16fda72e747b9504696/2026-10-diff-judge/README.md)):

- **H1.** Shown only the task and the diff, the judge does better than chance.
- **H2.** Showing it the agent's own report makes it miss more failures.
- **H3.** It catches more failures than the agents' own reports flagged.

## Set-up

**The changes.** From the four earlier experiments on [shopizer](https://github.com/shopizer-ecommerce/shopizer), an open-source online-shop backend in Java, I took the 12 tasks that had at least 4 passing and 4 failing changes. From each, I picked 4 that passed and 4 that failed, at random: **96 changes, half broken**. "Broken" means the grader's verdict: a hidden API test failed, or an existing test broke. The agents had claimed success on 94 of the 96.

**The judge.** OpenAI's `gpt-5.6-luna` through the Codex command-line agent, at low reasoning effort (how long the model thinks before answering). It got one prompt and had to end with `VERDICT: PASS` or `FAIL` and a confidence from 0 to 100. It ran in an empty folder with a read-only sandbox, so it could not open the code, run tests or see the grades. The changes it judged were all written by the same model.

**Three ways of asking** (called *arms*), every change judged in every arm:

| Arm | What the judge gets |
| --- | --- |
| Task and diff | The task, as the agent got it, and the agent's diff |
| Plus the agent's report | As above, plus the agent's own final message, which nearly always says the change works |
| Plus a doubtful report | As above, but with a fixed message instead: "I made the change shown above. I could not run the tests, so I am not sure it is complete or correct." |

That made 288 judgements, plus 24 repeats to check how stable the verdicts are.

## Results

Findings DJ-1 to DJ-4 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-dj-catch.png" alt="Out of 48 broken and 48 working changes. Broken changes called broken: the agent's own report 1, judge with task and diff 21, plus the agent's report 20, plus a doubtful report 30. Working changes called working: 47, 36, 34, 22. A coin toss would get 24." width="1800" height="920" loading="lazy" />

<figcaption>Out of 48 broken and 48 working changes. The agents called almost everything working. The judge caught under half the broken changes, whether or not it saw the agent's report. A doubtful report made it reject more of both. Source: github.com/meabs/experiments, 2026-10-diff-judge/results (judge: Codex gpt-5.6-luna, low reasoning).</figcaption>

</figure>

| Arm | Broken changes caught | Working changes passed | Balanced accuracy |
| --- | --- | --- | --- |
| Task and diff | 21 of 48 | 36 of 48 | 0.59 |
| Plus the agent's report | 20 of 48 | 34 of 48 | 0.56 |
| Plus a doubtful report | 30 of 48 | 22 of 48 | 0.54 |

*Balanced accuracy* is the average of the two rates. A judge that always says "works", always says "broken", or tosses a coin gets 0.5.

### No better than tossing a coin

- **It caught 21 of the 48 broken changes,** and called 27 of them working, mostly with confidence in the 80s and 90s.
- **On many tasks it said the same thing every time.** On two tasks it passed nearly every change, broken or not. On two others it failed nearly every one. Only on one task did it separate them cleanly.
- **It missed what the diff doesn't show.** It caught 2 of the 8 changes that broke an existing test elsewhere in the project.

### The agent's report did not sway it, but the tone of a report did

- **With the agent's own report, the verdicts barely moved.** It gave the same verdict on 75 of the 96 changes.
- **With the doubtful report, it became suspicious of everything.** Against the agent's report, it caught 10 more broken changes, but rejected 12 more working ones. Reading the replies, it found problems that weren't there, such as "filtering happens after pagination" or a field that might be left empty. The changes passed every test regardless.

### Its confidence meant nothing

Average confidence was 87 when the judge was right and 86 when it was wrong. At confidence 80 or above, it was right 48 times in 79.

### What its misses looked like

Read after the results, so treat this as a description, not a finding:

- **They read as reasonable reviews.** "The change correctly multiplies each cart line's unit price by its quantity... VERDICT: PASS, CONFIDENCE: 88." That change broke an existing test.
- **It hedged in words but not in verdicts.** 10 of the 27 missed failures say something like "assuming both deletion paths reach this branch", and still answer PASS.
- **It trusted the agent's own test.** 8 of the 27 cite the test the agent added as evidence, against 1 of the 21 it caught.

### How the arms were compared

The unit is the task, because some tasks are harder to call than others. For each task, I computed the quantity in question from its 8 changes. The test flips the sign of each task's difference in every possible way, and asks how often the total is at least as large as the real one. The three results are adjusted upwards for multiple testing (Holm's method).

| Hypothesis | Tasks better / same / worse | Difference (95% interval) | Chance (adjusted) |
| --- | --- | --- | --- |
| H1: balanced accuracy above 0.5 | 6 / 4 / 2 | +9 pts (+1 to +20) | 0.14 |
| H2: misses more with the agent's report | 2 / 9 / 1 | +2 pts (−4 to +8) | 0.50 |
| H3: catches more than the agents' reports | 9 / 3 / 0 | +42 pts (+23 to +63) | 0.006 |

H1 and H2 are not supported: no measurable difference. H3 is, but it's a low bar: the agents' reports flagged 1 broken change in 48.

### Cost

The 288 judgements took 44 minutes in all, about 9 seconds each, and would cost $0.40 at list prices.

### Checks on the runs

- **Every judgement gave a verdict.** None timed out.
- **The settings were checked in every session record:** `gpt-5.6-luna`, low effort, read-only sandbox.
- **The judge made no tool calls,** so it saw only the prompt.

## Limits

- The judge is the same model that wrote every change, so I can't separate self-preference from skill. A different model might do better or worse.
- One repository and one kind of task: runtime bugs in a Java REST backend. I left out the 8 tasks where nearly every change passed or nearly every one failed, so these are the harder changes to call.
- The judge could only read. Reviewers that can run the tests or the application may do much better.
- Low reasoning effort only, and one prompt wording, which I chose.
- 12 tasks can show only a fairly large effect.

## What this means

A reviewer that only reads the diff is not a safety net here. It flagged far more than the agents' own "done" messages, but that's a very low bar. It still let through more than half the broken changes, sounded just as sure when it was wrong, and swung with the tone of the report rather than the code. In my earlier experiments, the checks that told broken from working were the ones that ran something.

## Reproduce

Everything is in [experiments/2026-10-diff-judge](https://github.com/meabs/experiments/tree/29b0a53eca06ab66cb15d16fda72e747b9504696/2026-10-diff-judge):

- the 96 items and how they were picked (`items/`, `scripts/make_items.py`);
- the prompts (`arms/`);
- the judge runner (`scripts/judge.py`);
- every judgement (`results/main`);
- the analysis and chart scripts (`scripts/`).

The commands are in REPORT.md, section Reproducing.
