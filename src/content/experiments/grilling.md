---
title: "Grill me first? Does letting the agent interview you get you what you wanted? (experiment GRL)"
description: "Matt Pocock's grilling skill makes a coding agent interview the developer before it builds. On tickets that left out business rules, grilling recovered all 15 rules only the developer knew; working from the ticket, a plain \"ask me anything\" and a developer who said yes to everything recovered none. Grill-with-docs's glossary and decision records made no measurable difference to the next ticket. The developer was Claude following a fixed brief, not a real person."
date: 2026-10-31
summary: "Codex with gpt-5.6-luna, six tickets on a small banking API, five ways to start. Grilling met 15 of 15 requirements that only the developer knew; ticket only, \"ask me anything first\" (which never asked a question) and grilling with \"yes\" to everything met 0. The gain came entirely from the developer correcting one or two wrong recommendations per ticket. Grill-with-docs met 9 of 15, because a third of its runs built without waiting for answers, and its docs only helped a later ticket when the next agent happened to open them. The developer's answers came from Claude following a fixed brief, not a real person."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/f11cd1af04aa5f891054a3e35135965cd0824348/2026-10-grilling"
draft: false
experimentId: "GRL"
question: "When a coding agent interviews the developer before building (Matt Pocock's grilling skill), does it build more of what the developer actually wanted than working from the ticket, and is that from the skill, from being allowed to ask, or from the developer's answers? Do grill-with-docs's glossary and decision records help a later ticket?"
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI 0.157"
    model: "gpt-5.6-luna (hosted)"
    settings: "medium reasoning effort; one Codex session per run, each developer reply sent with codex exec resume; subagents on; bubblewrap sandbox; skills pinned to mattpocock/skills 4ae2317"
runs: 114
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/f11cd1af04aa5f891054a3e35135965cd0824348/2026-10-grilling/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/5f6403853819a623f605c3a7b46eb7a1c4435ec9/2026-10-grilling/README.md"
previewImage: "/guide-images/chart-grilling.png"
previewAlt: "Left-out requirements met on the Some and Lots tickets, higher is better. Only in the developer's head, of 15: grilling 15, grill-with-docs 9, ticket only 0, ask me anything 0, yes to everything 0. Findable in the repo, of 18: 17 or 18 in every arm."
topics:
  - skills
  - briefs
  - context
publishedOn: 2026-10-31
findings:
  - id: "GRL-1"
    statement: "Grilling recovered every requirement that only the developer knew; working from the ticket recovered none"
    metric: "requirements only the developer knew, met on the Some and Lots tickets, counted only when the ticket's own tests passed (higher is better)"
    value: "15 of 15 against 0 of 15"
    interval:
      low: "80%"
      high: "100%"
      method: "Wilson 95% interval on grilling's 15 of 15 (ticket only: 0% to 20%)"
    n: "30 requirement checks, 15 in each arm"
    detail:
      - "on the Lots tickets, grilling met 1.67 more left-out requirements per run than ticket only (pre-registered H1, Holm p = 0.017)"
      - "requirements findable in the repo were met in 17 or 18 of 18 runs in every arm; the whole difference is in the ones only the developer knew"
      - "on clear tickets every arm passed; grilling added only cost (about 500 words to read, 2–3 times the wall time)"
    limits:
      - "the developer was Claude following a fixed brief, not a real person; one agent, one small repository, 3 runs per cell"
    source: "https://github.com/meabs/experiments/blob/f11cd1af04aa5f891054a3e35135965cd0824348/2026-10-grilling/REPORT.md"
    status: current
    featured: false
  - id: "GRL-2"
    statement: "The gain came from the developer's corrections: grilling with \"yes\" to everything did no better than the ticket alone"
    metric: "requirements only the developer knew, met (higher is better)"
    value: "15 of 15 (answered) against 0 of 15 (\"yes\" to everything)"
    n: "30 requirement checks, 15 in each arm"
    detail:
      - "grilling against yes-to-everything: +1.25 per run, Holm p = 0.0004; yes-to-everything against ticket only: no difference (pre-registered H3)"
      - "yes-to-everything asked as many questions (8–9 per run); the developer corrected 1–2 wrong recommendations per run on the Some and Lots tickets"
    limits:
      - "a real developer may sometimes catch a wrong recommendation even when skimming"
    source: "https://github.com/meabs/experiments/blob/f11cd1af04aa5f891054a3e35135965cd0824348/2026-10-grilling/REPORT.md"
    status: current
    featured: false
  - id: "GRL-3"
    statement: "Telling the agent \"ask me anything you need to know first\" produced no questions at all"
    metric: "runs in which the agent asked the developer anything"
    value: "0 of 18"
    n: 18
    detail:
      - "every run said it needed no clarification and built straight away; it scored the same as ticket only"
    limits:
      - "one wording of the invitation; one model"
    source: "https://github.com/meabs/experiments/blob/f11cd1af04aa5f891054a3e35135965cd0824348/2026-10-grilling/REPORT.md"
    status: current
    featured: false
  - id: "GRL-4"
    statement: "Grill-with-docs's glossary and decision records made no measurable difference to a later ticket; they helped only when they held the rule and the next agent opened them"
    metric: "left-out requirements met on the follow-up ticket, docs against no docs (higher is better)"
    value: "17 of 27 against 15 of 27"
    n: 24
    detail:
      - "pre-registered H5 not supported: +0.17 per run, Holm p = 0.81"
      - "the carried-over rule was met in 2 of 12 docs runs, both on the ticket whose ADR file name matched the follow-up, and 0 of 12 without docs"
      - "grill-with-docs built without waiting for the developer's answers in 6 of 18 runs; one such run wrote an ADR stating the opposite of the developer's rule"
    limits:
      - "follow-ups started from the plain app, without the first ticket's code"
    source: "https://github.com/meabs/experiments/blob/f11cd1af04aa5f891054a3e35135965cd0824348/2026-10-grilling/REPORT.md"
    status: current
    featured: false
---

## Question

Every ticket leaves things out. The person who wrote it knows the business rule nobody wrote down, the decision from last month's meeting, the edge case that bit them before. An agent working from the ticket can only guess.

[Matt Pocock's `grilling` skill](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/productivity/grilling) turns that around: before it writes any code, the agent interviews you. Its sibling, `grill-with-docs`, does the same and also writes what was settled into the repository as a glossary and short decision records (ADRs). It's an attractive idea, and it costs the developer time. I wanted to know what the interview actually gets you, where that comes from, and when it's worth it.

**The short answer:** grilling recovered every rule that only the developer knew, but only because the developer corrected the agent's wrong guesses. A developer who just says "yes" gets nothing from it, and a plain "ask me anything" got no questions at all. The developer here was Claude following a fixed brief, not a real person.

## How grilling works

<figure class="guide-figure">

<img src="/guide-images/grilling-1-how-it-works.png" alt="Flow diagram. 1, the ticket plus 'Grill me on this before you build it'. 2, the agent maps the decisions as a design tree and looks up facts in the code itself. 3, a round of numbered questions, each with a recommended answer, for example Q1: who may freeze or unfreeze, recommendation: allow assigned support and tenant admins. The developer replies 'Yes' to accept, corrects a wrong one ('Not quite, only admins can unfreeze'), or says 'Your call'. 4, the next round, until the tree is settled: usually 2 to 3 rounds and 8 to 11 questions. 5, a summary, 'Yes, go ahead', and it builds; grill-with-docs also writes GLOSSARY.md and ADRs. Side panel: the recommendations were mostly right, but 1 to 2 per ticket were wrong, and they were exactly the rules only the developer knew; a developer who said yes to everything got the same result as no interview." width="1800" height="1060" loading="lazy" />

<figcaption>The question and correction are from a real run on the freeze-and-unfreeze ticket.</figcaption>

</figure>

The skill tells the agent to work through the decisions a ticket implies one branch at a time, ask everything it can ask now as numbered questions, give its own recommended answer to each (so the developer can just say "yes"), look facts up in the code itself rather than asking, and not start building until both sides agree. In practice that meant two or three rounds and eight to eleven questions per ticket in all, and most of the replies were one word.

## Prediction

Before any run I published the design and five hypotheses ([README.md](https://github.com/meabs/experiments/blob/5f6403853819a623f605c3a7b46eb7a1c4435ec9/2026-10-grilling/README.md)):

- **H1.** On the tickets that leave out the most, grilling meets more left-out requirements than the ticket alone.
- **H2.** Grilling against a plain "ask me anything first": no direction predicted.
- **H3.** On requirements only the developer knows, grilling beats grilling with "yes" to everything, and "yes" to everything is no better than the ticket alone.
- **H4.** On clear tickets, grilling is no better and costs more.
- **H5.** Grill-with-docs's docs help a later ticket done with nobody to ask.

## Set-up

<figure class="guide-figure">

<img src="/guide-images/grilling-2-experiment.png" alt="Six tickets: Clear (2) with nothing left out, Some (2) with 2 requirements left out, Lots (2) with 4. Each left-out requirement is either in the repo (findable in code or README) or in my head (only the developer knows it, for example 'support may only add internal notes'). Five ways to start the agent, 90 runs: T the ticket only; Q ticket plus 'Before you start, ask me anything you need to know'; G ticket plus 'Grill me on this before you build it'; GD ticket plus 'Use grill-with-docs on this'; GY as G but a script answers Yes to everything. The developer is Claude following a fixed brief, with a private brief per ticket and fixed reply rules; a judge model checked all 54 interviews and found no leaks. Stage 2: the next ticket in a fresh session with nobody to ask, 24 runs, 12 with the docs one grill-with-docs run wrote and 12 without." width="1800" height="1000" loading="lazy" />

<figcaption>Five arms on six tickets, then a follow-up ticket to test the docs.</figcaption>

</figure>

**The agent:** Codex CLI 0.157 with hosted `gpt-5.6-luna` at medium effort, in a bubblewrap sandbox. Each run was one Codex session, with every developer reply sent back into it.

**The work:** six new tickets on [SEC-1](/experiments/sec-authz/)'s Spring Boot accounts API. Two leave out nothing, two leave out two requirements and two leave out four. Each left-out requirement is either findable in the repository (a README convention, a pattern in the code) or exists only in the developer's head. An example of the second kind: when staff add notes to an account, support users may only add *internal* notes, because anything a customer sees counts as a message from the bank and has to come from an admin.

**The developer was Claude following a fixed brief, not a real person.** Each ticket had a private brief, written before any run, and fixed rules for replying: answer only the question asked; "yes" to a recommendation that matches the brief; correct one that doesn't; point to the code for questions about the code; "your call" for things the brief doesn't care about. Afterwards a separate judge model read every reply against its brief and the agent's message, looking for anything the replies gave away that the agent hadn't asked about. It found nothing in 54 interviews.

**Scoring:** hidden tests run after each session. The main score is **left-out requirements met**, counted only in runs that pass the ticket's own tests.

**Stage 2:** each ticket with something left out has a follow-up ticket, done in a fresh session with nobody to ask. Each follow-up quietly depends on one rule the first interview settled. Twelve runs got the glossary and ADRs that one grill-with-docs run wrote; twelve got nothing.

**Size:** 6 tickets × 5 arms × 3 runs = 90, plus 24 follow-up runs. The agent's bill for all 114 was $2.52 at list prices.

## Results

Findings GRL-1 to GRL-4 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-grilling.png" alt="Left-out requirements met on the Some and Lots tickets, higher is better. Only in the developer's head, of 15: grilling 15, grill-with-docs 9, ticket only 0, ask me anything 0, yes to everything 0. Ask me anything asked no questions in 18 of 18 runs; grill-with-docs built without waiting in 6 of 18. Findable in the repo, of 18: grilling 18, grill-with-docs 18, ticket only 17, ask me anything 18, yes to everything 17. Clear tickets: all 30 runs passed. Grilling against ticket only on the Lots tickets: +1.67 per run, Holm p = 0.017; against yes to everything: +1.25, p = 0.0004." width="1800" height="920" loading="lazy" />

<figcaption>All the difference is in the rules only the developer knew. Source: github.com/meabs/experiments, 2026-10-grilling (Codex 0.157, gpt-5.6-luna, medium effort).</figcaption>

</figure>

### What each arm built

Left-out requirements met, counted only when the ticket's own tests passed (higher is better):

| Arm | Clear tickets passed | Some: met / possible | Lots: met / possible | Only in the developer's head |
| --- | --- | --- | --- | --- |
| Ticket only | 6 of 6 | 5 / 12 | 14 / 24 | **0 / 15** |
| "Ask me anything first" | 6 of 6 | 6 / 12 | 15 / 24 | **0 / 15** |
| Grilling | 6 of 6 | 12 / 12 | 24 / 24 | **15 / 15** |
| Grill-with-docs | 6 of 6 | 9 / 12 | 20 / 24 | **9 / 15** |
| Grilling, "yes" to everything | 6 of 6 | 5 / 12 | 13 / 24 | **0 / 15** |

- **H1, confirmed:** on the Lots tickets grilling met 1.67 more of the 4 left-out requirements per run than the ticket alone (Holm p = 0.017).
- **H2:** "ask me anything" never asked anything, so it scored like the ticket alone.
- **H3, confirmed:** grilling beat "yes" to everything by 1.25 per run on the rules only the developer knew (p = 0.0004), and "yes" to everything was no better than the ticket alone (0 against 0).
- **H4, as predicted:** every arm passed the clear tickets; grilling only added cost there.

### What it cost

Per run, means (lower is cheaper):

| | Ticket only | Grilling | Grill-with-docs |
| --- | --- | --- | --- |
| Rounds the developer answered | 0 | 2.3–2.7 | 1.0–1.2 |
| Questions asked | 0 | 8–11 | 4–5 |
| Words the developer read | 0 | 486–704 | 247–272 |
| Words the developer typed | 0 | 17–85 | 8–40 |
| Agent wall time | about 1 minute | 2.5–6 minutes | 2–5 minutes |
| Agent cost, list price | $0.013–0.019 | $0.025–0.030 | $0.025–0.036 |

The ranges run from the Clear to the Lots tickets. Most of what Claude typed was "Yes." On the Some and Lots tickets it corrected 1–2 recommendations per grilling run, and those corrections were the whole gain.

### The next ticket: did the docs help?

<figure class="guide-figure">

<img src="/guide-images/grilling-4-docs.png" alt="Docs from stage 1, GLOSSARY.md and docs/adr, 12 sets. Gate 1, is the rule in them? 6 of 12 stated it; S1 0 of 3 because the agent built before the developer could answer; on L2 one ADR stated the opposite. Gate 2, does the next agent open them? 4 of 12 opened a doc; L1 3 of 3, where the ADR was named account-freeze-audit, matching the ticket's subject; S2 0 of 3 though all 3 had the rule. Result: carried-over rule met with docs 2 of 12, both L1, without docs 0 of 12. All left-out requirements: docs 17 of 27, no docs 15 of 27, no measurable difference, Holm p = 0.81." width="1800" height="900" loading="lazy" />

<figcaption>The docs had to pass two gates: contain the rule, and be opened.</figcaption>

</figure>

- **H5, not supported:** with the docs, 17 of 27 left-out requirements were met; without, 15 of 27 (Holm p = 0.81, no measurable difference).
- **The docs helped exactly where they held the rule and the next agent opened them.** That happened only on the freeze ticket, whose ADR was called `0001-account-freeze-audit.md`. On the case-closing ticket all three ADRs recorded the rule, and none of the follow-up agents opened them.
- **Docs can be wrong with authority.** A grill-with-docs run that built before the developer could answer wrote an ADR saying case assignees are stored "without resolving" them, the opposite of the developer's rule.

### Checks

- **All 114 runs were graded,** none rerun or dropped. Every session ran `gpt-5.6-luna` at medium effort, and no agent touched the hidden tests or briefs.
- **The developer audit found no leaks** in 54 interviews; in a dry run it had caught both leaks I planted on purpose.
- **Nine interview turns hung** inside Codex's subagent `wait` call after posting their questions; they were ended and answered as usual (amendment log).
- **Two runs failed their ticket tests** (ticket only and "yes" to everything, both on the case-closing ticket): the new route ended up under the existing `/api/cases` prefix.

## Limits

- **The developer was Claude following a fixed brief, not a real person.** A real developer forgets, knows more, gets tired of questions, and sometimes says yes without reading. The audit shows the replies didn't give away more than was asked; that still isn't a real person.
- **One agent, one small repository, six tickets, three runs per cell.** The large effects (15 of 15 against 0 of 15) are clear; the smaller ones, such as grill-with-docs against grilling, are description.
- **I wrote the left-out requirements.** A fresh reader checked them for fairness before the run, but which ones I chose shapes the result.
- **The follow-up tickets started from the plain app,** not from the first ticket's code, to isolate the docs. In real life the code would carry some of the rules.
- **The arms weren't fully blind.** The agents usually named their skill, so the developer could often tell which arm it was answering.

## What this means: impact and risks

This part is my interpretation, not a measurement.

**Grilling works for a narrow reason.** It creates a moment, before any code exists, where the developer corrects one or two wrong assumptions. On tickets that depend on unwritten business rules, that moment was worth everything; on clear tickets it was worth nothing.

**The recommended answers are a trap for busy people.** Because the agent's recommendations are usually right, it's tempting to say "yes" down the list. Doing that gave exactly the same result as never being asked, while feeling thorough.

**"Ask me if you need anything" isn't a substitute.** Given permission, this agent concluded every time that it didn't need anything.

**Written decisions only help if they're right and someone reads them.** Grill-with-docs sometimes wrote down its own guesses as decisions, and the next agent mostly didn't look.

## Configuration recommendations

For developers and teams using an agent on tickets. Each says how strong its evidence is.

| Recommendation | Why | Strength |
| --- | --- | --- |
| Use a grilling-style skill on tickets that depend on unwritten rules (who may do what, what the customer sees, what gets recorded) | 15 of 15 such rules recovered, against 0 of 15 from the ticket alone | Strong: pre-registered, Holm p = 0.017 and 0.0004 |
| Read each recommendation; the job is to spot the wrong one or two | "Yes" to everything recovered 0 of 15 | Strong: pre-registered, p = 0.0004 |
| Skip it on tickets that spell everything out | Every arm passed the clear tickets; grilling added reading and 2–3× the wall time | Descriptive |
| Don't rely on "ask me anything first" | 0 of 18 runs asked a question | Descriptive, one wording |
| With grill-with-docs, say "ask, then wait for my answers before building" | It built without waiting in 6 of 18 runs | Descriptive; the fix is untested |
| Point AGENTS.md at `GLOSSARY.md` and `docs/adr/`, and name each ADR after the rule it records | The docs helped only when the next agent opened them, and it opened only an ADR whose name matched its ticket | Descriptive; untested |
| Review ADRs an agent writes, like code | One recorded the opposite of the developer's rule | Descriptive |

## What would be worth testing next?

These are proposals, not results.

- **Real developers** answering the same briefs, to see how often people say yes without reading.
- **Grill-with-docs told to wait for answers,** to see whether it then matches grilling.
- **The follow-up ticket with an AGENTS.md line pointing at the docs.**
- **A larger repository,** where more of the unwritten rules leave traces in the code and asking matters less.

## Reproduce

Everything is in [experiments/2026-10-grilling](https://github.com/meabs/experiments/tree/f11cd1af04aa5f891054a3e35135965cd0824348/2026-10-grilling):

- the tickets, developer briefs, hidden tests, reference implementations, skills and driver (`tasks/`, `hidden/`, `reference/`, `arms/`, `scripts/`);
- per run: every developer reply with its rule labels, the agent's messages and event stream, the grade, the audit and the diff (`results/main`, `results/pilot`);
- the analysis, checks and diagrams.

The Codex homes, which hold the login, are not published. The commands are in REPORT.md, section 10.
