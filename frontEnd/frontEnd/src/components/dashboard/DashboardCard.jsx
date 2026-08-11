// src/components/dashboard/DashboardCard.jsx
import React from 'react';
import './DashboardCard.css';

export const DashboardCard = ({ title, action, children }) => {
  return (
    <div className="dash-custom-card">
      <div className="dash-card-header">
        <h3>{title}</h3>
        {action && <div className="dash-card-action">{action}</div>}
      </div>
      <div className="dash-card-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
