#!/usr/bin/env python3
"""Compare first-edition book Markdown to Guide pages; report coverage."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

BOOK = Path(
    "/home/ubuntu/.cursor/projects/workspace/uploads/"
    "Programming-the-Loop-1st-edition_8326.md"
)
GUIDE = Path("src/content/docs/guide")
REPORT = Path("docs/book-coverage-report.json")


def strip_fm(text: str) -> str:
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[end + 4 :]
    return text


def adapt_copyright_for_web(text: str) -> str:
    """Map book copyright-page ebook/PDF-or-EPUB wording to the site's web licence."""
    text = text.replace("This ebook is free to read", "This guide is free to read")
    text = text.replace(
        "the unchanged PDF or EPUB",
        "the unchanged pages (or the October 2026 PDF)",
    )
    text = text.replace("keep this notice", "keep the copyright notice")
    text = text.replace(
        "modified versions or extracts presented as the whole",
        "modified versions",
    )
    return text


def normalize(text: str) -> str:
    text = strip_fm(text)
    # drop pandoc attrs / divs markers for comparison of prose
    text = re.sub(r"\{[^}]*\}", "", text)
    text = re.sub(r":::\s*\.?[\w.-]*", "", text)
    text = re.sub(r":::", "", text)
    text = text.replace("](images/", "](/guide-images/")
    # unwrap markdown links for comparison: [text](url) -> text
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    # task list markers
    text = re.sub(r"- \[ \]\s*", "- ", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip().lower()
    return text


def paragraphs(text: str) -> list[str]:
    """Split into prose paragraphs / table rows / list items worth covering."""
    raw = strip_fm(text)
    # Keep copyright-page prose (© notice, Quoted material, Disclaimer); drop only
    # the decorative title / byline block above the first © line.
    copyright_start = raw.find("© Garry Meaburn")
    foreword = raw.find("# Foreword:")
    if copyright_start != -1 and (foreword == -1 or copyright_start < foreword):
        raw = adapt_copyright_for_web(raw[copyright_start:])
    elif foreword != -1:
        raw = raw[foreword:]
    # unwrap format-specific fences — both forms are expected on the web
    raw = re.sub(r"::: \{\.pdf-only\}\n(.*?):::", r"\1", raw, flags=re.S)
    raw = re.sub(r"::: \{\.epub-only\}\n(.*?):::", r"\1", raw, flags=re.S)
    chunks: list[str] = []
    # code fences as atomic units
    parts = re.split(r"(```.*?```)", raw, flags=re.S)
    for part in parts:
        if part.startswith("```"):
            n = normalize(part)
            if len(n) > 40:
                chunks.append(n)
            continue
        for block in re.split(r"\n\s*\n", part):
            block = block.strip()
            if not block:
                continue
            # skip lone headings
            if re.match(r"^#{1,6}\s+\S+$", block) and "\n" not in block:
                continue
            if block.startswith("# ") and "\n" not in block:
                continue
            n = normalize(block)
            if len(n) < 40:
                continue
            chunks.append(n)
    return chunks


def checklist_items(text: str) -> list[str]:
    items: list[str] = []
    for m in re.finditer(r"::: \{\.checklist\}(.*?):::", text, flags=re.S):
        for line in m.group(1).splitlines():
            if line.startswith("- "):
                items.append(normalize(line[2:]))
    return [i for i in items if i]


def guide_checklist_items(text: str) -> list[str]:
    items: list[str] = []
    for line in text.splitlines():
        m = re.match(r"- \[ \]\s+(.*)", line)
        if m:
            items.append(normalize(m.group(1)))
    return [i for i in items if i]


def image_refs(text: str) -> list[str]:
    return re.findall(r"images/([\w.-]+\.png)", text)


def main() -> int:
    book = BOOK.read_text()
    # Include guide/index.md (licence / about-the-guide) plus chapter pages.
    guide_text = "\n\n".join(p.read_text() for p in sorted(GUIDE.glob("*.md")))
    about_licence = Path("src/content/docs/about/index.mdx")
    if about_licence.exists():
        guide_text = guide_text + "\n\n" + about_licence.read_text()

    book_paras = paragraphs(book)
    guide_norm = normalize(guide_text)

    missing_paras: list[str] = []
    for p in book_paras:
        # fuzzy: require 85% of a sliding window — use substring of first 120 chars
        probe = p[:120] if len(p) > 120 else p
        if probe not in guide_norm and p not in guide_norm:
            # try mid-string probe
            mid = p[len(p) // 4 : len(p) // 4 + 100]
            if mid and mid in guide_norm:
                continue
            missing_paras.append(p[:180])

    book_checks = checklist_items(book)
    guide_checks = guide_checklist_items(guide_text)
    missing_checks = [c for c in book_checks if c not in guide_checks]

    book_imgs = image_refs(book)
    missing_imgs = [
        i for i in book_imgs if i not in guide_text and f"/guide-images/{i}" not in guide_text
    ]
    present_files = {p.name for p in Path("public/guide-images").glob("*.png")}
    missing_img_files = [i for i in book_imgs if i not in present_files]

    # references: count numbered refs 1–21
    ref_count_book = len(re.findall(r"^\d+\.\s+", book[book.find("# References") :], re.M))
    ref_count_guide = len(
        re.findall(r"^\d+\.\s+", Path("src/content/docs/guide/references.md").read_text(), re.M)
    )

    para_cov = 1 - len(missing_paras) / max(len(book_paras), 1)
    check_cov = 1 - len(missing_checks) / max(len(book_checks), 1)
    img_cov = 1 - len(missing_imgs) / max(len(book_imgs), 1)

    report = {
        "book_paragraphs": len(book_paras),
        "missing_paragraphs": len(missing_paras),
        "paragraph_coverage": round(para_cov, 4),
        "book_checklist_items": len(book_checks),
        "guide_checklist_items": len(guide_checks),
        "missing_checklist_items": missing_checks,
        "checklist_coverage": round(check_cov, 4),
        "book_images": book_imgs,
        "missing_image_refs": missing_imgs,
        "missing_image_files": missing_img_files,
        "image_coverage": round(img_cov, 4),
        "reference_lines_book": ref_count_book,
        "reference_lines_guide": ref_count_guide,
        "intentional_omissions": [
            "Title / byline above the copyright notice (web uses site chrome / Guide index); copyright-page paragraphs (© notice, Quoted material, Disclaimer) are included",
            "Copyright © line: ebook / PDF-or-EPUB wording adapted for the web (guide + pages / October 2026 PDF); Quoted material and Disclaimer kept verbatim",
            "Pandoc `{.unnumbered}` / `{.pdf-only}` / `{.epub-only}` / `{.checklist}` / `{.keep}` / `{.refs}` attributes (converted for web; content kept)",
            "Bare 'Chapter N' strings turned into internal links (prose unchanged aside from link markup)",
        ],
        "missing_paragraph_samples": missing_paras[:25],
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2))
    print(json.dumps({k: report[k] for k in report if k != "missing_paragraph_samples"}, indent=2))
    print(f"\nWrote {REPORT}")
    print(f"Paragraph coverage: {para_cov:.1%} ({len(book_paras) - len(missing_paras)}/{len(book_paras)})")
    print(f"Checklist coverage: {check_cov:.1%} ({len(book_checks) - len(missing_checks)}/{len(book_checks)})")
    print(f"Image coverage: {img_cov:.1%}")
    if missing_paras:
        print(f"\nFirst missing paragraph probes ({min(5, len(missing_paras))}):")
        for s in missing_paras[:5]:
            print(" -", s[:140])
    ok = (
        para_cov >= 0.98
        and check_cov >= 0.99
        and not missing_imgs
        and not missing_img_files
        and ref_count_guide >= ref_count_book
    )
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
