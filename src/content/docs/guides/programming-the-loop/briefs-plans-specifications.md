---
title: "2. Briefs, plans and specifications"
description: "From Programming the Loop — 2. Briefs, plans and specifications."
---

<p class="guide-edition-note">Free to read on the web. <a href="/downloads/">October 2026 PDF</a> · <a href="/updates/">Updates</a></p>

Much bad agent output traces back to a decision nobody made. Before an agent writes code, someone has to decide what the change is, how you will know it is done, and what must not change. That decision belongs in a brief with acceptance criteria. But not every task needs a durable specification living in the repository. A **temporary implementation plan** is a working note for one change; an **authoritative requirement** is a long-lived statement of how the system must behave. They have different owners, lifetimes and homes, and mixing them up produces a repository full of stale plans that agents then trust.

## Three kinds of planning document

| | Task brief | Implementation plan | Long-lived requirement |
|---|---|---|---|
| Says | What to change and how we'll know it's done | The steps for this change | How the system must behave, for good |
| Lifetime | One task | One task or branch | Years |
| Owner | Whoever asks for the change | The person (or agent) doing it | The product or service owner |
| Home | Issue, PR description, or a brief file deleted on merge | Scratch file, PR, or branch | Tests first; a spec or policy only where a test can't carry it |
| Agent should | Follow it | Update it as reality changes | Treat it as authoritative; stop and ask on conflict |

The trap is the middle column, mind. An implementation plan left behind after the work lands becomes a document that describes intentions, not the system, and [Chapter 3](/guides/programming-the-loop/right-facts/) shows what agents do with documents that are out of date: they repeat them confidently.

## When the brief was the problem

> **Case study: when the brief is the problem.** In my cross-repository change trials, one task was found ambiguous in its first draft (the backend had an internal setting and a public response field with similar meanings) and was reworded before any real run. Even so, in another task an agent added an `/api/v1` prefix that "the task did not clearly rule out", and the write-up concludes that "the task wording should have been clearer about the prefix" ([OKFExperiment, docs/RESULTS.md, section F](https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/docs/RESULTS.md)). My friction tool has a dedicated origin for this, `task-context` ("the brief had no acceptance criterion"), and reports it as informational because the repository can't fix it; the fix is in how tasks are briefed ([AgentFrictionLoop README](https://github.com/meabs/AgentFrictionLoop/blob/fa2412f66ab3c86be6c9772e30c6b021735683d2/README.md)). So an ambiguous brief produces wrong-but-defensible answers even in a controlled experiment written by someone who knew the answers. How often that happens in everyday work, I didn't measure.

My rule of thumb: if a careful person could read your brief two ways, expect the agent to pick the one you didn't mean.

## Worked example, stage 1: the brief

This is the real brief from the worked example (`storefront-api/docs/brief.md`). Note the first line: it's a temporary task brief, to be deleted or archived when the change merges.

```markdown
# Brief: product availability endpoint (temporary task brief; delete or archive when merged)

Goal: shoppers can see whether a product can be ordered now.

Change: add `GET /products/{sku}/availability` to storefront-api.
Response 200: `{"sku": str, "available": int, "in_stock": bool}` where
`available` = units on hand minus units reserved, as reported by the inventory service.

Acceptance criteria
1. Known SKU with stock: 200, correct `available`, `in_stock: true`.
2. Known SKU with everything reserved: 200, `available: 0`, `in_stock: false`.
3. SKU unknown to the catalogue or to inventory: 404.
4. Inventory unreachable or answering outside its contract: 502, error logged, never a made-up number.
5. `bash scripts/test.sh` passes, including the contract-freshness check.
6. Real behaviour shown against a running inventory service (curl output attached).

Context: the inventory service belongs to another team and is not in this workspace.
Use the pinned contract in `contracts/`. Follow `app/clients/catalogue.py` for client style.

Out of scope: caching, changing the contract, touching `/products/{sku}`, UI.
```

The prompt that goes with it can be short, because the brief carries the decisions. *Illustrative prompt, not from a recorded session:*

```text
Read docs/brief.md. Before you change anything, restate the goal and the
acceptance criteria in your own words, list the files you expect to touch,
and say which facts about the inventory service you will rely on and where
they come from. Then wait for me.
```

Asking for the restatement is cheap insurance: a misunderstanding that would cost an hour of rework costs thirty seconds. Criterion 4 is the one that earns its keep later. Without it, the obvious implementation returns *something* when inventory misbehaves, and [Chapter 5](/guides/programming-the-loop/proof-not-promises/) shows what that something can be.

What the brief does *not* do is create a durable spec. The lasting statement of the behaviour will be the tests the change adds. If the business rule ("available means on hand minus reserved") needs to outlive this task, it goes in the tests, and in an owned requirement only if a test can't say it.

## How others plan

Plan first, then execute. Nothing else I read was as consistent. Harper Reed's workflow is “Brainstorm spec, then plan a plan, then execute using LLM codegen. Discrete loops.” (Harper Reed, [“My LLM codegen workflow atm” (16 Feb 2025)](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/)) Mitchell Hashimoto splits vague requests into separate planning and execution sessions. For anything non-trivial that matches what the experiments suggest; for a one-line fix, the brief *is* the plan.

Geoffrey Huntley's loops go further and keep durable specifications as files in a specifications folder that the agent re-reads every iteration. For a greenfield project driven by a loop, that's the right call: the specs *are* the long-lived requirements. For a change to an existing system, I'd rather the tests carry the behaviour and the brief disappear on merge. Huntley also tells a story against himself that applies to both: “my specification for the lexer defined a keyword twice for two opposing scenarios, which resulted in a lot of time wasted.” (Geoffrey Huntley, [“Ralph Wiggum as a ‘software engineer’” (14 Jul 2025)](https://ghuntley.com/ralph/)) The agent faithfully implemented a contradiction, which is a good reason to ask the agent to look for contradictions and gaps before it codes.

How much to tell the agent up front is where people differ. Kent Beck deliberately restricts context, “only telling the genie what it needs to know for the next step.” (Kent Beck, [“Augmented Coding & Design” (3 May 2025)](https://newsletter.kentbeck.com/p/augmented-coding-and-design)) @poteto's "deepcoding" goes the other way and frontloads context and guidance. Both can be right about different things: rich context about *the task and how to work* (goal, constraints, what done looks like), and a narrow scope for *what to do now*. [Chapter 3](/guides/programming-the-loop/right-facts/)'s data points the same way for knowledge of the code: give it the facts this task needs and leave the rest.

Finally, who designs. Ronacher keeps system design, schema and architecture for himself and uses the agent as a sounding board. I lean the same way for anything long-lived: decisions about data models and boundaries should be made by someone who will be around to live with them.

## Recommendation: briefs, plans and tests

Write a brief for every non-trivial task, with acceptance criteria and an out-of-scope line. Keep implementation plans out of the long-lived parts of the repository, or give them an expiry: delete on merge. Put durable behaviour into tests. Only write a long-lived requirement when a test can't carry it, and give it an owner.

Don't skip the out-of-scope line. Agents are helpful in the way a keen labrador is helpful.

## Try this on your repository

1. Search your repository for planning documents: `plan`, `todo`, `design`, `spec`, `proposal` in file names.
2. For each, ask: is this a temporary plan, or an authoritative requirement? Who owns it? Does it still match the code?
3. Delete or archive the finished plans. For each requirement that's still true, check whether a test asserts it; if not, write the test, or record an owner.
4. Take your next agent task and write the brief using the template below. Afterwards, note whether the agent asked a question the brief should have answered.

**Brief template:** Goal (one sentence, user terms) · Change · Acceptance criteria (checks that can run) · Context (files, contracts, prior art to copy) · Constraints (what must not change) · Out of scope.

## Checklist

- [ ] Every non-trivial task gets a brief with acceptance criteria and an out-of-scope line.
- [ ] Ask the agent to restate the goal before it starts.
- [ ] Ask it to look for contradictions and gaps in the brief.
- [ ] Temporary plans are deleted or archived when the work merges.
- [ ] Durable behaviour lives in tests; long-lived requirements have an owner.
- [ ] Keep data model and boundary decisions for a human.
