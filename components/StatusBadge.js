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
  const style = APPLICATION_STATUS_STYLES[value] || APPLICATION_STATUS_STYLES.not_applied;
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider ${style}`}
    >
      {labelFor(APPLICATION_STATUSES, value)}
    </span>
  );
}

export function HiringStatusBadge({ value }) {
  const style = HIRING_STATUS_STYLES[value] || HIRING_STATUS_STYLES.unknown;
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider ${style}`}
    >
      {labelFor(HIRING_STATUSES, value)}
    </span>
  );
}

export function PriorityStamp({ value }) {
  const style = PRIORITY_STYLES[value] || PRIORITY_STYLES.medium;
  return (
    <span
      className={`stamp inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${style}`}
    >
      {labelFor(PRIORITIES, value)}
    </span>
  );
}
