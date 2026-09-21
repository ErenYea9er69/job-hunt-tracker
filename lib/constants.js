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
  not_applied: "bg-paper-dark text-ink-soft border-line",
  applied: "bg-slate/10 text-slate border-slate/40",
  interviewing: "bg-mustard/15 text-mustard-dark text-[var(--color-mustard)] border-mustard/40",
  offer: "bg-forest/10 text-forest border-forest/40",
  rejected: "bg-rust/10 text-rust border-rust/40",
  ghosted: "bg-ink/5 text-ink-soft border-line",
};

export const HIRING_STATUS_STYLES = {
  hiring: "bg-forest/10 text-forest border-forest/40",
  not_hiring: "bg-rust/10 text-rust border-rust/40",
  unknown: "bg-paper-dark text-ink-soft border-line",
};

export const PRIORITY_STYLES = {
  high: "bg-rust text-paper",
  medium: "bg-mustard text-paper",
  low: "bg-slate text-paper",
};

export function labelFor(list, value) {
  const found = list.find((item) => item.value === value);
  return found ? found.label : value;
}
