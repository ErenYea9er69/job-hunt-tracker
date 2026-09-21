import Header from "@/components/Header";
import CompanyForm from "@/components/CompanyForm";

export default function NewCompanyPage() {
  return (
    <div className="min-h-screen">
      <Header crumb="New entry" />
      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
          Open a new file
        </h2>
        <CompanyForm />
      </main>
    </div>
  );
}
