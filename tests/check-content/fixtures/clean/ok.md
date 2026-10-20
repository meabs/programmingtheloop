---
title: "Clean fixture"
description: "Valid structured experiment for the clean set."
date: 2026-10-17
summary: "A clean published experiment with one finding."
type: "Controlled trial"
draft: true
experimentId: "CLEAN"
question: "Does the checker accept a well-formed published experiment?"
status: "published"
evidenceGrade: "published"
repo: "https://github.com/meabs/OKFExperiment"
report: "https://github.com/meabs/OKFExperiment/blob/main/README.md"
topics:
  - measurement
agents:
  - name: "Codex"
    model: "test-model"
findings:
  - id: "CLEAN-1"
    statement: "Fixture finding only — not a real result."
    value: "n/a"
    limits:
      - "Fixture only; not from the Guide."
    source: "https://github.com/meabs/OKFExperiment/blob/main/README.md"
    status: "current"
    featured: false
github: []
guideLinks: []
---

Fixture body. Not published on the site (`draft: true` in real content would hide it; this file lives under tests/).
