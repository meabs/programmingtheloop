---
title: "Does a curated knowledge bundle help a coding agent that can already read the repo? (experiment OKC)"
description: "I gave Codex the same bank payments service three ways: code only, code plus a 2,000-word Open Knowledge Format (OKF) bundle about its external systems and business role, and code plus the same facts in AGENTS.md. On tickets whose rules the code shows, all three were perfect. On two tickets whose rules only the bundle gave, vanilla got 1 of 10 runs right, and every failure passed all existing tests. On a service FMEA the context added 15 points of recall, mostly failure modes about the service's role; plain AGENTS.md did as well as OKF."
date: 2026-11-04
summary: "150 Codex runs on a Spring Boot payments API. Feature tickets whose rules are in the code: 15 of 15 correct in every arm. Tickets whose rules are only in the context: vanilla 1 of 10, OKF 10 of 10, AGENTS.md 8 of 10. Service FMEA recall: vanilla 62%, OKF 77%, AGENTS.md 81%; on the 7 failure modes only the context describes, 17% against 70% and 72%."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/25e347c15fe6ad6a3914fa8e0f8bbe3e79440bf9/2026-11-okf-context"
draft: false
experimentId: "OKC"
question: "Does a small, hand-written OKF bundle about a service's external systems and business role help a coding agent that can already read the whole repository, for feature changes and for a service FMEA? And is it the format or the facts?"
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI 0.157"
    model: "gpt-5.6-luna (hosted)"
    settings: "medium effort, one turn per run, web search off, no network, bubblewrap sandbox"
  - name: "FMEA judges"
    model: "google/gemini-4-argon (primary), anthropic/claude-sonnet-5.5 (second), via OpenRouter"
    settings: "each report matched to a 22-entry answer key; primary judge checked by hand"
runs: "3 arms × (5 tickets × 5 runs + 25 FMEAs) = 150 runs"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/25e347c15fe6ad6a3914fa8e0f8bbe3e79440bf9/2026-11-okf-context/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/e3d8458eb75b04bd506f0a98bc679d823ea3af1c/2026-11-okf-context/README.md"
previewImage: "/guide-images/chart-okf-context.png"
previewAlt: "Context mattered where the code was silent. Feature changes fully correct: 3 tickets whose rule is in the code, 15 of 15 runs in every arm; 2 tickets whose rule is only in the context, vanilla 1 of 10, OKF 10 of 10, AGENTS.md 8 of 10. FMEA answer-key failure modes found: all 22, vanilla 62%, OKF 77%, AGENTS.md 81%; 7 only in the context, 17%, 70%, 72%; 10 visible in the code, 82%, 74%, 78%."
topics:
  - context
  - measurement
publishedOn: 2026-11-04
findings:
  - id: "OKC-1"
    statement: "Without the context, the agent got an external system's convention right in 1 of 10 runs, and every wrong change passed all existing tests"
    metric: "runs on the two context-only tickets (F6, F7) with the integration rule right, of 10 (higher is better)"
    value: "1 of 10 (vanilla), 10 of 10 (OKF), 8 of 10 (AGENTS.md)"
    n: "2 tickets × 5 runs per arm"
    detail:
      - "on the three tickets whose rules the code shows, all 45 runs were correct in every arm"
      - "F6: the failing runs treated the scheme's DUPL reply (it already has the payment) as a refusal and marked the payment rejected"
      - "F7: all five vanilla runs invented the template name PAYMENT_REJECTED; the real one is PAYMENT_FAILED"
      - "pre-registered H1 (features equal within 15 points): inconclusive, +36 points, 90% interval 0 to +72 over five tickets"
    limits:
      - "two context-only tickets, chosen after a pilot showed the first two were solvable from the code"
      - "one repository written for the test, with simulated integrations"
    source: "https://github.com/meabs/experiments/blob/25e347c15fe6ad6a3914fa8e0f8bbe3e79440bf9/2026-11-okf-context/REPORT.md"
    status: current
    featured: false
  - id: "OKC-2"
    statement: "The context raised FMEA recall by 15 points, mostly through failure modes about the service's role that the code doesn't show"
    metric: "share of the 22 answer-key failure modes found, mean per report (higher is better)"
    value: "62% (vanilla), 77% (OKF), 81% (AGENTS.md); on the 7 context-only entries 17%, 70%, 72%"
    n: "25 reports per arm"
    detail:
      - "pre-registered H2, one-sided permutation test, Holm p = 0.0007; H6 (bigger gain on context-only entries) and H7 (on role entries) supported"
      - "a second judge on all 75 reports gives 61%, 76%, 80% and agrees on 97% of decisions"
      - "an account closed with money still in it: found by 25 of 25 OKF reports and none of the vanilla ones"
    limits:
      - "the answer key, the bundle and the hand check are mine"
    source: "https://github.com/meabs/experiments/blob/25e347c15fe6ad6a3914fa8e0f8bbe3e79440bf9/2026-11-okf-context/REPORT.md"
    status: current
    featured: false
  - id: "OKC-3"
    statement: "OKF and the same facts in plain AGENTS.md were not distinguishable, and AGENTS.md was cheaper per correct result"
    metric: "feature runs fully correct of 25; FMEA recall; cost per fully correct feature change (lower is better)"
    value: "25 vs 23 of 25; 77% vs 81%; $0.124 vs $0.109"
    n: "25 runs per arm per task type"
    detail:
      - "pre-registered H5: not supported for features (Holm p = 0.98) or the FMEA (Holm p = 0.30)"
      - "not shown equal either: no equivalence test was planned for B against C"
    limits:
      - "one agent, one model, one bundle"
    source: "https://github.com/meabs/experiments/blob/25e347c15fe6ad6a3914fa8e0f8bbe3e79440bf9/2026-11-okf-context/REPORT.md"
    status: current
    featured: false
---

## Question

Earlier OKF experiments here gave the agent a guide to code it couldn't easily read. The everyday case is different: a team adds a short, hand-written knowledge bundle to its **own** repository, which the agent can read anyway. Is that worth it?

The bundle can only help with what the code doesn't say. So this test is about that knowledge: how the **external systems** a service talks to behave (reason codes, idempotency, timeouts, template names), and the **service's role** for the people and systems that depend on it (reconciliation at 07:00, the regulatory return, account closures).

Two kinds of task, treated as equals: feature changes, graded by hidden tests, and a service **FMEA** (failure mode and effects analysis: a table of what can go wrong, its effect, and severity, occurrence and detection scores), graded against an answer key.

**The short answer:** where the code shows the rules, the bundle changed nothing. Where only the bundle had them, the agent without it guessed, got it wrong 9 times in 10, and every wrong change passed the tests. On the FMEA the context added 15 points of recall, and plain AGENTS.md did as well as the OKF format.

## How it was set up

<figure class="guide-figure">

<img src="/guide-images/okf-context-1-setup.png" alt="One repository, three set-ups, two kinds of task. A bank's accounts API (Spring Boot) that pays through a payment scheme, fraud screening, a core ledger and notifications. What the agent gets besides the code: A, vanilla, nothing; B, an OKF bundle of about 2,000 words, with AGENTS.md pointing to okf/index.md (which file to read for what), okf/system.md (build, test, six key pitfalls), okf/architecture.md (each external system's rules) and okf/context.md (business processes, dependants); C, the same facts as a plain AGENTS.md section that Codex loads into its prompt. Two kinds of task, 25 runs per set-up each: feature changes, 5 tickets, 3 whose rules the code shows (history, cancel, limit) and 2 whose rules only the context gives (F6 resubmit after a scheme timeout, where DUPL means already have it; F7 notify queued and rejected payments with the real template names), graded by hidden tests plus the 34 existing ones; and a service FMEA graded against a 22-entry answer key written first (10 visible in the code, 5 inferable, 7 only in the context), by two judge models from other providers, checked by hand. Same agent everywhere: Codex CLI with gpt-5.6-luna, medium effort, no network, no one to ask. 150 runs in all." width="1800" height="1080" loading="lazy" />

<figcaption>The three set-ups share the code and the agent; only the extra knowledge differs.</figcaption>

</figure>

**The service** is a bank's accounts API, written for the test, with fake integrations in its tests that behave like the real systems described in the context (the fake scheme remembers references and answers `DUPL` to a repeat). It has 34 existing tests.

### The feature tickets

Each ticket was the whole prompt, ending "Follow the existing conventions (README.md) and keep the existing behaviour and tests working."

| Ticket | What it asks for | Where the deciding rule lives |
| --- | --- | --- |
| F1 payment history | list an account's payments, newest first, with a status filter | the code |
| F2 cancel a payment | a queued payment can be cancelled by its holder and is never sent | the code |
| F3 today's allowance | how much of the daily limit is left, agreeing with the existing check | the code |
| F6 scheme timeout | on a scheme timeout, keep the payment as `RECEIVED`; a job resubmits it every 5 minutes | **only the context:** the scheme answers `DUPL` to a reference it already has, so after a timeout `DUPL` means "accepted", not "refused" |
| F7 notify every outcome | also notify customers when a payment is queued or rejected, "as we already do for payments that are sent" | **only the context:** the notification service's template names (`PAYMENT_QUEUED`, `PAYMENT_FAILED`); the code only shows `PAYMENT_SENT` |

Two first-draft integration tickets (fraud screening and a ledger retry) were dropped after a pilot: vanilla got all 10 runs right because the code gave the rules away.

### The OKF bundle

Four files, about 2,000 words, written before the tickets and checked with OKF's `check_okf.py --strict`. Each starts with OKF front matter (type, title, description, status, author, sources). Two excerpts as the agent saw them. From `okf/architecture.md`:

> **Payment scheme gateway.** Reference unique for 30 days (`DUPL` on a repeat). Resending the same reference is safe; a new reference pays twice. Timeout 10 s. A timeout may mean accepted.
>
> **Customer notifications.** Templates: `PAYMENT_SENT`, `PAYMENT_QUEUED`, `PAYMENT_UNDER_REVIEW`, `PAYMENT_FAILED`. Last four digits only, never a full account number or sort code.

From `okf/context.md`:

> **Closing an account.** An account may only be closed at a zero balance, checked against the ledger; closing with money left in it strands the customer's funds until operations remediate by hand.

All four files are in the repository ([arms/B/okf](https://github.com/meabs/experiments/tree/25e347c15fe6ad6a3914fa8e0f8bbe3e79440bf9/2026-11-okf-context/arms/B/okf)).

## Prediction

Before any run I published the design ([README.md](https://github.com/meabs/experiments/blob/e3d8458eb75b04bd506f0a98bc679d823ea3af1c/2026-11-okf-context/README.md)). The prediction for the test was that the feature changes would come out equal and the FMEA better with OKF.

- **H1.** Feature changes: OKF and vanilla within 15 points (equivalence test).
- **H2.** FMEA: OKF finds more of the answer key than vanilla.
- **H3.** OKF helps the FMEA more than the features.
- **H4.** OKF's FMEAs contain fewer invented facts.
- **H5.** OKF and plain AGENTS.md differ.
- **H6.** OKF's gain is bigger on context-only failure modes than on in-code ones.
- **H7.** OKF's gain is bigger on failure modes about the service's role than about its internals.

## Results

Findings OKC-1 to OKC-3 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-okf-context.png" alt="Context mattered where the code was silent. Feature changes fully correct (higher is better): 3 tickets whose rule is in the code, 15 of 15 runs for vanilla, OKF and AGENTS.md; 2 tickets whose rule is only in the context, vanilla 1 of 10, OKF 10 of 10, AGENTS.md 8 of 10. FMEA answer-key failure modes found (higher is better): all 22, vanilla 62%, OKF 77%, AGENTS.md 81%; 7 only in the context, 17%, 70%, 72%; 10 visible in the code, 82%, 74%, 78%. All 11 failed feature runs built, passed every existing test and said they were done. FMEA, OKF against vanilla, +15 points, Holm p = 0.0007; OKF against plain AGENTS.md, no difference found. Exploratory: with context, in-code failure modes were found less often, OKF minus 8 points, second judge minus 5." width="1800" height="1350" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-okf-context (primary judge, after hand check).</figcaption>

</figure>

| Hypothesis | Observed (OKF − vanilla unless stated) | Verdict |
| --- | --- | --- |
| H1 features equal | +36 points, 90% interval 0 to +72 | **inconclusive**: equal on in-code tickets, 90 points apart on context tickets |
| H2 FMEA recall | +15 points, Holm p = 0.0007 | **supported** |
| H3 FMEA gain larger | the feature gain was larger | not supported |
| H4 fewer invented facts | 0.16 against 0 per report, Holm p = 0.22 | not supported (rare in every arm) |
| H5 OKF vs AGENTS.md | features p = 0.98, FMEA p = 0.30 | not supported |
| H6 context-only entries | +61 points more than on in-code ones | **supported** |
| H7 role entries | +34 points more than on internals | **supported** |

### What the failures looked like

Every one of the 11 failed feature runs built, passed all 34 existing tests and the ticket's own functional tests, and the agent's summary said the work was done.

- **F6 (vanilla 4, AGENTS.md 2):** the run resubmitted with the same reference, as it should, then sent the scheme's `DUPL` down the ordinary rejection path and marked the payment `REJECTED`. In a real bank the payee is paid, the customer is never debited and nothing reaches the ledger. Every OKF run handled it; this is the branch one of them (B/1) wrote:

```java
// A retry after a timeout can discover that the original instruction was
// accepted. The scheme reference is idempotent, so carry on with the
// payment rather than treating that discovery as a rejection.
if (payment.getStatus() == PaymentStatus.RECEIVED && "DUPL".equals(e.getCode())) {
```

- **F7 (all 5 vanilla runs):** each invented the template name `PAYMENT_REJECTED`; the service's template is `PAYMENT_FAILED`. Every summary stated it as fact.

AGENTS.md put the `DUPL` sentence in the prompt from the start and still failed twice; OKF, which opened the file for the task, never did. With 5 runs each that difference isn't significant.

### What the FMEAs looked like

The same failure mode in two reports, both scored 10 / 4 / 9 (severity, occurrence, detection; risk 360):

| Run | Failure mode | Cause | Action |
| --- | --- | --- | --- |
| vanilla | Scheme timeout leaves payment outcome ambiguous | `HttpSchemeClient` converts network errors to `SchemeTimeoutException`, but the API has no explicit handler or durable retry/reconciliation state | Treat submission as an outbox/state machine, use a stable idempotency/reference, map timeout to an explicit pending state |
| OKF | Scheme timeout loses the local payment while the scheme accepted it | A 10-second submit timeout is allowed to escape; the transaction rolls back, and the service does not query the scheme status | Persist a `SUBMITTING` record before the call; on timeout query by the stable `P` reference; make retries reuse the same scheme reference |

A failure mode only the context reveals, from an OKF report (found by 25 of 25 OKF reports, none of the vanilla ones): **"Account closure proceeds without proving a zero ledger balance"**: "An account can be closed with money left, stranding customer funds and requiring manual operations remediation" (10 / 4 / 8, risk 320).

And one vanilla found more often (25 of 25, against 19 of 25 with OKF): **"Persistent customer/account/payment data is lost on restart"**, citing the in-memory H2 database with `create-drop` in the production configuration.

Reports containing each fact or failure mode, of 25:

| | Vanilla | OKF | AGENTS.md |
| --- | --- | --- | --- |
| an account closed with money still in it | 0 | 25 | 25 |
| statements wrong or missing (the regulatory return) | 3 | 23 | 23 |
| a notification with a full account number | 0 | 13 | 9 |
| finance reconciliation at 07:00 named | 0 | 23 | 13 |
| data lost on restart (in code) | 25 | 19 | 20 |
| every call refused after a key change (in code) | 20 | 13 | 11 |

### What surprised me

- **The context crowded out code-level failure modes.** Reports stayed about 16 rows long, so the role entries took the place of in-code ones: OKF found 8 points fewer of the 10 in-code entries (p = 0.005; the second judge gives −5, p = 0.08). This check was added after seeing the results, so treat it as a lead.
- **The format didn't matter; the facts did.** Plain AGENTS.md matched OKF on both tasks.
- **The agent never flagged a guess.** With no context it invented a template name and misread a reason code, and reported both as done.

### Cost

| Task | Vanilla | OKF | AGENTS.md |
| --- | --- | --- | --- |
| feature change, per run (lower is better) | $0.094 | $0.124 | $0.100 |
| per fully correct feature change (lower is better) | $0.147 | $0.124 | **$0.109** |
| FMEA, per answer-key entry found (lower is better) | $0.011 | $0.009 | **$0.008** |

OKF's feature runs cost 32% more than vanilla's, from reading the bundle. If a person takes about 4 hours to write and review a bundle like this (an assumption, not measured) and each integration bug that passes the tests costs an hour or more to find, it pays back after about 5 tickets that touch an external system.

### Checks

- **Hand check of the primary judge:** every match's row title (1,228), about 250 doubtful rows in full, and a random fifth of non-matches; 24 matches and 2 non-matches corrected.
- **Second judge on all 75 reports:** same ordering, 97% agreement.
- **Failure labels:** a judge model and I labelled all 11 feature failures the same way.

## Limits

- **One repository, written by me (Claude) for the test,** with simulated integrations; the bundle, the answer key and the hand check are mine too.
- **One agent and model** (Codex with gpt-5.6-luna, medium effort).
- **Five tickets, two chosen** after a pilot because the code doesn't give their rules away. The feature result describes tickets like those, not a typical backlog.
- **No equivalence was shown:** "no difference found" between OKF and AGENTS.md, not "equal".
- **Stale context wasn't tested.** The agent followed the bundle faithfully; a wrong bundle would presumably be followed too.

## What this means: impact and risks

This part is my interpretation, not a measurement.

**The dangerous gap is the one the tests can't see.** Every failed change passed every existing test, and in a payments service those were money-moving errors. Writing down the external systems' conventions where the agent reads them closed that gap on these tickets.

**For risk work, context changes what kind of analysis you get:** about the service's role (closures, statements, reconciliation, regulators) rather than only its code. Recall on role entries went from 54% to 81%. But attention is finite, and some code-level checks were found less often.

**Having a fact in context isn't the same as using it.** AGENTS.md had the `DUPL` sentence in the prompt and still failed twice.

## Configuration recommendations

For Codex with gpt-5.6-luna on a repository like this one (the configuration tested):

| Recommendation | Why | Strength |
| --- | --- | --- |
| Write down each external system's conventions (reason codes, idempotency keys, what a timeout means, template names, data rules) in a file the agent reads | Integration rule right in 1 of 10 runs without it, 10 of 10 with OKF, 8 of 10 with AGENTS.md | Strong on these two tickets; two tickets only |
| Either format works; choose by what the team will keep up to date. AGENTS.md was cheaper per correct result | OKF and AGENTS.md not distinguishable on either task | Descriptive (H5 not supported; not shown equal) |
| Turn those facts into contract tests (for example "a `DUPL` on resubmission completes the payment") | All 11 failures passed the existing tests, and the agent's summaries said done | Descriptive; contract tests weren't run here |
| For an FMEA with context, ask for the code-level checks explicitly (persistence, authentication outages, client retries, concurrency), or review a code-only run alongside | Context runs found in-code failure modes less often | Exploratory; whether either fix works is untested |

## What would be worth testing next?

- **Stale context:** the same bundle with three facts made wrong, to see how often the agent follows the wrong fact over the code.
- **A combined FMEA prompt:** context plus a code-level checklist, to see if it keeps both halves.
- **A bigger, real service** with a team-written bundle, and a stronger model.

## Reproduce

Everything is in [experiments/2026-11-okf-context](https://github.com/meabs/experiments/tree/25e347c15fe6ad6a3914fa8e0f8bbe3e79440bf9/2026-11-okf-context): the service and its fakes (`app/`), the three arms (`arms/`), the tickets (`tasks/`), hidden tests (`hidden/`), the answer key (`key/`), the scripts, and every run's diff, grade and FMEA with both judges' verdicts and my overrides (`results/main/`). The commands are in REPORT.md, section 10. The API keys and the Codex login are not published.
