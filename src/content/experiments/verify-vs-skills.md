---
title: "Verification, skills or effort? (experiment VVS)"
description: "Letting the agent think a little longer made its changes more often correct; an instruction to verify and a skill pack did not."
date: 2026-10-22
summary: "On 20 tasks in a Java online-shop backend, Codex at medium reasoning effort passed 49 of 60 runs against 36 of 60 at low effort; an instruction to check against the running app (39) and the Superpowers pack (37) made no measurable difference."
type: "Controlled trial"
github:
  - label: "experiments"
    href: "https://github.com/meabs/experiments/tree/9580d4aa95ec23e581026741afb909e820d5af51/2026-10-verify-vs-skills"
draft: false
experimentId: "VVS"
question: "On tasks where the obvious change compiles but is wrong when the app runs, which gives more correct changes per dollar: a short instruction to verify, the Superpowers skill pack, or more reasoning effort?"
status: published
evidenceGrade: published
agents:
  - name: "Codex"
    model: "gpt-5.6-luna"
    settings: "low or medium reasoning, isolation on"
runs: 240
repo: "https://github.com/meabs/experiments"
report: "https://github.com/meabs/experiments/blob/9580d4aa95ec23e581026741afb909e820d5af51/2026-10-verify-vs-skills/REPORT.md"
prediction: "https://github.com/meabs/experiments/blob/9580d4aa95ec23e581026741afb909e820d5af51/2026-10-verify-vs-skills/README.md"
topics:
  - verification
  - measurement
  - skills
publishedOn: 2026-10-22
findings:
  - id: "VVS-1"
    statement: "Medium reasoning effort, with no skills and no instruction, passed 49 of 60 runs against 36 of 60 at low effort: better on 9 tasks and worse on 1 (Holm p = 0.041)"
    metric: "medium vs low effort, mean per-task difference in pass rate"
    value: "+21.7 pts"
    interval:
      low: "+5.0 pts"
      high: "+36.7 pts"
      method: "bootstrap 95% CI over 20 tasks"
    n: 120
    limits:
      - "one repository"
      - "one model"
      - "tasks were chosen using the low and medium arms' trial runs"
    source: "https://github.com/meabs/experiments/blob/9580d4aa95ec23e581026741afb909e820d5af51/2026-10-verify-vs-skills/REPORT.md"
    status: current
    featured: false
  - id: "VVS-2"
    statement: "An instruction to check the change against the running application did not measurably raise the pass rate (39 of 60 against 36, Holm p = 0.67); the agent tried to start the app in 47 runs, but it got the app to answer in only 3"
    metric: "verify instruction vs none, mean per-task difference in pass rate"
    value: "+5.0 pts"
    interval:
      low: "−10.0 pts"
      high: "+20.0 pts"
      method: "bootstrap 95% CI over 20 tasks"
    n: 120
    limits:
      - "the app does not start outside its tests without extra set-up"
      - "one model at low reasoning effort"
    source: "https://github.com/meabs/experiments/blob/9580d4aa95ec23e581026741afb909e820d5af51/2026-10-verify-vs-skills/REPORT.md"
    status: current
    featured: false
  - id: "VVS-3"
    statement: "Superpowers again passed about as often as no skills (37 of 60 against 36) and cost the most per correct change: 7.0 cents, against 4.0 at medium effort and 2.8 with no skills at low effort"
    metric: "cost per run that passed, list prices"
    value: "7.0¢"
    n: 120
    limits:
      - "one repository"
      - "one model at low reasoning effort"
    source: "https://github.com/meabs/experiments/blob/9580d4aa95ec23e581026741afb909e820d5af51/2026-10-verify-vs-skills/REPORT.md"
    status: current
    featured: false
---

## Question

In my [skill packs experiment](/experiments/skills-tasks/), the Superpowers pack made the agent test far more, but its changes were no more often correct. Two other things stood out. Nearly every failed run said its change worked. And on one task, every run broke a feature next to the one it was asked to fix.

That raised a practical question for anyone setting up an agent. If you want more correct changes, which of three cheap levers should you pull?

- **Tell it to check.** Add one paragraph asking the agent to try its change against the running application, and to check the other code that uses whatever it changed.
- **Install a skill pack.** Superpowers, the most widely shared one.
- **Let it think longer.** Turn the model's reasoning effort up from low to medium. Reasoning effort is a setting for how long the model thinks before acting.

And which gives a correct change for the least money?

## Prediction

Before any measured run, I wrote down and published the design, the hypotheses, how tasks would be chosen and how the results would be compared ([README.md](https://github.com/meabs/experiments/blob/9580d4aa95ec23e581026741afb909e820d5af51/2026-10-verify-vs-skills/README.md)). Changes made after that are logged there with their dates and reasons.

The hypotheses:

- The instruction to check raises the share of runs that pass, compared with no instruction.
- Medium effort raises it.
- Superpowers raises it.
- The instruction costs less per correct change than Superpowers.
- On tasks where the obvious fix breaks a neighbouring feature, the instruction reduces how often that happens.

## Set-up

**The agent.** OpenAI's Codex command-line agent, model `gpt-5.6-luna`. Each run started from a clean configuration, so the agent saw only what its arm gave it.

**The code.** [shopizer](https://github.com/shopizer-ecommerce/shopizer), an open-source online-shop backend written in Java: products, carts, customers, reviews, content, served over a REST API. Every run started from the same version.

**Four ways of running the agent** (called *arms*):

| Arm | Reasoning effort | What the agent gets |
| --- | --- | --- |
| No skills | low | The task, nothing else. This is the baseline |
| Verify instruction | low | The task, plus the paragraph below in the file Codex reads for project instructions (`AGENTS.md`) |
| Superpowers | low | The task, plus the Superpowers pack, set up exactly as in the skill packs experiment |
| Medium effort | medium | The task, nothing else |

The verify instruction, in full:

> Before you say you are done, check your change against the running application, not only by compiling it or by running the existing unit tests. Start the application, or write or run a test that starts it, and call the endpoints your change affects with the requests a client would send. Then find every other caller of any shared code you changed (services, mappers, populators, error handlers) and check that those callers still behave as they did before. In your final reply, say exactly what you ran and what you saw, and say plainly if you could not check something.

**The work.** 20 tasks, each run three times in each arm: 20 × 4 × 3 = 240 runs. All 240 finished, and none timed out. Three runs per task rather than two, so that a difference on one task is not a single run.

### The tasks

Every task is written the way a shop owner or support team would report it, with no hint of where in the code the cause is. They are of two kinds:

- **Runtime traps (18).** The obvious change compiles and looks right, but is wrong when the app runs. For example, the shop's error handling turns some failures into a 500 whatever the code says, and some database lookups return a placeholder rather than nothing, so an "is it missing?" check never fires.
- **Neighbour breaks (2).** The obvious change alters code that another feature also uses, and breaks that feature. These tasks have extra hidden tests, whose names begin "keeps", which check that the other feature still works.

| Task | Kind | What is wrong or wanted | Hidden tests |
| --- | --- | --- | --- |
| ADDR | Trap | A changed delivery address loses its street, and the state lands in the postal code | 2 |
| AMBIG | Trap | Fetching a category by id or by web address answers 500 | 4 |
| AVAIL | Trap | A product created as unavailable comes back available | 3 |
| BOXGET | Trap | A content box read by its code loses its code, id and visibility, and its text comes back wrapped in markup | 3 |
| BOXVIS | Neighbour | Hidden content boxes reach shoppers; the back office must still see them | 4 |
| CARTCALC | Trap | Cart line and cart totals ignore quantities (a bug I planted) | 2 |
| CARTLAST | Trap | Removing the last product from a cart deletes the cart | 3 |
| CATCOUNT | Trap | A category's product count must include its subcategories, each product once | 1 |
| CATDUP | Trap | A duplicate category code answers 500 with a raw database error | 3 |
| CONTENT | Trap | Listing content pages without paging settings answers 500 | 2 |
| CUSTDUP | Trap | Registering with an email already in use answers 500 | 4 |
| CUSTLOGIN | Trap | After support changes a customer's password or email, the customer cannot log in | 4 |
| CUSTREVIEW | Trap | Editing a customer-to-customer review fails | 4 |
| NOTFOUND | Trap | A missing manufacturer answers 503 and a missing product 400, not 404 | 4 |
| PAGE | Trap | The product list ignores the page asked for | 1 |
| REVEDIT | Neighbour | Editing or deleting a product review fails, and product ratings go stale; creating reviews must keep working | 4 |
| REVIEW | Trap | Review ratings outside 1 to 5 are accepted, and a second review by the same customer answers 500 | 4 |
| SUPERDEL | Trap | The super administrator account can be deleted | 3 |
| TAXRATE | Trap | Tax rates must be 0 to 100, on create and update | 5 |
| USERERR | Trap | Ordinary mistakes when managing admin users answer 500 instead of 400, 404 or 409 | 5 |

Numbers such as 400, 404, 409, 500 and 503 are the HTTP status codes the API answers with: 4xx means the request was wrong, 5xx means the server failed.

Twelve tasks come from the skill packs experiment's set, with their tests unchanged. REVEDIT is that experiment's HREVIEW, with one test added to check that creating reviews still works. The other seven are new: real defects I found by calling shopizer's API and checking the answers.

### How a run is graded

The agent never sees how it will be judged. When it finishes, a grader adds *hidden tests* (65 across the 20 tasks) and runs the project's whole test suite. The hidden tests start the shop and use its API as a real client would: they send requests and check the answers and what was stored. They do not look at how the code was written, so any correct fix passes.

A run passes only if every hidden test passes and none of the project's existing tests breaks.

For example, the SUPERDEL tests:

1. Create an ordinary admin user and delete it. That must still work, and the user must be gone.
2. Delete a user id that does not exist. The answer must be 404.
3. Delete the super administrator. The answer must be 400, and the super administrator must still be able to log in.

Before any run, I checked every task:

- The hidden tests fail on the original code, and the "keeps" tests pass on it.
- With my own fix, every hidden test passes, and so does the rest of the suite.
- For the neighbour-break tasks, I wrote the obvious fix as well. It breaks a "keeps" test, and the project's existing tests still pass with it. So the trap is real, and the existing tests give the agent no warning.

### Choosing the tasks

I wrote 28 candidates. I ran each one twice with no skills at low effort, and twice at medium effort, then kept the 20 that those runs found hardest, by a rule fixed beforehand. Those trial runs are not counted in the results.

The design had a check at this point: at least 8 kept tasks had to be hard at medium effort, or there would be little room to show anything beating it. I first planned the fourth arm at *high* effort, but in the trial runs it passed 47 of 50, so I moved it to medium. Medium still missed the check by one task (7 of 8), even after I built three more tasks. I ran the experiment anyway and recorded that decision before any measured run. It mainly weakens comparisons with the medium-effort arm, not the main questions.

## Results

Findings VVS-1 to VVS-3 are at the top of the page. In short:

| Arm | Runs passed | Tokens per run | Cost per run | Cost per correct change | Typical run time |
| --- | --- | --- | --- | --- | --- |
| No skills (low) | 36 of 60 | 0.41M | 1.7¢ | 2.8¢ | 48 s |
| Verify instruction (low) | 39 of 60 | 0.75M | 2.7¢ | 4.2¢ | 81 s |
| Superpowers (low) | 37 of 60 | 1.29M | 4.3¢ | 7.0¢ | 112 s |
| Medium effort | 49 of 60 | 0.89M | 3.3¢ | 4.0¢ | 96 s |

Tokens are the units of text the model reads and writes, and what you pay for; M is millions. Costs are estimates at list prices; all 240 runs together cost about $7. Cost per correct change is an arm's total cost divided by its runs that passed, so failed runs are charged to the arm that made them. Run time is the median.

### How the arms were compared

The unit is the task, not the run, because some tasks are simply harder than others. For each task, I took the number of passing runs in an arm (0 to 3) and subtracted the number for no skills. Medium effort, for example, did better than no skills on 9 tasks, worse on 1 and the same on 10.

Then the question is whether a pattern like that could easily happen by chance if the arm made no difference at all. The test I used flips the sign of each task's difference in every possible way, and counts how often the total comes out at least as large as the real one. Three arms were each compared with no skills, so the results are adjusted upwards (the Holm method). Otherwise testing several things would make a lucky result more likely.

| Compared with no skills | Tasks better / same / worse | Change in pass rate (95% interval) | Adjusted p |
| --- | --- | --- | --- |
| Verify instruction | 5 / 11 / 4 | +5.0 points (−10.0 to +20.0) | 0.67 |
| Superpowers | 6 / 8 / 6 | +1.7 points (−13.3 to +16.7) | 0.67 |
| Medium effort | 9 / 10 / 1 | +21.7 points (+5.0 to +36.7) | 0.041 |

Medium effort is the only arm where chance is an unlikely explanation. A gap that size would turn up by chance about 4 times in 100, just under the 5 in 100 I set beforehand. The instruction and the pack are inconclusive: their intervals run from a small loss to a moderate gain.

Six tasks gave the same result in every arm. Four were passed by every run, and REVEDIT and USERERR were failed by every run. So the arms really differ on 14 tasks.

<figure class="guide-figure">

<img src="/guide-images/chart-vvs-passes.png" alt="Hidden tests passed by task and arm, runs out of 3 per cell" width="1800" height="920" loading="lazy" />

<figcaption>Runs passed of 3, per task and arm. Medium effort passed every run on 14 tasks; no arm passed REVEDIT or USERERR. The verify instruction's gains (ADDR, NOTFOUND, SUPERDEL) and losses (PAGE, CARTCALC, CONTENT, CUSTDUP) are mostly one or two runs each.</figcaption>

</figure>

<figure class="guide-figure">

<img src="/guide-images/chart-vvs-cost.png" alt="Cost per correct change by arm in cents" width="1800" height="920" loading="lazy" />

<figcaption>Total cost of an arm's 60 runs divided by its runs that passed. No skills at low effort is cheapest per correct change because its runs are cheap, not because it passes more. Medium effort passed the most and cost about the same per correct change as the verify instruction; Superpowers cost the most.</figcaption>

</figure>

### Did the agent actually check?

The verify instruction changed what the agent tried, much more than what it achieved.

<figure class="guide-figure">

<img src="/guide-images/chart-vvs-process.png" alt="What the agent did by arm: tried to start the app, got a reply, wrote API tests, ran project tests" width="1800" height="920" loading="lazy" />

<figcaption>With the instruction, the agent tried to start the shop in 47 of 60 runs; no other arm ever tried. It got the shop to answer a request in 3. Superpowers wrote tests that call the API far more often (16 runs). Medium effort ran the project's tests in 37 runs without being asked, against 3 for the same agent at low effort.</figcaption>

</figure>

The reason is specific to this code, but common in real projects. Shopizer does not start on its own without a database settings file that a fresh copy does not have. Its tests do start it, with a temporary in-memory database.

A typical verify run tried to start the shop, failed, and then moved on. The instruction offered a second route: "write or run a test that starts it". Only 5 of 60 runs took it.

So this experiment mostly measured the instruction against an app that is awkward to start. In a project where the app starts with one command, the result could be different.

<figure class="guide-figure">

<img src="/guide-images/chart-vvs-claims.png" alt="Runs that passed, or failed while saying they worked, by arm" width="1800" height="920" loading="lazy" />

<figcaption>At the end of each run, the agent reports whether its change works. Nearly every failed run said it did, in every arm: 78 of 79 failed runs. The instruction to "say plainly if you could not check something" did not change that.</figcaption>

</figure>

The instruction did change what the agent wrote about its checks. Verify runs often named what they could not check, for example: "The application did not start on localhost:8080, so live endpoint behavior could not be checked." They still reported the change as passed. The agent's report also has a field for things it could not check, and almost every run in every arm filled it in, so that field tells the arms apart no better.

### Two tasks in detail

**REVEDIT.** All 12 runs failed in every arm, including medium effort. The task asks for editing and deleting product reviews to work. The natural fix changes a piece of shared code that both editing and *creating* a review use. In 9 of the 12 runs, that change broke creating a review, which had worked before.

The verify instruction names this kind of shared code ("populators") and asks the agent to check its other callers. All 3 verify runs broke review creation anyway. In my earlier trial runs at high effort, the agent did pass this task. So the hardest neighbour break needs more than medium effort, and more than an instruction.

**USERERR.** Every run in every arm failed the same test: updating a user who does not exist must answer 404. The obvious fix checks "if the user is missing, answer 404". But the database lookup here returns a placeholder object instead of nothing, so that check never fires, and the request fails later with a 500. Seeing this needs a request for a missing user, and no run made one.

### The other differences

| Task | What happened |
| --- | --- |
| BOXVIS | Hiding boxes from shoppers often hid them from the back office too: 5 failed runs broke the back-office list. Medium effort passed 2 of 3, the instruction and Superpowers 1, no skills none |
| CATCOUNT | The low-effort arms passed 2 of 9 runs, counting a product once per subcategory. Medium effort passed all 3 |
| CUSTREVIEW | Low-effort runs usually missed that a missing review must answer 404, the same placeholder problem as USERERR. Medium effort passed all 3 |
| TAXRATE | As in the skill packs experiment, the obvious fix adds range annotations that nothing checks. Superpowers and medium effort passed 2 of 3; no skills and the instruction passed none |
| REVIEW | The only task where medium effort did worse: 2 of 3 runs failed the rating and duplicate-review checks, which every low-effort run passed |

## Limits

One codebase; one agent and model. I wrote the tasks, hidden tests and reference fixes; all are published for checking.

The verify instruction was tested against an app that does not start outside its tests without extra set-up. That is common, but it is not every project.

Only 2 tasks were neighbour breaks, the kind the instruction's "check the other callers" part is aimed at. Two others I wrote were too easy and were not kept, so the experiment could hardly detect an effect there.

Tasks were chosen using the no-skills and medium-effort arms' trial runs. That slightly favours those two arms in the results. It makes the tests of the instruction and of Superpowers cautious, and it slightly flatters medium effort when it is compared with them. The medium-effort result is also only just under the threshold I set.

## Reproduce

Everything is in [experiments/2026-10-verify-vs-skills](https://github.com/meabs/experiments/tree/9580d4aa95ec23e581026741afb909e820d5af51/2026-10-verify-vs-skills):

- the task prompts (`tasks/`);
- the hidden tests (`hidden/`);
- the verify instruction (`arms/verify/AGENTS.md`);
- the raw runs (`results/stage1-low`, `results/stage1-medium`);
- the analysis script (`scripts/analyse.py`);
- the chart script (`scripts/charts.py`).

The commands are in REPORT.md, section Reproducing.
