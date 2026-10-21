---
title: "Pinned link fixture"
description: "Evidence links that name a commit, plus cases that must not be flagged."
date: 2026-10-17
summary: "Pinned links."
type: "Controlled trial"
draft: true
experimentId: "PIN"
question: "Does the checker accept pinned links?"
status: "published"
evidenceGrade: "published"
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/5a090274481d1386ed96e75fa2a90d47c2d4a7c4/README.md"
findings:
  - id: "PIN-1"
    statement: "Fixture finding only."
    limits:
      - "Fixture only."
    source: "https://github.com/meabs/OKFExperiment/tree/5a09027/results"
    status: "current"
    featured: false
github: []
guideLinks: []
---

The site's own repository may follow main: [this repo](https://github.com/meabs/programmingtheloop/blob/main/README.md).

A repository root is not a file link: https://github.com/meabs/OKFExperiment

Example output inside a code fence is ignored:

```text
resource: "https://github.com/meabs/OKFExperiment/blob/main/fixtures/x.py"
```
