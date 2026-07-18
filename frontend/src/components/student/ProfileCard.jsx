import { motion } from 'framer-motion';

export default function ProfileCard({ profile }){
  const pct = profile.completion || 0;
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = ((100 - pct) / 100) * circ;
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">{profile.name[0]}</div>
        <div>
          <div className="font-semibold">{profile.name}</div>
          <div className="text-sm text-gray-500">{profile.email}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <svg width="90" height="90" viewBox="0 0 100 100">
          <g transform="translate(50,50)">
            <circle r="36" fill="#F3F4F6" />
            <circle r="36" fill="none" stroke="#E6E7EA" strokeWidth="8" />
            <circle r="36" fill="none" stroke="#2563EB" strokeWidth="8" strokeDasharray={`${circ - dash} ${dash}`} strokeLinecap="round" transform="rotate(-90)" />
            <text x="0" y="6" textAnchor="middle" fontSize="16" fontWeight="600">{pct}%</text>
          </g>
        </svg>
        <div className="flex-1">
          <div className="text-sm text-gray-600">Profile Completion</div>
          <div className="mt-2 grid grid-cols-2 gap-1 text-sm">
            <div>✓ Name</div>
            <div>✓ Email</div>
            <div>✓ Phone</div>
            <div>✓ Skills</div>
            <div>✓ Resume Uploaded</div>
            <div>✗ Experience</div>
            <div>✓ Education</div>
          </div>
          <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md">Edit Profile</button>
        </div>
      </div>
    </motion.div>
  );
}
