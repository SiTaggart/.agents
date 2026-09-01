export const PLUGIN_ID = "agent-kit" as const;

export type HarnessId = "cursor" | "claude" | "codex" | "grok";

export type ManifestKind = "cursor-plugin" | "claude-plugin" | "codex-plugin";

export interface HarnessAdapter {
  readonly id: HarnessId;
  readonly kind: ManifestKind;
  readonly manifestPath: string;
  readonly marketplacePath: string;
  readonly skillsPath: string;
  readonly hooksPath: string;
}

export interface PluginBundle {
  readonly id: typeof PLUGIN_ID;
  readonly skillsDir: "skills/";
  readonly hooksDir: "hooks/";
  readonly manifests: {
    readonly cursor: HarnessAdapter;
    readonly claude: HarnessAdapter;
    readonly codex: HarnessAdapter;
    readonly grok: HarnessAdapter;
  };
  readonly hookFiles: {
    readonly claudeCodex: string;
    readonly cursor: string;
    readonly script: string;
  };
  readonly retiredPaths: readonly string[];
}

const CURSOR_ADAPTER: HarnessAdapter = {
  id: "cursor",
  kind: "cursor-plugin",
  manifestPath: ".cursor-plugin/plugin.json",
  marketplacePath: ".cursor-plugin/marketplace.json",
  skillsPath: "skills/",
  hooksPath: "hooks/cursor.json",
};

const CLAUDE_ADAPTER: HarnessAdapter = {
  id: "claude",
  kind: "claude-plugin",
  manifestPath: ".claude-plugin/plugin.json",
  marketplacePath: ".claude-plugin/marketplace.json",
  skillsPath: "skills/",
  hooksPath: "hooks/hooks.json",
};

const CODEX_ADAPTER: HarnessAdapter = {
  id: "codex",
  kind: "codex-plugin",
  manifestPath: ".codex-plugin/plugin.json",
  marketplacePath: ".agents/plugins/marketplace.json",
  skillsPath: "skills/",
  hooksPath: "hooks/hooks.json",
};

export const PLUGIN_BUNDLE: PluginBundle = {
  id: PLUGIN_ID,
  skillsDir: "skills/",
  hooksDir: "hooks/",
  manifests: {
    cursor: CURSOR_ADAPTER,
    claude: CLAUDE_ADAPTER,
    codex: CODEX_ADAPTER,
    grok: { ...CURSOR_ADAPTER, id: "grok" },
  },
  hookFiles: {
    claudeCodex: "hooks/hooks.json",
    cursor: "hooks/cursor.json",
    script: "hooks/scripts/prevent-main-commit.sh",
  },
  retiredPaths: ["plugins/marketplace.json"],
};
