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
import * as adminApi from "../api/adminApi";
import { useAuth } from "../context/AuthContext";

const ACCENT = "#2F6FED";
const JOB_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED", "CLOSED"];

export default function AdminDashboard() {
  const { logout } = useAuth();
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
      try {
        const [companiesRes, jobsRes, applicationsRes, pendingJobsRes] = await Promise.all([
          adminApi.getAllCompanies().catch(e => {
            console.warn("Could not fetch companies from API, using mock", e);
            return MOCK_COMPANIES;
          }),
          adminApi.getAllJobs().catch(e => {
            console.warn("Could not fetch jobs from API, using mock", e);
            return MOCK_JOBS;
          }),
          adminApi.getAllApplications().catch(e => {
            console.warn("Could not fetch applications from API, using mock", e);
            return MOCK_APPLICATIONS;
          }),
          adminApi.getPendingJobs().catch(e => {
            console.warn("Could not fetch pending jobs from API", e);
            return [];
          }),
        ]);

        let finalJobsList = [...jobsRes];
        if (pendingJobsRes && pendingJobsRes.length > 0) {
          const pendingIds = new Set(pendingJobsRes.map(j => j.id));
          finalJobsList = finalJobsList.filter(j => !pendingIds.has(j.id) && j.status !== 'PENDING');
          finalJobsList = [...pendingJobsRes, ...finalJobsList];
        }

        // Normalize companies (Users with role = ROLE_COMPANY)

        const normalizedCompanies = (companiesRes || []).map(c => {
          // If already flat (mock data), return it
          if (c.companyName && !c.role) return c;
          return {
            id: c.id,
            companyName: c.companyName || c.fullName || 'Unnamed Company',
            email: c.email || 'N/A',
            website: c.website || 'N/A',
            location: c.location || 'Remote',
            jobCount: finalJobsList ? finalJobsList.filter(j => j.company?.id === c.id).length : 0,
          };
        });

        // Normalize jobs
        const normalizedJobs = (finalJobsList || []).map(j => {
          if (j.company && typeof j.company === 'object' && !j.company.role) return j; // already formatted

          
          let companyData = { companyName: 'Company' };
          if (j.company) {
            companyData = {
              companyName: j.company.companyName || j.company.fullName || 'Company',
              location: j.company.location || 'Remote',
              website: j.company.website || '',
            };
          } else if (j.companyName) {
            companyData = { companyName: j.companyName };
          }

          return {
            id: j.id,
            title: j.title || 'Untitled Role',
            description: j.description || 'No description provided.',
            location: j.location || 'Remote',
            packageOffered: j.packageOffered || 'N/A',
            minimumCgpa: j.minimumCgpa || 0,
            applicationDeadline: j.applicationDeadline || 'Open',
            status: j.status || 'PENDING',
            company: companyData,
          };
        });

        // Normalize applications
        const normalizedApps = (applicationsRes || []).map(a => {
          if (a.student && a.student.fullName && a.jobPosting && a.jobPosting.company) return a; // already formatted
          
          return {
            id: a.id,
            student: {
              fullName: a.student?.fullName || a.student?.username || 'Student',
              email: a.student?.email || '',
              resumeUrl: a.student?.resumeUrl || null,
            },
            jobPosting: {
              title: a.jobPosting?.title || 'Job Role',
              company: {
                companyName: a.jobPosting?.company?.companyName || a.jobPosting?.company?.fullName || 'Company',
              }
            },
            status: a.status || 'PENDING',
            appliedAt: a.appliedAt || new Date().toISOString(),
          };
        });

        setCompanies(normalizedCompanies);
        setJobs(normalizedJobs);
        setApplications(normalizedApps);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
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
      let updated;
      try {
        const res = await adminApi.approveJob(jobId);
        updated = {
          ...res,
          company: res.company ? {
            companyName: res.company.companyName || res.company.fullName || 'Company',
          } : { companyName: 'Company' }
        };
      } catch (e) {
        console.warn("Could not approve job on backend, fallback to local state change", e);
        const original = jobs.find((j) => j.id === jobId);
        updated = { ...original, status: "APPROVED" };
      }
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
    } finally {
      setBusyJobId(null);
    }
  };

  const handleReject = async (jobId) => {
    setBusyJobId(jobId);
    try {
      let updated;
      try {
        const res = await adminApi.rejectJob(jobId);
        updated = {
          ...res,
          company: res.company ? {
            companyName: res.company.companyName || res.company.fullName || 'Company',
          } : { companyName: 'Company' }
        };
      } catch (e) {
        console.warn("Could not reject job on backend, fallback to local state change", e);
        const original = jobs.find((j) => j.id === jobId);
        updated = { ...original, status: "REJECTED" };
      }
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
        onLogout={logout}
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-tint)] text-[12px] font-bold text-[var(--accent)]">
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                              ? "bg-[var(--accent)] text-white"
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
// Mock data — fallback for admin views.
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