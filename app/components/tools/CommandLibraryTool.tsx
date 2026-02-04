"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import CopyButton from "../CopyButton";
import { readLocal, writeLocal } from "../../lib/storage";
import {
  badgeBase,
  buttonGhost,
  buttonPrimary,
  buttonSecondary,
  inputBase,
  textareaBase,
} from "../../lib/styles";

type CommandItem = {
  id: string;
  title: string;
  command: string;
  notes: string;
  tags: string[];
  createdAt: number;
};

const STORAGE_KEY = "devdock.commands.v1";
const LEGACY_STORAGE_KEY = "forge.commands.v1";
const UI_STORAGE_KEY = "devdock.commands.ui.v1";

const emptyForm = {
  title: "",
  command: "",
  notes: "",
  tags: "",
};

export default function CommandLibraryTool() {
  const [items, setItems] = useState<CommandItem[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = readLocal<CommandItem[]>(STORAGE_KEY, []);
    if (!stored.length) {
      const legacy = readLocal<CommandItem[]>(LEGACY_STORAGE_KEY, []);
      if (legacy.length) {
        setItems(legacy);
      } else {
        setItems(stored);
      }
    } else {
      setItems(stored);
    }
    const uiState = readLocal<{ query: string; form: typeof emptyForm }>(
      UI_STORAGE_KEY,
      { query: "", form: emptyForm }
    );
    setQuery(uiState.query);
    setForm(uiState.form);
  }, []);

  useEffect(() => {
    writeLocal(STORAGE_KEY, items);
  }, [items]);

  useEffect(() => {
    writeLocal(UI_STORAGE_KEY, { query, form });
  }, [query, form]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return items;
    }
    return items.filter((item) => {
      const haystack = `${item.title} ${item.command} ${item.notes} ${item.tags.join(
        " "
      )}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [items, query]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.command.trim()) {
      setError("Title and command are required.");
      return;
    }

    const newItem: CommandItem = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: form.title.trim(),
      command: form.command.trim(),
      notes: form.notes.trim(),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: Date.now(),
    };

    setItems((current) => [newItem, ...current]);
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={`${inputBase} max-w-sm`}
          placeholder="Filter by name, command, or tag"
          aria-label="Filter commands"
        />
        <span className="text-xs text-muted">
          {filtered.length} saved command{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-ink">
            Title
            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              className={inputBase}
              placeholder="e.g. Reset local database"
              required
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-ink">
            Tags (comma-separated)
            <input
              type="text"
              value={form.tags}
              onChange={(event) =>
                setForm((current) => ({ ...current, tags: event.target.value }))
              }
              className={inputBase}
              placeholder="docker, db, cleanup"
            />
          </label>
        </div>
        <label className="space-y-2 text-sm font-medium text-ink">
          Command
          <textarea
            value={form.command}
            onChange={(event) =>
              setForm((current) => ({ ...current, command: event.target.value }))
            }
            className={`${textareaBase} font-mono min-h-[100px]`}
            placeholder="docker compose down -v && docker compose up -d"
            rows={3}
            required
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-ink">
          Notes
          <textarea
            value={form.notes}
            onChange={(event) =>
              setForm((current) => ({ ...current, notes: event.target.value }))
            }
            className={`${textareaBase} min-h-[80px]`}
            placeholder="Any caveats, context, or reminders."
            rows={2}
          />
        </label>
        {error ? (
          <p className="text-sm text-red-600 animate-fade">{error}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className={buttonPrimary}>
            Save command
          </button>
          <button
            type="button"
            className={buttonGhost}
            onClick={() => setForm(emptyForm)}
          >
            Reset form
          </button>
        </div>
      </form>

      <div className="grid gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-line bg-surface-2 p-4 transition-[border,box-shadow] duration-200 hover:border-accent/40 hover:shadow-soft"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Added{" "}
                  {new Date(item.createdAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <CopyButton value={item.command} label="Copy command" />
                <button
                  type="button"
                  className={`${buttonSecondary} text-xs`}
                  onClick={() => handleDelete(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink shadow-inset scrollbar-thin">
              <code className="font-mono">{item.command}</code>
            </pre>
            {item.notes ? (
              <p className="mt-3 text-sm text-muted">{item.notes}</p>
            ) : null}
            {item.tags.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className={badgeBase}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-surface-2 p-6 text-sm text-muted">
            No matching commands yet. Save a few go-to scripts to build your
            personal library.
          </div>
        ) : null}
      </div>
    </div>
  );
}
