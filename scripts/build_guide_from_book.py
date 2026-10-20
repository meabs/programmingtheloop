#!/usr/bin/env python3
"""Convert the first-edition book Markdown into Starlight Guide pages.

Source of truth: uploads/Programming-the-Loop-1st-edition_*.md
Does not summarise — ports prose with web adaptations only
(pandoc constructs, image paths, cross-links, frontmatter).
"""

from __future__ import annotations

import re
import shutil
from pathlib import Path

BOOK = Path(
    "/home/ubuntu/.cursor/projects/workspace/uploads/"
    "Programming-the-Loop-1st-edition_8326.md"
)
OUT_DIR = Path("src/content/docs/guide")
LEARN_DIR = Path("src/content/docs/learn")

# Split points: top-level # headings that start a guide page (not code samples).
# Order is reading order.
SECTIONS: list[tuple[str, str, str]] = [
    # slug, title for frontmatter, heading prefix to match
    ("foreword", "Foreword: why I ran the experiments", "# Foreword: why I ran the experiments"),
    (
        "facts-checks-upkeep",
        "1. Facts, checks and upkeep",
        "# Facts, checks and upkeep: the argument and the evidence",
    ),
    (
        "briefs-plans-specifications",
        "2. Briefs, plans and specifications",
        '# Briefs, plans and specifications: deciding what "done" means',
    ),
    (
        "right-facts",
        "3. The right facts, not every fact",
        "# The right facts, not every fact: context, documentation and knowledge layers",
    ),
    (
        "verifiable-change",
        "4. One verifiable change at a time",
        "# One verifiable change at a time: the implementation loop",
    ),
    (
        "proof-not-promises",
        "5. Proof, not promises",
        "# Proof, not promises: verification",
    ),
    (
        "harness-friction-loop",
        "6. The harness and the friction loop",
        "# The harness and the friction loop: finding and removing recurring problems",
    ),
    (
        "parallel-agents",
        "7. Parallel agents",
        "# Parallel agents: isolation and the cost of coordination",
    ),
    (
        "review-merging-risk",
        "8. Review, merging and risk",
        "# Review, merging and risk: matching scrutiny to consequence",
    ),
    (
        "tools-measurement",
        "9. Tools and honest measurement",
        "# Tools and honest measurement",
    ),
    (
        "safety-cost-human",
        "10. Safety, cost and the human in the loop",
        "# Safety, cost and the human in the loop",
    ),
    (
        "take-home-kit",
        "11. The take-home kit",
        "# The take-home kit: adopting agents, one justified layer at a time",
    ),
    ("cheat-sheet", "Cheat sheet", "# Cheat sheet"),
    ("glossary", "Glossary", "# Glossary"),
    ("references", "References and further reading", "# References and further reading"),
    ("about-the-evidence", "About the evidence", "# About the evidence"),
    ("about-the-author", "About the author", "# About the author"),
    ("acknowledgements", "Acknowledgements", "# Acknowledgements"),
]

CHAPTER_LINKS = {
    "Chapter 1": "/guide/facts-checks-upkeep/",
    "Chapter 2": "/guide/briefs-plans-specifications/",
    "Chapter 3": "/guide/right-facts/",
    "Chapter 4": "/guide/verifiable-change/",
    "Chapter 5": "/guide/proof-not-promises/",
    "Chapter 6": "/guide/harness-friction-loop/",
    "Chapter 7": "/guide/parallel-agents/",
    "Chapter 8": "/guide/review-merging-risk/",
    "Chapter 9": "/guide/tools-measurement/",
    "Chapter 10": "/guide/safety-cost-human/",
    "Chapter 11": "/guide/take-home-kit/",
    "Chapters 3 and 5": "/guide/right-facts/",  # dual — note in coverage
    "Chapters 3 to 9": "/guide/right-facts/",
}


def strip_yaml_frontmatter(text: str) -> str:
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[end + 4 :].lstrip("\n")
    return text


def extract_section(text: str, start_heading: str, next_heading: str | None) -> str:
    start = text.find(start_heading)
    if start < 0:
        raise SystemExit(f"Missing section start: {start_heading}")
    if next_heading:
        end = text.find(next_heading, start + len(start_heading))
        if end < 0:
            raise SystemExit(f"Missing section end before: {next_heading}")
        return text[start:end].rstrip() + "\n"
    return text[start:].rstrip() + "\n"


def convert_checklists(body: str) -> str:
    """Turn ::: {.checklist} blocks into markdown task lists."""

    def repl(m: re.Match[str]) -> str:
        inner = m.group(1)
        # Drop a leading ## Checklist heading inside the fence (keep as ##)
        lines = inner.strip("\n").splitlines()
        out: list[str] = []
        for line in lines:
            if re.match(r"^##\s+", line):
                out.append(line)
                continue
            if re.match(r"^\*\*.+\*\*$", line.strip()) and not line.strip().startswith("-"):
                # bold-only label used as mini heading in Ch 11
                out.append(f"### {line.strip().strip('*')}")
                continue
            if line.startswith("- "):
                item = line[2:]
                if not item.startswith("[ ]") and not item.startswith("[x]"):
                    out.append(f"- [ ] {item}")
                else:
                    out.append(line)
            elif line.strip() == "":
                out.append("")
            else:
                out.append(line)
        return "\n".join(out) + "\n"

    return re.sub(
        r"::: \{\.checklist\}\n(.*?)\n:::",
        repl,
        body,
        flags=re.S,
    )


def convert_fenced_divs(body: str) -> str:
    # Keep both PDF figure and epub/text forms on the web.
    body = re.sub(r"::: \{\.pdf-only\}\n(.*?)\n:::", r"\1", body, flags=re.S)
    body = re.sub(r"::: \{\.epub-only\}\n(.*?)\n:::", r"\1", body, flags=re.S)
    body = re.sub(r"::: \{\.keep\}\n(.*?)\n:::", r"\1", body, flags=re.S)
    body = re.sub(r"::: \{\.refs\}\n(.*?)\n:::", r"\1", body, flags=re.S)
    return body


def convert_headings(body: str) -> str:
    # Strip pandoc attributes on headings
    body = re.sub(r"^(#{1,6}\s+.+?)\s*\{[^}]*\}\s*$", r"\1", body, flags=re.M)
    # Demote the page's H1 to match Starlight (title comes from frontmatter)
    lines = body.splitlines()
    if lines and lines[0].startswith("# "):
        lines[0] = lines[0]  # keep H1 — Starlight uses frontmatter title; duplicate H1 is ok to remove
        # Remove the first H1 so Starlight page title isn't duplicated
        rest = "\n".join(lines[1:]).lstrip("\n")
        return rest
    return body


def convert_images(body: str) -> str:
    body = body.replace("](images/", "](/guide-images/")
    # strip pandoc image attrs like {.cheatsheet}
    body = re.sub(r"(!\[[^\]]*\]\([^)]+\))\{[^}]*\}", r"\1", body)
    return body


def link_chapters(body: str) -> str:
    """Add links to bare 'Chapter N' mentions outside code fences."""
    parts = re.split(r"(```.*?```)", body, flags=re.S)
    out: list[str] = []
    # Longer keys first
    keys = sorted(CHAPTER_LINKS.keys(), key=len, reverse=True)
    for part in parts:
        if part.startswith("```"):
            out.append(part)
            continue
        chunk = part
        for key in keys:
            href = CHAPTER_LINKS[key]
            # avoid replacing inside existing links
            pattern = rf"(?<!\[)(?<![/\w]){re.escape(key)}(?!\])"
            chunk = re.sub(pattern, f"[{key}]({href})", chunk)
        out.append(chunk)
    return "".join(out)


def web_adapt_phrases(body: str) -> str:
    """Light web adaptations that keep meaning; do not rewrite prose."""
    # Title-page / edition notes that still read fine as "this guide"
    # Leave most "this book" as-is per instructions ("can stay or become 'this guide' where natural").
    return body


def to_page(slug: str, title: str, body: str) -> str:
    body = convert_fenced_divs(body)
    body = convert_checklists(body)
    body = convert_headings(body)
    body = convert_images(body)
    body = link_chapters(body)
    body = web_adapt_phrases(body)
    # Escape accidental YAML-breaking in rare cases — body is markdown after ---
    desc = f"From Programming the Loop — {title}."
    fm = (
        f"---\n"
        f'title: "{title}"\n'
        f'description: "{desc}"\n'
        f"---\n\n"
    )
    note = (
        '<p class="guide-edition-note">'
        "Living web edition of the October 2026 first edition. "
        '<a href="/downloads/">Archived PDF</a> · '
        '<a href="/updates/">Updates</a>'
        "</p>\n\n"
    )
    return fm + note + body.strip() + "\n"


def write_index() -> None:
    rows = "\n".join(
        f"| {title} | [/guide/{slug}/](/guide/{slug}/) |"
        for slug, title, _ in SECTIONS
    )
    content = f"""---
title: "Guide"
description: "Programming the Loop — living web edition of the October 2026 first edition."
---

<p class="guide-edition-note">
Living web edition. Last updated: 20 October 2026.
<a href="/updates/">Changelog</a> ·
<a href="/downloads/">Archived first-edition PDF</a>
</p>

# Guide

This site is the living home for *Programming the Loop: What I Measured with Coding Agents*. The October 2026 first edition is available as an [archived PDF](/downloads/); the pages below are the full text, kept up to date here.

## Contents

| Section | Page |
| --- | --- |
{rows}

## Licence

© Garry Meaburn 2026. This guide is free to read. You may share the unchanged pages (or the archived PDF) with others, free of charge, as long as you credit Garry Meaburn as the author and keep the copyright notice. You may not sell it, use it commercially, or share modified versions, without written permission.
"""
    (OUT_DIR / "index.md").write_text(content)


def main() -> None:
    raw = strip_yaml_frontmatter(BOOK.read_text())
    # Drop title page block before foreword
    if "# Foreword:" not in raw:
        raise SystemExit("Foreword not found")

    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    OUT_DIR.mkdir(parents=True)

    for i, (slug, title, start) in enumerate(SECTIONS):
        nxt = SECTIONS[i + 1][2] if i + 1 < len(SECTIONS) else None
        section = extract_section(raw, start, nxt)
        page = to_page(slug, title, section)
        (OUT_DIR / f"{slug}.md").write_text(page)
        print(f"wrote guide/{slug}.md ({len(page)} chars)")

    write_index()
    print("wrote guide/index.md")

    # Remove old Learn summary pages (replaced by Guide)
    if LEARN_DIR.exists():
        shutil.rmtree(LEARN_DIR)
        print("removed src/content/docs/learn/")


if __name__ == "__main__":
    main()
