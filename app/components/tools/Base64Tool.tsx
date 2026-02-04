"use client";

import { useEffect, useState } from "react";
import CopyButton from "../CopyButton";
import { readLocal, writeLocal } from "../../lib/storage";
import { buttonPrimary, buttonSecondary, textareaBase } from "../../lib/styles";

const encodeBase64 = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const decodeBase64 = (value: string) => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const stored = readLocal<{ input: string; output: string }>(
      "devdock.base64.v1",
      { input: "", output: "" }
    );
    setInput(stored.input);
    setOutput(stored.output);
  }, []);

  useEffect(() => {
    writeLocal("devdock.base64.v1", { input, output });
  }, [input, output]);

  const handleEncode = () => {
    try {
      const encoded = encodeBase64(input);
      setOutput(encoded);
      setStatus("Encoded to Base64.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to encode input."
      );
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeBase64(input);
      setOutput(decoded);
      setStatus("Decoded from Base64.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to decode input."
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
            placeholder="Paste text or Base64 here."
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          Output
          <textarea
            value={output}
            onChange={(event) => setOutput(event.target.value)}
            className={`${textareaBase} font-mono flex-1 resize-none`}
            placeholder="Encoded or decoded output."
          />
        </label>
      </div>
      <div className="shrink-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={buttonPrimary} onClick={handleEncode}>
              Encode
            </button>
            <button
              type="button"
              className={buttonSecondary}
              onClick={handleDecode}
            >
              Decode
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
