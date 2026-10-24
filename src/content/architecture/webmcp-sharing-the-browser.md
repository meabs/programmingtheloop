---
title: "WebMCP: Why I'm Interested in Agents Sharing the Browser"
description: "Notes from building with WebMCP: humans and agents sharing the same browser state."
date: 2026-10-24
summary: "Notes from building with WebMCP: humans and agents sharing the same browser state."
draft: false
---

*Quick note before I start. I've got mild dyslexia, so I use AI tooling to help with my writing, but the thoughts are all mine.*

I've been playing around with WebMCP a fair bit recently, and honestly I think it raises some interesting questions about how humans and AI agents are going to interact with applications.

I originally got pulled in through a WebMCP challenge, which basically gave me an excuse to build something and learn how it worked. As usual, what started as a small experiment turned into a few more projects than I'd planned.

I really do need to get out more 😁

If you've not come across it, most of us have seen AI agents interacting with websites by now. They inspect the page, find the buttons, fill in forms and generally try to work out how the application works. It's pretty impressive when it works, but it's also a bit strange when you think about it. We've spent years building applications with APIs and defined contracts, and now we're getting AI agents to stare at the interface and work out which button to press.

WebMCP takes a different approach. Instead of making the agent interpret the interface, the website can expose structured tools that describe what it can do, things like searching products, updating a basket, reserving an item or changing a configuration. The agent discovers those capabilities and invokes them directly through the browser.

The important bit for me is that these tools work within the context of the live web application, so the user and the agent are interacting with the same application state.

I should say, it's still an evolving, experimental browser standard, so I wouldn't assume it's universally supported.

The obvious reaction is "isn't this just MCP?" Not quite. Traditional MCP integrations let agents interact with external capabilities, often through backend services, whereas WebMCP is focused on the browser and the application the user currently has open. They solve different problems and to be honest they can complement each other. An MCP server might expose a customer account service to an agent running outside the browser, for example, while WebMCP could expose the actions available within the customer's current application journey. The key benefit is that the agent works with the application's existing frontend behaviour and current context, rather than independently changing backend state and leaving the browser to catch up.

That doesn't mean every application needs it though. If all you need is to call a backend API, then an API or a traditional MCP integration might be the better option, I don't think we need to add another abstraction just because it's got AI in the name.

## Resilience Forge, and agents working on old information

For the challenge I built something called Resilience Forge.

The challenge was rather nerve-racking to be honest, because I also had to make a YouTube video for it. My old mother used to say I had the face for radio and the voice for silent movies 😂

The idea was a simple architecture simulation workbench. A human could pick an architecture, change its configuration and apply constraints, and an AI agent could inspect the architecture, run stress tests, examine failures and recommend changes. I included three example architectures covering event-driven checkout, multi-region SaaS and LLM inference serving. The simulations underneath were deterministic rather than connected to real cloud infrastructure (which suited my wallet just fine), because I wasn't trying to prove an architecture would survive a production outage. It was really just to see how a human and an agent get on working on the same problem.

And that's where it got interesting.

Say the agent inspects the application and decides it needs to increase capacity. What happens if the human changes the workload before the agent applies that recommendation? The agent's decision might have been valid when it made it, but now it's working against outdated information.

So I added version checks, human-controlled constraints and an audit trail. If the application state had changed, the agent's outdated change would be rejected, and it'd need to inspect the new state and reconsider its recommendation.

Honestly, that was more interesting to me than just watching an agent successfully call a tool.

## Then the race condition bit

Once agents and humans can work in the same application, which is basically what WebMCP makes easier, you get the obvious follow-on problem. What happens when they both act at the same time?

Imagine a simple booking application with one reservation left. A human clicks Reserve at almost exactly the same moment an AI agent calls the WebMCP reservation tool. Both operations might work perfectly when tested on their own, but if the underlying application isn't designed to handle concurrent requests properly, both could succeed, and now you've reserved two places when only one was available.

WebMCP hasn't necessarily caused the bug, it's just exposed another way for it to happen. And because an agent can execute actions a lot faster than a person (certainly faster than me these days), it may uncover problems that aren't particularly obvious during normal manual testing.

Which got me thinking about how we test these applications, so naturally I ended up building another project, WebMCP Resilience. It's an open-source Python testing tool for exploring these sorts of problems, and it's on GitHub if you fancy a look: https://github.com/meabs/WebMCPResilience

The idea is pretty straightforward. You define a scenario where a human, an AI tool and potentially other application events interact at controlled times, throw in things like delayed responses, duplicate calls, cancellation or navigation, and then check whether the application still obeys its rules. So if an application has one item available, the number of successful reservations must never go above one.

It uses Playwright to run the browser interactions and invoke the WebMCP tools, then checks the resulting observable application state. When it finds a failure it can save the scenario and evidence so it can be replayed. There's an intentionally vulnerable example in the repo that shows this, with a human action and an agent action racing each other.

One important limitation, this tests how the application behaves when tools are invoked. It doesn't prove that an LLM will discover the right tool, interpret the user's request properly or make a sensible decision. Those are different things to test.

## What I'm still unsure about

What interests me now isn't really whether WebMCP works, it's more how we should design applications that support it. A few things I keep going round in circles on.

Should WebMCP expose existing application capabilities, or introduce separate agent-specific behaviour? My preference is to reuse the same underlying application logic wherever possible. I wouldn't want one implementation for the human interface and another for the agent, with the two slowly drifting apart.

Then there's shared state. If an agent acts on information that was correct five seconds ago, how does the application know whether the action is still valid? Version checks, transaction boundaries and idempotency become important, particularly for operations with real consequences.

Control is another one. I like the idea of an agent proposing changes while the human keeps control over certain constraints, but the application should enforce those constraints, not rely on the agent remembering them.

And security, obviously. A structured tool interface isn't an authorisation model. The server still needs to enforce permissions and validate operations, browser context doesn't magically make agent actions trustworthy.

To be fair, none of these problems is entirely new. We've been dealing with concurrency, stale state, access control and transactional integrity for years. What's changing is that there's another actor interacting with the system, potentially at machine speed.

I suspect WebMCP, or something like it, could become a useful way to make existing web applications more accessible to agents. I particularly like the idea of a human and an agent working together in an existing application, rather than having to build a completely separate AI interface for everything.

But I'm not convinced every website needs a collection of agent tools. For fairly simple websites, normal browser interaction might be perfectly adequate, and for purely backend operations, existing APIs and MCP integrations already solve a lot of the problem. For me the value is in applications where the shared browser context genuinely matters.

There's also a danger of creating yet another layer of duplicated application functionality, which would be a fairly impressive achievement given how many layers we've already managed to invent.

It's still early days, and I wouldn't draw sweeping conclusions from a handful of hobby projects. As with most of my experiments, the best bit so far hasn't really been proving something works, it's been finding the assumptions I hadn't thought to test.

Next I want to carry on with it, particularly around application security, agent behaviour and how it compares with conventional browser automation. I'd also like to understand how much practical improvement structured browser tools make on real tasks, not just whether they work, but whether they improve task completion, reduce errors or simplify the application architecture.

So that's probably a few more weekends gone. Still cheaper than going out 😂
