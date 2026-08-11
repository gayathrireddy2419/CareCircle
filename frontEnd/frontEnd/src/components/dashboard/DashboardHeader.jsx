// src/components/dashboard/DashboardHeader.jsx
import React from 'react';
import { useHealth } from '../../context/HealthContext';
import './DashboardHeader.css';

export const DashboardHeader = ({ title = "Dashboard", subtitle = "Welcome back to your family health portal" }) => {
  const { user } = useHealth();

  return (
    <div className="dashboard-header-container">
      <div>
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>
      <div className="header-right-user">
        <span className="user-greeting">Hello, <strong>{user?.name || 'Administrator'}</strong></span>
      </div>
    </div>
  );
};

export default DashboardHeader;
