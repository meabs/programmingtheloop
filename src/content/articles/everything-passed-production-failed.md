---
title: "Everything Passed. Production Failed."
description: "I gave separate AI agents separate tickets on a small estate of services. Every change was correct and every build was green. Released together, none of the 25 hazard changes in the independent arm was safe."
date: 2026-11-26T11:00:00+00:00
summary: "Every agent did its job and every build went green, and the estate still broke on release. What I measured, what fixed most of it, and what didn't."
draft: false
topics:
  - parallel
  - verification
---

*A note before I start. I've got mild dyslexia, so I use AI tooling to help with my writing. Claude Code drafted this from the experiment's results, in my voice, and I've gone through it. Claude Code also built the experiment itself, the estate, the release simulator, the oracle and the gate, and ran it. I proposed the idea and approved the design in outline. The thoughts are mine, and the numbers all come from the [experiment page](/experiments/release-transition/) and its report.*

You know the sort of release where nobody did anything wrong.

The developer's change was fine. The tester's tests were fine. The other team's change was fine. Then both went out on the same Thursday and the whole thing fell over, and the post-mortem was people explaining, correctly, that their bit worked.

That's the thing I wanted to see with AI agents, because we're all about to hand them tickets in parallel. So I built a small estate, handed out tickets, and watched.

## Three kinds of correct

It helps to have names for this, so here's mine. It's my framing, not a standard.

- **Change correctness.** Does this one change do what its ticket says, and do its tests pass? We're good at this: tests, CI, review.
- **Composition correctness.** Do changes made separately work together once they're all in? Integration tests and contract tests aim at this one.
- **Transition correctness.** Does the estate stay safe while it gets from the old state to the new one? That means the order things go out in, old and new versions running side by side, events still in flight, a rollout that fails halfway, and what's left behind after a rollback. It also means the business obligations still hold all the way through, not just that the services can talk to each other.

Most of the conversation about agents writing software stops at the first, with a nod to the second. This experiment is about the third, including the part of it that a compatibility check can't see: whether a promise to a customer survives the release.

## What I built

Four little Java services: customer, decision, ledger and notifier. Each runs as two instances, so a release means upgrading one instance, then the other, with the old and new versions live together for a while. Events arrive late. In every scenario a rollout fails halfway and gets rolled back, and then somebody retries it, because that's what happens on a Thursday.

Two agents each get a ticket for a different service. They can't talk to each other. Each one has to make its change, get its tests passing and get through CI. Then the changes are released into the simulator and an oracle checks the final state of the estate. It doesn't read what the agents said happened. It looks.

There were five hazards, each a way that two correct changes can hurt each other: an event schema change, a database migration, retries and duplicates, consent, and a change to a decision model. There was also a control with no hazard at all, to check I hadn't built something that fails everything.

One detail matters for how you read the first result. Unless a plan says otherwise, the pipeline deploys the changed services in alphabetical order. That's an arbitrary convention, and several of the hazards bite in that order, so the independent agents' results depend partly on it.

## The result that made me sit back

I ran three set-ups, five times per scenario each.

**A:** independent agents, ordinary CI. They got the ticket and the contracts, same as a developer would.

**B:** the same, plus several things at once: they were told the other change existed (its ticket title), got a read-only copy of the other service, got a paragraph on rolling deployment, rollback and persisted state, and were asked to keep versions compatible and write down release constraints (order, what has to go together, whether to drain events first).

**C:** B, plus a gate that rehearses the release plan against a staging copy and says no if it finds trouble.

In A, 25 hazard trajectories out of 25 released something unsafe. Every one of the 25 had green CI first. Every one also did what its ticket asked. The control, with no hazard, was safe 5 out of 5, so the rig wasn't just failing everything.

I'd predicted about 25% safe. I hadn't expected a clean sweep.

There wasn't any nuance. They each did their job. The jobs just didn't add up.

## What fixed it

In B, 20 of the 25 were safe. I'd guessed 40%.

No new tool, no verifier. The agents knew the other change was coming, had been told what rolling deployment can do to old and new versions, and had somewhere to write down how their change had to be released.

I'm cautious about this. B bundles four things: read-only copies of the other services, the title of the other ticket, a paragraph on what rolling deployment, rollback and persisted state can do, and the instruction to write a release plan. Seeing the neighbour's code, knowing the neighbour's change exists, being told what kind of hazard to look for, and being asked to plan the release are four different interventions, and I didn't separate any of them. So I can't tell you which part did the work. It's one model on a toy estate, and five goes per cell isn't many. But +80 points isn't a rounding error either.

## What didn't

C, the one with the gate, was safe in 22 of 25. That's two better than B, and with 25 trajectories each I can't tell it from nothing (the interval ran from minus 4 to plus 20 points, and the corrected test said no measurable difference).

That isn't the same as the gate doing nothing. An interval that wide includes no benefit and it includes a benefit of 20 points. All I can say is that this experiment didn't show one.

It also cost some deliveries. This is counted per trajectory, meaning both tickets' requirements working: C delivered 23 of 25 trajectories, where A and B delivered all 25.

Be careful what you take from this. It's a result about this particular gate: a rehearsal of the release plan on a staging copy, with eight generic rules. It isn't a result about deterministic gates in general. A gate built around different hazards, or one the agents could run while they work, might do better, and I haven't tried either. The gate and the oracle came from the same author, simulator and list of hazards. That may flatter the gate on the hazards it was built around. It's a suspicion I haven't tested, not a proven limit on what a gate could do.

## The consent runs

The weak spot, for coordination and for the gate, was consent.

Consent is different from the other four. The event schema, the migration, the retries and the decision model are technical compatibility problems: two versions that can't talk to each other. Consent is a business invariant. The estate can be perfectly healthy, with every service up and every API honoured, and still do something it mustn't, which is send marketing offers to customers who haven't agreed to them. In a regulated business that's the kind of failure a regulator cares about, and no test of a single change will see it.

| Scenario | A (independent) | B (coordinated) | C (with the gate) |
| --- | --- | --- | --- |
| Event schema | 0 of 5 | 5 of 5 | 5 of 5 |
| Database migration | 0 of 5 | 5 of 5 | 5 of 5 |
| Retries | 0 of 5 | 4 of 5 | 5 of 5 |
| Consent | 0 of 5 | 1 of 5 | 2 of 5 |
| Decision model | 0 of 5 | 5 of 5 | 5 of 5 |

*Trajectories that were released safely, out of five per cell.*

In four of the five consent runs the gate rejected the first attempt. After one round of repair, all five ended up admitted, and three of the five still sent offers to customers who hadn't agreed. So the gate was satisfied and the oracle wasn't. This is the part of transition correctness that compatibility checks can't see: every service was up and every contract honoured, and a customer's refusal was still ignored for a while during the release.

I don't know why, and I want to be careful not to over-read it. The report shows the gate's rules were met while the hazard remained. It doesn't show that the agents were gaming the gate, and I wouldn't claim that. What it shows is that a gate is only as good as its rules, and that a repair loop which stops after one round can end in an admit with the problem still there. Why that happened in consent is the first thing I'd look at next.

## My own cock-up

The first full run was rubbish and I didn't notice for a bit. The tool that runs the agents kept copying my login for each run, the login refreshed itself in the middle of the batch, and the copies I'd thrown away took the new key with them. 163 of 180 agent sessions died with a login error.

I only spotted it because the cost per run was a tenth of the pilot's and the control scenario failed. I kept that data, labelled it invalid, fixed the runner and ran all 90 again after logging in fresh. It's in the report. Sorry to anyone else on my login whose session fell over.

The whole proper run cost $2.34. I've spent more on a bad pint.

## This isn't a new problem

The underlying difficulty is old. Amazon's Builders' Library has a [piece on ensuring rollback safety during deployments](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/), about software that has to work during the upgrade and after a rollback. Google's SRE Workbook has a chapter on [canarying releases](https://sre.google/workbook/canarying-releases/). Integration and contract tests, expand-and-contract migrations, progressive delivery and rollback compatibility are all established answers to parts of it.

What I was after is narrower: what happens when the people making the changes are agents who each see only their own ticket. There's related work on agents collaborating asynchronously, such as [AsynCodeBench](https://arxiv.org/abs/2609.32662), which, going by its abstract (I haven't read the paper), measures whether dependencies between agents' tasks get satisfied. I didn't find work that checks live business correctness across a deployment, but that was a quick search, not a literature review.

## What I think this means

This bit is opinion, not measurement.

We've spent twenty years getting very good at checking changes, and plenty of that practice does look past a single change. Contract tests, expand-and-contract and canaries exist because the problem is real. What none of it does by itself is know that somebody else is changing something else this week. In a human team, somebody half does: a release manager, a senior who remembers the last time, a Slack channel where somebody says "hang on, are we shipping the notifier as well?" Agents working in parallel haven't got a Slack channel, unless you give them one. In A, nothing in the pipeline told them the neighbour existed.

So if you're thinking of running several agents on one estate, the cheap thing to try first is not clever. Make sure each one knows what else is changing, tell them what the release can do to old and new versions, and make them write down how their change has to be released, in a place something else reads. In my small test that did most of the work.

The idea I'd like to take further from this is that the unit of assurance can't always be the pull request. Sometimes it has to be the transition of the whole estate. I'd call the pattern **release-aware agentic engineering**: a lightweight mechanism where agents working at the same time can discover each other's pending changes, declare what has to go before or after what, and name the business rules, like consent, that have to hold all the way through. It isn't an orchestration framework, and it isn't a team of agents pretending to be an engineering department. I haven't built it, and nothing here proves it works. It's a name for where B points.

After that, a check on the transition itself might help, but mine didn't prove it, and it's easy to build one that satisfies its own rules while the hazard is still there.

## What I haven't shown

- It's four small services, one fault pattern, one model, five runs per cell.
- I picked the scenarios because they hold a hazard. I haven't measured how often real changes do.
- Arm A deploys in alphabetical order by default, so its complete failure depends partly on that.
- B changes four things at once: peer source code, the other ticket's title, a hint about rolling deployment and rollback, and the instruction to plan. I don't know which did the work.
- The gate and oracle were built by the same AI agent, Claude Code, with the same simulator and list of hazards. That may flatter the gate on those hazards, which I haven't tested. Don't read C as what a gate does against surprises, and don't read it as what gates do in general. A wide interval that includes no benefit is not evidence that the gate has none.
- Delivery is counted per trajectory, both tickets together.

What I'd try next: building the release-aware mechanism properly and testing it against B, separating the four things B bundles, hazards the gate wasn't built around, a stronger model, agents that can run the gate while they work, and a closer look at why the consent repairs ended in an admit.

Everything is in the [experiment page](/experiments/release-transition/) and the [repo](https://github.com/meabs/experiments/tree/6cbd6220499ae898ea936c610b80cfd1b9fdec72/2026-11-release-transition), including the invalid run.
