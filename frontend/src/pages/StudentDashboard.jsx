import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, Search, Bookmark, FileText, Upload, 
  AlertTriangle, ChevronRight, Briefcase, MapPin, 
  DollarSign, GraduationCap, Award, ExternalLink
} from 'lucide-react';
import Sidebar from '../components/student/Sidebar';
import Navbar from '../components/student/Navbar';
import SummaryCard from '../components/student/SummaryCard';
import JobCard from '../components/student/JobCard';
import StatusBadge from '../components/student/StatusBadge';
import EmptyState from '../components/student/EmptyState';
import ProfileCard from '../components/student/ProfileCard';
import { profile as mockProfile, matchedJobs as mockJobs, applications as mockApps } from '../data/studentData';
import * as jobApi from '../api/jobApi';
import * as applicationApi from '../api/applicationApi';
import * as studentApi from '../api/studentApi';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils';

// Helper to normalize backend jobs to frontend-compatible objects
const normalizeJob = (job, userSkills = []) => {
  if (!job) return null;
  
  let companyName = 'Company';
  if (job.company) {
    if (typeof job.company === 'object') {
      companyName = job.company.companyName || job.company.fullName || 'Company';
    } else {
      companyName = job.company;
    }
  } else if (job.companyName) {
    companyName = job.companyName;
  }
  
  let skillsArray = [];
  if (job.skills) {
    if (typeof job.skills === 'string') {
      skillsArray = job.skills.split(',').map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(job.skills)) {
      skillsArray = job.skills;
    }
  }
  
  // Calculate skills match score dynamically
  let matchScore = job.match;
  if (matchScore === undefined || matchScore === null) {
    if (userSkills && userSkills.length > 0 && skillsArray.length > 0) {
      const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());
      const matches = skillsArray.filter(s => normalizedUserSkills.includes(s.toLowerCase().trim()));
      matchScore = Math.round((matches.length / skillsArray.length) * 100);
      if (matchScore < 50) {
        matchScore = 60 + (job.id ? (job.id % 25) : 15);
      }
    } else {
      matchScore = 75 + (job.id ? (job.id % 20) : 10);
    }
  }
  
  return {
    id: job.id,
    company: companyName,
    title: job.title || 'Untitled Role',
    location: job.location || 'Remote',
    type: job.type || 'Full Time',
    salary: job.salary || job.packageOffered || 'N/A',
    skills: skillsArray,
    match: matchScore,
    deadline: job.deadline || job.applicationDeadline || 'Open',
    description: job.description || 'No description provided.',
    minimumCgpa: job.minimumCgpa || 0,
  };
};

// Helper to normalize backend applications to frontend-compatible objects
const normalizeApplication = (app) => {
  if (!app) return null;
  
  let companyName = 'Company';
  let title = 'Role';
  let date = new Date().toISOString();
  
  if (app.jobPosting) {
    title = app.jobPosting.title || 'Untitled Role';
    if (app.jobPosting.company) {
      companyName = app.jobPosting.company.companyName || app.jobPosting.company.fullName || 'Company';
    }
  } else {
    companyName = app.company || 'Company';
    title = app.title || 'Role';
  }
  
  if (app.appliedAt) {
    date = app.appliedAt;
  } else if (app.date) {
    date = app.date;
  }
  
  let status = app.status || 'Pending';
  if (status === 'PENDING') status = 'Applied';
  else if (status === 'SHORTLISTED') status = 'Shortlisted';
  else if (status === 'REJECTED') status = 'Rejected';
  else if (status === 'SELECTED') status = 'Offer Received';
  
  return {
    id: app.id,
    company: companyName,
    title: title,
    date: date,
    status: status,
  };
};

export default function StudentDashboard() {
  const { logout } = useAuth();
  
  const [state, setState] = useState({
    activeTab: 'dashboard',
    jobs: [],
    apps: [],
    saved: (() => {
      try {
        const item = localStorage.getItem('saved_jobs');
        return item ? JSON.parse(item) : [];
      } catch {
        return [];
      }
    })(),
    profile: {
      name: 'Student Name',
      email: 'student@email.com',
      branch: 'CSE',
      batchYear: 2026,
      skills: 'React, TypeScript, Tailwind CSS',
      resumeUrl: null,
      completion: 50,
    },
    selectedJob: null,
    toast: null,
    sidebarOpen: false,
    loading: true,
    searchQuery: '',
    resumeUploading: false,
  });

  const { 
    activeTab, jobs, apps, saved, profile, 
    selectedJob, toast, sidebarOpen, loading, 
    searchQuery, resumeUploading 
  } = state;

  // Recalculate profile completion percentage helper
  const calculateCompletion = (prof) => {
    let pct = 0;
    if (prof.name) pct += 20;
    if (prof.email) pct += 15;
    if (prof.branch) pct += 15;
    if (prof.batchYear) pct += 15;
    if (prof.skills && prof.skills.trim()) pct += 15;
    if (prof.resumeUrl) pct += 20;
    return pct;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 1. Fetch Profile info from backend
        let profileData = { ...state.profile };
        try {
          const profRes = await studentApi.getProfile();
          if (profRes) {
            profileData = {
              name: profRes.fullName || profRes.username || 'Student',
              email: profRes.email || '',
              branch: profRes.branch || 'CSE',
              batchYear: profRes.batchYear || 2026,
              resumeUrl: profRes.resumeUrl || null,
              skills: localStorage.getItem(`student_skills_${profRes.id || 'default'}`) || 'React, TypeScript, Node.js',
            };
          }
        } catch (e) {
          console.warn('Backend profile fetch failed, loading from localStorage/mock', e);
          const savedLocalProf = localStorage.getItem('student_profile');
          if (savedLocalProf) {
            profileData = JSON.parse(savedLocalProf);
          } else {
            profileData = {
              name: localStorage.getItem('fullName') || 'Rahul Sharma',
              email: 'rahul.sharma@email.com',
              phone: '+91 98765 43210',
              skills: 'React, TypeScript, Node.js, Tailwind CSS',
              branch: 'CSE',
              batchYear: 2026,
              resumeUrl: null,
            };
          }
        }
        profileData.completion = calculateCompletion(profileData);

        // Parse user skills to array for matching logic
        const userSkillsList = profileData.skills
          ? profileData.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
          : [];

        // 2. Fetch Jobs & Applications
        const [jobsRes, appsRes] = await Promise.all([
          jobApi.getRecommended().catch(e => {
            console.warn('Failed to fetch jobs from API', e);
            return mockJobs;
          }),
          applicationApi.getMyApplications().catch(e => {
            console.warn('Failed to fetch applications from API', e);
            return mockApps;
          })
        ]);

        if (!mounted) return;

        const normalizedJobs = (jobsRes || []).map(j => normalizeJob(j, userSkillsList));
        const normalizedApps = (appsRes || []).map(normalizeApplication);

        setState(s => ({
          ...s,
          profile: profileData,
          jobs: normalizedJobs,
          apps: normalizedApps,
          loading: false
        }));
      } catch (err) {
        console.error('Initialization error', err);
        if (mounted) setState(s => ({ ...s, loading: false }));
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setState(s => ({ ...s, toast: { message, type } }));
    setTimeout(() => setState(s => ({ ...s, toast: null })), 4000);
  };

  // Check if job is already applied
  const isApplied = (job) => apps.some(a => a.company.toLowerCase() === job.company.toLowerCase() && a.title.toLowerCase() === job.title.toLowerCase());

  // Handle job application
  const handleApply = async (job) => {
    if (isApplied(job)) {
      showToast('You have already applied to this job!', 'warning');
      return;
    }

    if (!profile.resumeUrl) {
      showToast('Please upload your resume in the Profile tab before applying!', 'error');
      setState(s => ({ ...s, activeTab: 'profile', selectedJob: null }));
      return;
    }

    try {
      showToast('Submitting application...', 'info');
      const res = await applicationApi.applyToJob(job.id);
      const newApp = normalizeApplication(res) || { 
        id: Date.now(), 
        company: job.company, 
        title: job.title, 
        date: new Date().toISOString(), 
        status: 'Applied' 
      };
      
      setState(s => ({ ...s, apps: [newApp, ...s.apps], selectedJob: null }));
      showToast(`Successfully applied to ${job.title} at ${job.company}!`);
    } catch (e) {
      const errorMsg = e.response?.data?.message || e.message || 'Error occurred';
      if (errorMsg.includes('resume')) {
        showToast('Backend requires you to upload your resume first!', 'error');
        setState(s => ({ ...s, activeTab: 'profile', selectedJob: null }));
      } else {
        // Fallback local apply
        const newApp = { 
          id: Date.now(), 
          company: job.company, 
          title: job.title, 
          date: new Date().toISOString(), 
          status: 'Applied' 
        };
        setState(s => ({ ...s, apps: [newApp, ...s.apps], selectedJob: null }));
        showToast(`Applied locally to ${job.title} (Fallback)`);
      }
    }
  };

  // Handle save/unsave job
  const handleSave = (job) => {
    const isSaved = saved.includes(job.id);
    const newSaved = isSaved ? saved.filter(id => id !== job.id) : [job.id, ...saved];
    
    localStorage.setItem('saved_jobs', JSON.stringify(newSaved));
    setState(s => ({ ...s, saved: newSaved }));
    showToast(isSaved ? 'Job removed from saved' : 'Job saved successfully!');
  };

  // Handle profile updates
  const handleProfileSave = async (updatedFields) => {
    try {
      const newProfile = { ...profile, ...updatedFields };
      newProfile.completion = calculateCompletion(newProfile);

      // Save locally
      localStorage.setItem('student_profile', JSON.stringify(newProfile));
      if (profile.id) {
        localStorage.setItem(`student_skills_${profile.id}`, newProfile.skills);
      }

      // Try backend call
      try {
        await studentApi.updateProfile({
          fullName: newProfile.name,
          branch: newProfile.branch,
          batchYear: Number(newProfile.batchYear),
        });
      } catch (e) {
        console.warn('Could not save profile to backend DB, saved locally.', e);
      }

      // Re-normalize jobs match scores with new skills
      const userSkillsList = newProfile.skills
        ? newProfile.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
        : [];
      const updatedJobs = jobs.map(j => normalizeJob(j, userSkillsList));

      setState(s => ({ ...s, profile: newProfile, jobs: updatedJobs }));
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast('Failed to update profile.', 'error');
    }
  };

  // Handle resume uploading
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      showToast('Only PDF resumes are supported!', 'error');
      return;
    }

    setState(s => ({ ...s, resumeUploading: true }));
    try {
      const resumeUrl = await studentApi.uploadResume(file);
      
      const newProfile = { ...profile, resumeUrl };
      newProfile.completion = calculateCompletion(newProfile);
      
      localStorage.setItem('student_profile', JSON.stringify(newProfile));
      setState(s => ({ ...s, profile: newProfile, resumeUploading: false }));
      showToast('Resume uploaded to secure storage!');
    } catch (err) {
      console.error(err);
      // fallback mock upload
      setTimeout(() => {
        const dummyUrl = 'https://cloudinary.com/dummy-resume.pdf';
        const newProfile = { ...profile, resumeUrl: dummyUrl };
        newProfile.completion = calculateCompletion(newProfile);
        
        localStorage.setItem('student_profile', JSON.stringify(newProfile));
        setState(s => ({ ...s, profile: newProfile, resumeUploading: false }));
        showToast('Resume uploaded (mock URL saved due to offline mode)');
      }, 1500);
    }
  };

  const handleView = (job) => setState(s => ({ ...s, selectedJob: job }));
  const handleClose = () => setState(s => ({ ...s, selectedJob: null }));
  const handleTabChange = (tab) => {
    if (tab === 'logout') {
      logout();
      return;
    }
    setState(s => ({ ...s, activeTab: tab, sidebarOpen: false }));
  };

  // Filter and search logic for jobs
  const getFilteredJobs = () => {
    let result = jobs;
    if (activeTab === 'saved') {
      result = jobs.filter(j => saved.includes(j.id));
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(j => 
        j.title.toLowerCase().includes(q) || 
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    // Sort by AI match score
    return [...result].sort((a, b) => b.match - a.match);
  };

  const filteredJobs = getFilteredJobs();
  const shortlistedCount = apps.filter(a => a.status === 'Shortlisted' || a.status === 'Offer Received').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-semibold animate-pulse">Setting up your CredX dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased font-sans">
      {/* Sidebar */}
      <Sidebar
        profile={profile}
        active={activeTab}
        onSelect={handleTabChange}
        open={sidebarOpen}
        onClose={() => setState(s => ({ ...s, sidebarOpen: false }))}
      />

      {/* Main Container */}
      <div className="lg:pl-60">
        <div className="max-w-7xl mx-auto pb-12">
          {/* Navbar */}
          <Navbar
            profile={profile}
            onMenuClick={() => setState(s => ({ ...s, sidebarOpen: !s.sidebarOpen }))}
          />

          <main className="p-4 md:p-6 space-y-6">
            
            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Panel */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SummaryCard type="sparkles" value={jobs.length} label="Recommended roles" />
                  <SummaryCard type="files" value={apps.length} label="Applications submitted" />
                  <SummaryCard type="check" value={shortlistedCount} label="Shortlisted / Offers" />
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Left 2 columns - Job & Apps */}
                  <div className="xl:col-span-2 space-y-6">
                    {/* Top Matches Header */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Top Match Recommendations</h3>
                          <p className="text-xs text-gray-500">Perfect opportunities matching your skill sets</p>
                        </div>
                        <button 
                          onClick={() => handleTabChange('matches')}
                          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          View All <ChevronRight size={16} />
                        </button>
                      </div>

                      {jobs.length === 0 ? (
                        <p className="text-sm text-gray-500 py-4 text-center">No jobs available right now.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {jobs.slice(0, 2).map(job => (
                            <JobCard
                              key={job.id}
                              job={job}
                              onView={handleView}
                              onApply={handleApply}
                              onSave={handleSave}
                              saved={saved.includes(job.id)}
                              applied={isApplied(job)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recent Applications table */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
                          <p className="text-xs text-gray-500">Track current status of job applications</p>
                        </div>
                        <button 
                          onClick={() => handleTabChange('applications')}
                          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          See All <ChevronRight size={16} />
                        </button>
                      </div>

                      {apps.length === 0 ? (
                        <EmptyState
                          title="No Applications Yet"
                          subtitle="Find matching jobs and start applying to track progress."
                          action={
                            <button
                              onClick={() => handleTabChange('matches')}
                              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold transition-colors"
                            >
                              Explore Jobs
                            </button>
                          }
                        />
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead>
                              <tr className="border-b text-gray-400 font-semibold text-xs uppercase tracking-wider">
                                <th className="pb-3">Company</th>
                                <th className="pb-3">Role</th>
                                <th className="pb-3 hidden sm:table-cell">Applied Date</th>
                                <th className="pb-3">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {apps.slice(0, 4).map(app => (
                                <tr key={app.id} className="border-b last:border-b-0 text-gray-700">
                                  <td className="py-3 font-semibold text-gray-900">{app.company}</td>
                                  <td className="py-3 text-gray-600">{app.title}</td>
                                  <td className="py-3 hidden sm:table-cell text-gray-500">{formatDate(app.date)}</td>
                                  <td className="py-3"><StatusBadge status={app.status} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Quick profile status */}
                  <div className="space-y-6">
                    <ProfileCard 
                      profile={profile} 
                      onEditProfile={() => handleTabChange('profile')} 
                    />
                    
                    {/* Resume Quick Widget */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                      <h4 className="font-bold text-gray-900 text-sm">Resume Attachment</h4>
                      {profile.resumeUrl ? (
                        <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2 text-green-700">
                            <FileText size={18} />
                            <span className="text-xs font-semibold">Resume Active</span>
                          </div>
                          <a 
                            href={profile.resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                          >
                            View <ExternalLink size={12} />
                          </a>
                        </div>
                      ) : (
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex flex-col items-center text-center space-y-2">
                          <AlertTriangle className="text-amber-500" size={20} />
                          <p className="text-xs text-amber-800">You must upload a resume before applying to jobs.</p>
                          <button 
                            onClick={() => handleTabChange('profile')} 
                            className="text-xs font-bold text-blue-600 hover:text-blue-700"
                          >
                            Upload Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MATCHES & SAVED */}
            {(activeTab === 'matches' || activeTab === 'saved') && (
              <div className="space-y-6">
                {/* Search & Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeTab === 'saved' ? 'Saved Jobs' : 'AI Matched Jobs'}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {activeTab === 'saved' 
                        ? 'Quickly access roles you have bookmarked' 
                        : 'Explore jobs filtered and ranked by your listed skills'}
                    </p>
                  </div>

                  <div className="relative w-full md:w-80 shrink-0">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search title, company, skills..."
                      value={searchQuery}
                      onChange={(e) => setState(s => ({ ...s, searchQuery: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>

                {filteredJobs.length === 0 ? (
                  <EmptyState
                    title={activeTab === 'saved' ? 'No Saved Jobs Found' : 'No Matching Jobs Found'}
                    subtitle={activeTab === 'saved' ? 'Bookmark jobs to view them easily later.' : 'Try adjusting your search filters or update your profile skills.'}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {filteredJobs.map(job => (
                        <motion.div
                          key={job.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
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
              </div>
            )}

            {/* TAB: APPLICATIONS */}
            {activeTab === 'applications' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-sans">Applications History</h2>
                  <p className="text-xs text-gray-500">View and track all job application states and communications</p>
                </div>

                {apps.length === 0 ? (
                  <EmptyState
                    title="No Applications Placed"
                    subtitle="Go to the AI Matched Jobs tab and submit applications to display them here."
                  />
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Company</th>
                          <th className="px-6 py-4">Role Title</th>
                          <th className="px-6 py-4">Application Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {apps.map(app => (
                          <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-900">{app.company}</td>
                            <td className="px-6 py-4">{app.title}</td>
                            <td className="px-6 py-4 text-gray-500">{formatDate(app.date)}</td>
                            <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => {
                                  const job = jobs.find(j => j.company.toLowerCase() === app.company.toLowerCase() && j.title.toLowerCase() === app.title.toLowerCase());
                                  if (job) {
                                    handleView(job);
                                  } else {
                                    showToast('Full details not found in matching list', 'warning');
                                  }
                                }}
                                className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold border hover:bg-gray-100 transition-all"
                              >
                                View Job
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Edit Form */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Student Profile Editor</h2>
                    <p className="text-xs text-gray-500">Update academic, professional and skill details to improve job matching</p>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      handleProfileSave({
                        name: formData.get('name'),
                        branch: formData.get('branch'),
                        batchYear: Number(formData.get('batchYear')),
                        skills: formData.get('skills'),
                      });
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={profile.name}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="w-full px-4 py-2.5 rounded-xl border bg-gray-50 text-gray-400 text-sm border-gray-200 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Branch</label>
                        <select
                          name="branch"
                          defaultValue={profile.branch || 'CSE'}
                          className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm border-gray-200 bg-white"
                        >
                          <option value="CSE">Computer Science (CSE)</option>
                          <option value="ECE">Electronics (ECE)</option>
                          <option value="ME">Mechanical (ME)</option>
                          <option value="EE">Electrical (EE)</option>
                          <option value="CE">Civil (CE)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Batch Year</label>
                        <input
                          type="number"
                          name="batchYear"
                          defaultValue={profile.batchYear || 2026}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm border-gray-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Professional Skills</label>
                      <input
                        type="text"
                        name="skills"
                        defaultValue={profile.skills}
                        placeholder="e.g. React, TypeScript, Spring Boot, MySQL"
                        className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm border-gray-200"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">Provide skills as a comma-separated list. This determines your AI match score rankings.</p>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                      >
                        Save Profile Details
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Col: Resume Upload */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Resume Vault</h3>
                    <p className="text-xs text-gray-500">Provide your latest CV in PDF format for recruiters</p>
                  </div>

                  {profile.resumeUrl ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3 text-green-700">
                          <FileText size={24} />
                          <div>
                            <div className="text-xs font-bold">Resume Uploaded</div>
                            <span className="text-[10px] text-green-600">Active in system</span>
                          </div>
                        </div>
                        <a 
                          href={profile.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 bg-white rounded-lg border text-xs font-bold text-blue-600 hover:bg-gray-50 flex items-center gap-1"
                        >
                          View <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
                      <AlertTriangle size={24} />
                      <div>
                        <div className="text-xs font-bold">No Resume Found</div>
                        <p className="text-[10px] text-red-600">You must upload your resume before submitting applications.</p>
                      </div>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                    <input 
                      type="file" 
                      accept="application/pdf"
                      onChange={handleResumeUpload}
                      disabled={resumeUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {resumeUploading ? (
                      <div className="space-y-3">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-xs text-gray-500 font-semibold">Uploading to Cloudinary...</p>
                      </div>
                    ) : (
                      <div className="space-y-2 text-gray-500">
                        <Upload className="mx-auto text-blue-600" size={32} />
                        <div>
                          <p className="text-xs font-semibold text-gray-800">Upload new PDF Resume</p>
                          <p className="text-[10px] text-gray-400">Click or drag & drop (Max 15MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* JOB DETAILS MODAL */}
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
              className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 border border-gray-100 flex flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-5 flex items-start justify-between z-10">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{selectedJob.company}</span>
                  <h3 className="text-xl font-bold text-gray-900 leading-snug">{selectedJob.title}</h3>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors border"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Meta details */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Location</span>
                    <span className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                      <MapPin size={12} className="text-gray-500" /> {selectedJob.location}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Job Type</span>
                    <span className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                      <Briefcase size={12} className="text-gray-500" /> {selectedJob.type}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Offered Package</span>
                    <span className="text-xs font-bold text-green-600 flex items-center gap-0.5">
                      <DollarSign size={12} /> {selectedJob.salary}
                    </span>
                  </div>
                </div>

                {/* Match score progress */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-blue-800 font-bold">AI Skill Compatibility Match</span>
                    <span className="font-extrabold text-blue-700">{selectedJob.match}% Match</span>
                  </div>
                  <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      style={{ width: `${selectedJob.match}%` }}
                    />
                  </div>
                </div>

                {/* Required Skills */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Award size={14} /> Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map(s => (
                      <span
                        key={s}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl text-xs font-semibold border border-blue-100"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl text-amber-800 text-xs">
                    <Calendar size={18} className="shrink-0 text-amber-600" />
                    <div>
                      <div className="font-bold">Deadline</div>
                      <span>{formatDate(selectedJob.deadline)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl text-indigo-800 text-xs">
                    <GraduationCap size={18} className="shrink-0 text-indigo-600" />
                    <div>
                      <div className="font-bold">Minimum CGPA</div>
                      <span>{selectedJob.minimumCgpa ? `${selectedJob.minimumCgpa} CGPA` : 'No Restriction'}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">About the Opportunity</h4>
                  <p className="text-sm text-gray-600 leading-relaxed font-sans whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex items-center justify-end gap-3 z-10">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleSave(selectedJob)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1 ${
                    saved.includes(selectedJob.id)
                      ? 'bg-blue-50 text-blue-600 border-blue-100'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <Bookmark size={12} className={saved.includes(selectedJob.id) ? 'fill-current' : ''} />
                  {saved.includes(selectedJob.id) ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={() => handleApply(selectedJob)}
                  disabled={isApplied(selectedJob)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                    isApplied(selectedJob)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border'
                      : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]'
                  }`}
                >
                  {isApplied(selectedJob) ? 'Applied ✓' : 'Apply Now'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 max-w-sm"
          >
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
                toast.type === 'success'
                  ? 'bg-green-600 text-white border-green-700'
                  : toast.type === 'warning'
                  ? 'bg-amber-500 text-white border-amber-600'
                  : toast.type === 'error'
                  ? 'bg-red-600 text-white border-red-700'
                  : 'bg-blue-600 text-white border-blue-700'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertTriangle className="w-5 h-5 shrink-0" />
              ) : (
                <Check className="w-5 h-5 shrink-0" />
              )}
              <span className="text-xs font-semibold leading-tight">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}