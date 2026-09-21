import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header crumb="Not found" />
      <main className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
        <p className="font-display text-3xl italic text-ink-soft">
          This file doesn&apos;t exist in the cabinet.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block font-mono text-xs uppercase tracking-wide text-rust hover:text-rust-dark"
        >
          ← Back to the log
        </Link>
      </main>
    </div>
  );
}
