---
title: "6. The harness and the friction loop"
description: "From Programming the Loop — 6. The harness and the friction loop."
---

<p class="guide-edition-note">Free to read on the web. <a href="/resources/">October 2026 PDF</a> · <a href="/updates/">Updates</a></p>

Agents trip over the same few things again and again: an undocumented migration, a generated directory missing from a fresh checkout, a contract they can't find. Most of it is invisible unless you read transcripts all day. That's why the system around the agent (its instructions, scripts, checks and sandboxes) matters more than any single prompt, and why it deserves the treatment you'd give any production system. Measure where it fails and fix the cause at the strongest level available. In practice that means making the agent report its friction, grouping the reports, and fixing the repeats, in code first and prose last.

## Where to put a fix

@poteto offers the clearest ordering I know, from most to least preferred:

“1. categorically eliminate the problem through better architecture or choice of data structures 2. turn it into a lint rule or test so CI catches it 3. turn it into a skill or rule 4. have humans review the code to catch it (ngmi)” (lauren (@poteto), [post on X, 16 Aug 2026](https://x.com/poteto/status/2089067865098113024))

("ngmi": "not gonna make it".) Her summary is one of the best lines in the field: “the best rules are in your code.” (lauren (@poteto), [post on X, 18 Jul 2026](https://x.com/poteto/status/2078527882499150286))

<figure class="guide-figure">

![The inverse pyramid of guardrails](/guide-images/fig-inverse-pyramid.png)

<figcaption>Figure 6.1. The inverse pyramid of guardrails. The widest, strongest layer is the code itself; human review is the narrowest and last resort. Redrawn from the four-level list in @poteto's post on X (16 August 2026).</figcaption>

</figure>

Architecture and types can't be ignored. A test or lint rule runs every time and fails loudly. A rule in a skill or `AGENTS.md` is read *sometimes* and followed *usually*. Human review is slow and tired by Thursday afternoon. Mitchell Hashimoto, who coined the term *harness engineering* that I've borrowed, does both halves: he adds a line to `AGENTS.md` when the agent repeats a mistake, and he builds actual programmed tools, such as scripts for screenshots and filtered tests. My data says the second half is where the durable wins are.

## How the friction loop works

AgentFrictionLoop grew out of watching trial transcripts late at night and realising that agents are far too polite. An agent would hit a broken test setup or a missing database migration, burn six turns and a hundred thousand tokens figuring out a workaround, get the tests green, and report back with a cheerful "Done!". Unless I happened to read the raw transcript, I had no idea the repository had tripped it up, which meant the very next session tripped over the exact same stone. I wanted the agent to leave a one-line note on the workbench whenever the yard slowed it down, without turning every commit into an interrogation.

[AgentFrictionLoop](https://github.com/meabs/AgentFrictionLoop) makes agents report their own friction:

1. **The agent leaves a note.** `AGENTS.md` asks: if something blocked or slowed you down, even if you worked around it, run one command with a one-line note before you finish. Nothing went wrong? Write nothing.
2. **A git hook files the note against the commit.** A background `post-commit` hook builds a small JSON record: changed paths, line counts, a fingerprint of the guidance files and the session's notes. No code, prompts, commit messages or names.
3. **Records travel with the repository** on a hidden `fbl-insights` branch, synced by a `pre-push` hook. Hooks never block a commit or push.
4. **A weekly review groups the records** and opens an issue only when the same gap recurs across several sessions and more than one person.
5. **A person fixes the cause** in a normal pull request. Nothing edits the repository automatically.

Each note has an **origin**, which decides who can fix it: `repository-discovery` (it exists but couldn't be found), `task-context` (the brief lacked something), `execution-environment` (a prerequisite or ordering), `verification` (no fast way to check the change), `conflicting-knowledge` (two sources disagree).

<figure class="guide-figure">

![The friction loop](/guide-images/fig-friction-loop.png)

<figcaption>Figure 6.2. The friction loop. Agent notes become commit-linked records on a hidden branch; a weekly review opens an issue only for recurring gaps; a person fixes the cause in a normal pull request. Redrawn from the data-flow diagram in the AgentFrictionLoop README.</figcaption>

</figure>

## One recurring problem, from first note to elimination

Here is the full walk-through of a single recurring problem, the FastAPI test database that had no tables until migrations ran, from first symptom to the note disappearing. It combines my Friction Loop assessment report (30 September 2026; unpublished), the [AgentFrictionLoop README](https://github.com/meabs/AgentFrictionLoop/blob/fa2412f66ab3c86be6c9772e30c6b021735683d2/README.md) and the [AgentTrialRig README](https://github.com/meabs/AgentTrialRig/blob/e54514ae9575c3f878031cce4fc45fcfc749f409/README.md). Every note quoted is agent-written, copied from the stored records.

**Step 1: the first signal was mislabelled.** The first version offered seven overlapping categories. The same root cause was filed as *environment* three times and *setup* once. That's the damaging case: "environment" means no document could have helped, so three of four notes pointed *away* from a real documentation gap. *Fix to the instrument, not the repository:* one test question, "would one sentence in AGENTS.md or the docs have prevented this?", and five options instead of seven.

**Step 2: the signal became consistent.** In the second batch (eight sessions, two agent tools, two sessions per cell), the four sessions on the original docs, and only those, filed the same category. Two of the notes, verbatim:

```text
Codex:  "Backend tests failed before collection because the configured database had no
         tables; applying existing Alembic migrations fixed the setup."
Cursor: "Backend tests initially failed because PostgreSQL schema was not migrated;
         running Alembic upgrade head fixes the setup."
```

Each session's note, or silence, was checked against what the transcript showed: **8 of 8 agreed**. For the Codex sessions there was an independent signal in the same record (test attempts exiting 1, 1, then 0); the Cursor notes stood alone, because Cursor records carried no command data.

**Step 3: the review turned notes into one finding.** Across the eight records the weekly review produced one established recommendation, F-003: the friction in 4 sessions, 3 distinct actors, 50% actor share, proposed change *"document the required test and verification order, including prerequisites"*. The same gap seen from the command side (first test run failed in 2 sessions) stayed "Not established", below the evidence threshold of three. One agent's bad day doesn't become advice.

**Step 4: the first fix was prose, and it half worked.** In the same batch, the four sessions on a version of the docs that stated the migration step filed no such note. The F-003 recommendation was then applied in the sandbox repository: one file, 10 lines added and 3 removed, giving the `verify-work` skill one ordered migrate-then-test block. But in the AgentTrialRig trial on the same project, agents told the order in `AGENTS.md`, even with sharpened wording, still sometimes ran the tests before migrating (1 of 3 runs filed a note in each prose arm).

**Step 5: the second fix was a script, and it eliminated the problem.** The arm whose `backend/scripts/test.sh` applied the migrations itself filed **0 of 3** notes, and its runs averaged 7.7 turns against 15.3 for the original ([Chapter 5](/guides/programming-the-loop/proof-not-promises/) has the table). The tool now drafts that script for you: `fbl-doctor suggest` reads the documented test steps and adds what the docs leave out. On the same project its output was:

```sh
#!/usr/bin/env bash
# Generated by `fbl-doctor suggest`: one command that prepares the environment and runs the tests.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
cd backend
uv run alembic upgrade head
bash scripts/test.sh "$@"
```

**Step 6: confirm it stays gone, and look for the next one.** `fbl-doctor triage` over the 26 notes from the benchmark's FastAPI runs put this gap at the top (*5 sessions, 7 notes*, "the database has no tables; usual fix: run the migrations before the tests, in the same command"), followed by a Mailpit service not running for end-to-end tests (3 sessions) and the missing generated frontend directory (2 sessions). That's the backlog, ranked by how often agents hit it.

So the loop works end to end on one machine. Careful wording turned inconsistent notes into a usable signal, and the strongest fix was the one highest up the pyramid. I can't claim it generalises: two sessions per cell, one operator, simulated personas, one task on one repository. The GitHub workflow half was later exercised in a private test repository with a simulated agent commit, not with a team; and no team has yet acted on an issue and watched the notes stop.

## Finding gaps before the agent does

`fbl-doctor` checks a repository with no model calls: a missing or undocumented test command, an `.env.example` with no instruction to copy it, a database or migrations the instructions never mention, code that reads a git-ignored generated directory. On the FastAPI project it reported, with no agent run at all, the gaps agents later filed notes about. Run on eight other public repositories, its first version produced two false findings that were then fixed; on six of them it reported only that no instruction file names the test command. Pattern checks find the common gaps cheaply, but not all of them.

## Worked example, stage 6: record friction and improve the tooling

In the worked example, the one thing that slowed the change down was the live check: nothing in `storefront-api` says how to run it against a real inventory service, so both services had to be started separately. The worked example installs AgentFrictionLoop into the repository and files that friction as an agent would. This is the command `reproduce.sh` runs from inside `storefront-api/`; here the one-line note is built in two halves so that it fits the page and still pastes as one argument:

```sh
note="no documented way to run storefront against a live inventory service; "
note+="started both with uvicorn by hand to check real behaviour"
./.fbl/bin/fbl-friction --origin verification "$note"
```

Its real output:

```text
friction recorded: verification / test-order
```

After the next commit, the hook writes a record to the hidden branch (real output, abridged: the record's `diff_stats` field is left out):

```json
{
 "friction": [
  {
   "category": "test-order",
   "origin": "verification",
   "source": "event",
   "text": "no documented way to run storefront against a live inventory service; started both with uvicorn by hand to check real behaviour"
  }
 ]
}
```

`fbl-doctor` on the same repository reported `nothing found`: the test command is documented and there's no database or generated directory. So this gap is one only a friction note would reveal, not a pattern check. Applying the pyramid, the improvement is a command rather than another sentence in `AGENTS.md`: move the worked example's `run_live.sh` into the repository as `scripts/live_check.sh`, with its paths made relative to the repository, and name it in `AGENTS.md`. `run_live.sh` already waits for both services and exits non-zero when any response isn't the one the contract promises, so the moved script would be a check an agent can run as well as a demonstration. *That last step is described, not run:* in the companion repository the live-check script still lives one level up, outside the repository, and `scripts/live_check.sh` does not exist.

## Watching, self-reports and privacy

Hashimoto and Huntley learn by watching their agents closely, and Huntley argues that is where your own learning comes from. That works for one person; a team can't read every transcript, and reporting is one way to get the signal. Either way a human decides the fix.

Self-reports are leads, not evidence. Agents are poor at noticing some kinds of friction: in the assessment, one session failed the lint step in CI but filed only a test-order note, and agents rarely spot contradictions between docs and code unprompted. Use friction reporting alongside CI, never instead of it.

Make privacy a deliberate decision. Records store a pseudonymous actor id (a salted hash of the author's email) so distinct people can be counted; anyone holding the salt can test a guess, so it's **not anonymous**. Agree retention and access before publishing records to a shared branch.

## Recommendation: the minimum viable friction loop

The minimum viable friction loop needs no tool: ask agents to report blockers in one line with one classifying question, collect the notes, read them weekly, fix each repeated cause **as high up the pyramid as you can**, and check that the note stops. If it doesn't stop, the fix didn't work, and it's back to the drawing board.

## Try this on your repository

1. Add this to `AGENTS.md`: *"If something blocked or slowed you down, even if you worked around it, add one line to `FRICTION.md` before you finish: where the problem started (discovery, brief, environment, verification, conflicting docs) and what fixed it. Write nothing if nothing went wrong."*
2. Run your normal agent work for a week.
3. Group the lines by cause. For the most frequent, write down the fix at each level of the pyramid: architecture, check, script, skill or rule, review.
4. Implement the highest one you can. Run the same kind of task three more times and see whether the line comes back.

## Checklist

- [ ] Fix recurring problems in architecture first, then checks and scripts, then skills and rules, then review.
- [ ] Ask agents to report what slowed them down, in one line, with one classifying question.
- [ ] Treat self-reports as leads; act on repeats across sessions and people.
- [ ] Never let instrumentation block a commit; pseudonymous isn't anonymous.
- [ ] Check a fresh clone for undocumented prerequisites before an agent hits them.
