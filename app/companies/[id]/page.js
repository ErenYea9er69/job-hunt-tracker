import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Globe,
  ExternalLink,
  Mail,
  AlertTriangle,
  Briefcase,
} from "lucide-react";
import Header from "@/components/Header";
import CompanyForm from "@/components/CompanyForm";
import RolesManager from "@/components/RolesManager";
import DeleteCompanyButton from "@/components/DeleteCompanyButton";
import { ApplicationStatusBadge, HiringStatusBadge, PriorityStamp } from "@/components/StatusBadge";
import { getCompany } from "@/lib/companies";

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage({ params }) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) notFound();

  const initials = company.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "C";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      <Header crumb={company.name} />

      <main className="mx-auto max-w-6xl px-4 pt-24 pb-16 sm:px-6 sm:pt-28">
        {/* Navigation and Actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all"
          >
            <ArrowLeft className="size-3.5" />
            Back to Dashboard
          </Link>
          <DeleteCompanyButton companyId={company.id} />
        </div>

        {/* Company Header Card */}
        <div className="glass-card p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-lg font-bold text-indigo-400">
                {initials}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    {company.name}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                  {company.industry ? (
                    <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-zinc-300">
                      {company.industry}
                    </span>
                  ) : null}
                  {company.location ? (
                    <span className="flex items-center gap-1 text-zinc-400">
                      <MapPin className="size-3 text-zinc-500" />
                      {company.location}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <HiringStatusBadge value={company.hiring_status} />
              <ApplicationStatusBadge value={company.application_status} />
              <PriorityStamp value={company.priority} />
            </div>
          </div>

          {/* Links strip */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-4 text-xs">
            {company.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                <Globe className="size-3.5" />
                Visit Website ↗
              </a>
            ) : null}

            {company.application_link ? (
              <a
                href={company.application_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                <ExternalLink className="size-3.5" />
                Application Portal ↗
              </a>
            ) : null}

            {company.contact_email ? (
              <a
                href={`mailto:${company.contact_email}`}
                className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
              >
                <Mail className="size-3.5 text-zinc-400" />
                {company.contact_email}
              </a>
            ) : null}

            {!company.website && !company.application_link && !company.contact_email ? (
              <span className="text-zinc-500">No links or emails provided yet.</span>
            ) : null}
          </div>
        </div>

        {/* Rejection Notes Alert if present */}
        {company.application_status === "rejected" && company.rejection_reason ? (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-950/25 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <AlertTriangle className="size-4" />
              Rejection Takeaway
            </div>
            <p className="text-sm text-zinc-300">{company.rejection_reason}</p>
          </div>
        ) : null}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr] items-start">
          <CompanyForm company={company} />

          <section className="glass-card p-5 sm:p-6 sticky top-24">
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                  <Briefcase className="size-4" />
                </div>
                <h3 className="font-semibold text-sm text-zinc-100">Open Roles</h3>
              </div>
              <span className="rounded-full bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 text-xs font-semibold text-zinc-300">
                {company.roles?.length || 0}
              </span>
            </div>
            <RolesManager companyId={company.id} roles={company.roles || []} />
          </section>
        </div>
      </main>
    </div>
  );
}
