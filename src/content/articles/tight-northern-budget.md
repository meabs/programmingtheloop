---
title: "Building GenAI on a Tight Northern Budget"
description: "How I keep experimenting with GenAI without spending a fortune."
date: 2026-10-24T10:12:00+01:00
summary: "How I keep experimenting with GenAI without spending a fortune."
draft: false
---

*Quick note before I start. I've got mild dyslexia, so I use AI tooling to help with my writing, but the thoughts are all mine.*

Or how I’ve managed to keep experimenting without spending a fortune.

Since leaving AWS, one of the things I do miss is having access to Isengard for experiments.

You might have noticed the share price go up after I deleted all my environments.

Obviously, it’s mostly the people I miss. Being able to spin up infrastructure whenever I wanted to learn something was just a secondary benefit. 😉

These days, I’ve ended up becoming quite a frugal GenAI hobby developer.

I spend a fair amount of my spare time experimenting with AI, coding agents, different architectures and whatever new technology happens to catch my attention.

The problem is that experimenting can get expensive, especially when you’re paying for everything yourself.

So I’ve developed a few habits to keep the costs down.

## Stop burning tokens on plumbing

One pattern I use quite a lot is building applications against free models on OpenRouter first.

It lets me validate the application setup, API integration, flow, orchestration and basic prompt logic before switching to the model I actually intend to use.

I know the prompt behaviour won’t be identical between models. There will still be tuning and proper testing to do afterwards.

But there’s not much point paying for an expensive model to discover that I’ve configured an endpoint incorrectly or managed to break the orchestration.

I’d rather get the basic application working cheaply first.

Free models have their limitations, including rate limits and availability, but for the sort of development I’m doing they’re often perfectly adequate.

## Infrastructure doesn’t need to cost a fortune either

For most of my personal projects, I’ve settled into a fairly simple setup:

- **Cloudflare Pages:** Hosting React applications and static frontends.
- **Cloudflare Workers:** Backend logic, API endpoints and lightweight orchestration.
- **Cloudflare Tunnels:** Making services running on my local machine accessible when I need to test integrations.

So far I’m still comfortably within the free tier for all of those.

I will eventually start using more AWS and GCP services again, particularly when I want to experiment with managed AI services, event-driven architectures or other cloud capabilities.

But at the moment, I can build pretty much everything I want with what I’ve already got.

There’s something quite satisfying about building a working application and then discovering the infrastructure bill is still zero.

## What about coding agents?

This is probably where I’m less disciplined.

I’m currently using Codex, Claude and Cursor, and I’ve started experimenting with GitHub Copilot again.

I realise that sounds a bit excessive.

But I’m interested in how the different agent harnesses work, not just the models behind them.

How they discover context, use tools, plan changes, recover from failures and interact with repositories can make quite a difference.

It’s also given me ideas for experiments on Programming the Loop.

Longer term, I’ll probably consolidate onto one platform and increase the subscription tier rather than continue paying for several.

For now, though, I’m treating it partly as a learning exercise.

And the subscriptions probably cost about the same as a couple of pints in London. Although I haven’t checked London beer prices recently. 😂

## Local models

I’ve also been experimenting with local models.

At the moment, that’s mainly for running models within applications rather than using them as my primary coding agents.

I find the ability to run inference locally interesting, particularly for repeatable workloads where I don’t necessarily need the most powerful model available.

There’s quite a lot I still want to explore here, especially how local models compare with hosted models on real coding and application tasks.

Not just benchmarks, but whether they can actually complete useful work.

## Frugality or just being tight?

One of Amazon’s leadership principles is Frugality.

The idea that constraints can encourage resourcefulness and invention is something I’ve always liked.

Working without an unlimited cloud account or a large AI budget has actually made me think a bit more carefully about what I’m trying to prove.

Do I need an expensive model for this step?

Do I need managed infrastructure?

Can I simulate the behaviour locally?

What exactly am I trying to validate?

Sometimes the answer is that spending money would be worthwhile. Cheap isn’t necessarily better if it wastes hours of your time.

But more often than I expected, I’ve found that the cheap option is perfectly adequate for learning.

The amount you can build for very little money now is genuinely impressive.

So perhaps I’m following the Frugality leadership principle.

Or perhaps I’m just a tight northerner trying to keep up with GenAI without spending a fortune.

Either way, it seems to be working. 😂
