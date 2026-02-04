import Workspace from "./components/Workspace";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <a
        href="#content"
        className="absolute left-4 top-4 z-20 -translate-y-24 rounded-md bg-surface px-3 py-2 text-sm font-semibold text-ink shadow-soft transition focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        Skip to content
      </a>

      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid opacity-35 dark:opacity-25"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-[-120px] h-[280px] w-[280px] rounded-full border border-line/60 bg-surface opacity-70 shadow-inset animate-float"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-[45%] left-[-160px] h-[320px] w-[320px] rounded-full border border-line/60 bg-accent-soft opacity-50"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-10 lg:px-10">
          <header className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4 animate-fade-up">
              <p className="text-xs font-semibold text-muted">
                Local Developer Hub
              </p>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                devdock
              </h1>
              <div className="h-[2px] w-20 origin-left bg-accent/50 animate-sweep" />
              <p className="max-w-2xl text-base text-muted sm:text-lg leading-7">
                A focused set of offline-first utilities for daily development
                work. Built to stay open on a second monitor and keep you moving
                without distractions.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-medium text-muted">
                <span className="rounded-full border border-line bg-surface px-3 py-1 shadow-inset">
                  Offline-ready
                </span>
                <span className="rounded-full border border-line bg-surface px-3 py-1 shadow-inset">
                  Local storage only
                </span>
                <span className="rounded-full border border-line bg-surface px-3 py-1 shadow-inset">
                  Keyboard friendly
                </span>
              </div>
            </div>
            <div className="card-surface card-hover animate-fade-up p-6">
              <h2 className="text-sm font-semibold text-ink">Daily flow</h2>
              <ul className="mt-3 space-y-3 text-sm text-muted">
                <li className="flex gap-2">
                  <span className="text-ink">1.</span>
                  Capture quick notes or TODOs without context switching.
                </li>
                <li className="flex gap-2">
                  <span className="text-ink">2.</span>
                  Keep your repeatable commands one click away.
                </li>
                <li className="flex gap-2">
                  <span className="text-ink">3.</span>
                  Clean data with JSON, Base64, and hash helpers.
                </li>
              </ul>
              <p className="mt-4 text-xs text-muted">
                Tip: Use browser tab pinning to keep devdock ready all day.
              </p>
            </div>
          </header>

          <main id="content">
            <Workspace />
          </main>
        </div>
      </div>
    </div>
  );
}
