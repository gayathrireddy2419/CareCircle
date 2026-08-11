// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Pill, Calendar, ShieldAlert } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/app/members', label: 'Family Members', icon: <Users size={20} /> },
    { path: '/app/records', label: 'Records Vault', icon: <FileText size={20} /> },
    { path: '/app/medicine', label: 'Medicines', icon: <Pill size={20} /> },
    { path: '/app/emergency', label: 'Emergency', icon: <ShieldAlert size={20} /> },
  ];

  return (
    <aside className="app-sidebar">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </aside>
  );
};

export default Sidebar;
