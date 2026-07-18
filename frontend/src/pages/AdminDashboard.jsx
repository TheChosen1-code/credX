import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Building2,
  Briefcase,
  Users,
  Clock,
} from "lucide-react";

import AdminSidebar from "../components/admin/AdminSidebar";
import StatCard from "../components/admin/StatCard";
import CompaniesTable from "../components/admin/CompaniesTable";
import JobApprovalCard from "../components/admin/JobApprovalCard";
import ApplicationsTable from "../components/admin/ApplicationsTable";

// Replace this with your real service layer, e.g.
// import { adminService } from "../services/adminService";
const adminService = {
  getAllCompanies: async () => MOCK_COMPANIES,
  getAllJobs: async () => MOCK_JOBS,
  getAllApplications: async () => MOCK_APPLICATIONS,
  approveJob: async (jobId) => ({ ...MOCK_JOBS.find((j) => j.id === jobId), status: "APPROVED" }),
  rejectJob: async (jobId) => ({ ...MOCK_JOBS.find((j) => j.id === jobId), status: "REJECTED" }),
};

const ACCENT = "#2F6FED";
const JOB_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED", "CLOSED"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobFilter, setJobFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [busyJobId, setBusyJobId] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [companiesRes, jobsRes, applicationsRes] = await Promise.all([
        adminService.getAllCompanies(),
        adminService.getAllJobs(),
        adminService.getAllApplications(),
      ]);
      setCompanies(companiesRes);
      setJobs(jobsRes);
      setApplications(applicationsRes);
      setLoading(false);
    })();
  }, []);

  const pendingCount = useMemo(
    () => jobs.filter((j) => j.status === "PENDING").length,
    [jobs]
  );

  const visibleJobs = useMemo(
    () =>
      jobFilter === "ALL" ? jobs : jobs.filter((j) => j.status === jobFilter),
    [jobs, jobFilter]
  );

  const handleApprove = async (jobId) => {
    setBusyJobId(jobId);
    try {
      const updated = await adminService.approveJob(jobId);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
    } finally {
      setBusyJobId(null);
    }
  };

  const handleReject = async (jobId) => {
    setBusyJobId(jobId);
    try {
      const updated = await adminService.rejectJob(jobId);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
    } finally {
      setBusyJobId(null);
    }
  };

  const TAB_META = {
    overview: {
      title: "Overview",
      subtitle: "A quick snapshot of the placement cell's activity.",
    },
    companies: {
      title: "Companies",
      subtitle: "Every company that has signed up on the platform.",
    },
    jobs: {
      title: "Jobs",
      subtitle: "Review job postings and approve or reject them.",
    },
    applications: {
      title: "Applications",
      subtitle: "Every student application across all jobs.",
    },
  };

  return (
    <div
      className="flex min-h-screen bg-neutral-50"
      style={{ "--accent": ACCENT, "--accent-tint": "#EAF1FF" }}
    >
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={() => console.log("logout")}
      />

      <main className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-semibold text-(--accent)">
              Placement Cell Console
            </p>
            <h1 className="mt-1 text-[30px] font-black tracking-tight text-neutral-900">
              {TAB_META[activeTab].title}
            </h1>
            <p className="mt-1 text-[14px] text-neutral-500">
              {TAB_META[activeTab].subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5">
              <Search size={16} className="text-neutral-400" />
              <input
                placeholder="Search"
                className="w-40 bg-transparent text-[13.5px] outline-none placeholder:text-neutral-400"
              />
            </div>
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white"
            >
              <Bell size={17} className="text-neutral-500" />
              {pendingCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--accent-tint)] text-[12px] font-bold text-(--accent)">
                AD
              </div>
              <div className="pr-1">
                <p className="text-[13px] font-semibold leading-tight text-neutral-900">
                  Admin
                </p>
                <p className="text-[11px] text-neutral-400">Super Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards, always visible for quick context */}
        <div className="mt-7 grid grid-cols-4 gap-4">
          <StatCard icon={Building2} label="Companies" value={companies.length} />
          <StatCard icon={Briefcase} label="Jobs posted" value={jobs.length} />
          <StatCard icon={Clock} label="Pending approvals" value={pendingCount} />
          <StatCard icon={Users} label="Applications" value={applications.length} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="mt-7"
          >
            {loading ? (
              <div className="py-24 text-center text-[14px] text-neutral-400">
                Loading…
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <div className="grid grid-cols-2 gap-5">
                    <section>
                      <h2 className="mb-3 text-[15px] font-bold text-neutral-900">
                        Jobs awaiting approval
                      </h2>
                      <div className="flex flex-col gap-3">
                        {jobs
                          .filter((j) => j.status === "PENDING")
                          .slice(0, 3)
                          .map((job) => (
                            <JobApprovalCard
                              key={job.id}
                              job={job}
                              busy={busyJobId === job.id}
                              onApprove={handleApprove}
                              onReject={handleReject}
                            />
                          ))}
                        {pendingCount === 0 && (
                          <p className="text-[13.5px] text-neutral-400">
                            Nothing pending right now.
                          </p>
                        )}
                      </div>
                    </section>
                    <section>
                      <h2 className="mb-3 text-[15px] font-bold text-neutral-900">
                        Recently registered companies
                      </h2>
                      <CompaniesTable companies={companies.slice(0, 4)} />
                    </section>
                  </div>
                )}

                {activeTab === "companies" && (
                  <CompaniesTable companies={companies} />
                )}

                {activeTab === "jobs" && (
                  <div>
                    <div className="mb-4 flex gap-2">
                      {JOB_FILTERS.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setJobFilter(f)}
                          className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                            jobFilter === f
                              ? "bg-(--accent)] text-white"
                              : "bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          {f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {visibleJobs.map((job) => (
                        <JobApprovalCard
                          key={job.id}
                          job={job}
                          busy={busyJobId === job.id}
                          onApprove={handleApprove}
                          onReject={handleReject}
                        />
                      ))}
                      {visibleJobs.length === 0 && (
                        <p className="text-[13.5px] text-neutral-400">
                          No jobs match this filter.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "applications" && (
                  <ApplicationsTable applications={applications} />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mock data — remove once adminService is wired to the real backend.
// Shapes mirror the User / JobPosting / Application entities exactly.
// ---------------------------------------------------------------------------

const MOCK_COMPANIES = [
  {
    id: "c1",
    companyName: "Atlassian",
    email: "atlassian@gmail.com",
    website: "https://www.atlassian.com",
    location: "Bengaluru",
    jobCount: 2,
  },
  {
    id: "c2",
    companyName: "Chime",
    email: "hr@chime.com",
    website: "https://chime.com",
    location: "New York",
    jobCount: 1,
  },
];

const MOCK_JOBS = [
  {
    id: 1,
    title: "Backend Software Engineer Intern",
    description: "Java Spring Boot Developer building core banking services.",
    location: "Bengaluru",
    packageOffered: "18 LPA",
    minimumCgpa: 7.5,
    applicationDeadline: "2026-08-20",
    status: "PENDING",
    company: MOCK_COMPANIES[0],
  },
  {
    id: 2,
    title: "Frontend Engineer",
    description: "React developer for the customer dashboard team.",
    location: "Remote",
    packageOffered: "22 LPA",
    minimumCgpa: 7.0,
    applicationDeadline: "2026-09-01",
    status: "APPROVED",
    company: MOCK_COMPANIES[1],
  },
];

const MOCK_APPLICATIONS = [
  {
    id: "a1",
    student: {
      fullName: "Piyush Mishra",
      email: "piyush@gmail.com",
      resumeUrl: "https://res.cloudinary.com/demo/resume.pdf",
    },
    jobPosting: MOCK_JOBS[0],
    status: "PENDING",
    appliedAt: "2026-07-10T10:00:00",
  },
];