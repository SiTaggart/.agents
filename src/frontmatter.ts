import type { FrontmatterRecord, FrontmatterValue, ParsedMarkdown } from "./types";

interface PendingBlock {
  key: string;
  lines: readonly string[];
}

interface ParseState {
  data: FrontmatterRecord;
  block?: PendingBlock;
  listKey?: string;
}

const FRONTMATTER_DELIMITER = "---";
const KEY_VALUE_RE = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/;

export function parseFrontmatter(raw: string): ParsedMarkdown {
  const lines = raw.split(/\r?\n/);
  const firstLine = lines[0]?.trim();

  if (firstLine !== FRONTMATTER_DELIMITER) {
    return { frontmatter: {}, body: raw };
  }

  const endOffset = lines.slice(1).findIndex((line) => line.trim() === FRONTMATTER_DELIMITER);
  if (endOffset < 0) {
    return { frontmatter: {}, body: raw };
  }

  const endIndex = endOffset + 1;
  const yamlLines = lines.slice(1, endIndex);
  const body = lines.slice(endIndex + 1).join("\n");

  return {
    frontmatter: parseYamlSubset(yamlLines),
    body,
  };
}

export function readStringField(data: FrontmatterRecord, key: string): string | undefined {
  const value = data[key];
  return typeof value === "string" ? value : undefined;
}

function parseYamlSubset(lines: readonly string[]): FrontmatterRecord {
  return finishPending(
    lines.reduce<ParseState>((state, line) => parseYamlLine(state, line), { data: {} }),
  ).data;
}

function parseYamlLine(state: ParseState, line: string): ParseState {
  const keyMatch = line.match(KEY_VALUE_RE);
  if (state.block && (isIndented(line) || !keyMatch)) {
    return {
      ...state,
      block: {
        key: state.block.key,
        lines: [...state.block.lines, stripYamlIndent(line)],
      },
    };
  }

  if (state.listKey && line.trimStart().startsWith("- ")) {
    return appendListItem(state, line);
  }

  if (!keyMatch) {
    return state;
  }

  const [, key, rawValue = ""] = keyMatch;
  if (!key) {
    return state;
  }

  return startYamlKey(finishPending(state), key, rawValue);
}

function startYamlKey(state: ParseState, key: string, rawValue: string): ParseState {
  const value = rawValue.trim();
  if (isBlockScalar(value)) {
    return { data: state.data, block: { key, lines: [] } };
  }

  if (value.length === 0) {
    return { data: { ...state.data, [key]: [] }, listKey: key };
  }

  return {
    data: { ...state.data, [key]: parseScalar(value) },
  };
}

function appendListItem(state: ParseState, line: string): ParseState {
  const key = state.listKey;
  if (!key) {
    return state;
  }

  const current = state.data[key];
  const list = Array.isArray(current) ? current : [];
  const item = line.trimStart().slice(2).trim();

  return {
    ...state,
    data: {
      ...state.data,
      [key]: [...list, parseScalar(item)],
    },
  };
}

function finishPending(state: ParseState): ParseState {
  if (!state.block) {
    return { data: state.data };
  }

  return {
    data: {
      ...state.data,
      [state.block.key]: state.block.lines.join("\n").trimEnd(),
    },
  };
}

function parseScalar(value: string): FrontmatterValue {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (isDoubleQuoted(trimmed)) return unquoteDouble(trimmed);
  if (isSingleQuoted(trimmed)) return trimmed.slice(1, -1).replace(/''/g, "'");
  if (isInlineArray(trimmed)) return parseInlineArray(trimmed);

  const numberValue = Number(trimmed);
  return trimmed.length > 0 && Number.isFinite(numberValue) && String(numberValue) === trimmed
    ? numberValue
    : trimmed;
}

function parseInlineArray(value: string): readonly FrontmatterValue[] {
  const inner = value.slice(1, -1).trim();
  return inner.length === 0
    ? []
    : inner.split(",").map((item) => parseScalar(item.trim()));
}

function isBlockScalar(value: string): boolean {
  return value === "|" || value === "|-" || value === "|+" || value === ">" || value === ">-" || value === ">+";
}

function isIndented(line: string): boolean {
  return line.startsWith(" ") || line.length === 0;
}

function stripYamlIndent(line: string): string {
  return line.startsWith("  ") ? line.slice(2) : line;
}

function isDoubleQuoted(value: string): boolean {
  return value.length >= 2 && value.startsWith("\"") && value.endsWith("\"");
}

function isSingleQuoted(value: string): boolean {
  return value.length >= 2 && value.startsWith("'") && value.endsWith("'");
}

function isInlineArray(value: string): boolean {
  return value.startsWith("[") && value.endsWith("]");
}

function unquoteDouble(value: string): string {
  return value
    .slice(1, -1)
    .replace(/\\"/g, "\"")
    .replace(/\\\\/g, "\\");
}
