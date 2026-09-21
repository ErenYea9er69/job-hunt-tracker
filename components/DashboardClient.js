"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Sparkles,
  Send,
  Calendar,
  Trophy,
  XCircle,
  Search,
  Table as TableIcon,
  Kanban,
  SearchX,
  Check,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  APPLICATION_STATUSES,
  HIRING_STATUSES,
  PRIORITIES,
} from "@/lib/constants";
import {
  ApplicationStatusBadge,
  HiringStatusBadge,
  PriorityStamp,
} from "@/components/StatusBadge";

function StatCard({ label, value, icon: Icon, colorClass, borderClass, bgClass }) {
  return (
    <div className="glass-card-hover p-4 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        <div className={`flex size-8 items-center justify-center rounded-xl ${bgClass} ${borderClass} border`}>
          <Icon className={`size-4 ${colorClass}`} />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${colorClass}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

export default function DashboardClient({ companies, stats }) {
  const [query, setQuery] = useState("");
  const [hiringFilter, setHiringFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [stipendOnly, setStipendOnly] = useState(false);
  const [view, setView] = useState("table");

  const hasActiveFilters =
    query.trim() !== "" ||
    hiringFilter !== "all" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    stipendOnly;

  function resetFilters() {
    setQuery("");
    setHiringFilter("all");
    setStatusFilter("all");
    setPriorityFilter("all");
    setStipendOnly(false);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter((c) => {
      if (hiringFilter !== "all" && c.hiring_status !== hiringFilter) return false;
      if (statusFilter !== "all" && c.application_status !== statusFilter) return false;
      if (priorityFilter !== "all" && c.priority !== priorityFilter) return false;
      if (stipendOnly && !c.stipend_mentioned) return false;
      if (!q) return true;
      const haystack = [
        c.name,
        c.what_building,
        c.industry,
        c.location,
        ...(c.roles || []).map((r) => r.title),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [companies, query, hiringFilter, statusFilter, priorityFilter, stipendOnly]);

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Tracked"
          value={stats.total}
          colorClass="text-zinc-100"
          bgClass="bg-zinc-800/60"
          borderClass="border-zinc-700/50"
          icon={Building2}
        />
        <StatCard
          label="Hiring Now"
          value={stats.hiring}
          colorClass="text-emerald-400"
          bgClass="bg-emerald-500/10"
          borderClass="border-emerald-500/20"
          icon={Sparkles}
        />
        <StatCard
          label="Applied"
          value={stats.applied}
          colorClass="text-sky-400"
          bgClass="bg-sky-500/10"
          borderClass="border-sky-500/20"
          icon={Send}
        />
        <StatCard
          label="Interviewing"
          value={stats.interviewing}
          colorClass="text-amber-400"
          bgClass="bg-amber-500/10"
          borderClass="border-amber-500/20"
          icon={Calendar}
        />
        <StatCard
          label="Offers"
          value={stats.offers}
          colorClass="text-emerald-300"
          bgClass="bg-emerald-500/15"
          borderClass="border-emerald-500/30"
          icon={Trophy}
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          colorClass="text-rose-400"
          bgClass="bg-rose-500/10"
          borderClass="border-rose-500/20"
          icon={XCircle}
        />
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="glass-card p-3 sm:p-4 flex flex-wrap items-center gap-3">
        {/* Search input with Lucide Search icon */}
        <div className="relative min-w-[240px] flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
            <Search className="size-4" />
          </div>
          <input
            type="text"
            placeholder="Search company, tech, role, city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-glass w-full pl-9 text-sm"
          />
        </div>

        {/* Dropdown filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={hiringFilter}
            onChange={(e) => setHiringFilter(e.target.value)}
            className="input-glass text-xs py-2"
          >
            <option value="all">Hiring: All</option>
            {HIRING_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-glass text-xs py-2"
          >
            <option value="all">Status: All</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-glass text-xs py-2"
          >
            <option value="all">Priority: All</option>
            {PRIORITIES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Stipend toggle */}
          <label className="flex items-center gap-2 rounded-xl bg-zinc-900/60 border border-zinc-700/50 px-3 py-1.5 text-xs text-zinc-300 cursor-pointer hover:border-zinc-600 transition-colors select-none">
            <input
              type="checkbox"
              checked={stipendOnly}
              onChange={(e) => setStipendOnly(e.target.checked)}
              className="size-3.5 rounded border-zinc-700 text-indigo-600 focus:ring-0"
            />
            <span>Stipend paid</span>
          </label>

          {hasActiveFilters ? (
            <button
              onClick={resetFilters}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 underline underline-offset-2 transition-colors"
            >
              Reset
            </button>
          ) : null}
        </div>

        {/* View Toggle */}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-zinc-900/80 p-1 border border-zinc-800">
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all duration-150 ${
                view === "table"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/60"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <TableIcon className="size-3.5" />
              Table
            </button>
            <button
              onClick={() => setView("board")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all duration-150 ${
                view === "board"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/60"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Kanban className="size-3.5" />
              Board
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-zinc-800/80 border border-zinc-700/50 text-zinc-400 mb-4">
            <SearchX className="size-6" />
          </div>
          <h3 className="text-base font-semibold text-zinc-200">No companies found</h3>
          <p className="mt-1 text-sm text-zinc-400 max-w-sm mx-auto">
            {companies.length === 0
              ? "Start tracking your first target company to keep your job hunt organized."
              : "No companies match your current search and filter settings."}
          </p>
          <div className="mt-5">
            {companies.length === 0 ? (
              <Link
                href="/companies/new"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-all"
              >
                <Plus className="size-3.5" />
                Add First Company
              </Link>
            ) : (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-zinc-300 border border-zinc-700 hover:bg-zinc-700 transition-all"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      ) : view === "table" ? (
        <TableView companies={filtered} />
      ) : (
        <BoardView companies={filtered} />
      )}
    </div>
  );
}

function TableView({ companies }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50 text-left text-xs font-semibold text-zinc-400">
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">What They Build</th>
              <th className="py-3 px-4">Hiring</th>
              <th className="py-3 px-4">Open Roles</th>
              <th className="py-3 px-4">Stipend</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Applied</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {companies.map((c) => {
              const initials = c.name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "C";

              return (
                <tr
                  key={c.id}
                  className="group hover:bg-zinc-800/35 transition-colors duration-150"
                >
                  <td className="py-3.5 px-4">
                    <Link href={`/companies/${c.id}`} className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-800/90 border border-zinc-700/60 text-xs font-bold text-zinc-200 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-colors">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors truncate">
                          {c.name}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                          {c.location || c.industry || "General"}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 max-w-[220px]">
                    <p className="line-clamp-2 text-xs text-zinc-400">
                      {c.what_building || "—"}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <HiringStatusBadge value={c.hiring_status} />
                  </td>
                  <td className="py-3.5 px-4">
                    {c.roles && c.roles.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center rounded-md bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 text-[11px] font-medium text-zinc-300">
                          {c.roles[0].title}
                        </span>
                        {c.roles.length > 1 ? (
                          <span className="text-[10px] text-zinc-500 font-medium">
                            +{c.roles.length - 1}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {c.stipend_mentioned ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                        <Check className="size-3.5" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-600">No</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <ApplicationStatusBadge value={c.application_status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <PriorityStamp value={c.priority} />
                  </td>
                  <td className="py-3.5 px-4 text-xs text-zinc-400">
                    {c.date_applied || "—"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/companies/${c.id}`}
                      className="inline-flex items-center justify-center size-7 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <ChevronRight className="size-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BoardView({ companies }) {
  const columns = APPLICATION_STATUSES.map((status) => ({
    ...status,
    items: companies.filter((c) => c.application_status === status.value),
  }));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 items-start">
      {columns.map((col) => (
        <div key={col.value} className="flex flex-col min-w-0">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              {col.label}
            </span>
            <span className="rounded-full bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 text-[10px] font-bold text-zinc-400">
              {col.items.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {col.items.map((c) => {
              const initials = c.name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "C";

              return (
                <Link
                  key={c.id}
                  href={`/companies/${c.id}`}
                  className="glass-card-hover block p-3.5 group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700/60 text-[10px] font-bold text-zinc-300 group-hover:border-indigo-500/50 transition-colors">
                        {initials}
                      </div>
                      <h4 className="font-semibold text-sm text-zinc-100 group-hover:text-indigo-300 transition-colors truncate">
                        {c.name}
                      </h4>
                    </div>
                    <PriorityStamp value={c.priority} />
                  </div>

                  {c.what_building ? (
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                      {c.what_building}
                    </p>
                  ) : null}

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-500">
                    <HiringStatusBadge value={c.hiring_status} />
                    {c.stipend_mentioned ? (
                      <span className="text-emerald-400 font-medium">Stipend</span>
                    ) : (
                      <span>{c.roles?.length || 0} roles</span>
                    )}
                  </div>
                </Link>
              );
            })}

            {col.items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800/80 bg-zinc-900/20 py-8 px-3 text-center text-xs text-zinc-600">
                No companies
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
