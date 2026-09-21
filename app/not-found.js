import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      <Header crumb="Not Found" />

      <main className="mx-auto max-w-2xl px-4 pt-32 pb-16 text-center sm:px-6">
        <div className="glass-card p-10 sm:p-14">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-indigo-400 mb-5">
            <FileQuestion className="size-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Entry Not Found
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-md mx-auto">
            The company or record you are searching for does not exist in your pipeline or may have been removed.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-all"
            >
              <ArrowLeft className="size-3.5" />
              Back to Pipeline
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
