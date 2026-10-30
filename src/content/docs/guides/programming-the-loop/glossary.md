---
title: "Glossary"
description: "From Programming the Loop — Glossary."
---

<p class="guide-edition-note">Free to read on the web. <a href="/resources/">October 2026 PDF</a> · <a href="/updates/">Updates</a></p>

**Acceptance criteria.** Checks that define when a task is done.

**Agent (coding agent).** A model that runs tools in a loop to achieve a goal, until it judges the goal met.

**AGENTS.md.** A conventional instruction file at a repository's root, read automatically by many agent tools.

**API contract.** A machine-readable interface description (for example OpenAPI): routes, parameters, fields, responses.

**Arm.** One variant in a controlled trial.

**Back pressure.** Huntley's term for checks that push back against invalid output.

**Blast radius.** Who and what is affected if a change is wrong.

**Bootstrap interval.** A range estimated by resampling results; if a cost-ratio interval includes 1.00, there's no clear difference.

**Brief.** A temporary statement of one task: goal, acceptance criteria, context, constraints, out of scope.

**Claim honesty.** Whether the agent's report matches its own command log: what it ran and what output it got.

**Code graph.** A queryable index of structural facts (calls, inheritance) generated from source.

**Context window.** The model's currently available, task-specific working context: prompt, loaded instructions, opened files and command output. Distinct from the model's learned knowledge and from external state reachable with tools.

**False pass / false fail** (`false_pass`, `false_fail`). AgentTrialRig's labels for the agent's claimed result set against the independent check: *passed* claimed on a change the check fails, or *failed* or *not-run* claimed on a change it passes. These measure whether the report was right about the change, not whether it was honest ([Chapter 5](/guides/programming-the-loop/proof-not-promises/)). [AgentTrialRig v0.7.0](https://github.com/meabs/AgentTrialRig/releases/tag/v0.7.0) and later use false_pass/false_fail; earlier versions used overclaim/underclaim.

**Freshness gate.** A check, outside the knowledge itself, that the knowledge matches the version of the thing it describes. It checks declared versions, not behaviour.

**Friction note.** A one-line report by an agent of something that blocked or slowed it.

**Gradual disclosure.** Load a small index first; fetch task-specific context only when needed.

**Guide (OKF bundle).** A generated folder of reference pages describing a codebase, each fact citing its source.

**Harness.** Everything around the model that makes it work in your environment: instructions, tools, scripts, checks, sandboxes.

**Implementation correctness.** Whether a change is right, judged by comparing the work with an independent check (hidden tests that exercise behaviour through the public interface, contract tests or live tests), not with the agent's report.

**Lethal trifecta.** Willison's term for an agent combining private data, untrusted content and external communication.

**Overclaim / underclaim.** In this book, a report that says more than the agent's own command log supports (*passed* when the tests failed or never ran), or less (*failed* when the log shows a pass).

**Prompt injection.** Instructions hidden in content an agent reads, which it may follow as if they came from you.

**Reversibility.** How easily and completely a change can be undone.

**Skill.** A task-scoped instruction file for one recurring kind of job.

**Stale knowledge.** Documentation or generated facts that no longer match what they describe.

**Unverified.** A change the agent truthfully reports it could not check. Not a dishonest claim.

**Verification status.** What the command log shows the agent's own checks did: passed, failed or not run.

**Worktree.** A Git feature giving several working directories, each on its own branch, from one repository.
