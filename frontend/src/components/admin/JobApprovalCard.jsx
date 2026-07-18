import React from "react";
import { Building2, MapPin, IndianRupee, GraduationCap, Calendar, Check, X } from "lucide-react";
import StatusBadge from "./StatusBadge";

// `job` is a JobPosting record with an embedded `company` (User) object.
export default function JobApprovalCard({ job, onApprove, onReject, busy }) {
  const isPending = job.status === "PENDING";

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--accent-tint) text-[14px] font-bold text-(--accent)">
            {job.company?.companyName?.charAt(0) ?? "C"}
          </div>
          <div>
            <p className="text-[15px] font-bold text-neutral-900">
              {job.title}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-neutral-500">
              <Building2 size={13} />
              {job.company?.companyName}
            </p>
          </div>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <p className="mt-3.5 line-clamp-2 text-[13.5px] leading-relaxed text-neutral-500">
        {job.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-4 text-[13px] text-neutral-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={13} /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IndianRupee size={13} /> {job.packageOffered}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <GraduationCap size={13} /> {job.minimumCgpa}+ CGPA
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={13} /> Deadline {job.applicationDeadline}
        </span>
      </div>

      {isPending && (
        <div className="mt-4 flex gap-2 border-t border-neutral-50 pt-4">
          <button
            type="button"
            disabled={busy}
            onClick={() => onApprove(job.id)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:bg-emerald-700 disabled:opacity-50"
          >
            <Check size={15} /> Approve
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onReject(job.id)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 px-4 py-2.5 text-[13.5px] font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <X size={15} /> Reject
          </button>
        </div>
      )}
    </div>
  );
}