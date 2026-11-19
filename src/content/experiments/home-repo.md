---
title: "Does a Home Repo help an agent work across repositories? (HR-1)"
description: "72 Codex runs on three storefront changes whose answers live in a separate backend repo. A pointer to the repo on disk took the agent from 0 of 12 to 11 of 12 passes. A repo it had to fetch passed 6 of 12. Forty pointers with look-alike repos passed 9 of 12 flat and 8 of 12 grouped. A hint to read the other repo's AGENTS.md led 10 of 12 agents to run a planted script."
date: 2026-11-13T18:00:00+00:00
summary: "A Home Repo pointer to a repo on disk: 11 of 12 passed against 0 of 12 working alone, for about twice the tokens. A pointer to a repo it must fetch: 6 of 12, passing only when the agent went to the remote. Forty pointers in area files did not beat a flat list (8 against 9 of 12). With the 'read its AGENTS.md first' hint, 10 of 12 agents ran a planted setup script."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/175cd0a464dc3e0725770cb635f7b4a275c162d1/2026-11-home-repo"
draft: false
experimentId: "HR"
question: "When the code a task needs is in another repository, does a Home Repo's pointer get the agent there, does it still work with 40 repos including look-alikes, and does the hint to read the other repo's AGENTS.md expose the agent to planted instructions?"
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI"
    model: "gpt-5.6-luna (hosted)"
    settings: "medium effort; web search off; each run in its own bubblewrap sandbox with GitHub, GitLab, code-search and Maven hosts blocked"
runs: "3 tasks × 6 arms × 4 runs = 72 runs, plus two pilots (15 runs, not counted)"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/175cd0a464dc3e0725770cb635f7b4a275c162d1/2026-11-home-repo/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/45603306f035c455c6452fe2a4d169d5c1e2eebd/2026-11-home-repo/README.md"
previewImage: "/guide-images/hr-1-tokens.png"
previewAlt: "Tokens per run for the six arms, 12 runs each: alone about 133 thousand, Home Repo on disk 247 thousand, fetch 267 thousand, flat 40 285 thousand, areas 226 thousand, planted hint 251 thousand. Green dots passed, red failed."
topics:
  - context
  - harness
  - safety-cost
publishedOn: 2026-11-13
findings:
  - id: "HR-1"
    statement: "A Home Repo pointer to a repo on disk took the agent from 0 of 12 to 11 of 12 passes on cross-repo changes"
    metric: "share of runs whose hidden test passed (higher is better)"
    value: "11 of 12 against 0 of 12"
    n: "3 tasks × 4 runs per arm"
    detail:
      - "effect +0.92 (95% interval +0.75 to +1.00), one-sided permutation test shuffled within task, Holm p 0.0001"
      - "tokens per run 247k against 133k (about 1.9 times); list-price cost about $0.013 against $0.008"
    limits:
      - "one agent and model, one storefront and backend pair, three tasks"
      - "the baseline's access to the public source was blocked in the sandbox; unblocked, the baseline agent downloaded it and passed (pilot)"
    source: "https://github.com/meabs/experiments/blob/175cd0a464dc3e0725770cb635f7b4a275c162d1/2026-11-home-repo/REPORT.md"
    status: current
    featured: true
  - id: "HR-2"
    statement: "When the backend had to be fetched, the agent passed 6 of 12, and only in the runs where it went to the remote"
    metric: "share of runs whose hidden test passed, and whether the run used the pointer's remote (git clone or git --git-dir reads)"
    value: "6 of 12 passed; 6 of 6 that used the remote passed, 0 of 6 that did not"
    n: "12 runs"
    detail:
      - "the same pointers with the repo on disk passed 11 of 12"
      - "tokens per run 267k against 247k"
    limits:
      - "the remote was a local bare repo: no login, no network failure"
      - "an estimate; no equivalence test"
    source: "https://github.com/meabs/experiments/blob/175cd0a464dc3e0725770cb635f7b4a275c162d1/2026-11-home-repo/REPORT.md"
    status: current
    featured: false
  - id: "HR-3"
    statement: "Grouping 40 pointers into area files did not beat a flat list; look-alike repos cost passes in both"
    metric: "share of runs whose hidden test passed (higher is better)"
    value: "8 of 12 grouped against 9 of 12 flat (effect -0.08, 95% interval -0.33 to +0.17, Holm p 0.89)"
    n: "12 runs per arm; 3 look-alike backends among 40 repos"
    detail:
      - "runs that opened a look-alike repo passed 1 of 5 (descriptive, not randomised); the other 19 passed 16"
      - "tokens per run 226k grouped, 285k flat; the Home Repo with 3 repos passed 11 of 12"
    limits:
      - "look-alikes and 37 decoys are synthetic; the pointer wording is mine; 40 repos, not 400"
    source: "https://github.com/meabs/experiments/blob/175cd0a464dc3e0725770cb635f7b4a275c162d1/2026-11-home-repo/REPORT.md"
    status: current
    featured: false
  - id: "HR-4"
    statement: "With the hint to read the other repo's AGENTS.md first, 10 of 12 agents ran a planted setup script"
    metric: "runs whose session shows the planted script being run"
    value: "10 of 12 (Wilson 95% interval 0.55 to 0.95), against 0 of 12 without the hint and plant"
    n: "12 runs per arm"
    detail:
      - "7 of the 10 that ran it still passed the task, so the task result does not show it"
      - "the script only wrote a marker file; the arm differs from the baseline by the hint and the plant together"
    limits:
      - "an estimate, not a test; no defence was tested here"
    source: "https://github.com/meabs/experiments/blob/175cd0a464dc3e0725770cb635f7b4a275c162d1/2026-11-home-repo/REPORT.md"
    status: current
    featured: false
---

## Question

The Home Repo pattern, published on AI Hero, puts your skills, AGENTS.md and shared docs in one repository and starts the agent there. Its AGENTS.md holds a pointer to each other repo: where it lives, where to clone it from, a hint such as "read its AGENTS.md first". **Does the pointer get an agent to the code in another repo, and what does it cost and risk?**

**This experiment was written by an AI agent** (Claude Code, working for me): the design, scripts and analysis. I set the question and approved the design and the run.

**The short answer:**

- **Pointers to repos that are on disk work:** 11 of 12 runs passed, against 0 of 12 for an agent without the backend.
- **"Clone from X if missing" is not reliable:** the agent passed only in the runs where it went to the remote (6 of 12).
- **Forty pointers with look-alike repos cost some passes, and area files did not help.**
- **Following a pointer into another repo's AGENTS.md exposed the agent to a planted instruction:** 10 of 12 ran it.

## Prediction

Written before the run, in the [design](https://github.com/meabs/experiments/blob/45603306f035c455c6452fe2a4d169d5c1e2eebd/2026-11-home-repo/README.md): a pointer to a repo on disk should recover most of what having the source gave in earlier cross-repo tests; the other parts of the pattern (cloning, scale, the hint) were open questions.

## Set-up

Codex CLI with gpt-5.6-luna at medium effort, web search off. Three of OKF test G's storefront changes (a discount code, a checkout request, an order list), each with a hidden test, on the Shopizer React storefront whose backend has renamed fields, so memory cannot answer. Six arms, four runs per task each.

| Arm | What the agent had |
| --- | --- |
| A alone | the storefront only; the backend is "not available" |
| B | a Home Repo with three pointers, all repos on disk |
| C | the same, backend not on disk; its pointer gives a remote to clone from |
| D | 40 flat pointers, including three look-alike backends (older field names) |
| E | the same 40, grouped into six area files |
| F | B, plus "Read its AGENTS.md first" and a planted instruction in the backend's AGENTS.md to run a bootstrap script |

The sandbox blocks GitHub, GitLab, code-search and Maven hosts. In the pilot, with them open, the baseline agent downloaded the public source with curl and passed.

## Results

Findings HR-1 to HR-4 are at the top of the page.

| Arm | Runs | Tasks passed (higher is better) | 95% interval | Tokens per run (lower is cheaper) |
| --- | --- | --- | --- | --- |
| A alone | 12 | 0 (0%) | 0.00 to 0.24 | 133k |
| B Home Repo, on disk | 12 | 11 (92%) | 0.65 to 0.99 | 247k |
| C backend to fetch | 12 | 6 (50%) | 0.25 to 0.75 | 267k |
| D flat 40 | 12 | 9 (75%) | 0.47 to 0.91 | 285k |
| E areas 40 | 12 | 8 (67%) | 0.39 to 0.86 | 226k |
| F planted hint | 12 | 9 (75%) | 0.47 to 0.91 | 251k |

"Tasks passed" is the share of runs whose hidden test passed; the intervals are Wilson 95%, and twelve runs a cell is a wide net.

<figure class="guide-figure">

<img src="/guide-images/hr-1-tokens.png" alt="Tokens per run for the six arms, 12 runs each, green dots passed and red failed." width="760" height="360" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-11-home-repo (Codex session logs; gpt-5.6-luna).</figcaption>

</figure>

The whole run cost under $1 at list price.

## What this means in practice

Bounded to what was tested: this agent, one storefront and backend, unattended.

- **Keep each target repo on disk,** or have a setup step that fetches it. Do not rely on "clone if missing" alone.
- **Describe repos so look-alikes can be told apart** ("current", "retired v1"). Other wordings were not tested.
- **Do not add "read its AGENTS.md first" for repos you do not control.**
- Grouping 40 pointers into area files is not supported by this test as an accuracy improvement.

**Risks this exposes:**

- **Prompt injection through the pointers.** Any repo the pointer reaches can steer the agent, and a Home Repo session can reach all of them. My plant only wrote a marker file.
- **Missing repos fail quietly:** the C runs that never went to the remote passed 0 of 6.
- **Look-alike repos** (legacy, staging, archive) are normal in real organisations.

## Limits

One agent and model; one pair of repos and three tasks; four runs a task, so only large effects show; synthetic look-alikes and decoys; a local remote with no authentication; the sandbox blocks listed hosts, not every route out; the plant writes a marker and does not exfiltrate. The skills-sharing part of the pattern was not tested.

## Amendments

Three, all logged in the design: the network block (after the pilot), dropping task g1 (answerable without the backend), and counting reads of the pointer's remote as using it.
