// src/components/dashboard/ChartCard.jsx
import React from 'react';
import './ChartCard.css';

export const ChartCard = ({ title, children }) => {
  return (
    <div className="dash-chart-card">
      <div className="dash-chart-header">
        <h4>{title}</h4>
      </div>
      <div className="dash-chart-body">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
