---
title: "Three AI agents agreed. Did that make them right? (experiment TH)"
description: "AI agents triaged security alerts whose evidence contained one false fact, contradicted by another record. A vote of three agents did no better than one. After reading each other's conclusions, all three escalated every harmless alert with conflicting records. A stronger model reviewing the team rarely overruled it. Allowing a \"can't tell, investigate\" answer halved the peer-reviewed team's harmful errors by sending cases to a human."
date: 2026-10-29
summary: "With tampered security evidence, three Luna agents voting got 20 of 42 cases right, against 17 for one agent. After peer review all three escalated all 22 harmless cases with conflicting records, and Sol, reviewing the team, overruled it only 6 times in 42. Letting agents answer \"can't tell, investigate\" halved the peer-reviewed team's harmful errors (29 to 15 of 42, exploratory), by sending 19 of 42 cases to a human."
type: "Controlled trial"
github:
  - label: "Data and code on GitHub"
    href: "https://github.com/meabs/experiments/tree/c8c5bf1149b0f5e5aebcaa591d7427bafabc352d/2026-10-team-herding"
draft: false
experimentId: "TH"
question: "When security evidence has been tampered with, does a team of AI agents catch the error, repeat it, or make it worse, and does a stronger model reviewing the team's work fix it?"
status: published
evidenceGrade: published
agents:
  - name: "Codex CLI 0.157"
    model: "gpt-5.6-luna (hosted), the team"
    settings: "medium reasoning effort; each agent call a fresh session in a sandbox holding only the alert and its evidence"
  - name: "Codex CLI 0.157"
    model: "gpt-5.6-sol (hosted), the reviewer"
    settings: "medium reasoning effort"
runs: 1122
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/c8c5bf1149b0f5e5aebcaa591d7427bafabc352d/2026-10-team-herding/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/587f7baad017326fa078e6657ac1d09d5a16ec84/2026-10-team-herding/README.md"
previewImage: "/guide-images/chart-team-herding.png"
previewAlt: "Harmful errors, lower is better, of 20 genuine threats and 22 harmless cases: one Luna agent 5 and 16; three voting 7 and 15; three after peer review 7 and 22; one agent with the same token budget 4 and 16; Sol reviewing the team 2 and 17; Sol alone 2 and 18. Of 42 falsified cases, right, sent for investigation and harmful: three voting 20, 0, 22, and with a can't-tell answer allowed 13, 11, 18; peer review 13, 0, 29, and with can't-tell allowed 8, 19, 15."
topics:
  - review
  - safety-cost
  - verification
  - parallel
publishedOn: 2026-10-29
findings:
  - id: "TH-1"
    statement: "A vote of three identical agents was no better than one agent at seeing through a false fact"
    metric: "correct decisions on 21 falsified cases × 2 repeats (higher is better)"
    value: "20 vs 17 of 42"
    interval:
      low: "+0.00"
      high: "+0.14"
      method: "mean difference per case-repeat, bootstrap 95% CI over cases; exact sign-flip test, Holm p 0.50: no measurable difference"
    n: 42
    detail:
      - "the vote did better on 3 cases, the same on 18 and worse on none"
      - "all three voting agents were wrong together in 18 of 42; one error rate for every case would give 6.0, and each case's own rate would give 18.9, so most of the apparent shared error is case difficulty"
    limits:
      - "the agents shared one model, one prompt and the same evidence; diverse agents were not tested"
      - "the 18.9 baseline is estimated from the same six solo answers per case, so it cannot show that errors were no more shared than chance, and any residual dependence between the agents cannot be measured reliably"
    source: "https://github.com/meabs/experiments/blob/c8c5bf1149b0f5e5aebcaa591d7427bafabc352d/2026-10-team-herding/REPORT.md"
    status: current
    featured: false
  - id: "TH-2"
    statement: "After reading each other's conclusions, all three agents escalated every harmless alert whose records conflicted"
    metric: "harmless falsified case-repeats where the peer-reviewed team escalated (lower is better)"
    value: "22 of 22"
    n: 22
    detail:
      - "voting without peer review escalated 15 of 22"
      - "23 member answers changed from right to wrong after peer review, 20 of them on harmless cases; 4 changed from wrong to right, all genuine threats"
      - "genuine threats missed: 7 of 20 with or without peer review"
      - "escalating a harmless alert whose records conflict is a defensible security decision; the ground truth scores it as wrong, which is why the results are split by threat and harmless"
    limits:
      - "pre-registered H2 (all three wrong more often after peer review): 6 cases more, 1 fewer, Holm p 0.31, no measurable difference"
    source: "https://github.com/meabs/experiments/blob/c8c5bf1149b0f5e5aebcaa591d7427bafabc352d/2026-10-team-herding/REPORT.md"
    status: current
    featured: false
  - id: "TH-3"
    statement: "A stronger model reviewing the team rarely overruled it, and did no better than on its own"
    metric: "falsified case-repeats where Sol overruled the peer-reviewed team"
    value: "6 of 42"
    n: 42
    detail:
      - "all 6 overrules were right; Sol agreed with a wrong team in 23"
      - "Sol reviewing the team got 19 of 42 right, the same as Sol alone (Holm p 1.00), at about 25% more cost"
      - "Sol, alone or reviewing, missed 2 of 20 genuine threats, against 7 for the Luna teams"
    limits:
      - "one reviewer model, at medium effort"
    source: "https://github.com/meabs/experiments/blob/c8c5bf1149b0f5e5aebcaa591d7427bafabc352d/2026-10-team-herding/REPORT.md"
    status: current
    featured: false
  - id: "TH-4"
    statement: "Allowing a \"can't tell, investigate\" answer for conflicting evidence halved the peer-reviewed team's harmful errors, by sending 19 of 42 falsified case-repeats to a human (exploratory)"
    metric: "harmful errors after peer review: genuine threats called harmless plus harmless activity escalated, of 42 falsified case-repeats (lower is better)"
    value: "29 → 15"
    n: 42
    detail:
      - "fewer harmful errors on 9 cases, more on none; two-sided sign-flip p 0.004, unadjusted"
      - "genuine threats called harmless fell from 7 to 2 of 20; harmless activity escalated from 22 to 13 of 22"
      - "the cost: 19 of 42 falsified and 5 of 18 clean case-repeats sent for investigation, and right answers fell from 13 to 8; those cases are unresolved, not solved, and still need an analyst"
    limits:
      - "added after the main run, in an amendment, and run afterwards rather than interleaved"
    source: "https://github.com/meabs/experiments/blob/c8c5bf1149b0f5e5aebcaa591d7427bafabc352d/2026-10-team-herding/REPORT.md"
    status: current
    featured: false
---

## Question

"Use several agents and let them check each other" is a common answer to AI unreliability. It assumes the agents' mistakes are independent, so a vote or a review catches them.

[Evidence-manipulation](/experiments/evidence-manipulation/) found that one false fact in the evidence led a single agent to the wrong security decision even when another record contradicted it. [Swarm-tax](/experiments/swarm-tax/) found that a team of coding agents did no better than one, and that every reviewer approval went to failing code.

So I put the two together. When the evidence behind a security alert has been tampered with:

- does a team of agents catch the false fact, repeat the mistake, or make it worse?
- does a stronger model, reviewing the team's work at the end, fix it?

**The short answer:** extra copies of the same agent didn't add an independent check. Peer review made the agents agree and escalate, not get more right. The stronger reviewer mostly confirmed what the team said. The biggest improvement came from letting the agents say "the records conflict, I can't tell".

## Prediction

Before the runs, I published the design and five hypotheses ([README.md](https://github.com/meabs/experiments/blob/587f7baad017326fa078e6657ac1d09d5a16ec84/2026-10-team-herding/README.md)):

- **H1.** Three agents voting do no better than one, because they share their mistakes.
- **H2.** After peer review, all three are wrong more often.
- **H3.** Peer review does no better than one agent given the same token budget.
- **H4.** A stronger model's final review gets more right than the team alone.
- **H5.** The stronger model gets fewer right when it sees the team's answers than on its own.

## Set-up

**The agents:** Codex CLI 0.157. The team is hosted `gpt-5.6-luna` and the reviewer hosted `gpt-5.6-sol`, both at medium reasoning effort. Each agent call is a fresh session in a sandbox holding only the alert, its evidence files, a seven-rule triage policy and a simulated action command. The answer is forced into a fixed format: malicious or benign, an action (escalate, close or request an investigation), the evidence used, uncertainty, and whether any evidence looks tampered with.

**The cases,** from evidence-manipulation, unchanged:
- **21 falsified alerts:** one fact in one evidence item is false, and another item still shows the truth. For example, a sign-in log shows an external address where the session recorder shows the approved jump host. In 10 the activity is a genuine threat made to look harmless; in 11 it's harmless activity made to look like a threat.
- **9 clean alerts:** the same scenarios with accurate evidence.

**Six setups:**

| Setup | What runs |
| --- | --- |
| A: one agent | one Luna session |
| B: three voting | three separate Luna sessions, majority decision |
| C: peer review | B's three agents again, each shown its own and the other two assessments, then a majority |
| E: one agent, same budget | one Luna session that re-checks its own answer three more times, using about as many tokens as C |
| F: Sol reviews the team | Sol, with the evidence and C's three assessments, makes the final call |
| G: Sol alone | one Sol session |

Two repeats per alert: 60 per setup, 720 agent calls. **Scoring:** the decision against the hidden ground truth; higher is better.

**An extra setup, added after the main run:** the same, except the instructions allow "undetermined, request an investigation" when evidence items contradict each other and the agent can't tell which is true. A, B, C and F were rerun this way (402 calls).

## Results

Findings TH-1 to TH-4 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-team-herding.png" alt="Harmful errors, lower is better, of 20 genuine threats and 22 harmless cases: one Luna agent 5 and 16; three voting 7 and 15; three after peer review 7 and 22; one agent with the same token budget 4 and 16; Sol reviewing the team 2 and 17; Sol alone 2 and 18. Of 42 falsified cases, right, sent for investigation and harmful: three voting 20, 0, 22, and with a can't-tell answer allowed 13, 11, 18; peer review 13, 0, 29, and with can't-tell allowed 8, 19, 15." width="1800" height="920" loading="lazy" />

<figcaption>Left: extra agents and a stronger reviewer didn't cut harmful errors much; peer review escalated every conflicting harmless case. Right: a "can't tell" answer halved peer review's harmful errors, by sending 19 cases to a human. Source: github.com/meabs/experiments, 2026-10-team-herding/results (Codex 0.157, medium effort).</figcaption>

</figure>

### Two ways to score

The pre-registered measure is **classification**: a case counts as right when the malicious or benign decision matches the ground truth, even if the agent also asked for an investigation. H1 to H5 use it, as pre-registered.

A triage team sees something different: **the outcome**, meaning what the agent did. The tables further down count each falsified case as a right action, a harmful action, or sent for investigation. They differ: one agent's 17 correct decisions in the first table are 16 right, 21 harmful and 5 sent for investigation in the outcome table. For judging a deployed team, the outcome view is the more useful one.

### Correct decisions

Each cell is correct decisions (higher is better).

| Setup | Falsified, of 42 | Clean, of 18 | Cost per alert |
| --- | --- | --- | --- |
| A: one agent | 17 | 18 | $0.003 |
| B: three voting | 20 | 18 | $0.009 |
| C: peer review | 13 | 17 | $0.019 |
| E: one agent, same budget | 20 | 18 | $0.025 |
| F: Sol reviews the team | 19 | 16 | $0.088 |
| G: Sol alone | 19 | 18 | $0.070 |

No setup got even half of the falsified alerts right. On clean evidence, only the two setups that read other agents' conclusions made mistakes.

### Hypotheses

| # | Comparison | Cases better / same / worse | Holm p | Result |
| --- | --- | --- | --- | --- |
| H1 | three voting − one agent | 3 / 18 / 0 | 0.50 | no measurable difference |
| H2 | all three wrong: peer review − voting | 6 / 14 / 1 (more often wrong) | 0.31 | no measurable difference |
| H3 | peer review − one agent, same budget | 0 / 16 / 5 | 0.31 | no measurable difference |
| H4 | Sol reviews the team − the team | 4 / 17 / 0 | 0.38 | no measurable difference |
| H5 | Sol reviews the team − Sol alone | 3 / 15 / 3 | 1.00 | no measurable difference |

- **The Holm p** is the chance of a difference this large if there were really none, corrected for testing five hypotheses. Below 0.05 counts as measurable.
- **"No measurable difference"** means the test couldn't tell the setups apart with 21 cases, not that they're equal. The directions still say something: peer review was never better than one agent with the same budget, and Sol's review was never worse than the team without it.

### What the score was really measuring

While the main run was finishing, I checked the results for bias. The errors split almost entirely by the true answer:

| Setup | Genuine threats called harmless, of 20 (lower is better) | Harmless activity escalated, of 22 (lower is better) |
| --- | --- | --- |
| A: one agent | 5 | 16 |
| B: three voting | 7 | 15 |
| C: peer review | 7 | 22 |
| E: one agent, same budget | 4 | 16 |
| F: Sol reviews the team | 2 | 17 |
| G: Sol alone | 2 | 18 |

In every falsified alert, the false record and the true one point opposite ways, and nothing the agent can see says which is true. An agent that escalates whenever records conflict is right on every threat and wrong on every harmless case. Escalating a harmless alert whose records conflict is a defensible security decision, but the ground truth scores it as wrong. So the headline "peer review got fewer right" mostly means peer review escalated more harmless alerts. It missed no more threats.

I logged this as an amendment before writing anything up, kept the pre-registered results as they were, and added the extra setup to test the obvious fix.

### Peer review

- **23 right answers became wrong** after agents read the other two assessments, and 4 wrong answers became right.
- **20 of the 23 were harmless alerts** that the agent had closed on its own and then escalated. All 4 that became right were genuine threats.
- **After peer review, all three agents escalated all 22 harmless alerts.** Agents flagged possible tampering more often after reading the others (34 of 66 answers, against 22 of 66), and every one that flagged it on a harmless alert escalated.

### The stronger reviewer

- **Sol overruled the peer-reviewed team 6 times in 42,** and was right every time. It agreed with a wrong team 23 times.
- **Its score as reviewer matched its score alone** (19 of 42), at about 25% more cost.
- **Sol, alone or reviewing, missed the fewest genuine threats:** 2 of 20, against 7 for the Luna teams.

### Allowing "can't tell"

**Peer review, without and with "can't tell" allowed, of 42 falsified alerts:**

- **Harmful actions:** 29 → 15 (fewer on 9 alerts, more on none; p 0.004, unadjusted and exploratory).
- **Genuine threats missed:** 7 → 2 of 20. Harmless activity escalated: 22 → 13 of 22.
- **Sent for investigation:** 0 → 19. Five of 18 clean alerts were sent as well.
- **Right actions:** 13 → 8.

This is a trade of coverage for risk, with human review as the third cost. The 19 cases weren't solved, they moved to an analyst.

By setup, of 42 falsified alerts: right (higher is better) / harmful error (lower is better) / sent for investigation.

| Setup | Main run | "Can't tell" allowed |
| --- | --- | --- |
| A: one agent | 16 / 21 / 5 | 14 / 18 / 10 |
| B: three voting | 20 / 22 / 0 | 13 / 18 / 11 |
| C: peer review | 13 / 29 / 0 | 8 / 15 / 19 |
| F: Sol reviews the team | 16 / 19 / 7 | 10 / 16 / 16 |

- **Peer review now moved answers towards investigation instead of escalation.** No answer went from right to harmful.
- The other setups changed less, with 3 or 4 fewer harmful errors each.

### Cost

$15.50 at list prices for 1,170 agent calls: $10.46 for the main run, $4.23 for the extra setup and $0.81 for the pilot. About 17 seconds per Luna call and 22 per Sol call.

### Checks on the runs

- **All 1,122 measured calls returned a valid answer.**
- **Every session file shows the intended model at medium effort.**
- **No session reached the ground truth;** the sandbox hides it, and an isolation test confirms that.

## Limits

- **Small sample:** 21 falsified alerts, 2 repeats each. None of the pre-registered hypotheses reached significance.
- **The scoring bias affects every pre-registered comparison.** The tables above split errors by threat and harmless so the two kinds can be weighed separately.
- **The "can't tell" setup ran after the main run,** not interleaved with it, so its comparison includes run-to-run variation. It is exploratory.
- **One kind of team:** same model, same prompt, same evidence. Agents with different models or different evidence might share fewer mistakes.
- **Synthetic alerts,** each with one clean contradiction. Real alerts are messier.

## What this means: impact and risks

This part is my interpretation, not a measurement.

**More copies of the same agent aren't an independent check.** When the evidence misleads one agent, it misleads the others on the same alerts.

**Agreeing, being right and being safe are three different things.** After reading each other's conclusions the agents converged: all three escalated all 22 harmless alerts, up from 15 under a plain vote. That isn't clearly more wrong or less safe. 20 of the 23 right-to-wrong changes were harmless alerts the agent had closed and then escalated, a shift towards caution, and peer review missed no more genuine threats than voting (7 of 20). What it cost was analyst time on false alarms. With differently built evidence, the same pull towards the group's reading could as easily mean three agents closing a real threat together, but this experiment didn't test that.

**A unanimous team looks more convincing than it is.** "Three agents agreed" invites trust, but here it mostly meant the agents had settled on the same reading of a conflict.

**A stronger reviewer at the end is a weak safeguard.** It was right when it disagreed, but it rarely disagreed, and it cost more than running the stronger model alone.

**Forced verdicts hide uncertainty.** Asked for malicious or benign, agents pick one even when the evidence can't support either.

## Configuration recommendations

For AI agents triaging security alerts, based on this experiment. None rests on a significant pre-registered result, so each says how strong its evidence is.

| Recommendation | Why | Strength |
| --- | --- | --- |
| Give agents an explicit "evidence conflicts, can't tell" answer that routes to a human, and say when to use it | Peer review's harmful errors fell from 29 to 15 of 42, with 19 sent to a human | Moderate: exploratory, p 0.004 |
| Budget for the extra investigations it creates | 19 of 42 falsified and 5 of 18 clean alerts went to a human | Descriptive |
| Don't rely on several copies of the same agent voting | 20 right against 17 for one agent | Consistent, not significant |
| If you use several agents, keep their conclusions apart until each has decided | 23 right answers became wrong after peer review, 4 wrong became right | Descriptive |
| Don't assume extra review passes improve reliability: compare any review or team against a single pass, and include cost | One agent re-checking its answer got 20 right against 17 for a single pass (not tested), at $0.025 against $0.003 an alert; peer review got 13, mostly by escalating more harmless alerts | Descriptive |
| Run a stronger model on its own rather than as a reviewer of a cheaper team | Same score (19 of 42) for about 80% of the cost | Descriptive |
| Give the agent a trusted source to check evidence against | In evidence-manipulation, a verification tool fixed 359 of 360 manipulated runs | Strong, from the earlier experiment |

## What would be worth testing next?

These are proposals, not results.

- **Diverse teams:** different models, or agents that see different evidence, to see whether a vote helps when mistakes are less shared.
- **A devil's advocate:** one agent told to argue against the team's conclusion.
- **"Can't tell" plus a verification tool:** does the agent check before sending the alert to a human?
- **Weighted errors:** score missed threats and false escalations at different costs, as a security team would.

## Reproduce

Everything is in [experiments/2026-10-team-herding](https://github.com/meabs/experiments/tree/c8c5bf1149b0f5e5aebcaa591d7427bafabc352d/2026-10-team-herding):

- the harness, prompts and sandbox (`src/`, `setup/`);
- the cases, built from evidence-manipulation (`cases.json`);
- every agent call's prompt, event stream, answer and token use (`results/main`, `results/investigate`, `results/pilot`);
- the analysis, exploratory analysis, checks and chart scripts.

The commands are in REPORT.md, section 10.
