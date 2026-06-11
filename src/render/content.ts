import path from "path";
import type { FrontmatterValue } from "../types";

const TOOL_MAP: Readonly<Record<string, string>> = {
  askuserquestion: "question",
  bash: "bash",
  edit: "edit",
  glob: "glob",
  grep: "grep",
  list: "list",
  ls: "list",
  multiedit: "edit",
  notebookedit: "edit",
  notebookread: "read",
  patch: "patch",
  question: "question",
  read: "read",
  skill: "skill",
  task: "task",
  todoread: "todoread",
  todowrite: "todowrite",
  webfetch: "webfetch",
  websearch: "websearch",
  write: "write",
};

export function sanitizePathName(name: string): string {
  const sanitized = name
    .trim()
    .replace(/[\\/:]+/g, "-")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized.length > 0 ? sanitized : "unnamed";
}

export function deriveMarkdownName(filePath: string): string {
  return path.basename(filePath, ".md").replace(/\.agent$/, "");
}

export function parseToolNames(value: FrontmatterValue | undefined): readonly string[] {
  const rawTools = Array.isArray(value)
    ? value.filter((item) => typeof item === "string")
    : typeof value === "string"
      ? value.split(",")
      : [];

  return Array.from(new Set(rawTools.map(normalizeToolName).filter((tool) => tool.length > 0)));
}

export function transformContentForOpenCode(content: string): string {
  return flattenOpenCodeAgentReferences(rewriteClaudePathsForOpenCode(content));
}

function rewriteClaudePathsForOpenCode(content: string): string {
  return content
    .replace(/~\/\.claude\//g, "~/.config/opencode/")
    .replace(/\.claude\//g, ".opencode/");
}

function flattenOpenCodeAgentReferences(content: string): string {
  return content
    .replace(
      /(?<![a-z0-9:/-])[a-z][a-z0-9-]*:[a-z][a-z0-9-]*:([a-z][a-z0-9-]*)(?![a-z0-9:-])/g,
      "$1",
    )
    .replace(
      /(?<![a-z0-9:/-])[a-z][a-z0-9-]*:([a-z][a-z0-9-]*-(?:agent|analyst|architect|expert|finder|iterator|researcher|resolver|reviewer|specialist|writer))(?![a-z0-9:-])/g,
      "$1",
    )
    .replace(
      /(?<![a-z0-9:/-])[a-z][a-z0-9-]*:(ce-[a-z][a-z0-9-]*)(?![a-z0-9:-])/g,
      "$1",
    );
}

function normalizeToolName(raw: string): string {
  const name = raw.trim().split("(", 1)[0]?.replace(/[^A-Za-z]/g, "").toLowerCase() ?? "";
  return TOOL_MAP[name] ?? "";
}
