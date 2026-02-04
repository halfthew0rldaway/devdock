"use client";

import { useState } from "react";
import { buttonSecondary } from "../lib/styles";

type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
};

export default function CopyButton({
  value,
  label = "Copy",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) {
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${buttonSecondary} text-xs ${
        copied ? "border-accent/40 bg-accent-soft text-ink" : ""
      } ${className ?? ""}`}
      aria-live="polite"
      aria-label={`${label} to clipboard`}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
