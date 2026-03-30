#!/usr/bin/env python3
"""
One-off converter: Bazel integration series .md -> .mdx with frontmatter,
internal doc links, DocImage, JSX tables, Terminal for simple bash blocks.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content/docs/Knowledge base/projects/Bazel integration"
DOC_PREFIX = "/docs/Knowledge-base/projects/Bazel-integration"

FRONTMATTER = """---
title: "{title}"
description: {description}
publishedAt: 2024-01-01
order: {order}
author: Adam Boualleiguie
authorPhoto: adam-boualleiguie.jpeg
tags: [bazel-integration, build-system, opentelemetry, astronomy-shop, otel-demo]
showMetadata: true
---

"""

ORDER_RE = re.compile(r"^(\d+)-")


def extract_order(stem: str) -> int:
    m = ORDER_RE.match(stem)
    return int(m.group(1)) if m else 999


def fix_links(text: str) -> str:
    def repl(m: re.Match) -> str:
        label, path, frag = m.group(1), m.group(2), m.group(3) or ""
        slug = path.replace(".md", "").lstrip("./")
        return f"[{label}]({DOC_PREFIX}/{slug}{frag})"

    return re.sub(
        r"\[([^\]]+)\]\((?:\./)?([^#)]+\.md)(#[^)]+)?\)",
        repl,
        text,
    )


def img_to_docimage(text: str) -> str:
    def repl(m: re.Match) -> str:
        url = m.group(1)
        if "knowledge-base.local/screenshots/" in url:
            name = url.split("screenshots/")[-1]
            src = f"/assets/docs/knowledge-base/bazel-integration/{name}"
            base = name.rsplit(".", 1)[0]
            alt = base.replace("-", " ").replace("_", " ")
            cap = alt[:1].upper() + alt[1:] if alt else ""
            return (
                f'<DocImage\n  src="{src}"\n  alt="{alt}"\n'
                f'  caption="{cap}"\n/>'
            )
        return m.group(0)

    return re.sub(r"!\[\]\(([^)]+)\)", repl, text)


def _inline_simple(s: str) -> str:
    """Assume s has no raw HTML; escape < > & then apply markdown."""
    # Split by `...` manually
    out = []
    i = 0
    while True:
        a = s.find("`", i)
        if a == -1:
            chunk = s[i:]
            out.append(_md_chunk(chunk))
            break
        out.append(_md_chunk(s[i:a]))
        b = s.find("`", a + 1)
        if b == -1:
            out.append(s[a:])
            break
        inner = s[a + 1 : b]
        inner = inner.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        out.append(f"<code>{inner}</code>")
        i = b + 1
    return "".join(out)


def _md_chunk(s: str) -> str:
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", s)
    s = re.sub(r"_fill in_", r"<em>fill in</em>", s)
    s = re.sub(r"_TBD_", r"<em>TBD</em>", s)
    return s


def is_table_separator(line: str) -> bool:
    line = line.strip()
    if not line.startswith("|"):
        return False
    return bool(re.match(r"^\|?[\s\-:|]+\|", line))


def split_table_row(line: str) -> list[str]:
    raw = line.strip()
    if raw.startswith("|"):
        raw = raw[1:]
    if raw.endswith("|"):
        raw = raw[:-1]
    return [c.strip() for c in raw.split("|")]


def table_to_jsx(block_lines: list[str]) -> str:
    rows: list[list[str]] = []
    for line in block_lines:
        if is_table_separator(line):
            continue
        if not line.strip().startswith("|"):
            continue
        rows.append(split_table_row(line))
    if len(rows) < 2:
        return "\n".join(block_lines)
    out = ["<table>", "  <thead>", "    <tr>"]
    for h in rows[0]:
        out.append(f"      <th>{_inline_simple(h)}</th>")
    out.extend(["    </tr>", "  </thead>", "  <tbody>"])
    for row in rows[1:]:
        out.append("    <tr>")
        for c in row:
            out.append(f"      <td>{_inline_simple(c)}</td>")
        out.append("    </tr>")
    out.extend(["  </tbody>", "</table>"])
    return "\n".join(out)


def convert_tables(text: str) -> str:
    lines = text.split("\n")
    out: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.strip().startswith("|") and i + 1 < len(lines) and is_table_separator(lines[i + 1]):
            block = [lines[i], lines[i + 1]]
            i += 2
            while i < len(lines) and lines[i].strip().startswith("|"):
                block.append(lines[i])
                i += 1
            out.append(table_to_jsx(block))
            continue
        out.append(line)
        i += 1
    return "\n".join(out)


def should_keep_bash_as_fence(block: str) -> bool:
    b = block.strip()
    if "BUILD_WORKSPACE_DIRECTORY" in b:
        return True
    if b.count("\n") > 8:
        return True
    if re.search(r"^\s*(if |for |while |exec python)", b, re.M):
        return True
    return False


def bash_to_terminal(block: str) -> str:
    if should_keep_bash_as_fence(block):
        return "```bash\n" + block.strip() + "\n```"
    lines = [ln.rstrip() for ln in block.strip().split("\n")]
    commands: list[dict] = []
    pending: list[str] = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("#"):
            pending.append(stripped)
            continue
        if not stripped:
            continue
        out = "\n".join(pending).strip() if pending else ""
        pending = []
        commands.append({"command": stripped, "output": out})
    if pending and commands:
        commands[-1]["output"] = (
            (commands[-1].get("output", "") + "\n" + "\n".join(pending)).strip()
        )
    if not commands:
        return "```bash\n" + block.strip() + "\n```"

    lines_jsx = ["<Terminal", '  title="Shell"', "  commands={["]
    for c in commands:
        lines_jsx.append("    {")
        lines_jsx.append(f"      command: {json.dumps(c['command'])},")
        lines_jsx.append(f"      output: {json.dumps(c.get('output', ''))},")
        lines_jsx.append("    },")
    lines_jsx.extend(["  ]}", "/>"])
    return "\n".join(lines_jsx)


def convert_fenced_bash(text: str) -> str:
    pattern = re.compile(r"```bash\n(.*?)```", re.DOTALL)

    def repl(m: re.Match) -> str:
        return bash_to_terminal(m.group(1))

    return pattern.sub(repl, text)


def extract_title_and_desc(body: str) -> tuple[str, str]:
    lines = body.split("\n")
    title = "Untitled"
    desc = "Bazel integration series."
    for i, ln in enumerate(lines):
        if ln.startswith("# "):
            title = ln[2:].strip().replace('"', '\\"')
            for j in range(i + 1, min(i + 10, len(lines))):
                t = lines[j].strip()
                if not t or t == "---":
                    continue
                if t.startswith("![]") or t.startswith("<DocImage"):
                    continue
                if t.startswith("**Previous:**") or t.startswith("**Next:**"):
                    continue
                if t.startswith("[") and "](" in t and "chapter" in t.lower():
                    continue
                desc = t.replace('"', "'")[:240]
                if len(t) > 240:
                    desc = desc.rsplit(" ", 1)[0] + "…"
                break
            break
    desc_yaml = desc.replace('"', '\\"')
    return title, f'"{desc_yaml}"'


def process_file(path: Path) -> None:
    stem = path.stem
    order = extract_order(stem)
    raw = path.read_text(encoding="utf-8")
    title, desc = extract_title_and_desc(raw)
    body = raw
    body = fix_links(body)
    body = img_to_docimage(body)
    body = convert_tables(body)
    body = convert_fenced_bash(body)
    out = FRONTMATTER.format(title=title, description=desc, order=order) + body
    out_path = path.with_suffix(".mdx")
    out_path.write_text(out, encoding="utf-8")
    path.unlink()
    print("Wrote", out_path.relative_to(ROOT))


def main() -> None:
    if not CONTENT_DIR.is_dir():
        print("Missing", CONTENT_DIR, file=sys.stderr)
        sys.exit(1)
    md_files = sorted(
        p for p in CONTENT_DIR.glob("*.md") if p.name.upper() != "README.MD"
    )
    for p in md_files:
        process_file(p)
    print("Done,", len(md_files), "files.")


if __name__ == "__main__":
    main()
