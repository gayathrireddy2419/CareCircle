// src/components/ai/SymptomForm.jsx
import React, { useState } from 'react';
import { Activity, AlertTriangle, Send } from 'lucide-react';
import './SymptomForm.css';

export const SymptomForm = ({ onAnalyze }) => {
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('1-2 Days');
  const [severity, setSeverity] = useState('Mild');
  const [ageGroup, setAgeGroup] = useState('Adult');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    onAnalyze({ symptoms, duration, severity, ageGroup });
  };

  return (
    <form className="symptom-form-card" onSubmit={handleSubmit}>
      <div className="symptom-form-header">
        <Activity size={24} className="symptom-icon" />
        <div>
          <h3>AI Symptom Analyzer</h3>
          <p>Describe your symptoms for instant preliminary health feedback</p>
        </div>
      </div>

      <div className="form-group">
        <label>Primary Symptoms</label>
        <textarea
          placeholder="e.g. Mild fever, dry cough, and headache for the past day..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Duration</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option>Today</option>
            <option>1-2 Days</option>
            <option>3-5 Days</option>
            <option>1 Week+</option>
          </select>
        </div>

        <div className="form-group">
          <label>Severity Level</label>
          <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option>Mild (Manageable)</option>
            <option>Moderate (Bothersome)</option>
            <option>Severe (Requires Doctor)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Patient Category</label>
          <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
            <option>Child (&lt;12 yrs)</option>
            <option>Teen (13-18 yrs)</option>
            <option>Adult (19-59 yrs)</option>
            <option>Senior (60+ yrs)</option>
          </select>
        </div>
      </div>

      <div className="form-footer">
        <span className="disclaimer">
          <AlertTriangle size={14} /> AI assessment is for guidance only, not a official diagnosis.
        </span>
        <button type="submit" className="btn-analyze">
          <Send size={16} /> Analyze Symptoms
        </button>
      </div>
    </form>
  );
};

export default SymptomForm;
