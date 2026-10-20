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
GUIDE = Path("src/content/docs/guides/programming-the-loop")
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


def extract_fact_numbers(text: str) -> list[str]:
    """Distinctive measured numbers / ratios that must survive presentation edits."""
    body = text
    start = body.find("# Foreword:")
    if start != -1:
        body = body[start:]
    patterns = [
        r"\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b",  # 1,650 / 1,046k-style thousands
        r"\b\d+\.\d+\b",  # decimals incl. p-values, ratios
        r"\b\d+\s*[–—-]\s*\d+%?",  # 35–48 / 18–19
        r"\b\+?\d+(?:\.\d+)?%",  # percentages
        r"\b\d+\s+of\s+\d+\b",  # 14 of 16
        r"\bp\s*=\s*[\d.]+",  # p = 0.52
        r"\bp\s*≈\s*[\d.]+",  # p ≈ 0.002
        r"\b\d+k\b",  # 401k tokens
    ]
    found: list[str] = []
    seen: set[str] = set()
    for pat in patterns:
        for m in re.finditer(pat, body, flags=re.I):
            token = re.sub(r"\s+", " ", m.group(0).strip().lower())
            token = token.replace("—", "–").replace("-", "–")
            if token in seen:
                continue
            # Skip lone chapter/list counters that are not evidence
            if re.fullmatch(r"\d+", token) and int(token) <= 21:
                continue
            seen.add(token)
            found.append(token)
    return found


def extract_citations(text: str) -> list[str]:
    """URLs and github.com/meabs paths that must still appear on the site."""
    urls = re.findall(r"https?://[^\s\)\]\>\"']+", text)
    cleaned: list[str] = []
    seen: set[str] = set()
    for u in urls:
        u = u.rstrip(".,);]")
        if u in seen:
            continue
        seen.add(u)
        cleaned.append(u)
    return cleaned


def main() -> int:
    book = BOOK.read_text()
    # Include guide/index.md (licence / about-the-guide) plus chapter pages.
    guide_text = "\n\n".join(p.read_text() for p in sorted(GUIDE.glob("*.md")))
    about_licence = Path("src/content/docs/about/index.mdx")
    if about_licence.exists():
        guide_text = guide_text + "\n\n" + about_licence.read_text()

    book_paras = paragraphs(book)
    guide_norm = normalize(guide_text)
    guide_fold = re.sub(r"\s+", " ", guide_text).lower()
    guide_fold = guide_fold.replace("—", "–").replace("-", "–")

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
        re.findall(r"^\d+\.\s+", (GUIDE / "references.md").read_text(), re.M)
    )

    book_numbers = extract_fact_numbers(book)
    missing_numbers = [n for n in book_numbers if n not in guide_fold]
    book_cites = extract_citations(book)
    missing_cites = [c for c in book_cites if c not in guide_text]

    para_cov = 1 - len(missing_paras) / max(len(book_paras), 1)
    check_cov = 1 - len(missing_checks) / max(len(book_checks), 1)
    img_cov = 1 - len(missing_imgs) / max(len(book_imgs), 1)
    num_cov = 1 - len(missing_numbers) / max(len(book_numbers), 1)
    cite_cov = 1 - len(missing_cites) / max(len(book_cites), 1)

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
        "book_fact_numbers": len(book_numbers),
        "missing_fact_numbers": missing_numbers[:40],
        "fact_number_coverage": round(num_cov, 4),
        "book_citations": len(book_cites),
        "missing_citations": missing_cites[:20],
        "citation_coverage": round(cite_cov, 4),
        "reference_lines_book": ref_count_book,
        "reference_lines_guide": ref_count_guide,
        "intentional_omissions": [
            "Title / byline above the copyright notice (web uses site chrome / Guide index); copyright-page paragraphs (© notice, Quoted material, Disclaimer) are included",
            "Copyright © line: ebook / PDF-or-EPUB wording adapted for the web (guide + pages / October 2026 PDF); Quoted material and Disclaimer kept verbatim",
            "Pandoc `{.unnumbered}` / `{.pdf-only}` / `{.epub-only}` / `{.checklist}` / `{.keep}` / `{.refs}` attributes (converted for web; content kept)",
            "Bare 'Chapter N' strings turned into internal links (prose unchanged aside from link markup)",
            "Web presentation edits (Heavy/Lean labels, What it shows/doesn't → Limits, figure captions, bold mini-headings → ###) may lower exact paragraph match; fact-number and citation coverage are the gate",
        ],
        "missing_paragraph_samples": missing_paras[:25],
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2))
    summary_keys = [
        "book_paragraphs",
        "missing_paragraphs",
        "paragraph_coverage",
        "book_checklist_items",
        "guide_checklist_items",
        "missing_checklist_items",
        "checklist_coverage",
        "missing_image_refs",
        "missing_image_files",
        "image_coverage",
        "book_fact_numbers",
        "missing_fact_numbers",
        "fact_number_coverage",
        "book_citations",
        "missing_citations",
        "citation_coverage",
        "reference_lines_book",
        "reference_lines_guide",
        "intentional_omissions",
    ]
    print(json.dumps({k: report[k] for k in summary_keys}, indent=2))
    print(f"\nWrote {REPORT}")
    print(f"Paragraph coverage: {para_cov:.1%} ({len(book_paras) - len(missing_paras)}/{len(book_paras)}) [informational when presentation edits]")
    print(f"Checklist coverage: {check_cov:.1%} ({len(book_checks) - len(missing_checks)}/{len(book_checks)})")
    print(f"Image coverage: {img_cov:.1%}")
    print(f"Fact-number coverage: {num_cov:.1%} ({len(book_numbers) - len(missing_numbers)}/{len(book_numbers)})")
    print(f"Citation coverage: {cite_cov:.1%} ({len(book_cites) - len(missing_cites)}/{len(book_cites)})")
    if missing_paras:
        print(f"\nFirst missing paragraph probes ({min(5, len(missing_paras))}):")
        for s in missing_paras[:5]:
            print(" -", s[:140])
    if missing_numbers:
        print(f"\nMissing fact numbers ({len(missing_numbers)}):", ", ".join(missing_numbers[:20]))
    if missing_cites:
        print(f"\nMissing citations ({len(missing_cites)}):")
        for c in missing_cites[:10]:
            print(" -", c)
    ok = (
        check_cov >= 0.99
        and num_cov >= 0.995
        and cite_cov >= 0.99
        and not missing_imgs
        and not missing_img_files
        and ref_count_guide >= ref_count_book
    )
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
