export function sanitizePathName(name: string): string {
  const sanitized = name
    .trim()
    .replace(/[\\/:]+/g, "-")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized.length > 0 ? sanitized : "unnamed";
}

export function transformContentForOpenCode(content: string): string {
  return flattenCeSkillNamespaces(rewriteClaudePathsForOpenCode(content));
}

function rewriteClaudePathsForOpenCode(content: string): string {
  return content
    .replace(/~\/\.claude\//g, "~/.config/opencode/")
    .replace(/\.claude\//g, ".opencode/");
}

function flattenCeSkillNamespaces(content: string): string {
  return content.replace(
    /(?<![a-z0-9:/-])[a-z][a-z0-9-]*:(ce-[a-z][a-z0-9-]*)(?![a-z0-9:-])/g,
    "$1",
  );
}
