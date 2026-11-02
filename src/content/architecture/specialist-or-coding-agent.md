---
title: "Security Review: Specialist Agent or Your Coding Agent?"
description: "I planted 23 vulnerabilities across all ten OWASP Top 10 categories in a small web app, and had Codex and security agents built with Strands review it 70 times. A security-specialist prompt on one agent didn't beat plain Codex. A fixed team of specialists found half as many again of the hard ones. The same team, left to hand work between themselves, never ran half its specialists."
date: 2026-11-02T12:00:00+00:00
summary: "Same model, 70 reviews of an app with 23 planted vulnerabilities. Of the 14 hard ones, plain Codex found 7.1 per run, a Strands security specialist 5.8, and a fixed Strands team of specialists 10.9. A Swarm of the same agents found 4.4: two of its four specialists never ran. No false alarms with Luna, and two vulnerabilities nobody found."
draft: false
topics:
  - review
  - parallel
  - safety-cost
---

*Quick note before I start. I've got mild dyslexia, so I use AI tooling to help with my writing, but the thoughts are all mine.*

"Use a specialist agent for security" is advice I hear a lot. Give it a security-expert prompt, a checklist, the right tools, maybe a team of them, and it'll find what a general coding agent misses.

But coding agents already get asked "review this for security" every day. So I tested it: Codex as it comes, against security agents built with [Strands Agents](https://strandsagents.com), all on the same model.

## The 30-second version

| If you want | Then |
| --- | --- |
| A quick security pass | Your coding agent is as good as a single "security specialist" agent. Run it more than once |
| A thorough review | Split it between fixed specialists, one area each, in an order set in code, with a verifier at the end |
| Agents that decide among themselves who goes next | Don't. The swarm skipped half its specialists and found the least |

## The setup

**The app.** I wrote a small Flask shop API, about 1,200 lines, with **23 planted vulnerabilities** covering all ten [OWASP Top 10:2025](https://owasp.org/Top10/2025/) categories. 3 are easy, like a hardcoded secret key or `debug=True`. 6 are medium, and 9 are hard, like a second-order SQL injection through a stored display name. 5 are very hard, like a payment timeout that counts as "paid", or returns that can refund items already cancelled and refunded. There are also **6 decoys**: code that looks risky but is safe. Every vulnerability has a test that proves it against the running app, and the agents never saw those.

**Five reviewers,** all with the same task: "Review this repository for security vulnerabilities… Only report what you believe is a real vulnerability."

1. **Codex,** as it comes, in a sandbox with a shell.
2. **Codex + checklist:** the same, given the specialist's instructions and a running copy of the app.
3. **Strands specialist:** one agent with a security-reviewer prompt (a checklist following OWASP's categories, evidence required) and four tools: list files, read a file, search, and send requests to the running app.
4. **Strands team:** a recon agent maps the app; four specialists (injection; access control and auth; crypto, config and dependencies; logic, integrity, logging and errors) work in parallel; a verifier checks their findings and submits. The order is fixed in code, using Strands' `Graph`.
5. **Strands swarm:** the same six agents and prompts, but they choose who goes next by handing off, using Strands' `Swarm`.

All five used **gpt-5.6-luna** at medium reasoning effort. 10 runs each, plus the specialist and team with Qwen 3.7 Flash: **70 reviews for $2.09.** The design, the app and the pilot went up on GitHub [before the main run](https://github.com/meabs/experiments/tree/5af45184/2026-11-vuln-hunt).

## What happened

<figure class="guide-figure">
<img src="/guide-images/chart-vuln-hunt.png" alt="Left, hard and very-hard vulnerabilities found per run, of 14, mean with worst and best run, higher is better: Codex 7.1 (5 to 8), Codex plus checklist 7.8 (6 to 9), Strands specialist 5.8 (4 to 8), Strands team (Graph) 10.9 (9 to 12), Strands swarm 4.4 (0 to 7). Right, runs in which each agent ran, of 10, Graph team then Swarm: recon 10 and 10, injection 10 and 10, access control and auth 10 and 4, crypto, config and deps 10 and 0, logic, integrity and errors 10 and 0, verifier 10 and 9." width="1800" height="920" loading="lazy" />
<figcaption>Source: github.com/meabs/experiments, 2026-11-vuln-hunt.</figcaption>
</figure>

| Found per run (higher is better) | Hard + very hard, of 14 | All, of 23 | Cost per review |
| --- | --- | --- | --- |
| Codex | 7.1 | 11.1 | $0.016 |
| Codex + checklist | 7.8 | 12.9 | $0.024 |
| Strands specialist | 5.8 | 10.9 | $0.015 |
| **Strands team** | **10.9** | **16.7** | $0.064 |
| Strands swarm | 4.4 | 7.2 | $0.027 |

### The specialist prompt didn't help

I predicted the security specialist would find more of the hard ones than Codex. It found fewer: 5.8 against 7.1. The difference isn't significant, but it's the wrong way round.

It wasn't for lack of looking. The specialist opened every file with a hard vulnerability in every run. It just didn't spot some of them. The second-order SQL injection: 2 runs in 10, against 10 in 10 for Codex. The image-import SSRF, where an approved URL redirects to an internal address: 0 against 5.

And giving Codex the same checklist made no measurable difference (+5 points). With the same instructions and model, Codex found 14 points more than the Strands specialist. Codex has a shell and its own system prompt, so I can't say which of those did it.

### The team did, as long as the order was fixed

Split the review between four specialists, and run them in a set order, and it found **10.9 of the 14 hard ones**. Even its worst run (9) beat Codex's best (8). It was also the only reviewer that regularly found the design flaws:

- returns that refund items already cancelled and refunded (4 runs in 10; the others 0 or 1);
- two gift-card redemptions at once spending the same balance (4 in 10; the other Luna reviewers never);
- an internal package that the public package index could stand in for (4 in 10).

### The swarm, with the same agents, was worst

Same six agents, same prompts. The only difference: in the swarm, each agent decides who goes next.

The crypto, config and dependencies specialist **never ran** in any of the 10 runs. Nor did the logic and errors one. In 6 runs the injection specialist handed straight to the verifier, and in one run nothing was submitted at all. Every run still reported "completed".

If I hadn't logged which agents ran, I'd have assumed the whole checklist had been covered.

## The other things that surprised me

**No false alarms at all with Luna.** In 606 findings, not one was wrong, and none of the decoys was flagged. I'd predicted the specialist would be more precise. It couldn't be, because nobody was imprecise. Every reviewer reported what it found and kept quiet about the rest, which sounds great until you remember that it also kept quiet about everything it missed.

**Two vulnerabilities were found by nobody, in 70 reviews.** One was a pinned PyJWT version with a published CVE. The other: refunds were the one admin action not written to the audit log. Those are jobs for `pip-audit` and a test, not an agent reading code.

**Plain Codex never mentioned the configuration problems.** `debug=True` and CORS that accepts any origin with credentials were in 0 of 10 plain Codex reports. The specialist found them in 3 to 6 runs in 10. Codex went for code bugs.

**Running Codex more than once closes most of the gap.** I worked this out after the results, so it's not a planned comparison. Each Codex run found a slightly different set. Three runs of Codex with the checklist cost 7 cents together and found 10.4 of the hard ones. That's close to one team review, at about the same price.

**The cheap model couldn't run the team.** With Qwen, 4 of 10 team reviews crashed, two of them on a dropped connection to the model provider. Strands didn't retry it, so the whole team's work was lost. The Qwen specialist on its own was steady, and cost under a cent.

## So, specialist or coding agent?

1. **For a quick pass, use the coding agent you already have,** and run it two or three times. A security-expert prompt on one agent didn't beat it.
2. **For a thorough review, give each area its own specialist and fix the order in code:** recon first, specialists in parallel, a verifier last. That's what found the most, including the design flaws.
3. **Don't let agents decide who goes next.** The swarm had the same agents and prompts as the team. It skipped half of them and found the least.
4. **Log which agents actually ran.** "Completed" said nothing about whether the specialists did their part.
5. **Don't read a clean report as a clean app.** The best reviewer still missed about a fifth of the hard ones, and nothing told you which.
6. **Leave dependency versions and audit logging to tools,** like `pip-audit` and tests, not to an agent reading code.
7. **If you build Strands teams on a flaky connection, add retries.** One dropped request ended a whole review.

Next I'd like to build the same fixed team out of Codex runs, one per area, to separate the team structure from the framework. I'd also like to try a real codebase with published vulnerabilities instead of my planted ones.

## The limits

- **I wrote the app, the bugs, the decoys and the prompts.** The checklist follows OWASP's categories, but I wrote it knowing the bugs, which favours the Strands agents. The single specialist still didn't beat Codex.
- **23 planted bugs in 1,200 lines isn't real code.** A big codebase would test searching and reading far more.
- **One main model at one effort level.** Codex's model, harness and system prompt come as a package. The Strands agents had four simple tools, not a shell.
- **The team makes more model calls** (about 130 tool calls a review, against 10 to 52 for the others). I compared each reviewer at its normal settings, not at equal spend.
- **A model matched findings to the answer key.** I checked all 822 of its labels and changed 11.

Everything is on GitHub: the app, the answer key and proof tests, all five reviewers, every finding and tool call, and the [full report](https://github.com/meabs/experiments/blob/cbc5ca12/2026-11-vuln-hunt/REPORT.md).
