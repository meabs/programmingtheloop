---
title: "3. The right facts, not every fact"
description: "From Programming the Loop — 3. The right facts, not every fact."
---

<p class="guide-edition-note">Free to read on the web. <a href="/downloads/">October 2026 PDF</a> · <a href="/updates/">Updates</a></p>

An agent working in a repository it can read should mostly be left to read it. Adding generated guides, graphs and long instruction files on top tends to add cost without adding correctness. An agent working across a boundary it *can't* see needs facts, and those facts decide whether it succeeds. The best way to supply them is usually the smallest, most authoritative thing that will do: a versioned contract, then a short owned note. And whatever you supply must be checked for freshness *outside* the knowledge itself, because stale facts are repeated confidently. That is the position. This chapter is where my own experiments say the most about it, for and against, and it's the one to read if you read only one.

## What "context" means here

It's tempting to say everything an agent knows is in its context window. That isn't quite right, and the difference matters for what follows. An agent draws on three things:

- **Learned knowledge** in the model itself: languages, frameworks, popular open-source code, common conventions. Broad, but frozen at training time and silent about *your* system.
- **External state** it can reach with tools: the files in the repository, the output of commands, a search index, a code graph, notes it wrote earlier in a file. This persists between sessions, but only matters when the agent fetches it.
- **The context window**: the currently available, task-specific working context. Your prompt, the instruction files loaded at the start, the files it has opened and the output of the commands it has run. When the session ends it's gone; when it fills, older material is dropped or summarised.

Andrej Karpathy's comparison is apt: “context windows are really kind of like working memory” (Andrej Karpathy, [“Software Is Changing (Again)”, YC AI Startup School keynote](https://www.ycombinator.com/library/MW-andrej-karpathy-software-is-changing-again)). The design question is which facts belong in working memory for *this* task, which should stay in external state to be fetched when needed, and which the model already has. My experiments are about getting that split right. The renaming I did in several of them is there to stop the agent answering from what it already learned about a famous public project.

**Terms used in this chapter.** *`AGENTS.md`*: the instruction file many agents read at the start of a session. *Skill*: a small, task-scoped instruction file (`SKILL.md`) opened only when a task needs it. *Guide*: a generated folder of markdown reference pages, one per module or package, each fact citing a file and line; the format is OKF (Open Knowledge Format), which calls it a *bundle*. *Code graph*: a queryable index of who-calls-whom, generated from source. *API contract*: a machine-readable interface description, such as an OpenAPI file.

## When the agent can read the code

Experiment J asked the question most teams adopting agents are implicitly answering: does a repository *set up for agents* do better than the same repository left as it is? Here is what was compared, on a 1,173-file Java backend.

#### Plain arm

```text
shopizer/
├── sm-core/, sm-core-modules/, sm-shop/, …   source, unchanged
└── (no AGENTS.md, no guide, no graph, no skills)
```

#### Optimised arm

```text
shopizer/
├── AGENTS.md                      points to all of the below, lists kg commands,
│                                  says "read the source to confirm before you rely on it"
├── okf/index.md, okf/…            generated guide: one file per package, file-and-line citations
├── .agent-knowledge/bin/kg        code graph: kg callers, kg impact, kg subclasses, kg path
├── .agents/skills/
│   ├── navigate-the-repo/SKILL.md
│   ├── change-the-code/SKILL.md
│   └── check-your-work/SKILL.md
└── sm-core/, sm-core-modules/, sm-shop/, …   source, unchanged
```

The `AGENTS.md` and skills are published in the repository ([fixtures/operating-skills](https://github.com/meabs/OKFExperiment/tree/main/fixtures/operating-skills)). It starts (abridged: the first paragraph only, lines re-wrapped for readability):

```markdown
# Working in this repository

This repository is large and has many repeated names. Knowledge for it is in three
places. It was generated or written to help you work here, so use it, then confirm
in the source before you rely on it.
```

> **Case study: the agent-optimised repository (experiment J).** 112 runs: four mechanical changes (including a rename touching 105 sites in 58 files) and three structure questions, 8 runs per task per arm, Codex with isolation on. The set-up was used: the agent ran `kg` and opened the guide in all 56 optimised runs and read the navigation skill in 55. Changes passed 28 of 32 (plain) against 29 of 32 (optimised), p = 1.0; questions 16 of 24 against 19 of 24, p = 0.52. Neither difference is reliable. Tokens: **1.48 times** the plain arm's (bootstrap interval 1.38 to 1.60), where each run's tokens are divided by the plain arm's mean for the same task and those ratios are averaged, so each task counts equally. The per-task ratios ran from 1.20 (j3) to 1.90 (j4). The simple ratio of mean tokens per run, 401k against 297k, is **1.35**: lower, because the rename across 58 files dominated the totals (1,046k and 1,278k tokens a run) and had one of the smallest ratios, 1.22. Either way the set-up was reliably dearer. The optimised runs took more turns (8.8 against 5.9), because the agent read the instructions, the guide and the graph output, *and then still searched and read the source*. Source: [results/J-optimised-repo.md](https://github.com/meabs/OKFExperiment/blob/main/results/J-optimised-repo.md), [docs/EXPERIMENT_J.md](https://github.com/meabs/OKFExperiment/blob/main/docs/EXPERIMENT_J.md).
>
> *Limits.* In a large, readable codebase, the full set-up was reliably dearer and not reliably better. The study does not say which of the four ingredients mattered (they were tested together, deliberately), or anything about other repositories, models or kinds of task. The plain arm was already strong: 44 of 56.

<figure class="guide-figure">

![Tokens per run by task, plain repository against the same repository set up for agents (guide,…](/guide-images/chart-j-tokens.png)

<figcaption>Figure 3.1. Tokens per run by task, plain repository against the same repository set up for agents (guide, code graph, skills and AGENTS.md), Codex, 8 runs per arm per task. Chart generated from the tables in OKFExperiment results/J-optimised-repo.md; pass counts are shown under each task (j7 as re-scored in that file).</figcaption>

</figure>

A smaller library said the same thing earlier. On Click, agents answered 14 or 15 of 15 questions and made 8 or 9 of 9 changes correctly *with or without* a guide; the default guide cost 1.30 times the tokens in one run and 1.07 in a rerun, and the thinnest guide (names only) was reliably the dearest, 1.26 to 1.42 times ([docs/RESULTS.md, section A](https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md)).

### The documentation layout itself

A separate study compared documentation *layouts* on six copies of one FastAPI and React application. It is my own unpublished document, so its evidence is **lower grade** than the rest of this chapter: you can't check its numbers against a public repository, only its trial set-up. I use it for the *shape* of a layer, and nothing in this chapter rests on it alone. Two of its designs make a useful before and after: a heavy layout that loads everything up front, and a lean layout the study recommends.

<div class="design-compare" role="group" aria-label="Heavy design against lean design">

<div class="design-compare-panel">

<strong class="design-compare-label">Heavy design</strong>

<p>A long, always-read <code>AGENTS.md</code>, a separate tree of “why we built it this way” decision records, and OKF reference pages, with prompts telling the agent to read all of it.</p>

</div>

<div class="design-compare-panel is-recommended">

<strong class="design-compare-label">Lean design <span class="design-compare-note">(the one the study recommends)</span></strong>

<p>A tiny index, task-scoped skills opened only when needed, and reference pages with the “why” folded into the relevant concept:</p>

```text
repo-agent-recommended/
├── README.md                  unchanged human entry point
├── AGENTS.md                  19 lines: an index; no procedures, no rationale
├── docs/api/openapi.json      generated, machine-checkable
├── okf/                       reference pages, "why" folded into the relevant concept
└── .agents/skills/            one procedure per task family, opened when needed
    ├── model-field-change/  write-migration/  add-api-endpoint/
    └── regenerate-frontend-client/  add-ui-action/  verify-work/
```

</div>

</div>

> **Case study: the documentation-layer study (lower-grade evidence: author's unpublished document).** Four independent rounds per design and task; cost from the provider transcript. The heavy design was **dearer on the simple change in all four rounds**: +40.3% tokens, +28.7% cost. With prompts that never mentioned any of the documentation, the lean design was discovered and the task-relevant skills opened in **24 of 24** measured cells. Over eight rounds, the lean design was cheaper than the baseline in 7 of 8 rounds on both change tasks (two-sided binomial p = 0.07): suggestive, not confirmed. Recreated on five other open-source repositories, one run per cell, comprehension was cheaper in four of five, but code-change cost moved both ways (+86.4% to −64.3% tokens in individual cells), and **three of the five generated documentation layers contained a task-relevant factual error**. *Source: "Agent-ready repository design: documentation-layer study", author's unpublished document; the numbers can't be independently checked. The trial set-up is published as [AgentTrialRig, examples/fastapi-doc-layers](https://github.com/meabs/AgentTrialRig/blob/main/examples/fastapi-doc-layers/README.md).* Heavy always-loaded context has a measurable cost, then, and agents find a tiny index plus task-scoped skills without prompting. That falls short of showing the lean layout always saves money: the heavy design was also run with prescriptive prompts, so prompt and layout are confounded there, and the external cells are single runs.

The study calls the pattern **gradual disclosure**: load a small index first, fetch task-specific context only when the task needs it.

### Two studies that seem to disagree

The documentation-layer study ended by recommending a lean `AGENTS.md`, task-scoped skills and OKF reference pages, on a repository the agent could read. Experiment J found that a full knowledge layer, OKF guide included, made a readable repository dearer without making it more correct. Both are true, because they answer different questions.

- **The doc-layer study (lower-grade: author's unpublished document) asked how to lay knowledge out,** given that you have some: which of six arrangements cost least, and whether agents found the right parts unprompted. Its comparisons were between layouts, and against a baseline with no layer, on cost and discovery. Its strongest result is about shape: heavy always-loaded context cost more (+40.3% in every round) and a tiny index with task-scoped skills was found 24 of 24 times. Its cost saving for the lean layout was suggestive at best (7 of 8 rounds, p = 0.07) and repository-dependent elsewhere, and its own report treats the comprehension saving as an upper bound, because some pages stated answers to the evaluation questions almost verbatim.
- **Experiment J asked whether the knowledge was needed at all,** on a large repository whose source the agent could read. Its layer also differed: a code graph and three general operating skills on top of the guide, not task-scoped skills with rationale folded in. The answer was no reliable correctness gain for 35% to 48% more tokens. J is published and checkable; the layout study is not, so where they pull in different directions, this book follows J.

So **optimising the layout of knowledge is a different question from whether the knowledge was needed.** A well-shaped layer can be cheaper than a badly shaped one and still cost more than no layer on a repository the agent can read. Neither study showed a correctness gain from documentation on readable code, and both found its failure modes: in the external repositories, three of five generated layers contained a task-relevant factual error, and one layer's omissions caused two first-attempt verification failures that the plain baseline avoided. The book therefore takes J's position: on a repository the agent can read, don't add a reference layer (OKF pages included) by default. If you do add one, for facts the code can't show (a load-bearing reason, a cross-boundary rule), keep it lean. The lean shape is the one the layout study favoured, which is lower-grade evidence; the published results only show that context the agent didn't need still cost tokens (J, and Click above), which is a reason to keep whatever you add small. Whether to add one at all is the question the next sections, and your own measurement, have to answer.

## When the agent can't read a dependency

Most real changes cross a boundary: another team's API, a private library, code that isn't in the workspace at all. Here the picture flips.

> **Case study: the dependency the agent can't read.** The working repository was a real React storefront; its Java backend was **not available** to the agent, and I renamed the identifiers that mattered so it couldn't answer from learned knowledge of the public project. On questions tracing a storefront call to the backend, agents with nothing answered **1 of 24** correctly, at an average of about 785k tokens per question spent searching and then giving up ([docs/RESULTS.md, D1](https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md)). On cross-repository change tasks graded by hidden tests, agents with nothing passed **3 of 20**; with a guide to the backend, **19 of 20** (small tasks) and **18 of 20** (harder tasks), level with an agent given the backend's real source (18 of 20) (sections F and G). The three passes with nothing were all on a task whose answer was a guessable common word; where the name wasn't guessable, agents with nothing passed 0 of 30 across F and G. Without the facts, agents guess, and mostly guess wrong. Whether a full generated guide is the best way to supply those facts is a separate question, and the next box tests it.

> **Case study: what kind of facts? (experiment H)** The harder change tasks again, five arms, 16 runs each: nothing, an OpenAPI contract, a hand-written 3 KB note, the generated guide, and the source. All four beat nothing (4 of 16) and didn't differ reliably from each other: contract 13, note 14, guide 14, source 14 of 16. The note was cheapest at about 128k tokens per run, against 192k for the contract, 282k for the guide and 334k for the source ([results/H1-contract-vs-okf-changes.md](https://github.com/meabs/OKFExperiment/blob/main/results/H1-contract-vs-okf-changes.md)). Caveats: I wrote the note knowing the tasks, which favours it, and the contract was generated from the source by a script. For questions about *internal* call structure, only the guide and the source worked, 21 of 24 each, against 8 for the contract and 0 for the note ([results/H2-contract-vs-okf-questions.md](https://github.com/meabs/OKFExperiment/blob/main/results/H2-contract-vs-okf-questions.md)), but that measured answers, not better changes. With 16 runs per arm, gaps under about 30 points can't be separated, so "level" doesn't mean "equivalent".

<figure class="guide-figure">

![Cross-repository change tasks by kind of knowledge supplied, Codex, 16 runs per arm](/guide-images/chart-h1.png)

<figcaption>Figure 3.2. Cross-repository change tasks by kind of knowledge supplied, Codex, 16 runs per arm. Bars show runs passing the hidden tests; labels show mean tokens per run. Chart generated from the trial table in OKFExperiment results/H1-contract-vs-okf-changes.md.</figcaption>

</figure>

## When the knowledge is out of date

If one result belongs on a poster, it's this one.

> **Case study: stale knowledge (experiment D2).** I renamed four things in the backend *after* its guide was generated. Agents with the changed source gave the old answer 0 times in 16. Agents with the stale guide gave the old answer **14 times in 16**; adding "read the source to confirm" or expiry dates on the changed concepts made no difference (16 of 16 each), because there was no source to confirm against. **None of the 46 wrong answers hedged.** Unchanged facts stayed correct (16 of 16 controls in every arm), so the harm was exactly the drifted facts ([docs/RESULTS.md, D2](https://github.com/meabs/OKFExperiment/blob/main/docs/RESULTS.md)). Where the agent *could* read the code, that one sentence, "read the source to confirm before you rely on it", cut stale answers from 8 of 12 to 0 of 12 at the same cost (section B3). Confidence labels, warning banners and the format's own provenance fields did not prevent stale answers. Labels did one useful thing: with an instruction to disclose guesses, agents said they relied on a guess in 6 of 16 answers instead of 0 of 16, though accuracy didn't reliably improve (section E). Stale facts get repeated confidently, and nothing written *inside* the knowledge protects the agent once the source is out of reach. The drift here was planted, so it tells you nothing about how often drift happens in real pipelines.

## What the code graph adds

I also built a code graph, [AgentGraphWorkTree](https://github.com/meabs/AgentGraphWorkTree), which parses source with no language model, writes structural facts into the repository with a file and line for each, and tags each with a confidence level. [Chapter 9](/guides/programming-the-loop/tools-measurement/) covers its accuracy; here is what it did for agents ([docs/EVALUATION.md](https://github.com/meabs/AgentGraphWorkTree/blob/main/docs/EVALUATION.md)):

- **Drift, again.** On a repository whose code had drifted from its generated notes, unlabelled notes misled agents in 8 of 24 runs, against 1 of 108 when the notes carried labels or the trust-the-source instruction (pooled after the fact). There, unlike D2, the agent *could* read the source. The common thread: **an instruction to check the source works only when the source is there to check.**
- **Multi-hop questions.** For "callers of callers", the graph cut tokens sharply: Codex 84k against 196k, Cursor 121k against 414k, Copilot 161k against 181k.
- **Simple lookups.** Level, or up to 80% dearer with the graph. Across 192 runs on Python and TypeScript repositories it did not reduce tokens overall: agents ran `kg` and then checked it with `grep`, just as they checked the guide in experiment J.
- **Very large repositories.** On the Java backend, a separate earlier evaluation (figures carried over, not re-derived) recorded Codex using 398k tokens with the graph against 953k without, with accuracy already at ceiling.

<figure class="guide-figure">

![Tokens per question for multi-level "callers of callers" questions, with and without the code…](/guide-images/chart-kg-callers.png)

<figcaption>Figure 3.3. Tokens per question for multi-level "callers of callers" questions, with and without the code graph, by agent. Chart generated from the `kg callers --depth` row of the token-cost table in AgentGraphWorkTree docs/EVALUATION.md (36 runs across Click and Express); token totals are not comparable between agents.</figcaption>

</figure>

Put that next to experiment J and the answer is to **route by question type**. A graph earns its place for multi-hop structural questions; it costs extra as a general-purpose layer.

## Worked example, stages 2 and 3: discover, then choose the smallest useful context

**Stage 2, discover.** An agent starting in `storefront-api/` sees the seven-line `AGENTS.md` first (real file):

```markdown
# Agent guidance (storefront-api)
Source and tests are authoritative. Read the source to confirm before you rely on any doc.
Run all checks with one command: `bash scripts/test.sh`
Calls to other services go through `app/clients/`. Follow `app/clients/catalogue.py`.
The inventory service is owned by another team and is not in this workspace.
Its contract is pinned in `contracts/` (version in `contracts/PINNED`). Do not edit it.
Report the commands you ran and their real output; say what you could not verify.
```

The repository is small and readable, so the code itself is the context: `app/main.py`, the existing client to copy, the tests. Nothing else is needed for the *storefront* side.

**Stage 3, choose the smallest useful context.** For the *inventory* side, the code isn't available and must not be guessed. The smallest authoritative fact source is the pinned contract (`contracts/inventory.openapi.yaml`, version 2.1.0, 36 lines). The parts that matter (abridged: intermediate keys such as `content: application/json:` and the field types are left out, so this excerpt is not valid OpenAPI on its own):

```yaml
  /v2/stock/{sku}:
    get:
      responses:
        "200":
          schema:
            required: [sku, on_hand, reserved]
          example: {sku: "MUG-001", on_hand: 12, reserved: 3}
        "404":
          schema:
            properties:
              error: {type: string, enum: [unknown_sku]}
```

So the working context for the task is: `AGENTS.md`, the brief, three storefront files and one contract. No guide, no graph, no skills. Whether that's enough is what the tests and the live check in [Chapter 5](/guides/programming-the-loop/proof-not-promises/) are for.

### What changes when the fact is missing

To show the alternative, `reproduce.sh` also builds a branch where the contract isn't available and the client uses names an agent might plausibly guess: `/stock/{sku}` and a `quantity` field. The two lines that differ:

```text
-            r = http.get(f"/v2/stock/{sku}")
+            r = http.get(f"/stock/{sku}")
-        return int(body["on_hand"]), int(body["reserved"])
+        return int(body["quantity"]), int(body.get("reserved", 0))
```

Its own tests, written against its own guessed stub, pass. Then the live check, against the real running inventory service — real script output:

```text
8 passed in 0.27s
$ curl -s -w ' [%{http_code}]' localhost:8000/products/MUG-001/availability
{"detail":"unknown to inventory"} [404]
$ curl -s -w ' [%{http_code}]' localhost:8000/products/TEE-042/availability
{"detail":"unknown to inventory"} [404]
```

Green tests, and every product reported as unknown, because the guessed path doesn't exist on the provider and its 404 looks like "no such SKU". That's the failure behind the 3-in-20 result from experiment F, on a small scale. Without the fact, everything agrees with everything else and the answer is still wrong. The stale-contract case is in [Chapter 5](/guides/programming-the-loop/proof-not-promises/), because what catches it there is a check rather than more knowledge.

> **Case study: agent trials on this task.** The demonstration above was built by hand; the same task was then given to a coding agent. Cursor's `composer-2.5` model, 6 runs per arm, each in a fresh, sandboxed copy of the repository, with the [Chapter 2](/guides/programming-the-loop/briefs-plans-specifications/) prompt (minus "wait for me", plus a closing `VERIFICATION:` line). Arm A had no inventory contract (`PINNED` set to `none`); arm B had the pinned v2.1.0 contract. Correctness was judged outside the sandbox by two independent measures: the live check against the real inventory service, and a 7-check black-box test of the endpoint's behaviour.
>
> | | A, no contract | B, contract |
> |---|---|---|
> | Black-box behaviour test, 7 of 7 | 0 of 6 | 6 of 6 |
> | Live check, as written / with the agent's own URL variable set | 0 / 0 of 6 | 4 / 6 of 6 |
> | Tokens per run, mean | 719k | 322k |
> | Wall time per run, median | 141 s | 67 s |
>
> Without the contract, every run tried to fetch one from the internet (the sandbox blocked it), then wrote its own and pinned it as version 1.0.0. All six read the right fields, `on_hand` and `reserved`, from the brief's "units on hand minus units reserved". All six guessed the path wrong: `/stock/` twice, `/skus/` twice, `/v1/stock/` twice, against the provider's `/v2/stock/`. So the real failure was narrower than my hand-written guess, which got the field name wrong too, but it ended the same way: the provider's 404 was read as "unknown SKU". With the contract, every run called `/v2/stock/{sku}` and passed the behaviour test, for under half the tokens. B-2 and B-6 failed the live check as written only because they read the inventory URL from a differently named environment variable, which neither the brief nor the contract specifies. That's [Chapter 2](/guides/programming-the-loop/briefs-plans-specifications/)'s ambiguous brief again: the brief left the variable unnamed, and the two runs filled the gap with two different, reasonable names.
>
> *Limits.* Where the agent can't read the provider, the contract decided the outcome (6 of 6 against 0 of 6; Fisher's exact test, two-sided, p ≈ 0.002) and cut the cost by more than half. That says nothing beyond one model and one task, and the task was designed so that the contract decides it. Two pilot runs were excluded (web tools still on; the CLI hung). Isolation was a Linux sandbox (bubblewrap with pasta — a userspace network/isolation stack), not AgentTrialRig's macOS option. What the agents *reported* is in [Chapter 5](/guides/programming-the-loop/proof-not-promises/). *Source: trial write-up and per-run logs, [agent-trials/results.md](https://github.com/meabs/ProgrammingTheLoop-WorkedExample/blob/main/agent-trials/results.md) and [agent-trials/runs/](https://github.com/meabs/ProgrammingTheLoop-WorkedExample/tree/main/agent-trials/runs) in the worked-example repository (17 October 2026).*

## Rules files, examples, and where my data stops

Mitchell Hashimoto grows his instruction file from real mistakes: “Each line in that file is based on a bad agent behavior, and it almost completely resolved them all.” (Mitchell Hashimoto, [“My AI Adoption Journey” (5 Feb 2026)](https://mitchellh.com/writing/my-ai-adoption-journey)) Growing it from mistakes is sound, with one caveat from my data: every always-loaded line is paid for on every task. Keep the file an index, move procedures into skills, and where a line can become a check, make it one ([Chapter 6](/guides/programming-the-loop/harness-friction-loop/)).

@poteto argues that “agents love to copy what exists and take the shortest path, so make the easy thing the right thing.” (lauren (@poteto), [post on X, 16 Oct 2026](https://x.com/poteto/status/2111133080526495985)) That matches what the trials showed: agents read the source even when handed a guide. If the codebase has three logging styles, a sentence saying "use the structured logger" is competing with the code. Simon Willison's advice to keep working examples and point the agent at them is gradual disclosure by another name; the worked example's `AGENTS.md` does just that: "Follow `app/clients/catalogue.py`."

And where my data stops: a team whose agents work mostly in very large, unfamiliar repositories, asking structural questions, may find a graph or guide pays off; the AgentGraphWorkTree data supports that for multi-hop questions. My data is one main agent, a few repositories and mostly mechanical changes. Measure on yours.

## Recommendation: a layered approach

<figure class="guide-figure">

![Layers of knowledge for a dependency the agent can't read, each added only when the task needs…](/guide-images/fig-knowledge-layers.png)

<figcaption>Figure 3.4. Layers of knowledge for a dependency the agent can't read, each added only when the task needs it, with a freshness gate across all of them. Redrawn from Figure 1 of the OKFExperiment architecture recommendation.</figcaption>

</figure>

1. **If the agent can read the repository**, rely on the source and existing tools, and add "read the source to confirm before you rely on it" to the instructions.
2. **For a dependency it can't read**, supply a **versioned API contract** first, owned and published by the dependency's team, listing every success and error response. In one small trial, a contract that listed only one success code led agents to treat the service's other success code as an error (README, experiment H3).
3. **Add a short, owner-written note** for what a contract can't carry: conventions, error behaviour, the field names people get wrong.
4. **Add structural knowledge** (a guide, a graph, or the source) only for tasks that need internal call relationships, such as impact analysis.
5. **Put business behaviour in tests and specifications**, where it is verified.
6. **Make freshness a gate, not a hope.** Every piece of knowledge records the version of what it describes, and a pipeline step compares it with the dependency in use before the agent runs. I built such checks on small examples ([scripts/check_references.py](https://github.com/meabs/OKFExperiment/blob/main/scripts/check_references.py)); they haven't run in a real pipeline yet. The worked example has a tiny one ([Chapter 5](/guides/programming-the-loop/proof-not-promises/)). A version check catches declared change only; it can't show that behaviour still matches, or catch a provider that changed behaviour under the same version.

Start with nothing added and a short `AGENTS.md`. Add knowledge only where the agent *can't* get the fact itself, starting with the most authoritative, smallest source. Never add a generated layer to a readable repository without measuring it on your own tasks. Treat all supplied knowledge as needing a freshness check that runs outside it.

## Try this on your repository

This is the experiment that matters most, and it takes an afternoon: set it running and put the kettle on.

1. **Pick three to five real tasks** with an independent way to check each (a test, or an exact expected answer). Include at least one that touches a dependency the agent can't read.
2. **Arm A, nothing extra.** Fresh clone, no `AGENTS.md` beyond what's already there, no added docs. Run each task.
3. **Arm B, short and relevant.** A short `AGENTS.md` (an index: commands, entry points, real exceptions), plus *only* the task-relevant facts the agent can't find itself (the contract or a short note for the dependency).
4. **Run each task at least three times per arm**, each in a fresh clone. Record: correct or not (by your check, not the agent's say-so), what it searched for and opened, tokens, and wall-clock time.
5. **Compare.** Did arm B change correctness? Did it change the search behaviour (fewer blind searches, fewer wrong guesses)? Did it cost more or less?
6. **Decide.** Keep only the pieces that helped. If arm B didn't change correctness on readable-code tasks, cut it back. If it fixed the cross-boundary task, that's where your knowledge effort belongs. Three runs gives you a direction rather than a measurement; [AgentTrialRig](https://github.com/meabs/AgentTrialRig) will do the bookkeeping and the intervals if you want more.

## Checklist

- [ ] Context window = current working context; the model and external state hold the rest.
- [ ] If the agent can read the code, let it; add "read the source to confirm".
- [ ] Keep `AGENTS.md` a short index; procedures in scripts first, a task-scoped skill only where a script can't carry it.
- [ ] For code it can't read: versioned contract first, then a short owned note.
- [ ] Add structural knowledge only for structural questions.
- [ ] Make freshness a pipeline gate; labels and banners don't catch drift.
- [ ] Verify any generated documentation against the repository before trusting it.
- [ ] Measure every layer on your own tasks before keeping it.
