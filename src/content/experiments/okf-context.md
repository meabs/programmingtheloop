---
title: "Does a curated knowledge bundle help a coding agent that can already read the repo? (experiment OKC)"
description: "I gave Codex the same bank payments service three ways: code only, code plus a 2,000-word Open Knowledge Format (OKF) bundle about its external systems and business role, and code plus the same facts in AGENTS.md. On tickets whose rules the code shows, all three were perfect. On two tickets whose rules only the bundle gave, vanilla got 1 of 10 runs right, and every failure passed all existing tests. On a service FMEA the context added 15 points of recall, mostly failure modes about the service's role; plain AGENTS.md did as well as OKF."
date: 2026-11-04
summary: "150 Codex runs on a Spring Boot payments API. Feature tickets whose rules are in the code: 15 of 15 correct in every arm. Tickets whose rules are only in the context: vanilla 1 of 10, OKF 10 of 10, AGENTS.md 8 of 10. Service FMEA recall: vanilla 62%, OKF 77%, AGENTS.md 81%; on the 7 failure modes only the context describes, 17% against 70% and 72%."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context"
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
runs: "3 arms × (5 tickets × 5 runs + 25 FMEAs) = 150 runs; 150 FMEA judgements by two judges"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context/REPORT.md"
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
    source: "https://github.com/meabs/experiments/blob/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context/REPORT.md"
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
    source: "https://github.com/meabs/experiments/blob/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context/REPORT.md"
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
    source: "https://github.com/meabs/experiments/blob/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context/REPORT.md"
    status: current
    featured: false
---

## Question

Earlier OKF experiments here ([OKL](/experiments/okf-local/), [H1](/experiments/h1-contract-vs-okf-changes/), [H2](/experiments/h2-contract-vs-okf-questions/)) gave the agent a guide to code it couldn't easily read. The everyday case is different: a team adds a short, hand-written knowledge bundle to its **own** repository, which the agent can read anyway. Is that worth it, and for which kinds of work?

A bundle can only add what the code doesn't say. So this test is about exactly that knowledge:

- **How the external systems behave:** reason codes, idempotency windows, what a timeout means, template names, data rules. The code shows the client calls, not the other side's contract.
- **The service's role:** who depends on it and what they need (finance reconciles at 07:00, the regulatory return is built from statements, closures must be checked against the ledger).

Two kinds of task, treated as equals with the same number of runs: **feature changes**, graded by hidden tests, and a **service FMEA** (failure mode and effects analysis: a table of the ways a system can fail, each with cause, effect, detection, severity, occurrence and detection scores and a risk priority number), graded against an answer key.

A third arm asks whether it's the **format or the facts**: the same text as a plain section of `AGENTS.md`, the file Codex loads into its prompt automatically.

**The short answer:**

- Where the code shows the rules, the bundle changed nothing: 45 of 45 runs correct in every arm.
- Where only the bundle had the rule, the agent without it guessed, got it wrong in 9 of 10 runs, and **every wrong change passed all the existing tests**.
- On the FMEA, the context added 15 points of recall, nearly all of it failure modes about the service's role.
- Plain `AGENTS.md` did as well as the OKF format and was cheaper.
- With context, code-level failure modes were found somewhat less often (exploratory).

## Set-up

<figure class="guide-figure">

<img src="/guide-images/okf-context-1-setup.png" alt="One repository, three set-ups, two kinds of task. A bank's accounts API (Spring Boot) that pays through a payment scheme, fraud screening, a core ledger and notifications. What the agent gets besides the code: A, vanilla, nothing; B, an OKF bundle of about 2,000 words, with AGENTS.md pointing to okf/index.md (which file to read for what), okf/system.md (build, test, eight key pitfalls), okf/architecture.md (each external system's rules) and okf/context.md (business processes, dependants); C, the same facts as a plain AGENTS.md section that Codex loads into its prompt. Two kinds of task, 25 runs per set-up each: feature changes, 5 tickets, 3 whose rules the code shows (history, cancel, limit) and 2 whose rules only the context gives (F6 resubmit after a scheme timeout, where DUPL means already have it; F7 notify queued and rejected payments with the real template names), graded by hidden tests plus the 34 existing ones; and a service FMEA graded against a 22-entry answer key written first (10 visible in the code, 5 inferable, 7 only in the context), by two judge models from other providers, checked by hand. Same agent everywhere: Codex CLI with gpt-5.6-luna, medium effort, no network, no one to ask. 150 runs in all." width="1800" height="1080" loading="lazy" />

<figcaption>The three set-ups share the code, the tasks and the agent; only the extra knowledge differs.</figcaption>

</figure>

### The service

- **Stack:** Spring Boot 3.5, Java 21, Maven (offline), H2 in memory with fixtures; 67 main Java files, 1,883 lines. The accounts API from [SEC-1](/experiments/sec-authz/), extended for this test.
- **Packages:** `account`, `customer`, `cases`, `closure`, `payment` (`PaymentService` for checks, cut-off and queueing; `PaymentDispatcher` for scheme, ledger and notification; `QueuedPaymentJob` at 06:00), `integration/{scheme,fraud,ledger,notify}`, `security` (signed JWTs, multi-tenant), `web`, `config` (an injected UK `Clock`).
- **External systems:** four client interfaces. In the tests they are **in-process fakes that behave like the real systems in the context**: the fake scheme remembers references and answers `DUPL` to a repeat, and the fake notification service records each template and its parameters. The hidden tests then check the external systems' contracts (the scheme reference reused, the real template names), which the code alone doesn't state.
- **Tests:** 34 existing API tests over MockMvc with real signed tokens. All pass on the starting code.

### The agent and sandbox

- **Codex CLI 0.157.0** with hosted `gpt-5.6-luna`, medium reasoning effort, one turn per run, no one to answer questions.
- **Bubblewrap sandbox, no network**, web search off; Maven runs offline from a pre-filled local repository.
- **Fresh copy per run.** The hidden tests and the answer key were never inside the sandbox.
- **AGENTS.md loading:** Codex puts `AGENTS.md` into the prompt itself. So arm C has its section from the first token; arm B gets one line pointing to `okf/` and has to choose to open it.

### What each arm gets

| Arm | Added to the repository | Size |
| --- | --- | --- |
| A, vanilla | nothing (a minimal `AGENTS.md`: how to build and test) | 0 |
| B, OKF | `okf/` with four files, plus one line in `AGENTS.md`: "`okf/` is this repository's knowledge bundle (Open Knowledge Format) … Start at `okf/index.md`." | 1,993 words |
| C, AGENTS.md | the same text as a "System knowledge" section of `AGENTS.md`, without front matter or links | 200 lines |

## The OKF bundle

<figure class="guide-figure">

<img src="/guide-images/okf-context-2-bundle.png" alt="The OKF bundle, as the agent received it (arm B). Four markdown files, 1,993 words, written before the tickets; it records only what the code doesn't say well. AGENTS.md has one added line pointing to okf/index.md. okf/index.md, 150 words, the map, with okf_version 0.2 front matter: system information (build, run, test, key pitfalls; read before any change), architecture (each external system's rules; read before touching payment or integration), system context (role in the bank, dependants; read for risk, operations, other teams). okf/system.md, 579 words, with front matter type guide, title System information, status stable, generated by human:accounts-squad, sources /context.md and README.md; sections What it is (system of record for the customer's view; does not hold the money), Build, run, test, and Key pitfalls (eight): the balance here is a copy overwritten at 02:00; the ledger reference is an idempotency key; every payment fraud-screened under FRD-7, REFER means hold, fails closed; never refuse a payment for the time; a scheme timeout may be accepted; last four digits only in messages; UK time via Clock; access rules. okf/architecture.md, 649 words: Components; The payment flow (checks, screen, scheme, ledger, notify); External systems: payment scheme gateway (cut-off 15:30, DT01; reference unique 30 days, DUPL on a repeat; timeout 10 s may mean accepted; status query), fraud screening (ACCEPT, REFER, REJECT; 2 s; fail closed), core ledger (reference books once in 24 h; a timeout may have booked; POSTING_FAILED), customer notifications (templates PAYMENT_SENT, PAYMENT_QUEUED, PAYMENT_UNDER_REVIEW, PAYMENT_FAILED; last four digits only; best effort). okf/context.md, 615 words: What the service does; Business processes (paying someone, REFER held 4 hours, queued after 15:30; statements and the regulatory return, cut on the 1st, return by the 5th working day; closing an account, zero balance checked against the ledger; complaints, 8 weeks); Who depends on it (customers, back office, finance reconciliation at 07:00, fraud team, regulatory reporting, complaints, operations); Rules from outside the code. Arm C got the same text as a System knowledge section of AGENTS.md (200 lines). Highlighted: the facts F6, F7 and FMEA entry K10 turn on." width="1800" height="1500" loading="lazy" />

<figcaption>The bundle's structure. Red marks the facts that decided F6 (<code>DUPL</code>), F7 (<code>PAYMENT_FAILED</code>) and FMEA entry K10 (closure against the ledger).</figcaption>

</figure>

**How it was written, to keep it from being tuned to the tasks** (fixed in the design before any run):

1. A wiki-style system context (integrations, business processes) first, committed.
2. The bundle from the code and that context, under a size cap (about 3,000 words; it came to 1,993), checked with OKF's `check_okf.py --strict`.
3. Only then the tickets, hidden tests and answer key.

I wrote all three, so the bundle may still suit the tasks better than a real team's would.

**What OKF adds over a plain file:** typed front matter on every content page (`type`, `title`, `description`, `status`, who wrote it and when, `sources`), an index that says **which file to read for what**, and links between pages. The bundle deliberately has **no file-by-file description of the code**: the agent can read the code.

The four files, exactly as the agent saw them:

<details>
<summary><code>okf/index.md</code> in full</summary>

````markdown
---
okf_version: "0.2"
---

# Repository knowledge: accounts-service

Curated by the Accounts squad. It records what the code doesn't say well: the service's key facts and pitfalls, the
external systems it talks to and how they behave, and the business processes it supports. It does not describe the
code file by file: read the code for that.

## Start here

- [System information](/system.md) - what the service is, how to build, run and test it, and its key pitfalls. Read
  before any change.
- [Architecture](/architecture.md) - components, the payment flow, and each external system's rules and failure
  behaviour (scheme gateway, fraud screening, core ledger, notifications). Read before touching `payment` or
  `integration`.
- [System context](/context.md) - the service's role in the bank, the business processes end to end, who depends on
  it and what they need. Read for anything about risk, operations or the effect of a change on other teams.
````

</details>

<details>
<summary><code>okf/system.md</code> in full</summary>

````markdown
---
type: guide
title: System information
description: What accounts-service is, how it is built, run and tested, and its key pitfalls.
status: stable
generated:
  by: human:accounts-squad
  at: "2026-11-03T23:58:00+00:00"
sources:
  - resource: /context.md
  - resource: README.md
---

# System information

## What it is

`accounts-service` is the bank's system of record for the customer's view of their current and savings accounts:
balances, transactions, statements, notes, support cases, closures, and **payments out**. Customers use it through
the mobile app and online banking, staff through the back office. It is multi-tenant (each tenant is a bank brand:
`acme`, `globex`). Owner: the Accounts squad. Service level: available 07:00 to 23:00 every day, target 99.9%.

It does **not** hold the money: the core ledger does. See [architecture](/architecture.md) and
[system context](/context.md).

## Build, run, test

- Spring Boot 3.5, Java 21, Maven, H2 in memory with fixtures in `src/main/resources/data.sql`.
- `mvn -o -q test` runs everything offline.
- Tests are API tests over MockMvc with real signed tokens; `ApiTest` is the base class. The four external systems are
  fakes in tests (`TestIntegrations`): `FakeScheme`, `FakeFraudScreening` (answers `ACCEPT` unless told otherwise;
  `unavailable()` simulates a timeout), `FakeLedger` (books each reference once, like the real ledger;
  `timeOutNext(n, applied)` simulates timeouts before or after booking) and `FakeNotifications`.
- The clock is a bean (`ClockConfig`, UK time). Tests use `MutableClock`, which starts on **Tuesday 6 October 2026,
  10:00 UK time**; payments in `data.sql` are dated relative to that.

## Key pitfalls

1. **The balance here is a copy.** The ledger overwrites `accounts.balance` every night at 02:00; during the day the
   service debits its own copy. Anything that must be exact (closing an account at zero balance) has to be checked
   against the ledger, not the copy.
2. **The ledger `reference` is an idempotency key.** The ledger books a reference once (a repeat within 24 hours
   returns the first booking). A ledger **timeout doesn't mean the posting failed**: it may have been booked. Any retry
   must reuse the payment's original `ledgerReference`; a new reference debits the customer twice.
3. **Every payment out must be fraud-screened** before it is sent (bank policy FRD-7, since 1 November 2026). The
   client exists in `integration/fraud`; payments don't call it yet. `REFER` means **hold for review**
   (`HELD_FOR_REVIEW`), not reject. Screening **fails closed**: no answer within 2 seconds, or an error, means hold,
   never send unscreened.
4. **Never refuse a payment because of the time.** After the scheme's 15:30 cut-off, at weekends and on bank holidays,
   payments are queued (`QUEUED`) for the next working day. `WorkingDays` doesn't know bank holidays yet (known gap: the
   scheme rejects such payments with `DT01`).
5. **A scheme timeout doesn't mean the scheme refused.** It may have accepted the instruction. The scheme reference
   (`P` + payment id) is unique for 30 days, so resending the same reference is safe and a new one pays twice. Today a
   scheme timeout is not handled: the request fails and the transaction rolls back, losing the local record of a
   payment the scheme may have taken.
6. **Notifications never contain a full account number or sort code**: last four digits only (`accountEnding`).
   Notifications are best effort: a failure must never fail or undo a payment.
7. **Times are UK time.** Use the injected `Clock`, never `now()` without it, or tests and the cut-off break.
8. **Access rules** (README): 404 for anything the caller may not see, 403 for not allowed, 409 for the wrong state.
   Only the account holder can pay from an account. Never cross tenants.
````

</details>

<details>
<summary><code>okf/architecture.md</code> in full</summary>

````markdown
---
type: guide
title: Architecture
description: Components of accounts-service, the payment flow, and the rules and failure behaviour of each external system.
status: stable
generated:
  by: human:accounts-squad
  at: "2026-11-03T23:58:00+00:00"
sources:
  - resource: /context.md
---

# Architecture

## Components

| Package | What it does |
| --- | --- |
| `account`, `customer`, `cases`, `closure` | accounts, customers, support cases, closure requests (`AccountService.getVisible` applies the access rules) |
| `payment` | payments out: `PaymentService` (checks, cut-off, queueing), `PaymentDispatcher` (scheme, ledger, notification), `QueuedPaymentJob` (06:00 on working days) |
| `integration/scheme` | payment scheme gateway client |
| `integration/fraud` | fraud screening client (not yet called by payments) |
| `integration/ledger` | core ledger client |
| `integration/notify` | customer notification client |
| `security`, `web`, `config` | tokens and access rules, error mapping, the UK clock |

```
 mobile app / online banking / back office
                 |
                 v
        +------------------+      screen (2 s)     +-------------------+
        | accounts-service | --------------------> | fraud screening   |
        |  PaymentService  |                       +-------------------+
        |  Dispatcher      |      submit (10 s)    +-------------------+
        |                  | --------------------> | payment scheme    |
        |                  |                       +-------------------+
        |                  |      post (5 s)       +-------------------+
        |                  | --------------------> | core ledger       | -- 02:00 balances --> accounts.balance
        |                  |                       +-------------------+
        |                  |      send             +-------------------+
        |                  | --------------------> | notifications     |
        +------------------+                       +-------------------+
```

## The payment flow

1. `POST /api/accounts/{id}/payments` (holder only, `accounts:write`). Checks: account visible and owned, open,
   amount within the balance copy and the daily limit.
2. **Should** be screened by the fraud service here (FRD-7); not wired yet. See the fraud section for what each answer
   means.
3. On a working day before 15:30: `PaymentDispatcher.dispatch`: submit to the scheme (reference `P` + id), take the
   amount off the balance copy, post to the ledger with a new `ledgerReference`, then notify the customer.
   Otherwise: `QUEUED` with the next working day as `executionDate`; `QueuedPaymentJob.runDue()` dispatches it then.
4. Statuses: `RECEIVED`, `QUEUED`, `SUBMITTED`, `COMPLETED`, `POSTING_FAILED` (sent, ledger posting failed),
   `HELD_FOR_REVIEW` (fraud hold), `REJECTED` (scheme or fraud refused; `reasonCode`), `CANCELLED`.

## External systems

### Payment scheme gateway

- Settles an accepted instruction within about two hours.
- **Cut-off 15:30 UK** for same-day instructions; later ones are rejected with `DT01`, so the service queues them.
  Weekends and bank holidays likewise; bank holidays are not handled yet.
- **Reference unique for 30 days** (`DUPL` on a repeat). Resending the same reference is safe; a new reference pays
  twice.
- Reason codes: `AC01` wrong account number, `AC04` payee account closed, `DT01` invalid date, `DUPL` duplicate,
  `RR04` regulatory (sanctions).
- **Timeout 10 s.** A timeout may mean accepted. The status query `GET /v2/instructions/{reference}` tells you; the
  service doesn't use it yet, and doesn't catch the timeout (the request fails and rolls back).

### Fraud screening

- Answers `ACCEPT`, `REFER` or `REJECT`.
- `ACCEPT`: carry on. `REFER`: **hold**: status `HELD_FOR_REVIEW`, not sent, balance not touched, customer told it is
  being checked (`PAYMENT_UNDER_REVIEW`); the fraud team reviews within four hours (08:00 to 20:00) in its own tool.
  `REJECT`: status `REJECTED`, reason code `FRAUD`, not sent; the customer is never told why.
- **Fails closed:** no answer within **2 seconds** (`FraudScreeningUnavailableException`), or an error, is treated as
  `REFER`. Never send an unscreened payment.

### Core ledger

- System of record for money; finance's books come from it.
- `reference` is the **idempotency key**: booked once; a repeat within 24 hours returns the first booking.
- **Timeout 5 s** (`LedgerTimeoutException`). A timeout may mean booked. The dispatcher marks the payment
  `POSTING_FAILED`; operations repost from the daily exceptions report, with the same reference. **Any automatic retry
  must reuse `ledgerReference`.**
- At 02:00 the ledger sends every balance, overwriting `accounts.balance`.

### Customer notifications

- Templates: `PAYMENT_SENT`, `PAYMENT_QUEUED`, `PAYMENT_UNDER_REVIEW`, `PAYMENT_FAILED`.
- **Last four digits only** (`accountEnding`), never a full account number or sort code: a full number is a reportable
  data-protection breach.
- **Best effort:** catch and log failures; never fail or undo a payment for one; no retries.
````

</details>

<details>
<summary><code>okf/context.md</code> in full</summary>

````markdown
---
type: guide
title: System context
description: The role of accounts-service in the bank, the business processes it supports, and who depends on it.
status: stable
generated:
  by: human:accounts-squad
  at: "2026-11-03T23:58:00+00:00"
---

# System context

## What the accounts service does

It is the bank's system of record for the **customer's view** of their accounts: balances, transactions, monthly
statements, account notes, support cases, closures and payments out. Customers reach it through the mobile app and
online banking; staff through the back office. It sits between those channels and core banking: it does not hold the
money, which lives in the core ledger, and it sends payments through the payment scheme after the fraud service has
screened them.

## Business processes

### Paying someone (a bill, rent, a friend)

The customer enters the payee and amount in the app. The service checks the account, the balance and the daily
limit, asks the fraud service to screen the payment (`ACCEPT`, `REFER` or `REJECT`), sends accepted payments to the
payment scheme and posts them to the core ledger, and tells the customer. `REFER` means the payment is held for the
fraud team to review within **four hours**; it is not a rejection. Payments after the scheme's **15:30** cut-off, at
weekends or on bank holidays are queued for the next working day and sent by the 06:00 job; the time of day never
refuses a payment.

### Statements and the regulatory return

Statements are cut on the 1st of each month from the ledger's closing balances. Regulatory reporting builds the
monthly return to the regulator from them by the **5th working day**. A wrong or missing statement makes the return
wrong.

### Closing an account

The holder or an admin asks; an approver decides. An account may only be closed at a zero balance, **checked against
the ledger**; closing with money left in it strands the customer's funds until operations remediate by hand.

### Complaints

The complaints team reads account notes, cases and payment history; the regulator gives the bank **8 weeks** to
answer a complaint. Records must be complete and never silently changed.

## Who depends on it

| Dependant | What they need |
| --- | --- |
| Customers (app, online banking) | right balances and statuses; payments sent when promised; never paid twice |
| Back-office staff | accounts, notes, cases, closure approvals |
| Finance reconciliation | at **07:00** every morning it matches ledger postings to the scheme's settlement report by payment reference; a double posting, or a payment sent but not posted, is a break a person must investigate |
| Fraud team | held payments, with the screening result, to review within four hours |
| Regulatory reporting | complete, correct statements for the monthly return |
| Complaints team | complete notes and payment history |
| Operations | the daily exceptions report: `POSTING_FAILED` payments, and `QUEUED` payments past their date |

## Rules that come from outside the code

1. Every payment out is screened (policy FRD-7). Screening **fails closed**: no answer within 2 seconds means hold,
   never send.
2. `REFER` is a hold for review, not a rejection. `REJECT` gets reason code `FRAUD`; the customer is never told why.
3. Ledger postings are idempotent on their reference for 24 hours. A timed-out posting may have been booked; a retry
   reuses the reference, or the customer is debited twice and reconciliation breaks.
4. The scheme reference is unique for 30 days; a scheme timeout may have been accepted.
5. Notifications never contain a full account number (last four digits only) and are best effort.
6. The balance in this service is a copy, overwritten from the ledger at 02:00.
````

</details>

The full arm C file is [arms/C/AGENTS.md](https://github.com/meabs/experiments/blob/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context/arms/C/AGENTS.md).

## The tasks

### Five feature tickets

Each ticket is the whole prompt. None restates a rule from the context. The mix was fixed before any run: three tickets whose rules are in the code, two that touch an external system's behaviour.

| Ticket | What it asks for | Where the deciding rule lives | Hidden tests |
| --- | --- | --- | --- |
| F1 payment history | `GET /api/accounts/{accountId}/payments`, newest first, `status` filter, 400 on an unknown status | the code | 6: order, filter, 400, only that account; staff who look after it see it, others get 404 |
| F2 cancel | `POST /api/payments/{paymentId}/cancel`: `QUEUED` becomes `CANCELLED` and is never sent; holder only | the code | 5: cancels, never sent, other statuses conflict, holder only, write scope |
| F3 allowance | `GET /api/accounts/{accountId}/payment-allowance`: `dailyLimit`, `paidToday`, `remaining` | the code (the existing limit check) | 7: rejected don't count, queued count on the day made, UK day boundary, agrees with the check, staff access |
| F6 scheme timeout | on `SchemeTimeoutException`, save as `RECEIVED` and answer 201; `SchemeRetryJob.resubmit()` every 5 minutes | **context only:** a scheme timeout may mean accepted; the reference is unique for 30 days and a repeat gets `DUPL` | 4: kept, resubmit completes, **same reference**, **accepted-before-timeout is completed, not rejected** |
| F7 notify outcomes | also notify queued and rejected payments, "as we already do for payments that are sent" | **context only:** template names `PAYMENT_QUEUED`, `PAYMENT_FAILED`; last four digits only; best effort | 7: both notified, one message when sent, failure doesn't fail the payment, **real template names**, never the full number |

A run is **fully correct** only if it builds, passes every hidden test and all 34 existing tests. Files the agent mustn't change (the test support code with the fakes, the existing tests, `pom.xml`) are restored before grading.

<details>
<summary>F6: scheme timeout, full ticket</summary>

> Ticket: don't lose payments when the scheme times out.
> 
> When the payment scheme doesn't answer in time (`SchemeTimeoutException`), the request fails with a 500 and the payment
> is rolled back, so we lose track of it.
> 
> Instead, save the payment with status `RECEIVED` (nothing taken from the balance or posted to the ledger yet) and
> answer 201 as usual. Then add a job, `SchemeRetryJob` in the `payment` package, with a public method `resubmit()` that
> runs every 5 minutes and submits each `RECEIVED` payment to the scheme again; from there it carries on as any payment
> does (balance, ledger posting, notification).
> 
> Follow the existing conventions (README.md) and keep the existing behaviour and tests working.

</details>

<details>
<summary>F7: notify every outcome, full ticket</summary>

> Ticket: tell customers about every payment outcome.
> 
> Customers get a message when a payment is sent, but hear nothing when it is queued for a later day or when the scheme
> rejects it, so they call support to find out.
> 
> Send the customer a notification for those two outcomes as well, through the notification service, as we already do
> for payments that are sent.
> 
> Follow the existing conventions (README.md) and keep the existing behaviour and tests working.

</details>

**Pilot first.** The first two integration tickets (F4 fraud screening, F5 ledger retry) hit the ceiling: vanilla got all 10 pilot runs right because the code gave the rules away (an enum, a comment, a field name). They were replaced by F6 and F7 before the main run, and the replacements re-piloted (amendment 1).

### The service FMEA

One open request, the same in every arm. The agent decides which failure modes to include, how many, and every cause, effect, score and action:

> We're reviewing the operational risk of the accounts service before the next release. Produce an FMEA for the
service: for each way it can fail, give the failure mode, its cause, the effect on customers and on the systems and
teams that depend on it, how we would detect it, a severity, occurrence and detection score from 1 to 10 and the
resulting risk priority number, and a recommended action. Write it to `docs/fmea.md`.

**The answer key** has 22 entries, written before any run and never shown to the agent. Each entry is tagged:

- **where the knowledge lives:** visible in the code (10), inferable by a careful reader (5), or only in the context (7);
- **what it is about:** the service's **role** for customers and dependants (14) or its **internals** (8);
- a severity, used for the high-severity subset (12 with S ≥ 8).

### Grading the FMEA

- **Primary judge:** `google/gemini-4-argon` (another provider from the agent), temperature 0, per report: for each key entry, whether the report contains it **leniently** (the same failure mode) and **strictly** (the same mode and cause), which row matched, and quality flags: effect on customers right, cause plausible, detection concrete, action addresses the cause, dependants named. It also lists **invented facts** (claims about the code or external systems that are in neither) and **extra failure modes** not in the key, as valid, generic or wrong.
- **Hand check:** I read every positive's matched row title (1,228), about 250 doubtful rows in full, and a random fifth of the negatives (84 of 422, seed 1). 24 positives were wrong (mostly a log or API-response row credited as a notification leak, or a generic notification outage credited as "not told about a rejection") and 2 negatives were wrong. 10 of the 16 flagged invented facts were not inventions. All corrections are in [judge-overrides.json](https://github.com/meabs/experiments/blob/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context/results/main/judge-overrides.json).
- **Second judge:** `anthropic/claude-sonnet-5.5` on all 75 reports, without my corrections, as a robustness check.

## Prediction

Before any run I published the design ([README.md](https://github.com/meabs/experiments/blob/e3d8458eb75b04bd506f0a98bc679d823ea3af1c/2026-11-okf-context/README.md)). The prediction for the test was that the feature changes would come out equal and the FMEA would be better with OKF.

| # | Hypothesis | Test |
| --- | --- | --- |
| H1 | Feature changes: B and A within 15 points | equivalence: 90% bootstrap interval of B − A, resampling tickets then runs, inside ±15 |
| H2 | FMEA: B recalls more of the key than A | one-sided permutation test over reports |
| H3 | OKF's benefit is larger for the FMEA than for features | permutation test on the difference of differences |
| H4 | B's FMEAs contain fewer invented facts | one-sided permutation test |
| H5 | B and C differ (format against facts) | two-sided permutation tests, features and FMEA |
| H6 | B's gain is larger on context-only entries than in-code ones | difference of differences |
| H7 | B's gain is larger on role entries than internals | difference of differences |

H2 to H7 are Holm-adjusted together at α = 0.05; 10,000 permutations and bootstrap resamples, seed 1. Everything in the analysis script was dry-run on the pilot before the main run.

## Results

Findings OKC-1 to OKC-3 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-okf-context.png" alt="Context mattered where the code was silent. Feature changes fully correct (higher is better): 3 tickets whose rule is in the code, 15 of 15 runs for vanilla, OKF and AGENTS.md; 2 tickets whose rule is only in the context, vanilla 1 of 10, OKF 10 of 10, AGENTS.md 8 of 10. FMEA answer-key failure modes found (higher is better): all 22, vanilla 62%, OKF 77%, AGENTS.md 81%; 7 only in the context, 17%, 70%, 72%; 10 visible in the code, 82%, 74%, 78%. All 11 failed feature runs built, passed every existing test and said they were done. FMEA, OKF against vanilla, +15 points, Holm p = 0.0007; OKF against plain AGENTS.md, no difference found. Exploratory: with context, in-code failure modes were found less often, OKF minus 8 points, second judge minus 5." width="1800" height="1350" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-okf-context (primary judge, after hand check).</figcaption>

</figure>

| Arm | Feature changes fully correct (of 25; higher is better) | FMEA recall (mean share of the 22 entries; higher is better) | Invented facts per FMEA (lower is better) |
| --- | --- | --- | --- |
| A, vanilla | 16 (64%) | 62% | 0.16 |
| B, OKF | **25 (100%)** | 77% | **0.00** |
| C, AGENTS.md | 23 (92%) | **81%** | 0.08 |

| Hypothesis | Observed (B − A unless stated) | Holm p | Verdict |
| --- | --- | --- | --- |
| H1 features within ±15 | +36 points, 90% interval 0 to +72 | (equivalence) | **inconclusive**: 0 on in-code tickets, +90 on context tickets |
| H2 FMEA recall | +15 points, 95% interval +11 to +19 | 0.0007 | **supported** |
| H3 bigger gain on FMEA | −21 points (the feature gain was larger) | 0.98 | not supported |
| H4 fewer invented facts | 0.16 fewer per report | 0.22 | not supported (rare everywhere) |
| H5 features, C − B | −8 points | 0.98 | not supported |
| H5 FMEA, C − B | +4 points | 0.30 | not supported |
| H6 context-only vs in-code | +61 points | 0.0007 | **supported** |
| H7 role vs internals | +34 points | 0.0007 | **supported** |

The prediction held for the FMEA. For the features it depends entirely on the ticket, and the five-ticket equivalence test can't settle an average of "identical" and "90 points apart".

### Feature changes

Fully correct runs per ticket, of 5 (Wilson 95% interval in the report; higher is better):

| Ticket | Rule | A | B | C |
| --- | --- | --- | --- | --- |
| F1 | in code | 5 | 5 | 5 |
| F2 | in code | 5 | 5 | 5 |
| F3 | in code | 5 | 5 | 5 |
| F6 | context only | **1** | 5 | 3 |
| F7 | context only | **0** | 5 | 5 |

**Anatomy of the 11 failures.** Every one built, passed all 34 existing tests and the ticket's functional tests, and failed only an `integration_` test. A judge model and I labelled each failure independently and agreed on all 11 ([taxonomy](https://github.com/meabs/experiments/blob/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context/results/main/taxonomy.md)).

**F6, `DUPL` read as a refusal (A 4 runs, C 2).** The failing runs caught the timeout, saved `RECEIVED` and resubmitted with the **same** reference, as they should. But they left the existing rejection handler alone, so when the scheme answered `DUPL` ("I already have this instruction") the payment was marked `REJECTED`. Hidden test: `integration_acceptedBeforeTheTimeoutIsNotPaidTwice: expected COMPLETED but was REJECTED`. In a real bank the payee has been paid, the customer is never debited, nothing is posted to the ledger, and finance's 07:00 reconciliation finds a payment sent but not posted. Every B run added a branch like this one (B/1):

```java
} catch (SchemeRejectedException e) {
    // A retry after a timeout can discover that the original instruction was
    // accepted. The scheme reference is idempotent, so carry on with the
    // payment rather than treating that discovery as a rejection.
    if (payment.getStatus() == PaymentStatus.RECEIVED && "DUPL".equals(e.getCode())) {
        payment.setExecutionDate(today);
        payment.setStatus(PaymentStatus.SUBMITTED);
    } else {
        payment.setStatus(PaymentStatus.REJECTED);
        payment.setReasonCode(e.getCode());
        return payments.save(payment);
    }
}
```

**F7, an invented template (all 5 A runs).** With only `PAYMENT_SENT` in the code, every vanilla run guessed `PAYMENT_QUEUED` (right) and `PAYMENT_REJECTED` (wrong). The notification service's template is `PAYMENT_FAILED`. From A/1:

```java
+    private void notifyRejected(Account account, Payment payment) {
+        notifyCustomer(account, payment, "PAYMENT_REJECTED", Map.of(
+            "amount", payment.getAmount().toPlainString(),
+            "payee", payment.getPayeeName(),
+            "reasonCode", payment.getReasonCode(),
+            "accountEnding", account.getAccountNumber().substring(4)));
+    }
```

Hidden test: `integration_rejectedUsesTheServicesTemplate: expected "PAYMENT_FAILED" but was "PAYMENT_REJECTED"`. All five B runs opened `okf/architecture.md`, which lists the four templates, and used `PAYMENT_FAILED`. No A summary flagged the name as a guess.

**Same facts, two formats.** C had the `DUPL` sentence in its prompt from the first token, and two of its five F6 runs still sent `DUPL` down the rejection path. C/2's summary said "Retries reuse the existing `P{id}` scheme reference": right, and not enough. With 5 runs per arm, B's 5 of 5 against C's 3 of 5 is not a significant difference.

**Beyond pass/fail** (exploratory): median lines added A 29, B 41, C 31; runs that added their own tests A 4, B 11, C 8 of 25.

### Service FMEA

Recall, mean per report (lowest and highest report in brackets; higher is better):

| Answer-key entries | A | B | C |
| --- | --- | --- | --- |
| all 22, lenient | 62% (50–77) | 77% (64–91) | 81% (64–95) |
| all 22, strict (same cause too) | 56% | 73% | 77% |
| 7 context-only | **17%** (0–43) | 70% (43–100) | 72% (43–100) |
| 5 inferable | 83% | 92% | 97% |
| 10 in code | **82%** | 74% | 78% |
| 14 about the service's role | 54% | 81% | 81% |
| 8 about internals | 76% | 70% | 80% |
| 12 high-severity (S ≥ 8) | 59% | 77% | 79% |

<figure class="guide-figure">

<img src="/guide-images/okf-context-3-entries.png" alt="Every answer-key failure mode: how many FMEAs found it, of 25 per set-up (vanilla, OKF, AGENTS.md; higher is better). Only in the context: K01 a payment booked twice in the core ledger 15, 25, 25; K04 a payment goes through unscreened when the fraud service is slow or down 4, 6, 12; K05 a fraud REFER treated as a rejection 0, 5, 8; K08 a customer notification contains a full account number 0, 13, 9; K10 an account closed with money still in it 0, 25, 25; K11 payments decided against an out-of-date balance 8, 25, 24; K12 statements wrong or missing 3, 23, 23. Inferable: K02 the scheme accepts a payment but the service loses its record 24, 25, 25; K03 payments sent without fraud screening 25, 25, 25; K06 payments queued for a bank holiday rejected 14, 25, 25; K13 payments never posted to the ledger 25, 25, 25; K17 payments around the cut-off sent or queued wrongly 16, 15, 21. Visible in the code: K07 queued payments not sent on their date 25, 24, 25; K09 customers not told about their payments 25, 25, 22; K14 a payment created twice 21, 18, 20; K15 daily limit exceeded 25, 24, 25; K16 account overdrawn 25, 24, 25; K18 customer not told the scheme rejected their payment 0, 0, 5; K19 tenant isolation fails 25, 25, 25; K20 someone other than the holder makes a payment 15, 14, 18; K21 data lost on restart 25, 19, 20; K22 every call refused 20, 13, 11." width="1800" height="1450" loading="lazy" />

<figcaption>Each answer-key entry, grouped by where the knowledge lives. Source: results/main/analysis.md.</figcaption>

</figure>

<details>
<summary>The same as a table</summary>

| Key | Failure mode | Source | About | A | B | C |
| --- | --- | --- | --- | --- | --- | --- |
| K01 | A payment is booked twice in the core ledger | context only | role | 15/25 | 25/25 | 25/25 |
| K02 | The scheme accepts a payment but the service loses its record of it | inferable | role | 24/25 | 25/25 | 25/25 |
| K03 | Payments are sent without fraud screening | inferable | role | 25/25 | 25/25 | 25/25 |
| K04 | A payment goes through unscreened when the fraud service is slow or down | context only | role | 4/25 | 6/25 | 12/25 |
| K05 | A fraud REFER is treated as a rejection | context only | role | 0/25 | 5/25 | 8/25 |
| K06 | Payments queued for a bank holiday are rejected by the scheme | inferable | role | 14/25 | 25/25 | 25/25 |
| K07 | Queued payments are not sent on their execution date | in code | role | 25/25 | 24/25 | 25/25 |
| K08 | A customer notification contains a full account number or sort code | context only | role | 0/25 | 13/25 | 9/25 |
| K09 | Customers are not told about their payments | in code | role | 25/25 | 25/25 | 22/25 |
| K10 | An account is closed with money still in it | context only | role | 0/25 | 25/25 | 25/25 |
| K11 | Payments are approved or refused against an out-of-date balance | context only | role | 8/25 | 25/25 | 24/25 |
| K12 | Statements are wrong or missing | context only | role | 3/25 | 23/25 | 23/25 |
| K13 | Payments sent to the scheme are never posted to the ledger | inferable | role | 25/25 | 25/25 | 25/25 |
| K14 | A customer's payment is created twice | in code | internals | 21/25 | 18/25 | 20/25 |
| K15 | The daily limit is exceeded | in code | internals | 25/25 | 24/25 | 25/25 |
| K16 | An account is overdrawn by payments | in code | internals | 25/25 | 24/25 | 25/25 |
| K17 | Payments around the cut-off are sent or queued wrongly | inferable | internals | 16/25 | 15/25 | 21/25 |
| K18 | The customer isn't told that the scheme rejected their payment | in code | internals | 0/25 | 0/25 | 5/25 |
| K19 | One bank's data is visible to another (tenant isolation fails) | in code | internals | 25/25 | 25/25 | 25/25 |
| K20 | Someone other than the account holder makes a payment | in code | internals | 15/25 | 14/25 | 18/25 |
| K21 | Data is lost when the service restarts | in code | internals | 25/25 | 19/25 | 20/25 |
| K22 | Nobody can use the app or back office: every call is refused | in code | role | 20/25 | 13/25 | 11/25 |

</details>

Reading the entries:

- **The context entries moved most:** K10 (closure with money in it) 0 → 25, K12 (statements, the regulatory return) 3 → 23, K11 (stale balance) 8 → 25.
- **Some context entries stayed hard in every arm:** K05 (`REFER` treated as a rejection) and K04 (failing open when fraud screening is slow) were found by at most 12 of 25 reports even with the rule in context. Every report did note that fraud screening isn't wired yet (K03, 25/25).
- **K18 was found almost nowhere** (0, 0, 5), although the code shows it: the rejection path doesn't notify. That is the gap F7 asks to fix.
- **In-code entries drifted down with context:** K21 (restart data loss, in-memory H2 with `create-drop`) 25 → 19, K22 (every call refused after an identity key change) 20 → 13, K14 (a client retry creates a second payment) 21 → 18.

**Quality of what was found** (share of matched entries; higher is better):

| Criterion | A | B | C |
| --- | --- | --- | --- |
| effect on customers right | 96% | 98% | 99% |
| cause plausible for this code | 99% | 100% | 100% |
| detection method concrete | 97% | 94% | 94% |
| action addresses the cause | 99% | 99% | 99% |
| dependants named (share of the key's dependants for the entry) | 76% | 86% | 84% |

Risk-ranking sense (Spearman correlation between a report's risk priority numbers and the key's, over matched entries; 1 = same order; higher is better): A 0.39, B 0.50, C 0.58.

**Invented facts** were rare: 4 in A's 25 reports (for example "the scheme has no idempotency contract", where the context says the reference is unique for 30 days), none in B, 2 in one C report (audit logs the code doesn't have).

**Extra failure modes not in the key** (mean per report): A 3.2 valid, B 1.5, C 2.7 (the judge's verdicts, not hand-checked). A's extras were mostly code-level: notifications with no timeout, a queued payment dispatched twice by two instances, a race on closure requests. They are listed in [extras-valid.md](https://github.com/meabs/experiments/blob/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context/results/main/extras-valid.md) as gaps in the key, not added to it.

**Shape:** words per report A 2,204, B 2,168, C 2,413; rows A 15.9, B 15.6, C 18.4. The reports didn't get longer with context, so what was added took the place of something.

### What the FMEAs looked like

The same failure mode (K02, scheme timeout) in two reports. Both scored it 10 / 4 / 9 (risk 360):

| Run | Failure mode | Cause | Effect | Action |
| --- | --- | --- | --- | --- |
| A/12 | Scheme timeout leaves payment outcome ambiguous | `HttpSchemeClient` converts network errors to `SchemeTimeoutException`, but the API has no explicit handler or durable retry/reconciliation state; the gateway may accept before the response is lost | Customer receives a 5xx or sees no usable result; retry can duplicate the transfer, while a successful scheme instruction may be hidden | Treat submission as an outbox/state machine, use a stable idempotency/reference, map timeout to an explicit pending state, and reconcile unknown outcomes before retrying |
| B/12 | Scheme timeout loses the local payment while the scheme accepted it | A 10-second submit timeout is allowed to escape; the surrounding transaction rolls back, and the service does not query the scheme status | The scheme may send the money while the customer sees an error and no payment record exists locally. The customer may retry and create a second payment; finance and complaints cannot reliably trace it | Persist a `SUBMITTING` record before the call; on timeout query by the stable `P` reference, then reconcile to submitted/rejected/unknown; make retries reuse the same scheme reference |

Both are right. B's names the 10-second timeout, the unused status query and the `P` reference from the bundle, and its fix follows the scheme's rules; A's is generic good practice.

A failure mode only the context reveals (K10; 25 of 25 B reports, none of A's). B/12, 10 / 4 / 8, risk 320:

> **Account closure proceeds without proving a zero ledger balance.** Cause: closure request flow checks only local account status and pending-request state; the required approver/approval and ledger zero-balance operation are not present in the exposed implementation. Effect: an account can be closed with money left, stranding customer funds and requiring manual operations remediation. Back office and complaints lose a reliable closure trail. Action: implement a two-person approval transition that queries the ledger immediately before closure, is idempotent and auditable, and blocks closure on non-zero/unknown balance.

The code shows a closure request with a status check. Nothing in it says the local balance is only a copy, so none of the 25 vanilla reports saw the risk.

A code-level failure mode vanilla found more often (K21; A 25 of 25, B 19). A/12, 10 / 3 / 9, risk 270:

> **Persistent customer/account/payment data is lost on restart.** Cause: production configuration uses in-memory H2, `ddl-auto: create-drop`, and fixture initialisation. Effect: accounts, balances, history, cases, and payment status disappear or revert to fixtures. Ledger/scheme reconciliation breaks; support and operations lose the audit trail. Action: use a supported durable production database with migrations, backups, restore drills, HA, and explicit production profiles. Fail startup if an in-memory datasource is used outside tests.

Every report is in the repository: [A](https://github.com/meabs/experiments/tree/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context/results/main/fmea-A/runs/FMEA/A/codex), [B](https://github.com/meabs/experiments/tree/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context/results/main/fmea-B/runs/FMEA/B/codex), [C](https://github.com/meabs/experiments/tree/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context/results/main/fmea-C/runs/FMEA/C/codex).

### How the agent used the context

- **B opened the bundle in every run (50 of 50)**, usually as its first command, and read all four files in 48 (two feature runs skipped `system.md`).
- **The bundle added to exploration; it didn't replace it.** B opened about as many source files as A (14 against 15 per FMEA) and ran slightly more commands.

Exploration per run (means, from the transcripts):

| Task | Arm | Runs | Read okf | Commands | Source files opened | Commands before the first edit | Seconds |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F1 | A | 5 | - | 6 | 14 | 4 | 68 |
| F1 | B | 5 | 5/5 | 8 | 12 | 5 | 82 |
| F1 | C | 5 | - | 7 | 14 | 4 | 73 |
| F2 | A | 5 | - | 10 | 16 | 8 | 70 |
| F2 | B | 5 | 5/5 | 7 | 13 | 4 | 76 |
| F2 | C | 5 | - | 6 | 13 | 4 | 64 |
| F3 | A | 5 | - | 7 | 15 | 4 | 77 |
| F3 | B | 5 | 5/5 | 9 | 15 | 6 | 101 |
| F3 | C | 5 | - | 8 | 15 | 5 | 73 |
| F6 | A | 5 | - | 6 | 13 | 3 | 78 |
| F6 | B | 5 | 5/5 | 10 | 11 | 5 | 108 |
| F6 | C | 5 | - | 7 | 13 | 4 | 88 |
| F7 | A | 5 | - | 8 | 10 | 5 | 79 |
| F7 | B | 5 | 5/5 | 12 | 11 | 9 | 88 |
| F7 | C | 5 | - | 7 | 9 | 4 | 70 |
| FMEA | A | 25 | - | 10 | 15 | 8 | 121 |
| FMEA | B | 25 | 25/25 | 11 | 14 | 10 | 119 |
| FMEA | C | 25 | - | 14 | 17 | 12 | 126 |

**Which facts reached the work.** The bundle has distinctive values; each was searched for in every FMEA. An A report can only have one from the code or a guess.

| Fact | A | B | C |
| --- | --- | --- | --- |
| four hours | 0/25 | 7/25 | 3/25 |
| 2 seconds (screening) | 5/25 | 1/25 | 5/25 |
| FRD-7 | 0/25 | 23/25 | 23/25 |
| fails closed | 18/25 | 19/25 | 17/25 |
| 02:00 balance copy | 0/25 | 25/25 | 17/25 |
| 07:00 reconciliation | 0/25 | 23/25 | 13/25 |
| 5th working day | 0/25 | 22/25 | 17/25 |
| 8 weeks (complaints) | 0/25 | 2/25 | 0/25 |
| DT01 | 0/25 | 25/25 | 25/25 |
| DUPL | 1/25 | 0/25 | 4/25 |
| 24 hours (ledger) | 0/25 | 2/25 | 0/25 |
| 30 days (scheme) | 0/25 | 2/25 | 0/25 |
| idempotency | 25/25 | 25/25 | 25/25 |

C carried fewer of the business facts into its reports than B on several items (02:00 balance copy 17 against 25; 07:00 reconciliation 13 against 23) while finding as many answer-key entries.

### Tokens, time and cost

<figure class="guide-figure">

<img src="/guide-images/okf-context-4-tokens.png" alt="Tokens per run (mean; lower is cheaper), input split into cached and new, and output. F1 history: vanilla 218k input, 2.8k output; OKF 303k, 3.5k; AGENTS.md 303k, 3.0k. F2 cancel: 234k, 2.9k; 264k, 3.2k; 237k, 2.6k. F3 allowance: 237k, 3.3k; 386k, 4.1k; 266k, 3.0k. F6 timeout: 229k, 3.4k; 489k, 4.7k; 287k, 4.0k. F7 notify: 240k, 3.4k; 319k, 3.6k; 221k, 2.9k. FMEA: 329k, 5.8k; 300k, 5.6k; 308k, 6.0k. Features: OKF read 352k input tokens a run, 52% more than vanilla's 232k; AGENTS.md 13% more. FMEA about the same. 85 to 89% of input was cached in every arm." width="1800" height="1300" loading="lazy" />

<figcaption>Codex's token counts per run: 5 runs per ticket, 25 per FMEA.</figcaption>

</figure>

| Task | A | B | C |
| --- | --- | --- | --- |
| feature change: input / output tokens per run | 232k / 3.2k | 352k / 3.8k | 263k / 3.1k |
| feature change: seconds per run | 74 | 91 | 74 |
| feature change: cost per run (lower is better) | $0.094 | $0.124 | $0.100 |
| **per fully correct feature change** (lower is better) | $0.147 | $0.124 | **$0.109** |
| FMEA: input / output tokens per run | 329k / 5.8k | 300k / 5.6k | 308k / 6.0k |
| FMEA: cost per run | $0.154 | $0.145 | $0.149 |
| **per answer-key entry found** (lower is better) | $0.011 | $0.009 | **$0.008** |

- OKF's feature runs read **52% more input tokens** than vanilla's, most on F6 (489k against 229k), and cost 32% more; the gap in cost is smaller because 85–89% of input was cached.
- Per **correct** result, both context arms were cheaper than vanilla, and AGENTS.md cheapest.
- **Payback** (an estimate on a stated assumption): if writing and reviewing a bundle like this takes a person about 4 hours, and an integration bug that passes every test costs at least an hour to find and fix, the bundle pays back after about 5 tickets that touch an external system (it prevented 0.9 such bugs per ticket here). The run costs are cents beside that.

### Robustness

- **Second judge, all 75 reports, without my corrections:** recall A 61%, B 76%, C 80%; B − A +15 points (p = 0.0001). It agreed with the primary judge on 1,597 of 1,650 found / not-found decisions (97%). Context-only recall A 19%, B 69%, C 73%.
- **The crowding-out signal is weaker under it:** in-code recall A 80%, B 75%, C 78%, B − A −5 points (two-sided p = 0.08), against the primary judge's −8 (p = 0.005). The same entries drop under both (K21 25 → 19, K22 20 → 13).
- **Strict matching** (same mode and same cause) keeps the order: 56%, 73%, 77%.
- **Entry as the unit** (each of the 22 entries as the unit, in place of the planned mixed model: the modelling library wasn't installed, and with every in-code ticket and every B run at 100% it would have had nothing to estimate): B − A +15 points (95% interval +2 to +30); all 7 context entries went up; 7 of 10 in-code entries went down, none up.
- **Ticket mix:** H1 on the in-code tickets alone, B − A 0 (interval 0 to 0); on the context tickets alone, +90 (+70 to +100).

### What surprised me

- **The agent never flagged a guess.** With no context it invented a template name and misread a reason code, built code that passed the tests, and reported both as done.
- **The format didn't matter; the facts did.** Plain `AGENTS.md` matched OKF on both tasks.
- **But having the fact isn't using it.** C had the `DUPL` sentence in its prompt and still failed twice; B, which opened the file for the task, didn't. Too few runs to call.
- **Context changed what kind of FMEA you get.** Reports stayed about 16 rows, so role entries took the place of some code-level ones.

## Limits

- **One repository, adapted by me (Claude) for this test,** with simulated integrations; the bundle, the answer key and the hand check are mine too. A real service is bigger, and a team's bundle may be better or worse.
- **One agent and model** (Codex with gpt-5.6-luna, medium effort).
- **Five tickets, two chosen after a pilot** because the code doesn't give their rules away. The feature result describes tickets like those, not a typical backlog.
- **No equivalence shown:** OKF against AGENTS.md is "no difference found", not "equal".
- **The crowding-out result is exploratory** and weaker under the second judge.
- **Stale context wasn't tested.** The agent followed the bundle faithfully; a wrong bundle would presumably be followed too.
- **Authoring time wasn't measured;** the payback figure rests on an assumption.

## What this means: impact and risks

This part is my interpretation, not a measurement.

**The dangerous gap is the one the tests can't see.** Every failed change passed every existing test, and in a payments service those were money-moving errors. Existing tests written from the code won't catch it; here only the hidden tests, written from the external systems' contracts, did.

**For risk work, context changes the kind of analysis:** the service's role (closures, statements, reconciliation, regulators) instead of only its code. Role recall went from 54% to 81%. But the reports didn't get longer, and some code-level checks were found less often.

**Risks this exposes:**

- Silent, plausible integration errors when the context is missing: builds, tests pass, summary says done.
- Treating "more context" as strictly better: it shifted attention, it didn't only add.
- Stale context: followed as faithfully as correct context, presumably.
- A fact in the prompt isn't a fact applied.

## Configuration recommendations

For Codex with gpt-5.6-luna on a repository like this one (the configuration tested):

| Recommendation | Why | Strength |
| --- | --- | --- |
| Write down each external system's contract (reason codes, idempotency keys and windows, what a timeout means, template names, data rules) in a file the agent reads | Integration rule right in 1 of 10 runs without it, 10 of 10 with OKF, 8 of 10 with AGENTS.md | Strong on these two tickets; two tickets only |
| Either format; choose by what the team will keep up to date. AGENTS.md was cheaper per correct result | OKF and AGENTS.md not distinguishable on either task | Descriptive (H5 not supported; not shown equal) |
| Keep the bundle about what the code can't say; skip file-by-file code descriptions | All the gains came from context-only facts; in-code tickets were already perfect | Descriptive |
| Make the fakes enforce those contracts, and add contract tests (for example "a `DUPL` on resubmission completes the payment") | All 11 failures passed the existing tests; the agent's summaries said done | Descriptive; contract tests weren't run here |
| For an FMEA with context, ask for the code-level checks explicitly (persistence, authentication outages, client retries, concurrency), or review a code-only run beside it | Context runs found in-code failure modes less often | Exploratory; whether either fix works is untested |

## What would be worth testing next?

- **Stale context:** the same bundle with three facts made wrong, to see how often the agent follows the wrong fact over the code.
- **A combined FMEA prompt:** context plus a code-level checklist, to see if it keeps both halves.
- **A bigger, real service** with a team-written bundle, a stronger model, and Cursor with the same arms.

## Reproduce

Everything is in [experiments/2026-11-okf-context](https://github.com/meabs/experiments/tree/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context):

- the service and its fakes (`app/`), the three arms (`arms/`), the tickets (`tasks/`), hidden tests (`hidden/`), the answer key (`key/fmea_key.json`);
- the run, grading, judge, taxonomy and analysis scripts (`scripts/`), and the diagrams (`diagrams/`);
- every run's diff, grade and FMEA, both judges' verdicts, my overrides and the full analysis (`results/main/`).

The design and its 20 amendments are in [README.md](https://github.com/meabs/experiments/blob/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context/README.md); the full report is [REPORT.md](https://github.com/meabs/experiments/blob/be6bac4d4cca293ad4955aa84305b762332c187a/2026-11-okf-context/REPORT.md). The commands are in REPORT.md, section 10. The API keys and the Codex login are not published.
