---
title: "8. Review, merging and risk"
description: "From Programming the Loop — 8. Review, merging and risk."
---

<p class="guide-edition-note">Free to read on the web. <a href="/resources/">October 2026 PDF</a> · <a href="/updates/">Updates</a></p>

You're the first reviewer of anything your agent produces. Size that review to the *consequence of being wrong*, whatever the size of the diff or the confidence of the description. I judge that consequence on three criteria: **reversibility** (how easily can we undo it?), **blast radius** (who and what is affected if it's wrong?) and **verification strength** (how strongly has the behaviour actually been shown?). Strong verification can lower the review a change needs; weak verification raises it, whatever the size.

## Three review criteria

- **Reversibility.** Can it be rolled back with a revert and a redeploy, in minutes, with no lasting effect? Or does it migrate data, publish an interface others will build on, send messages, or delete something? Irreversible changes deserve a decision *before* coding, not just a review after.
- **Blast radius.** One internal function, one service, a public contract, many consumers, customers' money? The more that depends on it, the higher the tier.
- **Verification strength.** From weakest to strongest: the agent's description; tests the agent wrote; existing tests; a red/green run; real-use evidence; an independent check in a clean environment; contract or integration checks against the real dependency. A small change with no good way to check its behaviour may deserve more scrutiny than a large mechanical refactor with a reliable checker.

## Risk tiers

<figure class="guide-figure">

![Review risk tiers](/guide-images/fig-risk-tiers.png)

<figcaption>Figure 8.1. Review risk tiers. An illustrative scheme: risk-grade every change, and match the review to the consequence of being wrong. The idea of grading each PR for risk and merging low-to-medium-risk changes without human review comes from @poteto's description of her team's practice; the tier boundaries and examples are my own suggestion, not a measured standard.</figcaption>

</figure>


| Tier | Typical change | What puts it here | Review |
|---|---|---|---|
| **Low** | Docs, test additions, mechanical refactors with a checker, dependency patches with green CI | Fully reversible; tiny blast radius; strong automated check | Automated checks plus model review; human optional *if* your evidence supports it |
| **Medium** | Feature work inside one service, behind tests | Reversible by revert; one service; tests plus real-use evidence | Model review plus a human read of the evidence and the diff |
| **High** | Data model or public contract changes, cross-service changes | Hard to reverse, or other teams depend on it; verification needs the real dependency | Plan agreed before coding; human review of every line; contract and integration checks |
| **Critical** | Security, authentication, money, permissions, deployment, data deletion | Irreversible or wide blast radius; failures may be silent | Constrained execution; explicit human decision points; negative-path tests; rollback plan; independent review |


I haven't measured these tiers; they're a suggestion. A change can move up a tier during review if it turns out to touch something sensitive, and it should move down only when you have evidence (a record of that kind of change never needing correction) that the lower tier is safe.

## Worked example, stage 7: review the diff and the evidence

Review in this order: brief, evidence, shape of the diff, tests, implementation, tier. Evidence comes before code, because there's no point reviewing the code of a change that hasn't been shown to work.

1. **Brief.** One endpoint; out of scope: caching, contract changes, `/products/{sku}`, UI.
2. **Evidence** ([Chapter 5](/guides/programming-the-loop/proof-not-promises/)), checked against the logs: freshness check passed; red run 4 failed, 3 passed; green 9 passed; live run against inventory 2.1.0 matches criteria 1 to 3; criterion 4 covered by unit tests only, and the report says so.
3. **Shape of the diff** — real script output:

```text
 app/clients/inventory.py   | 33 +++++++++++++++++++++
 app/main.py                | 17 ++++++++++-
 tests/test_availability.py | 72 ++++++++++++++++++++++++++++++++++++++++++++++
 3 files changed, 121 insertions(+), 1 deletion(-)
```

Three files, all inside the brief's scope. Nothing in `contracts/`, nothing touching the existing route's behaviour. A brief that said "one endpoint" and a diff touching twenty files would be a conversation, not a review.

4. **Tests before implementation.** They tell you what the author, agent or human, thinks the behaviour is. Here they cover all four criteria and include a test that parses the contract's own example, so the field names come from the contract, not from memory. The red run flagged a weakness: the two 404 tests pass even without the route. Ask for them to assert the error detail.
5. **Implementation.** Errors are surfaced, not swallowed: inventory off-contract raises, is logged and becomes a 502. No new dependency. It reuses the existing client pattern rather than inventing a new HTTP layer.
6. **Tier.** Additive endpoint, reversible by revert, one service, strong verification including real use: **Medium**. It reads another team's API but doesn't change it. If it had changed the contract, it would be **High**, and the plan would need agreeing with the inventory team first.

## How much human review?

Start with your own: if it's your name on the pull request, it's your yard. Simon Willison: “Don't file pull requests with code you haven't reviewed yourself” (Simon Willison, [“Anti-patterns: things to avoid”](https://simonwillison.net/guides/agentic-engineering-patterns/anti-patterns/)). That includes the description: fluent isn't the same as accurate. Keep what you review reviewable. Karpathy has said a 10,000-line diff isn't useful to him, and Willison notes the agent that made the mess can split it into small, logical commits for you. Kent Beck's rule from *Tidy First?* is transformative with agents: “Never mix structural and behavioral changes in the same commit” (Kent Beck, [“Augmented Coding: Beyond the Vibes” (25 Jun 2025)](https://tidyfirst.substack.com/p/augmented-coding-beyond-the-vibes)). Structural changes need only "did anything change behaviour?"; behavioural ones are small because the tidying has already landed.

Beyond that, practitioners split. Ronacher reviews every line and carries the responsibility in production; Willison expects a human to have read everything submitted. @poteto's team, with heavy automated verification, works differently: “we have agentic code review, so every PR gets assessed for risk. low-medium risk ones don't require a review so you just merge it.” (lauren (@poteto), [post on X, 8 Oct 2026](https://x.com/poteto/status/2108283057581195413)) My position sits between them: **review everything until your verification is strong enough to show, with evidence, where skipping human review is safe.** Then tier by risk, on the three criteria above. That is a recommendation; I haven't measured review policies.

Several practitioners use a different model as reviewer, on the reasoning that a model reviewing its own work tends to agree with itself. Ronacher uses a different model for review after PRs; @poteto has different models review adversarially. Treat it as a filter: it catches things, but it doesn't get the final say. And know what to look for. Ronacher's list is the best I know: recreating things that already exist, and abstractions completely inappropriate to the scale of the problem. Add scope creep, weakened or deleted tests, swallowed errors and new dependencies nobody asked for.

## Recommendation: grade, then review

Grade every change on reversibility, blast radius and verification strength, and choose the review from the tier. Read evidence before code. Keep a record of which kinds of change never needed correction: that list is your evidence for moving a kind of change down a tier. When you send something back, say why in a way the agent can act on; if the same reason comes up twice, it belongs in the harness ([Chapter 6](/guides/programming-the-loop/harness-friction-loop/)) rather than in review comments.

## Try this on your repository

1. Take your last ten merged PRs, agent-written or not.
2. Grade each on the three criteria, and assign a tier.
3. Compare with the review each actually got. Which got too little for their tier? Which got a line-by-line read they didn't need?
4. Write down one kind of change you'd be willing to move down a tier, and what evidence you'd need first.

## Checklist

- [ ] Review your own agent's PR first, description included.
- [ ] Grade by reversibility, blast radius and verification strength, not size.
- [ ] Evidence before code; tests before implementation.
- [ ] Keep diffs small; structural and behavioural changes in separate commits.
- [ ] Use a different model as a filter, not a verdict.
- [ ] Move a kind of change down a tier only on evidence.
