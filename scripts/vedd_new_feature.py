#!/usr/bin/env python3
"""
Create a new VEDD feature workspace from the repository templates.

Usage:
    python scripts/vedd_new_feature.py inventory
    python scripts/vedd_new_feature.py "character creation"
"""

from pathlib import Path
import argparse
import re
import shutil

try:
    import yaml
except ImportError:
    yaml = None


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def replace_title(path: Path, feature_title: str) -> None:
    text = path.read_text(encoding="utf-8")
    text = text.replace("<Feature>", feature_title)
    text = text.replace("<Feature name>", feature_title)
    path.write_text(text, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Create a VEDD feature workspace.")
    parser.add_argument("feature", help="Feature name")
    parser.add_argument(
        "--evidence-level",
        choices=["E0", "E1", "E2", "E3"],
        default="E2",
        help="Default evidence level (default: E2)",
    )
    args = parser.parse_args()

    repo = Path(__file__).resolve().parents[1]
    templates = repo / "templates"
    specs_root = repo / "docs" / "vedd" / "specs"

    slug = slugify(args.feature)
    if not slug:
        raise SystemExit("Feature name produced an empty slug.")

    feature_dir = specs_root / slug
    if feature_dir.exists():
        raise SystemExit(f"Feature already exists: {feature_dir}")

    feature_dir.mkdir(parents=True)

    mappings = {
        "spec.template.md": "spec.md",
        "visual-spec.template.md": "visual-spec.md",
        "examples.template.md": "examples.md",
        "acceptance.template.feature": "acceptance.feature",
        "qa.template.md": "qa.md",
        "evidence.template.md": "evidence.md",
    }

    for src_name, dst_name in mappings.items():
        src = templates / src_name
        dst = feature_dir / dst_name
        shutil.copy2(src, dst)
        replace_title(dst, args.feature)

    # Set requested evidence level in spec/evidence templates.
    for name in ["spec.md", "evidence.md"]:
        p = feature_dir / name
        text = p.read_text(encoding="utf-8")
        text = text.replace(
            "**Evidence level:** E0 / E1 / E2 / E3",
            f"**Evidence level:** {args.evidence_level}",
        )
        p.write_text(text, encoding="utf-8")

    state_path = repo / ".vedd" / "project-state.yaml"
    if state_path.exists():
        text = state_path.read_text(encoding="utf-8")
        text = re.sub(r"(?m)^  feature:.*$", f"  feature: {slug}", text)
        text = re.sub(r"(?m)^  slice:.*$", "  slice: specification", text)
        state_path.write_text(text, encoding="utf-8")

    print(f"Created VEDD feature: {feature_dir}")
    print()
    print("Recommended next steps:")
    print(f"1. Add visual references under docs/vedd/visuals/{slug}/")
    print(f"2. Fill {feature_dir.relative_to(repo) / 'visual-spec.md'}")
    print(f"3. Fill {feature_dir.relative_to(repo) / 'spec.md'}")
    print("4. Run a VEDD Challenger pass.")
    print("5. Resolve material questions.")
    print("6. Complete examples.md and acceptance.feature.")
    print("7. Only then start the first implementation slice.")


if __name__ == "__main__":
    main()
