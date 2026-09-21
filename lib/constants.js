export const HIRING_STATUSES = [
  { value: "hiring", label: "Hiring" },
  { value: "not_hiring", label: "Not hiring" },
  { value: "unknown", label: "Unknown" },
];

export const APPLICATION_STATUSES = [
  { value: "not_applied", label: "Not applied" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "ghosted", label: "Ghosted" },
];

export const PRIORITIES = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const REMOTE_TYPES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "Onsite" },
  { value: "unknown", label: "Unknown" },
];

export const APPLICATION_STATUS_STYLES = {
  not_applied: { dot: "bg-zinc-400", text: "text-zinc-300", bg: "bg-zinc-800/60", border: "border-zinc-700/50" },
  applied: { dot: "bg-sky-400", text: "text-sky-300", bg: "bg-sky-950/40", border: "border-sky-500/30" },
  interviewing: { dot: "bg-amber-400", text: "text-amber-300", bg: "bg-amber-950/40", border: "border-amber-500/30" },
  offer: { dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-950/40", border: "border-emerald-500/30" },
  rejected: { dot: "bg-rose-400", text: "text-rose-300", bg: "bg-rose-950/40", border: "border-rose-500/30" },
  ghosted: { dot: "bg-zinc-500", text: "text-zinc-400", bg: "bg-zinc-900/50", border: "border-zinc-800" },
};

export const HIRING_STATUS_STYLES = {
  hiring: { dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-950/40", border: "border-emerald-500/30" },
  not_hiring: { dot: "bg-rose-400", text: "text-rose-300", bg: "bg-rose-950/40", border: "border-rose-500/30" },
  unknown: { dot: "bg-zinc-400", text: "text-zinc-300", bg: "bg-zinc-800/60", border: "border-zinc-700/50" },
};

export const PRIORITY_STYLES = {
  high: { dot: "bg-rose-400", text: "text-rose-300", bg: "bg-rose-950/40", border: "border-rose-500/30" },
  medium: { dot: "bg-amber-400", text: "text-amber-300", bg: "bg-amber-950/40", border: "border-amber-500/30" },
  low: { dot: "bg-zinc-400", text: "text-zinc-300", bg: "bg-zinc-800/60", border: "border-zinc-700/50" },
};

export function labelFor(list, value) {
  const found = list.find((item) => item.value === value);
  return found ? found.label : value;
}
