"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteCompanyButton({ companyId }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/companies/${companyId}`, { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-rose-950/40 border border-rose-500/30 p-1.5 px-3 text-xs">
        <span className="text-zinc-300 font-medium">Delete this company?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg bg-rose-600 px-2.5 py-1 font-semibold text-white hover:bg-rose-500 disabled:opacity-50 transition-colors"
        >
          {deleting ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg bg-zinc-800 px-2.5 py-1 text-zinc-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
    >
      <Trash2 className="size-3.5" />
      Delete Company
    </button>
  );
}
