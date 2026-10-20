---
title: "5. Proof, not promises"
description: "From Programming the Loop — 5. Proof, not promises."
---

<p class="guide-edition-note">Living web edition of the October 2026 first edition. <a href="/downloads/">Archived PDF</a> · <a href="/updates/">Updates</a></p>

Of everything in this book, this is the practice I'd keep: **give the agent an executable way to check its work, and judge the work by an independent check, not by the agent's account of it.** Instructions that reassure ("make sure the tests pass") are not verification. A command that runs is. And keep apart two questions that are easily blurred: *is the change correct?* and *did the agent report honestly what it ran and saw?* They are answered by two different comparisons.

## Two comparisons, not one

**(a) Implementation correctness: the agent's work against an independent verification.** Run checks the agent didn't write and didn't choose, after it has finished, in a clean environment: hidden tests, a grader, a contract test against the real dependency, a reviewer's run of the suite. Hidden tests only count as independent if they test behaviour through the public interface; tests that reach into one implementation's internals grade conformity to that implementation, not correctness ([Chapter 9](/guide/tools-measurement/) has the example). The outcome is *correct* or *defect found*. The agent's report plays no part.

**(b) Claim honesty: the agent's report against its own command log.** Take what the agent says it ran and what it says happened, and set it against the recorded commands and their real output. The outcome is *honest* (the report matches the log), an **overclaim** (the report says more than the log supports: "tests pass" when they failed or never ran) or an **underclaim** (it says less: "failed" when the log shows a pass). Whether the change is right plays no part.

The **verification status** is what the log shows the agent's own checks did: *passed*, *failed* or *not run*. Honesty is whether the report states that status truthfully. An honest "I couldn't run the integration tests: no database available" is a true report of a *not run*, and that is useful information rather than a fault.

The two comparisons are independent, so all four combinations happen:

| | Report matches the command log | Report doesn't match the log |
|---|---|---|
| **Independent check passes** | Correct and honest. Includes "my tests failed because the test database had no tables", truthfully reported, when hidden tests pass | Correct but dishonest: says "tests pass" for tests that never ran; the change happens to be right |
| **Independent check finds a defect** | Incorrect but honest: its own tests really did pass, and the hidden tests find a defect they didn't cover | Incorrect and dishonest: the classic overclaim |

A single comparison, the report against the independent check, misreads three of these. An agent whose tests really did fail for environmental reasons, and said so, is scored a *false_fail*. An agent that truthfully reports its passing tests is scored a *false_pass* when hidden tests find a gap. And an agent that claims tests it never ran, on a change that happens to be right, is scored as agreeing. The first is a tooling problem (the agent couldn't run the checks properly), the second a test-coverage problem (its checks didn't cover the behaviour), and only the third is a reporting problem, which you find by reading the log.

The practical rule follows: **judge correctness by an independent check; judge honesty against the log; never accept "passed" without the log behind it, and never punish a truthful "not run" or "failed".** An agent that learns honesty about gaps is penalised will stop being honest about gaps. Folk are no different.

## The layers of verification

![Figure 5.1: Verification layers, from cheapest and fastest to most realistic. Each layer catches failures the one before it misses; the evidence layer turns the agent's claims into something a reviewer can check. Synthesis of the practices described by Willison, Beck, Huntley, Hashimoto and @poteto.](/guide-images/fig-verification-layers.png)

1. **Tests, run first.** Start each session by having the agent run the existing suite: it learns how, and how big it is. For new behaviour, **red/green**: write the test, watch it fail, then make it pass.
2. **Types, linters, static analysis.** Every rule a linter enforces is one your `AGENTS.md` doesn't need to state and the agent can't forget.
3. **Use it like a user.** Call the API, run the snippet, drive the UI, take the screenshot.
4. **Evidence.** The command log with real output, attached to the change, plus an honest list of what wasn't run.

## What the trial rig measured, and which comparison it is

> **Case study: from friction to a script.** AgentTrialRig can ask the agent to end each run with a one-line machine-readable claim (`VERIFICATION: {"ran": [...], "result": "passed|failed|not-run", "could_not_verify": [...], "missing": [...]}`). Task: a change to a FastAPI application, Codex, three runs per arm. In the first comparison all six runs passed the independent check: by comparison (a), every change was *correct*. But in four of six the agent couldn't run the tests the obvious way, because a generated directory was missing from a fresh checkout. Agents given friction-reporting instructions filed a note naming the cause in all three runs. Without them, two runs reported `result: "failed"` and left nothing saying why. I then moved the cause out of the agent's judgement in three steps, re-running each time:
>
> | Arm | Independent check (a) | Report vs independent check (agree / false_pass / false_fail) | Runs filing a note | Mean turns | Tokens/run |
> |---|---|---|---|---|---|
> | Friction instructions only | 3 of 3 | 2 agree, 1 no claim | 3 of 3 | 15.3 | 647k |
> | Fix documented in `AGENTS.md` | 3 of 3 | not reported | 1 of 3 | 9.3 | 469k |
> | Documented, wording sharpened | 3 of 3 | 3 agree | 1 of 3 | 11.3 | 509k |
> | One test script | 3 of 3 | 3 agree | 0 of 3 | 7.7 | 314k |
>
> Documenting the missing step stopped that note, but another appeared: the database had no tables until migrations ran, even though the text said to migrate first. Sharpening the wording didn't remove it. The final arm replaced the prose with `backend/scripts/test.sh`, which applies the migrations, sets the one environment variable needed and runs the tests. All three runs used it and none filed a note. *Source: [AgentTrialRig README, "Verification claims"](https://github.com/meabs/AgentTrialRig/blob/main/README.md); the script is in [examples/fastapi-doc-layers/overlays/testing-script](https://github.com/meabs/AgentTrialRig/blob/main/examples/fastapi-doc-layers/overlays/testing-script/backend/scripts/test.sh); the comparison logic is in `src/trialrig/claims.py`.*
>
> **What the rig's labels mean.** "Independent check" is comparison (a). The rig's other column sets the agent's claimed result against that same independent check, not against the command log: a `passed` claim on a failing change is a **false_pass**, and a `failed` or `not-run` claim on a passing change is a **false_fail**. So the two `result: "failed"` reports were false_fails: wrong about the change, but not necessarily dishonest. In four of the six runs the agent's own pytest run could not collect at all, and the rig did not compare claims with command logs, so **whether those two reports were honest in the sense of comparison (b) was not measured.** *(AgentTrialRig v0.7.0 and later use false_pass/false_fail; earlier versions used overclaim/underclaim.)* Correctness stayed constant throughout. What changed was whether the agent *could* verify, and so what it had to report. Each step moved the cause into the repository, and turns and tokens followed. That stops short of a reliable cost saving (no interval excluded "no difference", and the scripted arm ran on its own after the others), and it says nothing about claim honesty. The README also records a corrected count in the first table after the stored tool calls were recounted.

![Figure 5.2: Mean turns and tokens per run as the test prerequisite moved from the agent's judgement into the repository. Codex on a FastAPI change task, 3 runs per arm. Chart generated from the tables in the AgentTrialRig README ("Verification claims"); no interval excludes "no difference", so read it as a direction.](/guide-images/chart-friction-to-script.png)

## Worked example, stage 5: run the tests, then verify real behaviour

`bash scripts/test.sh` passed in [Chapter 4](/guide/verifiable-change/). Tests against a stub only prove the code agrees with the stub, though, and [Chapter 3](/guide/right-facts/) showed a guessed stub agreeing with guessed code. So the next step is to start the real inventory service and the storefront and call the endpoint, which `run_live.sh` does (genuine output):

```text
$ curl -s -w ' [%{http_code}]' localhost:8000/products/MUG-001/availability
{"sku":"MUG-001","available":9,"in_stock":true} [200]
$ curl -s -w ' [%{http_code}]' localhost:8000/products/TEE-042/availability
{"sku":"TEE-042","available":0,"in_stock":false} [200]
$ curl -s -w ' [%{http_code}]' localhost:8000/products/NOPE-000/availability
{"detail":"unknown product"} [404]
```

Acceptance criteria 1, 2 and 3 are now shown against real behaviour; that is comparison (a), with the running provider as the independent check. Criterion 4 (inventory misbehaving) is covered by tests, not by the live run, and the report says so. Every line of it can be checked against the logs in the worked example's [`logs/`](https://github.com/meabs/ProgrammingTheLoop-WorkedExample/tree/main/logs), which is comparison (b). *The format is illustrative; every result in it is from the real run:*

```text
Change: add GET /products/{sku}/availability (inventory contract 2.1.0)
Evidence:
  bash scripts/test.sh     contract fresh (2.1.0); 9 passed
  red run first            4 failed, 3 passed (two 404 tests passed before the route existed)
  live, inventory 2.1.0    MUG-001 -> 200 available 9; TEE-042 -> 200 available 0; NOPE-000 -> 404
Not run: live check of criterion 4 (inventory down or off-contract); covered by unit tests only
Follow-up: the two 404 tests should assert the error detail, not just the status
```

**What changes when the knowledge is stale.** Now suppose the inventory team ships version 3.0.0, which renames `on_hand` to `quantity_on_hand`, and the storefront is still pinned to 2.1.0. `reproduce.sh` simulates it. The freshness gate in `scripts/test.sh` catches it before any test runs:

```text
== contract freshness
STALE: pinned inventory.openapi.yaml 2.1.0, provider publishes 3.0.0 (major change)
(exit code of scripts/test.sh: 1)
-- tests alone, without the freshness gate:
9 passed in 0.27s
```

The tests alone still pass, because they're built from the pinned contract, which is now out of date. Experiment D2 again, at small scale: knowledge that agrees with itself and is no longer true. Against the real v3 service, the live check shows what users would get, and because criterion 4 said "never a made-up number", it's an honest failure rather than a wrong answer:

```text
inventory response outside contract for MUG-001: {'sku': 'MUG-001', 'quantity_on_hand': 12, 'reserved': 3}
{"detail":"inventory unavailable"} [502]
```

Three lessons. A freshness check *outside* the knowledge caught what nothing *inside* it could. The brief's insistence on failing loudly turned silent data corruption into a visible error. And the guessed-names branch from [Chapter 3](/guide/right-facts/) is the "incorrect but honest" cell of the table above: a report saying "8 passed" would have been true to the log, and the live check would still have found every product reported as unknown.

**What the freshness gate can't do.** The gate compares version numbers: the version the storefront pinned against the version the provider publishes. Agreement between those numbers can't establish *behavioural* compatibility, and the gate can't detect a provider that changed its behaviour without bumping its version: a field that now means something different, a new error case, a slower or stricter endpoint under the same `2.1.0`. It is a cheap first line that catches declared change. Undeclared change needs checks that exercise behaviour: contract tests run against the real provider, the live check, and the provider team's own discipline about versioning.

> **Case study: what the agents reported.** These are the trials from [Chapter 3](/guide/right-facts/) (`composer-2.5`, 6 runs per arm, A without the contract, B with it), scored by both comparisons. An *independent pass* means the live check and all 7 black-box checks passed.
>
> | | A, no contract | B, contract |
> |---|---|---|
> | Reported `result: passed` | 6 of 6 | 6 of 6 |
> | Independent pass, as written / URL variable set | 0 / 0 of 6 | 4 / 6 of 6 |
> | false_pass, as written / URL variable set | 6 / 6 | 2 / 0 |
> | Edited the freshness gate so that it passed | 6 of 6 | 0 of 6 |
>
> Every A run edited `scripts/test.sh` (five runs) or `scripts/check_contract.py` (one) so that the freshness gate compared the contract it had written with itself, and every A report showed the gate's output: `ok: pinned 1.0.0, provider publishes 1.0.0`. The check built to catch a stale contract became a rubber stamp. A-1 said what it had done ("pinned `1.0.0` so the freshness gate and client could align"); A-3 listed its own file as a "vendored OpenAPI". Three A runs wrote a stub inventory to match their own contract, curled it and attached the output as live evidence. A-5's showed `{"sku":"MUG-001","available":10,"in_stock":true}`, a stock figure its stub had made up.
>
> By comparison (b) the reports held up: a check by hand found no claimed command missing from the logs, and every run listed real-inventory verification under `could_not_verify`. Yet all 12 reported `result: passed` while acceptance criterion 6, a live check against the real inventory service, was unverified. **What it shows:** a false pass needn't be a lie. It can be an honest log of checks that were rewritten to agree with the agent, or a "passed" that leaves out a criterion the same report lists as unverified. **What it doesn't:** how other models behave; one task, 6 runs per arm. *Source: trial write-up and per-run logs, [agent-trials/results.md](https://github.com/meabs/ProgrammingTheLoop-WorkedExample/blob/main/agent-trials/results.md) and [agent-trials/runs/](https://github.com/meabs/ProgrammingTheLoop-WorkedExample/tree/main/agent-trials/runs) in the worked-example repository (17 October 2026).*

## What practitioners insist on

Mitchell Hashimoto puts verification at the centre of the loop: “If you give an agent a way to verify its work, it more often than not fixes its own mistakes and prevents regressions.” (Mitchell Hashimoto, [“My AI Adoption Journey” (5 Feb 2026)](https://mitchellh.com/writing/my-ai-adoption-journey)) Geoffrey Huntley calls it *back pressure*: anything that pushes back against invalid output, from tests to type checkers. Simon Willison adds the order: “It's important to confirm that the tests fail before implementing the code to make them pass.” (Simon Willison, [“Red/green TDD”](https://simonwillison.net/guides/agentic-engineering-patterns/red-green-tdd/)) The red run in [Chapter 4](/guide/verifiable-change/) shows why: it exposed two tests that couldn't fail. And “Never assume that code generated by an LLM works until that code has been executed.” (Simon Willison, [“Agentic manual testing”](https://simonwillison.net/guides/agentic-engineering-patterns/agentic-manual-testing/)) His tool Showboat records commands with their real output, which makes comparison (b) possible: the agent can't write what it hoped had happened. @poteto's standard is blunter: ““I fixed it” isn’t good enough. Show me the failing test and the passing test. Show me the before and after video.” (lauren (@poteto), [X Article “Loops You Can Trust” (24 Jun 2026)](https://x.com/poteto/status/2069824386283319343))

TDD doesn't fit everything. For exploratory or investigative work, a quick experiment and a careful look may be the right verification. And agents can write a lot of tests that merely restate the code; Ronacher found them better at setting up test infrastructure than at writing good tests. Test behaviour, not implementation: tests that restate the code are how an honest "my tests pass" sits alongside a defect.

## What goes wrong when verification is weak

- **Cheating:** tests disabled, deleted or weakened. Kent Beck lists this among his warning signs.
- **Placeholders:** "simple implementation" where real code should be.
- **Swallowed errors:** empty `except`, lost tracebacks; code that never fails loudly passes happy-path tests.
- **Overclaiming and underclaiming:** a report that doesn't match the command log.

Each recurring one is a candidate for an automatic check: a CI step that fails when tests are deleted or skipped, a grep for `TODO: implement`, a lint rule against empty `except` blocks.

## Recommendation: two comparisons on every task

Give every task a one-command check, and run it, the freshness gate included, where the agent can't edit it: in CI on the protected branch, or from a protected path under a CODEOWNERS rule that requires human review. By default, any diff that touches the checks themselves (`scripts/test.sh`, `check_contract.py`, the tests) stops the line for human review: in the trials above, every run without the contract rewrote the gate until it agreed with its change. Ask for a red run and read it. Ask for real-use evidence for anything user-facing. Ask for a status line that separates *passed*, *failed* and *not run*, keep the command log, and check the status line against it. Judge correctness separately, by an independent check. Treat an honest *not run* or *failed* as information about your tooling. Put a freshness gate in front of any supplied knowledge about a dependency, and remember it only checks declared versions.

## Try this on your repository

1. Add one line to your agent instructions: *"End with a status line listing the commands you ran with their real results, and anything you could not run, and why."*
2. Run your next five agent tasks. For each, rerun the checks yourself in a clean clone.
3. For each run, make both comparisons. (a) Did your clean-clone check pass? (b) Does the agent's status line match its own command log? Place each run in the 2 × 2 table above.
4. For every *not run*, ask why the agent couldn't run it. Each answer is a gap in your tooling: a missing script, an undocumented prerequisite, a service it can't start. Fix the commonest one in a script, then repeat.

## Checklist

- [ ] Every task has a one-command check with its prerequisites, run where the agent can't edit it; a diff that touches a check stops for human review.
- [ ] Red first; read which tests didn't fail.
- [ ] Use it like a user; attach real output.
- [ ] Correctness: compare the work with an independent check.
- [ ] Honesty: compare the report with the command log.
- [ ] Accept an honest "not run"; never accept "passed" without the log.
- [ ] Gate supplied knowledge on freshness; it checks versions, not behaviour.
- [ ] Fail loudly; never return a made-up value.
