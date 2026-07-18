export default function StatusBadge({ status }) {
  const map = {
    Applied: 'bg-blue-100 text-blue-700',
    'Under Review': 'bg-yellow-100 text-yellow-700',
    'Interview Scheduled': 'bg-purple-100 text-purple-700',
    Shortlisted: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    'Offer Received': 'bg-emerald-100 text-emerald-700',
  };
  return <span className={`rounded-full px-3 py-1 text-sm ${map[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
}
