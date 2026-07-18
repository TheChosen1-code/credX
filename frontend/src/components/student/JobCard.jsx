import { Bookmark, MapPin, Briefcase, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

export default function JobCard({ job, onView, onApply, onSave, saved, applied }) {
  // Defensive checks to avoid runtime exceptions if fields are nested or string format
  const companyName = typeof job.company === 'object' && job.company
    ? (job.company.companyName || job.company.fullName || 'Company')
    : (job.company || 'Company');
    
  const companyInitial = companyName ? companyName[0].toUpperCase() : 'C';

  const skillsArray = Array.isArray(job.skills)
    ? job.skills
    : (typeof job.skills === 'string'
        ? job.skills.split(',').map(s => s.trim()).filter(Boolean)
        : []);

  const visibleSkills = skillsArray.slice(0, 3);
  const extra = skillsArray.length - visibleSkills.length;
  
  const salaryText = job.salary || job.packageOffered || 'N/A';
  const locationText = job.location || 'Remote';
  const typeText = job.type || 'Full Time';
  const deadlineText = job.deadline || job.applicationDeadline || 'Open';
  const matchScore = job.match || 75;

  return (
    <motion.article 
      whileHover={{ y: -4, scale: 1.01 }} 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between h-full hover:shadow-md transition-all duration-300 relative"
    >
      <div className="absolute top-4 right-4">
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
          {matchScore}% Match
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold rounded-xl flex items-center justify-center shadow-sm shrink-0">
            {companyInitial}
          </div>
          <div className="flex-1 min-w-0 pr-16">
            <h4 className="font-semibold text-sm text-gray-500 truncate">{companyName}</h4>
            <h3 className="text-lg font-bold text-gray-900 truncate leading-snug">{job.title}</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-y-1 gap-x-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-gray-400" />
            <span>{locationText}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase size={14} className="text-gray-400" />
            <span>{typeText}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {visibleSkills.map(s => (
            <span key={s} className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-100">
              {s}
            </span>
          ))}
          {extra > 0 && (
            <span className="bg-gray-50 text-gray-400 px-2 py-1 rounded-lg text-xs font-medium">
              +{extra} more
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Salary</span>
          <span className="text-sm font-extrabold text-green-600">{salaryText}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onView && onView(job)} 
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Details
          </button>
          <button 
            onClick={() => onApply && onApply(job)} 
            disabled={applied}
            className={cn(
              'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm',
              applied 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
            )}
          >
            {applied ? 'Applied' : 'Apply'}
          </button>
          <button 
            onClick={() => onSave && onSave(job)} 
            className={cn(
              'p-2 rounded-lg transition-colors border',
              saved 
                ? 'bg-blue-50 text-blue-600 border-blue-100' 
                : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'
            )} 
            aria-pressed={saved}
          >
            <Bookmark size={14} className={saved ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
