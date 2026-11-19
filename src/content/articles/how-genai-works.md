---
title: "What Actually Happens When You Press Enter? How Generative AI Works"
description: "A beginner's walk through what a generative AI model does with your prompt, from tokens and vectors to the transformer's attention and the one-token-at-a-time loop, with every number measured on a small open model running on my own machine."
date: 2026-10-31T12:00:00+00:00
summary: "Your prompt is cut into tokens, each token becomes a vector of 1,024 numbers, 28 transformer layers rework those vectors, and out comes a probability for every possible next token. Pick one, add it on, repeat. I measured each step on a small open model: cat sits nearest kitten, 42 of 448 attention heads link \"it\" to \"animal\", and it confidently named the capital of a country that doesn't exist."
draft: false
---

*Quick note before I start. I've got mild dyslexia, so I use AI tooling to help with my writing, but the thoughts are all mine.*

I get asked "but how does it actually *work*?" a lot, usually by someone who's just watched a chatbot write a decent email and is now slightly worried about it.

The honest answer is that it's both simpler and stranger than most people expect. So rather than draw the usual boxes with made-up numbers in them, I ran a small open model on my own machine and measured every step. All the numbers below are real, and the code is on GitHub if you want to poke at it.

The model is **Qwen3-0.6B-Base**. It's tiny by today's standards, about 600 million parameters, which is why it runs on my desk. The big chat models work the same way, just much bigger and with extra training on top. I'll point out where that matters.

## The whole journey

Here's what happens between you pressing Enter and words appearing on the screen.

<figure class="guide-figure">
<img src="/guide-images/genai-1-prompt-journey.png" alt="Flow diagram. 1, your prompt: 'Why is the sky blue?', read once, in one go. 2, tokens: Why, is, the, sky, blue, question mark; 6 pieces, each a number. 3, vectors: 1,024 numbers per token. 4, transformer: 28 layers, one after another, each with attention (which words matter here?) and feed-forward (what it has learned); vectors in, better vectors out. 5, next-token odds: a probability for every one of its 151,936 tokens. 6, pick one: the top one or a weighted dice roll (temperature). 7, add it on: only the new token goes round again, back to step 3, one token at a time; notes on earlier tokens are kept in a KV cache and reused. 8, reply: at a stop token, ids turn back into text. Nothing in this loop looks facts up." width="1800" height="1100" loading="lazy" />
<figcaption>The loop goes round once for every token of the reply.</figcaption>
</figure>

If you only remember one thing, make it the loop. The model doesn't write an answer. It predicts **one** next piece of text, adds it on, and goes round again. A 300-word reply is a few hundred trips round that loop.

Let's walk through it.

## Step 2: tokens

The model can't read letters. Your prompt gets chopped into pieces called **tokens**, from a fixed list (this model's list has 151,936 of them), and each piece is really just a number.

"Why is the sky blue?" becomes 6 tokens: `Why`, ` is`, ` the`, ` sky`, ` blue`, `?`. Common words get a token of their own. Rarer ones get split: "unbelievably" comes out as `unbelie` + `vably`.

This is why models are oddly bad at things like counting the letters in a word. They never saw the letters, just the chunks.

## Step 3: vectors

Each token number then picks out a row of **1,024 numbers**, called a vector. For "cat" it starts `-0.003, -0.053, -0.015, 0.013…`. On their own those numbers mean nothing to a human. The model learned them during training.

The interesting bit is what happens to them. As the layers work on the vectors, words that get used in similar ways end up pointing in similar directions. That's about as close as the model gets to "meaning".

<figure class="guide-figure">
<img src="/guide-images/genai-2-tokens-vectors.png" alt="Left: 'Why is the sky blue?' split into six tokens with their ids 10234, 374, 279, 12884, 6303 and 30; 'unbelievably' split into 'unbelie' and 'vably'; cat's vector starting -0.003, -0.053, -0.015, 0.013. Right: cosine similarity to 'cat' in the middle layer, 14 of 28, among 20 words: kitten 0.55, dog 0.42, mouse 0.24, car 0.14, lemon minus 0.27, orange minus 0.29, yellow minus 0.31." width="1800" height="1000" loading="lazy" />
<figcaption>Measured, not drawn: animals sit close to "cat", fruit and colours far away.</figcaption>
</figure>

I took 20 words (animals, vehicles, fruit and colours, picked before I looked at anything) and measured how close each one's vector is to "cat", halfway through the model. **Kitten came out nearest at 0.55, then dog at 0.42**, with car at 0.14 and colours at the bottom.

I'll be honest, my first attempt wasn't that tidy. At the model's last layer every vector points in nearly the same direction, and "dog" even edged out "kitten". The middle layer, with the shared direction taken out, is much clearer, and that's the one I've shown. Every version I tried put the animals nearest and the colours furthest, though. The exact numbers just depend on where you look.

This idea, meaning as direction, is also what powers search over documents (the "vector databases" you hear about). That uses separate models trained to turn whole paragraphs into vectors, but it's the same idea.

## Step 4: the transformer, and attention

This is the bit the "T" in GPT stands for. A **transformer** is a stack of layers (28 in this model), and each one does two things to every token's vector:

1. **Attention:** each token looks back at the earlier tokens and decides which of them matter right now, then mixes some of their information into its own vector.
2. **Feed-forward:** each vector gets worked on by itself, which is where a lot of what the model "knows" seems to live.

Then it all goes to the next layer, and the next, 28 times. Vectors in, better vectors out.

<figure class="guide-figure">
<img src="/guide-images/genai-3-attention.png" alt="The sentence 'The animal didn't cross the street because it was too tired', with arcs from 'it' back to earlier words: 206 heads looked hardest at 'because', 53 at 'street', 42 at 'animal', out of 448 heads (28 layers times 16 heads). Later words are hidden from 'it'. Left panel: what a head does: scores how relevant each earlier token is, turns the scores into shares that add up to 1, mixes those tokens' vectors into 'it'. Right panel: the textbook picture is 'it' looking at 'animal'; here only 42 of 448 heads did that most, and 206 looked hardest at 'because'." width="1800" height="1000" loading="lazy" />
<figcaption>Attention is done by many "heads" at once, and they don't all agree.</figcaption>
</figure>

Every explainer uses the same example, so I measured it: "The animal didn't cross the street because **it** was too tired." What does "it" look at?

Each layer has 16 **attention heads**, so 448 in total, each doing its own looking. For each head I found the earlier word it looked at hardest (ignoring the very first token, which heads tend to park their attention on), and counted:

- **206** looked hardest at "because";
- **64** at the "'t" of "didn't";
- **53** at "street";
- **42** at "animal".

The diagram shows the words that matter for the story. Note that "because" is the word right before "it", and heads often favour the nearest word, which is part of why it tops the count.

That surprised me a bit. The textbook picture has "it" neatly pointing at "animal", and in this model only a minority of heads do that. Different heads pick out different things, and the understanding (such as it is) is spread across lots of heads and layers rather than living in any one of them. It's a nice reminder that the tidy diagrams are a simplification.

One more detail worth knowing: "it" can't see "was too tired" at all. When generating text, a model only ever looks *back*.

## Steps 5 to 7: odds, a pick, and round again

After the last layer, the final vector gets turned into a **probability for every one of the 151,936 tokens**. That's the model's whole output: a ranked list of what might come next.

<figure class="guide-figure">
<img src="/guide-images/genai-4-pick-and-loop.png" alt="Top left: 'The cat sat on the', next-token odds: the small 0.6B model says chair 6%, edge 5%, window 4%, with mat at 3% in fifth place; a 27B model says mat 84%, blank 2%, table 1%. Top right: 'My favourite colour is', 20 tries: temperature 0, blue 20 times, 1 different; 0.7, 7 different; 1.5, 17 different, including Guinness, liver and vinegar. Bottom: the loop for 'The sky is blue because', top choice each time: the 20%, molecules 28%, in 63%, the 93%, air 72%, are 28%, blank 9%, underscores 26%, full stop and new line 27%, Answer 83%; it turned a sensible answer into a quiz sheet." width="1800" height="1000" loading="lazy" />
<figcaption>The odds, the dice, and the loop, all from real runs.</figcaption>
</figure>

**The odds.** For "The cat sat on the", my little model spreads its bets: chair 6%, edge 5%, window 4%, and "mat" only 3%. I ran the same prompt on a 27-billion-parameter model I also have locally, and it said **mat, 84%**. Part of that is size: bigger models have seen more text. Part is training: the 27B is a chat model, the one I use as an agent, and chat training tends to make a model more decisive. So this isn't a clean test of size alone, and it's one example, not a rule that bigger models are always more confident or more accurate. Being sure isn't the same as being right, as we'll see.

**The pick.** Then something has to choose one. Always taking the top one gives the same answer every time. Rolling a weighted dice gives variety, and **temperature** controls how much the dice favour the top choice. I asked "My favourite colour is" 20 times at each setting:

- temperature 0: **blue, 20 times out of 20**;
- 0.7: **7 different answers** (blue, green, black, pink…);
- 1.5: **17 different answers**, including Guinness, liver and vinegar.

Same model, same prompt. Only the dice changed. That's why you can ask a chatbot the same question twice and get two different answers.

**The loop.** The picked token is added to the text, and the model runs again to predict the one after. I let it go for 10 rounds on "The sky is blue because":

> …the molecules in the air are ________.
> Answer

It started a perfectly sensible answer, then turned it into a quiz sheet. That isn't a bug. It's a *base* model: all it has learned is to continue text the way its training text tends to go, and the internet is full of quiz sheets. Chat models get a lot of extra training (instructions, examples of good answers, and human feedback) so that the likeliest continuation of a question is a helpful reply. Same machinery, different habits.

**A speed note.** Read naively, the loop sounds like the model re-reads your whole prompt for every new token. In practice it reads the prompt once, in one go, and then for each new token it only has to work on that token. It keeps the notes it made on the earlier tokens (a [KV cache](https://huggingface.co/docs/transformers/kv_cache)) and reuses them. The answer is the same as starting from scratch each time, just much faster. It's also why a long prompt can take a moment before the first word appears, and then the words stream.

## So where do the made-up facts come from?

Look at that loop diagram again. Nothing in it looks anything up. Every word is "what's likely to come next", and nothing else.

So I gave my model a question-and-answer prompt about a country I'd just invented, "Q: What is the capital of Zarnovia?" followed by "A: The capital of Zarnovia is", and let it carry on:

> **Zarnovia City.**

Confident, fluent and entirely made up. It's not lying, it's doing exactly what it always does: producing a likely-looking continuation. A capital city of "Zarnovia" is very likely to be called something like "Zarnovia City". Real chat models are trained to say "I don't know" more often, and many can now search the web first, but underneath, this is the habit they're fighting.

## What this means in practice

A few things I think are worth taking away, especially if you're building with these models:

- **It's prediction, not lookup.** If the answer matters, give the model the facts in the prompt (that's what retrieval and tools are for) and check what comes back.
- **Tokens are the unit of everything.** Pricing, context limits and speed are all counted in tokens, and the model's view of your text is in chunks, not letters.
- **Different answers to the same question are normal.** That's the dice. Turn the temperature down when you want consistency.
- **What it knows comes from two places:** what it learned in training, which is stored in its parameters, and the text in front of it right now. It doesn't look anything else up. "Memory" in chat apps is the app quietly pasting earlier conversation, or notes about you, back in.
- **Agents are this loop with tools added.** The model predicts "call the search tool" as text, some code runs the search, and the result gets pasted back in. I tested when that's worth it in [Do you actually need an agent?](/architecture/do-you-need-an-agent/)

## The limits

This was one small base model and a handful of prompts. That's enough to show the machinery, but not to make claims about how big chat models behave in detail. The attention counts are one simple way of looking at attention (where each head looks hardest), not a full analysis. And the vector numbers depend on which layer you measure, which I've said where it matters.

Everything is on GitHub: [the scripts, the raw results and the diagrams](https://github.com/meabs/experiments/tree/a192b8b631ba809fa5aa187a3bf99a69c76214fb/2026-10-how-genai-works). The whole thing ran on my desk, so the model time cost me nothing, which as a tight northerner is my favourite price.
