"use client";

import { useEffect, useState } from "react";
import CopyButton from "../CopyButton";
import { readLocal, writeLocal } from "../../lib/storage";
import { buttonPrimary, buttonSecondary, inputBase, textareaBase } from "../../lib/styles";

const algorithms = [
  { id: "SHA-256", label: "SHA-256" },
  { id: "SHA-1", label: "SHA-1" },
  { id: "SHA-512", label: "SHA-512" },
];

const toHex = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export default function HashTool() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState(algorithms[0].id);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const stored = readLocal<{
      input: string;
      algorithm: string;
      output: string;
    }>("devdock.hash.v1", {
      input: "",
      algorithm: algorithms[0].id,
      output: "",
    });
    setInput(stored.input);
    setAlgorithm(stored.algorithm);
    setOutput(stored.output);
  }, []);

  useEffect(() => {
    writeLocal("devdock.hash.v1", { input, algorithm, output });
  }, [input, algorithm, output]);

  const handleGenerate = async () => {
    try {
      const data = new TextEncoder().encode(input);
      const digest = await crypto.subtle.digest(algorithm, data);
      const hex = toHex(digest);
      setOutput(hex);
      setStatus(`${algorithm} hash generated.`);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to compute hash."
      );
    }
  };

  return (
    <div className="space-y-4">
      <label className="space-y-2 text-sm font-medium text-ink">
        Input
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className={`${textareaBase} font-mono`}
          placeholder="Text to hash."
          rows={6}
        />
      </label>
      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
        <label className="space-y-2 text-sm font-medium text-ink">
          Algorithm
          <div className="relative">
            <select
              value={algorithm}
              onChange={(event) => setAlgorithm(event.target.value)}
              className={`${inputBase} w-40 min-w-[160px] cursor-pointer appearance-none bg-surface-2 pr-8`}
            >
              {algorithms.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.label}
                </option>
              ))}
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
          <button
            type="button"
            className={buttonSecondary}
            onClick={() => setOutput("")}
          >
            Clear
          </button>
          <CopyButton value={output} label="Copy" />
          <button
            type="button"
            className={buttonPrimary}
            onClick={handleGenerate}
          >
            Generate hash
          </button>
        </div>
      </div>
      <label className="space-y-2 text-sm font-medium text-ink">
        Output
        <input
          type="text"
          value={output}
          onChange={(event) => setOutput(event.target.value)}
          className={`${inputBase} font-mono`}
          placeholder="Hash output."
        />
      </label>
      {status ? (
        <p className="text-sm text-muted animate-fade" aria-live="polite">
          {status}
        </p>
      ) : null}
    </div>
  );
}
