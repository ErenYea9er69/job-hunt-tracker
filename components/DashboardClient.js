"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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

function StatCard({ label, value, accent }) {
  return (
    <div className="dossier-card px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
        {label}
      </p>
      <p className={`font-display text-3xl font-semibold ${accent || "text-ink"}`}>
        {value}
      </p>
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Tracked" value={stats.total} />
        <StatCard label="Hiring" value={stats.hiring} accent="text-forest" />
        <StatCard label="Applied" value={stats.applied} accent="text-slate" />
        <StatCard label="Interviewing" value={stats.interviewing} accent="text-mustard" />
        <StatCard label="Offers" value={stats.offers} accent="text-forest" />
        <StatCard label="Rejected" value={stats.rejected} accent="text-rust" />
      </div>

      <div className="dossier-card flex flex-wrap items-center gap-3 px-4 py-3">
        <input
          type="text"
          placeholder="Search name, product, industry, role..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-[220px] flex-1 rounded-sm px-3 py-1.5 text-sm"
        />
        <select
          value={hiringFilter}
          onChange={(e) => setHiringFilter(e.target.value)}
          className="rounded-sm px-2 py-1.5 text-sm"
        >
          <option value="all">Hiring: all</option>
          {HIRING_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-sm px-2 py-1.5 text-sm"
        >
          <option value="all">Status: all</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-sm px-2 py-1.5 text-sm"
        >
          <option value="all">Priority: all</option>
          {PRIORITIES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft">
          <input
            type="checkbox"
            checked={stipendOnly}
            onChange={(e) => setStipendOnly(e.target.checked)}
            className="h-3.5 w-3.5"
          />
          Stipend only
        </label>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-sm border border-line font-mono text-xs uppercase tracking-wide">
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 ${view === "table" ? "bg-ink text-paper" : "text-ink-soft"}`}
            >
              Table
            </button>
            <button
              onClick={() => setView("board")}
              className={`px-3 py-1.5 ${view === "board" ? "bg-ink text-paper" : "text-ink-soft"}`}
            >
              Board
            </button>
          </div>
          <Link
            href="/companies/new"
            className="rounded-sm bg-rust px-4 py-1.5 font-mono text-xs uppercase tracking-wide text-paper hover:bg-rust-dark"
          >
            + Add company
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="dossier-card px-6 py-14 text-center">
          <p className="font-display text-2xl italic text-ink-soft">
            No entries match. The file is thin here.
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
            {companies.length === 0
              ? "Add your first company to open the case."
              : "Adjust filters or clear the search."}
          </p>
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
    <div className="dossier-card overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-ink text-left font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft">
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Building</th>
            <th className="px-4 py-3">Hiring</th>
            <th className="px-4 py-3">Open roles</th>
            <th className="px-4 py-3">Stipend</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Applied</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c, idx) => (
            <tr
              key={c.id}
              className={`border-b border-line align-top ${idx % 2 === 1 ? "bg-paper-dark/40" : ""}`}
            >
              <td className="px-4 py-3">
                <Link
                  href={`/companies/${c.id}`}
                  className="font-display text-base font-semibold text-ink hover:text-rust"
                >
                  {c.name}
                </Link>
                {c.location ? (
                  <p className="font-mono text-[11px] text-ink-soft">{c.location}</p>
                ) : null}
              </td>
              <td className="max-w-[240px] px-4 py-3 text-ink-soft">
                {c.what_building || "—"}
              </td>
              <td className="px-4 py-3">
                <HiringStatusBadge value={c.hiring_status} />
              </td>
              <td className="px-4 py-3">
                {c.roles.length === 0 ? (
                  <span className="text-ink-soft">—</span>
                ) : (
                  <div className="space-y-0.5">
                    {c.roles.slice(0, 2).map((r) => (
                      <p key={r.id} className="text-ink">
                        {r.title}
                      </p>
                    ))}
                    {c.roles.length > 2 ? (
                      <p className="font-mono text-[11px] text-ink-soft">
                        +{c.roles.length - 2} more
                      </p>
                    ) : null}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                {c.stipend_mentioned ? (
                  <span className="font-mono text-xs text-forest">Yes</span>
                ) : (
                  <span className="font-mono text-xs text-ink-soft">No</span>
                )}
              </td>
              <td className="px-4 py-3">
                <ApplicationStatusBadge value={c.application_status} />
              </td>
              <td className="px-4 py-3">
                <PriorityStamp value={c.priority} />
              </td>
              <td className="px-4 py-3 font-mono text-xs text-ink-soft">
                {c.date_applied || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BoardView({ companies }) {
  const columns = APPLICATION_STATUSES.map((status) => ({
    ...status,
    items: companies.filter((c) => c.application_status === status.value),
  }));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {columns.map((col) => (
        <div key={col.value} className="min-w-0">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft">
            {col.label} · {col.items.length}
          </p>
          <div className="space-y-2">
            {col.items.map((c) => (
              <Link
                key={c.id}
                href={`/companies/${c.id}`}
                className="dossier-card block px-3 py-2.5 hover:border-rust"
              >
                <p className="font-display text-base font-semibold leading-tight text-ink">
                  {c.name}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-ink-soft">
                  {c.what_building || "No description yet."}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <HiringStatusBadge value={c.hiring_status} />
                  <PriorityStamp value={c.priority} />
                </div>
              </Link>
            ))}
            {col.items.length === 0 ? (
              <div className="rounded-sm border border-dashed border-line px-3 py-4 text-center font-mono text-[11px] text-ink-soft">
                Empty
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
