export const inputBase =
  "w-full h-10 rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-ink shadow-[0_1px_0_rgba(0,0,0,0.04)] placeholder:text-muted placeholder:opacity-70 transition-[border,box-shadow,background-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:border-accent hover:border-accent/40";

export const textareaBase =
  "w-full min-h-[200px] rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-ink shadow-[0_1px_0_rgba(0,0,0,0.04)] placeholder:text-muted placeholder:opacity-70 transition-[border,box-shadow,background-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:border-accent hover:border-accent/40 resize-y";

export const buttonBase =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-[transform,box-shadow,background-color,border-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-0 active:translate-y-[1px]";

export const buttonPrimary =
  `${buttonBase} bg-accent text-white shadow-[0_1px_0_rgba(0,0,0,0.12)] hover:bg-accent-strong hover:-translate-y-[1px]`;

export const buttonSecondary =
  `${buttonBase} border border-line bg-surface-2 text-ink shadow-[0_1px_0_rgba(0,0,0,0.06)] hover:bg-surface hover:border-accent/40 hover:-translate-y-[1px]`;

export const buttonGhost =
  `${buttonBase} text-muted hover:text-ink hover:bg-surface-2 hover:-translate-y-[1px]`;

export const badgeBase =
  "inline-flex items-center rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted";
