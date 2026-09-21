import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import CompanyForm from "@/components/CompanyForm";
import RolesManager from "@/components/RolesManager";
import DeleteCompanyButton from "@/components/DeleteCompanyButton";
import { ApplicationStatusBadge, HiringStatusBadge, PriorityStamp } from "@/components/StatusBadge";
import { getCompany } from "@/lib/companies";

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage({ params }) {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) notFound();

  return (
    <div className="min-h-screen">
      <Header crumb={company.name} />
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href="/" className="font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-ink">
              ← Back to the log
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <HiringStatusBadge value={company.hiring_status} />
              <ApplicationStatusBadge value={company.application_status} />
              <PriorityStamp value={company.priority} />
            </div>
          </div>
          <DeleteCompanyButton companyId={company.id} />
        </div>

        <div className="mb-6 dossier-card flex flex-wrap gap-x-8 gap-y-2 px-5 py-4 font-mono text-xs">
          {company.website ? (
            <a href={company.website} target="_blank" rel="noreferrer" className="text-slate underline underline-offset-2">
              Website ↗
            </a>
          ) : null}
          {company.application_link ? (
            <a href={company.application_link} target="_blank" rel="noreferrer" className="text-slate underline underline-offset-2">
              Application link ↗
            </a>
          ) : null}
          {company.contact_email ? (
            <a href={`mailto:${company.contact_email}`} className="text-slate underline underline-offset-2">
              {company.contact_email}
            </a>
          ) : null}
          {!company.website && !company.application_link && !company.contact_email ? (
            <span className="text-ink-soft">No links on file yet.</span>
          ) : null}
        </div>

        {company.application_status === "rejected" && company.rejection_reason ? (
          <div className="mb-6 rounded-sm border border-rust bg-rust/10 px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-rust-dark">
              Rejection notes
            </p>
            <p className="mt-1 text-sm text-ink">{company.rejection_reason}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <CompanyForm company={company} />

          <section className="dossier-card h-fit p-5">
            <h2 className="mb-4 font-display text-lg font-semibold italic text-ink">
              Open roles
            </h2>
            <RolesManager companyId={company.id} roles={company.roles} />
          </section>
        </div>
      </main>
    </div>
  );
}
