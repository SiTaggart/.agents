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
