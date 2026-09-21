"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide">
        <span className="text-ink-soft">Delete this file?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-rust hover:text-rust-dark"
        >
          {deleting ? "Removing..." : "Confirm"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-ink-soft hover:text-ink">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-rust"
    >
      Delete entry
    </button>
  );
}
