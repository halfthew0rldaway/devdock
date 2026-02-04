"use client";

import { useEffect, useState } from "react";
import CopyButton from "../CopyButton";
import { readLocal, writeLocal } from "../../lib/storage";
import { buttonPrimary, buttonSecondary, textareaBase } from "../../lib/styles";

type JsonState = {
  input: string;
  output: string;
};

const STORAGE_KEY = "devdock.json.v1";

export default function JsonTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const stored = readLocal<JsonState>(STORAGE_KEY, {
      input: "",
      output: "",
    });
    setInput(stored.input);
    setOutput(stored.output);
  }, []);

  useEffect(() => {
    writeLocal(STORAGE_KEY, { input, output });
  }, [input, output]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setStatus("Formatted JSON ready.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to parse the JSON."
      );
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setStatus("Minified JSON ready.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to parse the JSON."
      );
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(input);
      setStatus("JSON looks valid.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to parse the JSON."
      );
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="grid flex-1 gap-4 min-h-0 lg:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          Input
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className={`${textareaBase} font-mono flex-1 resize-none`}
            placeholder='{"service":"api","enabled":true}'
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          Output
          <textarea
            value={output}
            onChange={(event) => setOutput(event.target.value)}
            className={`${textareaBase} font-mono flex-1 resize-none`}
            placeholder="Formatted output will appear here."
          />
        </label>
      </div>
      <div className="shrink-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={buttonPrimary} onClick={handleFormat}>
              Format
            </button>
            <button
              type="button"
              className={buttonSecondary}
              onClick={handleMinify}
            >
              Minify
            </button>
            <button
              type="button"
              className={buttonSecondary}
              onClick={handleValidate}
            >
              Validate
            </button>
          </div>
          <CopyButton value={output} label="Copy output" />
        </div>
        {status ? (
          <p className="text-sm text-muted animate-fade" aria-live="polite">
            {status}
          </p>
        ) : null}
      </div>
    </div>
  );
}
