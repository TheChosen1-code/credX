const items = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'matches', label: 'AI Matched Jobs', icon: 'sparkles' },
  { key: 'applications', label: 'My Applications', icon: 'file' },
  { key: 'profile', label: 'Profile', icon: 'user' },
  { key: 'logout', label: 'Logout', icon: 'logout' },
];

export default function Sidebar({ active='dashboard', onSelect=()=>{}, profile }){
  return (
    <aside className="w-60 bg-white h-screen fixed left-0 top-0 shadow-sm px-4 py-6">
      <div className="mb-8 text-xl font-bold">credX</div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">{profile.name[0]}</div>
        <div>
          <div className="font-semibold">{profile.name}</div>
          <div className="text-sm text-gray-500">Student</div>
        </div>
      </div>
      <nav className="space-y-1">
        {items.map(({key,label})=>{
          const isActive = active===key;
          const cls = isActive? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'hover:bg-gray-50 text-gray-700';
          return <button key={key} onClick={()=>onSelect(key)} className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md ${cls}`}><span className="text-sm">{label}</span></button>
        })}
      </nav>
    </aside>
  );
}
