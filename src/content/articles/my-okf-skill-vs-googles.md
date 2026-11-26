---
title: "I Tested My OKF Skill Against Google's. It Wins One Thing and Loses Another"
description: "I compared my own interview skill for the Open Knowledge Format with Google's two skills on a small test. Mine kept the unanswered questions in a log. Google's had nowhere to put them. Mine dropped a fact that theirs kept."
date: 2026-11-26T15:00:00+00:00
summary: "A small test of my OKF interview skill against Google's okf-generate and okf-consume. Same validator results, one clear difference in where the unknowns go, and a rule of mine that dropped something useful."
draft: false
topics:
  - context
  - verification
---

*A note before I start. I've got mild dyslexia, so I use AI tooling to help with my writing. Claude Code drafted this from the test results, in my voice, and I've gone through it. The thoughts are mine, and the numbers come from the test write-up.*

Google put out version 0.3 of the Open Knowledge Format and, with it, two agent skills of their own for writing and reading OKF bundles. I'd already built a skill for the same format.

So the obvious question was whether mine is any good next to theirs, or whether I'd spent a few evenings reinventing something Google had done better.

I asked Claude Code to act as an engineer doing a comparison, and not to be nice about it.

## What each one is for

They don't do the same job, which I should have spotted sooner.

Google's `okf-generate` writes a bundle from sources you give it: schemas, docs, runbooks. Its `okf-consume` reads a bundle back and tells you how far to trust each bit (verified or not, draft, stale, deprecated).

Mine, `okf-interview`, starts earlier. It reads the code, works out what the code can't tell you, interviews an engineer about it, and only writes down answers that are complete. Anything unanswered goes in a separate review log, outside the bundle.

Google's has no interviewing. Mine has no reading back.

## The checks that cost nothing

Before spending a penny on a model I just ran things.

My validator turned out to be identical to Google's, byte for byte. I'd copied it in. My example bundle passes it with no errors under the strict setting. Fine.

Then I ran my own content checker over Google's sample bundles, and it threw ten errors across two of them. The reason was a footnote that's defined but never cited in the text. The spec doesn't forbid that. So my checker was stricter than the format it's meant to serve, and it was shouting at Google for something that's allowed.

I've made that a warning.

## The test

Small and cheap, on purpose. One little piece of code, a caller for an invoice import API, and seven answers from an invented engineer. Four of the answers were "I don't know": how fast the completion event arrives, whether the vendor deduplicates, who owns an endpoint change, and why the timeouts are 3 and 20 seconds.

Each skill got the same code and notes and had to build a bundle in one go. Five runs each. Then a second agent answered nine questions from each bundle, five that the bundle can answer and four it can't.

The whole lot cost 27 cents.

## What came out the same

Neither skill invented anything. I read every line my script flagged, and the real count of invented claims was nought for both. Nought fake "verified" entries. Nought validator errors.

That was a bit of a relief and a bit of a letdown, if I'm honest. I was hoping for a good gloat. Both skills behave themselves.

## Where mine did better

The four unknowns. My skill put all four in a review log in all five runs, with the exact thing needed to close each one.

Google's skill made no log in any of the five. There's no obvious place for one, because `log.md` in OKF is a change log. So the unknowns went into the concept text as prose. One bundle put them in a playbook. That's not wrong, but it means the bundle itself is now carrying "we don't know this" in sentences that an agent has to read and interpret.

## Where mine did worse

My skill left out the timeout values. Nobody could explain why they were 3 and 20, so my "only complete answers" rule decided there was nothing to say. Google's skill wrote the values down and said the reason was unknown, in four of five runs.

My rule worked exactly as I designed it, and I'm not convinced the design is right. An agent reading my bundle can't see those numbers, or that nobody knows why they're there. I'd quite like to know that.

## Where I got it wrong in the test itself

My first scoring said my skill kept all the gap talk out of the concepts. It hadn't. I read the bundles by hand and three of my five still had sentences like "deduplication is unconfirmed" in the body. My own checker missed them because its list of phrases didn't include that one.

So the checker had a hole, which I've patched, and I nearly told you something flattering that wasn't true.

## The reading test told me nothing

Every run got all five answerable questions right and said the other four weren't covered. Plain reading, Google's `okf-consume`, my bundles, theirs. All the same.

I'd made it too easy. The one real difference was that with `okf-consume` the agent reported trust tier and status far more often. It didn't make the answers more correct.

## What I'd do about it

I've made two small changes to my checker. There's one decision I haven't made yet, which is whether my skill should record things it can see in the code even when nobody can say why. I'm leaning towards yes, with the "why" marked as unknown.

Google's skill doesn't have anywhere to put an unanswered question, and mine does. If they'd want it, an "engineer interview" use case in their repo looks like a fair fit. I haven't written one or sent anything.

## What this doesn't show

It's one tiny made-up scenario, one model, five runs each. I wrote the fixture, the answer key and the scoring, and the scoring is partly pattern matching that I then checked by hand. My skill was built for a live interview and here ran on a recorded one. Google's wasn't built for interviews at all, so this isn't a fair test of what theirs is for.

All it really says is how the two behave on this one case. The most useful result is a short list of things to fix in mine.
