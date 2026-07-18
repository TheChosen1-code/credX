import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, PencilLine, Trash2, Users } from 'lucide-react';
import { memo, useState } from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';

const JobCard = memo(({ job, onViewMatches, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="neutral">{job.department}</Badge>
            <Badge variant="info">{job.employmentType}</Badge>
          </div>
        </div>
        <Badge variant={job.status === 'Active' ? 'success' : 'warning'}>{job.status}</Badge>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-gray-600">
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-2 font-medium text-gray-700">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-2 font-medium text-gray-700">
            <Briefcase className="h-4 w-4" />
            <span>{job.experience}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-600">{job.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
        <span>{job.postedAt}</span>
        <span>{job.salary}</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" icon={PencilLine} onClick={() => onEdit(job)} aria-label={`Edit ${job.title}`}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" icon={Trash2} className="text-red-600 hover:bg-red-50" onClick={() => onDelete(job.id)} aria-label={`Delete ${job.title}`}>
          Delete
        </Button>
        <Button variant="primary" size="sm" icon={Users} onClick={() => onViewMatches(job.title)} aria-label={`View matches for ${job.title}`}>
          {isHovered ? 'Open Matches' : 'View Matches'}
        </Button>
      </div>
    </motion.article>
  );
});

JobCard.propTypes = {
  job: PropTypes.shape({
    title: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    employmentType: PropTypes.string.isRequired,
    experience: PropTypes.string.isRequired,
    salary: PropTypes.string.isRequired,
    postedAt: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  onViewMatches: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

JobCard.displayName = 'JobCard';

export default JobCard;
