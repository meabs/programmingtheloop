---
title: "Do You Actually Need an Agent?"
description: "I built the same customer-service bot four ways (plain code, one model call, a workflow and an agent) and ran 4,480 emails through them, from simple lookups to failing services and requests nobody planned for. Most emails didn't need an agent. Failures mid-way were where the agent won, partly because I left two simple fixes out of the fixed code, and that was also where an agent refunded a customer twice."
date: 2026-10-30T23:30:00+00:00
summary: "Same shop, same tools, four architectures, 4,480 runs. Simple and branching emails were handled at or near 100% without an agent. One model call coped with unexpected requests too. The agent won when something failed mid-way (74% against 42–50%), though two of those cases are simple fixes I left out of the fixed code. It cost about the same as the others, and with a cheap model it refunded a timed-out refund twice in 16 of 20 runs."
draft: false
topics:
  - safety-cost
  - harness
---

*Quick note before I start. I've got mild dyslexia, so I use AI tooling to help with my writing, but the thoughts are all mine.*

Pretty much every time someone shows me something built with an LLM at the moment, it's an agent. A model in a loop with a pile of tools, deciding its own steps. And the counter-advice I keep hearing is "you probably just need a workflow".

Both of those get said a lot. I couldn't find many people actually measuring it. So I picked a boring, very common job, answering customer-service emails and acting on them, built it four ways, and threw the same emails at all four.

I tried quite hard not to rig it for the simple option. Some of the emails are there specifically because an agent *should* win them: services that fall over halfway, input that's slightly off, and requests the fixed code was never written for. The interesting bit isn't who wins overall, it's where the crossover is.

## The 30-second version

If you only read one thing, this is how I read the results below. It comes from one shop and two cheap models, so treat it as a place to start, not a rule.

| Your problem | Start with |
| --- | --- |
| The rules are clear and predictable | Ordinary code |
| You need AI to interpret language | One model call |
| Several known steps must happen | A fixed workflow |
| The next step depends on outcomes you can't predict | Consider an agent |
| The system changes money or sensitive data | Enforce permissions, limits and idempotency in code, whichever you choose |

Five terms, in plain English:

- **Agent:** a model in a loop that picks its own next tool and step.
- **Workflow:** steps fixed in code, with a model used for some of them, such as reading the email or writing the reply.
- **Tool call:** the model asking your code to do something, like look up an order or issue a refund.
- **Idempotent:** safe to repeat. Doing it twice has the same effect as doing it once, so a refund with an idempotency key can't pay out twice.
- **Escalate:** hand the email to a person.

## The shop

Everything is simulated in Python, so nothing touches a real system.

- **Hartley & Finch,** a made-up UK homeware shop with 8 customers, 14 products and 15 orders in various states (processing, in transit, delivered, stuck at a depot, one paid twice).
- **A one-page policy:** 30-day returns with the refund straight away, final-sale items, a £200 limit above which a manager approves, damaged items, lost parcels, address changes and cancellations only while an order is processing, billing problems go to the billing team, and only act for the account's own email address.
- **Nine tools,** the same for every version: look up a customer, an order, tracking or stock; issue a refund, send a replacement, change an address, cancel an order, or escalate to a person. They behave like real services, errors and all. And like a lot of real payment integrations, the refund service won't stop you refunding twice. That turns out to matter.

## Four ways to build it

<figure class="guide-figure">
<img src="/guide-images/arch-need-an-agent-1-four-architectures.png" alt="Diagram of four architectures. 1, plain code, 204 lines, no model: keyword rules pick one of 4 request types, fixed steps look up, check policy and act, then a template reply; anything else goes to a person. 2, one model call, 53 lines: code fetches the customer, all orders and stock, one model call decides the actions and writes the reply, code carries them out; if one fails, a person. 3, workflow, 165 lines, 1 or 2 calls: the model reads the email into fixed fields, fixed steps as in plain code, the model writes the reply; anything else goes to a person. 4, agent, 34 lines, up to 15 calls: the model in a loop picks a tool, reads the result, picks the next, writes the reply; at 15 steps, a person. All share the shop's 9 tools." width="1800" height="1000" loading="lazy" />
<figcaption>Beige is code I wrote making the decision; teal is the model making it.</figcaption>
</figure>

1. **Plain code.** No AI at all. Keyword rules work out which of four request types it is (where's my order, return, damaged item, policy question), the policy is `if` statements, and the reply is a template. Anything else goes to a person.
2. **One model call.** Code fetches everything about the customer up front (all their orders, tracking, stock), one call decides what to do and writes the reply, and code carries out the actions.
3. **A workflow.** The same fixed steps as plain code, but the model reads the email into fields at the start and writes the reply at the end. This is roughly what "just use a workflow" means.
4. **An agent.** The model gets the tools and the policy and gets on with it, up to 15 steps.

Some design choices in the fixed code are worth calling out, because they matter later. It retries a failed *lookup* twice, but never retries a refund or replacement that fails, it hands those to a person, so money can't go out twice. And anything it doesn't recognise goes to a person too. That's deliberately safe, and I think it's what most sensible developers would write.

The agent is the shortest bit of code by a mile, 34 lines. All the logic is in the prompt and the model, so line count says nothing about how simple it is. The complexity has moved somewhere harder to see and test.

## The emails

32 of them, at five levels:

| Level | Emails | What it tests | Examples |
| --- | --- | --- | --- |
| 1 simple | 6 | One lookup or a policy question | "Where's A1051?", "Do you deliver to Ireland?" |
| 2 multi-step | 6 | A clear refund or replacement | "Refund the tea towel from A1042" |
| 3 branching | 8 | The answer depends on what the lookups say | Outside 30 days, final sale, a £240 rug, out of stock, no order number given |
| 4 recovery | 6 | A service fails once, or the input is slightly off | Tracking returns a 503, order number written `#a-1042`, a refund that times out *after* going through, an email address in different letter case |
| 5 unanticipated | 6 | Things the workflow wasn't built for, still covered by the policy | Change my address, cancel, two requests in one email, "can you hold my order", two damaged items with different wishes |

There's a catch I spotted early. I wrote the plain-code keyword rules after reading the emails, which is cheating a bit. So every email also runs in a second wording, paraphrased by a model that isn't being tested. I read all 32 paraphrases to check nothing important changed.

And every email runs with **small** customer accounts (1–3 orders) and **large** ones (40 older orders added), because "fetch everything up front" is a lot cheaper when there isn't much to fetch.

Two models, both cheap: OpenAI's **gpt-6-luna** and **Qwen 3.7 Flash**, via OpenRouter. Five repeats of everything. That is 32 emails × 2 wordings × 2 account sizes × 5 repeats, or 640 runs for each of 7 set-ups (plain code, plus one call, the workflow and the agent with each of the two models), so 4,480 runs. It's 32 problems seen under different conditions, not 4,480 separate ones. Each run was scored on what actually changed in the shop and whether the reply had the facts it needed.

The design went up on GitHub [before the main run](https://github.com/meabs/experiments/tree/3e6a2562dbe796461cf808ebd1b1a94cd5126a2d/2026-10-need-an-agent), so I couldn't quietly move the goalposts afterwards.

## What happened

<figure class="guide-figure">
<img src="/guide-images/chart-need-an-agent.png" alt="Left, runs resolved by level with Luna, higher is better. Level 1: plain code 92%, one call 100%, workflow 100%, agent 100%. Level 2: 92, 100, 100, 100. Level 3: 88, 100, 92, 99. Level 4: 42, 48, 42, 74. Level 5: 17, 100, 17, 98. Right, how all 640 runs of each version ended (resolved, escalated, wrong, harmful): plain code 67, 19, 11, 3; one call Luna 90, 7, 3, 0; one call Qwen 82, 12, 3, 3; workflow Luna 71, 16, 12, 1; workflow Qwen 71, 18, 11, 1; agent Luna 95, 4, 2, 0.2; agent Qwen 91, 1, 5, 3." width="1800" height="920" loading="lazy" />
<figcaption>Source: github.com/meabs/experiments, 2026-10-need-an-agent.</figcaption>
</figure>

**Overall,** the Luna agent resolved 95% of emails, one call with Luna 90%, the workflow 71% and plain code 67%. If I stopped there, it would look like a clear win for the agent. But the overall number hides where it comes from.

### Levels 1 to 3: you don't need an agent

The everyday stuff (status checks, clear refunds, and the branching ones where the answer depends on the order's state) was handled at or near 100% by one call, the workflow and the agent alike. Even the branching level, which I thought might trip up the fixed code, was 92% for the workflow.

Plain code was 92% on the simple levels, and it was the only one hurt by the paraphrased emails: 72% resolved on my wording against 62% on someone else's. Keyword rules are only as good as your guess at how people write.

### Level 5: one call was enough

I expected the unanticipated requests to be where the agent proved itself. Not quite. A single model call that could see the customer's whole account resolved **120 of 120** of those runs with Luna. The agent got 118.

The workflow and plain code escalated them, by design: "hold my order" isn't one of their four request types, so a person gets it. That's safe, but it's also why they sent 16–19% of all emails to a human, against 4% for the Luna agent. A safe hand-off still costs someone's time.

### Level 4: where the agent won, with a caveat

Recovery was the only level where the agent clearly beat everything else: **74% for Luna's agent, against 42–50%** for all the others.

- **The warehouse falls over once on a replacement.** The fixed code doesn't retry writes, so it escalates. The agents just tried again: Luna 15 of 20, Qwen 18 of 20.
- **The email comes from `Grace.Liu@Mail.test` instead of `grace.liu@mail.test`.** Every non-agent version told her she wasn't a customer. The agents sometimes thought to try again in lower case (Luna 12 of 20, Qwen 2 of 20).

To be fair to the fixed code, both of those are small fixes once you know about them: lower-case the email, and retry the warehouse call once the replacement call is idempotent. So some of this win is the agent covering for two branches I didn't write, and I haven't measured how much of the gap would close if I had. The agent's real advantage here is that *nobody had to see it coming*.

### And then the refund that timed out

<figure class="guide-figure">
<img src="/guide-images/arch-need-an-agent-2-timed-out-refund.png" alt="Diagram. Case L4-03: issue_refund for £24 is made at the payment provider, but the call returns a 504 timeout, so the caller only sees an error; the refund service doesn't reject a duplicate. Plain code, one call and workflow: never retry a write, hand it to a person, 100 of 100 escalated, safe but someone has to check. Agent with Luna: 'I couldn't confirm the refund, so I've asked billing to check', 15 escalated and 5 resolved of 20, never refunded twice. Agent with Qwen: tries again, it works, 'I've processed your refund', 16 of 20 refunded twice." width="1800" height="900" loading="lazy" />
<figcaption>The same habit, retrying when something fails, that fixed the warehouse case.</figcaption>
</figure>

This was the one I built to be nasty. The customer asks for a refund, the payment service makes it, and then the call times out, so the caller only sees an error.

- **The fixed code** never retries a write, so it escalated every time. Dull, safe.
- **Luna's agent** mostly did the same: "I couldn't confirm the refund went through, so I've asked our billing team to check." Honestly, that's a good answer.
- **Qwen's agent retried, it worked, and the customer got their money back twice.** 16 times out of 20. And the reply said "I've processed the refund for your two mugs", all very tidy.

That's the bit that stuck with me. The *same* behaviour that made the agent good at recovery, just trying again, is what made it dangerous here. It can't tell a safe retry from an unsafe one, because nothing in the error tells it.

## The other things that surprised me

**The agent wasn't the expensive one.** I fully expected it to cost the most. Per 1,000 emails, with Luna:

| Version | Small accounts | Large accounts |
| --- | --- | --- |
| Workflow | $0.15 | $0.15 |
| Agent | $0.19 | $0.19 |
| One call | $0.15 | **$0.45** |

The agent only fetches what it needs. "Fetch everything and make one call" sent about 11,000 tokens per email on large accounts and cost more than twice as much. With models this cheap, though, every option is fractions of a cent per email, so as a tight northerner I'm pleased but not exactly retiring on it. Speed was similar too: about 3 seconds for one call, 5 for the workflow and 7 for the agent with Luna.

**The cheap model's mistakes were in the most autonomous setups.** Inside the workflow, Qwen was level with Luna (71% each). Given more freedom, it did things the policy says not to. In one call it refunded a £240 rug without a manager 10 times and cancelled an order the customer only asked to delay 10 times, and as an agent it made those double refunds. Luna made 1 harmful change in 640 agent runs, Qwen 18.

**The policy was right there in the prompt.** "Over £200, a manager approves." The models still broke it 13 times. If a rule matters, a sentence in the prompt isn't enough.

**My fixed code broke when the data grew, and nobody would've noticed.** With 40 old orders on each account, "the mug set I ordered recently" matched several orders, so plain code and the workflow asked the customer for the order number. No error, just a slightly worse answer. The models looked at the dates.

**Agents were less consistent.** Luna's one call ended the same way in all five repeats for 98–100% of emails; its agent did for 84–89%. That matters when a customer emails twice and gets two different answers.

## So, do you need an agent?

For this kind of job, mostly not. Here's what I'd actually do:

1. **Start with a workflow or a single call for the requests you understand,** and keep the business rules in code. Every AI version handled the everyday emails, and rules in code are rules you can test.
2. **Make your writes idempotent before anything is allowed to retry.** An idempotency key on refunds would have stopped every double refund, whatever the architecture. Honestly, do this anyway.
3. **Enforce limits in the tool, not the prompt.** If refunds over £200 need a manager, the refund service should refuse them without approval.
4. **Before reaching for an agent, write the recovery branch you're missing,** if you can name it. Lower-case the email. Retry the idempotent call.
5. **Bring in an agent where recovery is the problem you can't enumerate**: flaky services, messy input, lookups that need a second go. That was the only place it clearly won, and part of that came from two fixes I didn't write.
6. **If you do use an agent, use a decent model.** The cheap one was fine inside a workflow and noticeably riskier with the keys.
7. **Count escalations as a cost.** "Safe" architectures that hand 1 in 5 emails to a person aren't free, they've just moved the work.

A pattern I'd like to try next is a hybrid: the workflow handles everything it knows, and only falls back to an agent when a fixed step fails, with idempotent tools underneath. My guess is that gets most of the agent's recovery without most of its risk, but that's a guess until I test it. The simpler test comes first: add the two small fixes to the fixed code and see how much of the level 4 gap closes.

## The limits

I should be upfront about these.

- **I wrote everything:** the shop, the policy, the emails and all four versions. The fixed code was written knowing what the cases look like, which flatters it.
- **Some of the agent's level 4 win comes from my choices.** I didn't lower-case emails and didn't retry writes. A different developer might have done both.
- **One domain.** Customer service suits a workflow. Open-ended work, like research or coding, should suit agents more.
- **Two cheap models on default settings, no prompt tuning, simulated services.** Real latency and partial failures are messier.
- **The scorer is strict.** A helpful reply that misses a required fact counts as wrong.

The whole thing cost **$1.01** for 4,480 runs, which is less than a coffee.

Everything is on GitHub if you want to poke at it: the shop, the policy, the 32 emails and their paraphrases, all four versions, every run's tool calls and replies, and the [full report](https://github.com/meabs/experiments/blob/ad98769b9de7c7c1eb78669fa20559184a35fa26/2026-10-need-an-agent/REPORT.md).
