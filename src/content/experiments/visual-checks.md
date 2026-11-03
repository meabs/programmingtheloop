---
title: "Can Jev, a new kind of AI model, catch UI bugs better than vision models or a pixel diff? (experiment VIS)"
description: "Jev is a new kind of AI model: a decision model that doesn't generate text, but answers typed questions about text and images (true or false, pick an option, a score) with calibrated probabilities. I tested it against Gemini, GPT and a local vision model, and against a pixel diff, on 54 storefront screenshots with 12 kinds of planted UI bug and 8 harmless changes. Given a short checklist of questions per screen, Jev raised no false alarms (the pixel diff: 16 of 24) and answered in under half a second, but missed 3 of 22 bugs, a wrong total and blank pictures, that Gemini caught. Asked \"is anything wrong?\", it flagged almost everything."
date: 2026-11-03
summary: "54 storefront screenshots (22 with a planted defect, 24 with a harmless change, 8 untouched), each checked three times. Written yes/no assertions answered by Jev: 19 of 22 defects, 0 false alarms, 0.4 s a call. Gemini with the same assertions: 22 of 22, 0 false alarms. Pixel diff: 13 of 22, 16 false alarms. One open question to Jev: 22 of 22, but 22 of 24 false alarms."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/06234b11a0ebc11e35706beac8fc701ff699af63/2026-11-visual-checks"
draft: false
experimentId: "VIS"
question: "How well does Jev, a new kind of AI model that returns calibrated probabilities instead of text, catch visual bugs in screenshots, compared with general vision models and a pixel diff? And does a checklist of questions per screen work better than asking whether anything is wrong?"
status: published
evidenceGrade: published
agents:
  - name: "Jev"
    model: "jev-latest 1.14.0 (TypeSafe, hosted)"
    settings: "yes/no (noul) questions, all of a screen's assertions in one request; flag below 0.5"
  - name: "Vision models"
    model: "google/gemini-4-argon, openai/gpt-6.1-terra (OpenRouter); qwen3-vl:8b (local, Ollama)"
    settings: "same assertions, answered yes or no; and a free review"
runs: "54 screenshots × 9 checkers × 3 calls"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/06234b11a0ebc11e35706beac8fc701ff699af63/2026-11-visual-checks/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/d3e16f4463cb15a25efe3119b16aed9faf8a3159/2026-11-visual-checks/README.md"
previewImage: "/guide-images/chart-visual-checks.png"
previewAlt: "Defects caught of 22 (higher is better) and false alarms on harmless changes of 24 (lower is better). Gemini assertions 22 and 0; Jev assertions 19 and 0; gpt-6.1-terra assertions 22 and 10; local qwen3-vl:8b assertions 11 and 0; pixel diff 13 and 16; Jev open question 22 and 22; Gemini free review 21 and 12."
topics:
  - verification
  - review
  - safety-cost
publishedOn: 2026-11-03
findings:
  - id: "VIS-1"
    statement: "Written yes/no assertions answered by Jev raised no false alarms on harmless changes; a plain 0.5% pixel diff flagged two thirds of them"
    metric: "screenshots with a harmless change (new colour, font, picture, spacing…) flagged as broken, of 24 (lower is better)"
    value: "0 of 24 (Jev, assertions) against 16 of 24 (pixel diff at 0.5%)"
    n: "24 decoy screenshots, 3 calls each, majority verdict"
    detail:
      - "pre-registered H1, one-sided paired permutation test, Holm p = 0.0003"
      - "the pixel diff also missed 9 of 22 defects: a cut-off price, a wrong currency symbol or a `{{price}}` placeholder changes under 0.5% of the pixels"
      - "Jev answered in a median 0.4 s per screenshot; the hosted vision models took 4–6 s"
    limits:
      - "one app, five screens, defects and assertions I designed"
      - "single screenshots: no scrolling, hover or animation"
      - "one plain pixel-diff configuration: a 0.5% threshold over the whole screen, no masked regions, no baseline approval; in a visual regression workflow a deliberate change like a new font is a change to approve, not a mistake"
    source: "https://github.com/meabs/experiments/blob/06234b11a0ebc11e35706beac8fc701ff699af63/2026-11-visual-checks/REPORT.md"
    status: current
    featured: false
  - id: "VIS-2"
    statement: "Jev missed the defects that need checking rather than spotting; Gemini with the same questions caught all of them"
    metric: "defect screenshots flagged, of 22 (higher is better)"
    value: "19 of 22 (Jev) against 22 of 22 (gemini-4-argon), both with 0 false alarms"
    n: "22 defect screenshots from 12 defect types"
    detail:
      - "Jev's misses: a cart total that doesn't add up (it answered yes, 0.93) and two blank product pictures (yes, 0.84 and 0.92)"
      - "pre-registered H2, Jev within 10 points of the best vision model: not supported; difference −14 points, 95% bootstrap interval −37 to 0"
      - "raising Jev's threshold doesn't help: at 0.8 it catches all 22 but flags 16 of 24 harmless changes"
    limits:
      - "22 defect screenshots: the interval is wide"
      - "Jev's image support is labelled beta in its docs"
    source: "https://github.com/meabs/experiments/blob/06234b11a0ebc11e35706beac8fc701ff699af63/2026-11-visual-checks/REPORT.md"
    status: current
    featured: false
  - id: "VIS-3"
    statement: "Asking a model \"is anything wrong with this screen?\" didn't work as a gate, with any model"
    metric: "harmless changes flagged, of 24 (lower is better)"
    value: "22 of 24 (Jev, open question), 12 and 13 of 24 (Gemini and gpt-6.1-terra reviews)"
    n: "24 decoy screenshots per checker"
    detail:
      - "the open question caught every defect only because it flagged almost everything, including 7 of 8 untouched screens"
      - "pre-registered H3, assertions catch more than the open question: not supported (19 against 22)"
      - "an exploratory rewrite in the style of TypeSafe's docs, specific with true/false criteria: 18 of 24 false alarms"
    limits:
      - "one wording of the open question, plus one exploratory rewrite"
    source: "https://github.com/meabs/experiments/blob/06234b11a0ebc11e35706beac8fc701ff699af63/2026-11-visual-checks/REPORT.md"
    status: current
    featured: false
---

## Question

**Jev**, from TypeSafe, is a new kind of AI model. TypeSafe calls it a System One model. It doesn't generate text, write code or hold a conversation: it takes a state, such as a screenshot, and a set of typed questions, and returns calibrated probabilities your code can use directly. A question can be a true-or-false statement, a choice from a list, or a score on a rubric; this experiment used the true-or-false kind. Could a model like that do a job that usually needs a big vision model, or a pixel diff: spotting a broken web page in a screenshot?

That's the job here. A web change can pass every unit test and still ship a broken screen: a Pay button hidden behind a banner, a price cut off, a total that doesn't add up. The usual guard is a pixel diff against a reference screenshot, which flags every change, wanted or not, so people learn to wave it through. A vision model can judge the screen the way a person would, but it's slower and costs more.

Jev needs questions it can answer, so each screen got a short checklist written from what the page must show ("Is a cart total shown, and is it equal to the sum of the line subtotals?"). I compared Jev with Gemini, GPT and a local vision model answering the same checklist, with a pixel diff, and with Jev asked one open question: is anything wrong?

**The short answer:** with the checklist, Jev answered ten times faster than the vision models and never cried wolf, unlike the pixel diff. But it missed three bugs that needed adding up or noticing something missing, and Gemini, with the same questions, caught everything. Asked "is anything wrong?", Jev flagged almost every screen.

## How the checks work

<figure class="guide-figure">

<img src="/guide-images/visual-checks-1-three-checks.png" alt="Three ways to check a screenshot, on one planted bug. The cart lines add up to US$199.50; the total says US$219.50; every unit test still passes. 1. Pixel diff: flag if more than 0.5% of pixels changed from the clean screen. Here 0.02% changed: not flagged. 2. One open question: 'Does this screenshot show a defect a customer would notice?' Here yes, but also yes to 22 of 24 harmless changes. 3. Written yes/no assertions for this screen, written before any bug was designed, eight in all, including: does each cart line show the product name, unit price, quantity and subtotal; for every cart line, is the subtotal equal to the unit price times the quantity; is a cart total shown, and is it equal to the sum of the line subtotals. Gemini and gpt-6.1-terra answered no: caught. Jev answered yes, 0.93: missed. Each checker saw 54 screenshots three times: 22 with a planted defect, 24 with a harmless change, 8 untouched." width="1800" height="1120" loading="lazy" />

<figcaption>The same screenshot, three kinds of check. The assertions are the only one that asks about the total.</figcaption>

</figure>

## Prediction

Before any run I published the design and hypotheses ([README.md](https://github.com/meabs/experiments/blob/d3e16f4463cb15a25efe3119b16aed9faf8a3159/2026-11-visual-checks/README.md)), and I committed the assertions before designing any defect:

- **H1.** Jev's assertions raise fewer false alarms on harmless changes than the pixel diff.
- **H2.** Jev's assertions catch as many defects as the best vision model's assertions, within 10 points.
- **H3.** Written assertions catch more defects than Jev's one open question.
- **H4.** Jev and the best vision model differ in false alarms.

## Set-up

**The app:** a React storefront built offline with a small mock backend, so every screenshot is the same each time. Five screens (home, product list, product page, cart, checkout), at desktop and at phone width where the page fits.

**The screenshots (54):**
- **22 with a defect,** from 12 kinds: Pay button covered by a banner, Add to cart missing, price cut off, cart total that doesn't add up, overlapping text, unreadable contrast, blank product pictures, a phone page running off the side, a pop-up stuck open, `{{price}}` placeholder text, product cards with no names, the wrong currency.
- **24 with a harmless change,** from 8 kinds: new brand colour, new font, a different hero picture, footer links reordered, more spacing, rounded buttons, a promo strip, products in a different order.
- **8 untouched.**

**The checkers:**
- **Pixel diff:** flags a screenshot if more than 0.5% of pixels differ from the untouched screen, a common default.
- **Assertions:** five to eight yes/no questions per screen, answered by Jev, `google/gemini-4-argon`, `openai/gpt-6.1-terra` and the local `qwen3-vl:8b`. A screenshot is flagged if any answer comes back the wrong way (for Jev, a probability under 0.5).
- **Open question:** Jev asked one general question about each screenshot.
- **Free review:** the vision models asked to list any defects.

**Repeats and analysis:** every model saw every screenshot three times; its verdict is the majority. Paired permutation tests, Holm-corrected, and a bootstrap over defect types for H2.

## Results

Findings VIS-1 to VIS-3 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-visual-checks.png" alt="Caught the bug, or cried wolf? Defects caught of 22 (higher is better) and false alarms on harmless changes of 24 (lower is better). Gemini, assertions: 22 and 0. Jev, assertions: 19 and 0. gpt-6.1-terra, assertions: 22 and 10. qwen3-vl:8b local, assertions: 11 and 0. Pixel diff at 0.5%: 13 and 16. Jev, one open question: 22 and 22. Gemini, free review: 21 and 12. Jev against the pixel diff on false alarms: 0 against 16, Holm p = 0.0003; Jev answered in 0.4 s, the others in 4 to 15 s. Jev's 3 misses: a cart total that doesn't add up, and blank product pictures on 2 screens. All 10 of terra's false alarms: navigation links readable, on phones, where the links hide in a menu." width="1800" height="1010" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-visual-checks (each screenshot 3 calls, majority verdict).</figcaption>

</figure>

### Every checker

Of 22 defect screenshots, 24 harmless changes and 8 untouched screens:

| Checker | Defects caught (higher is better) | False alarms, harmless changes (lower is better) | False alarms, untouched (lower is better) | Median seconds per call |
| --- | --- | --- | --- | --- |
| **Jev, assertions** | 19 | **0** | **0** | **0.4** |
| Gemini, assertions | **22** | **0** | **0** | 4.9 |
| gpt-6.1-terra, assertions | **22** | 10 | 3 | 4.1 |
| qwen3-vl:8b (local), assertions | 11 | **0** | **0** | 9.0 |
| Pixel diff | 13 | 16 | **0** | 0.0 |
| Jev, open question | **22** | 22 | 7 | 0.4 |
| Gemini, free review | 21 | 12 | 5 | 5.8 |
| gpt-6.1-terra, free review | 21 | 13 | 4 | 4.8 |
| qwen3-vl:8b (local), free review | 7 | **0** | 1 | 15.2 |

- **H1, supported:** Jev's assertions against the pixel diff on harmless changes, 0 against 16 of 24 (Holm p = 0.0003).
- **H2, not supported:** Jev 19 against Gemini's 22 of 22. The difference is −14 points, with a 95% interval from −37 to 0, so I can't rule out that Jev is clearly worse.
- **H3, not supported:** the open question caught all 22, but only by flagging almost everything.
- **H4, no difference:** Jev and Gemini both had no false alarms.

### What surprised me

- **Jev's misses need checking, not just seeing.** The cart lines add up to US$199.50 and the total says US$219.50: Jev answered "yes, the total equals the sum" with 0.93. Two product pictures are blank white squares: "Does every product card show its picture?" got yes. Both are plain on the screenshot; I checked by hand.
- **gpt-6.1-terra's false alarms were my question's fault.** All of them came from one assertion on phone screens: "Is the shop header shown, with the navigation links and the cart icon readable?" On a phone, the links sit behind a menu button, so "no" is literally right. Jev and Gemini answered what I meant.
- **The pixel diff is upside down for this job.** It's most sensitive to big harmless changes (a new font changes everything) and least to small harmful ones (a `{{price}}` placeholder changes almost nothing).

### Cost and speed

One call per screenshot, as a CI gate would make (this run made three):

| Checker | API cost per screenshot (lower is better) | Per 10,000 screenshots | Median seconds per call (lower is better) |
| --- | --- | --- | --- |
| Pixel diff | $0 | $0 | under 0.1 |
| **Jev, assertions** | **$0.00017** | **$1.69** | **0.4** |
| gpt-6.1-terra, assertions | $0.0015 | $14.78 | 4.1 |
| Gemini, assertions | $0.0036 | $35.71 | 4.9 |
| qwen3-vl:8b (local), assertions | $0 in API fees | about 33 hours of GPU time | 8.9 |

- **Jev against Gemini, same questions:** about 21 times cheaper and 12 times faster, for 3 fewer bugs caught of 22 and the same zero false alarms. Jev's price is TypeSafe's list price for `jev-1.14.0`, $0.042 per million input tokens (output free), applied to the tokens it used. The others are OpenRouter's billed cost.
- **But none of these bills is large.** Gemini for 10,000 screenshots is about $36. The cost that matters more is a person's time: each false alarm needs someone to look, and each miss ships a bug. At this run's rates, 100 harmless changes would raise about 67 alarms from the pixel diff, 42 from gpt-6.1-terra's assertions, and none from Jev's or Gemini's.

### Exploratory follow-up

After the main results, I rewrote Jev's open question in the style TypeSafe's docs recommend: specific, with explicit true and false criteria. It was still unusable as a gate: 19 of 22 defects, 18 of 24 false alarms, and less consistent from call to call. This was decided after seeing the results, so it's reported beside the main result, not instead of it.

### Checks

- **Every defect was visible to a person** on its screenshot, checked before the main run, and Jev's three misses rechecked by hand after it.
- **The assertions were committed before any defect was designed** (0ad9363d). I wrote both, knowing the kinds of defect I'd test, so the risk of fitting them isn't zero.
- **Raising Jev's threshold doesn't rescue the misses:** at 0.7 it catches 20 with 4 false alarms; at 0.8, all 22 with 16.

## Limits

- **One app, five screens, defects I designed, assertions I wrote.** Real regressions are subtler and more varied.
- **Small numbers:** 22 defect screenshots, so the comparison between Jev and Gemini is wide open.
- **Single screenshots:** no scrolling, hover or animation, and the model checkers saw no reference image.
- **One version of each model, on one day.** Jev's image input is labelled beta in its docs.

## What this means: impact and risks

This part is my interpretation, not a measurement.

**Writing down what each screen must show is what made the models useful.** Three of the four assertion checkers raised no false alarms on any harmless change. The general question ("is anything broken?") didn't work with any model.

**Gemini, not Jev, was the strongest checker here,** with all 22 bugs and no false alarms. Jev was ten times faster and a twentieth of the price, but missed three. With 22 bug screenshots, that shows neither that Gemini is better in general nor that Jev is about as good; its three misses could matter.

**Some of these bugs didn't need a model at all.** A wrong total can be calculated, and a blank picture shows up as an image that failed to load. Visual checking is really three questions, and no single checker here answers all of them:

1. **Does the page meet an explicit requirement?** (the total adds up, the Pay button is visible, the page fits the screen) Deterministic checks first: arithmetic, DOM and Playwright assertions. Then written visual assertions for what code can't easily see.
2. **Does it look right to a person?** (readable, nothing overlapping) A vision model answering written assertions.
3. **Did anything change unexpectedly?** A pixel or snapshot diff against an approved baseline, with moving parts masked; each change is approved or rejected.

**A gate that never cries wolf can still miss.** Jev's clean record on false alarms makes it easy to trust. Its misses were a wrong total and missing pictures, both expensive in a real shop.

**The assertions are the weak point.** A loosely worded one lets bugs through; a too-literal one fails on correct screens, as the phone header did.

## Configuration recommendations

For teams adding visual checks to CI. Each says how strong its evidence is.

| Recommendation | Why | Strength |
| --- | --- | --- |
| Use written yes/no assertions per screen alongside visual regression testing, not instead of it: assertions to judge whether a screen is broken, a pixel or snapshot diff with approved baselines to catch unexpected change | Against a plain 0.5% pixel diff: 0 against 16 of 24 harmless changes flagged, and the pixel diff missed 9 of 22 bugs | Strong against the configuration tested (pre-registered, Holm p = 0.0003); masked or regional diffs with baseline approval weren't tested |
| Check in code whatever can be calculated, before asking any model: totals with arithmetic, missing pictures with an image-load check, missing buttons with a visibility assertion, sideways overflow with the page's width | Jev's three misses were a wrong total and missing pictures | Descriptive; the deterministic checks weren't run here |
| Don't gate on an open "is anything wrong?" question, with any model | It flagged 12 to 22 of 24 harmless changes | Descriptive, consistent across three models |
| If you use Jev, keep its 0.5 threshold and don't rely on it for arithmetic or "is something missing" checks | It missed the wrong total and blank pictures; higher thresholds add false alarms faster than catches | Descriptive (H2 not supported) |
| For the visual assertions themselves, prefer a strong hosted vision model unless speed or volume rules it out | Gemini: 22 of 22, no false alarms, about $36 per 10,000 screenshots | Descriptive; 22 bug screenshots are too few to show either model better in general |
| Write assertions per viewport, and reread them as a literal reader would | One loosely worded header question caused all of gpt-6.1-terra's false alarms | Descriptive |
| Don't use an 8B local vision model as the gate | `qwen3-vl:8b` caught 11 of 22 with assertions and 7 of 22 reviewing | Descriptive |

## What would be worth testing next?

These are proposals, not results.

- **A hybrid gate against AI-only gates,** on the same screenshots plus real bugs from a project's history: deterministic Playwright and DOM checks only; Gemini with visual assertions; Jev with visual assertions; and deterministic checks plus targeted visual assertions, sending only unclear failures to a stronger model. Measure bugs caught, false alarms, review time, total cost, and which bugs get past every layer. A reviewer suggested this, and it's the most useful next step.
- **Jev without the arithmetic:** assertions that never ask it to add up or compare, with totals checked in code.
- **Real regressions** from a project's history instead of planted ones.
- **Assertions written by someone else,** or generated from the requirements, to see how much depends on the writer.

## Reproduce

Everything is in [experiments/2026-11-visual-checks](https://github.com/meabs/experiments/tree/06234b11a0ebc11e35706beac8fc701ff699af63/2026-11-visual-checks):

- the storefront rig and mock backend (`app/`), requirements and assertions (`assertions/`), defects and harmless changes (`variants/`);
- the checker and analysis scripts (`scripts/`);
- every raw answer (`results/raw/`), the analysis, the hand checks and the follow-up (`results-followup/`).

The API keys are not published. The commands are in REPORT.md, section 10.
