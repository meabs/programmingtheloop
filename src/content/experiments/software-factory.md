---
title: "Does an open-source software factory beat one coding agent? (ASF-1)"
description: "My longest-running experiment so far: 96 runs and 21 hours of wall-clock time. Machinist, an open-source software factory that triages a ticket, builds a fix, reviews it and repairs it, against one plain Codex agent, with the same model in every role, on six hard Shopizer bug reports and two easier tickets. On the hard tickets the factory passed 55% of the hidden acceptance tests and the single agent 49%: not a significant difference, at 5.7 times the cost. The factory's reviewer approved none of its 32 jobs, including the 10 that passed every hidden test."
date: 2026-11-08
summary: "96 runs, 21.4 hours. Hard tickets, share of hidden tests passed: one Codex agent 49%, Machinist single-agent mode 48%, Machinist's standard pipeline 55% (+6 points over one agent, Holm p = 0.60, not significant). The pipeline cost 5.7 times as much and took 28 minutes per ticket against 3.5. Its reviewer approved 0 of 32 jobs, including 10 fully correct ones; 49 of 87 reviews cited missing CI. In single-agent mode, 28 of the 29 jobs marked ready to merge failed hidden tests."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/8106ca99d2546d1df4c2dc234d12a440a2483a83/2026-11-asf-1"
draft: false
experimentId: "ASF"
question: "Does an open-source software factory (Machinist's standard triage, build, review and repair pipeline) deliver more correct changes on hard bug reports than one coding agent given the same ticket, with the same model in every role?"
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI 0.157"
    model: "gpt-5.6-luna (hosted)"
    settings: "medium effort in every role and arm; each Codex session in its own bubblewrap sandbox; checked in every session file of all 96 runs"
  - name: "Machinist (commit 4d7d776)"
    model: "gpt-5.6-luna (hosted), via Codex"
    settings: "as supplied: its own prompts, stage time limits and 3-repair limit; one fresh private GitHub repository per run"
runs: "8 tickets × 3 arms × 4 runs = 96 runs, in random order, one at a time (21.4 hours), after a one-agent pilot of every ticket"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/8106ca99d2546d1df4c2dc234d12a440a2483a83/2026-11-asf-1/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/5e99976f53ee3e05e8648166d0ba50ea6195d258/2026-11-asf-1/README.md"
previewImage: "/guide-images/asf-1-2-scores.png"
previewAlt: "Mean share of hidden tests passed per ticket, four runs per arm (one agent, Machinist single, Machinist pipeline). CATEGORYDELETE 53%, 56%, 81%. CUSTOMERCART 18%, 30%, 25%. PRODUCTDELETE 32%, 50%, 30%. REVIEWS 50%, 40%, 32%. STOCK 68%, 57%, 73%. SUPPORTORDERS 73%, 56%, 90%. Easy tickets: RETURNS 78%, 72%, 91%; VISIBILITY 82%, 82%, 98%. Hard tickets overall: 49%, 48%, 55%; not significant."
topics:
  - review
  - verification
  - harness
  - safety-cost
publishedOn: 2026-11-08
findings:
  - id: "ASF-1"
    statement: "On hard bug reports, Machinist's standard pipeline was not measurably better than one coding agent with the same model"
    metric: "mean share of hidden acceptance tests passed per run, each ticket counted equally (higher is better)"
    value: "one agent 49%, pipeline 55%: +6 points, not significant"
    n: "6 hard tickets × 4 runs per arm"
    detail:
      - "pre-registered H1 (pipeline > one agent): +6.1 points, 95% interval −6.5 to +18.9, Holm p = 0.60"
      - "pre-registered H2 (pipeline > Machinist single-agent mode): +7.1 points, interval −6.6 to +21.2, Holm p = 0.60"
      - "runs passing every hidden test on hard tickets: one agent 2 of 24, single-agent mode 1, pipeline 6"
      - "the pipeline's first draft, before any review, scored 48%; repairs took it to 55%"
    limits:
      - "not significant is not the same: the interval allows a 7-point loss or a 19-point gain"
      - "one model at one effort, one Java repository with no CI, four runs per cell"
    source: "https://github.com/meabs/experiments/blob/8106ca99d2546d1df4c2dc234d12a440a2483a83/2026-11-asf-1/REPORT.md"
    status: current
    featured: false
  - id: "ASF-2"
    statement: "The pipeline cost 5.7 times as much as one agent and took 8 times as long"
    metric: "cost per run at gpt-5.6-luna list price, and wall-clock time per run (lower is better)"
    value: "$0.34 against $0.06 per run (ratio 5.7, interval 4.9 to 6.7); 28 minutes against 3.5"
    n: "32 runs per arm, all eight tickets"
    detail:
      - "total for 32 runs: one agent $1.88, single-agent mode $2.86, pipeline $10.78"
      - "the implement stage, with its repairs, was most of the pipeline's spend; review was most of the rest"
      - "two pipeline stages hung on a stalled model stream until Machinist's 2-hour stage limit ended them"
    limits:
      - "token prices only; nobody's time is counted"
    source: "https://github.com/meabs/experiments/blob/8106ca99d2546d1df4c2dc234d12a440a2483a83/2026-11-asf-1/REPORT.md"
    status: current
    featured: false
  - id: "ASF-3"
    statement: "On a repository without CI, Machinist's reviewer never approved anything, including fully correct changes"
    metric: "pipeline jobs that Machinist ended as complete (higher is better when the work is right)"
    value: "0 of 32; 10 of those 32 PRs pass every hidden test"
    n: "32 pipeline jobs, 87 reviews"
    detail:
      - "18 jobs ended blocked (15 after all three repairs, 3 earlier on a review's verdict) and 14 failed"
      - "49 of the 87 reviews gave missing CI checks as a reason; no arm had CI"
      - "7 jobs failed because Luna put one field of its JSON reply in the wrong place and Machinist's strict parser rejected it; the work was already pushed"
      - "repairs the reviewer asked for broke 4 of 30 reviewed PRs, two of them from 8 and 7 of 10 tests passing to 1 of 10"
    limits:
      - "with real CI checks the reviewer may behave very differently; that was not tested"
    source: "https://github.com/meabs/experiments/blob/8106ca99d2546d1df4c2dc234d12a440a2483a83/2026-11-asf-1/REPORT.md"
    status: current
    featured: false
  - id: "ASF-4"
    statement: "The factory's own job status did not match the work in most runs"
    metric: "B and C runs where Machinist's end state and the hidden tests disagreed (lower is better)"
    value: "38 of 64"
    n: "64 Machinist runs"
    detail:
      - "single-agent mode: 29 of 32 jobs ended ready to merge, and 28 of those fail at least one hidden test"
      - "pipeline: all 10 fully correct PRs ended blocked or failed"
      - "in 4 runs Machinist recorded no PR at all, though one existed on GitHub"
    limits:
      - "single-agent mode has no reviewer, so ready to merge there means only that a PR was delivered"
    source: "https://github.com/meabs/experiments/blob/8106ca99d2546d1df4c2dc234d12a440a2483a83/2026-11-asf-1/REPORT.md"
    status: current
    featured: false
---

## Question

"Software factories" are the next step up from a coding agent: instead of one agent working a ticket, a pipeline of agents in set roles triages it, builds a change, reviews it and sends it back for repairs, then hands you a pull request. It sounds like how a good team works. **Does it actually produce more correct code than one agent on its own?**

I took [Machinist](https://github.com/owainlewis/machinist), an open-source factory (MIT, Go), and ran it as supplied against one plain Codex agent. Every role in every arm used the same model, `gpt-5.6-luna` at medium effort, so the only thing that changed was the process around it.

**This was my longest-running experiment so far.** The main run alone was 96 runs, one at a time, over **21.4 hours** of wall-clock time, nearly all of it spent waiting on the factory. Each Machinist run also got its own fresh private GitHub repository, 64 in all, so no run could see another's work.

**This experiment was written by an AI agent** (Claude Code, working for me): the wiring, the runner, the grading and the analysis. The tickets and hidden tests are the ones from [ELC](/experiments/evidence-led/). I chose the options and approved the design before any measured run.

**The short answer:**

- **No significant gain.** On six hard bug reports the factory's pipeline passed 55% of the hidden acceptance tests, against 49% for one agent. That's +6 points, Holm p = 0.60.
- **At 5.7 times the cost and 8 times the wait**: $0.34 and 28 minutes per ticket, against $0.06 and 3.5 minutes.
- **Its first draft was no better than one agent.** The pipeline scored 48% before its first review. The small gain came from the repair rounds, which also broke two working changes.
- **Its reviewer never said yes.** All 32 pipeline jobs ended blocked or failed, including the 10 whose PRs pass every hidden test. Most reviews asked for CI checks that this repository doesn't have.
- **On two easier tickets the pipeline did better**: 94% against 80%. That's described, not tested.

## Set-up

<figure class="guide-figure">

<img src="/guide-images/asf-1-1-setup.png" alt="Three ways to hand Luna the same ticket. Same model (gpt-5.6-luna, medium effort) in every role, same Codex 0.157.0, same one-commit Shopizer checkout, same ticket text. A, one agent: one Codex run in a sandbox; reads the ticket, edits, builds, tests, stops; delivers the changed files; no GitHub, no review. B, Machinist single agent: Machinist starts one Codex run with its own Implement prompt; the agent commits, pushes and opens a pull request; no separate review. C, Machinist standard pipeline: Triage (read-only) writes a brief; Implement makes the change and PR; Review (read-only) gives a verdict; Repair up to 3 rounds; delivers the PR at the end; Spec stage if triage asks. Score: share of hidden acceptance tests passed (9 to 17 a ticket) on what each arm delivered, graded afterwards. B and C: a fresh private repository per run." width="1800" height="770" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-asf-1 (README.md).</figcaption>

</figure>

### The architecture

<figure class="guide-figure">

<img src="/guide-images/asf-1-0-architecture.png" alt="How the trial was wired. Arm A on the left: our rig starts one Codex 0.157 run with gpt-5.6-luna at medium effort on the Shopizer checkout, with no GitHub, and delivers the changed files. Machinist (commit 4d7d776) in the middle, on the same machine: a control plane (Go foreman that checks each stage's reply and moves the job on, SQLite jobs database, jobs API on 127.0.0.1) and a local worker that starts a fresh Codex process per stage in the project's checkout with a GitHub token in the environment. Stages: Triage (read-only, brief), Spec (if triage asks, auto-approved), Implement (commit, push, open the PR), Review (read-only, verdict); when the review asks for changes, back to Implement, up to 3 times. C runs all four stages; B runs Implement only. Right: the GitHub App, with one fresh private repository per run (64 in the main run), branch and pull request, and no CI checks in any arm. A grader of ours runs the hidden acceptance tests on A's files or the PR head for B and C. Bottom, one real job (SUPPORTORDERS, arm C, run 4): triage researched the defects and wrote a brief; implement fixed deleted-customer order access and admin order pagination, pushed and opened the PR; review said the diff is consistent with the requested behaviour but acceptance cannot be confirmed because GitHub has zero check runs, and Machinist ended the job blocked; our hidden tests on the same PR head: 12 of 12 pass." width="1800" height="1130" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-asf-1 (README.md; Machinist's ARCHITECTURE.md; the job record of SUPPORTORDERS, arm C, run 4).</figcaption>

</figure>

In plain English, here is what happens to one ticket in the factory (arm C):

1. **Our runner** creates a fresh private GitHub repository holding the same one-commit Shopizer checkout, connects it to Machinist's GitHub App, and submits the ticket to Machinist's jobs API.
2. **Machinist's control plane** (the "foreman") is ordinary code, not an agent. It starts each stage, checks the stage's reply against a strict format, and decides what happens next.
3. **Triage**: a fresh Codex process reads the repository, read-only, and writes a brief. If it asks for a written spec, a **Spec** stage writes one and waits for a human; our runner approved it automatically.
4. **Implement**: a new Codex process makes the change, commits, pushes a branch and opens a pull request.
5. **Review**: another fresh, read-only Codex process reads the PR and gives a verdict with findings. If it asks for changes, Implement runs again on the same PR. This repeats up to three times; then the job is "blocked".
6. **Our grader**, outside Machinist, runs the hidden acceptance tests on whatever the PR holds at the end, whatever state Machinist reports.

Arm B is step 4 alone. Arm A skips GitHub altogether: one Codex run in the same kind of sandbox, and we grade the files it changed.

### What was the same in every arm

- The model and agent: `gpt-5.6-luna` at medium effort, Codex 0.157.0. Every turn of every session was checked: 96 of 96 runs were Luna only.
- The checkout, the ticket text, the Maven cache, and the JDK.
- The sandbox: every Codex session, including each Machinist stage, ran in its own bubblewrap sandbox.
- Machinist's own settings: its prompts, its stage time limits (2 hours for implement, 45 minutes for review) and its repair limit. I changed only the model and the access controls.

### The tickets

The eight tickets from [ELC](/experiments/evidence-led/), with the same hidden tests:

| Ticket | What the merchant reports | Hidden tests |
| --- | --- | --- |
| STOCK | Stock goes wrong everywhere: checkout takes it from the wrong products, carts can exceed it, cancelling restocks twice | 15 |
| PRODUCTDELETE | Deleting a product breaks carts, checkout and orders | 11 |
| CUSTOMERCART | Logged-in shopping: carts not linked to the customer, totals without tax, wrong checkout errors and order counts | 11 |
| CATEGORYDELETE | Deleting a category deletes its products | 9 |
| SUPPORTORDERS | Orders of deleted customers can't be opened; the admin order list only shows page 1 | 12 |
| REVIEWS | Reviews show the reviewer's email and address; duplicates and bad ratings give server errors; edits don't update the rating | 10 |
| RETURNS (easier) | Build returns and refunds for orders, with every endpoint spelled out | 17 |
| VISIBILITY (easier) | Hidden products still show; make visibility and availability work separately, rules listed | 11 |

The six hard tickets are real Shopizer defects with hidden, interacting causes; nothing was planted. The score is the share of a ticket's hidden tests passed. A change that doesn't compile, or a run with no PR, scores 0.

## Prediction

The design was published before any measured run ([README.md](https://github.com/meabs/experiments/blob/5e99976f53ee3e05e8648166d0ba50ea6195d258/2026-11-asf-1/README.md)).

| # | Hypothesis | Test |
| --- | --- | --- |
| H1 | The pipeline (C) scores higher than one agent (A): the headline | one-sided permutation within ticket, 100,000 shuffles |
| H2 | The pipeline (C) scores higher than single-agent mode (B) | as H1 |
| H3 | Single-agent mode (B) differs from one agent (A) | two-sided, as H1 |

Hard tickets only; Holm correction over the three; bootstrap 95% intervals. One change was made after the pilot and before pre-registration, and is logged: the rule for dropping too-easy tickets was applied to the pilot plus ELC's five earlier runs, so all six hard tickets stayed.

## Results

Findings ASF-1 to ASF-4 are at the top of the page.

| Arm | Hidden tests passed, hard tickets (higher is better) | Runs passing every hidden test, hard (of 24; higher is better) | Cost per run (lower is better) | Time per run (lower is better) |
| --- | --- | --- | --- | --- |
| A one agent | 49% | 2 | $0.06 | 3.5 min |
| B Machinist, single agent | 48% | 1 | $0.09 | 5 min |
| C Machinist, standard pipeline | 55% | 6 | $0.34 | 28 min |

Cost and time are means over all eight tickets. Cost is at Luna's list price ($0.20 per million input tokens, $0.02 cached, $1.20 output), counted from every Codex session's own log.

Difference in percentage points of hidden tests passed, hard tickets (positive means the first arm is better):

| # | Comparison | Difference | 95% interval | p after Holm | Verdict |
| --- | --- | --- | --- | --- | --- |
| H1 | C − A | +6.1 | −6.5 to +18.9 | 0.60 | Not supported |
| H2 | C − B | +7.1 | −6.6 to +21.2 | 0.60 | Not supported |
| H3 | B − A | −1.0 | −14.9 to +12.3 | 0.90 | No measurable difference |

None is significant, and that **doesn't** show the arms are equal: the pipeline's true effect on these tickets could be anywhere from a 7-point loss to a 19-point gain.

### Per ticket

<figure class="guide-figure">

<img src="/guide-images/asf-1-2-scores.png" alt="Mean share of hidden tests passed per ticket, four runs per arm, with single runs as dots. Hard tickets (one agent, Machinist single, Machinist pipeline): CATEGORYDELETE 53%, 56%, 81%. CUSTOMERCART 18%, 30%, 25%. PRODUCTDELETE 32%, 50%, 30%. REVIEWS 50%, 40%, 32%. STOCK 68%, 57%, 73%. SUPPORTORDERS 73%, 56%, 90%. Easy tickets: RETURNS 78%, 72%, 91%. VISIBILITY 82%, 82%, 98%. Hard tickets, mean over tickets: 49%, 48%, 55%. C vs A: +6 points, Holm p = 0.60, not significant." width="1800" height="1576" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-asf-1 (results/main/analysis.json).</figcaption>

</figure>

- **Against one agent, the pipeline was ahead on four hard tickets and behind on two.** It was well ahead on CATEGORYDELETE (81% against 53%) and SUPPORTORDERS (90% against 73%), and well behind on REVIEWS (32% against 50%).
- **PRODUCTDELETE stayed all or nothing**, as in ELC: runs either found the root cause in `ProductService` and passed 9 to 11 tests, or passed 1 or 2.
- **Easy tickets** (described rather than tested): one agent 80%, single-agent mode 77%, pipeline 94%. The pipeline passed every hidden test in 4 of 8 easy runs, the other arms in 1 of 8 each.

### Inside the pipeline

<figure class="guide-figure">

<img src="/guide-images/asf-1-3-pipeline.png" alt="Inside the pipeline: repairs helped a little, and nothing was ever approved. Arm C, 32 runs. Hard-ticket score before the first review 48%, after repairs 55%. All 30 runs with a review: 16 improved, 4 got worse, 10 unchanged. Arm A scored 49% on the same tickets. Machinist's end state, 32 jobs: blocked (repairs used up, or review blocked) 18; failed (reply rejected, time-out and other causes) 14; complete, reviewer approved 0. Yet 10 of the 32 PRs pass every hidden test. 49 of 87 reviews cite missing CI checks: the repository has no CI, so the reviewer asks for evidence it can never get. 7 jobs ended because Luna put one field of its JSON reply in the wrong place; Machinist's strict parser rejected the reply." width="1800" height="700" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-asf-1 (results/main/review-effect.json, each job's machinist-job.json).</figcaption>

</figure>

To see what the reviews did, each pipeline PR was graded twice: at its last commit before the first review, and at the end. In 26 runs the review's own summary names the commit it reviewed, and it matched in all 26.

- **The first draft was no better than one agent:** 48% on hard tickets, against 49%. Repairs took it to 55%.
- **Repairs help more often than they hurt, but they do hurt.** Of 30 reviewed runs, 16 improved, 4 got worse and 10 didn't change. In two REVIEWS runs, the PR went from 8 of 10 and 7 of 10 tests passing to 1 of 10 after the changes the reviewer asked for.
- **The reviewer never approved.** 18 jobs ended "blocked" (15 after all three repair rounds, 3 earlier on a review's verdict) and 14 "failed". 49 of the 87 reviews gave missing CI checks as a reason. A real review, on a PR that passes 12 of 12 hidden tests:

> The diff is consistent with the requested behavior, but acceptance cannot be confirmed: GitHub has zero check runs, and the directly relevant order tests are ignored and contain no assertions.

- **Why the failed jobs failed:** 7 because Luna's final reply put one field (`pr_description`) outside the object Machinist expects, so Machinist's strict parser rejected the whole reply (the work was already pushed and was graded); 2 because the model's response stream stalled until the 2-hour stage limit; the rest for a review that asked for changes without listing any, a repair with no new commit, or uncommitted changes left behind.

### False confidence, in every arm

- **Single-agent mode:** 29 of 32 jobs ended "ready to merge". 28 of those fail at least one hidden test.
- **One agent:** in none of the 29 runs that fail hidden tests did the final message admit unfinished work.
- **Pipeline:** no false approvals, because no approvals. It turned away all 10 fully correct PRs instead.

### Tokens, time and cost

<figure class="guide-figure">

<img src="/guide-images/asf-1-4-tokens.png" alt="Tokens per run: the pipeline reads five times as much. Mean input tokens per run: one agent 1.7 million, Machinist single 2.9 million, Machinist pipeline 9.7 million, split into triage, spec, implement (first build plus repairs, the largest part) and review. Mean cost per run at Luna's list price: $0.06, $0.09, $0.34. Total for 32 runs: A $1.88, B $2.86, C $10.78. Most input is cached (about 95%), so it is cheap per token." width="1800" height="550" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-asf-1 (Codex session logs; gpt-5.6-luna list price).</figcaption>

</figure>

| Arm | Cost per run (lower is better) | Ratio to one agent (lower is better) | Wall time per run (lower is better) | Total, 32 runs |
| --- | --- | --- | --- | --- |
| A one agent | $0.059 | 1 | 3.5 min | $1.88 |
| B Machinist, single agent | $0.089 | 1.5 (1.4 to 1.7) | 4.9 min | $2.86 |
| C Machinist, standard pipeline | $0.337 | 5.7 (4.9 to 6.7) | 28 min | $10.78 |

The money is small at this model's price. The time isn't: one pipeline ticket took as long as eight single-agent runs, and the two stalled stages took 2 hours each.

## What this means in practice

Bounded to what was tested: Machinist at `4d7d776`, `gpt-5.6-luna` at medium effort, one Java repository with no CI.

- **On hard work, a stock factory is not a reliable upgrade over one agent.** It bought at most a modest, uncertain gain in correctness, at about 6 times the cost and 8 times the wait, and its first draft was no better.
- **The status a factory reports can't be used as-is.** "Blocked" and "failed" covered every pipeline job, including the 10 fully correct ones. "Ready to merge" covered 28 broken ones. A team going by those labels would merge broken work from single-agent mode and throw away good work from the pipeline.
- **On well-specified, easier tickets the pipeline did help**: 94% against 80%. That's described, not tested, and rests on two tickets.

**Risks this exposes:**

- **A review gate with no CI is a gate that never opens.** People will override it by hand, and then it protects nothing.
- **Repairs can make things worse.** 4 of 30 reviewed PRs lost hidden tests during repairs. Without an independent test, nobody would see it.
- **Strict reply formats turn small model slips into lost jobs.** One misplaced JSON field ended 7 of 32 pipeline jobs as failed, though the work was done and pushed.
- **Credential timing.** Machinist renews its GitHub token only one minute before it expires, and hands agents the current token. One single-agent run got a token that expired 3 minutes in, and its push failed.
- **Hung model calls cost hours** under 2-hour stage limits.

## Configuration recommendations

For Machinist at `4d7d776` with this model, on a repository like this one:

- **Give the reviewer real CI**, or don't rely on its verdict. Wire the build and tests into GitHub checks first. Without them, expect every job to end blocked (32 of 32 here).
- **Grade what the factory delivers, not what it reports.** Run your own tests on the PR whatever state the job ends in. State and content disagreed in 38 of 64 Machinist runs.
- **Look for the PR even when a job fails.** Failed jobs still left PRs (7 here), and in 4 runs Machinist didn't record a PR that existed.
- **Use single-agent mode only if you want PRs.** It cost 1.5 times as much as plain Codex for no measurable gain (−1 point, interval −15 to +12).
- **Shorten the stage limits** if your tickets are this size. Stages took a median of 2.2 minutes and 90% took under 6; only hung calls ran long.
- **Renew the GitHub token earlier** (a code change in Machinist), or don't start jobs in the last minutes of the token's 8-hour life.

## Limits

- One model at one effort, one repository, eight tickets, four runs per cell. The intervals are wide.
- **No CI anywhere.** This is the setting most likely to change Machinist's behaviour: with check runs the reviewer could approve, and stop repairing, much earlier. Not tested here.
- **Time limits were not equal, by design.** One agent had 60 minutes (its longest run took 6); Machinist kept its own stage limits, with a 3-hour cap per job.
- **Network and GitHub.** Only Machinist's arms had GitHub, so B against A measures the platform and GitHub together. In Machinist's read-only roles, tool commands kept network access.
- **Corrections during the run**, all logged in the README: the runner missed one PR that Machinist hadn't recorded, and it was re-graded from GitHub at 9 of 11; one single-agent run lost its push to token expiry. A check that wasn't pre-registered leaves that run out and gives the same conclusions (H1 +6.1, H2 +4.0, H3 +2.1 points; none significant).
- The same AI agent that wrote the tickets and hidden tests in ELC also wired and graded this experiment.
