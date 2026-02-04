"use client";

import { useEffect, useMemo, useState } from "react";
import CopyButton from "../CopyButton";
import { readLocal, writeLocal } from "../../lib/storage";
import { buttonPrimary, buttonSecondary, textareaBase } from "../../lib/styles";

type EnvDiffState = {
  left: string;
  right: string;
  output: string;
};

const STORAGE_KEY = "devdock.envdiff.v1";

const parseEnv = (value: string) => {
  const entries: Record<string, string> = {};
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .forEach((line) => {
      const normalized = line.startsWith("export ")
        ? line.replace(/^export\s+/, "")
        : line;
      const index = normalized.indexOf("=");
      if (index === -1) {
        return;
      }
      const key = normalized.slice(0, index).trim();
      const rawValue = normalized.slice(index + 1).trim();
      if (!key) {
        return;
      }
      entries[key] = rawValue.replace(/^["']|["']$/g, "");
    });
  return entries;
};

export default function EnvDiffTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    const stored = readLocal<EnvDiffState>(STORAGE_KEY, {
      left: "",
      right: "",
      output: "",
    });
    setLeft(stored.left);
    setRight(stored.right);
    setOutput(stored.output);
  }, []);

  useEffect(() => {
    writeLocal(STORAGE_KEY, { left, right, output });
  }, [left, right, output]);

  const summary = useMemo(() => {
    if (!output) {
      return null;
    }
    const added = (output.match(/^\+ /gm) ?? []).length;
    const removed = (output.match(/^\- /gm) ?? []).length;
    const changed = (output.match(/^~ /gm) ?? []).length;
    return { added, removed, changed };
  }, [output]);

  const handleCompare = () => {
    const leftMap = parseEnv(left);
    const rightMap = parseEnv(right);

    const keys = new Set([
      ...Object.keys(leftMap),
      ...Object.keys(rightMap),
    ]);

    const added: string[] = [];
    const removed: string[] = [];
    const changed: string[] = [];

    Array.from(keys)
      .sort((a, b) => a.localeCompare(b))
      .forEach((key) => {
        const leftValue = leftMap[key];
        const rightValue = rightMap[key];
        if (leftValue === undefined && rightValue !== undefined) {
          added.push(`+ ${key}=${rightValue}`);
        } else if (leftValue !== undefined && rightValue === undefined) {
          removed.push(`- ${key}=${leftValue}`);
        } else if (leftValue !== rightValue) {
          changed.push(`~ ${key}: ${leftValue ?? ""} → ${rightValue ?? ""}`);
        }
      });

    if (!added.length && !removed.length && !changed.length) {
      setOutput("No differences detected.");
      return;
    }

    const sections = [
      added.length ? ["Added", ...added] : [],
      removed.length ? ["Removed", ...removed] : [],
      changed.length ? ["Changed", ...changed] : [],
    ].filter((section) => section.length);

    setOutput(
      sections
        .map((section) => section.join("\n"))
        .join("\n\n")
        .trim()
    );
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="grid flex-1 gap-4 min-h-0 lg:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          Base (.env)
          <textarea
            value={left}
            onChange={(event) => setLeft(event.target.value)}
            className={`${textareaBase} font-mono flex-1 resize-none`}
            placeholder="Paste the baseline environment file."
            rows={8}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          Compare (.env.local)
          <textarea
            value={right}
            onChange={(event) => setRight(event.target.value)}
            className={`${textareaBase} font-mono flex-1 resize-none`}
            placeholder="Paste the environment file to compare."
            rows={8}
          />
        </label>
      </div>

      <div className="shrink-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={buttonPrimary}
              onClick={handleCompare}
            >
              Compare
            </button>
            <button
              type="button"
              className={buttonSecondary}
              onClick={() => setOutput("")}
            >
              Clear output
            </button>
          </div>
          <CopyButton value={output} label="Copy diff" />
        </div>

        {(summary || output) && (
          <div className="space-y-2 animate-fade">
            {summary && (
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                <span className="text-ink font-semibold">Summary</span>
                <span>•</span>
                <span>
                  {`${summary.added} added · ${summary.removed} removed · ${summary.changed} changed`}
                </span>
              </div>
            )}
            <textarea
              readOnly
              value={output || "Diff output will appear here."}
              className={`${textareaBase} font-mono h-[140px] resize-none`}
              rows={8}
            />
          </div>
        )}
      </div>
    </div>
  );
}
