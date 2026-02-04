import type { CSSProperties, ReactNode } from "react";

type ToolShellProps = {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  bodyClassName?: string;
  style?: CSSProperties;
};

export default function ToolShell({
  id,
  title,
  description,
  children,
  actions,
  className,
  bodyClassName,
  style,
}: ToolShellProps) {
  return (
    <section
      id={id}
      className={`relative flex flex-col scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-[box-shadow,border-color] duration-200 hover:shadow-lift ${className ?? ""} before:absolute before:left-6 before:right-6 before:top-0 before:h-[2px] before:origin-left before:scale-x-0 before:bg-accent/40 before:opacity-0 before:transition before:duration-300 hover:before:scale-x-100 hover:before:opacity-100`}
      style={style}
      aria-labelledby={`${id}-title`}
    >
      <div className="border-b border-line px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2
              id={`${id}-title`}
              className="font-display text-lg font-semibold text-ink"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted leading-6">{description}</p>
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      </div>
      <div className={`px-4 py-4 ${bodyClassName ?? ""}`}>{children}</div>
    </section>
  );
}
