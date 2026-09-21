"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  GitBranch,
  DollarSign,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  APPLICATION_STATUSES,
  HIRING_STATUSES,
  PRIORITIES,
  REMOTE_TYPES,
} from "@/lib/constants";

const EMPTY = {
  name: "",
  website: "",
  what_building: "",
  industry: "",
  hiring_status: "unknown",
  application_status: "not_applied",
  application_link: "",
  contact_email: "",
  stipend_mentioned: false,
  stipend_details: "",
  location: "",
  remote_type: "unknown",
  source: "",
  priority: "medium",
  date_applied: "",
  rejection_reason: "",
  follow_up_date: "",
  notes: "",
};

function Field({ label, description, children, span }) {
  return (
    <div className={`space-y-1.5 ${span ? "sm:col-span-2" : ""}`}>
      <label className="block text-xs font-medium text-zinc-300">
        {label}
      </label>
      {children}
      {description ? (
        <p className="text-[11px] text-zinc-500">{description}</p>
      ) : null}
    </div>
  );
}

export default function CompanyForm({ company }) {
  const router = useRouter();
  const isEdit = Boolean(company);
  const [form, setForm] = useState(() =>
    company
      ? { ...EMPTY, ...company }
      : { ...EMPTY }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = isEdit ? `/api/companies/${company.id}` : "/api/companies";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      if (isEdit) {
        router.refresh();
      } else {
        router.push(`/companies/${data.company.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 flex items-center gap-2.5">
          <AlertCircle className="size-5 shrink-0 text-rose-400" />
          {error}
        </div>
      ) : null}

      {/* Basic Company Info */}
      <section className="glass-card p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2.5 pb-4 border-b border-zinc-800/80">
          <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Building2 className="size-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-100">Company Details</h3>
            <p className="text-xs text-zinc-500">Essential background information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Company Name *" span>
            <input
              required
              className="input-glass w-full"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. OpenAI, Stripe, Linear"
            />
          </Field>
          <Field label="Website">
            <input
              className="input-glass w-full"
              value={form.website || ""}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://company.com"
            />
          </Field>
          <Field label="Industry">
            <input
              className="input-glass w-full"
              value={form.industry || ""}
              onChange={(e) => set("industry", e.target.value)}
              placeholder="e.g. AI, Fintech, Developer Tools"
            />
          </Field>
          <Field label="What They're Building" span>
            <textarea
              className="input-glass w-full"
              rows={2}
              value={form.what_building || ""}
              onChange={(e) => set("what_building", e.target.value)}
              placeholder="Quick summary of their product, mission, or stack."
            />
          </Field>
          <Field label="Location">
            <input
              className="input-glass w-full"
              value={form.location || ""}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. San Francisco, CA / London / Remote"
            />
          </Field>
          <Field label="Work Arrangement">
            <select
              className="input-glass w-full"
              value={form.remote_type || "unknown"}
              onChange={(e) => set("remote_type", e.target.value)}
            >
              {REMOTE_TYPES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Source" span>
            <input
              className="input-glass w-full"
              value={form.source || ""}
              onChange={(e) => set("source", e.target.value)}
              placeholder="e.g. Y Combinator, LinkedIn, Referral from Sam"
            />
          </Field>
        </div>
      </section>

      {/* Application & Status */}
      <section className="glass-card p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2.5 pb-4 border-b border-zinc-800/80">
          <div className="flex size-7 items-center justify-center rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400">
            <GitBranch className="size-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-100">Status &amp; Pipeline</h3>
            <p className="text-xs text-zinc-500">Current progress in the interview cycle</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Hiring Status">
            <select
              className="input-glass w-full"
              value={form.hiring_status}
              onChange={(e) => set("hiring_status", e.target.value)}
            >
              {HIRING_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Application Status">
            <select
              className="input-glass w-full"
              value={form.application_status}
              onChange={(e) => set("application_status", e.target.value)}
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Priority Level">
            <select
              className="input-glass w-full"
              value={form.priority}
              onChange={(e) => set("priority", e.target.value)}
            >
              {PRIORITIES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date Applied">
            <input
              type="date"
              className="input-glass w-full"
              value={form.date_applied || ""}
              onChange={(e) => set("date_applied", e.target.value)}
            />
          </Field>
          <Field label="Follow-up Date">
            <input
              type="date"
              className="input-glass w-full"
              value={form.follow_up_date || ""}
              onChange={(e) => set("follow_up_date", e.target.value)}
            />
          </Field>
        </div>

        {form.application_status === "rejected" ? (
          <div className="mt-4 pt-4 border-t border-zinc-800/80">
            <Field label="Rejection Feedback &amp; Reflection">
              <textarea
                className="input-glass w-full"
                rows={2}
                value={form.rejection_reason || ""}
                onChange={(e) => set("rejection_reason", e.target.value)}
                placeholder="What feedback was shared, or what did you learn from this process?"
              />
            </Field>
          </div>
        ) : null}
      </section>

      {/* Compensation & Contact */}
      <section className="glass-card p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2.5 pb-4 border-b border-zinc-800/80">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <DollarSign className="size-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-100">Compensation &amp; Links</h3>
            <p className="text-xs text-zinc-500">Pay details and recruiter contact points</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Application Link">
            <input
              className="input-glass w-full"
              value={form.application_link || ""}
              onChange={(e) => set("application_link", e.target.value)}
              placeholder="https://company.com/jobs/123"
            />
          </Field>
          <Field label="Contact Email / Recruiter">
            <input
              type="email"
              className="input-glass w-full"
              value={form.contact_email || ""}
              onChange={(e) => set("contact_email", e.target.value)}
              placeholder="hiring@company.com"
            />
          </Field>
          <Field label="Stipend / Salary Details" span>
            <input
              className="input-glass w-full"
              value={form.stipend_details || ""}
              onChange={(e) => set("stipend_details", e.target.value)}
              placeholder="e.g. $8,000/month + housing stipend, or $140k base"
            />
          </Field>
          <label className="flex items-center gap-2.5 sm:col-span-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="size-4 rounded border-zinc-700 text-indigo-600 focus:ring-0"
              checked={Boolean(form.stipend_mentioned)}
              onChange={(e) => set("stipend_mentioned", e.target.checked)}
            />
            <span className="text-xs text-zinc-300 font-medium">
              Stipend or compensation was explicitly mentioned
            </span>
          </label>
        </div>
      </section>

      {/* Notes */}
      <section className="glass-card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <FileText className="size-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-100">Personal Notes</h3>
            <p className="text-xs text-zinc-500">Interview observations, referrals, reminders</p>
          </div>
        </div>

        <textarea
          className="input-glass w-full"
          rows={3}
          value={form.notes || ""}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Interview feedback, connections, next steps..."
        />
      </section>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin size-3.5 text-white" />
              Saving...
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Add Company"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl bg-zinc-800/80 border border-zinc-700/60 px-4 py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
