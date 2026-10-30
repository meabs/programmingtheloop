---
title: "11. The take-home kit"
description: "From Programming the Loop — 11. The take-home kit."
---

<p class="guide-edition-note">Free to read on the web. <a href="/resources/">October 2026 PDF</a> · <a href="/updates/">Updates</a></p>

Teams don't need a knowledge platform, an orchestration framework or a programme to document everything before they get value from coding agents. They need a well-engineered repository with a short `AGENTS.md`, runnable checks, authoritative contracts for the things agents can't read, and a habit of adding each further layer only when it has shown it pays. That is a recommendation, built on the findings in [Chapter 3](/guides/programming-the-loop/right-facts/) through [Chapter 9](/guides/programming-the-loop/tools-measurement/) and on engineering judgement where they run out. This chapter is the part to keep on your desk, next to the kettle: a framework for deciding what to adopt, the templates, and the checklists.

If you strip everything in this book back to three rules for Monday morning, make them these:

- **Put the fix in a script, not a sentence.** Every time you are tempted to add another bullet point to `AGENTS.md` telling the agent to run migrations first or pass a flag, put it inside `scripts/test.sh` instead, and run that script where the agent can't edit it. Prose is advice; a script is law.
- **Starve the local context; feed the boundaries.** Leave readable repositories alone and let the agent read the code. Spend your documentation effort almost entirely on the edges the agent cannot see: pinned API contracts and short, owned notes for external services.
- **Never trust a green report without an independent check.** Agents will happily rewrite a test or a freshness check to agree with their own guesses and report `passed` with a straight face, and the report can still match the command log. Grade the work with a check the agent didn't write, and check its claims against the command log.

## Default, Conditional, Experimental: an adoption framework

I label practices with three words. **They're an engineering adoption framework, not a statistical grade of evidence.** The label says *how to adopt* a practice in a typical team (how cheap it is, how reversible, how broadly it applies). It says nothing about how strong the proof is. Some Default practices rest on general engineering agreement rather than my trials; some Experimental ones have more trial data behind them than some Defaults. The evidence for each is in the chapter that covers it.

| Label | Meaning for adoption | Decision rule |
|---|---|---|
| **Default** | Cheap, reversible, useful almost everywhere | Do it unless your repository gives a reason not to |
| **Conditional** | Pays off for certain repositories, tasks or sizes | Adopt after a targeted trial on your own work |
| **Experimental** | Promising; costs or benefits unproven in a team setting | Pilot separately, with an exit test; don't claim a benefit yet |

| Practice | Label | Chapter |
|---|---|---|
| Source, contracts, tests and CI are authoritative; repeated rules enforced in tooling | Default | 3, 6 |
| A short `AGENTS.md` as an index; other context fetched by task | Default | 3 |
| A brief with acceptance criteria for every non-trivial task; temporary plans deleted on merge | Default | 2 |
| One verifiable change per step; one-command checks with prerequisites, run where the agent can't edit them; a diff to a check stops for human review | Default | 4, 5 |
| Verification evidence including real use; honest "not run" | Default | 5 |
| Versioned, provider-owned contracts for dependencies the agent can't read | Default | 3 |
| A freshness gate on supplied knowledge | Default (cheap); the pipeline version is Experimental | 3, 5 |
| Task-scoped skills, only for recurring procedures a script can't carry (Experiment J's general operating skills added cost) | Conditional | 3, 9 |
| A code graph for multi-hop structural questions; a generated guide or note for facts across a repository boundary. Not a general layer on a readable repository (Experiment J) | Conditional | 3, 9 |
| Parallel agents | Conditional, on isolation | 7 |
| Friction reporting and a weekly review | Experimental | 6 |

## A source-of-truth hierarchy

Agents, like new starters, need to know which source wins when two disagree.

| Information | Authoritative place | How the agent should treat it |
|---|---|---|
| Runtime behaviour | Source, configuration, observed behaviour | Inspect the current code, then test |
| Interface compatibility | Versioned, provider-owned contract | Use the pinned version; run the freshness and contract checks |
| Build and validation | Scripts, CI, tests | Run them; prose is not proof |
| Business rules | Tests, plus an owned requirement where needed | Follow; stop and ask on ambiguity |
| Task intent | The brief | Follow for this task; it expires on merge |
| Local guidance | Short `AGENTS.md`, the relevant skill | Navigation and non-obvious process only |
| Generated knowledge | Guide, index or graph with provenance | Use to locate evidence, then check the source |

"Authoritative" means *where a claim must be checked*, not that it's always right. When an intended rule and the current code contradict each other, the agent should stop and ask rather than pick its favourite explanation.

## Crossing a repository boundary

The worked example followed this pattern; it generalises:

1. **Find the consumer edge:** the existing client or adapter and its tests.
2. **Resolve the provider:** the exact contract version, from a pin, lockfile or catalogue.
3. **Inspect only the relevant operations,** and whether the change is additive or breaking.
4. **Make a narrow local change** with tests built from the contract, not from guesses.
5. **Validate the edge:** freshness gate, contract test, a live or integration check where possible.
6. **Record residual risk:** anything not verified is reported as *not run*, never as a success.

The provider owns its published interface; the consumer owns how it uses it and pins a version.

## The adoption path

<figure class="guide-figure">

![A staged adoption path with exit criteria](/guide-images/fig-roadmap.png)

<figcaption>Figure 11.1. A staged adoption path with exit criteria. Each stage is entered only when the previous stage's exit test passes and measured friction justifies the next. Adapted from the adoption roadmap in *Agentic Software Engineering: a practical standard* v1.0 (author's unpublished document), with stages 1 and 3 narrowed to fit Experiment J.</figcaption>

</figure>

| Stage | Implement | Move on when |
|---|---|---|
| **0. Baseline** | Reliable build, test and lint commands; a short `AGENTS.md`; briefs with acceptance criteria | A fresh agent runs the core checks and makes a small change with reviewable evidence |
| **1. Targeted reuse** | Prerequisites moved into scripts first; a skill only for a high-friction procedure that still fails without one | Friction for that procedure drops, and tokens per task don't rise |
| **2. Cross-repository integrity** | Provider-owned versioned contracts; pins; freshness gate; contract tests | A representative cross-repository change passes, and a stale pin is caught |
| **3. Navigation pilot** | Optional graph for multi-hop structural questions, with provenance and freshness; a guide only for code the agent can't read | A trial on your tasks shows a net saving without loss of quality (Experiment J's full set-up failed this test on a readable repository) |
| **4. Feedback pilot** | Friction notes, grouping, a human PR loop | A repeated cause drops after its fix |
| **5. Scale decision** | Reuse across repositories | Cost and maintenance stay justified |

Notice what isn't on the list. My experiments don't justify a knowledge platform, a graph database or a documentation programme as a starting point. Native search, ordinary CLIs, pinned contracts and CI do every step of the baseline.

## The kit

Copy these, then change every line to fit your repository. They are templates, not tested artefacts, except where marked.

**1. `AGENTS.md` (the worked example's, as used in its demonstration runs):**

```markdown
# Agent guidance (storefront-api)
Source and tests are authoritative. Read the source to confirm before you rely on any doc.
Run all checks with one command: `bash scripts/test.sh`
Calls to other services go through `app/clients/`. Follow `app/clients/catalogue.py`.
The inventory service is owned by another team and is not in this workspace.
Its contract is pinned in `contracts/` (version in `contracts/PINNED`). Do not edit it.
Report the commands you ran and their real output; say what you could not verify.
```

**2. Task brief:** Goal · Change · Acceptance criteria (each one a check that can run) · Context (files, contracts, prior art) · Constraints · Out of scope · "Temporary: delete on merge."

**3. Status line the agent ends with:**

```text
Change: <one line>
Evidence: <command>  <real result>   (one line per check, including the red run)
Not run: <check> (<why>)
Follow-up: <anything a reviewer should know>
Log: <where the full command log is, so the lines above can be checked>
```

**4. Friction block for `AGENTS.md`:** *"If something blocked or slowed you down, even if you worked around it, record one line before you finish: where it started (discovery, brief, environment, verification, conflicting docs) and what fixed it. Write nothing if nothing went wrong."* (Or install [AgentFrictionLoop](https://github.com/meabs/AgentFrictionLoop), which ships a fuller version.)

**5. Freshness gate:** a check run before the tests, where the agent can't edit it (CI on the protected branch, or a protected path under CODEOWNERS review), that compares the pinned contract version with the version the provider publishes and fails on a major difference. The worked example's `scripts/check_contract.py` is about forty lines, and its `reproduce.sh` really does run it. It reads `info.version` from the published contract (a path or `file://` URL) and, if nothing is pinned, the contract can't be reached or it has no version, says `UNVERIFIED` and fails rather than passing silently. It checks declared versions only: it can't show behavioural compatibility, or catch a provider that changed behaviour without changing its version. Pair it with contract or live checks. Agents that couldn't satisfy it rewrote it instead ([Chapter 5](/guides/programming-the-loop/proof-not-promises/)), so treat any diff to the gate or the tests as a stop for human review.

**6. Review grading:** reversibility, blast radius, verification strength, then the tier table in [Chapter 8](/guides/programming-the-loop/review-merging-risk/).

## Three team checklists

### Before a task

- [ ] Goal, acceptance criteria and out-of-scope are written down, or explicitly marked unresolved.
- [ ] The agent has a one-command check and the exact dependency versions it needs.
- [ ] The work is broken into independently verifiable steps.


### Before a pull request

- [ ] Checks, including a real-use exercise, have been run, or are marked *not run* with a reason.
- [ ] The status line matches the command log, and correctness was judged by a check the agent didn't write.
- [ ] The checks weren't rewritten to agree with the change: any diff to the gate, the test script or the tests has had human review.
- [ ] Every interface change has an owner and a compatibility decision.
- [ ] Any supplied knowledge was fresh against the dependency version in use.
- [ ] The change is graded and reviewed for its tier.


**Before adding any new agent infrastructure** (a document, skill, graph, tool or agent)

- [ ] There is a concrete repeated failure, or costly task, that it would prevent.
- [ ] It can't be enforced more reliably as code, a test, a script or a schema.
- [ ] It has an owner, a freshness mechanism and a retirement date.
- [ ] You will measure it on your own tasks, and remove it if it doesn't pay.


That last checklist is the book's argument put to work: give agents the facts they need and checks that run, and make every layer pay for itself. On readable code that meant a smaller bill with no reliable difference in correctness. Across a boundary it meant much better code.

## Try this on your repository

Run Stage 0 this week. Give a fresh agent, in a fresh clone, a small real task with a written brief, and nothing else added. Can it find and run your checks? Does it end with evidence you can verify? Write down every place it stalled. Build your adoption plan from that list, and leave the vendor feature pages for later.
