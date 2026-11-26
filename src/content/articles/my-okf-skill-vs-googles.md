---
title: "I Tested My OKF Skill Against Google's. It Wins One Thing and Loses Another"
description: "I compared my own interview skill for the Open Knowledge Format with Google's two skills, twice. Mine kept the unanswered questions in a log and Google's had nowhere to put them, but Google's covered more of what the engineer said. I fixed mine and told Google."
date: 2026-11-26T15:00:00+00:00
summary: "Two small tests of my OKF interview skill against Google's. Same validator results, a clear difference in where unknowns go, a coverage gap in mine, and what I changed."
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

## Round two: a more realistic engineer

My first engineer was seven canned answers, which is a bit convenient. So I redid it with a separate model playing a senior engineer who owns the code and has read it. Plain, first person, hedging, saying "no idea" when it doesn't know. I gave it two honest mistakes to make: "I'd assume the vendor deduplicates, never checked" and "we never retry automatically", when the worker in my new second file retries up to three times.

My skill ran three rounds of questions with that engineer and then wrote the bundle. Google's can't interview, so the engineer wrote it one handover note instead. Five runs each, and four versions of my skill as I fixed things between rounds.

Every bundle passed the validator. None invented a detail, none stated the deduplication guess as fact, and none claimed there were no retries. I read every line my script flagged and they were all false alarms. In every interview my skill found the retry behaviour from the code before the engineer mentioned it, which is the thing it's built for. Google's engineer note mentioned it too, so this test couldn't separate them on that.

What it could separate was coverage. I scored eight things the engineer said or the code does. Google's route covered 7.6 of them on average. Mine covered between 5.2 and 6.4, depending on version. With three rounds, my interviewer went deep on retry safety and how the store works, and never asked about proxy settings or why the timeouts are what they are. A handover note tells you what the engineer thinks matters. An interview tells you what you thought to ask.

## What I changed

- The checker now catches the gap sentences it was missing, and an unused footnote is a warning, not an error.
- Where the code visibly does something nobody can explain, the skill now writes down the value and says the reason isn't known.
- The skill keeps a list of what the code does (flags, timeouts, limits, retry counts) and has to account for each item, so it can't quietly skip one.
- A few small things borrowed from Google's skills by linking to them: the `team:` actor, their migration rules, and a pointer to `okf-consume` for reading bundles.

Sentences about gaps left in concept bodies fell from about one per bundle to about none. Coverage went up a bit with the list, but it's still short of Google's, and a breadth-first rule I tried fixed one fact and lost others, so I can't call it a win. Five runs each doesn't give me a ranking, and I tuned each version after seeing the last one, so these numbers flatter my changes.

## What I sent Google

Their skill has nowhere to put an unanswered question, in either round. I didn't send a pull request, because that needs me to sign their CLA first. I raised [an issue](https://github.com/open-knowledge-format/open-knowledge-format/issues/20) asking whether an "engineer interview" use case would fit, with my review log and completeness check as the worked example. I've not had a reply yet.

## What this doesn't show

- It's one tiny made-up scenario, one model, five runs each.
- I wrote the fixture, the answer key and the scoring. The scoring is partly pattern matching, with the flagged lines read by hand, and I changed two patterns after seeing data.
- The engineer is a model, so it's more consistent and more helpful than a person.
- My three-round limit was my test setup, not the skill. Let it keep going and it might well cover more.
- Google's skill wasn't built for interviews, so this isn't a fair test of what theirs is for.

All it really says is how the two behave on this one case. The useful part for me is a list of things I've now fixed, and one I haven't.

Everything is in the [test folder](https://github.com/meabs/experiments/tree/1a133405fbd80ecb644db74aaa639a586cd4cf6c/2026-11-okf-skill-compare), with [round one](https://github.com/meabs/experiments/blob/1a133405fbd80ecb644db74aaa639a586cd4cf6c/2026-11-okf-skill-compare/FINDINGS.md) and [round two](https://github.com/meabs/experiments/blob/1a133405fbd80ecb644db74aaa639a586cd4cf6c/2026-11-okf-skill-compare/FINDINGS2.md) written up.
