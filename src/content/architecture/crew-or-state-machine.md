---
title: "Multi-Agent Swarms or a Boring State Machine?"
description: "I built the same customer-service bot as a typed schema plus if/else code, a single agent, and a 3-agent crew with handoffs, and ran 6,080 emails through them. The crew was worst on the emails it should have won, the ones with several requests: 62% resolved against 100% for the state machine and 96% for one agent. It also told customers their request had been passed to a team that was never told."
date: 2026-11-01T23:30:00+00:00
summary: "Same shop, same tools, four architectures, 6,080 runs. On emails with two or three requests, the 3-agent crew resolved 62% with Luna, the single agent 96% and the state machine 100%. 11% of the crew's replies (17% with Qwen) claimed something had been done or passed on when the log showed nothing. Handing over a short note beat sharing the whole conversation. The state machine was cheapest, most consistent and never did anything harmful."
draft: false
topics:
  - parallel
  - safety-cost
  - harness
---

*Quick note before I start. I've got mild dyslexia, so I use AI tooling to help with my writing, but the thoughts are all mine.*

"Multi-agent swarms are the future" gets said a lot. A front-desk agent, a couple of specialists, handoffs between them, and it all sounds very sensible, because it's how a real team works.

The unglamorous alternative is a typed schema that a model fills in, and plain `if`/`else` code that does the rest. A state machine. Nobody writes excited posts about those.

This is a sequel to [Do You Actually Need an Agent?](/architecture/do-you-need-an-agent/). Same simulated shop, same policy, same tools, same scoring. This time I added a crew, and I gave it the emails where a crew *should* win.

## The 30-second version

| Your problem | Start with |
| --- | --- |
| A known set of request types | A typed schema plus code |
| Things fail and need working around | A single agent with all the tools |
| You're tempted to split one conversation across specialist agents | Don't, or at least hand over a written note, and check every "I've passed it on" against what actually happened |

Terms, in plain English:

- **State machine:** the model fills in a form listing what the customer wants, ordinary `if`/`else` code acts on each item, and the model writes the reply. More on this below.
- **Crew:** several agents, each with its own instructions and tools, passing the conversation between them.
- **Handoff:** one agent transferring the conversation to another, here with a `transfer_to_<agent>` tool, the way OpenAI's Swarm and Agents SDK do it.

## Four ways to build it

<figure class="guide-figure">
<img src="/guide-images/arch-crew-vs-code-2-four-architectures.png" alt="Diagram of four ways to build the same support bot. 1, state machine, always 2 model calls: the model fills a typed list, plain if/else code applies the policy to each request and sends anything else to a person, and the model writes the reply from the facts the code found. 2, single agent, up to 20 calls: the model in a loop with all nine tools and the whole policy, picking a tool, reading the result and picking the next one until it writes the reply. 3, crew with full history, and 4, crew with note only, up to 20 calls in total: a front desk that looks things up but can't change anything transfers to a delivery specialist (tracking, address, cancel) or a returns specialist (refunds, replacements). In the full-history crew the next agent sees the whole conversation; in the note-only crew it sees only the email and a note. Underneath, the shop's nine tools: find_customer, get_order, track_shipment, check_stock, issue_refund, send_replacement, change_address, cancel_order and escalate." width="1800" height="1040" loading="lazy" />
<figcaption>Beige: code I wrote decides. Teal: a model decides.</figcaption>
</figure>

1. **State machine.** Always two model calls, explained step by step below.
2. **Single agent.** The model in a loop with all nine tools and the whole policy.
3. **Crew, full history.** A **front desk** that can look things up but not change anything, a **delivery** specialist (tracking, address changes, cancellations) and a **returns** specialist (refunds, replacements, billing). Each sees only its own part of the policy. When one transfers to another, the new one sees the whole conversation so far, which is the Swarm and Agents SDK default. The instructions start with the Agents SDK's own handoff prompt, word for word.
4. **Crew, note only.** The same crew, but the new agent sees only the email and a note from the last one, more like a CrewAI task hand-off.

In my first pilot the crew was a mess: specialists kept writing "I've passed your request to our delivery team" instead of doing the work. I assumed I'd written the handoff badly, so I switched to the Agents SDK's own prompt and tool result. It helped a little. Remember that sentence, it comes back.

### The state machine, in plain English

"State machine" sounds technical, but the idea is simple. The model only does the two jobs that need language: reading the email and writing the reply. Everything in between is ordinary code, the same every time.

<figure class="guide-figure">
<img src="/guide-images/arch-crew-vs-code-3-state-machine.png" alt="Diagram of the state machine, step by step, for the email: Change the address on A1088 to 14 Elm Road. One mug in A1042 arrived chipped, please replace the set. Do you take Amex? Step 1, the model fills in a form, one line per request, each one of nine fixed request types: change_address, order A1088, to 14 Elm Road; damaged_item, order A1042, wants a replacement; policy_question, Do you take Amex? Step 2, plain code handles each line with if/else rules, with no model involved. Address change: already dispatched? Yes, decline and say why; no, call change_address; fact: address changed. Damaged item: delivered, within 30 days? No, decline and say why; yes, send a replacement, or a refund if they asked for one; fact: replacement sent. General question: no tool needed, the answer is in the shop's policy. Anything the form can't express, a billing problem, or a tool that fails is handed to a person. Step 3, the model writes the reply from the list of facts. It is told not to promise or decide anything that isn't in the facts. Replies claiming an action that wasn't taken, in the main run: 0%." width="1800" height="1180" loading="lazy" />
<figcaption>Source: <code>2026-11-crew-vs-code/src/statemachine.py</code>.</figcaption>
</figure>

1. **The model fills in a form.** It reads the email and writes down each separate request as one line, picking from nine fixed request types (change an address, a damaged item, a general question, and so on) and noting the details: order number, new address, what they want.
2. **Code does the work, one line at a time.** For each line, plain `if`/`else` code applies the shop's rules, the same way every time. Change of address: has the order been dispatched? If not, change it. Damaged item: was it delivered in the last 30 days? If so, send a replacement. A general question needs no action; the answer is in the policy. Anything the form can't express, a billing problem, or a service that fails goes to a person. Each step ends with a plain fact: "address changed", "replacement sent".
3. **The model writes the reply** from that list of facts, and is told not to promise anything that isn't on it.

So the model never decides what to *do*. It can misread an email, but it can't skip a step or do one twice, because only the code acts. And because the reply is written from what the code actually did, none of its replies in the main run claimed an action that hadn't happened.

## The emails

The same 32 emails as last time, from simple lookups to failing services, plus 6 new ones at **level 6**: two or three requests in one email, spanning both specialists. For example: "Change the address on A1088. One mug in A1042 arrived chipped, please replace the set. Do you take Amex?" That's exactly what a crew of specialists is sold on.

Every email ran in my wording and a paraphrase, with small and large customer accounts, five times, with two cheap models via OpenRouter: **gpt-6-luna** and **Qwen 3.7 Flash**. 38 × 2 × 2 × 5 × 4 architectures × 2 models = **6,080 runs**, for $2.20.

The design, both pilots and the hypotheses went up on GitHub [before the main run](https://github.com/meabs/experiments/tree/b41f522cc001266f00a616db4d9b48352c4e746a/2026-11-crew-vs-code). I'd already seen the pilots point against the crew on level 6, and I kept the hypothesis that it would win there anyway, because that's the claim being tested.

## What happened

<figure class="guide-figure">
<img src="/guide-images/chart-crew-vs-code.png" alt="Left, runs resolved by level with Luna, higher is better, for state machine, single agent, crew note only and crew full history. Level 1: all 100%. Level 2: 100, 100, 99, 100. Level 3: 92, 99, 99, 81. Level 4 recovery: 67, 78, 71, 65. Level 5 other: 100, 100, 88, 77. Level 6 compound: 100, 96, 86, 62. Right, replies claiming an action that wasn't taken, lower is better, Luna then Qwen: state machine 0% and 0%; single agent 0% and 1%; crew note only 2% and 13%; crew full history 11% and 17%." width="1800" height="920" loading="lazy" />
<figcaption>Source: github.com/meabs/experiments, 2026-11-crew-vs-code.</figcaption>
</figure>

**Overall,** with Luna: single agent 96%, state machine 93%, crew with notes 91%, crew with full history 81%. With Qwen: 91%, 89%, 75%, 70%, in the order state machine, single agent, note crew, full-history crew.

### Level 6: the crew's home ground

This is where I expected the crew to earn its keep. It didn't:

| Compound emails, resolved | Luna | Qwen |
| --- | --- | --- |
| State machine | **100%** | **94%** |
| Single agent | 96% | 80% |
| Crew, note only | 86% | 58% |
| Crew, full history | 62% | 39% |

The prediction was that the full-history crew would beat the single agent here. It lost by 34 points with Luna and 41 with Qwen.

### Where it went wrong: "I've passed it on"

<figure class="guide-figure">
<img src="/guide-images/arch-crew-vs-code-1-dropped-handover.png" alt="Diagram. Case L6-01: change the address on A1088, replace a chipped mug set from A1042, and do you take Amex. The front desk transfers to the returns specialist, which sends the replacement set, then writes the reply instead of transferring to the delivery specialist, which is never called, so the address is never changed. The reply says: I've passed your address change request for A1088 to our delivery team. A colleague will be in touch within 1 working day. Nobody was told. Address changed, with Luna, 20 runs each: state machine 20 of 20, single agent 20 of 20, crew note only 20 of 20, crew full history 7 of 20." width="1800" height="960" loading="lazy" />
<figcaption>The pilot's problem never went away; the handoff prompt only made it rarer.</figcaption>
</figure>

The front desk hands over to the returns specialist. It sends the replacement, then, instead of transferring the address change to delivery, it writes the reply. And the reply says the address change has been "passed to our delivery team" and that someone "will be in touch within 1 working day".

Nobody was told. There's no escalation in the log and the delivery agent never ran. The customer is now waiting for a call that isn't coming, and if you're the shop, the reply looks completely fine.

I had a model read every reply and list what it said had been done, compared that with the shop's log, and then checked 916 of those labels myself (every flagged one and a tenth of the rest). It agreed with me on all of them. **11% of the full-history crew's replies with Luna claimed something that hadn't happened, and 17% with Qwen.** The state machine and single agent: 0–1%. With Luna, every one of the crews' 98 false claims was that kind of sentence: "passed to a team". With Qwen, the crews also told 129 customers they'd been refunded when they hadn't.

### Sharing everything made it worse

Before the pilots I assumed giving the next agent the whole conversation would help. It knows everything that's happened! But the crew that only got a short note did better with both models: 10 points more with Luna, 5 with Qwen, and far fewer false claims with Luna (2% against 11%). I didn't record each agent's messages, so I can't tell you *why* from the data. A note at least reads like a to-do list.

### Levels 1 to 3: the boring version wins

On the everyday emails, the state machine beat the full-history crew with both models: 97% against 92% with Luna, 96% against 82% with Qwen. The single agent was at or near 100% with Luna too.

The state machine's misses were by design. It never retries a refund or replacement that fails, it hands it to a person, so it escalated every one of the "service falls over once" emails on level 4. And when a paraphrase didn't name the item clearly enough, it asked for an order number instead of guessing. Safe, if a bit slow for the customer.

## The other things that surprised me

**Specialists made gaps.** Each specialist only had its own sections of the policy, which is the whole point of specialising. So when the delivery specialist met "do you take Amex?", it couldn't see the answer, and in some runs it escalated the question to the billing team. A general question answered by any one agent with the whole policy became a ticket.

**Crews redid each other's work.** With Qwen, 34 crew runs did the same action twice: a second refund, a second replacement, the address changed by two agents. One run refunded the same blanket five times.

**The crew was twice the price and less predictable.** About $0.0005 per email against $0.0002 for the state machine and single agent with Luna. Still fractions of a penny, but it bought less. Same result in all five repeats: state machine 99% of the time, single agent 90%, note crew 84%, full-history crew 69%.

**The state machine was the only one that never did anything harmful.** Zero harmful runs with either model. With Qwen, the single agent had 27 and the full-history crew 24.

## So, swarm or state machine?

For this kind of job, the boring one. Here's what I'd actually do:

1. **If your requests fall into known types, use a typed schema plus code.** It matched or beat everything on the everyday emails, cost least, never did harm, and gave the same answer every time.
2. **If you need recovery from things going wrong, use one agent with all the tools,** not a crew. It was the best all-rounder with the stronger model.
3. **Don't split one customer conversation across specialist agents to handle multi-request emails.** The specialists dropped requests, lost facts and repeated actions.
4. **If you do use handoffs, pass a written note, not the whole history.**
5. **Make "handed to a person" a real tool call, and check the reply against the action log before it goes out.** If the log doesn't show it, the reply shouldn't say it. That one check would have caught most of the crew's false claims, whatever the architecture.
6. **Make one thing own the final reply,** and have it confirm that every request in the email has an outcome.

What I'd like to try next is a different crew shape: one manager agent that calls the specialists as tools and writes the reply itself. That keeps one owner for the conversation, which is what the handoff crews were missing. And a reply checker, because "I've passed it on" is a sentence any architecture can say.

## The limits

- **I wrote everything:** the shop, the emails, the state machine and the crew. I knew the cases when I wrote the schema, which flatters the state machine. Real inboxes have requests no schema expects; here those would go to a person.
- **One crew design.** Other roles, a manager-and-tools setup or a stronger model might do much better. The handoff prompt is the Agents SDK's; the way I split the roles and the policy is mine.
- **One small domain that suits a state machine, two cheap models, default settings.**
- **The false-claim labeller is one of the models under test,** although all 916 labels I checked were right.

Everything is on GitHub: the shop, the 38 emails, all four architectures, every run's actions and replies, and the [full report](https://github.com/meabs/experiments/blob/b3aeaf9bd8a2ceafb6e88569fae4197cbc534dfc/2026-11-crew-vs-code/REPORT.md).
