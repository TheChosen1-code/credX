import React from "react";
import { FileText } from "lucide-react";
import StatusBadge from "./StatusBadge";

// `applications` items follow the Application entity: { student, jobPosting, status, appliedAt }
export default function ApplicationsTable({ applications }) {
  if (!applications?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 py-16 text-center text-[14px] text-neutral-400">
        No applications submitted yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
      <table className="w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50/60 text-[12px] uppercase tracking-wide text-neutral-400">
            <th className="px-5 py-3.5 font-semibold">Student</th>
            <th className="px-5 py-3.5 font-semibold">Job</th>
            <th className="px-5 py-3.5 font-semibold">Company</th>
            <th className="px-5 py-3.5 font-semibold">Applied on</th>
            <th className="px-5 py-3.5 font-semibold">Status</th>
            <th className="px-5 py-3.5 font-semibold">Resume</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app.id}
              className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60"
            >
              <td className="px-5 py-4">
                <p className="font-semibold text-neutral-900">
                  {app.student?.fullName}
                </p>
                <p className="text-[12px] text-neutral-400">
                  {app.student?.email}
                </p>
              </td>
              <td className="px-5 py-4 text-neutral-600">
                {app.jobPosting?.title}
              </td>
              <td className="px-5 py-4 text-neutral-500">
                {app.jobPosting?.company?.companyName}
              </td>
              <td className="px-5 py-4 text-neutral-500">
                {new Date(app.appliedAt).toLocaleDateString()}
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-5 py-4">
                {app.student?.resumeUrl ? (
                  <a
                    href={app.student.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-(--accent)hover:underline"
                  >
                    <FileText size={14} /> View
                  </a>
                ) : (
                  <span className="text-neutral-300">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}