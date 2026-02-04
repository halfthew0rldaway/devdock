"use client";

import { useEffect, useMemo, useState } from "react";
import CopyButton from "../CopyButton";
import { readLocal, writeLocal } from "../../lib/storage";
import { buttonPrimary, buttonSecondary, inputBase, textareaBase } from "../../lib/styles";

type TimestampState = {
  epochInput: string;
  isoInput: string;
  mode: "local" | "utc" | "custom";
  customTimezone: string;
};

const STORAGE_KEY = "devdock.timestamp.v1";

const formatDate = (date: Date, timeZone?: string) => {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
    timeStyle: "long",
    timeZone,
  }).format(date);
};

export default function TimestampTool() {
  const [epochInput, setEpochInput] = useState("");
  const [isoInput, setIsoInput] = useState("");
  const [mode, setMode] = useState<TimestampState["mode"]>("local");
  const [customTimezone, setCustomTimezone] = useState("UTC");
  const [lastEdited, setLastEdited] = useState<"epoch" | "iso">("epoch");

  useEffect(() => {
    const stored = readLocal<TimestampState>(STORAGE_KEY, {
      epochInput: "",
      isoInput: "",
      mode: "local",
      customTimezone: "UTC",
    });
    setEpochInput(stored.epochInput);
    setIsoInput(stored.isoInput);
    setMode(stored.mode);
    setCustomTimezone(stored.customTimezone);
  }, []);

  useEffect(() => {
    writeLocal(STORAGE_KEY, {
      epochInput,
      isoInput,
      mode,
      customTimezone,
    });
  }, [epochInput, isoInput, mode, customTimezone]);

  const parsedDate = useMemo(() => {
    if (lastEdited === "epoch") {
      const numeric = Number(epochInput.trim());
      if (!epochInput.trim() || Number.isNaN(numeric)) {
        return null;
      }
      const ms = numeric < 1e12 ? numeric * 1000 : numeric;
      return new Date(ms);
    }

    if (isoInput.trim()) {
      const date = new Date(isoInput.trim());
      if (Number.isNaN(date.getTime())) {
        return null;
      }
      return date;
    }

    const numeric = Number(epochInput.trim());
    if (!epochInput.trim() || Number.isNaN(numeric)) {
      return null;
    }
    const ms = numeric < 1e12 ? numeric * 1000 : numeric;
    return new Date(ms);
  }, [epochInput, isoInput, lastEdited]);

  const timezone = mode === "utc" ? "UTC" : mode === "custom" ? customTimezone : undefined;

  const { output, error } = useMemo(() => {
    if (!parsedDate) {
      return { output: null, error: null };
    }

    try {
      const epochMs = parsedDate.getTime();
      const epochSec = Math.floor(epochMs / 1000);
      return {
        output: {
          epochMs,
          epochSec,
          iso: parsedDate.toISOString(),
          local: formatDate(parsedDate, timezone),
          utc: formatDate(parsedDate, "UTC"),
        },
        error: null,
      };
    } catch (err) {
      return {
        output: null,
        error: err instanceof Error ? err.message : "Unable to format timestamp.",
      };
    }
  }, [parsedDate, timezone]);

  const handleNow = () => {
    setEpochInput(`${Date.now()}`);
    setLastEdited("epoch");
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-ink">
          Epoch (seconds or ms)
          <input
            type="text"
            value={epochInput}
            onChange={(event) => {
              setEpochInput(event.target.value);
              setLastEdited("epoch");
            }}
            className={`${inputBase} font-mono`}
            placeholder="1707060000 or 1707060000000"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-ink">
          ISO 8601
          <input
            type="text"
            value={isoInput}
            onChange={(event) => {
              setIsoInput(event.target.value);
              setLastEdited("iso");
            }}
            className={`${inputBase} font-mono`}
            placeholder="2025-01-02T15:04:05Z"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
        <label className="space-y-2 text-sm font-medium text-ink">
          Display timezone
          <div className="relative">
            <select
              value={mode}
              onChange={(event) =>
                setMode(event.target.value as TimestampState["mode"])
              }
              className={`${inputBase} w-40 min-w-[160px] cursor-pointer appearance-none bg-surface-2 pr-8`}
            >
              <option value="local">Local machine</option>
              <option value="utc">UTC</option>
              <option value="custom">Custom</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {mode === "custom" ? (
            <input
              type="text"
              value={customTimezone}
              onChange={(event) => setCustomTimezone(event.target.value)}
              className={`${inputBase} w-48`}
              placeholder="America/Los_Angeles"
            />
          ) : null}
          <button
            type="button"
            className={buttonSecondary}
            onClick={() => {
              setEpochInput("");
              setIsoInput("");
            }}
          >
            Clear
          </button>
          <button type="button" className={buttonPrimary} onClick={handleNow}>
            Use now
          </button>
        </div>
      </div>

      <div>
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-ink">
            Human Readable
            <textarea
              readOnly
              value={
                output
                  ? `${output.local}\nUTC: ${output.utc}`
                  : "Waiting for input..."
              }
              className={`${textareaBase} font-mono h-[168px] min-h-0 resize-none`}
              rows={5}
            />
          </label>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">ISO 8601</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={output?.iso ?? ""}
                  readOnly
                  className={`${inputBase} font-mono`}
                  placeholder="—"
                />
                <CopyButton value={output?.iso ?? ""} label="Copy" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">
                Epoch seconds
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={output?.epochSec ?? ""}
                  readOnly
                  className={`${inputBase} font-mono`}
                  placeholder="—"
                />
                <CopyButton
                  value={output?.epochSec ? `${output.epochSec}` : ""}
                  label="Copy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-muted animate-fade" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  );
}
