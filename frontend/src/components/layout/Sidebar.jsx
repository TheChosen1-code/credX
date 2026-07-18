import PropTypes from 'prop-types';
import { BriefcaseBusiness, Home, LogOut, Settings, Sparkles, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { name: 'Dashboard', icon: Home },
  { name: 'My Jobs', icon: BriefcaseBusiness },
  { name: 'Matches', icon: Users },
  { name: 'Settings', icon: Settings },
  { name: 'Logout', icon: LogOut }
];

const Sidebar = ({ activeItem, onSelect, mobileOpen, onClose }) => {
  const renderNav = () => (
    <nav className="space-y-2">
      {links.map((link) => {
        const Icon = link.icon;
        const active = link.name === activeItem;
        return (
          <button
            key={link.name}
            type="button"
            onClick={() => onSelect(link.name)}
            className={`flex w-full items-center gap-3 rounded-xl border-l-4 px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${active ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Icon className="h-4 w-4" />
            <span>{link.name}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden h-screen w-64 shrink-0 border-r border-gray-200 bg-white px-5 py-6 lg:flex lg:flex-col">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">TechCorp Inc.</p>
            <p className="text-sm text-gray-500">AI Hiring</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
          <p className="text-sm font-semibold text-gray-900">Company Dashboard</p>
          <p className="mt-1 text-sm text-gray-600">Manage jobs and review candidates</p>
        </div>

        <div className="mt-8 flex-1">{renderNav()}</div>
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose}>
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }} className="flex h-full w-72 flex-col border-r border-gray-200 bg-white p-5" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">TechCorp Inc.</p>
                    <p className="text-sm text-gray-500">AI Hiring</p>
                  </div>
                </div>
                <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-8">{renderNav()}</div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

Sidebar.propTypes = {
  activeItem: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Sidebar;
