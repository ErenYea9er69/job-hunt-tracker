import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import Header from "@/components/Header";
import CompanyForm from "@/components/CompanyForm";

export default function NewCompanyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      <Header crumb="New Company" />

      <main className="mx-auto max-w-3xl px-4 pt-24 pb-16 sm:px-6 sm:pt-28">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all mb-4"
          >
            <ArrowLeft className="size-3.5" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Building2 className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Add Target Company
              </h1>
              <p className="text-xs text-zinc-400">
                Log a new company, role details, and recruitment contacts.
              </p>
            </div>
          </div>
        </div>

        <CompanyForm />
      </main>
    </div>
  );
}
