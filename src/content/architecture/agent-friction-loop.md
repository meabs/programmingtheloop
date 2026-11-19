---
title: "Agent Friction Loop: Getting Coding Agents to Tell Me What Slowed Them Down"
description: "A small tool where coding agents leave a one-line note when a repository gets in their way, so a person can fix the docs."
date: 2026-10-25T12:15:00Z
summary: "Coding agents leave a one-line note when a repo slows them down, git hooks record it, and a weekly report shows the gaps worth fixing."
draft: false
topics:
  - harness
video:
  url: "https://www.youtube.com/shorts/VfXi64V_jWE"
  label: "Watch the short video"
---

*Quick note before I start. I've got mild dyslexia, so I use AI tooling to help with my writing, but the thoughts are all mine.*

I've spent a fair bit of time recently watching coding agents work through repositories, and the thing that kept catching my eye was how often they lose time to the same few things.

A migration nobody wrote down. A design doc that says one thing while the code does another. A contract that definitely exists but the agent can't find it.

What bugged me is that most of the time the agent just works around it and carries on. Or it fails, and you're left with a failed run and no real idea why. Either way the gap is still sitting there in the repo for the next agent (or the next person) to trip over.

I did wonder whether the agent could just tell me. It's the one that hit the problem after all.

## So I built a small loop

It came out of an experiment I was running on agent-ready repositories, and I've pulled it out into its own project, Agent Friction Loop. It's on GitHub if you fancy a look: https://github.com/meabs/AgentFrictionLoop

The idea is pretty simple. When something slows the agent down, it files a one-line note before it finishes, a git hook attaches that note to the commit, and once a week a report groups the notes so a person can fix the doc gap that keeps costing time.

Nothing edits your repository automatically. I was quite keen on that bit, I don't really want an agent quietly rewriting my docs based on one bad afternoon.

In practice it's:

- an installer that adds a small `fbl-friction` command to the project and a block to `AGENTS.md` telling the agent when to use it
- a `post-commit` hook that turns each commit, plus any notes, into a JSON record on a hidden `fbl-insights` branch
- a `pre-push` hook that syncs that branch
- a weekly GitHub Action that builds the report and only opens an issue when the same gap keeps coming back

Each note has an "origin", which is basically the agent answering one question, where did the problem start? There are five of them: it couldn't find something that exists, the task brief was missing something, the environment needed a step or a certain order, it couldn't run or didn't trust the checks, or two sources disagreed. The point is that the origin decides who can actually fix it. A badly written brief usually isn't something the repo can fix, so those notes are reported as informational rather than turned into a docs recommendation.

There's a fair bit of care around what gets stored. Notes are cut to 240 characters, anything that looks like a secret is dropped (so `password=hunter2` gets binned rather than recorded), and records never hold prompts, transcripts, file contents or commit messages. People are counted with a pseudonymous id. I should say that's not anonymous, anyone with the salt can test a guess, and the README says so too.

## What actually happened

I ran a small six-run trial with my other project, [AgentTrialRig](https://github.com/meabs/AgentTrialRig), on a FastAPI change task. Every agent given the friction instructions filed a note naming the blocker. The agents without them reported failure and left nothing that said why.

Here's a real one from a Codex run, word for word:

`pytest tests/api/routes/test_items.py could not collect because generated backend/app/frontend directory is missing; static checks were run instead`

Honestly, that one line is more useful than a lot of failed run logs I've waded through.

The bit that surprised me was what happened when I tried to fix things with better docs. Agents who were told the right order in prose still ran pytest first. An arm that just had one script to prepare the environment and run the tests filed no notes at all, and needed about half the turns.

So clearer wording on its own didn't help much, and having one script that just does it all did.

After that I added `fbl-doctor`, which tries to find the same problems before an agent hits them. It makes no model calls, which as a tight northerner I'm quite fond of. It checks a fresh checkout for things like an undocumented test command, migrations nobody mentions, or code that reads a git-ignored generated directory. It can also run the test command in a throwaway clone with a minimal environment, draft a single test script, and group the notes agents have already filed.

On the FastAPI project from the benchmark it found, with no agent run, the three gaps that agents later filed notes about. Grouping the 26 notes from those FastAPI runs gave 12 groups, and the top one was the database having no tables until the migrations ran (5 sessions, 7 notes).

Then I ran it on eight public repositories (Click, Flask, Express, Spring Petclinic, the NestJS TypeScript starter, a Django starter, the RealWorld Express app and the upstream FastAPI template), and that was a bit humbling to be honest.

The first version flagged Petclinic's optional `docker-compose.yml` as a needed database, and Django's `manage.py` as needing a migration before the tests. Both wrong. Petclinic's tests use an in-memory database and Django's test runner builds its own. Those are fixed now. On six of the eight it only reports that no agent instruction file names the test command, which is true but weak. The generated-directory and migration findings only showed up on the FastAPI template, which is where agents actually hit them.

The script it drafted for that template was run for real against a fresh database and the first version would have failed with `coverage: command not found`, because the project's tools live in the `uv` environment. It now adds `uv run` when there's a `uv.lock`, and the drafted script then migrated and passed all 58 tests.

The other bit that caught me out was the agent hooks. I added command capture, so each shell command's exit code gets recorded even when the agent doesn't bother filing a note. I checked it against live sessions in Claude Code, Cursor and the Copilot CLI, and every one of them differed from its documentation or from what a reasonable guess would be. Claude Code has no `exit_code` field at all. Copilot CLI sends a failed command through as `resultType: "success"`, and the exit code is only in the text. So much for reading the docs first.

Which is a bit ironic for a tool about docs not matching reality 😂

## What I'm not sure about

It's early (version 0.3.0) and there are definitely rough edges.

The big one is that notes are self-reported. An agent has to remember to file one, and it has to be honest about where the problem started. I'd treat them as leads unless a failed command or something in the transcript agrees. Agents are also poor at spotting contradictions unprompted, so I'd expect fewer "two sources disagreed" notes than there really are.

Small samples are another worry. Five origins split a small number of records pretty thin, so most findings stay labelled "Not established" until enough records, and more than one person, back them up. I'd rather that than one agent's bad day turning into advice.

Then there's the stuff I simply haven't tested properly yet:

- cloud agents (Copilot coding agent, Codex cloud, Cursor background agents) use commit trailers instead of the launcher, and that path has only been run with an agent-style commit I made myself, not a real cloud agent
- Windows passes CI, but it hasn't been tried on a developer's own Windows machine
- it refuses to install if `core.hooksPath` is set, so Husky and similar users are out of luck for now
- the doctor's checks are pattern-based and can be wrong, and triage groups by wording, so two notes about the same cause can land in different groups

What I'd really like to know next is whether fixing a doc actually makes its friction notes drop afterwards. That's on the roadmap, along with counting the sessions where verification failed and nobody filed a note, which should give some idea of how much goes unreported.

I'm running it on my own repos now, and it's already finding real issues, which is either a good sign for the tool or a bad sign for my repos.

If you do give it a go, feedback would be really useful, particularly on getting it installed alongside your existing hooks, whether the five origins make sense to you, and whether the weekly report points at things you'd actually go and fix.

Either way, I've now got agents filing complaints about my repositories. Feels a bit like being back at work 😁
