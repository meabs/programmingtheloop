---
title: "Cheat sheet"
description: "From Programming the Loop — Cheat sheet."
---

<p class="guide-edition-note">Free to read on the web. <a href="/resources/">October 2026 PDF</a> · <a href="/updates/">Updates</a></p>

![Cheat sheet: thesis and eleven chapter reminders from Programming the Loop](/guide-images/cheatsheet.png)

*Recommendations, not findings: the evidence and its limits are in the chapters. Full thesis wording is in the [Foreword](/guides/programming-the-loop/foreword/).*

**The thesis (short).** Right facts, not every fact. Executable verification, not reassuring instructions. Every layer must justify its existence.

**1 The argument.** Own every line. Ask of any practice: what facts, what check, what upkeep? Distrust single runs.

**2 Briefs.** Acceptance criteria and an out-of-scope line. Ask for a restatement. Temporary plans expire on merge; durable behaviour lives in tests.

**3 Facts.** Readable code: let the agent read it, "read the source to confirm". Unreadable dependency: versioned contract, then a short note. Graphs for multi-hop questions only. Freshness is a gate.

**4 The loop.** One verifiable change per step. Red first. Success, failure, danger and budget conditions.

**5 Verification.** One-command checks, prerequisites in the script. Run the checks where the agent can't edit them; a diff that touches a check stops the line for human review. Use it like a user. Correctness: the work against an independent check. Honesty: the report against the command log. An honest "not run" is information.

**6 Harness.** Code, then checks and scripts, then rules, then review. One-line friction notes; fix repeats; check they stop.

**7 Parallel.** One reliable agent first. Isolate files and state. Cloud agents don't isolate external databases, staging or queues.

**8 Review.** Grade by reversibility, blast radius and verification strength. Evidence before code.

**9 Tools.** Fast, quiet CLIs with clear errors. Measure with repeated runs and intervals.

**10 Safety and cost.** Break the lethal trifecta. Sandbox if you skip prompts. Blind search is the dearest thing an agent does.

**11 Adopt.** Default, Conditional, Experimental. Stage 0 first. Every new layer needs a failure it prevents and a retirement date.
