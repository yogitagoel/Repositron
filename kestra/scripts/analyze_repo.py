import os
import json

ROOT_DIR = "repo"  # Kestra will clone into this directory

def detect_stack(root_files, all_files):
    stack = []

    if "package.json" in root_files:
        stack.append("node")
    if "next.config.js" in root_files or any("next.config." in f for f in root_files):
        stack.append("nextjs")
    if "requirements.txt" in root_files or "pyproject.toml" in root_files:
        stack.append("python")
    if "manage.py" in all_files:
        stack.append("django")
    if any(f.endswith(".ipynb") for f in all_files):
        stack.append("notebooks")

    return list(sorted(set(stack)))


def main():
    summary = {
        "root_folders": [],
        "root_files": [],
        "all_files": [],
        "has_dockerfile": False,
        "has_github_actions": False,
        "stack": [],
    }

    for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
        rel = os.path.relpath(dirpath, ROOT_DIR)

        # root level
        if rel == ".":
            summary["root_folders"] = dirnames
            summary["root_files"] = filenames

        # collect all files with relative paths
        for f in filenames:
            rel_path = os.path.join(rel, f) if rel != "." else f
            summary["all_files"].append(rel_path)
            if f.lower() == "dockerfile":
                summary["has_dockerfile"] = True
            if rel.startswith(".github/workflows"):
                summary["has_github_actions"] = True

    summary["stack"] = detect_stack(
        summary["root_files"],
        summary["all_files"],
    )

    # write JSON output for Kestra
    os.makedirs("out", exist_ok=True)
    with open("out/repo_summary.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("Wrote out/repo_summary.json")


if __name__ == "__main__":
    main()
