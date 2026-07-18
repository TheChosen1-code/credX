import React from "react";

// Central place that maps every status string used across the app
// (JobPosting.status, Application.status) to a color treatment.
const STYLES = {
  PENDING: { bg: "#FEF3C7", text: "#92400E", dot: "#D97706" },
  APPROVED: { bg: "#DCFCE7", text: "#166534", dot: "#16A34A" },
  ACTIVE: { bg: "#DCFCE7", text: "#166534", dot: "#16A34A" },
  REJECTED: { bg: "#FEE2E2", text: "#991B1B", dot: "#DC2626" },
  CLOSED: { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" },
  SHORTLISTED: { bg: "#DBEAFE", text: "#1E40AF", dot: "#2563EB" },
  SELECTED: { bg: "#DCFCE7", text: "#166534", dot: "#16A34A" },
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] ?? STYLES.CLOSED;
  const label = status
    ? status.charAt(0) + status.slice(1).toLowerCase()
    : "Unknown";

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: style.dot }}
      />
      {label}
    </span>
  );
}