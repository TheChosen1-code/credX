import React from "react";

export default function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: tint ?? "var(--accent-tint)" }}
      >
        <Icon size={19} style={{ color: "var(--accent)" }} strokeWidth={2.1} />
      </div>
      <div>
        <p className="text-[22px] font-black leading-none text-neutral-900">
          {value}
        </p>
        <p className="mt-1.5 text-[13px] text-neutral-500">{label}</p>
      </div>
    </div>
  );
}