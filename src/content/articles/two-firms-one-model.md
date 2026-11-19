---
title: "Would an AI-Native Company Beat a Traditional One? What a Simulation Says It Depends On"
description: "I reviewed a small simulation of two rival software firms, one AI-heavy and one traditional. The headline was close to a coin flip, and what moved it was defect rate, review and cost, not the label. The simulation compares two ways of delivering software. It does not model an AI-native company, and every coefficient in it is invented."
date: 2026-11-16T22:00:00+00:00
summary: "In an illustrative simulation the AI-heavy firm finished with more cash in 45.5% of 2,000 paired runs. Defect rate moved that far more than anything else, and deciding monthly instead of quarterly did almost nothing. Twelve of sixteen invented assumptions can flip the winner when moved by 20%."
draft: false
topics:
  - measurement
---

*Quick note before I start. Claude Code wrote the first draft of this from the experiment report and the code, and ran the checks described below. Both are in the download at the end. I have since revised it, and the revision is described in "What changed in version 0.2".*

This is not an experiment on coding agents. It is a small simulation of two rival subscription software companies, and **every coefficient in it is made up**. Nothing below says how real companies perform. What it can tell me is how the *model* behaves, and which of my assumptions the answer is sensitive to. That is still worth knowing, because most arguments about "AI-native versus traditional" never say which assumptions they rest on.

## What this simulation tests, and what it doesn't

The title asks about an AI-native company. The simulation can't answer that, because three different things get called by that name:

- **AI-heavy software delivery.** An ordinary company whose engineers get much more done with AI. In the model that means more output a month, cheaper staff, more defects created per unit of work and lighter review.
- **Traditional software delivery.** Less output, dearer staff, fewer defects created per unit of work and stronger review.
- **A genuinely AI-native operating model.** A company designed around AI from the top: how it decides, hires, prices, sells, supports customers and structures its teams. None of that is in here.

The simulation compares the first two. Both firms use the same product strategy, the same decision rules (only how *often* they re-plan differs), the same price and the same market. So it is a comparison of two ways of delivering software, not of two kinds of company. My first draft, and the code, called the first firm "AI-native", which claimed more than the model does. In this article it is **AI-heavy**. The code and the output files still say "AI-native", because I didn't want to change a byte of the original results for the sake of a word.

I have kept the title, because it is the question people actually ask. The honest answer to it is "this can only speak to a narrow slice of that".

## The setup

Two firms start level (£2.5m cash, 3,500 customers, the same product) and face the same market for 36 months, including the same outages, price pressure, demand spikes and compliance shocks.

- **Traditional:** 100 units of work a month, £205k monthly staff cost, defect factor 1.0, review strength 0.80, strategy reviewed quarterly.
- **AI-heavy:** 135 units of work, £150k staff cost, £32k tooling plus £200 of tokens per unit, defect factor 1.35, review strength 0.55, strategy reviewed monthly.

## The assumptions, all of them

These are the numbers the whole article stands on. I want to be plain about their status: **all of them are invented**. None is calibrated to data and none is backed by evidence. Where I say "plausible-looking" I mean they look reasonable to me, not that I sourced them. They are illustrative, not estimates of AI productivity, software quality or anyone's costs.

The first table is the pair of firms. These are the assumptions that make one firm "AI-heavy".

| Parameter | Traditional | AI-heavy | Why it exists | Status |
|---|---|---|---|---|
| Delivery capacity (units of work a month) | 100 | 135 | The output a team can build before debt slows it. The 35% gap is my stand-in for "AI productivity". | Invented |
| Monthly staff cost | £205k | £150k | What the engineering team costs. | Invented |
| Monthly tooling | £6k | £32k | Fixed spend on AI tools and platforms. | Invented |
| Token cost per work unit | £15 | £200 | Usage-based AI cost for each unit delivered. | Invented |
| Defect factor | 1.0 | 1.35 | Technical debt created per unit of build work, relative to the traditional firm. | Invented |
| Review strength | 0.80 | 0.55 | Quality assurance before shipping. Higher means less debt created and fewer bad builds. | Invented |
| Decision cadence | quarterly (3 months) | monthly (1 month) | How often the firm re-plans how it splits its effort. | Invented |

The second table is what both firms share. These matter too, because they decide what the first table is worth.

| Parameter | Value (both firms) | Why it exists | Status |
|---|---|---|---|
| Starting position | £2.5m cash, 3,500 customers, product 49, fit 48, debt 18, trust 72, governance 66 | So the only differences are the assumptions above. | Invented |
| Revenue per customer | £82 a month | Turns customers into cash. | Invented |
| Running cost per customer | £8 a month | Support and hosting, so growth isn't free. | Invented |
| Common overhead | £35k a month | Costs that don't depend on how the software is delivered. | Invented |
| Technical debt per unit of build work | 0.068 | How fast building adds debt before the firm's defect factor and review apply. | Invented |
| How much review cuts that debt | 0.40 | Debt per build is multiplied by 1.15 − 0.40 × review strength. | Invented |
| Debt slows delivery above | 20 | Debt has a cost to output before it causes incidents. | Invented |
| Debt raises incident risk and churn above | 28 | A threshold I chose. It creates the cliff that decides much of the answer. | Invented |
| Base monthly churn | 1.4% | Customers leave even when nothing is wrong. | Invented |
| Share of churned customers who switch to the rival | 20% | So the firms interact a little. | Invented |
| Horizon | 36 months | Long enough for debt to matter. | Invented |

Every other constant, from the incident probabilities to the market's event mix, is in the box below. There are a lot of them, which is rather the point.

<details>
<summary>Every other constant in the model</summary>

| Constant | Value | Role |
|---|---|---|
| Monthly delivery noise | ±6.5% (normal), clamped to 0.7 to 1.3 times | So no month is exactly average. |
| Delivery slowdown from debt | −0.45% per debt point above 20, floor 40% of capacity | The cost of debt to output. |
| Effort split (both firms), in the order discover / build / harden / grow / govern | 16 / 36 / 21 / 16 / 11 percent, nudged by the month's event, noise ±1.5 points | The same policy for both, so strategy isn't a hidden variable. |
| Split in a new-demand month | 23 / 43 / 15 / 12 / 7 | Build more when demand spikes. |
| Split in a compliance month | 9 / 21 / 25 / 10 / 35 | Govern more. |
| Split in an outage month | 8 / 21 / 44 / 10 / 17 | Harden more. |
| Split under price pressure | 12 / 33 / 20 / 25 / 10 | Grow more. |
| Product-market fit gain | 0.068 per discover unit, with diminishing headroom | Discovery makes building more relevant. |
| Product gain per build unit | 0.047 plus 0.00028 per fit point above 45, ×1.30 in a new-demand month, with diminishing headroom | What building is worth. |
| Debt removed by hardening | 0.105 per unit | Maintenance pays the debt down. |
| Governance | +0.078 per govern unit, −0.017 per build unit | Building fast erodes controls. |
| Bad build probability | 0.8% + 0.18 points per governance point below 60 + 0.08 points per fit point below 55 + 2.7% × (1 − review); +4.5 points in a compliance month | Knowingly breaking a control under pressure. |
| Bad build consequence | debt +5, trust −3, £30k | |
| Incident probability | 1.2% + 0.22 points per debt point above 28 + 0.15 points per governance point below 55; +13 points in an outage month; +8 points after a bad build; capped at 45% | Incidents come from state, not from a label. |
| Incident consequence | trust −4 to −10, debt +1 to +4, £25k to £100k | |
| Quiet-month trust gain | +0.017 per harden unit, +0.012 per govern unit | |
| Compliance penalty | £3.5k per governance point below 65 in a compliance month, trust −2 | |
| Churn | 1.4% + 0.048 points per trust point below 65 + 0.018 points per debt point above 28 + 1.2 points after an incident, clamped to 0.4% to 14% | |
| Market demand | about 480 new prospects a month (normal, spread 125) | Shared by both firms. |
| Event mix, per 100 months | 72 normal, 9 new-demand (demand ×1.4), 7 outage, 8 price pressure (demand ×0.75), 4 compliance | Independent month to month. |
| How prospects choose | share of demand set by attractiveness (0.39 product, 0.19 fit, 0.23 trust, 0.14 × (100 − debt), 0.05 growth spend), a softmax with scale 17, centre 60 and an outside option of 0.8 | |

Status of every row: invented.

</details>

## The first answer was too noisy to read

The first version reported that the AI-heavy firm ended with more cash in 43% of 200 runs. That sounds like a finding. With 200 runs, the 95% interval on that number is ±6.9 points, so it could not tell "slightly behind" from "even".

With 2,000 paired runs, where both firms face identical draws in each run, it is **45.5% ±2.2**. The AI-heavy firm finishes £144k behind on average (±£54k), about 1.5% of the roughly £9m final cash. Measurably behind, but only just.

Before trusting even that, I ran two identical firms against each other. They should each win about half the time. They won 49.3% and 51.6% (±2.2 each), so the engine is not quietly favouring one side.

## What the answer depends on

The two firms cost almost exactly the same to run: about £244.0k a month for the AI-heavy firm against £247.5k for the traditional one, counting staff, overhead, tooling and tokens at normal output, before the per-customer cost and any incident penalties. The cheaper staff is cancelled out by tooling and tokens. So any advantage has to come from doing more work, not from spending less.

To see which differences matter, I gave the AI-heavy firm the traditional firm's value for one trait at a time and watched its average final cash move:

| Trait (AI-heavy value vs traditional) | Worth to the AI-heavy firm |
|---|---|
| Staff cost (£150k vs £205k) | +£1.98m |
| Capacity (135 vs 100) | +£0.84m |
| Decision speed (monthly vs quarterly) | +£0.05m, within the noise (±£55k) |
| Review strength (0.55 vs 0.80) | −£0.88m |
| Defect factor (1.35 vs 1.0) | −£1.58m |
| Tooling spend (£32k + £200 per unit vs £6k + £15 per unit) | −£1.77m |

These do not add up to the total gap, because the effects interact: debt leads to incidents, incidents cost trust, and lost trust costs customers. Read them as a ranking, not a breakdown.

Decision speed barely matters. In this model, deciding monthly rather than quarterly is worth about £53k, which is inside the noise. I suspect that is a limit of the model rather than a finding about companies, since all it represents is how quickly a firm reacts to an event. I look at that again below.

## The knife-edge

Defect rate is the steepest lever. Holding everything else fixed, the AI-heavy firm wins 98% of runs at a defect factor of 0.7, 93% at 1.0, 45.5% at 1.35 (where I started), 5% at 1.7 and under 1% at 2.0.

Every one of the AI-heavy firm's assumptions I first swept has a break-even point within 2 to 16% of the value I started with. So the starting point sits close to a tie. That says more about how I chose the numbers than about whether real firms are evenly matched.

## Why defects matter so much

Each unit of build work adds technical debt. Above a threshold, debt slows delivery and raises incident risk, and incidents cost trust and customers. In the baseline, the AI-heavy firm crosses that incident threshold in every run, at a median of month 9. The traditional firm does so in 4% of runs. By month 36 the AI-heavy firm's debt averages 55 against 10.5. (This is from 500 runs.)

That feedback loop is why small changes to defect rate or review strength can flip the outcome.

## What the 45.5% does and doesn't tell you

There are three different kinds of uncertainty hiding in that number, and they are easy to mix up.

**1. Random variation inside the simulation.** The ±2.2 is this one. It says how far the 45.5% would move if I reran the same model with different random draws, and it shrinks as I add runs. To check it, I ran the baseline on six independent blocks of 2,000 runs. The AI-heavy win rate came out between 44.9% and 47.6%, and the average gap between −£94k and −£180k. So the interval is honest about the noise.

**2. Uncertainty about the assumptions.** This one does not shrink with more runs, because the numbers are invented. Moving a single assumption by 20% shifts the average gap by up to £2.95m, about twenty times the baseline gap, and moves the win rate anywhere from 8% to 89%. Next to that, the ±2.2 is a rounding error.

**3. Whether the model resembles real businesses at all.** I haven't tested that, and nothing here could. No coefficient is calibrated to data.

A narrow interval around an invented number is a very precise answer to the question "how does my model behave under my guesses?". It is not an answer to "how do real firms behave?". So the sentence I'd stand behind is: *in this model, with these made-up numbers, the two firms finish close to level on average, and which one is ahead depends on the assumptions far more than on the label.* The sentence I wouldn't write is "AI-native firms lose 54.5% of the time".

## Which assumptions decide the winner?

The earlier tests moved the AI-heavy firm's traits. That leaves out the traditional firm's assumptions and everything the two firms share, and the winner depends on those just as much. So I moved every assumption in turn, one at a time, to 80% and 120% of its baseline value, with 2,000 paired runs at each setting and the same random draws throughout, so the differences between bars are not sampling noise.

<figure class="guide-figure">

<img src="/guide-images/chart-two-firms-sensitivity.png" alt="Tornado chart: average final cash gap, AI-heavy minus traditional, when each of sixteen assumptions is moved to 80% and 120% of its baseline value. The baseline gap is −£144k. Widest bars: traditional staff cost, from −£1.62m to +£1.33m; AI-heavy defect factor, from −£1.64m to +£1.16m; AI-heavy staff cost, from −£1.22m to +£0.94m; technical debt per unit of build work, from −£1.25m to +£0.85m; traditional delivery capacity, from −£1.09m to +£0.84m. Twelve of the sixteen bars cross zero, meaning they can change the winner. Revenue per customer, base churn and running cost per customer barely move it, and common overhead does not move it at all because both firms pay it." width="1800" height="1141" loading="lazy" />

<figcaption>Twelve of sixteen assumptions can flip the winner when moved by a fifth. The code and results behind the chart are in the download below (model v0.2, sensitivity.py).</figcaption>

</figure>

Three things stand out.

- **Staff cost moves the result as much as defect rate does.** The traditional firm's staff cost is the widest bar, ahead of the AI-heavy firm's defect factor. Earlier I said defect factor was the steepest lever. Among the AI-heavy firm's own traits it still is, but across everything it is level with who pays what for engineers.
- **The shared assumptions are not harmless.** How much debt a unit of build work creates is the fourth widest bar, and the debt level where incidents begin is a threshold I picked by eye. Both come from my modelling, not from either firm.
- **Costs that both firms pay barely matter.** Revenue per customer, base churn and the cost of serving each customer move the gap by about £120k or less. Common overhead moves it by exactly nothing: it is the same bill for both firms, so it cancels out of the difference. It would only matter if it pushed a firm out of business, and nothing here does (more on that below).

### Where the answer tips

For each assumption I also searched for the value at which the two firms' average cash is level, the tipping point, using four independent blocks of 2,000 runs each so I can see how far the tipping point itself wobbles.

| Assumption (baseline) | Tipping point, average across blocks | Range across blocks | Distance from baseline |
|---|---|---|---|
| AI-heavy defect factor (1.35) | 1.32 | 1.32 to 1.33 | −1.9% |
| Traditional staff cost (£205k) | £208.9k | £207.7k to £209.9k | +1.9% |
| Technical debt per unit of build work (0.068) | 0.066 | 0.066 to 0.067 | −2.4% |
| AI-heavy staff cost (£150k) | £146.2k | £145.2k to £147.5k | −2.5% |
| Traditional delivery capacity (100) | 97.2 | 96.5 to 98.0 | −2.8% |
| AI-heavy delivery capacity (135) | 141.4 | 139.2 to 143.0 | +4.7% |
| AI-heavy review strength (0.55) | 0.59 | 0.58 to 0.60 | +6.7% |
| AI-heavy tooling and token spend (×1.0) | ×0.93 | ×0.92 to ×0.95 | −6.8% |
| Traditional defect factor (1.0) | 1.08 | 1.05 to 1.10 | +7.6% |
| Debt level where incidents begin (28) | 31.0 | 30.0 to 31.7 | +10.7% |
| How much review cuts that debt (0.40) | 0.45 | 0.44 to 0.46 | +12.5% |
| Traditional review strength (0.80) | 0.69 | 0.66 to 0.72 | −14.1% |
| Revenue per customer (£82) | £45 | £42 to £52 | −44.9% |
| Base monthly churn, running cost per customer, common overhead | no tipping point in the range searched | | |

Two different questions are in this table, and I'd keep them apart. The *distance from baseline* is parameter sensitivity: how wrong an assumption has to be before the winner changes. The *range across blocks* is statistical uncertainty in locating the tipping point, which more runs would narrow. The first is small, and no number of extra runs will make it larger.

Read that way, the AI-heavy firm needs about 41% more output than the traditional one (141 units against 100, not the 135 I gave it) to pull level on average, with everything else as it is. That is the closest thing in this article to a statement about "AI productivity", and it is a statement about my model.

### The same thing, with everything varying at once

One-at-a-time sweeps can't see interactions, so I also drew 400 random sets of all sixteen assumptions, each within 30% of baseline, and ran 150 paired runs on each. The AI-heavy firm came out ahead on average in 41.5% of the sets (43.0% and 48.2% with different random draws, so it is not precise). The rank correlations with the cash gap put the traditional firm's staff cost first (0.49), then the AI-heavy firm's staff cost (−0.42), its defect factor (−0.40), debt per build (−0.37) and the traditional firm's capacity (−0.31), with everything after that below 0.25 and the common costs near zero. The ranges are mine, so the order of the top five is as soft as they are. The thing that survives is the split: a handful of assumptions about who pays what, who ships how much and how fast debt builds decide the result, and the rest hardly register.

## Checking the model's weak spots

Before trusting any of that I went looking for ways the model might be tilting the result without telling me.

**Does more delivery capacity automatically create more value?** Mostly yes, and that flatters whichever firm has more. At the baseline defect and review settings, raising the AI-heavy firm's capacity from 100 to 400 lifts the average gap from −£985k to +£2.1m. It flattens at about 300 (win rate 90%) because the product saturates (from 81 to 99) and debt rises (incidents from 1.4 to 3.6 a run). With good quality (defect factor 1.0, review 0.80), nothing holds it back: the gap climbs from +£0.37m to +£7.0m. The model has no cost of coordinating more output and no limit on what the market will absorb beyond the product topping out. Real organisations do hit those walls, so the capacity upside here is generous.

**Do the debt feedback loops dominate because of the coefficients I chose?** Yes. Move the debt level where incidents begin from 28 to 40 and the AI-heavy firm goes from winning 45.5% to 61.9%, and from £144k behind to £263k ahead. At 60 or more it wins about 69%. At 20 it wins 30%. One threshold I picked by feel decides roughly the whole gap between "behind" and "ahead", and the same goes for how much debt a unit of build work creates.

**Does it represent financial distress?** No. In 2,000 baseline runs the lowest cash either firm ever reached was £2.38m (AI-heavy) and £2.41m (traditional) from a £2.5m start, and every firm in every run survived. Cutting starting cash to £600k and raising overhead to £90k still leaves everyone alive (lowest cash about £245k). Add a year of demand at half strength on top of that and the AI-heavy firm went bust in 2 of 2,000 runs (the traditional firm in none). So "who ends with more cash" is really a comparison of profit. Nothing in the model lets a firm run low on cash and then behave differently, borrow, raise money or cut costs. Treat any survival number from this model as meaningless. The first review made the bankruptcy path testable, and it turns out to be nearly unreachable.

**Are customer demand and market shocks realistic?** No, and it matters less than I expected. Demand is a fresh random draw every month, and outages and price pressure are independent from one month to the next, with no recessions that last. To see whether that was hiding something, I added optional persistent downturns. Halving demand for twelve months moves the AI-heavy win rate from 45.5% to 45.1%, and cutting it to 30% for eighteen months gives 42.9%. The answer hardly notices. That is partly because both firms face the same demand, so shocks mostly cancel in the difference. It is a property of how I built the comparison, not evidence that real markets would be this forgiving.

**Does decision speed matter?** A little, and only when it gets slow. Monthly re-planning leaves the AI-heavy firm £144k behind, every two months £187k, quarterly £197k, every six months £308k and yearly £469k (each ±£54k to £64k). So the "agility" edge of monthly over quarterly is about £53k, inside the noise, and a firm that only re-plans yearly pays about £325k more than one that does it monthly. In the model, deciding more often does just one thing: it lets the firm react sooner to the month's event. It doesn't learn, pivot or coordinate better. So I'd drop "agility" from the claims and keep this as a statement about the model's limits.

**Are common overhead and operating costs explained?** They weren't, so there is now an assumptions table above. Overhead (£35k) and running cost (£8 a customer) are shared, and, as the chart shows, shared costs change very little. A narrower reading of that is that the model is nearly blind to how much a firm spends on things both firms spend on.

## What I got wrong in the first version

Reviewing the first version turned up several problems, all now fixed:

- A test meant to prove both firms see the same market events could never fail. I replaced it, and checked the new one by deliberately breaking the code and watching it fail.
- A bankrupt firm silently dropped out of the monthly trace. Nobody noticed because no firm ever went bankrupt, which is its own finding: survival was 100% even with market growth cut to 5% of normal, so the survival numbers told me nothing.
- The README described how customers switch between firms differently from what the code did.

## What changed in version 0.2

I didn't change the model's behaviour. With the defaults it produces exactly the same numbers as before: a test checks the shipped results of all four original scenarios byte for byte, and rerunning the original experiment script gives an identical results file. One claim did soften (the ranking of what matters, covered in the limits). What I changed:

- **The shared coefficients are now named assumptions** you can vary (debt per build, review effect, the debt thresholds, churn, revenue and cost per customer, overhead, starting cash and an optional demand downturn). With the defaults, the model reproduces the original results byte for byte, and a test pins that.
- **The sensitivity analysis is new.** It covers the six areas I wanted (AI productivity, defects, review, debt, costs and churn), plus the traditional firm's assumptions and the shared ones. The code is `sensitivity.py`.
- **The lowest cash each firm reached is now tracked**, so financial distress can at least be looked at.
- **The interactive page is rebuilt** (below).

I left alone the things I'd flagged earlier and not fixed: the timing mismatch between monthly cost and revenue, the string-matching on the firm's name in the scenario code, and the way the decision cadence also changes the random draws. Each would shift results, and none seems big enough to justify a different baseline. If I make a model that changes the numbers, it will be a new version with its own results next to these, not an edit.

## Try it yourself

This runs in your browser. The assumptions are grouped into the AI-heavy firm, the traditional firm and the ones both share, each with what it controls, its default and a button to put it back. The result is shown next to the baseline, and the page says so when your changes reverse it. The page runs the same model as the Python code, and I checked it against the Python on tens of thousands of fixed-seed comparisons, including the random number stream and every shared assumption. At its default of 2,000 runs it shows the same 45.5% as this article.

Changing an input is exploring a hypothetical scenario. It is not a forecast, and the ± is the random variation only.

<iframe id="two-firms-demo" src="/two-firms/?embed=1" title="Interactive simulation of an AI-heavy and a traditional software firm" loading="lazy" style="width:100%;height:2400px;border:0;display:block"></iframe>

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

## The experiment I'd run next

The simulation compares two ways of delivering software, and the sensitivity analysis says that review and defect rate matter as much as anything. That suggests a better question than "AI or not": does engineering discipline matter as much as AI adoption? A 2×2 would separate them.

| | Weak engineering controls | Strong engineering controls |
|---|---|---|
| **Traditional delivery** | A | B |
| **AI-heavy delivery** | C | D |

Four firms, same market. "Strong controls" would mean the discipline I can actually point at: reliable review, tests that mean something, checks that count what ran. The hypothesis is that B might do about as well as D, and that C might do worst of all. In other words, the gap between weak and strong controls may be as large as the gap between traditional and AI-heavy delivery, or larger.

I haven't built this. It is a proposal for a separate experiment, and the four-firm model would be a new model version with its own tests, not an extra bolted on here.

It would need numbers that aren't invented, and some of those may already exist on this site. The verification experiments measure things the model currently guesses:

- [BRK](/experiments/broken-tools/) found a coding agent claimed "tests pass" with nothing run in 8 of 12 runs, and one line in its instructions cut that to 1 of 12. That is evidence about how much a verification step is worth, which is what "review strength" stands in for.
- [VIS](/experiments/visual-checks/) measured how many planted UI bugs different checkers caught (11 to 22 of 22 with the same checklist, depending on the checker) and how many harmless changes they flagged, which is a catch rate and a false-alarm rate.
- The rest are under [verification](/topics/verification/).

What they don't give me is the defect factor: how much extra debt AI-written code creates per unit of work. Nothing on this site measures that yet, and it is the assumption the result is most sensitive to among the AI-heavy firm's own. That is the gap to close first.

## Limits

- **The coefficients are invented.** The results describe the model, not the world.
- **The sweeps vary one assumption at a time** around a single starting point, with the usual blind spot: they can't see interactions. The random sets cover all sixteen assumptions but within ranges I chose, so the fraction of sets the AI-heavy firm wins is not a probability about real firms.
- **The ranking of what matters is softer than I first said.** In the first version I wrote that defect factor came first, then staff cost, capacity and review. With the traditional firm's assumptions and the shared ones included, and every range set to the same width, the order is different: staff costs and defect factor are close, and debt per build is not far behind. What I'd still say is that a handful of assumptions decide it.
- **The firms barely interact.** They share a market and 20% of churned customers move to the rival, so this is closer to two parallel businesses than a head-to-head fight.
- **Cash never binds.** Nothing in the model lets a firm get into financial trouble, so survival and distress are not modelled.
- **Demand and shocks are simple.** No lasting recessions, no learning, no pricing, no hiring, no customers who differ.
- **It models delivery, not an operating model.** An AI-native company would be organised differently in ways this doesn't touch.
- **What would make it informative** is measuring defect rate and review effects on real tasks. Those two inputs decide the answer and are the least grounded.

[↓ Download the simulation, report and tests (zip)](/two-firms/two-firms-simulation.zip)
