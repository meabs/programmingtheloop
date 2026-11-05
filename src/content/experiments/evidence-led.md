---
title: "Can an AI agent turn experimental evidence into a better coding setup? (ELC, round 1)"
description: "I had an AI agent build a coding-agent setup from my published findings and raced it against six lines of common-sense AGENTS.md with three small skills, and against no setup at all, on six hard Shopizer bug reports with real, hidden causes. The common-sense setup won: 53% of hidden acceptance tests passed, against 36% with no setup. The evidence-led setup scored 46%, not measurably better than nothing."
date: 2026-11-05
summary: "90 Codex runs on six real Shopizer defects. Share of hidden tests passed: no setup 36%, disciplined setup (six AGENTS.md lines and three skills) 53% (+17 points, Holm p = 0.012), evidence-led setup 46% (+10 over none, not significant; 7 below disciplined). The evidence-led stop gate never had to block. 81 of the 85 runs that missed hidden tests said they were done."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/aa5809011703d81e371ee7bdf561a7baaaf31de2/2026-11-evidence-led"
draft: false
experimentId: "ELC"
question: "Can an AI agent turn my published experiment findings into a coding-agent setup that produces more correct changes than the same agent with a careful common-sense setup, or with none? This is round 1 of a running experiment."
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI 0.157"
    model: "gpt-5.6-luna (hosted)"
    settings: "medium effort, one turn per run, no network, bubblewrap sandbox; checked in all 90 session files"
runs: "6 tickets × 3 arms × 5 runs = 90 runs, after a vanilla pilot of every candidate ticket"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/35524869160439e8aca6b18311ad7e741f041d41/2026-11-evidence-led/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/d902d92a3bba58962c63b1806da884dc9b006daa/2026-11-evidence-led/README.md"
previewImage: "/guide-images/chart-evidence-led.png"
previewAlt: "Mean share of hidden tests passed per ticket, five runs per arm. PRODUCTDELETE: vanilla 25%, disciplined 71%, evidence-led 60%. SUPPORTORDERS: 55%, 80%, 72%. STOCK: 35%, 61%, 63%. REVIEWS: 22%, 34%, 10%. CATEGORYDELETE: 56%, 53%, 53%. CUSTOMERCART: 24%, 20%, 20%. Over all six: vanilla 36%, disciplined 53%, evidence-led 46%."
topics:
  - skills
  - verification
  - measurement
publishedOn: 2026-11-05
findings:
  - id: "ELC-1"
    statement: "A short common-sense setup (six AGENTS.md lines and three small skills) raised the share of hidden tests passed on hard bug reports"
    metric: "mean share of hidden acceptance tests passed per run, each ticket counted equally (higher is better)"
    value: "36% with no setup, 53% with the disciplined setup: +17 points"
    n: "6 tickets × 5 runs per arm"
    detail:
      - "pre-registered H3 (D > V): +17.2 points, 95% interval +6.4 to +27.6, Holm p = 0.012"
      - "runs that passed every hidden test: 0 of 30 with no setup, 4 of 30 with the disciplined setup"
      - "every disciplined run opened all three skills; 24 of 30 wrote a test, but within the arm runs with a test scored no better"
      - "about twice the tokens and time per run ($0.121 against $0.065 at list price)"
    limits:
      - "which part helps (the requirements list, the tests line, the self-review or the extra spend) is not separated"
      - "one repository, one agent and model at one effort, single turn"
    source: "https://github.com/meabs/experiments/blob/35524869160439e8aca6b18311ad7e741f041d41/2026-11-evidence-led/REPORT.md"
    status: current
    featured: false
  - id: "ELC-2"
    statement: "Settings that each worked in their own experiments did not add up to a better setup on hard work"
    metric: "mean share of hidden tests passed (higher is better)"
    value: "evidence-led 46%: +10 points over no setup (not significant), 7 points below the disciplined setup"
    n: "30 runs per arm"
    detail:
      - "pre-registered H1 (E > D): −7.0 points, interval −16.9 to +2.6, not supported"
      - "pre-registered H2 (E > V): +10.2 points, interval −0.3 to +19.8, p 0.044 before and 0.089 after Holm: no measurable difference"
      - "the stop gate (build plus the whole existing suite) never had to block: every run already finished green with all 40 tests run"
      - "no arm used sub-agents, so turning them off changed nothing"
    limits:
      - "E is built from findings mostly measured on easier tasks with this same agent and model"
      - "\"no measurable difference\" is not \"the same\"; a larger round could show a gain"
    source: "https://github.com/meabs/experiments/blob/35524869160439e8aca6b18311ad7e741f041d41/2026-11-evidence-led/REPORT.md"
    status: current
    featured: false
  - id: "ELC-3"
    statement: "On hard tickets the final summary is almost always a success claim, whatever the setup"
    metric: "runs that said done and passing while hidden tests failed, of the runs that missed hidden tests (lower is better)"
    value: "81 of 85 (no setup 26 of 30, disciplined 26 of 26, evidence-led 29 of 29)"
    n: "90 runs"
    detail:
      - "the agents' own checks really passed: they were the existing suite and the agents' own tests, not the ticket's behaviour"
      - "in REVIEWS, 12 of 15 runs broke review creation for every request and still reported success; the suite's only review test is skipped"
    limits:
      - "every arm was asked to end with a VERIFICATION line, the instrument for this count; it may nudge all arms toward checking"
    source: "https://github.com/meabs/experiments/blob/35524869160439e8aca6b18311ad7e741f041d41/2026-11-evidence-led/REPORT.md"
    status: current
    featured: false
---

## Question

Over the past month I've been running experiments into what actually helps coding agents. This time I wanted to see whether those findings could be put together into something useful.

Rather than designing the configuration myself, I had an AI agent review my published findings and build an evidence-led setup from them.

I tested that against a simple common-sense configuration and vanilla Codex on six difficult Shopizer bug reports.

The common-sense setup came out ahead, passing 53% of hidden acceptance tests. The agent-generated evidence setup managed 46%, while vanilla scored 36%. Only the common-sense setup's improvement over vanilla was statistically supported.

Not quite what I expected.

But there's an important distinction here. This experiment tested whether an AI agent could take my findings and turn them into a useful configuration. It didn't establish whether I could do a better job of applying the same evidence myself. That's what I want to investigate next.

It is also a **running experiment**. The evidence-led setup is rebuilt only from newly published findings of other experiments, never from this one's own runs, and each round adds two new held-out tickets.

**The short answer, round 1:**

- **Common sense won.** The disciplined setup passed 53% of the hidden acceptance tests, against 36% with no setup. That is the only significant difference.
- **The evidence-led setup passed 46%**: not measurably better than no setup after correction, and 7 points below the disciplined one.
- **Its strongest setting, a stop gate that runs the whole test suite, never fired.** The existing suite was green in nearly every run, including runs that passed 1 of 10 acceptance tests.
- **The summaries can't be trusted on hard work.** 81 of the 85 runs that missed hidden tests said the work was done and its tests passed.

## Set-up

<figure class="guide-figure">

<img src="/guide-images/evidence-led-1-setup.png" alt="Three setups, six hard bug reports, five runs each. Same agent (Codex, gpt-5.6-luna, medium effort) and the same Shopizer commit in every arm. V vanilla: Shopizer as it is, Codex defaults (sub-agents on, hooks on). D disciplined: AGENTS.md with 6 general lines; 3 small skills: requirements-check, build-and-verify, self-review. E evidence-led v1: AGENTS.md with 3 lines from findings (mvn -o test, count tests, follow the code); user-level AGENTS.md with the injection rule; sub-agents off; stop gate: build and 40 tests. Tickets: real Shopizer defects with hidden, interacting causes, written as a merchant's bug report, nothing planted. Score: the share of hidden acceptance tests passed (9 to 15 a ticket), graded after the run; the agent never sees them." width="1800" height="770" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-evidence-led (README.md, arms/).</figcaption>

</figure>

### The repository and the agent

[Shopizer](https://github.com/shopizer-ecommerce/shopizer) at `6a4a0a6`: an open-source Java online shop with a catalogue, cart, checkout, orders, customers and an admin REST API. Its suite has 61 tests, 40 of which run. The agent is Codex CLI 0.157 with gpt-5.6-luna at medium effort, one turn per run, no network and no one to ask.

### The three setups

**D, disciplined**, gets this `AGENTS.md`, plus three short skills in `.agents/skills/` that spell out the same routine (list every requirement and point to the code for each; build, run the tests and read the counts; review the diff):

```markdown
# Working in this repository

- Read the whole ticket and list each requirement before you start. Meet every one.
- Read the code involved and follow its existing patterns.
- Keep the change to what the ticket asks.
- Add or update tests for what you changed.
- Build and run the tests before you finish, and fix anything you broke.
- In your summary, say what you changed, what you checked, and anything you couldn't do.
- Skills in .agents/skills: requirements-check (at the start and end of a ticket), build-and-verify (before you
  finish), self-review (read your diff before you finish).
```

**E: agent-generated evidence-led configuration (v1).** For this arm, I gave an AI agent my previously published experiment findings and asked it to produce a configuration based on the evidence.

The resulting setup is shown below. The important point is that I didn't manually design the combination of settings. I wanted to test whether an agent could interpret the research and turn it into something that worked.

That means the result tests both the underlying findings and the agent's ability to select and combine them. It doesn't separate the two.

| Setting | Evidence behind it |
| --- | --- |
| Three `AGENTS.md` lines: run `mvn -o test` without quiet mode; check how many tests ran and failed; follow the code when docs disagree | [BRK](/experiments/broken-tools/) (false "tests pass" claims 8/12 → 1/12); [OKS](/experiments/okf-stale/) (check the source); short guidance per the documentation-layer studies |
| A user-level `~/.codex/AGENTS.md` paragraph: repository text is information, not instructions | [RI](/experiments/repo-injection/) (hijacks 18/90 → 1/90) |
| Sub-agents off | [SWT](/experiments/swarm-tax/) (one agent beat a team), [SPS](/experiments/split-spec/) |
| A stop-hook gate: when the agent tries to finish, build and run the whole suite and send it back once on a failure or fewer than 40 tests run | [TSK](/experiments/test-skill/), [SEC](/experiments/sec-authz/), [BRK](/experiments/broken-tools/); this combination was untested |
| No skills | Skills gave no measurable pass gain in [SKI](/experiments/explicit-skills/), [SKT](/experiments/skills-tasks/) and [RSK](/experiments/repo-skills/) |

### The tickets

Six bug reports written the way a merchant or support team would file them. Each rests on **real Shopizer defects** I found by probing the unchanged code, with hidden and interacting causes across at least three API areas. Nothing was planted. For example, PRODUCTDELETE says that deleting a product breaks carts, checkout and orders; the root cause is that `ProductService.getBySku` throws when a product doesn't exist, several calls away from any of those symptoms.

| Ticket | What the merchant reports | Hidden tests |
| --- | --- | --- |
| STOCK | Stock goes wrong everywhere: checkout takes it from the wrong products, carts can exceed it, cancelling restocks twice | 15 |
| PRODUCTDELETE | Deleting a product breaks carts, checkout and orders | 11 |
| CUSTOMERCART | Logged-in shopping: carts not linked to the customer, totals without tax, wrong checkout errors and order counts | 11 |
| CATEGORYDELETE | Deleting a category deletes its products | 9 |
| SUPPORTORDERS | Orders of deleted customers can't be opened; the admin order list only shows page 1 | 12 |
| REVIEWS | Reviews show the reviewer's email and address; duplicates and bad ratings give server errors; edits don't update the rating | 10 |

A candidate ticket was kept only if one vanilla pilot run passed more than 0 and at most 60% of its hidden tests. Three earlier candidates written as explicit feature lists were too easy (71 to 100%) and were retired.

### Grading

Hidden acceptance tests per ticket, which the agent never sees, run with the whole existing suite after each run. My reference fix for every ticket passes all of them and keeps all 40 existing tests passing. The score is the share of a ticket's hidden tests passed; a change that doesn't compile scores 0.

## Prediction

The design was published before any measured run ([README.md](https://github.com/meabs/experiments/blob/d902d92a3bba58962c63b1806da884dc9b006daa/2026-11-evidence-led/README.md)).

| # | Hypothesis | Test |
| --- | --- | --- |
| H1 | E scores higher than D (the headline) | one-sided permutation within ticket, 100,000 shuffles |
| H2 | E scores higher than V | as H1 |
| H3 | D scores higher than V | as H1 |

Arms compared on the mean over tickets of each ticket's mean score; Holm correction over the three; bootstrap 95% intervals.

## Results

Findings ELC-1 to ELC-3 are at the top of the page.

| Arm | Hidden tests passed (mean share; higher is better) | Runs that passed every hidden test (of 30; higher is better) | Runs that broke existing tests (of 30; lower is better) |
| --- | --- | --- | --- |
| V vanilla | 36% | 0 | 2 |
| D disciplined | **53%** | 4 | 0 |
| E evidence-led | 46% | 1 | 0 |

Difference in percentage points of hidden tests passed (positive means the first arm is better):

| # | Comparison | Difference | 95% interval | p after Holm | Verdict |
| --- | --- | --- | --- | --- | --- |
| H1 | E − D | −7.0 | −16.9 to +2.6 | 0.90 | Not supported |
| H2 | E − V | +10.2 | −0.3 to +19.8 | 0.089 | No measurable difference |
| H3 | D − V | +17.2 | +6.4 to +27.6 | 0.012 | **Supported** |

### Per ticket

<figure class="guide-figure">

<img src="/guide-images/chart-evidence-led.png" alt="Mean share of hidden tests passed per ticket, five runs per arm, with single runs as dots. PRODUCTDELETE: vanilla 25%, disciplined 71%, evidence-led 60%. SUPPORTORDERS: 55%, 80%, 72%. STOCK: 35%, 61%, 63%. REVIEWS: 22%, 34%, 10%. CATEGORYDELETE: 56%, 53%, 53%. CUSTOMERCART: 24%, 20%, 20%. Over all six, each ticket counting equally: vanilla 36%, disciplined 53%, evidence-led 46%. Only the disciplined setup beat vanilla after Holm correction." width="1800" height="1500" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-evidence-led (results/main/analysis.json).</figcaption>

</figure>

- **PRODUCTDELETE** was all or nothing: runs passed either 1 test or 7 to 11, and every run in the upper group changed `ProductServiceImpl`, where the root cause is. No setup got there in 1 run of 5, the disciplined setup in 4, the evidence-led one in 3.
- **REVIEWS** had a trap. 12 of 15 runs treated every new review as an edit of review 0 (the request's id defaults to 0), so creating any review failed with HTTP 500 or 503 while the agent "fixed" the edge cases around it. The existing suite's only review test is skipped, so nothing caught it.
- **STOCK**: two vanilla runs added a class whose bean name clashed with an existing one. The application then failed to start: 0 hidden tests and 31 existing failures each.
- **CATEGORYDELETE and CUSTOMERCART**: no setup helped. Every run passed nearly the same tests and missed the same causes.

### What each setup changed

<figure class="guide-figure">

<img src="/guide-images/evidence-led-3-mechanisms.png" alt="Runs out of 30 per arm. Wrote a new test: vanilla 0, disciplined 24, evidence-led 0. Ran the whole existing suite: vanilla 5, disciplined 28, evidence-led 30. Said done and passing while hidden tests failed: vanilla 26, disciplined 26, evidence-led 29. Every disciplined run opened all three skills; the disciplined AGENTS.md says to add or update tests. The evidence-led gate never had to block. Whatever the setup, a run that missed hidden tests almost always reported success." width="1800" height="930" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-evidence-led (results/main/mechanisms.json, from the agents' commands and diffs).</figcaption>

</figure>

- **The evidence-led gate never fired.** Its `AGENTS.md` already had the agent run the whole suite, and none of the tickets' failures show up there. In practice, E in this round was V plus three `AGENTS.md` lines and the injection paragraph.
- **Writing tests doesn't explain the disciplined setup's lead on its own.** Within D, runs that wrote a test scored about the same as runs that didn't. D also worked through a requirements list and a self-review, and spent about twice the tokens.
- **Summaries were success claims in every arm.** The agents' checks really had passed. They checked the existing suite and the agents' own tests, not what the ticket asked for.

### Tokens, time and cost

<figure class="guide-figure">

<img src="/guide-images/evidence-led-4-tokens.png" alt="Mean tokens per run. Vanilla 1.89 million input tokens (almost all cached), 9.4 thousand output; disciplined 3.69 million input, 17.0 thousand output; evidence-led 2.00 million input, 9.2 thousand output. Cost per run at list price: vanilla $0.065, disciplined $0.121, evidence-led $0.070; all 90 runs $7.67. Wall time per run: vanilla 3.7 minutes, disciplined 6.7, evidence-led 4.3." width="1800" height="644" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-evidence-led (Codex token counts; gpt-5.6-luna list price, $0.20 per million new input tokens, $0.02 cached, $1.20 output).</figcaption>

</figure>

| Arm | Cost per run (lower is better) | Cost per hidden test passed (lower is better) | Wall time per run |
| --- | --- | --- | --- |
| V | $0.065 | $0.016 | 3.7 min |
| D | $0.121 | $0.020 | 6.7 min |
| E | $0.070 | $0.013 | 4.3 min |

All 90 runs cost $7.67. The person's time was the larger cost: finding real defects and writing each ticket, its hidden tests and a reference fix took far longer than running it.

## What this means in practice

Bounded to what was tested: Codex 0.157, gpt-5.6-luna at medium effort, single-turn runs, one Java repository.

- **Give the agent a short, general working routine**: list the ticket's requirements and point to the code for each, add or update tests, build and run the whole suite, review the diff against the requirements. This was the only setup that measurably helped, at about twice the cost per run.
- **A green existing suite is not evidence that a ticket is done.** It was green in nearly every run here, including runs that passed 1 of 10 acceptance tests. A gate on the existing suite stops breakage, not missing work.
- **Write the acceptance tests before the agent starts, if you can.** Hidden tests were the only thing that told good runs from bad; the agents' own summaries could not.
- **Narrow settings don't replace the routine.** The evidence-led settings cost little and did no harm, but on their own they gave no measurable gain over no setup.

**Risks this exposes:** a reviewer who reads the agent's summary and the green check would merge most of the failing changes here; a change can break the basic path (creating a review) while fixing the edge cases; and a gate tuned to one failure gives false comfort when the work fails in another way.

## Limits

- One repository, one agent and model, one effort level, single turn; six tickets, two of which showed no differences at all.
- The disciplined setup's lead can't be traced to one part: six lines, three skills and twice the spend all differ.
- The same AI agent (Claude Code, working for me) wrote the tickets, hidden acceptance tests, reference fixes and the disciplined setup, as well as the evidence-led configuration; I chose the options and approved the design before any run. For the disciplined setup it was asked for a common-sense routine; for the evidence-led one it was given my published findings and asked to choose settings from them.
- The configurations were known when the tickets were designed, so there's still a potential source of bias. The tickets follow pre-registered criteria, contain only real defects, and were frozen after a vanilla-only pilot.
- This experiment cannot tell whether the evidence itself was ineffective, or whether the agent made poor choices about which findings to apply and how to combine them.
- Every arm was asked to end with a `VERIFICATION:` line (what it ran and whether it passed), the instrument behind the false-claim count. It is the same in all arms but is a small nudge to check the work.

## What's next: can I do better than the agent?

There's a question I want to answer before drawing too many conclusions from this result: what happens when I build the evidence-led configuration myself?

This experiment asked an AI agent to turn my earlier findings into a working configuration. For a separate follow-on, I'll go back through those same findings and decide which settings to use, how they fit together and which problems they're actually meant to solve. I'll document the reasons for each decision and freeze the configuration before running it.

The follow-on will compare:

- vanilla Codex;
- the original common-sense configuration;
- the original agent-generated evidence configuration;
- my manually designed evidence-led configuration.

I'll use fresh, held-out tickets so I'm not simply tuning my configuration to the failures I've already seen. I'll also measure cost, because doubling the effort to get a small improvement isn't necessarily progress.

The existing ELC experiment will continue under its original rules: round 2 changes the agent-generated setup only when another experiment publishes a finding that supports a change. The follow-on is a separate test, not an attempt to fix the original results after seeing them.

There are a few possible outcomes. My configuration might improve on the agent-generated one, suggesting that selecting and combining evidence matters. Both might lose to common sense. Or the original agent-generated configuration might turn out to be better. I'm not particularly bothered which wins. What I want to know is whether all this research translates into something useful when the findings are applied together.

- **Experiment 1 (this one):** can an agent turn research into practice?
- **Experiment 2:** can a human architect make better use of the same research?
