"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass = "w-full rounded-sm px-3 py-2 text-sm";

export default function RolesManager({ companyId, roles }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [stipendMentioned, setStipendMentioned] = useState(false);
  const [stipendDetails, setStipendDetails] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function resetForm() {
    setTitle("");
    setLink("");
    setStipendMentioned(false);
    setStipendDetails("");
    setNotes("");
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("A role needs a title.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/companies/${companyId}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          link,
          stipend_mentioned: stipendMentioned,
          stipend_details: stipendDetails,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add the role.");
      resetForm();
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(roleId) {
    await fetch(`/api/roles/${roleId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {roles.length === 0 ? (
        <p className="font-mono text-xs text-ink-soft">No open roles logged yet.</p>
      ) : (
        <ul className="space-y-2">
          {roles.map((role) => (
            <li key={role.id} className="rounded-sm border border-line bg-[#fbf8f1] px-3 py-2.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-semibold text-ink">
                    {role.title}
                  </p>
                  {role.link ? (
                    <a
                      href={role.link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[11px] text-slate underline underline-offset-2"
                    >
                      posting link
                    </a>
                  ) : null}
                  {role.stipend_mentioned ? (
                    <p className="mt-1 font-mono text-[11px] text-forest">
                      Stipend: {role.stipend_details || "mentioned"}
                    </p>
                  ) : null}
                  {role.notes ? (
                    <p className="mt-1 text-xs text-ink-soft">{role.notes}</p>
                  ) : null}
                </div>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="font-mono text-[11px] uppercase tracking-wide text-rust hover:text-rust-dark"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <form onSubmit={handleAdd} className="space-y-3 rounded-sm border border-dashed border-line p-3">
          {error ? <p className="text-xs text-rust">{error}</p> : null}
          <input
            className={inputClass}
            placeholder="Role title, e.g. Frontend Engineer Intern"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Posting link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={stipendMentioned}
              onChange={(e) => setStipendMentioned(e.target.checked)}
            />
            <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
              Stipend mentioned
            </span>
          </label>
          <input
            className={inputClass}
            placeholder="Stipend details"
            value={stipendDetails}
            onChange={(e) => setStipendDetails(e.target.value)}
          />
          <textarea
            className={inputClass}
            rows={2}
            placeholder="Notes on this role"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-sm bg-ink px-4 py-1.5 font-mono text-xs uppercase tracking-wide text-paper hover:bg-rust disabled:opacity-60"
            >
              {saving ? "Adding..." : "Add role"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
              className="font-mono text-xs uppercase tracking-wide text-ink-soft"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-sm border border-ink px-4 py-1.5 font-mono text-xs uppercase tracking-wide text-ink hover:bg-ink hover:text-paper"
        >
          + Log an open role
        </button>
      )}
    </div>
  );
}
