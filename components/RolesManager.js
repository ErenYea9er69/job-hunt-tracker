"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, Trash2, Plus } from "lucide-react";

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
      setError("Please enter a role title.");
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
        <div className="rounded-xl border border-dashed border-zinc-800 p-4 text-center">
          <p className="text-xs text-zinc-500">No open roles logged yet for this company.</p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {roles.map((role) => (
            <li
              key={role.id}
              className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-3.5 transition-colors hover:border-zinc-700/80"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-100 truncate">
                      {role.title}
                    </span>
                    {role.link ? (
                      <a
                        href={role.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <ExternalLink className="size-3" />
                        Posting
                      </a>
                    ) : null}
                  </div>

                  {role.stipend_mentioned ? (
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                        <span className="size-1 rounded-full bg-emerald-400" />
                        {role.stipend_details || "Stipend offered"}
                      </span>
                    </div>
                  ) : null}

                  {role.notes ? (
                    <p className="mt-1.5 text-xs text-zinc-400">
                      {role.notes}
                    </p>
                  ) : null}
                </div>

                <button
                  onClick={() => handleDelete(role.id)}
                  title="Remove role"
                  className="rounded-lg p-1 text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <form onSubmit={handleAdd} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3.5">
          {error ? <p className="text-xs text-rose-400">{error}</p> : null}
          <input
            className="input-glass w-full"
            placeholder="Role title (e.g. AI Engineer Intern)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="input-glass w-full"
            placeholder="Posting URL (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-300">
              <input
                type="checkbox"
                className="size-3.5 rounded border-zinc-700 text-indigo-600 focus:ring-0"
                checked={stipendMentioned}
                onChange={(e) => setStipendMentioned(e.target.checked)}
              />
              <span>Stipend mentioned</span>
            </label>
          </div>
          {stipendMentioned ? (
            <input
              className="input-glass w-full"
              placeholder="e.g. $3,000/mo or Paid"
              value={stipendDetails}
              onChange={(e) => setStipendDetails(e.target.value)}
            />
          ) : null}
          <textarea
            className="input-glass w-full"
            rows={2}
            placeholder="Notes about requirements, interview stages..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Role"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
              className="rounded-xl bg-zinc-800 border border-zinc-700/60 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-800 py-2.5 text-xs font-medium text-zinc-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-indigo-300 transition-all"
        >
          <Plus className="size-3.5" />
          Log an open role
        </button>
      )}
    </div>
  );
}
