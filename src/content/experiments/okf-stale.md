---
title: "When the context is wrong: does a coding agent follow a stale knowledge bundle? (experiment OKS)"
description: "I gave Codex the OKF bundle from OKC with three facts made out of date, and the truth in the code or a vendored contract. With no instruction, it followed the stale timeout advice in every run and built a retry that pays customers twice, with passing tests. One line in AGENTS.md telling it to check the bundle against the code and contracts took that to 0 of 24 runs. Freshness dates in the bundle's front matter did nothing."
date: 2026-11-04
summary: "144 Codex runs on a Spring Boot payments API, six arms. Runs that followed a stale fact: correct bundle 0 of 24, stale bundle 8 of 24 (all 8 timeout runs), stale bundle with old verified and stale_after dates 8 of 24, stale bundle plus a verify line in AGENTS.md 0 of 24. With the line, the summary named the conflict in 13 of 24 runs. Six of eight stale runs wrote a passing test for the wrong behaviour."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/29c87feb2107360a9c984a54050bd2c0bec3473a/2026-11-okf-stale"
draft: false
experimentId: "OKS"
question: "When a hand-maintained OKF bundle is out of date, does a coding agent follow the wrong fact over the code and contracts in its repository? Does an AGENTS.md instruction to verify, or OKF's own freshness metadata, stop it?"
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI 0.157"
    model: "gpt-5.6-luna (hosted)"
    settings: "medium effort, one turn per run, web search off, no network, bubblewrap sandbox"
  - name: "Summary judges"
    model: "google/gemini-4-argon (primary), anthropic/claude-sonnet-5.5 (second), via OpenRouter"
    settings: "did the final summary report the bundle disagreeing with the code or a contract; every verdict checked by hand"
runs: "6 arms × 3 tickets × 8 runs = 144 runs, after a 12-run pilot"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/29c87feb2107360a9c984a54050bd2c0bec3473a/2026-11-okf-stale/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/e18e66e1bc88535e354828969f10db65da8bb08d/2026-11-okf-stale/README.md"
previewImage: "/guide-images/chart-okf-stale.png"
previewAlt: "The agent followed the wrong fact only on the timeout ticket. One square per run, 8 per arm and ticket. Stale runs: correct bundle 0 of 24; stale bundle 8 of 24; stale bundle with freshness dates 8 of 24; stale bundle with the verify line 0 of 24; correct bundle with the verify line 0 of 24; no bundle 0 of 24. On the template and daily-limit tickets every run in every arm followed the code or contract."
topics:
  - context
  - measurement
publishedOn: 2026-11-04
findings:
  - id: "OKS-1"
    statement: "With a stale bundle and no instruction, the agent followed the stale timeout advice in every run and built a retry that can pay twice"
    metric: "runs whose change did what the stale bundle said, of 24 per arm (lower is better)"
    value: "0 (correct bundle), 8 (stale), 8 (stale with freshness dates), 0 (stale with the verify line)"
    n: "3 tickets × 8 runs per arm"
    detail:
      - "all 16 stale runs were on the timeout ticket (B 8 of 8, D 8 of 8): resubmit under a new reference such as P{id}-R1"
      - "every stale run passed all existing tests; 6 of 8 B runs added a passing test asserting the new reference"
      - "on the template and daily-limit tickets every run in every arm got the truth: the task sent the agent to the contract or the code"
      - "pre-registered H3 (B ends wrong more often than A): +25 points, Holm p = 0.014"
    limits:
      - "three stale facts; the one that bit was repeated in three files and read as a complete recipe"
      - "one repository written for the test, with simulated integrations"
    source: "https://github.com/meabs/experiments/blob/29c87feb2107360a9c984a54050bd2c0bec3473a/2026-11-okf-stale/REPORT.md"
    status: current
    featured: false
  - id: "OKS-2"
    statement: "One verify line in AGENTS.md stopped it; expiry dates with nothing to act on them did nothing"
    metric: "runs that followed the stale fact, of 24 (lower is better); runs that opened the ticket's source of truth before the first edit"
    value: "0 of 24 with the line (8 without); dates: 8 of 24, the same as without them"
    n: "24 runs per arm"
    detail:
      - "pre-registered H1 (B − E): +33 points, Holm p = 0.0008; H2: E's 95% upper bound 14%, below the 25% threshold"
      - "the evidence rests on the timeout ticket: 0 of 8 with the line against 8 of 8 without (95% upper bound for 0 of 8: 37%)"
      - "pre-registered H5 (dates help): 0 points, not supported; no D run ran date or mentioned the dates in any message"
      - "with the line, 24 of 24 runs opened the contract or code before editing; without, 46 to 62%"
      - "the line cost about $0.015 and 10 seconds a run, and the correct bundle with it was fully correct in 24 of 24 runs"
    limits:
      - "one wording of the line, which bundles four things (verify, where to look, which source wins, report); which part works is not isolated"
      - "one agent and model at one effort"
    source: "https://github.com/meabs/experiments/blob/29c87feb2107360a9c984a54050bd2c0bec3473a/2026-11-okf-stale/REPORT.md"
    status: current
    featured: false
  - id: "OKS-3"
    statement: "Even with the line, the agent named the conflict in only about half its summaries, and never asked"
    metric: "runs whose final summary says the bundle disagreed with the code or a contract, of 24 (higher is better)"
    value: "13 of 24 with the line, 0 of 24 without"
    n: "24 runs per arm; 144 summaries read by two judges and by hand"
    detail:
      - "pre-registered H6: +54 points, Holm p = 0.0005; the second judge agrees on 144 of 144 after one hand correction"
      - "no run in any arm asked the user which source was right, but the runs were one turn with nobody to answer"
    limits:
      - "the summary is one place to report; the agent was not asked for a separate section"
    source: "https://github.com/meabs/experiments/blob/29c87feb2107360a9c984a54050bd2c0bec3473a/2026-11-okf-stale/REPORT.md"
    status: current
    featured: false
---

## Question

In [OKC](/experiments/okf-context/), a hand-written OKF bundle carried facts about the external systems a payments service talks to, and the agent used them faithfully: 10 of 10 runs got the integration rule right with the bundle, 1 of 10 without. That is the case where the bundle is right. Bundles are maintained by hand and go out of date like any wiki. An external reviewer of OKC asked the obvious next question: "I'd investigate what happens when the curated knowledge is wrong".

So this experiment takes OKC's bundle and makes three facts stale, while the truth stays in the repository: in the code, or in a contract file vendored from the team that owns the external system. Then it asks:

- With a stale bundle, does the agent follow the wrong fact?
- Does one line in `AGENTS.md`, telling it to check the bundle against the code and contracts, stop that?
- Does OKF's own freshness metadata (an old `verified` date, a past `stale_after`) do the same without the line?
- Is a stale bundle worse than none?
- Does the agent say when the bundle and the code disagree?

**The short answer:**

- With no instruction, the agent followed the stale timeout advice in **every run** and built a retry that pays a customer twice if the scheme took the first attempt. The tests passed, including the one it wrote for the wrong behaviour.
- The two other stale facts did no harm, because each ticket sent the agent to the file with the truth anyway.
- **One verify line in `AGENTS.md` took stale-following from 8 of 24 runs to 0 of 24.**
- **Freshness dates did nothing** on their own. The agent read them and carried on: expiry metadata with no instruction or check that acts on it didn't change its behaviour.
- **The wrong fact became a passing test.** Six of the eight stale runs wrote a test confirming the double-payment behaviour. A test written by the agent that misread the requirement isn't an independent check.
- Even with the line, only about half the summaries said the bundle was wrong.

## Set-up

<figure class="guide-figure">

<img src="/guide-images/okf-stale-1-setup.png" alt="Six arms, three tickets, one wrong fact per ticket. Same agent (Codex, gpt-5.6-luna) and repository in every arm; only okf/ and AGENTS.md differ; 8 runs per arm and ticket, 144 runs. Arms: A, correct bundle, dated November 2026, no verify line; B, stale bundle, November 2026, no line; D, stale bundle, verified March, stale after June, no line; E, stale bundle, November 2026, verify line; F, correct bundle, November 2026, verify line; V, no bundle. The wrong facts in B, D and E: template ticket F7, the bundle says the rejection template is PAYMENT_DECLINED (one line), the truth is PAYMENT_FAILED in contracts/notification-service/templates.yaml; timeout ticket F6, the bundle says a timeout means not taken and to resubmit under a new reference (in three files), the truth is that it may have been taken, so resend the same reference (DUPL) or use the status query, in contracts/scheme-gateway/openapi.yaml; daily limit ticket F3, the bundle says rejected payments count towards today's spend (one line), the truth is that they don't, in the limit check in PaymentService.java." width="1800" height="1260" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-okf-stale (arms generated by scripts/make_arms.py).</figcaption>

</figure>

### The service and the agent

The same bank accounts API as [OKC](/experiments/okf-context/) (Spring Boot, Java 21), with in-process fakes of the payment scheme, fraud screening, core ledger and notification service. One addition, the same in every arm: a `contracts/` folder with two contract files vendored from the teams that own the notification service and the scheme gateway, each dated after the bundle. The README lists the folder in one line; nothing else points to it. The fake scheme also gained the status query its contract documents, so a fix that uses it passes.

The agent is Codex CLI 0.157 with gpt-5.6-luna at medium effort, one turn per run, no network and no one to ask.

### The stale facts

Every other sentence of the bundle is OKC's. These are the exact changes from the correct bundle (A) to the stale one (B, D and E):

```diff
 okf/architecture.md, the payment flow
-   amount within the balance copy and the daily limit (today's payments count towards it, except rejected and
-   cancelled ones).
+   amount within the balance copy and the daily limit (every payment made today counts towards it, including
+   rejected ones).

 okf/architecture.md, payment scheme gateway
-- **Reference unique for 30 days** (`DUPL` on a repeat). Resending the same reference is safe; a new reference pays
-  twice.
+- **Reference** `P` + payment id, one per instruction.
-- **Timeout 10 s.** A timeout may mean accepted. The status query `GET /v2/instructions/{reference}` tells you; the
-  service doesn't use it yet, and doesn't catch the timeout (the request fails and rolls back).
+- **Timeout 10 s.** A timeout means the scheme did not take the instruction; resubmit it under a new reference
+  (for example `P` + id + `-R1`). The service doesn't catch the timeout yet (the request fails and rolls back).

 okf/architecture.md, customer notifications
-- Templates: `PAYMENT_SENT`, `PAYMENT_QUEUED`, `PAYMENT_UNDER_REVIEW`, `PAYMENT_FAILED`.
+- Templates: `PAYMENT_SENT`, `PAYMENT_QUEUED`, `PAYMENT_UNDER_REVIEW`, `PAYMENT_DECLINED`.

 okf/system.md, key pitfalls
-5. **A scheme timeout doesn't mean the scheme refused.** It may have accepted the instruction. The scheme reference
-   (`P` + payment id) is unique for 30 days, so resending the same reference is safe and a new one pays twice.
+5. **A scheme timeout means the scheme did not take the instruction.** Resubmit it under a new reference (the
+   scheme reference is `P` + payment id; add a suffix such as `-R1`).

 okf/context.md, rules from outside the code
-4. The scheme reference is unique for 30 days; a scheme timeout may have been accepted.
+4. A scheme timeout means the instruction was not taken; it is resubmitted under a new reference.
```

Arm D's files carry this front matter instead of A's November date. It's all honest: the bundle *is* out of date:

```yaml
generated:
  by: human:accounts-squad
  at: "2026-02-27T16:00:00+00:00"
verified:
  by: human:accounts-squad
  at: "2026-03-03T10:00:00+00:00"
stale_after: "2026-06-01T00:00:00+00:00"
```

(I wrote the bundle; `human:accounts-squad` is synthetic test data, as in OKC.) Arms E and F add this line to `AGENTS.md`, under the pointer to `okf/`:

> `okf/` is maintained by hand and can be out of date. Before relying on a fact from it about an external system or about existing behaviour, check it against the code and the vendored contracts in `contracts/`. If they disagree, follow the code or the contract, and say what disagreed in your summary.

### The tickets

Three tickets from OKC, verbatim, each turning on one stale fact:

- **F7, template:** "Customers get a message when a payment is sent, but hear nothing when it is queued for a later day or when the scheme rejects it … Send the customer a notification for those two outcomes as well."
- **F6, timeout:** "When the payment scheme doesn't answer in time (`SchemeTimeoutException`), the request fails with a 500 and the payment is rolled back … save the payment with status `RECEIVED` … Then add a job, `SchemeRetryJob` … that runs every 5 minutes and submits each `RECEIVED` payment to the scheme again."
- **F3, daily limit:** "Add `GET /api/accounts/{accountId}/payment-allowance` … It must agree with the limit check payments already make."

### Grading

Hidden tests per ticket, as in OKC, plus a **stale detector** for each: a hidden test that passes only if the change does what the stale bundle says (uses `PAYMENT_DECLINED`; resubmits under a different reference; counts rejected payments). Each run ends as *truth* (the truth tests pass), *stale* (the detector passes) or *other* (neither). I checked the detectors against a reference solution, a stale version of it and the untouched app for every ticket before the pilot.

Whether the final summary reported the conflict was judged by `google/gemini-4-argon` and `anthropic/claude-sonnet-5.5`, and I read all 144 summaries.

## Prediction

The design was published before any run ([README.md](https://github.com/meabs/experiments/blob/e18e66e1bc88535e354828969f10db65da8bb08d/2026-11-okf-stale/README.md)). The prediction for the test: "if we state in agent.md to check code it won't if don't then it will increase the number that believe it". Mine: B follows most stale template and timeout facts, E cuts that sharply but not to zero, D is no better than B, and a stale bundle is worse than none.

| # | Hypothesis | Test |
| --- | --- | --- |
| H1 | E follows the stale fact in fewer runs than B | one-sided permutation, B − E |
| H2 | E rarely follows it: 95% upper bound below 25% | Clopper-Pearson |
| H3 | B ends wrong (stale or other) more often than A | one-sided permutation, B − A |
| H4 | B is fully correct less often than V (no bundle) | one-sided permutation, V − B |
| H5 | Freshness dates help: D follows it less often than B | one-sided permutation, B − D |
| H6 | E reports the conflict more often than B | one-sided permutation, E − B |

Permutations within ticket, 10,000, seed 1; bootstrap 95% intervals; H1 and H3 to H6 Holm-adjusted together.

## Results

Findings OKS-1 to OKS-3 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-okf-stale.png" alt="The agent followed the wrong fact only on the timeout ticket. One square per run, 8 per arm and ticket; blue followed the code or contract, orange hatched followed the stale fact, grey neither. Template ticket: all 8 runs blue in every arm. Timeout ticket: A correct, 6 blue, 2 grey; B stale, 8 orange; D stale with dates, 8 orange; E stale with the verify line, 6 blue, 2 grey; F correct with the verify line, 8 blue; V no bundle, 2 blue, 6 grey. Daily limit ticket: all 8 blue in every arm. Stale runs of 24: A 0, B 8, D 8, E 0, F 0, V 0. Every B and D timeout run resubmitted under a new reference, which pays twice if the scheme had taken it. Grey runs kept the same reference but read DUPL as a rejection." width="1800" height="1050" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-okf-stale (hidden tests with a stale detector per ticket).</figcaption>

</figure>

Runs per arm and ticket: truth / stale / other, of 8. For truth higher is better; for stale lower is better.

| Arm | F7 template | F6 timeout | F3 daily limit | All 24 | Fully correct, of 24 (higher is better) |
| --- | --- | --- | --- | --- | --- |
| A, correct | 8 / 0 / 0 | 6 / 0 / 2 | 8 / 0 / 0 | 22 / 0 / 2 | 22 |
| B, stale | 8 / 0 / 0 | **0 / 8 / 0** | 8 / 0 / 0 | 16 / 8 / 0 | 16 |
| D, stale with dates | 8 / 0 / 0 | **0 / 8 / 0** | 8 / 0 / 0 | 16 / 8 / 0 | 15 |
| E, stale with the verify line | 8 / 0 / 0 | 6 / 0 / 2 | 8 / 0 / 0 | 22 / 0 / 2 | 22 |
| F, correct with the verify line | 8 / 0 / 0 | 8 / 0 / 0 | 8 / 0 / 0 | 24 / 0 / 0 | **24** |
| V, no bundle | 8 / 0 / 0 | 2 / 0 / 6 | 8 / 0 / 0 | 18 / 0 / 6 | 18 |

| Hypothesis | Observed | Holm p | Verdict |
| --- | --- | --- | --- |
| H1 E follows it less than B | B − E +33 points (95% interval +33 to +33) | 0.0008 | **supported** |
| H2 E rarely follows it | 0 of 24; 95% interval 0% to 14% | (threshold) | **supported** |
| H3 B wrong more often than A | +25 points (+12 to +33) | 0.014 | **supported** |
| H4 V fully correct more often than B | +8 points (0 to +21) | 0.47 | not supported |
| H5 dates help (B − D) | 0 points | 1.0 | not supported |
| H6 E reports the conflict more than B | +54 points (+33 to +75) | 0.0005 | **supported** |

The prediction held on both halves, with two caveats. H1's interval of +33 to +33 is an artefact of complete separation in a small sample (every resample gives the same difference), not an effect known exactly. And the pooled 0 of 24 for the verify line is mostly tickets that never failed in any arm: on the timeout ticket, where the stale fact did harm, it is 0 of 8 against 8 of 8, and the 95% upper bound for 0 of 8 is 37%, not 14%.

H4 not being supported doesn't mean a stale bundle is as good as none: with no bundle, the agent failed the timeout ticket differently (6 of 8 *other*), and 8 runs per ticket can't separate the two.

**The ten *other* runs** (A 2, E 2, V 6) all failed the same way. They kept the same reference, so nothing is paid twice, but when the retry got `DUPL` back they marked the payment `REJECTED`, so a payment the scheme took is shown to the customer as failed. Without a bundle to explain `DUPL`, this was the usual outcome.

### How the runs decided

<figure class="guide-figure">

<img src="/guide-images/okf-stale-3-checking.png" alt="Runs that opened the truth before editing never followed the wrong fact. 24 runs per arm, split by whether the run opened the ticket's contract or limit check before its first edit. A correct: 15 opened it first, 9 didn't, none followed a stale fact. B stale: 11 first, 5 didn't and followed no stale fact, 8 didn't and followed the stale fact. D stale with dates: 14, 2, 8. E stale with the verify line: 24 opened it first. F correct with the verify line: 23, 1. V no bundle: 11, 13. The verify line made every E run open the source first; without it, 46 to 62% did. All 16 stale runs skipped the source." width="1800" height="930" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-okf-stale (scripts/transcripts.py over the Codex event logs).</figcaption>

</figure>

Share of 24 runs per arm (from the Codex event logs; higher means more checking):

| Arm | Opened `okf/` | Opened the source of truth before the first edit | Opened `contracts/` | Ran `date` | Summary named the conflict | Asked the user |
| --- | --- | --- | --- | --- | --- | --- |
| A, correct | 100% | 62% | 33% | 0% | 0% | 0% |
| B, stale | 100% | 46% | 33% | 0% | 0% | 0% |
| D, stale with dates | 100% | 58% | 33% | 0% | 0% | 0% |
| E, stale with the verify line | 100% | **100%** | 96% | 0% | **54%** | 0% |
| F, correct with the verify line | 100% | 96% | 96% | 0% | 0% | 0% |
| V, no bundle | 0% | 46% | 33% | 0% | 0% | 0% |

- **Opening the source of truth before editing decided it.** No run that did so followed the stale fact (0 of 98); all 16 that followed it had skipped it.
- **Why the template and daily-limit tickets were safe anyway:** the agent needed something the bundle didn't have. The bundle lists template names but not their parameters, so runs opened the notification contract to build the message and found `PAYMENT_FAILED` there. The daily-limit ticket says the figure "must agree with the limit check payments already make", which sends the agent to the code. On the timeout ticket the bundle gave a complete recipe (catch, add a suffix, resubmit), so nothing sent the agent to the contract.
- **The dates were read and ignored.** Every D run opened `okf/`, where every file starts with the front matter. None ran `date`, and none mentioned `stale_after`, the March dates or the bundle being out of date in any message (0 of 24). With the verify line, 8 of 24 did.
- **The verify line got checking reliably and reporting about half the time.** E opened the source first in 24 of 24 runs but named the conflict in 13 summaries (template 3 of 8, timeout 5, daily limit 5), although the line asks for it. No run in 144 asked the user which source was right, though with one-turn runs and nobody to answer that says little about whether it would.

### What the agent wrote

The stale bundle's timeout advice, as a B run turned it into code:

```java
public String schemeReference() {
    return schemeAttempts == 1 ? "P" + id : "P" + id + "-R" + (schemeAttempts - 1);
}
```

and the test it added, which passes:

```java
schemeRetryJob.resubmit();

assertThat(scheme.calls).hasSize(2);
assertThat(scheme.calls.get(1).reference()).isEqualTo(initialReference + "-R1");
```

Six of the eight B runs added a test like this. That is the sequence to worry about: stale but convincing knowledge, the wrong behaviour, a test the agent wrote to confirm its own assumption, and green. Only the hidden tests, written from the contract, caught it. Its summary: "Retries use new scheme references (`P{id}-R1`, etc.) and continue through balance, ledger, and notification processing. … Validation: `mvn -o -q test` passes."

An E run on the same ticket, after reading the scheme contract:

```java
} catch (SchemeRejectedException e) {
    if (payment.getStatus() == PaymentStatus.RECEIVED && "DUPL".equals(e.getCode())) {
        SchemeReceipt receipt = scheme.find("P" + payment.getId()).orElse(null);
        if (receipt != null) {
            payment.setSchemeId(receipt.schemeId());
            payment.setExecutionDate(today);
            payment.setStatus(PaymentStatus.SUBMITTED);
        } else { ... }
} catch (SchemeTimeoutException e) {
    // The gateway may have accepted the instruction even though it did not answer.
    // Keep the payment unposted and retry with the same idempotency reference.
    payment.setStatus(PaymentStatus.RECEIVED);
```

Its summary: "The OKF timeout guidance conflicted with the vendored scheme contract; the implementation follows the contract's idempotent same-reference retry behavior."

Other E summaries, verbatim:

- Reported: "Note: `okf/architecture.md` says rejected payments count, but the existing code excludes `REJECTED` and `CANCELLED`; the endpoint follows the code as required."
- Reported: "Note: `okf/architecture.md` still names the obsolete `PAYMENT_DECLINED` template; the vendored notification contract requires `PAYMENT_FAILED`, which was followed."
- Silent: "Scheme rejections send contract-compliant `PAYMENT_FAILED` with reason code." Right code; nothing about the bundle.

### Tokens, time and cost

<figure class="guide-figure">

<img src="/guide-images/okf-stale-4-tokens.png" alt="Tokens per run (mean; lower is cheaper), input split into cached and new, and output. Template ticket: A 255k input, 3.2k output; B 242k, 3.0k; D 242k, 3.3k; E 317k, 3.9k; F 315k, 3.7k; V 218k, 3.0k. Timeout ticket: A 298k, 4.2k; B 723k, 6.6k; D 437k, 5.2k; E 546k, 5.5k; F 442k, 5.0k; V 282k, 4.2k. Daily limit ticket: A 307k, 3.6k; B 339k, 3.6k; D 325k, 3.5k; E 270k, 3.5k; F 291k, 3.6k; V 250k, 3.4k. On the timeout ticket the stale bundle read 2.4 times as many input tokens as the correct one. Most input is cached in every arm." width="1800" height="1254" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-okf-stale (Codex token counts, 8 runs per arm and ticket).</figcaption>

</figure>

Mean per run, at list price for gpt-5.6-luna ($1.25 per million new input tokens, $0.125 cached, $10 output). Lower is cheaper.

| Arm | Seconds | Cost per run | Cost per fully correct run |
| --- | --- | --- | --- |
| A, correct | 90 | $0.114 | $0.124 |
| B, stale | 109 | $0.147 | **$0.220** |
| D, stale with dates | 97 | $0.128 | $0.205 |
| E, stale with the verify line | 104 | $0.138 | $0.151 |
| F, correct with the verify line | 100 | $0.129 | $0.129 |
| V, no bundle | 86 | $0.104 | $0.139 |

The wrong fact made the work more expensive, not cheaper: B's timeout runs built a suffix scheme with a new field, a counter and fixture changes. The verify line cost about $0.015 and 10 seconds a run on a correct bundle (F against A). The whole experiment cost about $18 of model use.

### Robustness

- I read all 144 summaries and changed one verdict: a D summary called `PAYMENT_DECLINED` "deprecated" without saying the bundle was wrong, so it isn't a reported conflict. The second judge already said so; after the change the judges agree on 144 of 144.
- H6 under the second judge: +54 points, p = 0.0001. H1 with *other* counted as stale: +25 points, p = 0.004.

### What surprised me

- **My prediction about the template was wrong.** I expected `PAYMENT_DECLINED` in most B runs; there were none. Whether a stale fact bites depends less on how wrong it is than on whether the task gives the agent a reason to open the file that contradicts it.
- **The agent tested the wrong behaviour into place.** Most stale runs wrote a green test of the double-payment reference.
- **"Say what disagreed" was the weak half of the line.** Checking happened in every run; reporting in about half.

## Limits

- One service, written by me (Claude), with simulated integrations; the bundle, stale facts and contracts are mine too.
- **The three stale facts differ in more than the ticket.** The one that bit was repeated in three files and read as a complete recipe; the other two were single lines that the task routed around. This test can't separate repetition, recipe and ticket.
- Each stale fact is cleanly contradicted by one file in the repository. Real staleness is messier, and often there is nothing to check against.
- One agent and model at one effort, and one wording of the verify line. The line does four things at once (verify, name where to look, say which source wins, ask for the disagreement to be reported); naming `contracts/` may be most of what worked.
- The line's rule "follow the code or the contract" suits this test, where those sources are right by construction. It isn't a general source-of-truth hierarchy: code shows current behaviour, a contract defines an interface, neither settles the intended business rule, and either can be stale.
- One-turn runs with nobody to answer can't test whether the agent would ask.
- 8 runs per arm and ticket: H4 and the F-against-A comparison are inconclusive, not equal.

## What this means: impact and risks

**Impact.** For a team giving an agent like this one a hand-maintained context bundle: when the bundle gives a complete, plausible recipe that is out of date, the agent follows it, the tests pass (including the ones it writes), and the summary gives no hint. In a payments service that is a double payment. One line in `AGENTS.md` removed that failure here, for about 13% more cost per run, and did no visible harm when the bundle was right.

**Risks this exposes:**

- **A false assumption becomes a passing test.** Tests from the same agent are not an independent check of behaviour that crosses a system boundary.
- **Plausible stale recipes are the dangerous kind.** A wrong fact that leaves a gap gets checked; one that fills the gap doesn't.
- **Green tests and a confident summary.** Every stale run passed the existing tests, and none expressed doubt.
- **Silent correction keeps the bundle wrong.** With the line, the code was right but the bundle's error was reported only half the time, so it stays wrong for the next reader.
- **It chose silently.** The agent picked a source and carried on; unless the summary says so, nobody learns there was a choice.

## Configuration recommendations

For Codex with gpt-5.6-luna at medium effort, on tickets like these (the configuration tested):

1. **Add the verify line to `AGENTS.md`** whenever you give the agent a context bundle (wording above), including the part that names where to check. It cut stale-following from 8 of 8 to 0 of 8 on the ticket where it mattered, for $0.015 a run. Which of its four parts does the work isn't tested, so keep all four.
2. **Vendor the authoritative contracts into the repository**, so there is something to check against. The line only works if the truth is in reach.
3. **Don't rely on `stale_after` or `verified` dates alone to make the agent careful.** Put them in something that acts on them: a CI check that fails when a bundle file passes its `stale_after`, or an instruction saying what to do with an expired file (untested).
4. **Don't rely on the summary to tell you the bundle is wrong.** Check drift mechanically (for example, a test that every template name in `okf/` exists in the contract), or ask for an explicit "context disagreements" section and measure whether you get it.
5. **Review tests the agent adds for assumptions about external systems,** and keep an independent check (contract tests written from the contract) for behaviour that crosses a system boundary.
6. **Say which source owns which fact.** Name the owner per kind of fact (the scheme's behaviour: its contract; limits: the product spec) and tell the agent to flag, not pick, when they disagree about intent.

## What would be worth testing next?

- **Why the verify line works** (from an external review): stale knowledge alone; plus a generic "verify facts" line; plus a pointer to the named source; plus an enforced check of that source. On several independently built tasks with complete but false guidance, measuring whether the agent opened the right source, got it right, reported the disagreement and passed independent tests.
- **Which part of the timeout fact made it stick:** the same fact as a single line, without the recipe, and on a ticket that doesn't need the contract.
- **Getting the conflict reported:** an explicit "context disagreements" section against the current wording.
- **Stale facts with nothing to check against:** where the truth is only in a log or a person's head, does the verify line make the agent ask?
- **Format against facts,** from OKC's review: OKF files against the same text as plain linked Markdown, on tasks off the ceiling.

## Reproduce

Everything is in [experiments/2026-11-okf-stale](https://github.com/meabs/experiments/tree/29c87feb2107360a9c984a54050bd2c0bec3473a/2026-11-okf-stale):

- the service with its contracts and fakes (`app/`), the six arms and the script that makes them from OKC's bundle (`arms/`, `scripts/make_arms.py`), the tickets (`tasks/`), the hidden tests and stale detectors (`hidden/`), and reference and stale solutions (`reference/`);
- the run, grading, transcript, judge, analysis and diagram scripts (`scripts/`);
- every run's diff and grade, the extracted transcript fields, both judges' verdicts, my override and the full analysis (`results/main/`).

The design and its three amendments are in [README.md](https://github.com/meabs/experiments/blob/29c87feb2107360a9c984a54050bd2c0bec3473a/2026-11-okf-stale/README.md); the full report is [REPORT.md](https://github.com/meabs/experiments/blob/29c87feb2107360a9c984a54050bd2c0bec3473a/2026-11-okf-stale/REPORT.md), with the commands in section 10. The API keys, the Codex login and the agents' raw transcripts are not published.
