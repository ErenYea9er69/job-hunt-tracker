"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

function Field({ label, children, span }) {
  return (
    <label className={`block ${span ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass = "w-full rounded-sm px-3 py-2 text-sm";

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
        <div className="rounded-sm border border-rust bg-rust/10 px-4 py-2 text-sm text-rust-dark">
          {error}
        </div>
      ) : null}

      <section className="dossier-card p-5">
        <h2 className="mb-4 font-display text-lg font-semibold italic text-ink">
          Basics
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Company name" span>
            <input
              required
              className={inputClass}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Acme Robotics"
            />
          </Field>
          <Field label="Website">
            <input
              className={inputClass}
              value={form.website || ""}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://acme.com"
            />
          </Field>
          <Field label="Industry">
            <input
              className={inputClass}
              value={form.industry || ""}
              onChange={(e) => set("industry", e.target.value)}
              placeholder="Robotics, fintech, climate..."
            />
          </Field>
          <Field label="What they're building" span>
            <textarea
              className={inputClass}
              rows={3}
              value={form.what_building || ""}
              onChange={(e) => set("what_building", e.target.value)}
              placeholder="One or two sentences on the product and mission."
            />
          </Field>
          <Field label="Location">
            <input
              className={inputClass}
              value={form.location || ""}
              onChange={(e) => set("location", e.target.value)}
              placeholder="City, country"
            />
          </Field>
          <Field label="Work arrangement">
            <select
              className={inputClass}
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
              className={inputClass}
              value={form.source || ""}
              onChange={(e) => set("source", e.target.value)}
              placeholder="LinkedIn, referral from Sam, job board..."
            />
          </Field>
        </div>
      </section>

      <section className="dossier-card p-5">
        <h2 className="mb-4 font-display text-lg font-semibold italic text-ink">
          Status
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Hiring status">
            <select
              className={inputClass}
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
          <Field label="Application status">
            <select
              className={inputClass}
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
          <Field label="Priority">
            <select
              className={inputClass}
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
          <Field label="Date applied">
            <input
              type="date"
              className={inputClass}
              value={form.date_applied || ""}
              onChange={(e) => set("date_applied", e.target.value)}
            />
          </Field>
          <Field label="Follow up on">
            <input
              type="date"
              className={inputClass}
              value={form.follow_up_date || ""}
              onChange={(e) => set("follow_up_date", e.target.value)}
            />
          </Field>
        </div>
        {form.application_status === "rejected" ? (
          <div className="mt-4">
            <Field label="Rejection reason">
              <textarea
                className={inputClass}
                rows={2}
                value={form.rejection_reason || ""}
                onChange={(e) => set("rejection_reason", e.target.value)}
                placeholder="What did they tell you, if anything? Note your read on the real reason too."
              />
            </Field>
          </div>
        ) : null}
      </section>

      <section className="dossier-card p-5">
        <h2 className="mb-4 font-display text-lg font-semibold italic text-ink">
          Contact &amp; compensation
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Application link">
            <input
              className={inputClass}
              value={form.application_link || ""}
              onChange={(e) => set("application_link", e.target.value)}
              placeholder="https://acme.com/careers/123"
            />
          </Field>
          <Field label="Contact email">
            <input
              type="email"
              className={inputClass}
              value={form.contact_email || ""}
              onChange={(e) => set("contact_email", e.target.value)}
              placeholder="talent@acme.com"
            />
          </Field>
          <Field label="Stipend / pay details" span>
            <input
              className={inputClass}
              value={form.stipend_details || ""}
              onChange={(e) => set("stipend_details", e.target.value)}
              placeholder="e.g. $2,000/month stipend mentioned in posting"
            />
          </Field>
          <label className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={Boolean(form.stipend_mentioned)}
              onChange={(e) => set("stipend_mentioned", e.target.checked)}
            />
            <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
              A stipend or pay figure was mentioned
            </span>
          </label>
        </div>
      </section>

      <section className="dossier-card p-5">
        <h2 className="mb-4 font-display text-lg font-semibold italic text-ink">
          Notes
        </h2>
        <textarea
          className={inputClass}
          rows={4}
          value={form.notes || ""}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Interview impressions, names of people you spoke with, next steps..."
        />
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-sm bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-paper hover:bg-rust disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Save changes" : "Add to the log"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
