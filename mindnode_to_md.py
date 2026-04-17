#!/usr/bin/env python3
"""MindNode contents.xml (or plist) to Markdown converter."""
import re
import html
import plistlib
from pathlib import Path


def html_to_text(s: str) -> str:
    if not s:
        return ""
    s = html.unescape(s)
    # Remove HTML tags
    s = re.sub(r"<[^>]+>", " ", s)
    # Normalize whitespace
    s = re.sub(r"\s+", " ", s).strip()
    return s


def html_note_to_markdown(s: str) -> str:
    """Convert note HTML to markdown: tables and paragraphs."""
    if not s:
        return ""
    s = html.unescape(s)
    # Replace <p> with newlines
    s = re.sub(r"</p>\s*<p[^>]*>", "\n", s)
    s = re.sub(r"<p[^>]*>", "", s)
    s = re.sub(r"</p>", "\n", s)
    # Strip other tags but keep content
    s = re.sub(r"<[^>]+>", "", s)
    # Collapse excessive newlines; keep at most one blank between paragraphs
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def node_to_md(node: dict, depth: int, lines: list, include_notes: bool = True) -> None:
    title_dict = node.get("title") or {}
    title_html = title_dict.get("text", "")
    title = html_to_text(title_html)
    if not title:
        title = "(Başlıksız)"

    indent = "  " * depth
    prefix = "#" * (depth + 1) + " " if depth < 5 else indent + "- "
    lines.append("")
    lines.append(prefix + title)

    if include_notes:
        note_dict = node.get("note") or {}
        note_html = note_dict.get("text", "")
        if note_html:
            note_md = html_note_to_markdown(note_html)
            if note_md:
                lines.append("")
                lines.append(note_md)

    for sub in node.get("subnodes") or []:
        node_to_md(sub, depth + 1, lines, include_notes)


def main():
    base = Path(__file__).parent
    plist_path = base / "nutuVocabulary.mindnode" / "contents.xml"
    with open(plist_path, "rb") as f:
        data = plistlib.load(f)

    canvas = data.get("canvas") or {}
    mind_maps = canvas.get("mindMaps") or []
    if not mind_maps:
        raise SystemExit("Plist içinde mindMaps bulunamadı.")

    lines = []
    for mm in mind_maps:
        main_node = mm.get("mainNode")
        if not main_node:
            continue
        node_to_md(main_node, 0, lines, include_notes=True)

    md_content = "\n".join(lines).strip()
    out_path = base / "nutuVocabulary.md"
    out_path.write_text(md_content, encoding="utf-8")
    print(f"Yazıldı: {out_path}")


if __name__ == "__main__":
    main()
