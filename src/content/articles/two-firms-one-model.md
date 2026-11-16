---
title: "Would an AI-Native Company Beat a Traditional One? What a Simulation Says It Depends On"
description: "I reviewed a small simulation of two rival software firms, one AI-native and one traditional. The headline was close to a coin flip, and what moved it was defect rate, review and cost, not the label."
date: 2026-11-16T22:00:00+00:00
summary: "In an illustrative simulation the AI-native firm finished with more cash in 45.5% of 2,000 paired runs. Defect rate moved that far more than anything else, and deciding monthly instead of quarterly did almost nothing."
draft: false
topics:
  - measurement
---

*Quick note before I start. Claude Code wrote the first draft of this from the experiment report and the code, and ran the checks described below. Both are in the download at the end.*

This is not an experiment on coding agents. It is a small simulation of two rival subscription software companies, and **every coefficient in it is made up**. Nothing below says how real companies perform. What it can tell me is how the *model* behaves, and which of my assumptions the answer is sensitive to. That is still worth knowing, because most arguments about "AI-native versus traditional" never say which assumptions they rest on.

## The setup

Two firms start level (£2.5m cash, 3,500 customers, the same product) and face the same market for 36 months, including the same outages, price pressure, demand spikes and compliance shocks.

- **Traditional:** 100 units of work a month, £205k monthly staff cost, defect factor 1.0, review strength 0.80, strategy reviewed quarterly.
- **AI-native:** 135 units of work, £150k staff cost, £32k tooling plus £200 of tokens per unit, defect factor 1.35, review strength 0.55, strategy reviewed monthly.

## The first answer was too noisy to read

The first version reported that the AI-native firm ended with more cash in 43% of 200 runs. That sounds like a finding. With 200 runs, the 95% interval on that number is ±6.9 points, so it could not tell "slightly behind" from "even".

With 2,000 paired runs, where both firms face identical draws in each run, it is **45.5% ±2.2**. The AI-native firm finishes £144k behind on average (±£54k), about 1.5% of the roughly £9m final cash. Measurably behind, but only just.

Before trusting even that, I ran two identical firms against each other. They should each win about half the time. They won 49.3% and 51.6% (±2.2 each), so the engine is not quietly favouring one side.

## What the answer depends on

The two firms cost almost exactly the same to run: about £244.0k a month in fixed costs for the AI-native firm against £247.5k for the traditional one. The cheaper staff is cancelled out by tooling and tokens. So any advantage has to come from doing more work, not from spending less.

To see which differences matter, I gave the AI-native firm the traditional firm's value for one trait at a time and watched its average final cash move:

| Trait (AI-native value vs traditional) | Worth to the AI-native firm |
|---|---|
| Staff cost (£150k vs £205k) | +£1.98m |
| Capacity (135 vs 100) | +£0.84m |
| Decision speed (monthly vs quarterly) | +£0.05m, within the noise (±£55k) |
| Review strength (0.55 vs 0.80) | −£0.88m |
| Defect factor (1.35 vs 1.0) | −£1.58m |
| Tooling spend (£32k + £200 per unit vs £6k + £15 per unit) | −£1.77m |

These do not add up to the total gap, because the effects interact: debt leads to incidents, incidents cost trust, and lost trust costs customers. Read them as a ranking, not a breakdown.

Decision speed barely matters. In this model, deciding monthly rather than quarterly is worth about £53k, which is inside the noise. I suspect that is a limit of the model rather than a finding about companies, since all it represents is how quickly a firm reacts to an event.

## The knife-edge

Defect rate is the steepest lever. Holding everything else fixed, the AI-native firm wins 98% of runs at a defect factor of 0.7, 93% at 1.0, 45.5% at 1.35 (where I started), 5% at 1.7 and under 1% at 2.0.

Every assumption I swept has a break-even point within 2 to 16% of the value I started with. So the starting point sits close to a tie. That says more about how I chose the numbers than about whether real firms are evenly matched.

## Why defects matter so much

Each unit of build work adds technical debt. Above a threshold, debt slows delivery and raises incident risk, and incidents cost trust and customers. In the baseline, the AI-native firm crosses that incident threshold in every run, at a median of month 9. The traditional firm does so in 4% of runs. By month 36 the AI-native firm's debt averages 55 against 10.5. (This is from 500 runs.)

That feedback loop is why small changes to defect rate or review strength can flip the outcome.

## What I got wrong in the first version

Reviewing the first version turned up several problems, all now fixed:

- A test meant to prove both firms see the same market events could never fail. I replaced it, and checked the new one by deliberately breaking the code and watching it fail.
- A bankrupt firm silently dropped out of the monthly trace. Nobody noticed because no firm ever went bankrupt, which is its own finding: survival was 100% even with market growth cut to 5% of normal, so the survival numbers told me nothing.
- The README described how customers switch between firms differently from what the code did.

## Try it yourself

This runs in your browser. Change the AI-native firm's assumptions and the result, the sensitivity chart and the spread of outcomes update. The page runs the same model as the Python code, and I checked it against the Python on tens of thousands of fixed-seed comparisons, including the random number stream.

<iframe id="two-firms-demo" src="/two-firms/?embed=1" title="Interactive simulation of an AI-native and a traditional firm" loading="lazy" style="width:100%;height:1900px;border:0;display:block"></iframe>

<script>
  (function () {
    var frame = document.getElementById('two-firms-demo');
    window.addEventListener('message', function (e) {
      if (e.origin !== location.origin || !frame || e.source !== frame.contentWindow) return;
      var h = e.data && e.data.ptlEmbedHeight;
      if (typeof h === 'number' && h > 200 && h < 6000) frame.style.height = h + 'px';
    });
  })();
</script>

[Open it full page →](/two-firms/)

## Limits

- **The coefficients are invented.** The results describe the model, not the world.
- **The sweeps vary one assumption at a time** around a single starting point. I also drew 400 random sets of AI-native assumptions from ranges I chose. The AI-native firm came out ahead on average in 41.5% of them, but the ranges are my guesses, so that is not a probability about real firms. The ranking of what drives the result is the sturdier part: defect factor first, then staff cost, capacity and review strength.
- **The firms barely interact.** They share a market and 20% of churned customers move to the rival, so this is closer to two parallel businesses than a head-to-head fight.
- **What would make it informative** is measuring defect rate and review effects on real tasks. Those two inputs decide the answer and are the least grounded.

[↓ Download the simulation, report and tests (zip)](/two-firms/two-firms-simulation.zip)
