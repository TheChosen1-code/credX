import { Home, Sparkles, FileText, User, LogOut, X } from 'lucide-react';

const items = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'matches', label: 'AI Matched Jobs', icon: 'sparkles' },
  { key: 'applications', label: 'My Applications', icon: 'file' },
  { key: 'profile', label: 'Profile', icon: 'user' },
  { key: 'logout', label: 'Logout', icon: 'logout' },
];

const iconMap = {
  home: Home,
  sparkles: Sparkles,
  file: FileText,
  user: User,
  logout: LogOut,
};

export default function Sidebar({ active = 'dashboard', onSelect = () => {}, profile, open, onClose }) {
  const nameInitial = profile?.name ? profile.name[0].toUpperCase() : 'S';
  const displayName = profile?.name || 'Student';

  return (
    <>
      {/* Mobile Backdrop */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`w-60 bg-white h-screen fixed left-0 top-0 shadow-md px-4 py-6 z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            credX
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg lg:hidden">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6 p-2 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
            {nameInitial}
          </div>
          <div className="truncate">
            <div className="font-semibold text-sm text-gray-800 truncate">{displayName}</div>
            <div className="text-xs text-gray-500">Student Portal</div>
          </div>
        </div>

        <nav className="space-y-1.5">
          {items.map(({ key, label, icon }) => {
            const isActive = active === key;
            const Icon = iconMap[icon];
            const cls = isActive
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900';

            return (
              <button
                key={key}
                onClick={() => onSelect(key)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${cls}`}
              >
                {Icon && <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />}
                <span className="text-sm">{label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

