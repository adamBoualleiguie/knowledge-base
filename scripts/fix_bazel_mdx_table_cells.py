#!/usr/bin/env python3
"""Fix mangled ** + `code` sequences in converted Bazel series MDX tables."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIR = ROOT / "content/docs/Knowledge base/projects/Bazel integration"


def fix_content(s: str) -> str:
    # Collapse duplicate closing tags from earlier passes
    for _ in range(5):
        s = s.replace("</code></strong></strong>", "</code></strong>")
        s = s.replace("</strong></strong>", "</strong>")
    # Join broken "</code><strong> … </strong><code>" (glue between bold-code spans)
    patterns = [
        (r"</code><strong>\s*\+\s*</strong><code>", "</code></strong> + <strong><code>"),
        (r"</code><strong>\s*,\s*</strong><code>", "</code></strong>, <strong><code>"),
        (r"</code><strong>\s*;\s*</strong><code>", "</code></strong>; <strong><code>"),
        (r"</code><strong>\s*/\s*</strong><code>", "</code></strong> / <strong><code>"),
        (r"</code><strong>\s+and\s+</strong><code>", "</code></strong> and <strong><code>"),
        (r"</code><strong>\s+on\s+</strong><code>", "</code></strong> on <strong><code>"),
        (r"</code><strong>\s+for\s+</strong><code>", "</code></strong> for <strong><code>"),
        (r"</code><strong>\s+matches\s+</strong><code>", "</code></strong> matches <strong><code>"),
        (r"</code><strong>\s+vs\s+</strong><code>", "</code></strong> vs <strong><code>"),
        (r"</code><strong>\s+is\s+</strong><code>", "</code></strong> is <strong><code>"),
        (r"</code><strong>\s+still\s+</strong><code>", "</code></strong> still <strong><code>"),
        (r"</code><strong>\s+unless\s+</strong><code>", "</code></strong> unless <strong><code>"),
        (r"</code><strong>\s+path\s+</strong><code>", "</code></strong> path <strong><code>"),
        (r"</code><strong>\s+list,\s*</strong><code>", "</code></strong> list, <strong><code>"),
        (r"</code><strong>\s+tests,\s*</strong><code>", "</code></strong> tests, <strong><code>"),
        (r"</code><strong>\s*\(\s*</strong><code>", "</code></strong> (<strong><code>"),
        (r"</code><strong>\s+installs\s+</strong><code>", "</code></strong> installs <strong><code>"),
        (r"</code><strong>\s+plus\s+</strong><code>", "</code></strong> plus <strong><code>"),
        (r"</code><strong>\s+after\s+</strong><code>", "</code></strong> after <strong><code>"),
        (r"</code><strong>\s+under\s+</strong><code>", "</code></strong> under <strong><code>"),
        (r"</code><strong>\s+over\s+</strong><code>", "</code></strong> over <strong><code>"),
        (r"</code><strong>\s+loop\s+</strong><code>", "</code></strong> loop <strong><code>"),
        (r"</code><strong>\s+name\s+</strong><code>", "</code></strong> name <strong><code>"),
        (r"</code><strong>\s+string\s+</strong><code>", "</code></strong> string <strong><code>"),
        (r"</code><strong>\s+present\.\s*</strong><code>", "</code></strong> present. <strong><code>"),
        (r"</code><strong>\s+</strong><strong>", "</code></strong> <strong>"),
        (r"</strong><strong>", "</strong>"),
        (r"<strong>\s*,\s*</strong><code>", ", <strong><code>"),
        (r"<strong>\s*</strong><code>oci_push</code><strong>,\s*</strong>Make<strong>", "<strong><code>oci_push</code></strong>, <strong>Make</strong>"),
        (r"</code><strong>\s*\(\s*</strong><code>", "</code></strong> (<strong><code>"),
        (r"</code><strong>\s+etc\.\s*\(\s*</strong><code>", "</code></strong> etc. (<strong><code>"),
        (r"</code><strong>\s+commit\s+</strong><code>", "</code></strong> commit <strong><code>"),
        (r"</code><strong>\s+installed\s+</strong><code>", "</code></strong> installed <strong><code>"),
        (r"</code><strong>\s+behavior\.\s*</strong><code>", "</code></strong> behavior. <strong><code>"),
        (r"</code><strong>\s+paths\s+differ\)\.\s*</strong><code>", "</code></strong> paths differ). <strong><code>"),
        (r"</code><strong>\s+re-run\s+</strong><code>", "</code></strong> re-run <strong><code>"),
        (r"</code><strong>\s+linked\s+via\s+</strong><code>", "</code></strong> linked via <strong><code>"),
        (r"<strong>\s+</strong><code>mtree_spec</code>", " <strong><code>mtree_spec</code>"),
        (r"</code><strong>\s+\(Go\s+", "</code></strong> (Go "),
        (r"</code><strong>\s+\(payment\)", "</code></strong> (payment)"),
        (r"<code>pkg_tar</code><strong>\s+</strong><code>", "<code>pkg_tar</code></strong>, <strong><code>"),
    ]
    for _ in range(30):
        old = s
        for pat, rep in patterns:
            s = re.sub(pat, rep, s)
        if s == old:
            break

    # Leading **<code>... without closing **</code>
    s = re.sub(r"\*\*<code>([^<]+)</code>\*\*", r"<strong><code>\1</code></strong>", s)
    # Trailing </code>** before paren or end
    s = re.sub(r"</code>\*\*\)", r"</code></strong>)", s)
    s = re.sub(r"</code>\*\*\. ", r"</code></strong>. ", s)
    s = re.sub(r"</code>\*\*</td>", r"</code></strong></td>", s)
    s = re.sub(r"</code>\*\* story", r"</code></strong> story", s)

    # Remaining **<code>x</code> (no trailing **)
    s = re.sub(r"\*\*<code>([^<]+)</code>(?!\*\*)", r"<strong><code>\1</code></strong>", s)

    s = re.sub(r"optional \*\*<code>", r"optional <strong><code>", s)

    # Trailing ** after </code> in tables
    s = re.sub(r"</code>\*\*([.;,)\s])", r"</code></strong>\1", s)
    s = re.sub(r"</code>\*\*</td>", r"</code></strong></td>", s)
    s = re.sub(r"</code>\*\* macros", r"</code></strong> macros", s)
    s = re.sub(r"GHCR\*\*", r"GHCR</strong>", s)
    s = re.sub(r"gRPC\*\*", r"gRPC</strong>", s)
    s = re.sub(r"codegen\*\*", r"codegen</strong>", s)
    s = re.sub(r"unprivileged\*\*", r"unprivileged</strong>", s)
    s = re.sub(r"runner\.\s*</strong><code>", r"runner. <strong><code>", s)

    for _ in range(8):
        s = s.replace("</code></strong></strong>", "</code></strong>")

    return s


def main() -> None:
    for path in sorted(DIR.glob("*.mdx")):
        text = path.read_text(encoding="utf-8")
        fixed = fix_content(text)
        if fixed != text:
            path.write_text(fixed, encoding="utf-8")
            print("fixed", path.name)


if __name__ == "__main__":
    main()
