---
title: "Do benchmark scores show real ability, or remembered answers? (experiment BT)"
description: "I rewrote GSM8K and HumanEval items with new numbers, new names or a renamed function, and asked a model running on my desk and a hosted one to solve both versions. Neither scored measurably lower on the rewrites, and no wrong answer on a rewrite was the original's answer."
date: 2026-10-24
summary: "184 GSM8K maths problems and 80 HumanEval coding problems, each with a 'twin' that changes the numbers, names or function name but not the logic. qwen3.8:27b running locally and gpt-5.6-luna hosted scored much the same on originals and twins: no measurable drop, and no sign of recalled answers."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/332886b8ba803d6982bbafcf1abfeaa132884c8c/2026-10-benchmark-twins"
draft: false
experimentId: "BT"
question: "If a benchmark item is rewritten with new numbers, names or function name but the same logic, does a model score lower on the rewrite, as it would if it had memorised the original?"
status: published
evidenceGrade: published
agents:
  - name: "Codex"
    model: "qwen3.8:27b (Q4_K_M, Ollama 0.40.5, local)"
    settings: "low reasoning, read-only, answer only; temperature 1.0, top_k 20, top_p 0.95"
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "low reasoning, read-only, answer only"
runs: 1312
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/332886b8ba803d6982bbafcf1abfeaa132884c8c/2026-10-benchmark-twins/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/332886b8ba803d6982bbafcf1abfeaa132884c8c/2026-10-benchmark-twins/README.md"
previewImage: "/guide-images/chart-bt-twins.png"
previewAlt: "Original against twin scores for both models: all within a few items of each other."
topics:
  - measurement
publishedOn: 2026-10-24
findings:
  - id: "BT-1"
    statement: "The local model scored no measurably lower on GSM8K problems with new numbers: 168 of 184 originals right against 161 of 184 twins"
    metric: "items right on the original minus right on the twin"
    value: "+3.8 pts"
    interval:
      low: "−1.6 pts"
      high: "+9.2 pts"
      method: "bootstrap 95% CI over 184 items; exact sign-flip test p 0.12, Holm p 0.46"
    n: 184
    detail:
      - "new names: 59 of 64 on both versions"
      - "HumanEval with the function renamed: 75 of 80 against 72 of 80 (Holm p 0.82)"
    limits:
      - "the twins keep the wording and logic, so they test recalled answers, not new kinds of problem"
      - "both models scored above 90% on these items, leaving little room for a drop"
    source: "https://github.com/meabs/experiments/blob/332886b8ba803d6982bbafcf1abfeaa132884c8c/2026-10-benchmark-twins/REPORT.md"
    status: current
    featured: false
  - id: "BT-2"
    statement: "The hosted model's drop on the number twins was no different from the local model's: 175 of 184 against 172 of 184"
    metric: "difference between the two models' drops"
    value: "+2.2 pts"
    interval:
      low: "−3.3 pts"
      high: "+7.6 pts"
      method: "bootstrap 95% CI over 184 items; two-sided exact sign-flip test, Holm p 1.0"
    n: 184
    limits:
      - "one run per item at low reasoning effort"
    source: "https://github.com/meabs/experiments/blob/332886b8ba803d6982bbafcf1abfeaa132884c8c/2026-10-benchmark-twins/REPORT.md"
    status: current
    featured: false
  - id: "BT-3"
    statement: "When a model got a number twin wrong, its answer was never the original problem's answer"
    metric: "wrong twin answers equal to the original's answer"
    value: "0 of 30"
    n: 30
    limits:
      - "only 15 wrong answers per model to look at"
    source: "https://github.com/meabs/experiments/blob/332886b8ba803d6982bbafcf1abfeaa132884c8c/2026-10-benchmark-twins/REPORT.md"
    status: current
    featured: false
  - id: "BT-4"
    statement: "39 of the local model's 656 replies were lost to a harness problem, not wrong answers; regraded, it matched the hosted model on these items"
    metric: "original items right after regrading: local vs hosted"
    value: "GSM8K 177 vs 175 of 184; HumanEval 78 vs 75 of 80"
    n: 656
    limits:
      - "regrading was added after the results, not preregistered"
    source: "https://github.com/meabs/experiments/blob/332886b8ba803d6982bbafcf1abfeaa132884c8c/2026-10-benchmark-twins/REPORT.md"
    status: current
    featured: false
---

## Question

Every new model arrives with benchmark scores. A worry that never goes away is that the test questions, which are public, ended up in the training data. Then a high score could mean the model remembers the answers, not that it can solve the problems.

There's a simple test. Take a benchmark question and make a **twin**: the same problem with different numbers or names, so the old answer is wrong. A model that reasons should score the same on both. A model that remembers should do worse on the twin, and its wrong answers should often be the original's answer.

I tried this on two well-known benchmarks, with a model running on my own machine and a hosted one.

## Prediction

Before any answer was recorded, I wrote down and published the design, the hypotheses and how the results would be compared ([README.md](https://github.com/meabs/experiments/blob/332886b8ba803d6982bbafcf1abfeaa132884c8c/2026-10-benchmark-twins/README.md)):

- **H1–H3.** The local model scores lower on twins with new numbers (H1) or new names (H2) in GSM8K, and with a renamed function in HumanEval (H3).
- **H4.** Its drop on the number twins differs from the hosted model's.

## Set-up

**The benchmarks.**
- [GSM8K](https://github.com/openai/grade-school-math) is primary-school maths word problems. I used the 184 test items whose working could be replayed by a script. Every one got a twin with new numbers, and its answer was recomputed from the original working, with no model involved. 64 also got a twin with new names, and one with both.
- [HumanEval](https://github.com/openai/human-eval) asks for a Python function that passes hidden tests. I took 80 of its 164 items at random (two were left out of the draw because their function is already called `solution`), and made each a twin where the function is called `solution`.

**The models.** Both ran through the Codex command-line agent at low reasoning effort, in an empty folder with a read-only sandbox, one question at a time:

| | Local | Hosted |
| --- | --- | --- |
| Model | `qwen3.8:27b`, Q4_K_M | OpenAI `gpt-5.6-luna` |
| Where | Ollama 0.40.5 on a GMKtec EVO-X2 (Ryzen AI Max+ 395, Radeon 8060S, 64 GB memory), context 65,536 | OpenAI |
| Sampling | temperature 1.0, top_k 20, top_p 0.95 | provider default |

That made 656 answers per model, 1,312 in all. GSM8K answers were marked by exact match of the final number. HumanEval answers were marked by running the item's tests in a sandbox with no network.

## Results

Findings BT-1 to BT-4 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-bt-twins.png" alt="Share of items right, original against twin. qwen3.8:27b on this machine: GSM8K new numbers 168 against 161 of 184; new names 59 against 59 of 64; HumanEval renamed 75 against 72 of 80. gpt-5.6-luna hosted: 175 against 172 of 184; 62 against 63 of 64; 75 against 75 of 80." width="1800" height="920" loading="lazy" />

<figcaption>Share of items right on the original and on its twin, as preregistered (no regrading). Source: github.com/meabs/experiments, 2026-10-benchmark-twins/results (Codex CLI, low reasoning).</figcaption>

</figure>

### No measurable drop

| | Original | Twin |
| --- | --- | --- |
| Local, GSM8K, new numbers | 168 of 184 | 161 of 184 |
| Local, GSM8K, new names | 59 of 64 | 59 of 64 |
| Local, HumanEval, renamed function | 75 of 80 | 72 of 80 |
| Hosted, GSM8K, new numbers | 175 of 184 | 172 of 184 |
| Hosted, GSM8K, new names | 62 of 64 | 63 of 64 |
| Hosted, HumanEval, renamed function | 75 of 80 | 75 of 80 |

- **Every gap is a handful of items,** and some go the other way.
- **Longer problems showed no bigger drop.** A remembered answer should help most where the working is longest. On problems with four or more steps, the local model scored 32 then 30 of 36, and the hosted one 33 then 30.
- **The wrong answers weren't memories.** Each model got 15 number twins wrong. Not one of those 30 answers was the original question's answer.

### How the comparisons were made

The unit is the item: for each, right on the original minus right on its twin. The test flips the sign of each item's difference in every possible way, and asks how often the total is at least as large as the real one. The four results are adjusted upwards for multiple testing (Holm's method).

| Hypothesis | Right only on original / same / right only on twin | Difference (95% interval) | Chance (adjusted) |
| --- | --- | --- | --- |
| H1: local, new numbers | 16 / 159 / 9 | +3.8 pts (−1.6 to +9.2) | 0.46 |
| H2: local, new names | 4 / 56 / 4 | 0.0 pts (−9.4 to +9.4) | 1.0 |
| H3: local, renamed function | 7 / 69 / 4 | +3.8 pts (−3.8 to +12.5) | 0.82 |
| H4: local drop vs hosted drop | 14 / 160 / 10 | +2.2 pts (−3.3 to +7.6) | 1.0 |

None is supported: no measurable difference.

### The local model's misses were mostly the harness

Read after the results, so treat this as a check, not a finding of the design:

- **39 of the local model's 656 replies had no answer.** In 36, it had tried to run a command to check its sums or test its function. The sandbox refused, and it then wrote its answer into its reasoning instead of its reply. The hosted model never tried to run anything.
- **Regraded from that reasoning, 36 of the 39 are right.** The local model then scores 177 of 184 on the GSM8K originals and 78 of 80 on HumanEval, level with or above the hosted model. There's still no measurable drop on the twins.

### One faulty twin

One of my generated twins doesn't make sense. Item 1017's twin puts "4 albums of selfies and 3 of portraits" into 6 albums. The hosted model said so and was marked wrong. The local model gave the mechanical answer and was marked right. I searched all 184 twins for the same mistake and read every candidate. This was the only one. It stays in as marked, because the analysis was fixed before the run. Leaving it out changes nothing above.

### Cost

| | Answering time | Energy | Cost |
| --- | --- | --- | --- |
| Local | 2.97 hours | 235 Wh (processor package) | about £0.06 at £0.25/kWh. The same tokens at the hosted list prices: $0.39 |
| Hosted | 1.15 hours | not measured | $0.39 at list prices |

### Checks on the runs

- **All 1,312 answers were recorded and marked.** The local model timed out twice (10-minute limit). The hosted model had none.
- **The settings were checked in every session record:** the right model and provider, low effort, read-only sandbox.
- **Every twin was checked before the run.** Replaying the GSM8K working reproduces every original answer, and each HumanEval reference solution passes both versions of its tests.

## Limits

- **No drop isn't proof of no memorisation.** These twins keep the wording and the logic. A model that learned how GSM8K problems go, rather than their answers, would pass them. They test whether answers are recalled, not whether the skill carries over to new kinds of problem.
- **Easy items.** The 184 GSM8K problems are mostly two or three steps, and both models got over 90% of them right. That leaves little room for a drop.
- **The HumanEval twin is mild.** Renaming the function leaves the description and examples as they were.
- **One run per question,** at low reasoning effort. With 80 to 184 items, a drop of 5 to 10 points would show; a drop of 2 would not.
- **Reordering the sentences of a problem,** another common twin, was not tried.

## What this means

For these two models, these benchmark items don't look memorised. Change the numbers or the names and the scores hold, and the wrong answers are ordinary mistakes, not echoes of the original. A 27-billion-parameter model running on a desktop machine did as well as the hosted one here, once its answers were read properly.

That doesn't make benchmark scores a measure of real-world ability. These are the easy, well-worn kind of question, and both models nearly maxed them out. The harder question is whether a score on a familiar test predicts work on an unfamiliar one, and this experiment can't answer that.

## Reproduce

Everything is in [experiments/2026-10-benchmark-twins](https://github.com/meabs/experiments/tree/332886b8ba803d6982bbafcf1abfeaa132884c8c/2026-10-benchmark-twins):

- the twins and how they were made (`items/`, `scripts/make_gsm8k_twins.py`, `scripts/make_humaneval_twins.py`);
- the prompts (`arms/`);
- the runner and grader (`scripts/run.py`, `scripts/grade_code.py`);
- every answer (`results/main`);
- the analysis, regrading and chart scripts (`scripts/`).

The commands are in REPORT.md, section Reproducing.
