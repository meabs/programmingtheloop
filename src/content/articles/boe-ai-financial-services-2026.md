---
title: "Reading the Bank of England's 2026 AI Survey as an Engineer"
description: "The Bank of England and FCA's fourth survey of AI in UK financial services, read by someone who builds small agent experiments for fun."
date: 2026-10-26T18:30:00Z
summary: "80% of respondents to the full survey have AI agents deployed, but mostly in decision support. The bit I'd worry about is what happens after deployment."
draft: false
---

*I've got mild dyslexia, so I use AI tooling to help with my writing, but the thoughts are all mine*

Quick one before I start, this is my own personal view, not my employer's.

The Bank of England and the FCA published their fourth survey of AI in UK financial services today, and to be honest the number that caught my eye was the agents one.

80% of respondents to the full survey said they've got AI agents deployed.

My first reaction was a bit of a raised eyebrow. I spend a fair bit of my spare time running small coding-agent experiments, and "deployed" can cover a lot of ground. So I thought I'd actually read the thing rather than just the headline.

The report is here if you fancy it:

https://www.bankofengland.co.uk/report/2026/artificial-intelligence-in-uk-financial-services-2026

Some context first. There were 196 respondents, 101 larger firms and 95 smaller ones, and 105 completed the full survey (section 1.2). Smaller firms could fill in a shorter version this time, and the report is quite careful to say comparisons with 2024 should be read with caution because the questions and the population changed. It also says the findings are evidence from participating firms, not a complete picture of the sector. I liked that.

Adoption went from 75% in 2024 to 86% (section 2.1). The mix was more interesting though, GenAI made up 56% of all reported AI systems, where in 2024 foundation models were 17% of use cases (section 2.3). The report says those two measures aren't directly comparable, fair enough, but the direction's pretty clear.

Enterprise productivity (coding assistants, summarisation, that sort of thing) was the most common current use, at 86% of respondents (section 2.4). So a lot of this is everyday tooling. Same as the rest of us really.

## The agents bit

Back to that 80%. The autonomy breakdown in section 3.2 tells a much calmer story:

- 80% have agents deployed for decision support (the agent recommends, a human decides and executes)
- 46% have agents with constrained execution, inside predefined limits and rules
- 22% have conditional autonomy, where some actions need human approval
- 2% have broad autonomy

These categories aren't mutually exclusive. A firm could have agents doing several of these things, so the percentages don't add up to 100%.

And even including plans for the next 12 months, no more than 9% expected agents to approve or decline customer outcomes, execute trades, initiate or block payments, or change limits and controls.

Honestly, that made me feel a bit better.

The thing I keep running into in my own small tests is how confident agents are. I've watched them tell me something passed when it plainly hadn't, and the tone is exactly the same whether they're right or wrong. That's fine when I'm reading the output on a Sunday afternoon with a brew. Less fine when nobody's reading it.

One line did make me stop though. For creating or modifying records in core systems, it's 8% today and 25% once planned deployment is included (section 3.2). That's a big jump. There's a meaningful difference between an agent suggesting an update and one actually writing to a core system. Even with approval steps and predefined limits, you've now got to think about permissions, what happens when it gets something wrong, and how you undo it.

## Who's actually running it

Third-party implementations were 39% of reported AI systems, up from 33% in 2024 and 17% in 2022, and 53% of high-materiality systems, up from 35% (section 4.1).

Then the concentration. The top three cloud/compute providers accounted for 79% of reported relationships, and 98% of respondents used one of them. The top three model API/hosting providers accounted for 54% (section 4.2).

Having been an AWS solutions architect, none of the cloud side shocks me. The exit plan line was more interesting. Of 169 cloud and compute relationships, 37% were judged both high criticality and hard to substitute, and only 35% of that group had tested exit plans. I've written exit plans myself that I'm fairly sure nobody ever ran, so I'm not throwing stones.

The model side felt more relevant to me as someone who builds things. 48% of respondents always regression test high-materiality updates to vendor-provided models or their guardrails, a further 25% usually do, and 25% always or usually let those updates propagate into production automatically (section 4.3). Only 48 firms answered that question and the report says to treat it with caution, which I'd agree with. But it lines up with something I've learnt the hard way in hobby land. A model update can change behaviour underneath you with no code change on your side, and if you haven't got an eval set you can rerun, you're basically finding out from your users.

Section 7.3 has a similar flavour. 77% reported relying on deep knowledge of their internally developed high-materiality systems, compared with 24% for third-party ones, where 81% relied on vendor assurance and contractual arrangements instead. Contracts are useful, they just don't tell you what the model will do next Tuesday.

The gap I think matters most for engineers is in section 7.4. Pre-deployment review, human approval and vendor due diligence were each reported by more than 90% of respondents. Ongoing monitoring, leakage testing and periodic review were each around half. On metrics, user feedback was the most routinely monitored at 85%, then accuracy/precision or recall at 72%, model or data drift at 52%, and customer impact at 39%.

User feedback being top is a bit telling. It's useful, but I wouldn't want customers to be the first people discovering that a model's behaviour has changed.

The risk ratings fit the same pattern. Data protection and security, third-party and supply chain, and GenAI-specific risks (hallucinations, prompt injection, data leakage) were rated highest, and "model behaviour and reliability" was one of the two areas least likely to have mitigation controls, at 69% (section 5.2). On cyber, 88% expect frontier AI cyber capabilities to have a moderate or high impact on their risk profile over the next two years, with 44% pointing at faster exploitation of existing software vulnerabilities (section 8).

And the top non-regulatory constraints were integrating AI into existing business processes (23%) and legacy systems (22%), a change from 2024 when it was safety, skills and explainability (section 6.2). In my experience the model is rarely what holds you up, it's wiring it into everything else.

So what would I take from it as an engineer? Nothing earth-shattering, mostly stuff I'm trying to get better at myself:

- treat model and vendor updates like dependency upgrades, pin versions where you can, keep an eval set and a rollback
- spend more effort on the after-deployment side, monitoring, drift and leakage tests, not just the sign-off
- keep agents on the suggestion side until you can actually measure them, and be extra careful with anything that writes
- keep the model integration simple, avoid unnecessary provider lock-in, and make sure you can rerun your evaluations when changing models. An abstraction layer helps, but it doesn't make models interchangeable

I should be clear about limits. This is a survey of what firms say they do, not a measurement of what they do. I also couldn't read the charts, only the text and the one table, so there's detail I haven't seen. And my own experiments are small hobby tests, not a research programme.

Anyway, I read all eleven sections of a central bank survey on a Monday night out of choice, so I'm probably not the best judge of what counts as a fun evening.
