// src/components/profile/MedicalSummary.jsx
import React from 'react';
import { Heart, Pill } from 'lucide-react';
import './MedicalSummary.css';

export const MedicalSummary = ({ bp = "Not recorded yet", sugar = "Not recorded yet" }) => {
  return (
    <div className="medical-summary-card">
      <h3>Medical Overview</h3>
      <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="summary-item">
          <Heart size={20} color="#2563eb" style={{ marginTop: '2px' }} />
          <div>
            <span className="sum-label">Blood Pressure</span>
            <p className="sum-val">{bp}</p>
          </div>
        </div>
        <div className="summary-item">
          <Pill size={20} color="#10b981" style={{ marginTop: '2px' }} />
          <div>
            <span className="sum-label">Fasting Blood Sugar</span>
            <p className="sum-val">{sugar}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalSummary;
