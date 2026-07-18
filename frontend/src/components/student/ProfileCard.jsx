import { motion } from 'framer-motion';

export default function ProfileCard({ profile, onEditProfile }){
  const pct = profile?.completion || 0;
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = ((100 - pct) / 100) * circ;
  
  const displayName = profile?.name || 'Student';
  const displayEmail = profile?.email || 'student@email.com';
  const displayPhone = profile?.phone || '+91 98765 43210';
  const displayBranch = profile?.branch || 'CSE';
  const displayBatch = profile?.batchYear || '2026';
  
  const hasResume = !!profile?.resumeUrl;

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">{displayName[0].toUpperCase()}</div>
        <div className="truncate">
          <div className="font-semibold text-gray-800 truncate">{displayName}</div>
          <div className="text-xs text-gray-500 truncate">{displayEmail}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <svg width="90" height="90" viewBox="0 0 100 100" className="shrink-0">
          <g transform="translate(50,50)">
            <circle r="36" fill="#F3F4F6" />
            <circle r="36" fill="none" stroke="#E6E7EA" strokeWidth="8" />
            <circle r="36" fill="none" stroke="#2563EB" strokeWidth="8" strokeDasharray={`${circ - dash} ${dash}`} strokeLinecap="round" transform="rotate(-90)" />
            <text x="0" y="6" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1F2937">{pct}%</text>
          </g>
        </svg>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Completion</div>
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-600">
            <div>✓ Info</div>
            <div>✓ Branch</div>
            <div>{profile?.batchYear ? '✓ Batch' : '✗ Batch'}</div>
            <div>{profile?.skills ? '✓ Skills' : '✗ Skills'}</div>
            <div className="col-span-2">{hasResume ? '✓ Resume Up' : '✗ No Resume'}</div>
          </div>
          <button 
            onClick={onEditProfile} 
            className="mt-4 w-full px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
}

