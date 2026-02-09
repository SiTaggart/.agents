#!/usr/bin/env python3
"""
Generate a summary of git commits and GitHub activity for the previous workday.
Handles weekends: if today is Monday, looks at Friday.
"""

import subprocess
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path


def get_target_date() -> tuple[datetime, datetime]:
    """
    Return (start, end) of the previous workday.
    Monday → Friday. Otherwise → yesterday.
    """
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    weekday = today.weekday()  # 0=Monday
    
    if weekday == 0:  # Monday
        days_back = 3  # Friday
    else:
        days_back = 1
    
    target = today - timedelta(days=days_back)
    start = target.replace(hour=0, minute=0, second=0, microsecond=0)
    end = target.replace(hour=23, minute=59, second=59, microsecond=999999)
    
    return start, end


def run_cmd(cmd: list[str], cwd: str | None = None) -> tuple[int, str, str]:
    """Run command, return (returncode, stdout, stderr)."""
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        cwd=cwd
    )
    return result.returncode, result.stdout.strip(), result.stderr.strip()


def get_git_user_email() -> str | None:
    """Get the current git user's email from global config."""
    code, stdout, _ = run_cmd(["git", "config", "user.email"])
    return stdout if code == 0 and stdout else None


def find_git_repos(search_paths: list[str], max_depth: int = 3) -> list[Path]:
    """Find all git repositories under search paths up to max_depth levels."""
    repos = []
    seen = set()

    def search_dir(path: Path, depth: int):
        if depth > max_depth or not path.exists() or not path.is_dir():
            return

        # Resolve to avoid duplicates from symlinks
        resolved = path.resolve()
        if resolved in seen:
            return
        seen.add(resolved)

        # Check if this path is a repo
        if (path / ".git").exists():
            repos.append(path)
            return  # Don't search inside git repos

        # Search subdirectories
        try:
            for subdir in path.iterdir():
                if subdir.is_dir() and not subdir.name.startswith('.'):
                    search_dir(subdir, depth + 1)
        except PermissionError:
            pass

    for search_path in search_paths:
        path = Path(search_path).expanduser()
        search_dir(path, 0)

    return repos


def get_git_commits(
    repo_path: Path,
    start: datetime,
    end: datetime,
    author: str | None = None,
    include_diffs: bool = False
) -> list[dict]:
    """Get commits from all branches within date range."""
    commits = []

    # Format dates for git
    after = start.strftime("%Y-%m-%d 00:00:00")
    before = end.strftime("%Y-%m-%d 23:59:59")

    # Build command
    cmd = [
        "git", "log",
        "--all",  # All branches
        "--after", after,
        "--before", before,
        "--format=%H|%an|%ae|%s|%aI|%D",  # hash|author|email|subject|date|refs
    ]

    if author:
        cmd.extend(["--author", author])

    code, stdout, stderr = run_cmd(cmd, cwd=str(repo_path))

    if code != 0 or not stdout:
        return commits

    for line in stdout.split("\n"):
        if not line.strip():
            continue
        parts = line.split("|", 5)
        if len(parts) >= 5:
            full_hash = parts[0]
            commit = {
                "hash": full_hash[:8],
                "full_hash": full_hash,
                "author": parts[1],
                "email": parts[2],
                "subject": parts[3],
                "date": parts[4],
                "refs": parts[5] if len(parts) > 5 else "",
                "repo": repo_path.name
            }

            if include_diffs:
                commit["diff"] = get_commit_diff(repo_path, full_hash)

            commits.append(commit)

    return commits


def get_commit_diff(repo_path: Path, commit_hash: str, max_lines: int = 100) -> str:
    """Get the diff for a specific commit, truncated to max_lines."""
    cmd = [
        "git", "show",
        commit_hash,
        "--stat",
        "--patch",
        "--no-color",
    ]

    code, stdout, _ = run_cmd(cmd, cwd=str(repo_path))

    if code != 0 or not stdout:
        return ""

    lines = stdout.split("\n")
    if len(lines) > max_lines:
        return "\n".join(lines[:max_lines]) + f"\n... (truncated, {len(lines) - max_lines} more lines)"

    return stdout


def get_branch_activity(repo_path: Path, start: datetime, end: datetime, author: str | None = None) -> list[str]:
    """Get branches that had commits within date range."""
    branches = set()

    after = start.strftime("%Y-%m-%d 00:00:00")
    before = end.strftime("%Y-%m-%d 23:59:59")

    cmd = [
        "git", "log",
        "--all",
        "--after", after,
        "--before", before,
        "--format=%D",
    ]

    if author:
        cmd.extend(["--author", author])

    code, stdout, _ = run_cmd(cmd, cwd=str(repo_path))

    if code != 0 or not stdout:
        return []

    for line in stdout.split("\n"):
        if not line.strip():
            continue
        # Parse refs like "HEAD -> main, origin/main, feature/foo"
        for ref in line.split(","):
            ref = ref.strip()
            if ref.startswith("HEAD ->"):
                ref = ref.replace("HEAD ->", "").strip()
            if ref and not ref.startswith("tag:"):
                # Strip origin/ prefix for cleaner display
                if "/" in ref and ref.split("/")[0] in ("origin", "upstream"):
                    ref = "/".join(ref.split("/")[1:])
                branches.add(ref)

    return sorted(branches)


def get_github_activity(start: datetime, end: datetime) -> dict:
    """Get GitHub activity via gh CLI."""
    activity = {
        "issues_created": [],
        "issues_commented": [],
        "prs_created": [],
        "prs_merged": [],
        "prs_reviewed": [],
        "prs_review_requested": [],
        "pr_comments": [],
        "error": None
    }
    
    # Check if gh is available
    code, _, _ = run_cmd(["which", "gh"])
    if code != 0:
        activity["error"] = "gh CLI not installed"
        return activity
    
    # Check if authenticated
    code, _, _ = run_cmd(["gh", "auth", "status"])
    if code != 0:
        activity["error"] = "gh CLI not authenticated. Run: gh auth login"
        return activity
    
    date_str = start.strftime("%Y-%m-%d")
    
    # Issues created by me
    code, stdout, _ = run_cmd([
        "gh", "search", "issues",
        "--author", "@me",
        "--created", date_str,
        "--json", "title,repository,number,url,state"
    ])
    if code == 0 and stdout:
        try:
            activity["issues_created"] = json.loads(stdout)
        except json.JSONDecodeError:
            pass
    
    # Issues I commented on
    code, stdout, _ = run_cmd([
        "gh", "search", "issues",
        "--commenter", "@me",
        "--updated", date_str,
        "--json", "title,repository,number,url,state"
    ])
    if code == 0 and stdout:
        try:
            activity["issues_commented"] = json.loads(stdout)
        except json.JSONDecodeError:
            pass
    
    # PRs created by me
    code, stdout, _ = run_cmd([
        "gh", "search", "prs",
        "--author", "@me",
        "--created", date_str,
        "--json", "title,repository,number,url,state"
    ])
    if code == 0 and stdout:
        try:
            activity["prs_created"] = json.loads(stdout)
        except json.JSONDecodeError:
            pass
    
    # PRs merged by me
    code, stdout, _ = run_cmd([
        "gh", "search", "prs",
        "--author", "@me",
        "--merged", date_str,
        "--json", "title,repository,number,url,state"
    ])
    if code == 0 and stdout:
        try:
            activity["prs_merged"] = json.loads(stdout)
        except json.JSONDecodeError:
            pass
    
    # PRs I reviewed
    code, stdout, _ = run_cmd([
        "gh", "search", "prs",
        "--reviewed-by", "@me",
        "--updated", date_str,
        "--json", "title,repository,number,url,state"
    ])
    if code == 0 and stdout:
        try:
            activity["prs_reviewed"] = json.loads(stdout)
        except json.JSONDecodeError:
            pass

    # PRs where I was requested as reviewer (and updated on target date)
    code, stdout, _ = run_cmd([
        "gh", "search", "prs",
        "--review-requested", "@me",
        "--updated", date_str,
        "--json", "title,repository,number,url,state"
    ])
    if code == 0 and stdout:
        try:
            activity["prs_review_requested"] = json.loads(stdout)
        except json.JSONDecodeError:
            pass

    # PR comments I made - use gh api to search
    code, stdout, _ = run_cmd([
        "gh", "api", "search/issues",
        "-X", "GET",
        "-f", f"q=commenter:@me updated:{date_str} type:pr",
        "--jq", ".items | map({title, number, url: .html_url, repository: {nameWithOwner: .repository_url | split(\"/\") | .[-2:] | join(\"/\")}})"
    ])
    if code == 0 and stdout:
        try:
            activity["pr_comments"] = json.loads(stdout)
        except json.JSONDecodeError:
            pass

    return activity


def format_output(
    target_date: datetime,
    commits: list[dict],
    branches: dict[str, list[str]],
    github: dict,
    output_format: str = "markdown"
) -> str:
    """Format the summary output."""

    date_str = target_date.strftime("%A, %B %d, %Y")

    if output_format == "json":
        return json.dumps({
            "date": target_date.isoformat(),
            "commits": commits,
            "branches": branches,
            "github": github
        }, indent=2)
    
    # Markdown format
    lines = [f"# Work Summary: {date_str}", ""]
    
    # Branches worked on
    if branches:
        lines.append("## Branches Worked On")
        lines.append("")
        for repo, branch_list in branches.items():
            if branch_list:
                lines.append(f"### {repo}")
                lines.append("")
                for branch in branch_list:
                    lines.append(f"- `{branch}`")
                lines.append("")

    # Git commits
    lines.append("## Git Commits")
    lines.append("")

    if commits:
        # Group by repo
        by_repo: dict[str, list[dict]] = {}
        for c in commits:
            repo = c["repo"]
            if repo not in by_repo:
                by_repo[repo] = []
            by_repo[repo].append(c)

        for repo, repo_commits in by_repo.items():
            lines.append(f"### {repo}")
            lines.append("")
            for c in repo_commits:
                refs = f" ({c['refs']})" if c['refs'] else ""
                lines.append(f"- `{c['hash']}` {c['subject']}{refs}")
            lines.append("")
    else:
        lines.append("No commits found.")
        lines.append("")
    
    # GitHub activity
    lines.append("## GitHub Activity")
    lines.append("")
    
    if github.get("error"):
        lines.append(f"⚠️ {github['error']}")
        lines.append("")
    else:
        sections = [
            ("Issues Created", "issues_created"),
            ("Issues Commented", "issues_commented"),
            ("PRs Created", "prs_created"),
            ("PRs Merged", "prs_merged"),
            ("PRs Reviewed", "prs_reviewed"),
            ("Review Requests Received", "prs_review_requested"),
            ("PR Comments", "pr_comments"),
        ]
        
        has_activity = False
        for title, key in sections:
            items = github.get(key, [])
            if items:
                has_activity = True
                lines.append(f"### {title}")
                lines.append("")
                for item in items:
                    repo = item.get("repository", {}).get("nameWithOwner", "unknown")
                    lines.append(f"- [{repo}#{item['number']}]({item['url']}): {item['title']}")
                lines.append("")
        
        if not has_activity:
            lines.append("No GitHub activity found.")
            lines.append("")
    
    return "\n".join(lines)


def main():
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Generate work summary for previous workday"
    )
    parser.add_argument(
        "--paths",
        nargs="+",
        default=["~/Projects", "~/Code", "~/repos", "~/dev", "."],
        help="Paths to search for git repos (default: ~/Projects ~/Code ~/repos ~/dev .)"
    )
    parser.add_argument(
        "--author",
        help="Filter commits by author (email or name substring). Defaults to current git user."
    )
    parser.add_argument(
        "--all-authors",
        action="store_true",
        help="Show commits from all authors, not just your own"
    )
    parser.add_argument(
        "--format",
        choices=["markdown", "json"],
        default="markdown",
        help="Output format (default: markdown)"
    )
    parser.add_argument(
        "--skip-github",
        action="store_true",
        help="Skip GitHub activity lookup"
    )
    parser.add_argument(
        "--depth",
        type=int,
        default=3,
        help="Maximum directory depth to search for git repos (default: 3)"
    )

    args = parser.parse_args()

    start, end = get_target_date()

    # Determine author filter: explicit --author, or default to git user unless --all-authors
    author_filter = args.author
    if not author_filter and not args.all_authors:
        author_filter = get_git_user_email()

    # Find repos and get commits
    repos = find_git_repos(args.paths, max_depth=args.depth)
    all_commits = []
    all_branches: dict[str, list[str]] = {}

    # Include diffs when outputting JSON (for LLM summarization)
    include_diffs = args.format == "json"

    for repo in repos:
        commits = get_git_commits(repo, start, end, author_filter, include_diffs=include_diffs)
        all_commits.extend(commits)

        branches = get_branch_activity(repo, start, end, author_filter)
        if branches:
            all_branches[repo.name] = branches

    # Sort by date
    all_commits.sort(key=lambda x: x["date"], reverse=True)

    # Get GitHub activity
    if args.skip_github:
        github = {"error": "Skipped"}
    else:
        github = get_github_activity(start, end)

    # Output
    output = format_output(start, all_commits, all_branches, github, args.format)
    print(output)


if __name__ == "__main__":
    main()
