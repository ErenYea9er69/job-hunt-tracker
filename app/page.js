import Header from "@/components/Header";
import DashboardClient from "@/components/DashboardClient";
import { listCompanies, getStats } from "@/lib/companies";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const companies = await listCompanies();
  const stats = await getStats(companies);

  return (
    <div className="min-h-screen">
      <Header crumb={`${stats.total} ${stats.total === 1 ? "entry" : "entries"} on file`} />
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <DashboardClient companies={companies} stats={stats} />
      </main>
    </div>
  );
}
