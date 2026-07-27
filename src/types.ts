export type Target = "opencode" | "codex" | "claude";

export type Scope = "global" | "project";

export type SourceKind = "file" | "dir";

export type FrontmatterPrimitive = string | number | boolean | null;

export type FrontmatterValue =
  | FrontmatterPrimitive
  | readonly FrontmatterValue[]
  | { readonly [key: string]: FrontmatterValue };

export type FrontmatterRecord = Record<string, FrontmatterValue>;

export interface ParsedMarkdown {
  frontmatter: FrontmatterRecord;
  body: string;
}

export interface SourceSkill {
  name: string;
  sourceDir: string;
}

export interface RenderTargetOptions {
  root: string;
  target: Target;
}

export interface LinkTargetOptions {
  root: string;
  target: Target;
  scope?: Scope;
  homeDir?: string;
  projectRoot?: string;
}

export interface LinkMapping {
  name: string;
  source: string;
  target: string;
  kind: SourceKind;
}
