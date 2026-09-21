import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_STYLES,
  HIRING_STATUSES,
  HIRING_STATUS_STYLES,
  PRIORITIES,
  PRIORITY_STYLES,
  labelFor,
} from "@/lib/constants";

export function ApplicationStatusBadge({ value }) {
  const s = APPLICATION_STATUS_STYLES[value] || APPLICATION_STATUS_STYLES.not_applied;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${s.bg} ${s.border} border px-2.5 py-0.5 text-[11px] font-medium ${s.text}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {labelFor(APPLICATION_STATUSES, value)}
    </span>
  );
}

export function HiringStatusBadge({ value }) {
  const s = HIRING_STATUS_STYLES[value] || HIRING_STATUS_STYLES.unknown;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${s.bg} ${s.border} border px-2.5 py-0.5 text-[11px] font-medium ${s.text}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {labelFor(HIRING_STATUSES, value)}
    </span>
  );
}

export function PriorityStamp({ value }) {
  const s = PRIORITY_STYLES[value] || PRIORITY_STYLES.medium;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${s.bg} ${s.border} border px-2.5 py-0.5 text-[11px] font-medium ${s.text}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {labelFor(PRIORITIES, value)}
    </span>
  );
}
