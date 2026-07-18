import React from "react";
import { Globe, MapPin, Briefcase } from "lucide-react";

// `companies` items are User records with role === "ROLE_COMPANY".
export default function CompaniesTable({ companies }) {
  if (!companies?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 py-16 text-center text-[14px] text-neutral-400">
        No companies have signed up yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
      <table className="w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50/60 text-[12px] uppercase tracking-wide text-neutral-400">
            <th className="px-5 py-3.5 font-semibold">Company</th>
            <th className="px-5 py-3.5 font-semibold">Website</th>
            <th className="px-5 py-3.5 font-semibold">Location</th>
            <th className="px-5 py-3.5 font-semibold">Jobs posted</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr
              key={c.id}
              className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--accent-tint) text-[13px] font-bold text-(--accent)">
                    {c.companyName?.charAt(0) ?? "C"}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {c.companyName}
                    </p>
                    <p className="text-[12px] text-neutral-400">{c.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-neutral-500">
                <a
                  href={c.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-(--accent)"
                >
                  <Globe size={14} />
                  {c.website?.replace(/^https?:\/\//, "")}
                </a>
              </td>
              <td className="px-5 py-4 text-neutral-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} />
                  {c.location}
                </span>
              </td>
              <td className="px-5 py-4 text-neutral-500">
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase size={14} />
                  {c.jobCount ?? 0}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}