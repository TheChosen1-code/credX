import { Menu } from 'lucide-react';

export default function Navbar({ profile, onMenuClick }){
  const nameInitial = profile?.name ? profile.name[0].toUpperCase() : 'S';
  const displayEmail = profile?.email || '';

  return (
    <header className="flex items-center justify-between py-4 px-6 bg-white border-b lg:border-b-0 lg:bg-transparent">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden" aria-label="Toggle menu">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Student Dashboard</h1>
          <p className="text-xs text-gray-500 hidden sm:block">Discover placement opportunities matched to your profile</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {displayEmail && <div className="text-sm text-gray-600 hidden md:block">{displayEmail}</div>}
        <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
          {nameInitial}
        </div>
      </div>
    </header>
  );
}

