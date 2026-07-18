import React from "react";
import {
  Sparkles,
  LayoutGrid,
  Building2,
  Briefcase,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "applications", label: "Applications", icon: Users },
];

export default function AdminSidebar({ activeTab, onTabChange, onLogout }) {
  return (
    <aside className="flex h-screen w-70 shrink-0 flex-col border-r border-neutral-100 bg-white px-5 py-7">
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--accent)">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[15px] font-bold leading-tight text-neutral-900">
            Placement Cell
          </p>
          <p className="text-[12px] text-neutral-400">Admin Console</p>
        </div>
      </div>

      <div className="mt-7 rounded-2xl bg-(--accent-tint) px-4 py-4">
        <p className="text-[14px] font-bold text-neutral-900">
          Admin Dashboard
        </p>
        <p className="mt-1 text-[13px] leading-snug text-neutral-500">
          Review companies, jobs and applications across the platform.
        </p>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors ${
                active
                  ? "bg-(--accent-tint) text-(--accent)"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
              }`}
              style={
                active
                  ? { boxShadow: "inset 3px 0 0 0 var(--accent)" }
                  : undefined
              }
            >
              <Icon size={17} strokeWidth={2.1} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-neutral-100 pt-4">
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
        >
          <Settings size={17} strokeWidth={2.1} />
          Settings
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium text-neutral-500 hover:bg-neutral-50 hover:text-red-600"
        >
          <LogOut size={17} strokeWidth={2.1} />
          Logout
        </button>
      </div>
    </aside>
  );
}