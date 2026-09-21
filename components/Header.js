import Link from "next/link";

export default function Header({ crumb }) {
  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Link href="/" className="group">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-soft">
              Case File — Employment Prospects
            </p>
            <h1 className="font-display text-4xl font-semibold italic tracking-tight text-ink sm:text-5xl">
              The Hunt Log
            </h1>
          </Link>
          {crumb ? (
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
              {crumb}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
