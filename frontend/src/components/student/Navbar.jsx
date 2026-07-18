export default function Navbar({ profile }){
  return (
    <header className="flex items-center justify-between py-4 px-6">
      <div>
        <div className="text-lg font-semibold">Student Dashboard</div>
        <div className="text-sm text-gray-500">Discover jobs matched to your profile</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">{profile.email}</div>
        <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">{profile.name[0]}</div>
      </div>
    </header>
  );
}
