import Link from "next/link";
import { Briefcase, Plus } from "lucide-react";

export default function Header({ crumb }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-3">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/75 py-2.5 px-4 backdrop-blur-xl shadow-xl shadow-black/40">
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-2.5 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 transition-all duration-200 group-hover:scale-105 group-hover:bg-indigo-500/25 group-hover:border-indigo-500/50">
                <Briefcase className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                  Hunt Tracker
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                    <span className="size-1 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </span>
              </div>
            </Link>

            {crumb ? (
              <div className="hidden sm:flex items-center gap-2 text-zinc-500 text-xs">
                <span>/</span>
                <span className="rounded-md bg-zinc-800/60 border border-zinc-700/50 px-2.5 py-0.5 font-medium text-zinc-300 truncate max-w-[200px]">
                  {crumb}
                </span>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/companies/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="size-3.5" />
              Add Company
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
