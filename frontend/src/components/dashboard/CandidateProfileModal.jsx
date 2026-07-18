import PropTypes from 'prop-types';
import { BadgeCheck, Mail, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';

const CandidateProfileModal = ({ candidate, isOpen, onClose }) => {
  if (!candidate) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Candidate Profile">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div>
            <p className="text-lg font-semibold text-gray-900">{candidate.name}</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              {candidate.email}
            </p>
          </div>
          <Badge variant="info">{candidate.status}</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900">Matched Opportunity</p>
            <p className="mt-2 text-sm text-gray-600">{candidate.matchedJob}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900">AI Match</p>
            <p className="mt-2 text-lg font-semibold text-blue-600">{candidate.match}%</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Core Skills
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <BadgeCheck className="h-4 w-4 text-emerald-600" />
            Experience
          </div>
          <p className="mt-2 text-sm text-gray-600">{candidate.experience} of relevant experience</p>
        </div>
      </div>
    </Modal>
  );
};

CandidateProfileModal.propTypes = {
  candidate: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    matchedJob: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    experience: PropTypes.string.isRequired,
    match: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CandidateProfileModal;
