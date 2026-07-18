import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { memo } from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';

const getMatchTone = (match) => {
  if (match >= 90) return 'success';
  if (match >= 75) return 'info';
  return 'warning';
};

const getStatusTone = (status) => {
  switch (status) {
    case 'New':
      return 'info';
    case 'Reviewed':
      return 'neutral';
    case 'Shortlisted':
      return 'success';
    case 'Rejected':
      return 'danger';
    default:
      return 'neutral';
  }
};

const CandidateTable = memo(({ candidates, onViewProfile }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Candidate</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Matched Job</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Skills</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Experience</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">AI Match</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Matched On</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {candidates.map((candidate, index) => (
              <motion.tr
                key={candidate.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.18 }}
                className="transition hover:bg-blue-50/60"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar fallback={candidate.name.split(' ').map((piece) => piece[0]).join('').slice(0, 2)} alt={candidate.name} size={40} />
                    <div>
                      <p className="font-medium text-gray-900">{candidate.name}</p>
                      <p className="text-xs text-gray-500">{candidate.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-blue-600">{candidate.matchedJob}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 3 ? <span className="text-xs text-gray-500">+{candidate.skills.length - 3} more</span> : null}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{candidate.experience}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${candidate.match >= 90 ? 'text-emerald-600' : candidate.match >= 75 ? 'text-blue-600' : 'text-amber-600'}`}>{candidate.match}%</span>
                    <div className="h-2 w-20 rounded-full bg-gray-100">
                      <div className={`h-2 rounded-full ${candidate.match >= 90 ? 'bg-emerald-500' : candidate.match >= 75 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${candidate.match}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{candidate.matchedOn}</td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusTone(candidate.status)}>{candidate.status}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm" icon={Sparkles} className="text-blue-600 hover:bg-blue-50" onClick={() => onViewProfile(candidate)} aria-label={`View profile for ${candidate.name}`}>
                    View Profile
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

CandidateTable.propTypes = {
  candidates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      matchedJob: PropTypes.string.isRequired,
      skills: PropTypes.arrayOf(PropTypes.string).isRequired,
      experience: PropTypes.string.isRequired,
      match: PropTypes.number.isRequired,
      matchedOn: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    })
  ).isRequired,
  onViewProfile: PropTypes.func.isRequired
};

CandidateTable.displayName = 'CandidateTable';

export default CandidateTable;
