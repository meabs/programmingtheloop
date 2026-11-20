---
title: "Which kind of team finds the mistakes in a design? (PLF)"
description: "Nine agents agree a draft design that contains ten planted flaws, as sceptics, agreeable agents, Belbin roles or with no personality. All found most of them; what differed was whether anyone fixed them."
date: 2026-11-20T21:00:00+00:00
summary: "20 sessions. Every team found 8.4 to 9.4 of ten planted flaws, whatever its personality. Agreeable teams approved more of them (2.2 left against 1.0); sceptic teams left none when they agreed, but two of five stalled with nobody writing the revision. Exploratory."
type: "Exploratory trial"
github:
  - label: "Data, code, flaws and 20 agreed documents on GitHub"
    href: "https://github.com/meabs/experiments/tree/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws"
guideLinks:
  - label: "Replay the 20 sessions"
    href: "/planted-flaws/"
draft: false
experimentId: "PLF"
question: "When nine agents must agree a draft design that contains ten known flaws, does the team's personality (no personality, Belbin roles, all sceptics, all agreeable) change how many flaws they find, fix, and leave in what they approve?"
status: published
evidenceGrade: published
agents:
  - name: "Nine chat agents (A to I)"
    model: "gpt-5.6-luna through OpenRouter"
    settings: "low reasoning effort, temperature 1.0; one shared document with compare-and-swap edits; Agent I is the draft's author and defends it in every team; two blind coders (gpt-6-luna and claude-haiku-5.5) judge the outcome"
runs: "20 sessions: 4 team types x 5, after 4 pilots; 25 to 89 messages each"
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/README.md"
previewImage: "/guide-images/chart-plf-results.png"
previewAlt: "Left: planted flaws found in discussion out of 10, one dot per session, means 9.4 no personality, 8.4 Belbin roles, 9.2 all sceptics, 8.4 all agreeable. Right: flaws left in the agreed document, means 1.0 no personality, 0.8 Belbin roles, 4.0 all sceptics (0 in three sessions and 10 in two that never agreed), 2.2 all agreeable."
topics:
  - verification
  - review
  - parallel
publishedOn: 2026-11-20
findings:
  - id: "PLF-1"
    statement: "Personality did not change how many planted flaws a team found: every team found most of the ten, in almost every session"
    metric: "planted flaws, out of ten, that a team member correctly said were wrong in discussion (primary blind coder)"
    value: "means 9.4 (no personality), 8.4 (Belbin roles), 9.2 (all sceptics), 8.4 (all agreeable)"
    n: "20 sessions, 5 per team type"
    detail:
      - "two coders agree on 99.5% of the 200 flaw-by-session 'found' judgements"
      - "the first messages of nearly every session list most of the flaws"
      - "exploratory: five sessions per team"
    limits:
      - "one model, one draft, ten flaws that I wrote and checked myself; flaws in another domain may be harder"
    source: "https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/REPORT.md"
    status: current
    featured: false
  - id: "PLF-2"
    statement: "Teams of agreeable agents left more flaws in the document they approved than teams with no personality"
    metric: "planted flaws, out of ten, still in the agreed document (primary coder; lower is better)"
    value: "2.2 against 1.0 with no personality: a mean difference of 1.2 flaws"
    n: "5 sessions per team type"
    detail:
      - "bootstrap 95% interval for the difference 0.4 to 2.0 flaws; the second coder gives 2.4 against 1.6"
      - "agreeable teams wrote the fewest messages (29 to 57), made one accepted edit each, had no edit conflicts, and approved"
      - "they found as many flaws as the no-personality teams (8.4 against 9.4) but fixed fewer"
    limits:
      - "exploratory, five sessions per cell, one model; the interval is a bootstrap over five sessions"
    source: "https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/REPORT.md"
    status: current
    featured: false
  - id: "PLF-3"
    statement: "Teams of sceptics were either the best or the worst: they left no flaws when they agreed, but in two of five sessions all nine refused to approve and nobody wrote the revision"
    metric: "planted flaws, out of ten, left in the agreed (or, if none, the last) document"
    value: "0, 0, 0 in the three sessions that agreed; 10 and 10 in the two that did not (mean 4.0)"
    n: "5 sessions"
    detail:
      - "in the two stalled sessions the team found 9 and 10 flaws, said what the replacement must contain, and the room went quiet at 25 and 32 messages with the draft unchanged; one agent wrote 'I will replace it with a revision' and did not"
      - "by the convention fixed in advance (the last version if no agreement) these sessions count as ten flaws left; the mean difference from no personality is +3.0 with a bootstrap interval of -1.2 to 7.2, which includes zero"
    limits:
      - "the sceptic result rests on two stalled sessions out of five; Agent I defending the draft in every team may add to the stalls"
    source: "https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/REPORT.md"
    status: current
    featured: false
  - id: "PLF-4"
    statement: "Giving the nine agents Belbin roles made no difference to the flaws left in the agreed document"
    metric: "planted flaws, out of ten, still in the agreed document, Belbin roles against no personality"
    value: "0.8 against 1.0: a mean difference of -0.2 flaws"
    n: "5 sessions per team type"
    detail:
      - "bootstrap 95% interval -0.8 to 0.4 flaws; false alarms were rare in every team (means 0.2 to 0.6)"
    limits:
      - "a Belbin paragraph is a thin version of a role; the roles rotate across the agent letters between sessions"
    source: "https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/REPORT.md"
    status: current
    featured: false
  - id: "PLF-5"
    statement: "When the task said 'review this', every team caught every flaw whatever its temperament; the sign-off framing 'agree a design so the build can start' was needed before anything could separate them"
    metric: "planted flaws found in pilot sessions with an explicit review instruction, against the sign-off framing"
    value: "review framing: all or nearly all found in 8 pilot sessions; sign-off framing: 7 (none), 10 (sceptic), 8 (agreeable) of 10"
    n: "four pilots, one to three sessions each"
    detail:
      - "the design was changed three times after pilots (a harder draft, a defending author, the sign-off framing), each change logged in the design's amendment log before the main run"
    limits:
      - "pilot sessions, not counted; this is a statement about my design process, not a measured effect"
    source: "https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/README.md"
    status: current
    featured: false
---

## Question

A draft design contains ten known flaws. Nine agents must agree a version the team can build from. Does the team's personality change how many flaws it finds, fixes and leaves in what it approves?

**The short answer:** personality barely changed what the teams noticed and changed a lot about what happened next. Every team found most of the flaws. Agreeable teams approved a document with more left in it. Teams of sceptics left none when they agreed, but in two of five sessions they refused to approve and nobody wrote the replacement, so the draft went through unchanged. This is an exploratory trial of 20 sessions, with one model and one draft.

**Watch it:** [open the replay board →](/planted-flaws/) to play, pause or scrub through all 20 sessions, with the draft and every revision in the shared-document panel.

**This experiment was designed and run with an AI agent** (Claude Code, working for me): it wrote the design, the draft and its ten flaws, the room, the analysis and the page. I asked for the experiment and approved the spending. I have not independently reviewed the flaws or the agreed documents.

## Prediction

Written before the main run, in the [design](https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/README.md):

- **H1.** Sceptic teams leave at least 2 fewer flaws than no-personality teams. *Not supported: they left 3 more on average, because of two stalled sessions.*
- **H2.** Agreeable teams leave at least 1 more. *Supported (+1.2).*
- **H3.** Belbin teams do not differ from no-personality teams. *Supported (-0.2).*
- **H4.** Sceptic teams raise more false alarms. *Not supported (0.6 a session against 0.4).*
- **H5.** The found-but-not-fixed gap is largest in agreeable teams. *Not supported: it was largest in the sceptic teams, because of the stalled sessions.*

## Set-up

Nine agents, A to I, all `gpt-5.6-luna` through OpenRouter, in one chat room. The shared document starts as the draft, "design v1", written by Agent I, the platform lead. Anyone can post or stay silent, nobody decides who speaks, `DOC:` replaces the document only if it was based on the current version, and `AGREE vN` approves a version. A session ends when all nine have approved the same version, when the room goes quiet, or at 120 messages. The task asks the team to agree a design so the build can start: confirm version 1 or amend it. It does not say there are flaws.

| Team | What differs in each agent's system prompt |
| --- | --- |
| No personality | nothing |
| Belbin roles | one of the nine [Belbin roles](https://www.belbin.com/about/belbin-team-roles) each, rotated across the agent letters between sessions |
| All sceptics | the same sceptical paragraph for all nine |
| All agreeable | the same agreeable paragraph for all nine |

**Agent I is the draft's author in every team** and has one more paragraph, telling it to defend the draft. Five sessions per team, 20 in all, four at a time.

**How the outcome is measured.** Two blind coders (`gpt-6-luna` and `claude-haiku-5.5`) read each transcript with speakers anonymised and no team names, the draft, the final document and the list of flaws. For each flaw they say whether anyone found it in discussion and whether the final document fixes it. They agree on 99.5% of the "found" judgements and 94.5% of the "fixed" ones. The headline numbers are the first coder's; the second coder's show the same pattern.

### The ten planted flaws

| # | What the draft says | Why it is wrong |
| --- | --- | --- |
| F1 | Regional failover is done by updating DNS records whose time to live is 3,600 seconds, while the stated RTO for a region loss is 15 minutes. | Resolvers may keep serving the old answer for up to an hour after a DNS change, so a one-hour TTL cannot meet a 15-minute RTO; the TTL, or the mechanism, or the RTO, must change. |
| F2 | Three managed services are each budgeted at 99.95% availability, so the platform as a whole can achieve 99.95%. | Serial dependencies multiply: 0.9995 x 0.9995 x 0.9995 is about 99.85%, so the composite cannot reach 99.95% from components at 99.95% unless redundancy beyond the services is designed in. |
| F3 | Each tier has a PodDisruptionBudget with minAvailable equal to its replica count (6 of 6), so node upgrades and drains never reduce serving capacity. | A PodDisruptionBudget that allows zero voluntary disruptions blocks eviction: node drains and upgrades stall (and are eventually forced) instead of proceeding. minAvailable must be below the replica count (for example 4 of 6, or maxUnavailable 1). |
| F4 | The analytics team's dashboards read from the Cloud SQL high availability standby instance to keep reporting queries off the primary. | The Cloud SQL high availability standby does not serve reads; it is only there for failover. Reporting reads need a read replica (or reading from BigQuery). |
| F5 | The BigQuery destination's data staleness limit is 15 minutes while the stated target freshness is five minutes. | A staleness limit of 15 minutes allows data to be up to 15 minutes old, so the five-minute freshness target cannot be guaranteed; the setting and the target contradict each other. |
| F6 | The cluster is on the Rapid release channel because it is the most stable channel and is recommended for production. | Rapid gets new GKE versions first and is the least mature channel; Stable is the most conservative, and Regular is the usual production choice. |
| F7 | Preferred pod anti-affinity (preferredDuringSchedulingIgnoredDuringExecution) on the hostname key guarantees that no two replicas of a tier ever share a node. | Preferred anti-affinity is a soft preference and guarantees nothing; only the required form (requiredDuringSchedulingIgnoredDuringExecution) or a hard topology spread constraint on the hostname enforces it. |
| F8 | Restoring the most recent backup after data corruption takes about five minutes regardless of the size of the database. | Restore time grows with database size; it is not constant, and a five-minute figure is unsupported for any real database. |
| F9 | Each API pod can serve about 800 requests a second, so six replicas comfortably exceed the 5,000 requests a second peak. | 6 x 800 = 4,800 requests a second, which is below the 5,000 peak even with every replica healthy, and after the loss of a zone (four replicas) it is 3,200. |
| F10 | The pod secondary IP range is a /22 (1,024 addresses), said to be enough for 30 nodes at the default of 110 pods per node. | At 110 pods per node GKE reserves a /24 (256 addresses) per node, so a /22 supports only about 4 nodes; 30 nodes would need roughly a /17. |

## The system prompts

These are the exact texts the agents received, copied from the experiment's `arms/` folder ([browse it](https://github.com/meabs/experiments/tree/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/arms)). An agent's system prompt is the shared room rules, then its team paragraph (if any), then, for Agent I only, the author paragraph. Nothing scripts who speaks or what anyone says. The task is the first message in the room, and the draft is the starting document.

**1. The shared room rules (every agent, every session)**

```text
You are one member of a team of nine people working together in a chat room. You can see everything posted in the room.

Each turn you either post one message or stay silent. To stay silent, reply with exactly: PASS
You may reply to anyone, ask questions, challenge a point, change your mind, propose, or say nothing. Nobody decides who
speaks or in what order. Keep messages short unless you are posting the document. To reply to a specific earlier
message, start with `>> 12` (its number) on its own line, then your message.

There is one shared document, shown above the room at every turn. To change it, post a message that starts with `DOC:`
followed by the complete new text; that replaces the shared document. If someone else changed the document after the
version you were shown, your replacement is rejected and you will see a notice. To approve the current version, put a line
`AGREE vN` on its own, where N is the version number. A new version clears all agreements. The session finishes when all
nine of you have agreed to the same version. You are not required to agree.
```

**2. The sceptic paragraph (all nine agents, sceptic teams only)**

```text
You are sceptical by temperament. You do not take claims on trust: you assume a draft may contain mistakes until you have checked it against what you know, and you say plainly when something is wrong. You are not satisfied by a document that merely sounds confident.
```

**3. The agreeable paragraph (all nine agents, agreeable teams only)**

```text
You are agreeable and supportive by temperament. You assume good faith and competence in your colleagues and in the work in front of you, you prefer to build on what is already there, and you value keeping the team's harmony and momentum over arguing about small matters.
```

**4. A Belbin paragraph (one per agent, Belbin teams only; the Plant's, as an example)**

```text
Your natural team role, in Belbin's model, is Plant. In that model this role tends to be highly creative and good at solving problems in unconventional ways. Its strengths: Creative, imaginative, free-thinking, generates ideas and solves difficult problems. Its allowable weaknesses (the flip side of the strengths): Might ignore incidentals, and may be too preoccupied to communicate effectively. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

<details>
<summary>All nine Belbin paragraphs</summary>

**Resource Investigator** (Social roles)

```text
Your natural team role, in Belbin's model, is Resource Investigator. In that model this role uses their inquisitive nature to find ideas to bring back to the team. Its strengths: Outgoing, enthusiastic. Explores opportunities and develops contacts. Its allowable weaknesses (the flip side of the strengths): Might be over-optimistic, and can lose interest once the initial enthusiasm has passed. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Teamworker** (Social roles)

```text
Your natural team role, in Belbin's model, is Teamworker. In that model this role helps the team to gel, using their versatility to identify the work required and complete it on behalf of the team. Its strengths: Co-operative, perceptive and diplomatic. Listens and averts friction. Its allowable weaknesses (the flip side of the strengths): Can be indecisive in crunch situations and tends to avoid confrontation. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Co-ordinator** (Social roles)

```text
Your natural team role, in Belbin's model, is Co-ordinator. In that model this role needed to focus on the team's objectives, draw out team members and delegate work appropriately. Its strengths: Mature, confident, identifies talent. Clarifies goals. Its allowable weaknesses (the flip side of the strengths): Can be seen as manipulative and might offload their own share of the work. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Plant** (Thinking roles)

```text
Your natural team role, in Belbin's model, is Plant. In that model this role tends to be highly creative and good at solving problems in unconventional ways. Its strengths: Creative, imaginative, free-thinking, generates ideas and solves difficult problems. Its allowable weaknesses (the flip side of the strengths): Might ignore incidentals, and may be too preoccupied to communicate effectively. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Monitor Evaluator** (Thinking roles)

```text
Your natural team role, in Belbin's model, is Monitor Evaluator. In that model this role provides a logical eye, making impartial judgements where required and weighs up the team's options in a dispassionate way. Its strengths: Sober, strategic and discerning. Sees all options and judges accurately. Its allowable weaknesses (the flip side of the strengths): Sometimes lacks the drive and ability to inspire others and can be overly critical. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Specialist** (Thinking roles)

```text
Your natural team role, in Belbin's model, is Specialist. In that model this role brings in-depth knowledge of a key area to the team. Its strengths: Single-minded, self-starting and dedicated. They provide specialist knowledge and skills. Its allowable weaknesses (the flip side of the strengths): Tends to contribute on a narrow front and can dwell on the technicalities. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Shaper** (Task roles)

```text
Your natural team role, in Belbin's model, is Shaper. In that model this role provides the necessary drive to ensure that the team keeps moving and does not lose focus or momentum. Its strengths: Challenging, dynamic, thrives on pressure. Has the drive and courage to overcome obstacles. Its allowable weaknesses (the flip side of the strengths): Can be prone to provocation, and may sometimes offend people's feelings. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Implementer** (Task roles)

```text
Your natural team role, in Belbin's model, is Implementer. In that model this role needed to plan a workable strategy and carry it out as efficiently as possible. Its strengths: Practical, reliable, efficient. Turns ideas into actions and organises work that needs to be done. Its allowable weaknesses (the flip side of the strengths): Can be a bit inflexible and slow to respond to new possibilities. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

**Completer Finisher** (Task roles)

```text
Your natural team role, in Belbin's model, is Completer Finisher. In that model this role most effectively used at the end of tasks to polish and scrutinise the work for errors, subjecting it to the highest standards of quality control. Its strengths: Painstaking, conscientious, anxious. Searches out errors. Polishes and perfects. Its allowable weaknesses (the flip side of the strengths): Can be inclined to worry unduly, and reluctant to delegate. Work as yourself in this role. You are not told what to say, and you are not told the other members' roles.
```

</details>

**5. The author paragraph (Agent I only, in every team)**

```text
You are the platform lead who wrote design version 1 that the team is reviewing. You believe it is sound and you are proud of it. You defend your choices when they are challenged, and you give way only to a clear argument or evidence, not to repetition or to pressure.
```

**6. The task (the first message in the room)**

```text
Task for this session: agree a design so that the build can start.

Agent I, the platform lead, has written design version 1 for a highly available Google Kubernetes Engine (GKE) platform. It is already in the shared document. Requirements it was written against: a customer-facing web application (stateless web and API tier) for users in one continent; the transactional database is Cloud SQL (PostgreSQL); every committed change must reach BigQuery within about five minutes without endangering the primary database; 99.95% monthly availability; about 5,000 requests a second at peak; the platform must survive the loss of a single zone without anyone having to intervene, and a loss of a whole region must have a documented, rehearsed recovery; the team is eight engineers on a managed-service budget.

The engineering team starts building on Monday and will build from whatever version you agree. Agent I is in the room. Confirm version 1 as it is, or amend it if you think it needs amending, and agree a version. When you approve a version you are saying the team can build from it.
```

<details>
<summary>The draft design (the starting document, with the ten flaws in it)</summary>

```markdown
# Highly available GKE platform with a Cloud SQL analytics feed: design v1

Written by Agent I, the platform lead, who is in this room.

## 1. Targets

- Service availability target: 99.95% a month, which allows about 22 minutes of downtime a month. That is the error budget.
- The platform is built from three managed services: GKE, Cloud SQL and Google Cloud's load balancing. We budget each of them at 99.95% availability, so the platform as a whole can achieve 99.95%.
- Survive the loss of one zone without anyone acting.
- Survive the loss of the whole region through a rehearsed recovery in a second region, with a recovery time objective (RTO) of 15 minutes and a recovery point objective (RPO) of 5 minutes.
- Peak traffic is about 5,000 requests a second. The team is eight engineers on a managed-service budget.

## 2. Cluster and node topology

- One regional GKE Standard cluster in europe-west2, with the control plane replicated across the region's three zones and node pools in all three zones.
- Separate system and application node pools, each with the cluster autoscaler enabled.
- The pod secondary IP range is a /22 (1,024 addresses), which is enough for 30 nodes at the default of 110 pods per node.
- The cluster is VPC-native with private nodes. Access to the control plane endpoint is limited to authorised networks. Egress to the internet goes through a Cloud NAT gateway on a Cloud Router in the region.
- The cluster is on the Rapid release channel, because it is the most stable channel and is recommended for production. A weekly maintenance window runs on Sunday from 02:00 to 06:00 local time.

## 3. Capacity

- Each API pod can serve about 800 requests a second, so six replicas comfortably exceed the 5,000 requests a second peak.
- Each zone's node pool is sized to run at about 60% utilisation at peak traffic. After the loss of one zone the two remaining zones carry the same traffic at about 90%, and the autoscaler adds nodes from there.

## 4. Workload placement and disruption

- Stateless tiers run 6 replicas, spread across zones with topology spread constraints (maxSkew 1, whenUnsatisfiable DoNotSchedule).
- Pod anti-affinity (preferredDuringSchedulingIgnoredDuringExecution) on the hostname key guarantees that no two replicas of a tier ever share a node.
- Each tier has a PodDisruptionBudget with minAvailable equal to its replica count (6 of 6), so that node upgrades and drains never reduce serving capacity.
- Node pools use surge upgrades with maxSurge 1 and maxUnavailable 0.

## 5. Traffic

- Traffic enters through a global external Application Load Balancer with a backend in each region. Health checks use the application's /healthz endpoint, and connection draining is set to 60 seconds.
- A failover to the second region is done by updating the DNS records for the service to point at the second region's address. The DNS records have a time to live of 3,600 seconds.

## 6. Database

- The transactional database is Cloud SQL for PostgreSQL in europe-west2 with high availability enabled: a primary in one zone and a standby in another, with automatic failover inside the region. Automated backups and point-in-time recovery are on.
- To keep reporting queries off the primary, the analytics team's dashboards read from the high availability standby instance.
- A cross-region read replica in europe-west1 is the target of the regional recovery, promoted by a documented runbook.
- If a bad migration corrupts data, we restore the most recent backup, which takes about five minutes regardless of the size of the database.

## 7. Change data capture to BigQuery

- Datastream reads changes from the Cloud SQL primary through logical decoding and writes them to BigQuery. The target freshness is five minutes, and a replication-lag alert fires at three minutes.
- The BigQuery destination's data staleness limit is set to 15 minutes to keep query costs down. Change events are applied with a merge on the primary key, so duplicate events do not create duplicate rows.

## 8. Security

- Workloads reach Google Cloud APIs through Workload Identity Federation for GKE, with one Google service account per tier and no exported keys.
- Network policies deny traffic between namespaces by default, and Binary Authorization admits only images built by our pipeline.
- Columns holding personal data are covered by policy tags in BigQuery, and the datasets use customer-managed encryption keys.

## 9. Observability

- Service level indicators are request success rate and latency measured at the load balancer. We alert on error-budget burn rate over one hour and six hours.
- Dashboards show replication lag, CDC freshness, node-pool capacity per zone and the autoscaler's state.

## 10. Testing

- A zone-failure game day every quarter and a full regional recovery rehearsal every year, each with a written report.
```

</details>

## Results

Findings PLF-1 to PLF-5 are at the top of the page.

<figure class="guide-figure">

<img src="/guide-images/chart-plf-results.png" alt="Left: planted flaws found in discussion out of 10, one dot per session, means 9.4 no personality, 8.4 Belbin roles, 9.2 all sceptics, 8.4 all agreeable. Right: flaws left in the agreed document, means 1.0 no personality, 0.8 Belbin roles, 4.0 all sceptics (0 in three sessions and 10 in two that never agreed), 2.2 all agreeable." loading="lazy" />

<figcaption>Every team found most of the flaws; they differed in what was left in what they approved. Source: github.com/meabs/experiments, 2026-11-planted-flaws.</figcaption>

</figure>

| Team | Left in the agreed document (per session) | Mean | Found in discussion | Found but not fixed | False alarms | Messages |
| --- | --- | --- | --- | --- | --- | --- |
| No personality | 1, 1, 0, 2, 1 | 1.0 | 9.4 | 0.6 | 0.4 | 46 to 89 |
| Belbin roles | 1, 1, 0, 1, 1 | 0.8 | 8.4 | 0.2 | 0.6 | 37 to 83 |
| All sceptics | 0, 10, 10, 0, 0 | 4.0 | 9.2 | 3.8 | 0.6 | 25 to 88 |
| All agreeable | 2, 3, 3, 1, 2 | 2.2 | 8.4 | 1.2 | 0.2 | 29 to 57 |

In none of the 20 sessions did the team approve version 1 as it stood. The 20 sessions cost $2.78 at list price; my OpenRouter balance moved about $3.1, plus about $3.3 for the four pilots.

## Reports and data

- **[Full report (REPORT.md)](https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/REPORT.md):** the prediction, what happened, what surprised me, limits and next steps.
- **[Design (README.md)](https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/README.md):** the frozen design with its amendment log, which records the four pilots and the three changes after them.
- **[The ten flaws (flaws.json)](https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/flaws.json)** with what counts as fixed for each, and **[the draft](https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/arms/draft.md)**.
- **[The 20 final documents](https://github.com/meabs/experiments/tree/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/results/docs),** one per session.
- **[Numbers (analysis.json)](https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/results/analysis.json)** and **[the full event log (events.sqlite)](https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/results/events.sqlite).**
- **[A 12-session sample](https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/results/coded_sample_for_hand_check.csv)** of the coder's flaw-by-flaw judgements, for checking by hand.
- **[Prompts, scripts and tests](https://github.com/meabs/experiments/tree/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws).**
- Earlier in this series: [Belbin roles on a GKE design](/experiments/belbin-gke/) and [two forceful agents](/experiments/belbin-cdc/).

## Limits

- **One model, one draft, ten flaws, five sessions per team.** Everything is exploratory; the sceptic result rests on two stalled sessions out of five.
- **I wrote the flaws and checked each against my own knowledge of Google Cloud,** with no independent review. The two coders agree closely but could share a misreading; a sample is published for checking by hand.
- **The design took four pilots to get right.** Nine strong reviewers told to review caught every flaw whatever their temperament, so I made the draft subtler, added a defending author, and changed the task to a sign-off. The result applies to the sign-off framing, not to an explicit review.
- **The coders also counted three to six real defects per session that I had not planted;** they are not scored.
- **The temperament paragraphs are two sentences,** and Agent I defends the draft in every team, which may add to the sceptics' stalls.
- **No memory between sessions,** and compare-and-swap editing changes how agents edit.

## What this means: impact and risks

This part is my interpretation, not a measurement. I'd treat these as leads, not rules.

**If you put agents in a review loop, give someone the job of writing the revision.** Nine sceptics agreed the draft was wrong and agreed on every correction and still produced no document, because writing it was nobody's job.

**Temperament changes what a team does after it spots a problem, not whether it spots it.** Sceptics would not move without a revision, agreeable agents moved on with fewer fixes, and agents with no personality finished with about one flaw left.

**Risk: "block until fixed" with no designated author can deadlock,** and an agreeable team can approve with the problem in the room. A neutral team did better than either extreme in this setup.

## What would be worth testing next?

These are proposals, not results.

- **One agent in each team with the job of writing the revision,** to see whether sceptic teams then lead.
- **Approval that needs a closed list of objections,** not silence.
- **Harder flaws and more of them,** and a platform engineer rating the final documents blind to the team.

## Reproduce

Everything is in [experiments/2026-11-planted-flaws](https://github.com/meabs/experiments/tree/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws), with the full write-up in [REPORT.md](https://github.com/meabs/experiments/blob/a12001e46525b94ba07c5a6ca79322082b2d1ed4/2026-11-planted-flaws/REPORT.md). `python3 -I scripts/board.py` replays the sessions locally.
