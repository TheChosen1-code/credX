import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import Sidebar from '../components/student/Sidebar';
import Navbar from '../components/student/Navbar';
import SummaryCard from '../components/student/SummaryCard';
import JobCard from '../components/student/JobCard';
import StatusBadge from '../components/student/StatusBadge';
import EmptyState from '../components/student/EmptyState';
import ProfileCard from '../components/student/ProfileCard';
import { profile, matchedJobs as mockJobs, applications as mockApps } from '../data/studentData';
import * as jobApi from '../api/jobApi';
import * as applicationApi from '../api/applicationApi';
import { formatDate } from '../utils';

export default function StudentDashboard() {
  const [state, setState] = useState({
    activeTab: 'dashboard',
    jobs: mockJobs,
    apps: mockApps,
    saved: [],
    selectedJob: null,
    toast: null,
    sidebarOpen: false,
    loading: true,
  });

  const { activeTab, jobs, apps, saved, selectedJob, toast, sidebarOpen } = state;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([jobApi.getRecommended(), applicationApi.getMyApplications()]);
        if (!mounted) return;
        setState(s => ({ ...s, jobs: jobsRes || mockJobs, apps: appsRes || mockApps, loading: false }));
      } catch (e) {
        console.warn('API fetch failed, using mock data', e);
        if (!mounted) return;
        setState(s => ({ ...s, jobs: mockJobs, apps: mockApps, loading: false }));
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Toast notification
  const showToast = (message, type = 'success') => {
    setState(s => ({ ...s, toast: { message, type } }));
    setTimeout(() => setState(s => ({ ...s, toast: null })), 3000);
  };

  // Check if job is already applied
  const isApplied = (job) => apps.some(a => a.company === job.company && a.title === job.title);

  // Handle job application
  const handleApply = async (job) => {
    if (isApplied(job)) {
      showToast('You have already applied to this job!', 'warning');
      return;
    }
    try {
      const res = await applicationApi.applyToJob(job.id);
      const newApp = res || { id: Date.now(), company: job.company, title: job.title, date: new Date().toISOString(), status: 'Applied' };
      setState(s => ({ ...s, apps: [newApp, ...s.apps], selectedJob: null }));
      showToast(`Successfully applied to ${job.title} at ${job.company}!`);
    } catch (e) {
      // fallback to mock update
      const newApp = { id: Date.now(), company: job.company, title: job.title, date: new Date().toISOString(), status: 'Applied' };
      setState(s => ({ ...s, apps: [newApp, ...s.apps], selectedJob: null }));
      showToast(`Applied locally to ${job.title} (offline)`);
    }
  };

  // Handle save/unsave job
  const handleSave = (job) => {
    const isSaved = saved.includes(job.id);
    setState(s => ({
      ...s,
      saved: isSaved ? s.saved.filter(id => id !== job.id) : [job.id, ...s.saved]
    }));
    showToast(isSaved ? 'Job removed from saved' : 'Job saved successfully!');
  };

  // Handle view job details
  const handleView = (job) => setState(s => ({ ...s, selectedJob: job }));
  const handleClose = () => setState(s => ({ ...s, selectedJob: null }));

  // Handle tab change
  const handleTabChange = (tab) => setState(s => ({ ...s, activeTab: tab, sidebarOpen: false }));

  // Get filtered jobs based on active tab
  const getFilteredJobs = () => {
    if (activeTab === 'saved') return jobs.filter(j => saved.includes(j.id));
    if (activeTab === 'applied') return jobs.filter(j => isApplied(j));
    return jobs; // dashboard or ai-matched
  };

  const filteredJobs = getFilteredJobs();
  const shortlistedCount = apps.filter(a => a.status === 'Shortlisted').length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <Sidebar
        profile={profile}
        active={activeTab}
        onSelect={handleTabChange}
        open={sidebarOpen}
        onClose={() => setState(s => ({ ...s, sidebarOpen: false }))}
      />

      {/* Main Content */}
      <div className="lg:pl-60">
        <div className="max-w-7xl mx-auto">
          {/* Navbar */}
          <Navbar
            profile={profile}
            onMenuClick={() => setState(s => ({ ...s, sidebarOpen: !s.sidebarOpen }))}
          />

          <main className="p-4 md:p-6 space-y-6">
            {/* Summary Cards */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <SummaryCard type="sparkles" value={jobs.length} label="Jobs matched for you" />
              <SummaryCard type="files" value={apps.length} label="Jobs applied" />
              <SummaryCard type="check" value={shortlistedCount} label="Companies shortlisted you" />
            </motion.section>

            {/* Jobs Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">
                    {activeTab === 'saved' ? 'Saved Jobs' : activeTab === 'applied' ? 'Applied Jobs' : 'Recommended Jobs'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {activeTab === 'saved'
                      ? `${saved.length} jobs saved`
                      : activeTab === 'applied'
                      ? `${apps.length} applications submitted`
                      : 'Jobs ranked using AI based on your skills and profile'}
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTabChange('dashboard')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      activeTab === 'dashboard'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Jobs
                  </button>
                  <button
                    onClick={() => handleTabChange('saved')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      activeTab === 'saved'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Saved ({saved.length})
                  </button>
                </div>
              </div>

              {/* Jobs Grid */}
              {filteredJobs.length === 0 ? (
                <EmptyState
                  title={
                    activeTab === 'saved'
                      ? 'No Saved Jobs'
                      : activeTab === 'applied'
                      ? 'No Applications Yet'
                      : 'No AI Matches Yet'
                  }
                  subtitle={
                    activeTab === 'saved'
                      ? 'Save jobs to view them here'
                      : activeTab === 'applied'
                      ? 'Apply to jobs to track them here'
                      : 'Complete your profile to receive better recommendations'
                  }
                  action={
                    activeTab !== 'saved' && (
                      <button
                        onClick={() => handleTabChange('dashboard')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {activeTab === 'applied' ? 'Browse Jobs' : 'Complete Profile'}
                      </button>
                    )
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredJobs.map((job, idx) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <JobCard
                          job={job}
                          onView={handleView}
                          onApply={handleApply}
                          onSave={handleSave}
                          saved={saved.includes(job.id)}
                          applied={isApplied(job)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.section>

            {/* Applications Table */}
            {activeTab === 'dashboard' && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg md:text-xl font-semibold mb-3">Application Status</h3>
                {apps.length === 0 ? (
                  <EmptyState
                    title="No Applications Yet"
                    subtitle="Apply to jobs to track them here"
                  />
                ) : (
                  <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr className="text-left text-gray-600">
                          <th className="px-4 py-3 font-medium">Company</th>
                          <th className="px-4 py-3 font-medium">Job</th>
                          <th className="px-4 py-3 font-medium">Applied On</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apps.map((a, idx) => (
                          <motion.tr
                            key={a.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-b hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium">{a.company}</td>
                            <td className="px-4 py-3 text-gray-700">{a.title}</td>
                            <td className="px-4 py-3 text-gray-600">{formatDate(a.date)}</td>
                            <td className="px-4 py-3">
                              <StatusBadge status={a.status} />
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => {
                                  const job = jobs.find(j => j.company === a.company && j.title === a.title);
                                  if (job) handleView(job);
                                }}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                              >
                                View Details
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.section>
            )}

            {/* Mobile Profile Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:hidden"
            >
              <ProfileCard profile={profile} />
            </motion.section>
          </main>
        </div>
      </div>

      {/* Desktop Profile Card - Fixed Right */}
      <div className="hidden lg:block fixed right-6 top-24 w-80">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <ProfileCard profile={profile} />
        </motion.div>
      </div>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">{selectedJob.company}</div>
                  <h3 className="text-2xl font-bold">{selectedJob.title}</h3>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Job Details */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm">📍 {selectedJob.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm">💼 {selectedJob.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <span className="text-sm">💰 {selectedJob.salary}</span>
                  </div>
                </div>

                {/* AI Match Score */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">AI Match Score</span>
                    <span className="text-2xl font-bold text-blue-600">{selectedJob.match}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      style={{ width: `${selectedJob.match}%` }}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="font-semibold mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map(s => (
                      <span
                        key={s}
                        className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <span className="text-sm font-medium">
                      ⏰ Application Deadline: {formatDate(selectedJob.deadline)}
                    </span>
                  </div>
                </div>

                {/* Job Description (if available) */}
                <div>
                  <h4 className="font-semibold mb-2">About the Role</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We are looking for a talented {selectedJob.title} to join our team at {selectedJob.company}.
                    This is a {selectedJob.type.toLowerCase()} position based in {selectedJob.location}.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-white transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => handleSave(selectedJob)}
                  className={`px-5 py-2.5 rounded-lg transition-all font-medium ${
                    saved.includes(selectedJob.id)
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  {saved.includes(selectedJob.id) ? 'Saved ✓' : 'Save Job'}
                </button>
                <button
                  onClick={() => handleApply(selectedJob)}
                  disabled={isApplied(selectedJob)}
                  className={`px-5 py-2.5 rounded-lg transition-all font-medium ${
                    isApplied(selectedJob)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                  }`}
                >
                  {isApplied(selectedJob) ? 'Already Applied ✓' : 'Apply Now'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 max-w-sm"
          >
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
                toast.type === 'success'
                  ? 'bg-green-600 text-white'
                  : toast.type === 'warning'
                  ? 'bg-amber-500 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              <Check className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}