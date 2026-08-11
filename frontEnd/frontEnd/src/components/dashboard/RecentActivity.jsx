// src/components/dashboard/RecentActivity.jsx
import React from 'react';
import { Activity, Pill, Calendar, FileText } from 'lucide-react';
import './RecentActivity.css';

export const RecentActivity = () => {
  const activities = [
    { id: 1, title: 'Logged Dosage', desc: 'John took Lisinopril 10mg', time: '8:00 AM', icon: <Pill size={16} color="#10b981" /> },
    { id: 2, title: 'Appointment Scheduled', desc: 'Dr. Sarah Jenkins booked for Jane', time: 'Yesterday', icon: <Calendar size={16} color="#2563eb" /> },
    { id: 3, title: 'Record Uploaded', desc: 'Annual Blood Panel added to Vault', time: '2 days ago', icon: <FileText size={16} color="#8b5cf6" /> },
  ];

  return (
    <div className="recent-activity-container">
      <h3 className="section-subtitle">Recent Activity</h3>
      <div className="activity-list">
        {activities.map(act => (
          <div key={act.id} className="activity-item">
            <div className="activity-icon-badge">{act.icon}</div>
            <div className="activity-info">
              <span className="activity-title">{act.title}</span>
              <p className="activity-desc">{act.desc}</p>
            </div>
            <span className="activity-time">{act.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
