---
title: "7. Parallel agents"
description: "From Programming the Loop — 7. Parallel agents."
---

<p class="guide-edition-note">Free to read on the web. <a href="/downloads/">October 2026 PDF</a> · <a href="/updates/">Updates</a></p>

Parallelism multiplies whatever quality you already have. Ten riveters on one plate just get in each other's way. This chapter is deliberately short: none of my experiments measured parallel working as such, so what follows is judgement, other practitioners' experience, and one lesson from my own trials. Make one agent reliable on a kind of task before you run several, and when you do, spend your effort on **isolation**: each agent must see exactly what it should and nothing else.

*Terms:* a **subagent** is a separate session started by the main agent, with its own context window, which returns a summary; a **worktree** is a Git feature giving several working directories from one repository, each on its own branch; a **cloud agent** runs on a remote machine with its own copy of the repository and returns a branch or pull request.

## Isolation: files and state

The hard lesson: in my own trials, agents read other runs' files off the disk and cloned code from the internet when they could (the case study is in [Chapter 9](/guides/programming-the-loop/tools-measurement/), "Agents use whatever they can reach"). Agents use whatever they can reach, so you have to enforce what's reachable. Asking nicely doesn't work. If two agents can see each other's files, databases or outputs, they will eventually interfere, and you'll lose an afternoon working out why a test passes on one branch and fails on the other.

**In the worked example,** `run_live.sh` starts the inventory service on port 8001 and the storefront on 8000. Two agents running it at once would collide on the ports, and if the inventory service had a real database, they'd share its data. Making it parallel-safe means a port and a database per run, passed in through the environment. Nothing about that changes if the agents move to the cloud and both point at the same staging inventory service.

## Slop, shared state and cloud agents

@poteto, who runs many agents, puts the risk bluntly: “Naive parallelization just makes them write slop faster.” (lauren (@poteto), [X Article “How I Use Cursor” (25 May 2026)](https://x.com/poteto/status/2058975157503570132)) If one agent's work needs heavy cleanup, ten agents give you ten times the cleanup, and the bottleneck moves to you. Others deliberately run fewer. Mitchell Hashimoto, in early 2026, wasn't running multiple agents and didn't particularly want to; he runs one in the background while he works on something else, and kicks off low-risk research and triage at the end of the day to review in the morning. Huntley's Ralph is deliberately a single process doing one task per loop. None of that is timidity. Each position reflects how much verification that person has in place.

Armin Ronacher's advice is the practical core of this chapter: “Find a way to manage shared states like the file system, databases, or Redis instances so that you can run more than one.” (Armin Ronacher, [“Agentic Coding Recommendations” (12 Jun 2025)](https://lucumr.pocoo.org/2025/6/12/agentic-coding/)) @poteto goes as far as “worktrees are dead. cloud agents are the future.” (lauren (@poteto), [post on X, 13 Aug 2026](https://x.com/poteto/status/2087977008253071816)) Her set-up is one local coordinator spawning cloud subagents. A cloud machine per agent does fix *local* shared state (ports, the Docker daemon, caches, the file system) and lets each agent run a full environment. It does not fix *external* shared state. Two cloud agents pointing at the same staging database, message queue, object store or third-party sandbox still interfere. Those need isolation of their own: a database per run or schema per branch, namespaced queues and buckets, seeded fixtures, or a contract stub instead of the real dependency.

Simon Willison argues the main value of subagents is preserving the root context and offloading token-heavy work such as search and log reading. That fits [Chapter 3](/guides/programming-the-loop/right-facts/): keep the main session's working context small and relevant.

## The costs of coordination

Before parallelising, count them honestly, and don't kid yourself. **Review:** every agent's output needs reviewing, and ten small PRs are quicker to review than one huge one, but not quicker than three. **Merging:** parallel branches touching neighbouring code conflict, and a badly drifted branch is often cheaper to redo than to merge. **Environment:** each agent needs its own ports, database, credentials and caches. **Attention:** checking in on several agents is context switching, and that's expensive for you, too.

**Recommendation: a progression, not a jump.** Move on only when verification is strong enough that reviewing results, not supervising work, is the bottleneck: one supervised agent; one in the background; subagents for search and summarising; a few parallel agents on independent, well-specified tasks, each fully isolated; then a coordinator, human or agent, that assigns work from a plan and gathers results.

**Try this:** start two agents (or two shells) on two branches at once, each running your full test suite. Write down everything they shared (ports, the database, caches, temp folders, credentials, external services) and decide each one's isolation: per-run port, per-run database or schema, namespaced resource, or a stub. Check the external items separately; they stay shared even on cloud agents.

## Checklist

- [ ] Make one agent reliable on a task type before parallelising it.
- [ ] Isolate files *and* state: ports, databases, caches, credentials.
- [ ] Cloud agents isolate the machine, not external databases, staging or queues.
- [ ] Assume agents will use anything they can reach; enforce what's reachable ([Chapter 9](/guides/programming-the-loop/tools-measurement/)).
- [ ] Count review, merge and attention costs before adding agents.
- [ ] Keep one point of control.
