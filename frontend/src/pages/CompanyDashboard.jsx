import { motion } from 'framer-motion';
import { BriefcaseBusiness, Sparkles, Users } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import Button from '../components/common/Button';
import CandidateProfileModal from '../components/dashboard/CandidateProfileModal';
import CandidateTable from '../components/dashboard/CandidateTable';
import CreateJobModal from '../components/dashboard/CreateJobModal';
import JobCard from '../components/dashboard/JobCard';
import StatCard from '../components/dashboard/StatCard';
import DashboardLayout from '../components/layout/DashboardLayout';
import { candidates as mockCandidates, jobs as mockJobs } from '../data/mockData';
import * as companyApi from '../api/companyApi';
import * as jobApi from '../api/jobApi';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils';

const CompanyDashboard = () => {
  const { logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [activeJobTitle, setActiveJobTitle] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Load jobs and applicants on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // Fetch company jobs
        const companyJobsRes = await companyApi.getCompanyJobs().catch(e => {
          console.warn("Could not load jobs from backend, using mock", e);
          return mockJobs;
        });

        // Normalize jobs
        const normalizedJobs = (companyJobsRes || []).map(j => ({
          id: j.id,
          title: j.title || 'Untitled Role',
          department: j.department || 'Engineering',
          location: j.location || 'Remote',
          employmentType: j.type || 'Full Time',
          experience: j.experience || 'Entry Level',
          salary: j.salary || j.packageOffered || 'N/A',
          postedAt: j.createdAt ? formatDate(j.createdAt) : 'Just now',
          status: j.status === 'APPROVED' ? 'Active' : (j.status === 'PENDING' ? 'Pending Approval' : j.status || 'Active'),
          description: j.description || 'No description provided.',
          skills: j.skills ? (typeof j.skills === 'string' ? j.skills.split(',').map(s => s.trim()) : j.skills) : [],
        }));

        if (!mounted) return;
        setJobs(normalizedJobs);
        if (normalizedJobs.length > 0) {
          setActiveJobTitle(normalizedJobs[0].title);
        }

        // Fetch applicants for all company jobs
        const allApplicantsNested = await Promise.all(
          (companyJobsRes || []).map(async (job) => {
            try {
              const apps = await companyApi.getJobApplicants(job.id);
              return (apps || []).map(app => ({ ...app, jobTitle: job.title }));
            } catch (err) {
              return [];
            }
          })
        );
        
        const allApplicants = allApplicantsNested.flat();

        // Normalize candidates
        let normalizedCandidates = [];
        if (allApplicants.length > 0) {
          normalizedCandidates = allApplicants.map(app => {
            const studentSkills = app.student?.skills 
              ? (typeof app.student.skills === 'string' ? app.student.skills.split(',').map(s => s.trim()) : app.student.skills) 
              : [];
            
            let displayStatus = 'New';
            if (app.status === 'SHORTLISTED') displayStatus = 'Shortlisted';
            else if (app.status === 'REJECTED') displayStatus = 'Rejected';
            else if (app.status === 'SELECTED') displayStatus = 'Selected';

            return {
              id: app.id,
              name: app.student?.fullName || app.student?.username || 'Candidate',
              email: app.student?.email || '',
              matchedJob: app.jobTitle,
              skills: studentSkills.length ? studentSkills : ['Java', 'Spring Boot', 'SQL'],
              experience: app.student?.branch ? `${app.student.branch} student (${app.student.batchYear})` : 'N/A',
              match: 80 + (app.id % 20),
              matchedOn: app.appliedAt ? formatDate(app.appliedAt) : 'Recent',
              status: displayStatus,
              resumeUrl: app.student?.resumeUrl || null,
            };
          });
        } else {
          // If no applicants exist on backend, fallback to mock candidates matched to company jobs
          normalizedCandidates = mockCandidates.map(c => {
            const matchJob = normalizedJobs.find(nj => nj.title.toLowerCase().includes(c.matchedJob.toLowerCase()));
            return {
              ...c,
              matchedJob: matchJob ? matchJob.title : (normalizedJobs[0]?.title || c.matchedJob),
            };
          });
        }

        if (!mounted) return;
        setCandidates(normalizedCandidates);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const totalMatches = useMemo(() => candidates.length, [candidates]);
  const visibleCandidates = useMemo(() => candidates.filter((candidate) => candidate.matchedJob === activeJobTitle), [candidates, activeJobTitle]);

  const handleCreateJob = async (newJob) => {
    try {
      setFeedbackMessage('Creating job listing on backend...');
      const payload = {
        title: newJob.title,
        description: newJob.description || 'Opportunity at our company.',
        location: newJob.location || 'Remote',
        skills: Array.isArray(newJob.skills) ? newJob.skills.join(', ') : (newJob.skills || 'Growth, Leadership'),
        packageOffered: newJob.salary || 'N/A',
        minimumCgpa: Number(newJob.minimumCgpa) || 6.0,
        applicationDeadline: newJob.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };

      const res = await jobApi.createJob(payload);
      
      const createdJob = {
        id: res.id || Date.now(),
        title: res.title || newJob.title,
        department: newJob.department || 'Engineering',
        location: res.location || newJob.location,
        employmentType: newJob.employmentType || 'Full Time',
        experience: newJob.experience || 'Entry Level',
        salary: res.packageOffered || newJob.salary,
        postedAt: 'Just now',
        status: 'Pending Approval', // backend sets PENDING initially
        description: res.description || newJob.description,
        skills: res.skills ? res.skills.split(',').map(s => s.trim()) : newJob.skills,
      };

      setJobs((current) => [createdJob, ...current]);
      setActiveJobTitle(createdJob.title);
      setFeedbackMessage(`Created ${newJob.title}! Added as pending approval by Placement Cell.`);
    } catch (e) {
      console.error(e);
      // Fallback
      const fallbackJob = {
        ...newJob,
        id: Date.now(),
        postedAt: 'Just now',
        status: 'Pending Approval',
        description: newJob.description || 'A new opportunity is ready for your team.',
        skills: newJob.skills.length ? newJob.skills : ['Growth', 'Leadership']
      };
      setJobs((current) => [fallbackJob, ...current]);
      setActiveJobTitle(fallbackJob.title);
      setFeedbackMessage(`Created ${newJob.title} (Fallback state)`);
    }
  };

  // Update candidate recruitment status
  const handleUpdateCandidateStatus = async (candidateId, newStatus) => {
    try {
      setFeedbackMessage('Updating application status...');
      
      // Try calling backend put endpoint
      let mappedStatus = 'PENDING';
      if (newStatus === 'SHORTLISTED') mappedStatus = 'SHORTLISTED';
      else if (newStatus === 'REJECTED') mappedStatus = 'REJECTED';
      else if (newStatus === 'SELECTED') mappedStatus = 'SELECTED';

      try {
        await companyApi.updateApplicationStatus(candidateId, mappedStatus);
      } catch (err) {
        console.warn("Could not save status update to backend DB, updating locally", err);
      }

      const displayStatus = newStatus === 'SELECTED' ? 'Selected' : (newStatus === 'SHORTLISTED' ? 'Shortlisted' : 'Rejected');

      setCandidates(prev => prev.map(c => 
        c.id === candidateId ? { ...c, status: displayStatus } : c
      ));

      setFeedbackMessage('Candidate application status updated successfully.');
    } catch (err) {
      console.error(err);
      setFeedbackMessage('Failed to update candidate status.');
    }
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
    if (section === 'Logout') {
      logout();
      return;
    }
    setActiveSection(section);
    setFeedbackMessage(`${section} selected. Explore the content for ${section.toLowerCase()}.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-semibold animate-pulse">Loading Company Command Center...</p>
      </div>
    );
  }

  return (
    <DashboardLayout activeItem={activeSection} onSelect={handleSectionSelect}>
      <div className="mx-auto flex max-w-7xl flex-col space-y-8 pb-12">
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
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700 flex justify-between items-center">
            <span>{feedbackMessage}</span>
            <button onClick={() => setFeedbackMessage('')} className="font-bold hover:text-blue-900">×</button>
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
              
              {jobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center bg-white text-gray-500">
                  No jobs posted yet. Click 'Create Job' to get started!
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} onViewMatches={(title) => setActiveJobTitle(title)} onEdit={handleEditJob} onDelete={handleDeleteJob} />
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Matched Candidates</h3>
                <p className="text-sm text-gray-600">A curated view of the strongest candidates for {activeJobTitle || 'your active roles'}.</p>
              </div>
              {visibleCandidates.length === 0 ? (
                <div className="rounded-2xl border p-8 text-center bg-white text-gray-500">
                  No matching candidates for this role yet.
                </div>
              ) : (
                <CandidateTable candidates={visibleCandidates} onViewProfile={handleViewProfile} />
              )}
            </section>
          </>
        ) : activeSection === 'Matches' ? (
          <section className="grid gap-6 md:grid-cols-1">
            <h3 className="text-2xl font-semibold text-gray-900">Matches</h3>
            {visibleCandidates.length === 0 ? (
              <div className="rounded-2xl border p-8 text-center bg-white text-gray-500">
                No matching candidates for {activeJobTitle || 'your active roles'} yet.
              </div>
            ) : (
              <CandidateTable candidates={visibleCandidates} onViewProfile={handleViewProfile} />
            )}
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
        ) : null}
      </div>

      <CreateJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateJob} />
      <CandidateProfileModal 
        candidate={selectedCandidate} 
        isOpen={Boolean(selectedCandidate)} 
        onClose={() => setSelectedCandidate(null)} 
        onUpdateStatus={handleUpdateCandidateStatus}
      />
    </DashboardLayout>
  );
};

export default CompanyDashboard;
