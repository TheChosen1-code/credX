import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/student/Sidebar';
import Navbar from '../components/student/Navbar';
import SummaryCard from '../components/student/SummaryCard';
import JobCard from '../components/student/JobCard';
import StatusBadge from '../components/student/StatusBadge';
import EmptyState from '../components/student/EmptyState';
import ProfileCard from '../components/student/ProfileCard';
import { profile, matchedJobs, applications } from '../data/studentData';
import { formatDate } from '../utils';

export default function StudentDashboard(){
  const [state, setState] = useState({ tab: 'dashboard', jobs: matchedJobs, apps: applications, saved: [], selectedJob: null });
  const { tab, jobs, apps, saved, selectedJob } = state;

  const handleView = (job) => setState(s => ({ ...s, selectedJob: job }));
  const handleClose = () => setState(s => ({ ...s, selectedJob: null }));
  const handleApply = (job) => {
    const exists = apps.some(a => a.company === job.company && a.title === job.title);
    if (exists) return setState(s => ({ ...s }));
    const newApp = { id: Date.now(), company: job.company, title: job.title, date: new Date().toISOString(), status: 'Applied' };
    setState(s => ({ ...s, apps: [newApp, ...s.apps] }));
  };
  const handleSave = (job) => {
    setState(s => ({ ...s, saved: s.saved.includes(job.id) ? s.saved.filter(id => id !== job.id) : [job.id, ...s.saved] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Sidebar profile={profile} active={tab} onSelect={(t)=>setState(s=>({ ...s, tab: t }))} />
      <div className="lg:pl-60">
        <div className="max-w-7xl mx-auto">
          <Navbar profile={profile} />

          <main className="p-6">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard type="sparkles" value={jobs.length} label="Jobs matched for you" />
              <SummaryCard type="files" value={apps.length} label="Jobs applied" />
              <SummaryCard type="check" value={3} label="Companies shortlisted you" />
            </section>

            <section className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Recommended Jobs</h2>
                  <p className="text-sm text-gray-500">Jobs ranked using AI based on your skills and profile</p>
                </div>
              </div>

              {jobs.length===0 ? (
                <EmptyState title="No AI Matches Yet" subtitle="Complete your profile to receive better recommendations" action={<button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">Complete Profile</button>} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs.map(job=> <JobCard key={job.id} job={job} onView={handleView} onApply={handleApply} onSave={handleSave} saved={saved.includes(job.id)} />)}
                </div>
              )}
            </section>

            <section className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Application Status</h3>
              {apps.length===0 ? (
                <EmptyState title="No Applications Yet" subtitle="Apply to jobs to track them here" />
              ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm p-4">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="px-3 py-2">Company</th>
                        <th className="px-3 py-2">Job</th>
                        <th className="px-3 py-2">Applied On</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apps.map(a=> (
                        <tr key={a.id} className="border-t">
                          <td className="px-3 py-3">{a.company}</td>
                          <td className="px-3 py-3">{a.title}</td>
                          <td className="px-3 py-3">{formatDate(a.date)}</td>
                          <td className="px-3 py-3"><StatusBadge status={a.status} /></td>
                          <td className="px-3 py-3"><button className="px-3 py-1 border rounded-md text-sm">View Details</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      <div className="hidden lg:block fixed right-6 top-24 w-80">
        <ProfileCard profile={profile} />
      </div>
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div onClick={handleClose} className="absolute inset-0 bg-black/30" />
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative bg-white rounded-xl shadow-lg max-w-xl w-full p-6 z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500">{selectedJob.company}</div>
                <h3 className="text-xl font-bold">{selectedJob.title}</h3>
                <div className="text-sm text-gray-600">{selectedJob.location} • {selectedJob.type}</div>
              </div>
              <div className="text-green-600 font-semibold">{selectedJob.salary}</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedJob.skills.map(s => <span key={s} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">{s}</span>)}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={handleClose} className="px-4 py-2 border rounded-md">Close</button>
              <button onClick={() => { handleApply(selectedJob); handleClose(); }} className="px-4 py-2 bg-blue-600 text-white rounded-md">Apply Now</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

