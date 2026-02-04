"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import ToolShell from "./ToolShell";
import Base64Tool from "./tools/Base64Tool";
import CommandLibraryTool from "./tools/CommandLibraryTool";
import EnvDiffTool from "./tools/EnvDiffTool";
import HashTool from "./tools/HashTool";
import JsonTool from "./tools/JsonTool";
import NotesTool from "./tools/NotesTool";
import TimestampTool from "./tools/TimestampTool";
import { readLocal, writeLocal } from "../lib/storage";
import { buttonGhost, buttonSecondary } from "../lib/styles";

type ToolEntry = {
  id: string;
  title: string;
  description: string;
  component: ReactNode;
  tips: string[];
  meta: string[];
};

const tools: ToolEntry[] = [
  {
    id: "notes",
    title: "Scratchpad",
    description:
      "Keep short-term notes, TODOs, and snippets with local autosave.",
    component: <NotesTool />,
    tips: [
      "Drop quick updates during standups or incident notes.",
      "Local autosave runs while you type, no manual syncing.",
    ],
    meta: ["Autosave", "Local only"],
  },
  {
    id: "commands",
    title: "Command Library",
    description:
      "Capture and reuse your most common scripts with tags and copy actions.",
    component: <CommandLibraryTool />,
    tips: [
      "Keep destructive commands tagged for faster recall.",
      "Use tags like db, infra, or cleanup to filter quickly.",
    ],
    meta: ["Persistent", "Taggable"],
  },
  {
    id: "json",
    title: "JSON Toolkit",
    description: "Format, minify, and validate JSON with clear feedback.",
    component: <JsonTool />,
    tips: [
      "Paste raw API responses to format them quickly.",
      "Use minify before sending payloads to size-limited tools.",
    ],
    meta: ["Formatter", "Validator"],
  },
  {
    id: "base64",
    title: "Base64 Utility",
    description: "Encode and decode text safely without leaving localhost.",
    component: <Base64Tool />,
    tips: [
      "Decode tokens or payloads from logs without extra scripts.",
      "Keep input/output mono-spaced for easy copying.",
    ],
    meta: ["Encoder", "Decoder"],
  },
  {
    id: "hash",
    title: "Hash Generator",
    description: "Generate SHA hashes for signatures, checks, and fixtures.",
    component: <HashTool />,
    tips: [
      "Use SHA-256 for modern integrity checks.",
      "Pair with the scratchpad to hold generated values.",
    ],
    meta: ["SHA-1", "SHA-256", "SHA-512"],
  },
  {
    id: "timestamp",
    title: "Timestamp Inspector",
    description:
      "Convert epochs and ISO strings with timezone-aware formatting.",
    component: <TimestampTool />,
    tips: [
      "Switch timezone modes to mirror production logs.",
      "Use the Now button to anchor quick conversions.",
    ],
    meta: ["Epoch", "ISO 8601"],
  },
  {
    id: "envdiff",
    title: "Env Diff",
    description:
      "Compare two environment files and spot added, removed, or changed keys.",
    component: <EnvDiffTool />,
    tips: [
      "Paste .env.example vs .env.local to track drift.",
      "Copy the diff summary into PR notes.",
    ],
    meta: ["Added", "Removed", "Changed"],
  },
];

const TOOL_STORAGE = "devdock.activeTool.v1";
const PANEL_STORAGE = "devdock.panel.right.v1";

export default function Workspace() {
  const [activeToolId, setActiveToolId] = useState(tools[0].id);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  useEffect(() => {
    const storedTool = readLocal<string>(TOOL_STORAGE, tools[0].id);
    if (tools.some((tool) => tool.id === storedTool)) {
      setActiveToolId(storedTool);
    }
    setIsPanelOpen(readLocal<boolean>(PANEL_STORAGE, true));
  }, []);

  useEffect(() => {
    writeLocal(TOOL_STORAGE, activeToolId);
  }, [activeToolId]);

  useEffect(() => {
    writeLocal(PANEL_STORAGE, isPanelOpen);
  }, [isPanelOpen]);

  const activeTool = useMemo(
    () => tools.find((tool) => tool.id === activeToolId) ?? tools[0],
    [activeToolId]
  );

  const gridTemplate = isPanelOpen
    ? "lg:grid-cols-[260px_minmax(0,1fr)_260px]"
    : "lg:grid-cols-[260px_minmax(0,1fr)_56px]";

  return (
    <div
      className={`mt-8 grid gap-4 ${gridTemplate} lg:min-h-[560px] lg:h-[calc(100vh-230px)] lg:items-stretch`}
    >
      <nav className="lg:sticky lg:top-6 lg:self-start lg:h-full">
        <div className="card-surface flex h-full flex-col p-4">
          <div>
            <p className="text-xs font-semibold text-muted">Tools</p>
            <ul className="mt-3 space-y-2 text-sm">
              {tools.map((tool) => {
                const isActive = tool.id === activeToolId;
                return (
                  <li key={tool.id}>
                    <button
                      type="button"
                      onClick={() => setActiveToolId(tool.id)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 ${isActive
                        ? "border-accent/40 bg-accent-soft text-ink"
                        : "border-transparent text-ink hover:border-line hover:bg-surface-2"
                        }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span>{tool.title}</span>
                      <span className="text-xs text-muted">→</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-4 border-t border-line pt-4 text-xs text-muted">
            <p className="text-sm font-semibold text-ink">Workspace state</p>
            <p className="mt-2 leading-5">
              devdock remembers your open tool, inputs, and panel layout locally.
            </p>
          </div>
        </div>
      </nav>

      <main className="min-h-[520px] lg:h-full">
        <ToolShell
          key={activeTool.id}
          id={activeTool.id}
          title={activeTool.title}
          description={activeTool.description}
          className="h-full animate-fade"
          bodyClassName="flex-1 overflow-auto scrollbar-thin"
        >
          {activeTool.component}
        </ToolShell>
      </main>

      <aside className="h-full">
        {isPanelOpen ? (
          <div className="card-surface flex h-full flex-col gap-4 bg-surface-2 p-4 text-sm text-muted">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-muted">Context</p>
                <p className="mt-2 text-base font-semibold text-ink">
                  {activeTool.title}
                </p>
              </div>
              <button
                type="button"
                className={buttonGhost}
                onClick={() => setIsPanelOpen(false)}
              >
                Collapse
              </button>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted">Highlights</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                {activeTool.meta.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-line bg-surface px-3 py-1"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted">Tips</p>
              <ul className="space-y-2 text-sm text-muted">
                {activeTool.tips.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="text-ink">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto rounded-xl border border-line bg-surface p-3 text-xs text-muted">
              Everything stays offline. Clear your browser storage to reset the
              workspace.
            </div>
          </div>
        ) : (
          <div className="card-surface flex h-full items-start justify-center bg-surface-2 p-2">
            <button
              type="button"
              className={`${buttonSecondary} h-10 w-10 px-0`}
              aria-label="Expand context panel"
              onClick={() => setIsPanelOpen(true)}
            >
              →
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
