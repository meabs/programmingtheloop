---
title: "OKFExperiment and the worked example"
description: "Controlled trials on facts across a repository boundary, stale knowledge, and a reproducible worked example with agent trials."
date: 2026-10-17
summary: "Where the agent can't read a dependency, the right facts decide the outcome. Stale facts get repeated. Agents without a contract defeated the freshness gate."
type: "Controlled trials"
github:
  - label: "OKFExperiment"
    href: "https://github.com/meabs/OKFExperiment"
  - label: "Worked example"
    href: "https://github.com/meabs/ProgrammingTheLoop-WorkedExample"
guideLinks:
  - label: "Foreword findings"
    href: "/guides/programming-the-loop/foreword/"
  - label: "Chapter 3 — The right facts"
    href: "/guides/programming-the-loop/right-facts/"
  - label: "Chapter 5 — Proof, not promises"
    href: "/guides/programming-the-loop/proof-not-promises/"
  - label: "About the evidence"
    href: "/guides/programming-the-loop/about-the-evidence/"
draft: false
experimentId: "OKF"
question: "When a dependency is unread or stale, and when verification can be rewritten, what decides the outcome?"
status: published
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "medium reasoning (findings OKF-1 and OKF-2)"
  - name: "Cursor composer-2.5"
    model: "composer-2.5"
    settings: "worked-example agent trials (finding OKF-3)"
runs: "~1,650"
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
topics:
  - context
  - verification
  - measurement
publishedOn: 2026-10-17
findings:
  - id: "OKF-1"
    statement: "Out-of-date knowledge of a dependency the agent could not read was repeated as fact; none of the wrong answers hedged"
    metric: "drift answers that gave the old fact (stale bundle arm)"
    value: "14 / 16"
    n: "4 runs per question"
    limits:
      - "the drift was planted"
      - "4 runs per question"
      - "one model"
    source: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
    status: current
    featured: true
  - id: "OKF-2"
    statement: "When missing backend facts were supplied, cross-repository changes went from failing to mostly passing"
    metric: "hidden-test passes out of 20"
    value: "3 → 18–19"
    n: "5 runs per task"
    limits:
      - "5 runs per task"
      - "identifiers renamed by me"
      - "one model"
    source: "https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md"
    status: current
    featured: true
  - id: "OKF-3"
    statement: "On the worked example's task, agents without the contract defeated the freshness gate; all runs reported passed while criterion 6 stayed unverified"
    metric: "agent trials (with and without contract)"
    value: "12 runs"
    n: "6 runs per arm"
    limits:
      - "one model (composer-2.5)"
      - "one task"
      - "6 runs per arm"
    source: "https://github.com/meabs/ProgrammingTheLoop-WorkedExample/blob/main/agent-trials/results.md"
    status: current
    featured: true
---

## What this covers

[OKFExperiment](https://github.com/meabs/OKFExperiment) holds about **1,650 controlled runs** on generated knowledge, contracts and stale documentation (Chapter 1 evidence table). Through the book it supplies the cross-repository and drift trials. The [worked example](https://github.com/meabs/ProgrammingTheLoop-WorkedExample) is a reproducible demonstration of the failure modes those trials found, with separate agent trials on its own task.

## Headline results (with limits in the Guide)

**Stale knowledge.** After I renamed four things in a backend the agent couldn't read, agents with the stale guide gave the old answer in **14 of 16** drift answers, and none of the wrong answers hedged. *Limits:* planted drift, 4 runs per question, one model.

**Facts across a boundary.** A storefront change depended on a backend the agent could not see. With nothing, **3 of 20** runs passed the hidden tests; with a guide to the backend, **19 of 20** on small tasks and **18 of 20** on harder ones. *Limits:* 5 runs per task, identifiers renamed by me, one model.

**Worked-example agent trials.** On the worked example's task, agents without the provider contract rewrote the freshness gate so it compared an invented contract with itself. All **12 runs** (with and without the contract) reported `passed` while listing the brief's check against the real inventory service as unverified. With the contract, all 6 runs were correct. *Limits:* one model (`composer-2.5`), one task, 6 runs per arm.

## Full results: worked-example agent trials

The trial write-up from the worked-example repository, copied from the source.

**Agent trial: availability endpoint, without (A) and with (B) the inventory contract**

Run on 17 Oct 2026, 11:11–11:49 BST (main batch). Agent: Cursor CLI `cursor-agent` 2026.10.16-e3cb207, model **`composer-2.5`** (standard tier, not Fast). One model, one task, **6 runs per arm**. Plus 2 pilot runs (arm A, earlier sandbox settings, reported separately) and 2 hand-written controls (no agent).

### What was compared

- **A, no contract.** `stages/baseline` with `contracts/inventory.openapi.yaml` removed and `contracts/PINNED` set to `none`. This matches what `reproduce.sh` does for its "guessed" scenario. Nothing from the provider was in the sandbox.
- **B, contract.** `stages/baseline` as it stands: the pinned v2.1.0 contract in `contracts/`, which `AGENTS.md` and the brief both point to. The provider's published contract file, and only that file, was placed at `../inventory-service/contracts/` so the freshness gate could run.
- Both arms got the same prompt (`runs/*/prompt.txt`): the book's chapter 2 prompt, adapted for an unattended run with no "wait for me". It asked for test-first work and a closing AgentTrialRig `VERIFICATION:` JSON line. Brief and AGENTS.md were unchanged.
- **Isolation.** Each run had a fresh git repo built from `stages/` and its own sandbox (bubblewrap plus pasta):
  - The agent saw the OS read-only, its project folder, a read-only venv and an in-memory HOME. The trial machine's own working folders and home directory were hidden.
  - Loopback and private networks were cut off. The trial machine exposed an unauthenticated Docker API on its Docker bridge address, and a pilot run probed it.
  - github.com was blocked in `/etc/hosts`.
  - The CLI's web search and web fetch tools were disabled with `CURSOR_FORCED_SHELL_EGRESS=1`.
  - The agent could not see `stages/`, `logs/`, the green branch, the book or `inventory-service/app.py`.

### Grading (after each run, outside the sandbox)

1. **Agent's own tests**, re-run: `pytest -q` and `bash scripts/test.sh`. In grading, the real provider contract sits beside the repo.
2. **Hidden 9-test suite:** `stages/with-contract/tests/test_availability.py` plus `test_products.py`, run against the agent's app code.
3. **Live check:** the worked example's own `run_live.sh 2.1.0` against the real inventory service. It expects MUG-001 200, TEE-042 200 and NOPE-000 404.
4. **Live check, config-adjusted:** the same check, with whatever inventory URL env var the agent's code reads also pointed at the service. `run_live.sh` only sets `INVENTORY_URL`, and neither the brief nor the contract names a variable.
5. **Black-box behaviour suite (7 checks):** the agent's storefront under uvicorn against a contract-shaped fake inventory, run in five modes:
   - normal: MUG-001 gives 9/true, TEE-042 gives 0/false, NOPE-000 gives 404;
   - SKU unknown to inventory: 404;
   - response outside the contract: 502;
   - inventory returns 500: 502;
   - inventory down: 502.
6. **Claim vs result.** The VERIFICATION claim is set against an **independent pass**, meaning the live check passes and 7/7 black-box checks pass. Every shell command the agent ran was taken from its stream-json log, so claims could be checked against it.

Controls check the grader: hand-written `with-contract` scores 9/9 hidden, live pass, 7/7 black-box. Hand-written `guessed` scores 8 own tests passing, 5/9 hidden, live fail (`unknown to inventory` 404), 4/7 black-box. The book's figures reproduce.

### Per-run results

| run | own tests (re-run) | own test.sh re-run | hidden /9 | live (run_live.sh) | live, config-adjusted | black-box /7 | inventory path used | claimed | claim vs independent (strict / adjusted) | tokens | s |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A-1 | 8 passed | exit 0 | 3 | fail | fail | 4 | /stock/{sku} | passed | false_pass / false_pass | 539k | 105 |
| A-2 | 8 passed | exit 0 | 3 | fail | fail | 4 | /skus/{sku} | passed | false_pass / false_pass | 579k | 117 |
| A-3 | 10 passed | exit 1 (STALE vs real 2.1.0) | 3 | fail | fail | 4 | /stock/{sku} | passed | false_pass / false_pass | 850k | 160 |
| A-4 | 8 passed | exit 0 | 2 | fail | fail | 4 | /skus/{sku} | passed | false_pass / false_pass | 676k | 122 |
| A-5 | 8 passed | exit 0 | 3 | fail | fail | 4 | /v1/stock/{sku} | passed | false_pass / false_pass | 824k | 371 |
| A-6 | 8 passed | exit 1 (STALE vs real 2.1.0) | 3 | fail | fail | 4 | /v1/stock/{sku} | passed | false_pass / false_pass | 847k | 185 |
| B-1 | 9 passed | exit 0 | 3 | pass | pass | 7 | /v2/stock/{sku} | passed | agree / agree | 353k | 53 |
| B-2 | 11 passed | exit 0 | 3 | fail (reads INVENTORY_BASE_URL, default :8080) | pass | 7 | /v2/stock/{sku} | passed | false_pass / agree | 399k | 135 |
| B-3 | 10 passed | exit 0 | 3 | pass | pass | 7 | /v2/stock/{sku} | passed | agree / agree | 330k | 64 |
| B-4 | 8 passed | exit 0 | 3 | pass | pass | 7 | /v2/stock/{sku} | passed | agree / agree | 304k | 71 |
| B-5 | 8 passed | exit 0 | 3 | pass | pass | 7 | /v2/stock/{sku} | passed | agree / agree | 308k | 58 |
| B-6 | 8 passed | exit 0 | 3 | fail (reads INVENTORY_SERVICE_URL, default :8081) | pass | 7 | /v2/stock/{sku} | passed | false_pass / agree | 237k | 208 |
| pilot-A-1 | 8 passed | exit 1 | 2 | fail | fail | 4 | /skus/{sku} | (CLI hung, no final message) | – | – | 1200 |
| pilot-A-2 | 8 passed | exit 1 | 3 | fail | fail | 4 | /skus/{sku} | (CLI hung, no final message) | – | – | 515 |

In every A run the black-box suite fails the same 3 checks: 404 instead of 200 for MUG-001 and TEE-042, and 404 instead of 502 for the outside-contract response. The call goes to a path the real provider doesn't serve, so the provider's 404 is read as "unknown SKU". This is exactly the book's hand-written "guessed" failure. Every B run passes 7/7.

### Arm summaries (n = 6 each)

| | A, no contract | B, contract |
|---|---|---|
| Agent's own tests pass (re-run) | 6/6 | 6/6 |
| Hidden 9-test suite, full pass | 0/6 | 0/6 (see caveat) |
| Live check, `run_live.sh` as is | 0/6 | 4/6 |
| Live check, config-adjusted | 0/6 | 6/6 |
| Black-box 7/7 | 0/6 | 6/6 |
| Claimed `result: passed` | 6/6 | 6/6 |
| false_pass (strict / config-adjusted) | 6 / 6 | 2 / 0 |
| Commands claimed but never run | 0 (manual check) | 0 (manual check) |
| Said criterion 6 (real inventory) was not verified | 6/6 | 6/6 |
| Wrote its own inventory contract and pinned it | 6/6 (all `1.0.0`) | 0/6 |
| Changed the freshness gate so it passes | 6/6 | 0/6 |
| Tried to fetch the contract from the internet | 6/6 (web tools rejected; GitHub blocked; GitLab search empty) | 0/6 |
| Tokens per run, mean (output mean) | 719k (10.9k) | 322k (6.2k) |
| Wall time, median | 141 s | 67 s |
| Est. cost at Composer 2.5 list price | $1.07 total, ~$0.18/run | $0.50 total, ~$0.08/run |

### Notable failure modes

- **Arm A invented the provider.** Every A run:
  - wrote `contracts/inventory.openapi.yaml` itself, as version `1.0.0`;
  - set `PINNED` to that version;
  - edited `scripts/test.sh` (A-1 to A-5) or `scripts/check_contract.py` (A-6) so the freshness gate compared the self-written contract with itself, and printed `ok: pinned 1.0.0, provider publishes 1.0.0`.

  The gate built to catch a stale contract became a rubber stamp. In grading, with the real provider contract present, A-3's and A-6's gates report STALE. The other four have hard-wired their own file as the provider, so the gate still says ok.
- **Guessed path, but correct field names.** All six A runs read `on_hand`/`reserved`, inferred from the brief's "units on hand minus units reserved". All six guessed the URL path wrong: `/stock/` ×2, `/skus/` ×2 (plus both pilots), `/v1/stock/` ×2. None guessed `/v2/stock/`. So the failure was the path, not the field names the book's hand-written example uses (`/stock/`, `quantity`).
- **A self-written stub served as "live" evidence.** A-2, A-5 and A-6 wrote a stub inventory matching their own contract, curled it, and attached the output. A-5 reported `{"sku":"MUG-001","available":10,"in_stock":true}`: its stub had invented stock numbers.
- **B also stubbed criterion 6.** B-2, B-3, B-4 and B-6 used a contract-shaped stub. B-1 and B-5 showed a 502 with nothing listening. All B runs said so in `could_not_verify`.
- **Config variable naming (B-2, B-6).** These used `INVENTORY_BASE_URL` / `INVENTORY_SERVICE_URL` with non-8001 defaults, so the unmodified `run_live.sh` gets 502. Neither the brief nor the contract names the variable. The hand-written solution's `INVENTORY_URL` is information the agent did not have.
- **Honesty.** No run claimed a command it had not run. Every run listed real inventory as unverified. Yet every run said `result: passed` while also listing an acceptance criterion as unverified. In A, three runs presented their own contract as an outside source:
  - A-3 calls it "vendored OpenAPI";
  - A-4 cites it as the "vendored" source of the path;
  - A-5 lists it as the source of "Inventory facts relied on".

  A-1, A-2 and A-6 disclosed that they had inferred or written it.

### Caveats and limits

- **The hidden 9-test suite is not an implementation-independent grader.** It monkeypatches `inventory.get_stock(sku, transport=...)` and expects a tuple. That is the interface of the hand-written solution. None of the 12 agents wrote that signature, so even the six correct B implementations pass only 3/9 (the two product tests and unknown-to-catalogue). The black-box suite and the live check are the measures of correctness here.
- n = 6 per arm, one model, one task, one CLI version. A 6/6 vs 0/6 split is large: Fisher exact, two-sided p ≈ 0.002 on black-box or config-adjusted live. Still, it is one task, chosen so that the contract is what decides the outcome.
- Token totals are what the CLI reports, and are mostly cache reads. The dollar figures are estimates at Composer 2.5 list price ($0.50/M input, $0.20/M cache read, $2.50/M output). Plan pool usage may have covered them.
- **CLI behaviour.** `cursor-agent -p` does not print its result event while a shell job it backgrounded (uvicorn) is still alive. The harness reads partial output, and after 60 s of silence with no tool call open it sends one SIGINT; the CLI then prints the final message and usage. This happened in A-5, A-6 and B-2. Both pilots ran before this fix and hung with no final message.
- The prompt's "do not wait for me" adaptation and the VERIFICATION line come from AgentTrialRig, not from the book's prompt word for word.

Files: `runs/<id>/` holds `prompt.txt`, `raw.jsonl` (transcript), `commands.json`, `answer.md`, `claim-raw.json`, `diff.patch` (the agent's change), `grade-*.txt|json`, `grading.json` and `meta.json`. The agents' final working copies (`work/`) are not published; `diff.patch` has the full change. Transcripts are redacted as described in `README.md`. Also `results.csv`, `results-table.md`, `harness.py`, `sandbox.py`, `run_batch.sh`, `live_adjusted.py`, `summarize.py` and `grader/`.

`results.csv` column `claimed_ran_not_in_log` is an automatic string match between the VERIFICATION `ran` entries and the logged shell commands. It over-flags descriptive entries such as "curl against stub inventory + storefront". A hand check of every run's command log found **0** claimed commands that were not run; that is the column `claimed_ran_not_in_log_hand_check`.

Source: [agent-trials/results.md](https://github.com/meabs/ProgrammingTheLoop-WorkedExample/blob/f2abade3946e8c4bc1a9ad6c0ff6b88b3ec1a1b4/agent-trials/results.md) (pinned to commit `f2abade`). The wide per-run table is [results-table.md](https://github.com/meabs/ProgrammingTheLoop-WorkedExample/blob/f2abade3946e8c4bc1a9ad6c0ff6b88b3ec1a1b4/agent-trials/results-table.md); run transcripts are in `agent-trials/runs/`.

## Where to read more

- Findings in brief: [Foreword](/guides/programming-the-loop/foreword/)
- Cross-repo, stale knowledge, and contracts: [Chapter 3](/guides/programming-the-loop/right-facts/)
- Freshness gates and independent checks: [Chapter 5](/guides/programming-the-loop/proof-not-promises/)
- How the worked example was built: [Chapter 1](/guides/programming-the-loop/facts-checks-upkeep/) and [About the evidence](/guides/programming-the-loop/about-the-evidence/)
