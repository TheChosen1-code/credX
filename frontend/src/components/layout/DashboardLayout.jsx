import PropTypes from 'prop-types';
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, activeItem, onSelect }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900">
      <div className="flex min-h-screen">
        <Sidebar activeItem={activeItem} onSelect={onSelect} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <Header onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activeItem: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default DashboardLayout;
