import { Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

export default function JobCard({ job, onView, onApply, onSave, saved }) {
  const skills = job.skills.slice(0,4);
  const extra = job.skills.length - skills.length;
  const score = 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold';

  return (
    <motion.article whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-xl shadow-sm p-5 relative">
      <div className="absolute top-4 right-4"><div className={score}>{job.match}% Match</div></div>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">{job.company[0]}</div>
        <div className="flex-1">
          <div className="font-semibold">{job.company}</div>
          <div className="text-xl font-bold">{job.title}</div>
          <div className="text-sm text-gray-600">{job.location} • {job.type}</div>
        </div>
        <div className="text-green-600 font-semibold">{job.salary}</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map(s => <span key={s} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">{s}</span>)}
        {extra>0 && <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">+{extra} more</span>}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="text-xs text-gray-500">Deadline: {job.deadline}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => onView && onView(job)} className="px-3 py-2 border border-gray-200 rounded-md text-sm">View Details</button>
          <button onClick={() => onApply && onApply(job)} className={cn('px-4 py-2 rounded-md text-white text-sm','bg-blue-600 hover:bg-blue-700')}>Apply Now</button>
          <button onClick={() => onSave && onSave(job)} className={cn('p-2 rounded-md', saved ? 'bg-blue-50 text-blue-600' : 'bg-gray-100')} aria-pressed={saved}>
            <Bookmark size={16} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
