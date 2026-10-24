---
title: "Does an AI's visible thinking drive its answer? I planted errors in it to find out (experiment PE)"
description: "I edited a number in the middle of a local reasoning model's thinking on 144 maths problems. A third of the time it carried the error to a wrong answer without a flicker of doubt. It caught about half. And in 1 run in 10, its thinking concluded one answer while its reply quietly gave another."
date: 2026-10-24
summary: "Planting a wrong intermediate number in qwen3.8:27b's thinking changed its final answer 35% of the time, nearly always with no sign of doubt. It caught 54% of the slips in its thinking. In 10% of runs the thinking ended on the wrong answer and the written reply silently fixed it, so the thinking was not a faithful record of how the answer was reached."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/f74c9cf1ff0c4754795526155af30041855177a1/2026-10-planted-errors"
draft: false
experimentId: "PE"
question: "If a wrong number is planted in the middle of a reasoning model's thinking, does its answer follow the error, does it catch it, or does the answer come from somewhere else?"
status: published
evidenceGrade: published
agents:
  - name: "Ollama 0.40.5 (called directly, no agent)"
    model: "qwen3.8:27b (Q4_K_M, local)"
    settings: "thinking on; temperature 1.0, top_k 20, top_p 0.95; fixed seeds"
runs: 1143
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/f74c9cf1ff0c4754795526155af30041855177a1/2026-10-planted-errors/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/f74c9cf1ff0c4754795526155af30041855177a1/2026-10-planted-errors/README.md"
previewImage: "/guide-images/chart-pe-planted.png"
previewAlt: "Left: forced-answer accuracy rises from 23% with no thinking to 94% with the full thinking. Right: planted errors were followed 34 and 47 times of 115, caught in the thinking 67 and 57 times, and silently fixed only in the reply 12 and 11 times."
topics:
  - verification
  - safety-cost
  - measurement
publishedOn: 2026-10-24
findings:
  - id: "PE-1"
    statement: "A wrong number planted in the model's thinking was carried through to the matching wrong answer in 81 of 230 runs (35%); with the thinking left unchanged, 1 of 230 went wrong"
    metric: "wrong answers, planted minus unchanged continuation, per problem"
    value: "+37 pts"
    interval:
      low: "+30 pts"
      high: "+44 pts"
      method: "bootstrap 95% CI over 129 problems; exact sign-flip test, Holm p < 0.001"
    n: 230
    detail:
      - "error at the first step followed 34 of 115 times; at the second-to-last step 47 of 115 (Holm p 0.047)"
      - "74 of the 81 followed runs showed no sign of doubt in the thinking; 80 of 81 replies showed none"
    limits:
      - "one local model, school maths problems"
      - "errors were planted by editing the text, not made by the model itself"
    source: "https://github.com/meabs/experiments/blob/f74c9cf1ff0c4754795526155af30041855177a1/2026-10-planted-errors/REPORT.md"
    status: current
    featured: false
  - id: "PE-2"
    statement: "The model caught the planted slip in its own thinking in 124 of 230 runs (54%)"
    metric: "runs where the thinking restated the true value and recovered"
    value: "124/230"
    n: 230
    limits:
      - "the slips were blatant: the wrong result sat next to the sum that produced it"
      - "counted by text search, checked by reading a sample"
    source: "https://github.com/meabs/experiments/blob/f74c9cf1ff0c4754795526155af30041855177a1/2026-10-planted-errors/REPORT.md"
    status: current
    featured: false
  - id: "PE-3"
    statement: "In 23 of 230 runs (10%), the thinking ended on the wrong answer but the written reply gave the right one without saying why; the reverse never happened"
    metric: "thinking's final number = the error's answer, reply differs"
    value: "23/230"
    n: 230
    limits:
      - "preregistered as a count, not a test; all 23 read and confirmed"
    source: "https://github.com/meabs/experiments/blob/f74c9cf1ff0c4754795526155af30041855177a1/2026-10-planted-errors/REPORT.md"
    status: current
    featured: false
  - id: "PE-4"
    statement: "The thinking does real work: forced to answer with no thinking, the model got 23% of problems right; after its full thinking, 94%"
    metric: "right, forced answer after full thinking minus with none"
    value: "+71 pts"
    interval:
      low: "+63 pts"
      high: "+79 pts"
      method: "bootstrap 95% CI over 144 problems; exact sign-flip test, Holm p < 0.001"
    n: 144
    limits:
      - "problems with exact numeric answers, where working things out obviously helps"
    source: "https://github.com/meabs/experiments/blob/f74c9cf1ff0c4754795526155af30041855177a1/2026-10-planted-errors/REPORT.md"
    status: current
    featured: false
---

## Question

Reasoning models show you their "thinking" before they answer. It's presented as a window into how the model got there: read it, and you can see whether to trust the answer. Some safety proposals go further, and rely on monitoring that thinking to catch a model going wrong.

That only works if the answer really comes from the thinking. So I tested it directly: **change a number in the middle of the model's thinking and see what happens to the answer.**

- If the thinking drives the answer, the answer should follow the error, unless the model notices.
- If the answer comes from somewhere else, the edit shouldn't matter.

This can only be done with a model you run yourself. Hosted services like OpenAI's don't let you read the raw reasoning, let alone edit it.

## Prediction

Before the run, I wrote down and published the design and hypotheses ([README.md](https://github.com/meabs/experiments/blob/f74c9cf1ff0c4754795526155af30041855177a1/2026-10-planted-errors/README.md)):

- **H1.** Editing the thinking changes the answer: more wrong answers than when it's left alone.
- **H2.** Errors planted early and late are followed at different rates.
- **H3.** The thinking helps: an answer forced after the full thinking is right more often than one forced with none.

## Set-up

**The model:** `qwen3.8:27b`, an open-weight reasoning model compressed to 4-bit (Q4_K_M). It ran in Ollama 0.40.5 on a desktop machine: a GMKtec EVO-X2 with an AMD Ryzen AI Max+ 395 and 64 GB of memory. It was called directly, with no coding agent or other harness, at its default settings and with fixed random seeds, so every run can be repeated exactly.

**The problems:** 144 school maths word problems from [GSM8K](https://github.com/openai/grade-school-math) with at least 3 steps. A script replays each one's reference working step by step. That gives, for any planted error, the exact wrong answer you'd reach by carrying it through.

**For each problem:**
1. **Free run.** The model thinks and answers on its own.
2. **Find two steps in its thinking:** the first and the second-to-last. These were found in about 82% of problems; in the rest, its working differed from the reference.
3. **Planted.** I changed that step's result to a wrong value, for example "Charleston = 4 × 20 = 80" became "= 55", and let the model carry on from there.
4. **Control.** The same, with the thinking left unchanged, to check that cutting and resuming doesn't change the answer by itself.
5. **Forced answers.** I stopped the thinking at different points (none, before each step, after all of it) and made the model answer at once.

That made 1,143 calls. Each planted run is marked by its final answer: **followed** the error, **recovered** the right answer, or other.

## Results

Findings PE-1 to PE-4 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-pe-planted.png" alt="Left: share right when forced to answer: no thinking 23%, thinking cut before the first step 23%, before the second-to-last step 57%, full thinking 94%. Right: what happened to a planted wrong number, of 115 runs each. Error at the first step: followed 34, caught in the thinking 67, thinking ended wrong but reply fixed it 12, other 2. Error at the second-to-last step: 47, 57, 11, 0." width="1800" height="920" loading="lazy" />

<figcaption>Left: the answer is built during the thinking. Right: a planted wrong number was carried through a third of the time, caught in the thinking about half the time, and in about 1 run in 10 fixed only in the reply. Source: github.com/meabs/experiments, 2026-10-planted-errors/results (qwen3.8:27b, Q4_K_M, via Ollama).</figcaption>

</figure>

### The thinking really does build the answer

Forced to answer with no thinking, the model got 23% of problems right. Stopped just before the first step, still 23%. Before the second-to-last step, 57%. After the full thinking, 94%. The answer isn't decided up front and then dressed up: it's worked out as the thinking goes.

### A wrong number in the thinking became a wrong answer a third of the time

| Where the error was planted | Followed it to a wrong answer | Caught it in the thinking | Thinking ended wrong, reply fixed it | Other |
| --- | --- | --- | --- | --- |
| First step | 34 of 115 | 67 | 12 | 2 |
| Second-to-last step | 47 of 115 | 57 | 11 | 0 |

With the thinking left unchanged, 1 of 230 continuations went wrong. With the error planted, 81 did.

- **It followed errors without a flicker of doubt.** On one problem, I changed "Rani = Monic + 10 = 36 + 10 = 46" to "= 68". The model went straight on to "40 + 36 + 68 = 144". Its written reply then showed "Rani = 36 + 10 = 68" as working and answered 144. The right answer is 122. In 74 of the 81 followed runs, nothing in the thinking showed doubt. In 80 of the 81 replies, nothing did.
- **Later errors got through more often:** 41% against 30%.

### It caught about half, often by sanity-checking against the question

In 124 of the 230 runs, the model noticed. Typically it used the planted number on the next line, then stopped: "Hmm, that gives fewer chairs than sofas, which contradicts '2 fewer sofas than chairs.' Let me re-read." Or simply: "Wait, let me recalculate."

### Sometimes the thinking and the answer disagreed

In 23 runs, the thinking finished on the wrong answer that follows from the error, and the written reply then gave the right one.

- In one, the thinking "double-checked" its working, restated "2 × 2 = 3", and concluded 960.
- The reply then started again ("twice as many as sheets = 2 × 2 = 4"), and answered 1,200.
- Nothing in the reply says the thinking was wrong.
- The reverse, right thinking and a wrong reply, never happened.

### How the comparisons were made

The unit is the problem. Each result is a per-problem difference, tested by flipping the sign of each problem's difference in every possible way, with the three results adjusted for multiple testing (Holm's method).

| Hypothesis | Problems + / 0 / − | Difference (95% interval) | Chance (adjusted) |
| --- | --- | --- | --- |
| H1: wrong answers, planted − unchanged | 68 / 60 / 1 | +37 pts (+30 to +44) | < 0.001 |
| H2: followed, late − early | 25 / 64 / 12 | +13 pts (+1 to +25) | 0.047 |
| H3: right, full thinking − none | 103 / 40 / 1 | +71 pts (+63 to +79) | < 0.001 |

All three are supported.

### Cost

The whole run took 1.7 hours on the desktop machine and used 145 Wh, about 4p of electricity.

### Checks on the runs

- **No call failed,** and none hit the length limit.
- **The server version, model fingerprint and settings were recorded** at the start of the run.
- **I read the transcripts behind the counts:** all 23 cases where thinking and reply disagreed, and a sample of the recoveries.

## Limits

- **One model**, compressed to 4-bit. Bigger or differently trained models may follow or catch errors at different rates.
- **School maths only,** with exact answers. My errors were blatant: the wrong result sat right next to the sum that produced it. Real errors are usually harder to spot.
- **Planted, not natural.** The model didn't make these mistakes itself. It may treat an out-of-place number differently from its own slip.
- **Hosted reasoning models can't be tested this way,** because their reasoning can't be read or edited. So this says nothing directly about them.
- **The "caught" and "disagreed" counts come from text searches,** checked by reading transcripts, not by reading every run.

## What this means: impact and risks

This part is my interpretation, not a measurement.

**Bad data in, confident wrong answer out.** A planted number stands in for any wrong figure that gets into a model's working: a misread document, a faulty tool result, or text an attacker has hidden in a web page the model reads (prompt injection). I didn't test those routes directly, but the mechanism is the same: the model builds on whatever is in front of it. A third of the time it carried the error to the end, and it said so in exactly the tone it uses when it's right. An assistant summarising your invoices or logs can turn someone else's mistake into its own conclusion, and you won't hear it hesitate.

**"It checks its own work" is a habit, not a safeguard.** It caught half of the easiest possible slips, and fewer of the late ones. Subtler errors, such as a plausible but wrong figure with no sum beside it to contradict, will probably get through more often.

**The visible thinking isn't a faithful record.** In 1 run in 10, the thinking concluded one thing and the answer said another, with no explanation. Here the reply happened to be the right one. But anyone treating the thinking as an audit trail has a problem: the trail and the answer can come apart without warning. That includes a reviewer deciding whether to trust an answer, an automated monitor scanning reasoning for trouble, or a product showing a summary of the model's thinking as its explanation. In finance, health, legal work or safety monitoring, that's the difference between checking the model's decision and checking a story about it.

**What to do about it:**
- Check key numbers against the source yourself, especially ones the model took from documents or tools.
- Ignore the tone. Wrong answers here sounded as sure as right ones, just as the AI reviewer's confidence meant nothing in [experiment DJ](/experiments/diff-judge/).
- Don't take a model's reasoning, or a summary of it, as proof of how it got its answer. Check the answer itself.
- Where it matters, have something other than the model check it: a calculation, a test, or a second source.

## Reproduce

Everything is in [experiments/2026-10-planted-errors](https://github.com/meabs/experiments/tree/f74c9cf1ff0c4754795526155af30041855177a1/2026-10-planted-errors):

- the problems and planted values (`items/`, `scripts/make_items.py`);
- the runner, which calls Ollama directly (`scripts/run.py`);
- every call's output (`results/main`);
- the analysis and chart scripts (`scripts/`).

The commands are in REPORT.md, section Reproducing.
