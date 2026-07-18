import { motion } from 'framer-motion';
import { BriefcaseBusiness, Sparkles, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import Button from '../components/common/Button';
import CandidateProfileModal from '../components/dashboard/CandidateProfileModal';
import CandidateTable from '../components/dashboard/CandidateTable';
import CreateJobModal from '../components/dashboard/CreateJobModal';
import JobCard from '../components/dashboard/JobCard';
import StatCard from '../components/dashboard/StatCard';
import DashboardLayout from '../components/layout/DashboardLayout';
import { candidates, jobs as initialJobs } from '../data/mockData';

const CompanyDashboard = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [activeJobTitle, setActiveJobTitle] = useState('Frontend Engineer');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const totalMatches = useMemo(() => candidates.length, []);
  const visibleCandidates = useMemo(() => candidates.filter((candidate) => candidate.matchedJob === activeJobTitle), [activeJobTitle]);

  const handleCreateJob = (newJob) => {
    setJobs((current) => [{
      ...newJob,
      id: Date.now(),
      postedAt: 'Just now',
      description: newJob.description || 'A new opportunity is ready for your team.',
      skills: newJob.skills.length ? newJob.skills : ['Growth', 'Leadership']
    }, ...current]);
    setFeedbackMessage(`Created ${newJob.title} and added it to your active job posts.`);
  };

  const handleEditJob = (job) => {
    setFeedbackMessage(`Editing ${job.title} is now enabled in the form flow.`);
    setActiveJobTitle(job.title);
  };

  const handleDeleteJob = (jobId) => {
    setJobs((current) => current.filter((job) => job.id !== jobId));
    setFeedbackMessage('Job removed from your dashboard.');
  };

  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleSectionSelect = (section) => {
    setActiveSection(section);
    setFeedbackMessage(`${section} selected. Explore the content for ${section.toLowerCase()}.`);
  };

  return (
    <DashboardLayout activeItem={activeSection} onSelect={handleSectionSelect}>
      <div className="mx-auto flex max-w-7xl flex-col space-y-8">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              AI Recruitment Command Center
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">Build faster, hire smarter</h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">Create premium job posts and review highly matched candidates in one streamlined workspace designed for modern hiring teams.</p>
          </div>
          <Button variant="primary" size="lg" icon={BriefcaseBusiness} onClick={() => setIsModalOpen(true)}>
            Create Job
          </Button>
        </motion.section>

        {feedbackMessage ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {feedbackMessage}
          </div>
        ) : null}

        {activeSection === 'Dashboard' ? (
          <>
            <section className="grid gap-6 md:grid-cols-2">
              <StatCard icon={BriefcaseBusiness} title="Published Jobs" value={jobs.length} subtitle="Live openings across product, engineering, and design." accentClass="bg-blue-50" iconClass="text-blue-600" />
              <StatCard icon={Users} title="AI Matched Candidates" value={totalMatches} subtitle="Candidates automatically matched to your active openings." accentClass="bg-emerald-50" iconClass="text-emerald-600" />
            </section>

            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">My Job Posts</h3>
                  <p className="text-sm text-gray-600">Keep every listing polished and ready for your ideal hire.</p>
                </div>
                <Button variant="outline" onClick={() => setIsModalOpen(true)}>+ Create Job</Button>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} onViewMatches={(title) => setActiveJobTitle(title)} onEdit={handleEditJob} onDelete={handleDeleteJob} />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Matched Candidates</h3>
                <p className="text-sm text-gray-600">A curated view of the strongest candidates for {activeJobTitle}.</p>
              </div>
              <CandidateTable candidates={visibleCandidates} onViewProfile={handleViewProfile} />
            </section>
          </>
        ) : activeSection === 'Matches' ? (
          <section className="grid gap-6 md:grid-cols-1">
            <h3 className="text-2xl font-semibold text-gray-900">Matches</h3>
            <CandidateTable candidates={visibleCandidates} onViewProfile={handleViewProfile} />
          </section>
        ) : activeSection === 'My Jobs' ? (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">My Job Posts</h3>
                <p className="text-sm text-gray-600">View and manage your active listings.</p>
              </div>
              <Button variant="outline" onClick={() => setIsModalOpen(true)}>+ Create Job</Button>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onViewMatches={(title) => setActiveJobTitle(title)} onEdit={handleEditJob} onDelete={handleDeleteJob} />
              ))}
            </div>
          </section>
        ) : activeSection === 'Settings' ? (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900">Settings</h3>
            <p className="mt-3 text-sm text-gray-600">Settings are coming soon. For now, use the sidebar to navigate between jobs and matches.</p>
          </section>
        ) : activeSection === 'Logout' ? (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900">Logout</h3>
            <p className="mt-3 text-sm text-gray-600">You have been logged out of the dashboard session. Refresh to return.</p>
          </section>
        ) : null}
      </div>

      <CreateJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateJob} />
      <CandidateProfileModal candidate={selectedCandidate} isOpen={Boolean(selectedCandidate)} onClose={() => setSelectedCandidate(null)} />
    </DashboardLayout>
  );
};

export default CompanyDashboard;
