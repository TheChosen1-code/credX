import PropTypes from 'prop-types';
import { BadgeCheck, Mail, Sparkles, FileText, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';

const CandidateProfileModal = ({ candidate, isOpen, onClose, onUpdateStatus }) => {
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
          <Badge variant={candidate.status === 'Shortlisted' ? 'success' : candidate.status === 'Rejected' ? 'danger' : 'info'}>
            {candidate.status}
          </Badge>
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
            Academic Details
          </div>
          <p className="mt-2 text-sm text-gray-600">{candidate.experience}</p>
        </div>

        {/* Resume View Section */}
        <div className="rounded-2xl border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">Resume Attachment</p>
          {candidate.resumeUrl ? (
            <a
              href={candidate.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <FileText size={16} />
              View Candidate Resume
              <ExternalLink size={14} />
            </a>
          ) : (
            <p className="text-xs text-gray-500 italic">No resume uploaded by candidate.</p>
          )}
        </div>

        {/* Action Controls for Recruitment */}
        {onUpdateStatus && (
          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2 justify-end">
            <button
              onClick={() => {
                onUpdateStatus(candidate.id, 'REJECTED');
                onClose();
              }}
              disabled={candidate.status === 'Rejected'}
              className="px-3.5 py-2 border rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border-red-200 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
            >
              <XCircle size={14} />
              Reject Candidate
            </button>
            <button
              onClick={() => {
                onUpdateStatus(candidate.id, 'SHORTLISTED');
                onClose();
              }}
              disabled={candidate.status === 'Shortlisted'}
              className="px-3.5 py-2 border rounded-xl text-xs font-bold text-yellow-600 hover:bg-yellow-50 border-yellow-200 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles size={14} />
              Shortlist
            </button>
            <button
              onClick={() => {
                onUpdateStatus(candidate.id, 'SELECTED');
                onClose();
              }}
              disabled={candidate.status === 'Selected' || candidate.status === 'Offer Received'}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <CheckCircle size={14} />
              Offer Hire
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

CandidateProfileModal.propTypes = {
  candidate: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    matchedJob: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    experience: PropTypes.string.isRequired,
    match: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    resumeUrl: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func,
};

export default CandidateProfileModal;

