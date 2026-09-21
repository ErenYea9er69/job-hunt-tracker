import { Sparkles } from "lucide-react";
import Header from "@/components/Header";
import DashboardClient from "@/components/DashboardClient";
import { listCompanies, getStats } from "@/lib/companies";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const companies = await listCompanies();
  const stats = await getStats(companies);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      <Header crumb={`${stats.total} ${stats.total === 1 ? "company" : "companies"}`} />
      
      <main className="mx-auto max-w-6xl px-4 pt-24 pb-16 sm:px-6 sm:pt-28">
        {/* Subtle Hero Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/80 border border-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400 mb-3">
            <Sparkles className="size-3.5 text-indigo-400" />
            <span>Job Hunt Command Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Application Pipeline
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-xl">
            Monitor target startups, interview pipelines, stipend offers, and recruiter correspondence in real time.
          </p>
        </div>

        <DashboardClient companies={companies} stats={stats} />
      </main>
    </div>
  );
}
