"use client";

import { useEffect, useMemo, useState } from "react";
import { readLocal, writeLocal } from "../../lib/storage";
import { buttonGhost, buttonSecondary, textareaBase } from "../../lib/styles";

const STORAGE_KEY = "devdock.notes.v1";
const LEGACY_KEY = "forge.notes.v1";

export default function NotesTool() {
  const [value, setValue] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    const stored = readLocal<string>(STORAGE_KEY, "");
    if (!stored) {
      const legacy = readLocal<string>(LEGACY_KEY, "");
      if (legacy) {
        setValue(legacy);
        return;
      }
    }
    setValue(stored);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      writeLocal(STORAGE_KEY, value);
      setSavedAt(new Date());
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [value]);

  const stats = useMemo(() => {
    const words = value.trim().length ? value.trim().split(/\s+/).length : 0;
    return {
      words,
      characters: value.length,
    };
  }, [value]);

  const handleClear = () => {
    if (value && window.confirm("Clear the scratchpad?")) {
      setValue("");
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center gap-3 text-xs text-muted">
        <span>{stats.words} words</span>
        <span>•</span>
        <span>{stats.characters} characters</span>
        <span>•</span>
        <span>
          {savedAt
            ? `Saved ${savedAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
            : "Local autosave ready"}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className={`${textareaBase} flex-1 resize-none`}
        placeholder="Drop quick notes, TODOs, or snippets. Everything stays local."
      />
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <button type="button" className={buttonGhost} onClick={handleClear}>
          Clear
        </button>
        <button
          type="button"
          className={buttonSecondary}
          onClick={() => setValue((current) => `${current}\n`)}
        >
          Insert line
        </button>
      </div>
    </div>
  );
}
