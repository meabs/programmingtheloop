---
title: "Grilling or a good prompt? Does the skill beat a two-sentence instruction? (experiment GVP)"
description: "A follow-up to GRL. A two-sentence prompt asking the agent to list its open decisions with recommended answers, then wait, recovered as many of the rules only the developer knew as Matt Pocock's grilling skill (35 against 34 of 75), with about half the reading. Neither found rules the agent had no reason to suspect, and on tickets where one answer opens new questions, the first question was rarely asked. The developer was Claude following a fixed brief, not a real person."
date: 2026-11-01
summary: "Codex with gpt-5.6-luna, seven tickets on a small banking API, four ways to start: ticket only, the grilling skill, a two-sentence structured prompt, and \"at most three questions\". The prompt matched the skill (35 against 34 of 75 developer-only rule checks; non-inferiority supported, narrowly) with about 300 words to read instead of about 650. Grilling did not pull ahead on nested tickets, because the parent rules came up in only 4 of 30 nested interviews. Three questions did well on simple tickets and fell behind with more unknowns. The developer's answers came from Claude following a fixed brief, not a real person."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/2566ea355d25984f7eee3f9c29a9a4b7263aca68/2026-10-grill-vs-prompt"
draft: false
experimentId: "GVP"
question: "Does Matt Pocock's grilling skill recover more of the rules only the developer knows than a short prompt that makes the agent list its open decisions and wait, or than an interview capped at three questions? Does grilling's branch-by-branch walk win where one answer opens new questions, and what does each cost the developer?"
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI 0.157"
    model: "gpt-5.6-luna (hosted)"
    settings: "medium reasoning effort; one Codex session per run, each developer reply sent with codex exec resume; subagents on; bubblewrap sandbox; grilling skill pinned to mattpocock/skills 4ae2317"
runs: 140
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/2566ea355d25984f7eee3f9c29a9a4b7263aca68/2026-10-grill-vs-prompt/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/e33d6e203eb4163badfaf19b55b0f4bde6c6e09d/2026-10-grill-vs-prompt/README.md"
previewImage: "/guide-images/chart-grill-vs-prompt.png"
previewAlt: "Developer-only rules met, higher is better. Few flat unknowns, of 25: ticket only 0, grilling 21, structured prompt 21, three questions 19. Many flat unknowns, of 20: 0, 10, 9, 6. Nested unknowns, of 30: 0, 3, 5, 0."
topics:
  - skills
  - briefs
  - context
publishedOn: 2026-11-01
findings:
  - id: "GVP-1"
    statement: "A two-sentence structured prompt recovered as many developer-only rules as the grilling skill"
    metric: "developer-only rule checks met, counted only when the ticket's own tests passed (higher is better)"
    value: "35 of 75 (prompt) against 34 of 75 (grilling); 0 of 75 from the ticket alone"
    n: "15 distinct rules on 7 tickets, each checked in 5 runs per arm; the 75 checks are not 75 independent rules"
    detail:
      - "on the flat tickets, the prompt was no worse than grilling within the margin fixed in advance: −0.02 per rule, one-sided 95% lower bound −0.13 against −0.15 (pre-registered H1, supported narrowly)"
      - "the prompt took one round instead of 2.4–2.6, and the developer read 266–351 words per run instead of 599–718 (H4a, −337 words, Holm p = 0.0004)"
      - "almost every rule an arm missed was one its dialogue never raised: 41 of 41 for grilling, 39 of 40 for the prompt"
    limits:
      - "the developer was Claude following a fixed brief, not a real person; one agent, one small repository, one wording of the prompt"
      - "non-inferiority held with little room: a lower bound of −0.13 against a −0.15 margin"
    source: "https://github.com/meabs/experiments/blob/2566ea355d25984f7eee3f9c29a9a4b7263aca68/2026-10-grill-vs-prompt/REPORT.md"
    status: current
    featured: false
  - id: "GVP-2"
    statement: "Grilling did not pull ahead on nested tickets, because the first rule in each chain was rarely found"
    metric: "developer-only rule checks met on the two nested tickets (higher is better)"
    value: "3 of 30 (grilling) against 5 of 30 (prompt) and 0 of 30 (three questions)"
    n: "2 tickets, 6 rules, 5 runs per arm"
    detail:
      - "pre-registered H2 (grilling beats the prompt on nested tickets) not supported: −0.20 rules per run, Holm p = 1.0"
      - "the parent rules came up in 4 of 30 nested interviews; on the account-closure ticket no run in any arm asked what happens to money left in the account"
      - "on the goodwill-credit ticket the parent came up only when the agent recommended \"no maximum amount\" and was corrected; once it was known, both grilling and the prompt asked about the follow-on rules"
    limits:
      - "nesting was hardly tested: the comparison is between formats that mostly never reached the nested part"
    source: "https://github.com/meabs/experiments/blob/2566ea355d25984f7eee3f9c29a9a4b7263aca68/2026-10-grill-vs-prompt/REPORT.md"
    status: current
    featured: false
  - id: "GVP-3"
    statement: "Capping the interview at three questions did well on simple tickets and fell behind with more unknowns"
    metric: "developer-only rule checks met (higher is better)"
    value: "19 of 25 on the few-unknown tickets (grilling 21), 6 of 20 on the many-unknown ticket (grilling 10), 0 of 30 on the nested tickets"
    n: "7 tickets, 5 runs per arm"
    detail:
      - "the developer read 70–101 words per run, against 599–718 for grilling (H4b, −567 words, Holm p = 0.0004)"
      - "grilling against three questions on the harder tickets: +0.47 rules per run, Holm p = 0.17, no measurable difference at this size (H3 not supported)"
      - "three questions asked open questions without recommended answers, so its rules came from the developer's answers rather than corrections"
    limits:
      - "the many-unknown result is one ticket"
    source: "https://github.com/meabs/experiments/blob/2566ea355d25984f7eee3f9c29a9a4b7263aca68/2026-10-grill-vs-prompt/REPORT.md"
    status: current
    featured: false
---

## Question

[Grill me first? (GRL)](/experiments/grilling/) found that Matt Pocock's `grilling` skill recovered the rules only the developer knew, and that a one-line "ask me anything first" never asked a question. A reviewer pointed out what that didn't show: whether you need the *skill*, or whether a short instruction that makes the agent list its open decisions and wait gets the same result.

So this experiment puts the skill against two plain prompts. Following the backlog rule, the tickets were built so that grilling *should* win somewhere: on tickets with many unknowns, and on nested ones, where one answer opens new questions and the skill's one-branch-at-a-time walk should reach decisions a single list can't.

**The short answer:** a two-sentence prompt did what the skill did, with half the reading. Neither found rules the agent had no reason to suspect, and nesting wasn't where the skill pulled ahead: on the nested tickets the first question was rarely asked at all. The developer here was Claude following a fixed brief, not a real person.

## The four ways to start

<figure class="guide-figure">

<img src="/guide-images/grill-vs-prompt-1-openers.png" alt="Four ways to start the agent on the same ticket. T, ticket only: nothing added, the agent builds straight away. G, grilling skill: 'Grill me on this before you build it.' with the skill installed; it walks the design tree one branch at a time with a recommended answer to each question. S, structured prompt: 'Before writing any code, list every decision this ticket leaves open that you can't settle from the code, each with your recommended answer. Then stop and wait for my reply.' K, three questions: 'Before writing any code, ask me at most three questions: the ones whose answers would change the code most. Then stop and wait for my reply.' Per run: rounds 0, 2.4 to 2.6, 1.0 to 1.2, 1; questions 0, 10 to 13, 8 to 10, 3; words to read 0, 599 to 718, 266 to 351, 70 to 101; rules met of 75: 0, 34, 35, 25. Example from an S run on the goodwill-credit ticket: the agent recommended 'add no unspecified maximum'; the developer replied 'Yes on the decimals. No maximum, but anything over £100 needs approving before it's paid.'" width="1800" height="1150" loading="lazy" />

<figcaption>The openers are quoted exactly. The example is from a real run.</figcaption>

</figure>

The structured prompt does in one list what grilling does over several rounds: name each decision the ticket leaves open and recommend an answer, so the developer can reply "yes" to most and correct the rest. The three-question cap is the cheapest interview that still makes the agent stop and ask.

## Prediction

Before any run I published the design and four hypotheses ([README.md](https://github.com/meabs/experiments/blob/e33d6e203eb4163badfaf19b55b0f4bde6c6e09d/2026-10-grill-vs-prompt/README.md)):

- **H1.** On flat tickets, the structured prompt is no worse than grilling by more than 0.15 in the share of developer-only rule checks met.
- **H2.** On nested tickets, grilling beats the structured prompt.
- **H3.** On the many-unknown and nested tickets, grilling beats the three-question interview.
- **H4.** The structured prompt (H4a) and the three questions (H4b) make the developer read fewer words than grilling.

## Set-up

**The agent:** Codex CLI 0.157 with hosted `gpt-5.6-luna` at medium effort, in a bubblewrap sandbox, the same rig as GRL. Each run was one Codex session, with every developer reply sent back into it. Each agent made its code changes in its own throwaway copy of the repository.

**The work:** seven tickets on [SEC-1](/experiments/sec-authz/)'s Spring Boot accounts API, with 15 rules that only the developer knew:

- **Few, flat unknowns:** GRL's four tickets with something left out, 5 rules.
- **Many, flat unknowns:** changing an account's daily limit, with four separate rules (support can only lower it; a £5,000 ceiling; savings accounts are fixed; an audit note).
- **Nested unknowns:** goodwill credits and approving account closures, 3 rules each. A parent rule (credits over £100 wait for approval; money left in an account has to be moved first) opens a part of the design whose two follow-on rules only come up once the agent knows it exists.

**The developer was Claude following a fixed brief, not a real person.** Each ticket had a private brief, written before any run, with GRL's reply rules (answer only what was asked; "yes" if it matches the brief; correct it if not) plus one for nesting: a question that touches a parent rule gets that rule in a sentence and nothing about its follow-ons. A separate judge model read every reply against its brief, looking for anything given away unasked.

**Scoring:** hidden tests per rule, counted only in runs that passed the ticket's own tests.

**Size:** 7 tickets × 4 arms × 5 runs = 140 runs, 105 of them interviews. The agent's bill for all 140 was $2.81 at list prices.

## Results

Findings GVP-1 to GVP-3 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-grill-vs-prompt.png" alt="Developer-only rules met, counted only when the ticket's own tests passed, higher is better. Few flat unknowns, of 25: ticket only 0, grilling 21, structured prompt 21, three questions 19. Many flat unknowns, of 20: 0, 10, 9, 6. Nested unknowns, of 30: 0, 3, 5, 0. All 15 rules, of 75: 0, 34, 35, 25. Structured prompt no worse than grilling on flat tickets: −0.02 per rule, lower bound −0.13 against a −0.15 margin. Grilling beats the prompt on nested: not supported. Grilling beats three questions: not supported, Holm p = 0.17. Words to read: the prompt about 337 fewer than grilling, three questions about 567 fewer, both Holm p = 0.0004." width="1800" height="900" loading="lazy" />

<figcaption>Source: github.com/meabs/experiments, 2026-10-grill-vs-prompt (Codex 0.157, gpt-5.6-luna, medium effort).</figcaption>

</figure>

### What each arm recovered

Developer-only rules met, as rule checks (rules × 5 runs), counted only when the ticket's own tests passed (higher is better):

| Tickets | Rules | Ticket only | Grilling | Structured prompt | Three questions |
| --- | --- | --- | --- | --- | --- |
| Few, flat | 5 | 0 / 25 | 21 / 25 | 21 / 25 | 19 / 25 |
| Many, flat | 4 | 0 / 20 | 10 / 20 | 9 / 20 | 6 / 20 |
| Nested | 6 | 0 / 30 | 3 / 30 | 5 / 30 | 0 / 30 |
| **All** | 15 | **0 / 75** | **34 / 75** | **35 / 75** | **25 / 75** |

All 140 runs passed their ticket's own tests.

- **H1, supported, narrowly:** on the flat tickets the structured prompt was within the margin fixed in advance (−0.02 per rule; lower bound −0.13 against −0.15).
- **H2, not supported:** grilling did not beat the prompt on the nested tickets; the prompt was slightly ahead (Holm p = 1.0).
- **H3, not supported:** grilling against three questions on the harder tickets, +0.47 rules per run, Holm p = 0.17: no measurable difference at this size.
- **H4, supported:** the developer read about 337 fewer words per run with the prompt and about 567 fewer with three questions (both Holm p = 0.0004).

**Missed rules were almost all ones the agent never asked about.** Among the rule checks each interview arm missed, grilling's 41 were all rules its dialogue never raised; the prompt's were 39 of 40, and three questions' all 50. When a rule came up and was answered, it was nearly always built.

### The nested tickets

<figure class="guide-figure">

<img src="/guide-images/grill-vs-prompt-3-nesting.png" alt="The nested tickets. N1, goodwill credits: the parent rule, credits over £100 wait for approval, came up in 4 of 15 interviews (grilling 1, prompt 3, three questions 0), each time because the agent recommended 'no maximum amount' and was corrected. Its follow-on rules, how approval works (met: grilling 1, prompt 2, three questions 0 of 5) and can't approve your own (1, 1, 0). N2, approving an account closure: the parent, money left in the account must be moved first, came up in 0 of 15; no agent asked what happens to a balance when its account is closed, so where the money can go and booking it on both accounts were never reached. The parent rules came up in 4 of 30 nested interviews, so the branch-by-branch walk was hardly tested. One flat rule was never found either: no run asked whether savings accounts' daily limits can change." width="1800" height="960" loading="lazy" />

<figcaption>A follow-on rule can only come up once its parent is known.</figcaption>

</figure>

The nested tickets were meant to be where grilling won. They didn't separate the formats, because the agents rarely found the branch to follow. On the closure ticket, no run in any arm asked what happens to money left in an account being closed. On the goodwill-credit ticket, the approval rule came up only when an agent recommended "no maximum amount" and was corrected. Once a parent was known, both grilling and the prompt went on to ask about its follow-ons. The limit was whether the agent thought to ask at all, not the shape of the interview.

### What it cost

Per run, means; ranges run across the three kinds of ticket (lower is cheaper):

| | Grilling | Structured prompt | Three questions | Ticket only |
| --- | --- | --- | --- | --- |
| Rounds the developer answered | 2.4–2.6 | 1.0–1.2 | 1.0 | 0 |
| Questions asked | 10–13 | 8–10 | 3 | 0 |
| Words the developer read | 599–718 | 266–351 | 70–101 | 0 |
| Words the developer typed | 34–70 | 39–60 | 27–51 | 0 |
| Agent wall time | 2.8–3.6 min | 1.4–1.7 min | 1.2–1.8 min | about 1 min |
| Agent cost, list price | $0.026–0.031 | $0.019–0.021 | $0.014–0.019 | $0.016–0.017 |

### Other things worth knowing

- **One rule was never found by anyone.** No run in any arm asked whether savings accounts' daily limits can change. The independent fairness check before the run had flagged it as unreasonable to expect, and the result agrees.
- **Grilling did worse on GRL's own tickets this time:** 21 of 25 here against 15 of 15 in GRL. The rule that support may only add internal notes came up in only 2 of 5 grilling runs. The skill's coverage varies from run to run more than GRL's three runs per cell showed.
- **Corrections drove the gain.** The developer corrected 26 recommendations in the grilling runs and 34 in the prompt runs. Three questions gave no recommendations, so there was nothing to correct.

### Checks

- **All 140 runs were graded,** none dropped. Every session ran `gpt-5.6-luna` at medium effort, and no agent saw the hidden tests or briefs.
- **The developer audit found no leaks in 103 of 105 interviews.** It flagged two three-question runs on the case-reassignment ticket, where the assignee rule was given in answer to a question about IDs that don't exist. Counting both as misses changes no hypothesis.
- **Eight interview turns hung** inside Codex's subagent `wait` call after posting their questions (7 grilling, 1 prompt); they were ended and answered as usual, as in GRL.

## Limits

- **The developer was Claude following a fixed brief, not a real person.** It knew every answer and corrected every wrong recommendation. This measures how well each format draws out what the developer knows, not how a real team arrives at requirements.
- **Nesting was hardly tested.** The parent rules came up in 4 of 30 nested interviews, so H2 compared formats that mostly never reached the nested part.
- **One wording each for the two prompts, one model, one repository, seven tickets, 15 rules, 5 runs per cell.** Non-inferiority held with little room.
- **I wrote the tickets and rules.** Two were found by nobody; removing them raises every format's score but doesn't change the comparison between formats.

## What this means: impact and risks

This part is my interpretation, not a measurement.

**The practical question isn't "skill or prompt" but "will the agent think to ask about this at all?"** Where it would (who may do what, what gets recorded), asking for a list of open decisions with recommended answers was enough, and the skill added rounds and reading without adding rules. Where it wouldn't (money left in an account, savings accounts being different), no interview format helped: the rule has to be in the ticket, the code or the docs.

**An interview feels thorough without being complete.** Grilling asked 10–13 questions per run and still missed the parent rule in 9 of its 10 runs on the nested tickets. The length of an interview tells the developer nothing about what wasn't asked.

**The gaps are shared.** The formats found the same rules and missed the same ones. Relying on any interview for rules like the ones nobody found is relying on luck.

## Configuration recommendations

For developers and teams using an agent on tickets. Each says how strong its evidence is.

| Recommendation | Why | Strength |
| --- | --- | --- |
| Before an agent builds from a ticket, ask it to list the open decisions with recommended answers and wait | Matched grilling (35 against 34 of 75) with half the reading | Strong on flat tickets: pre-registered non-inferiority; descriptive overall |
| Read each recommendation and correct the wrong ones | Nearly every recovered rule came from a question, most from a corrected recommendation | Descriptive, consistent with GRL |
| For quick tickets with one or two unknowns, "at most three questions" is a cheap option | 19 of 25 against 21 of 25, with about 80 words to read | Descriptive |
| Don't cap the questions on tickets with many unknowns | Three questions met 6 of 20 on the many-unknown ticket, against 10 and 9 | Descriptive, one ticket |
| Write down the rules an agent wouldn't think to ask about (special account types, what happens to money) | No run found the closure parent rule or the savings rule | Descriptive |
| Installing the grilling skill is optional, not required | No measurable advantage over the prompt here, and more reading and time | Descriptive; one model |

The prompt, to copy:

> Before writing any code, list every decision this ticket leaves open that you can't settle from the code, each with your recommended answer. Then stop and wait for my reply.

## What would be worth testing next?

These are proposals, not results.

- **Nested tickets whose parent rule an agent reliably raises,** so the follow-on questions are actually tested.
- **The same prompts on a second model** (including Claude), to see whether the prompt matching the skill is a property of Luna.
- **A real developer** answering the same briefs, including wrong and uncertain answers.
- **A prompt that asks the agent to check its open decisions against a short list of usual gaps** (money, account types, audit trail), to see whether a checklist finds what interviews miss.

## Reproduce

Everything is in [experiments/2026-10-grill-vs-prompt](https://github.com/meabs/experiments/tree/2566ea355d25984f7eee3f9c29a9a4b7263aca68/2026-10-grill-vs-prompt):

- the tickets, developer briefs, hidden tests, reference implementations and driver (`tasks/`, `hidden/`, `reference/`, `scripts/`);
- the fresh reader's fairness check of the new tickets (`checks/brief-check.md`);
- per run: every developer reply with its rule labels, the agent's messages, the grade, the audit and the diff (`results/main`, `results/pilot`);
- the analysis, checks and diagrams.

The Codex homes, which hold the login, are not published. The commands are in REPORT.md, section 10.
