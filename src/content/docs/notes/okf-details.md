---
title: "OKFExperiment: details"
description: "The long-form write-up behind the OKFExperiment results: the four conditions, the recommended layout, what each test did, the analysis, and how to reproduce it."
---

This is the long-form write-up from the [OKFExperiment](https://github.com/meabs/OKFExperiment) repository, copied from `docs/DETAILS.md` at commit `5a09027`. Links to files in that repository point at the same commit. The experiments themselves are on the [experiments pages](/experiments/); this page is the reference behind them.

The long-form material behind the [README](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/README.md): the four conditions, the recommended layout, what each experiment did, the analysis and an example guide. It was moved here from the README unchanged, apart from the link fixes and the two corrections listed at the end. Numbers for A to G are also in [RESULTS.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/RESULTS.md); raw reports are in [../results/](https://github.com/meabs/OKFExperiment/tree/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/results).

Contents: [The four conditions](#the-four-conditions) · [Recommended layout and approach](#recommended-layout-and-approach) · [Each test](#each-test) · [Detailed analysis](#detailed-analysis) · [What a guide looks like](#what-a-guide-looks-like) · [Reproducing in detail](#reproducing-in-detail)

## The four conditions

Every test compares the agent in some of these situations:

| | Condition | What the agent has |
| :-: | --- | --- |
| **1** | **No OKF** | Only what it can read and search itself. |
| **2** | **OKF** | The same, plus the generated guide. |
| **3** | **OKF with confidence labels** | The guide, where every fact is marked with how it was derived: `[high]` means stated directly in the source (a class, a field, a route); `[medium]` means a heuristic guess (for example, which method a call refers to). The agent is also told: *"Entries marked `[medium]` are heuristic guesses. When your answer relies on one, say so."* This is the generator's **confidence graph**: every fact is an edge (class extends class, method calls method, route handled by method) carrying a confidence level. |
| **4** | **Cross-repo change with OKF** | The agent works in one repository (a web storefront) and must change it using facts that live in another repository (the backend) that it **cannot read**. It has the backend's guide, with or without confidence labels, or nothing. |

## Recommended layout and approach

This is the setup we would use, and what each choice rests on. Where a choice was not tested, it says so.

### Step 1. Decide whether a repository needs a guide

| Situation | Guide? | Why |
| --- | --- | --- |
| The agent works in this repo and can search it | Usually no | No gain in accuracy; 7 to 30% more tokens (test A). A very large repo might differ; untested. |
| The agent needs facts from **another repo it cannot read** (a private service, another team's code, a vendored dependency) | **Yes**: copy in its contract first (or a short note). Add its guide when tasks depend on call structure | 3 of 20 changes pass with nothing, 18 or 19 of 20 with a guide, about the same as having the source (tests D, F, G). A contract or note did as well as a guide on interface changes (test H1); only a guide or the source answered call-structure questions (test H2). |
| The agent needs facts from another repo it **can** read | No | About 25% more tokens, no accuracy gain (test C). |

### Step 2. The layout

Each repository that others depend on publishes its own guide in an `okf/` folder at its root, next to an `AGENTS.md` that tells the agent where to start. A repository that depends on another one copies that guide into `okf/references/<name>/`. This is the real output for the invoicing service, which depends on a ledger library:

```text
invoice-service/
  AGENTS.md                              # tells the agent where to start (step 4)
  okf/
    index.md                             # the only index; carries okf_version, links every file below
    routes.md                            # only if the repo serves HTTP: every route with its handler
    modules/                             # one file per module (Python, TypeScript) or package (Java)
      invoices.md
      invoices.service.md
    references/                          # other repositories' guides, copied in
      ledger-lib/
        index.md
        modules/
          ledgerlib.ledger.md
          ledgerlib.money.md
          ...
```

- **One file per module** (Python, TypeScript) **or per package** (Java), named by its dotted name. A module called `index` or `log` is written as `index-module.md` or `log-module.md`, because OKF reserves those two names.
- **`routes.md`** exists only for a repo that serves HTTP. For the cross-repo questions it was the most useful single file.
- **`references/<name>/`** holds a dependency's guide exactly as its owner generated it, with its internal links rewritten to stay inside the copy (`kgen okf --reference name=path` does this). Every file in it keeps the SHA-256 of the source it was made from, which is what the freshness check in step 5 uses.
- **No `log.md`** and no nested directories: neither was generated or tested.
- **Size.** Click (about 25 modules): 33 files, about 120 KB. Shopizer (1,173 Java files): 315 files, about 3.5 MB, a typical file 7 KB and the largest 111 KB. For big repos the generator drops getter and setter calls and groups the calls from one method to one target on a single line; before that, one package file reached 168 KB.

### Step 3. What is in each file

Real example, trimmed (`end-state/ledger-lib/okf/modules/ledgerlib.ledger.md`):

```markdown
---
type: Code Module
title: "ledgerlib.ledger"
description: "ledgerlib.ledger: Ledger"
resource: "https://github.com/meabs/OKFExperiment/blob/main/fixtures/ledger-lib/ledgerlib/ledger.py"
tags: ["generated", "code"]
generated: { by: "kgen/0.4.0", at: "2026-10-12T13:50:42+01:00" }
sources:
  - resource: "https://github.com/meabs/OKFExperiment/blob/main/fixtures/ledger-lib/ledgerlib/ledger.py"
    sha256: "5ed69f2c3031649838b55868b2e7fd3150916d5a5d19da7ac91fcb5b4d37d856"
    last_modified: "2026-10-12T13:50:42+01:00"
status: stable
---

## Types
- `Ledger` (class)  `ledgerlib/ledger.py:13`

## Functions and methods
- `Ledger.reverse(entry_id: str, reason: str, key: str, amount: Money | None) -> str`  `ledgerlib/ledger.py:40`

## Depends on
- [ledgerlib.entries](/modules/ledgerlib.entries.md)  `ledgerlib/ledger.py:6`
```

| Part | What to put in it | Why |
| --- | --- | --- |
| `type` | A descriptive word (`Code Module`, `HTTP API`) | The only field OKF requires. |
| `resource`, `sources[].resource` | A URL to the file at the commit it was made from (or a relative path) | Lets a reader open the real code. |
| `sources[].sha256` | The hash of each source file | Lets a check tell whether the guide is still current (step 5). |
| `generated.at`, `sources[].last_modified` | Dates from the source's git history | Provenance. Not used to decide freshness. |
| `stale_after` | Only on files known to be out of date | It did not change what agents did (test D), so it is a fallback, not a defence. |
| **Sections** | `Types`, `Fields` (data classes), `Functions and methods`, `HTTP routes`, `Depends on`, `Calls`, `Tests` | Each list the facts the cross-repo questions were answered from. For Java, fields from parent classes appear in the parent's own file, reached by a link. |
| **Every line** | Ends with `` `path:line` `` | The agent can check any claim in seconds. |
| Optional | `` `[high]` `` or `` `[medium]` `` at the end of a line | Confidence labels (step 6). |

### Step 4. Tell the agent where to start

Put this in the repository's `AGENTS.md` (or whatever file your agent reads). `kgen okf --pointer AGENTS.md` writes it. The last sentence of the first paragraph is the one that stopped agents repeating out-of-date facts when they could read the code (test B):

```markdown
# Repository knowledge

`okf/` is an Open Knowledge Format bundle generated from this repository's source: one markdown file per module with its types, functions, call edges and the file and line each came from. Start at `okf/index.md`. Use it to find your way around, then read the source to confirm before you rely on it.

`okf/references/` holds bundles of other repositories this one depends on, copied in as they were when generated.
```

Leave the second paragraph out if there are no references. If you use confidence labels, add:

```markdown
Entries marked `[medium]` are heuristic guesses, not facts read from the code. When your answer relies on one, say so.
```

### Step 5. Generate it, check it, and keep it fresh

Generate and validate (the commands are in [Reproducing in detail](#reproducing-in-detail); `kgen okf` is on `main` of AgentGraphWorkTree):

```bash
kgen sync --repo R
kgen okf --repo R --out R/okf --pointer R/AGENTS.md --source-url 'https://github.com/OWNER/REPO/blob/COMMIT/{path}'
python scripts/check_okf.py R/okf        # is it valid OKF?
```

Commit `okf/` and `AGENTS.md`. Then keep two things true, both checked automatically. Both scripts were run for this write-up, including their failure cases:

**A. Your own guide matches your own code.** [`scripts/check_fresh.sh`](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/scripts/check_fresh.sh) regenerates the guide into a temporary folder and compares it with the committed one. Generation is deterministic, so any difference means the code changed and the guide was not regenerated. It ignores the two date fields, so a shallow CI clone gives the same answer as a full one. In our runs it passed on a fresh guide and after a documentation-only commit, failed after a source change (naming the one changed file), and passed again after regenerating. Run it on every push:

```yaml
# sketch of a CI step; the script above was tested locally, this workflow file was not run
- uses: actions/checkout@v4
- run: KGEN="python path/to/kgen.py" scripts/check_fresh.sh . --source-url 'https://github.com/OWNER/REPO/blob/main/{path}'
```

Use a **branch** (`main`) in `--source-url` for a guide that this check covers, not a commit. A commit in the URL changes every file on every commit, so the check could never pass. The SHA-256 hashes, not the URLs, are what tie the guide to a version of the code.

**B. A copied-in guide matches the dependency it describes.** [`scripts/check_references.py`](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/scripts/check_references.py) compares the SHA-256 recorded in each file of `okf/references/<name>/` with the dependency's current files and lists what differs:

```bash
python scripts/check_references.py okf/references/ledger-lib path/to/ledger-lib --list
# changed: ledgerlib/ledger.py   (cited by modules/ledgerlib.ledger.md)
# 6 source citations checked, 1 file(s) differ        (exit 1)
```

When it fails, the owner of the dependency regenerates and republishes its guide, and you copy the new one in. Pin the copy to a version or commit of the dependency. This step matters most: an out-of-date guide for something the agent cannot read was repeated as fact in 14 to 16 of 16 answers, and nothing we tried inside the guide prevented it (test D).

### Step 6. Confidence labels: optional, for transparency

Generate with `--line-tags` and add the sentence from step 4. Mark `[high]` only what the source states directly (a class, a field, a route, a declared signature); the generator marks call targets `[medium]`, because it works them out by matching names and types. Expect agents to **say when they rely on a guess** (6 of 8 wrong answers in test E, none without labels), not to be more accurate. A wrong fact marked `[high]` was trusted every time, so never promote an inference. Labels do not tell the agent a fact is out of date; step 5 does.

### What was tested and what is a judgement call

| Choice | Evidence |
| --- | --- |
| Citations, links, cross-module calls and an index together | The thinnest guide (none of these) was the most expensive in both runs of test A. We did not isolate which part matters. |
| One file per module, not per package (Python) | Per-package files were no better (test A, first run). |
| An index | Leaving it out was no better (test A, first run). |
| Cross-module calls only | No calls, cross-module and all calls were within noise on cost (test A). We kept cross-module calls because test E's questions depend on call entries. |
| A `routes.md`, request-class fields, parent-class fields | Used in tests D to G, which they answered. Not tested one at a time. |
| Confirm-in-source sentence | Tested alone (test B3). |
| Freshness checks (step 5) | Built and run on small examples for this write-up; not run in a real CI pipeline or at the scale of Shopizer. |
| Per-class files, nested folders, `log.md`, other layouts | Not tested. |

### Things not to do

- Do not copy in a guide for code the agent can already read.
- Do not rely on `stale_after`, banners or labels to protect agents from an out-of-date guide.
- Do not mark an inferred fact `[high]`.
- Do not let a copied-in guide drift: no check means no protection.

## Each test

Two measures throughout: **was the answer right (or did the change pass its hidden test)**, and **how many tokens did the agent use** (the text it reads and writes, a stand-in for cost and time). Tests A to C use the small Python library [Click](https://github.com/pallets/click) or a made-up pair of repositories; tests D to G use a real web storefront ([Shopizer's React shop](https://github.com/shopizer-ecommerce/shopizer-shop-reactjs)) that depends on a real 1,173-file Java backend ([Shopizer](https://github.com/shopizer-ecommerce/shopizer)) which the agent cannot read.

| Test | Conditions | The agent | Runs |
| --- | --- | --- | --- |
| **A** Same repo, can search | 1 vs 2 (six kinds of guide, and a graph tool) | answers 5 questions and makes 3 changes in Click | 312 |
| **B** Same repo, guide out of date | 1, 2, 3 | answers questions after we changed Click three ways (renamed a function, added a base class, moved a call) | 340 |
| **C** Cross-repo, dependency readable | 1 vs 2 (current and out of date) | makes 3 changes in a small invoicing service that uses a separate ledger library | 72 |
| **D** Cross-repo questions, dependency unreadable | 1 vs 2 (current and out of date) | answers 8 storefront questions that need backend facts, e.g. "which backend method handles the login request, and what class does it take?" | 224 |
| **E** Cross-repo questions, wrong confidence-tier entries | 2 vs 3 (and 3 with a mislabelled entry) | answers 7 questions where four of the guide's `[medium]` call entries were made wrong on purpose | 112 |
| **F** Cross-repo **change**, small | 1, 2, 3 | writes 4 small functions in the storefront whose correct field names and paths exist only in the backend; a hidden test checks each | 60 |
| **G** Cross-repo **change**, harder | 1, 2, 3, and the backend source | edits the storefront's real code and writes modules whose field names sit in the backend's parent classes; hidden tests run the storefront's own modules | 80 |
| **H** Guide against a contract, a short note and the source | none, contract, note, guide, source | the G changes (H1), six call-structure questions (H2), four changes against a small runnable service (H3) | 280 |

### Test A. Same repo, can search: a guide did not help

Every setup answered nearly everything (14 or 15 of 15 questions, 8 or 9 of 9 changes), with or without a guide. So the comparison is cost: tokens compared with no guide (1.00 = the same; higher = more).

| Guide | Tokens vs no guide |
| --- | --- |
| Thinnest (names only, no file references, links or call lists) | 1.26 to 1.42 (always the most expensive) |
| Without call lists | 1.10 to 1.21 |
| **Recommended** (file references, links, calls between modules, an index) | **1.07 to 1.30** |
| Code graph tool instead of a guide | 1.14 to 1.15 |

The recommended guide was level on questions and about 21% more expensive on changes. The two numbers per row are two runs, with and without the "read the source to confirm" sentence; with the sentence the same guides looked more expensive (the runs were not at the same time, so the size of that effect is only indicative).

### Test B. Same repo, guide out of date: a guide made agents repeat old facts, and one sentence fixed it

After the code changed, how many of 12 answers repeated the old fact:

| Condition | Repeated an old fact (of 12) |
| --- | --- |
| 1. No OKF | **0** |
| 2. OKF | **8** |
| 3. OKF with confidence labels (`[high]`/`[medium]` on each line) | 8 |
| OKF + a banner telling the reader to check | 10 |
| OKF + "last verified" and generated-by fields (OKF's own trust fields) | 8 to 9 |
| OKF + an expiry date on only the files that had changed | 5 |
| **OKF + one sentence in the agent's instructions: "read the source to confirm before you rely on it"** | **0** (same cost) |

Confidence labels did not help here, and that is expected: the labels say how a fact was *derived*, not whether it is *current*. A fact that was stated directly in the source a month ago is still labelled `[high]` after the source changes. The expiry date helped somewhat (suggestive, but it did not hold up in test D). The one sentence stopped the problem completely.

### Test C. Cross-repo, dependency readable: a guide added cost, no accuracy

All 72 runs passed, with or without a guide, including an out-of-date one. The ledger library was installed, so the agent could always read it. Copying in its guide cost about 25% more tokens.

### Test D. Cross-repo questions, dependency unreadable: a guide makes the difference, and an out-of-date one is the worst case

**Guide current** (96 runs):

| Condition | Correct | Tokens per run |
| --- | --- | --- |
| 1. No OKF (no access to the backend) | **1 of 24** | about 785,000 |
| Backend source code (for comparison) | 24 of 24 | about 181,000 |
| 2. OKF (the backend's guide) | **24 of 24** | about 189,000 |

Without the backend the agent searched for a long time and still could not answer. With the guide it matched having the full source, at about a quarter of the cost of failing. What answered the questions: a list of every route with its handler, each handler's parameter types, and each request class's fields.

**Guide out of date** (128 runs). We renamed four things in the backend after the guide was made. Four questions had a new answer; four did not.

| The agent had | Gave the **old** answer | Gave the new answer | Unchanged questions right |
| --- | --- | --- | --- |
| The backend's (changed) source | 0 of 16 | 16 of 16 | 16 of 16 |
| The out-of-date guide | **14 of 16** | 0 of 16 | 16 of 16 |
| + the "read the source to confirm" sentence | **16 of 16** | 0 of 16 | 16 of 16 |
| + the sentence, and an expiry date on the 7 changed files | **16 of 16** | 0 of 16 | 16 of 16 |

Every changed fact was wrong and none of the 46 wrong answers hedged. The sentence could not help because there was no source to check against. The expiry date did not help either: not one answer mentioned it. Facts that had not changed stayed correct.

### Test E. Cross-repo questions with wrong `[medium]` entries: labels make the agent disclose a guess, not avoid it

Each question starts from a storefront request, crosses into the backend (which the agent cannot read), and asks which handler serves it (a `[high]` entry) and what that handler calls (a `[medium]` entry). In four of the seven questions we made the `[medium]` call entry wrong on purpose. 16 answers per condition on those four.

| Condition | Followed the wrong entry | Gave the true answer | Something else | Said it relied on a `[medium]` guess |
| --- | --- | --- | --- | --- |
| 2. OKF (no labels) | **11** | 4 | 1 | 0 |
| OKF with labels, no instruction | 10 | 4 | 2 | 0 |
| **3. OKF with labels and the instruction** | **8** | 3 | 5 | **6** |
| Labels and instruction, but the wrong entries marked `[high]` | 10 | 5 | 1 | 0 |

Labels cut wrong answers only a little (11 to 8 of 16; not a reliable difference, p≈0.5). What changed is disclosure: with the instruction, agents said they were relying on a `[medium]` guess in 6 of 16 planted answers, against 0 in the others (p≈0.02), so a reader is warned. Example: *"The facade call is marked `[medium]` in the generated guide, meaning heuristic."* When a wrong entry was labelled `[high]`, agents trusted it and said nothing. The analysis below breaks this down by question.

### Test F. Cross-repo change, small tasks: with a guide, changes pass; without it, they do not

The agent works in the storefront and writes four small functions. Each one's correct field name or path is stated only in the backend, and a hidden test checks the file the agent wrote. For example: build the add-to-cart request, including the backend's field for a discount code; build the search request, using the backend's names for page size and offset; build the reviews request, using the path the backend declares.

| Condition | Changes that passed (of 20) | Tokens per run |
| --- | --- | --- |
| 1. No OKF | **3** | 482k |
| 2. OKF | **19** | 242k |
| 3. OKF with confidence labels | **15** | 235k |

A guide took cross-repo changes from 3 of 20 to 19 of 20 (p<0.001). Tokens were lower (242k against 482k), but that is not a reliable difference (relative cost 0.80, interval 0.51 to 1.15). The 3 passes without a guide were all on the discount-code task, where a common name happened to match. The labelled condition's 15 of 20 against 19 of 20 is not a reliable difference (p≈0.18).

### Test G. Cross-repo change, harder tasks: a guide matched having the backend's source

Four tasks that need more than one backend fact each, or need the agent to change existing code, with hidden tests that run the storefront's own modules in plain Node (only the network and browser are replaced by stubs):

1. **Fix a bug in the storefront's `deleteFromCart`:** the code sends the cart line's numeric id, but the backend's route identifies the line by its SKU. The agent is told only that removing an item does nothing.
2. **Add an optional discount-code parameter to the storefront's `addToCart`,** sent in the backend's field name, for both creating and updating a cart.
3. **Write a checkout request builder:** six fields, each renamed in the backend and some defined in parent classes (the order request extends a general order class, the payment object extends a payment class). The backend has two classes called `PersistableOrder`; the checkout handler uses the newer one.
4. **Write an order-list reader** for the backend's response, whose paging fields are defined in a parent list class.

5 runs per task per condition. The backend's names for these fields were hidden by renaming, so none can be guessed from memory.

| Task | 1. No OKF | Backend source readable | 2. OKF | 3. OKF with confidence labels |
| --- | --- | --- | --- | --- |
| 1. Fix `deleteFromCart` | 3 / 5 | 5 / 5 | 5 / 5 | 5 / 5 |
| 2. Discount code in `addToCart` | 0 / 5 | 4 / 5 | 5 / 5 | 5 / 5 |
| 3. Checkout request builder | 0 / 5 | 4 / 5 | 3 / 5 | 2 / 5 |
| 4. Order-list reader | 0 / 5 | 5 / 5 | 5 / 5 | 5 / 5 |
| **Total passed** | **3 / 20** | **18 / 20** | **18 / 20** | **17 / 20** |
| Tokens per run | 294k | 333k | 301k | 308k |
| Seconds per run | 42 | 45 | 38 | 38 |

- A guide matched the backend's source: 18 of 20 each (p=1.0). Both beat no guide (p<0.001).
- The 3 passes without a guide were all on task 1, where the agent guessed that the cart line's SKU, not its id, was the right identifier.
- The checkout builder was the hardest: even with the real source, 4 of 5. With the guide the agent sometimes picked the older of the two `PersistableOrder` classes and searched for the original field names.
- Tokens were about level across conditions, because without a guide the agent usually gave up early with a wrong answer instead of searching for long.

### Test H. Does a guide add anything beyond an API contract? Yes for call structure, no for field names

Tests D to G compared a guide with nothing. A fair objection: most services already have, or can cheaply produce, an API contract (an OpenAPI document) or a short hand-written reference. Test H compares five ways of giving the agent knowledge of a dependency it cannot read, on the same storefront-and-backend setup as tests D to G (full plan, written before any run: [docs/EXPERIMENT_H.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/EXPERIMENT_H.md)):

| Arm | The agent gets |
| --- | --- |
| `none` | only a line saying the backend exists elsewhere |
| `contract` | the backend's OpenAPI document (390 KB: routes, parameter names, request and response schemas with inherited fields, the framework's summary text). Built by our script from the source, not by a running Spring application. |
| `notes` | a 3 KB hand-written reference: conventions, the endpoints the storefront uses, the field names people get wrong. Every fact checked against the source. |
| `okf` | the generated guide, as in tests D to G |
| `source` | the backend's source, readable |

Three parts, 280 runs, the same model, **network access on for every run** (and logged). All figures are passed of 16 runs unless stated.

**H1. The four change tasks of test G (field names the backend defines).**

| `none` | `contract` | `notes` | `okf` | `source` |
| --- | --- | --- | --- | --- |
| 4 of 16 (277k tokens) | 13 of 16 (192k) | 14 of 16 (**128k**) | 14 of 16 (282k) | 14 of 16 (334k) |

A contract, a 3 KB note, a guide and the source were level (no reliable difference between any two of them); all beat nothing (p≤0.004). The note was the cheapest by a wide margin, and the guide cost about the same as no help at all. The one task where they split was the checkout builder, where the field names sit in an inherited class: `contract` 1 of 4, `okf` 2 of 4, `notes` 4 of 4, `source` 4 of 4. The 4 passes without help were mostly the one task that can be solved by guessing (task 1: use the SKU).

**H2. Six questions about the backend's call structure ("which method handles this request, and which class does it call?").** A contract describes an interface; it does not say what a handler calls inside.

| `none` | `contract` | `notes` | `okf` | `source` |
| --- | --- | --- | --- | --- |
| 1 of 24 (447k) | 8 of 24 (464k) | **0 of 24** (476k) | **21 of 24** (**170k**) | 21 of 24 (207k) |

The guide matched the source and beat the contract and the note (p<0.001), at about a third of the tokens of the arms that had to search. This is the part of the plan where OKF was expected to add something, and it did.

**A finding about the network.** With the network on, 56 of the 120 H2 runs (19 of 24 in `none`, 18 in `contract`, 19 in `notes`, none in `okf` or `source`) ran `git clone` on the public Shopizer repository and searched it. Because the backend's identifiers are renamed, the clone mostly did not help: those 56 runs passed 8 times, all of them in the `contract` arm, where the contract's route names let the agent line the clone up with the renamed code. Runs without the network: `none` 1 of 5, `contract` 0 of 6, `notes` 0 of 5. Without the renaming this test would have been answerable from the internet for any public backend.

**H3. A small FastAPI service, four changes to a client, hidden tests against the running service.** This part was contaminated and is reported with care. Agents in the arms that were not given the source went looking on the disk for the service, for the hidden tests and for other arms' material (they found `rules.py` copies, extracted the test fixture, listed the guide of the service). An earlier run of the same part, where the real service sat in a findable folder, had `none` passing the price-rule task 4 of 4; we archived it and reran with the service unpacked from an archive only while a test runs. The rerun still had 15 of 64 non-source runs touching such paths (`none` 5, `contract` 4, `okf` 4, `notes` 2). The Codex sandbox does not restrict reads, so this cannot be prevented, only detected.

| | `none` | `contract` | `notes` | `okf` | `source` |
| --- | --- | --- | --- | --- | --- |
| All 80 runs | 11 of 16 | 11 of 16 | 10 of 16 | 15 of 16 | 16 of 16 |
| Clean runs only | 7 of 11 | 8 of 12 | 8 of 14 | 11 of 12 | 16 of 16 |

No pair of arms differs reliably (smallest p=0.08, `notes` against `okf`). What the per-task counts do show:

- **Retry on a rate limit:** the contract arm failed 0 of 4 where every other arm passed 4 of 4. The contract lists `201` as the only success; the service returns `200` for a repeated idempotency key, and the agents in the contract arm treated that as an error. A real contract-driven mistake.
- **Mapping errors (404 for an unknown SKU, 409 for a reused key):** `notes` 0 of 4 and `none` 1 of 4; `contract`, `okf` and `source` 4 of 4. The service does not declare these codes in its contract, so the contract arm's passes are probably guesses of the usual codes, plus the contamination.
- **Reproducing the price rules (bulk discount, coupon stacking, rounding):** no non-source run that did not read the service got it (`contract` 0 of 1, `notes` 0 of 2, none for `none` and `okf`), and `source` passed 4 of 4. Nothing generated from the service held its rules. This task cannot be tested fairly with this agent and harness, since the rules were found by searching the disk.

**What test H says.**

- For **what the interface is** (routes, parameters, field names), a contract or a three-kilobyte note is as good as a guide and cheaper. If you have one, supply it first.
- For **how the dependency works inside** (which method handles a request and what it calls), only the guide and the source worked. A contract and a note, however accurate, do not hold it: 0 to 8 of 24, against 21 of 24.
- For **behaviour** (error codes, rounding, rules), none of the generated artefacts holds it; the guide and the contract are structure. Where the source cannot be read, write the rules into the note.
- A contract can mislead as well: it states the success code it was written with, and agents trusted it.
- Not shown: that a guide plus a contract beats either alone (not run), or that these results hold for other models or frameworks that emit richer contracts.

### Test I. A large repository the agent can read: a guide did not help and cost more

Four renames of a method with a common name (`findOne`, `saveOrUpdate` twice, `toLocale`), each with its callers, in the 1,173-file backend, readable. A text search for the name finds 3 to 10 times more hits than there are true call sites. 8 runs per task per arm, graded exactly by a hidden script (every true site renamed, nothing else changed). Agents were isolated from the rest of the disk. Full plan, deviations and results: [EXPERIMENT_I.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/EXPERIMENT_I.md).

| | `plain` | `guide` |
| --- | --- | --- |
| Passed | 22 of 32 | 24 of 32 (p = 0.78, no reliable difference) |
| Tokens per run | 267k | 318k (1.22 times, reliably more) |

Failures were concentrated in the two `saveOrUpdate` renames and were missed calls or edits to callers of a different class, in both arms. The first batch was graded with a rule that was too strict and is discarded; both batches are published.

### Test J. A repository set up for agents against one left as it is: no reliable gain, and about 48% more tokens

The same 1,173-file backend, readable. `plain` had nothing added. `optimised` had the recommended guide in `okf/`, the code graph and its `kg` tool in `.agent-knowledge/`, three operating skills in `.agents/skills/` (`navigate-the-repo`, `change-the-code`, `check-your-work`: how to work here, not about the technology; the source is in [`../fixtures/operating-skills/`](https://github.com/meabs/OKFExperiment/tree/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/fixtures/operating-skills)) and an `AGENTS.md` that points to all of them. Four changes (a cross-module rename over seven implementations, one overload out of six, removing an unused parameter from six implementations, and a 58-file rename of a generic base method with 105 sites) and three questions, 8 runs each per arm, 112 runs, isolated. Plan, deviations and results: [EXPERIMENT_J.md](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/EXPERIMENT_J.md).

| | `plain` | `optimised` |
| --- | --- | --- |
| Changes (of 32) | 28 | 29 (p = 1.0) |
| Questions (of 24) | 16 | 19 (p = 0.52) |
| Tokens per run | 297k | 401k (1.48 times, interval 1.38 to 1.60, reliably more) |

The agents used the setup (graph and guide in every optimised run). The hard rename passed 4 of 8 plain and 6 of 8 optimised, not a reliable difference. The grader missed four AspectJ pointcut strings that all 16 runs had updated; the runs were re-scored from their saved diffs.

## Detailed analysis

This section explains what the numbers mean, why we think they came out this way, and how far to trust them.

### How to read the numbers

- **A run** is one attempt by the agent at one question or task, started from scratch. Each condition in each test has between 12 and 28 runs, so small differences are not reliable.
- **"Reliable"** means we ran a standard statistical check (Fisher's exact test) that asks: if the two conditions were really the same, how likely is a gap this big by luck? Below about 5% (p<0.05) we call a gap reliable. "Not reliable" does not mean "no effect"; it means we cannot tell with this many runs.
- **Tokens** are the text the agent reads and writes. More tokens means more cost and more time. In the cross-repo tests, runs took about 20 to 60 seconds, so tokens and seconds moved together.
- **"The agent cannot read the code"** is real here: the backend was not in the agent's workspace. We checked, by reading each run's commands, whether runs went looking elsewhere on the disk. In the tests where it mattered, almost none did, and we counted the exceptions.

### 1. The one idea behind every result: can the agent read the code?

Everything we measured fits one picture.

| | The agent can read the code | The agent cannot read the code |
| --- | --- | --- |
| **With no guide** | Works. The agent searches and finds what it needs. | Fails. The agent cannot find facts that are not there. |
| **With a guide** | Works, but the guide adds reading, so it costs a little more. | Works almost as well as having the code. |
| **With an out-of-date guide** | The agent may repeat old facts, unless told to check. | The agent repeats old facts, with nothing to check them against. |

A guide is a substitute for reading the code. It is valuable exactly when reading the code is not possible, and it is risky exactly when it is wrong and cannot be checked.

### 2. Why a guide did not help on a codebase the agent can search (test A)

Click is small (about 25 modules). Codex found what it needed in about 2.5 turns, using about 60,000 tokens per question. When we added a guide, it opened the guide every time (24 of 24 runs), and its turns went up (2.7 to 3.9 instead of 2.5), which suggests it also searched the code to confirm what the guide said. The thinnest guide cost the most (up to 42% more) because it listed names without file locations, links or calls, so it could not answer anything on its own: the agent read it and then searched as before.

What this does *not* show: whether a guide helps in a codebase that is too large to search quickly. We did not test that, so we make no claim either way.

### 3. Why out-of-date guides are dangerous, and why one sentence fixes it only sometimes (tests B and D)

When the code changed after the guide was made, the agents repeated the guide's old facts (8 of 12 in test B, 14 to 16 of 16 in test D). They did this with confidence: none of the 46 wrong answers in test D carried any caveat. We think agents trust the first source that gives a plausible answer and, when asked to be efficient, do not look further.

**Which changes fooled the agents most.** In test B, a *renamed function* was repeated in every condition except the two with expiry dates (4 of 4 each): the agent read the old name in the guide and never searched for the new one. A *new base class* (inserted between two existing classes) fooled them 3 to 4 times out of 4. A *call moved behind a helper* function fooled them least (0 to 2 of 4), because following who calls whom pushes the agent to search the code. In test D, three of the four changes were repeated by all 12 answers that had the stale guide (3 conditions, 4 runs each), and the fourth by 10 of 12.

**The sentence.** Adding "read the source to confirm before you rely on it" took repeated old facts from 8 of 12 to 0 of 12, at the same cost (77k against 79k tokens). It works because it makes the agent do one verification step, and when the agent can read the code, that step finds the truth.

**Why nothing worked in test D.** The agent could not read the backend, so the sentence had nothing to act on. We also tried an expiry date on exactly the seven concepts whose source had changed, and explained it in the agent's instructions. Not one of 32 answers mentioned it. The agent read those very files, and the date did not register. Warnings and labels inside a document that the agent trusts are easy to overlook.

**One caveat on the sentence's cost.** In test A the same guides cost less without the sentence (1.07 against 1.30 for the recommended one), which suggests the sentence makes the agent read more. In test B it cost nothing. The two measurements were not made at the same time, so treat the cost as "possibly around 20%".

### 4. Why a guide transforms the cross-repo results (tests D, F and G)

Without a guide the agent was blind to the backend. In test D, it spent about 785,000 tokens per question (between 55,000 and 3 million), searched the disk in 3 of 24 runs, tried the network in 2, and still answered only 1 of 24 correctly. That one correct answer came from a run that wandered the disk and found *another run's guide*. With the guide it answered 24 of 24 for about 189,000 tokens and in 22 seconds instead of 60.

What the guide contained that made this possible: a single file listing every route with its handler; each handler's parameter types; and the fields of each request and response class. For test G, the fields the agent needed were often in *parent* classes (the order request inherits from a general order class), so the agent had to follow links from one file to another. It could, and it passed 18 of 20, the same as an agent with the full source.

**What still went wrong with a guide.**
- *Two classes with the same name* (checkout builder): the backend has two `PersistableOrder` classes, and the guide lists both. The checkout builder failed in 2 of 5 plain-guide runs and 3 of 5 labelled-guide runs. In the one failure we inspected, the agent searched the guide for the original field names and used the older class. Even with the real source the agent failed once.
- *Wrong field names in small tasks* (test F): for the search request, two labelled-guide runs used `start` where the backend field is `offset`, which suggests they filled in a name from habit instead of looking it up.
- *An ambiguous task wording.* One task did not rule out a `/api/v1` prefix on a path, which cost one run. We say so rather than hide it.

**Why no-guide agents sometimes passed.** All 6 passes without a guide (3 in each of tests F and G) were on tasks where the right answer is guessable: a field called `voucher` for a discount code, and the cart line's `sku` for an identifier. Where the name was not guessable, the pass rate without a guide was 0 of 30.

### 5. What confidence labels did and did not do (tests B, E, F and G)

**What a label means.** `[high]` marks a fact the source states directly: a class, a field, a route, a declared method. `[medium]` marks a guess the generator made by matching names and types, such as which method a call refers to. In this generator, only call targets are `[medium]`. A label says *how a fact was found*. It does not say whether the fact is *still true*, so labels cannot help against an out-of-date guide, and in test B they did not.

**Test E, in detail.** We made four call entries wrong on purpose and checked what agents did.

| Question (planted wrong entry) | Followed it, out of 4 runs each, in the order: no labels, labels, labels and instruction, wrong entry marked `[high]` |
| --- | --- |
| Login handler "calls" `registerCustomer` (implausible) | 0, 0, 0, 0 |
| Cart-line removal "calls" a modify method (plausible) | 4, 4, 4, 4 |
| Add-to-cart "calls" a replace method (plausible) | 4, 4, 3, 4 |
| Shipping handler "calls" an order-processing method (somewhat plausible) | 3, 2, 1, 2 |

The agents were *not* fooled by an obviously wrong entry (a login handler registering a customer): they gave the true answer in 15 of 16 runs. They *were* fooled by entries that looked reasonable. So the labels had little room to help: the agents' own common sense stopped the silliest errors, and nothing stopped the plausible ones. The only place the label-plus-instruction condition did visibly better was the shipping question (1 of 4 followed it, against 3 of 4 with no labels), which is too small to be sure about.

**What did change: disclosure.** With labels and the instruction, 6 of the 8 wrong answers said the answer rested on a `[medium]` entry. Without the instruction, none did. A person reading those answers would know where to look. That is a real benefit even though accuracy barely moved.

**What went wrong with labels.** When we labelled the same wrong entries `[high]`, agents trusted them and said nothing. Labels are only worth what the generator's honesty about them is worth. A generator must not mark anything `[high]` that it merely inferred.

**The cost of labels.** On the three questions that were correct in the guide, agents hedged in 2 to 3 of 12 answers when there was nothing to doubt. One of those control questions was a poor one (only 3 of 16 right across all four conditions combined), so the control accuracy figures in test E mostly reflect that one question; the other two were right in all 16 runs each.

**In the change tasks,** the labelled condition passed slightly fewer: 15 against 19 of 20 in test F, 17 against 18 of 20 in test G. Pooled, 32 against 37 of 40 (p≈0.19), which is not reliable, but both tests lean the same way. We do not know why. One possibility is that the extra marks make lines longer and harder to scan; another is chance. We would not use labels expecting them to improve accuracy.

### 6. What surprised us

- **A guide made no difference to accuracy on a code base the agent could search,** even though it contained correct, detailed information. Agents simply did not need it.
- **One sentence in the agent's instructions did more than any label, banner or date** against out-of-date facts, when the agent could act on it.
- **Agents ignored an expiry date** on the very files they read and treated stale entries as current.
- **Agents did apply common sense to implausible entries,** but not to plausible ones.
- **A guide matched the real source** in the harder test (18 of 20 each), at about the same tokens. We expected the source to be clearly better.

### 7. How sure are we, and what would change our minds

We are fairly sure of these, because the gaps are large and the checks are reliable: a guide beats nothing when the agent cannot read the code (1 of 24 against 24 of 24; 6 of 40 against 69 of 80 across tests F and G pooled, p<0.001); an out-of-date guide is repeated as fact; and one sentence fixes it where the agent can read the code.

We are not sure of these, because the gaps are small or the samples few: whether labels help or hurt accuracy; whether an expiry date helps at all (it looked helpful in one test and did nothing in another); the exact cost of the "confirm in source" sentence; and why the checkout task was hardest.

What would change our minds:
- A **large codebase** where search is slow, with the agent able to read it: a guide might then pay for itself. We did not test this.
- **Another agent or model:** everything here is one model at medium reasoning effort.
- **Real drift** from real commits instead of ours; ours were renames and moves we planted.
- A **bigger sample:** with 5 runs per cell, a difference of one run is within chance.

### 8. A practical checklist

1. Decide whether the agent will be able to read the thing the guide describes. If yes, probably skip the guide. If no, build one.
2. Generate it from source with file-and-line references, links, calls between modules, an index, and (for a web API) one file listing every route with its handler and each request class's fields.
3. Rebuild it automatically whenever the thing it describes changes, and have your build check the stored hashes. This is the only protection that worked against an out-of-date guide the agent cannot check.
4. Add the sentence "read the source to confirm before you rely on it" to the agent's instructions wherever the agent can read the code.
5. If you add confidence labels, mark `[high]` only what the source states, add the instruction to disclose `[medium]` guesses, and treat the labels as a way to make the agent's uncertainty visible, not as a way to make it more accurate.
6. Test on your own agent first. Everything here is one model.

## What a guide looks like

A real file from the Click guide. The header is OKF metadata; every line below it ends with the file and line number it came from.

```markdown
---
type: Code Module
title: "click.core"
resource: "https://github.com/pallets/click/blob/2247b35.../src/click/core.py"
generated: { by: "kgen/0.4.0", at: "2026-10-04T15:19:53-07:00" }
sources:
  - resource: "https://github.com/pallets/click/blob/2247b35.../src/click/core.py"
    sha256: "26307e89b7b2..."
status: stable
---

## Types
- `Option` (class) extends `click.core.Parameter`  `src/click/core.py:3057`

## Calls
- `Parameter.consume_value` calls [click.types](/modules/click.types.md) `ParamType.split_envvar_value`  `src/click/core.py:2718`
```

With confidence labels (condition 3), each line ends with its level. A declared class is `[high]`; a call target, which the generator works out by matching names and types, is `[medium]`:

```markdown
- `Option` (class) extends `click.core.Parameter`  `src/click/core.py:3057` `[high]`
- `Parameter.consume_value` calls [click.types](/modules/click.types.md) `ParamType.split_envvar_value`  `src/click/core.py:2718` `[medium]`
```

For a web API there is also one file listing every route, which is what the cross-repo questions were answered from:

```markdown
| POST | `/api/v1/customer/login` | [...customer](/modules/com.salesmanager.shop.store.api.v1.customer.md) `AuthenticateCustomerApi.authenticate` | `sm-shop/src/main/java/.../AuthenticateCustomerApi.java:157` |
```

Generated guides you can browse are in [end-state/](https://github.com/meabs/OKFExperiment/tree/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/end-state): Click, Click with confidence labels, Click after the changes, the invoicing pair, and the real Shopizer backend (315 files, 325 routes).

## Reproducing in detail

The generator command `kgen okf` is in [AgentGraphWorkTree](https://github.com/meabs/AgentGraphWorkTree) from commit `aa98666` on `main`. The experiments were run with that code; `../scripts/kgen-okf.patch` is the same change as a patch against `dd26ee6`, for anyone who wants the older base.

```bash
git clone https://github.com/meabs/AgentGraphWorkTree && cd AgentGraphWorkTree
python .apm/skills/agent-graph/tool/kgen.py sync --repo R
python .apm/skills/agent-graph/tool/kgen.py okf --repo R --out R/okf --pointer R/AGENTS.md              # condition 2
python .apm/skills/agent-graph/tool/kgen.py okf --repo R --out R/okf --pointer R/AGENTS.md --line-tags  # condition 3
python ../OKFExperiment/scripts/check_okf.py R/okf
```

`kgen` needs `tree-sitter` and `tree-sitter-java`. The patch includes a fix for a bug where the Java extractor listed spurious routes. To rerun tests A to C, `scripts/make_a.py`, `make_b.py` and `make_c.py` build each condition for [AgentTrialRig](https://github.com/meabs/AgentTrialRig). To rerun D to G: clone Shopizer at `6a4a0a6` and its React storefront at `455b4bc`; run `scripts/privatize.py` on a copy of the backend (and again with `--drift` on a second copy for D, or with `--extra` on a third for G); generate the guides; copy `harness/` and `hidden/` next to the scripts; and run `scripts/make_d.py`, `make_e.py`, `make_f.py` and `make_g.py`. `scripts/leak_check.py` counts runs that left their workspace; `analyse_d2.py` and `analyse_e.py` count old and wrong answers. To rerun H: `scripts/make_h_openapi.py` builds the backend's contract from a synced copy of the renamed backend, `fixtures/pricing-service.tgz` and `fixtures/shop-client` are the runnable service and its client, `scripts/make_h.py` writes the three trial files, `scripts/analyse_h.py` and `scripts/net_check.py` read the results. Keep the unpacked service out of any folder the agent can search.

## Corrections made while moving this page

- Test F: the original said the guide passed "at half the tokens". The interval (0.51 to 1.15 of the no-guide cost) includes no difference, so the saving is not reliable. The line below says so.
- The checklist and layout said the confirm-in-source sentence cost nothing; the analysis (section 3) gives "possibly around 20%". Both are kept, with a pointer between them.
