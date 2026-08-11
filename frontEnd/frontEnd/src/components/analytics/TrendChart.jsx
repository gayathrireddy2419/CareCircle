// src/components/analytics/TrendChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const trendData = [
  { day: 'Mon', bpSystolic: 120, bpDiastolic: 80, sugar: 95 },
  { day: 'Tue', bpSystolic: 122, bpDiastolic: 81, sugar: 98 },
  { day: 'Wed', bpSystolic: 118, bpDiastolic: 79, sugar: 92 },
  { day: 'Thu', bpSystolic: 125, bpDiastolic: 82, sugar: 104 },
  { day: 'Fri', bpSystolic: 121, bpDiastolic: 80, sugar: 96 },
  { day: 'Sat', bpSystolic: 119, bpDiastolic: 78, sugar: 90 },
  { day: 'Sun', bpSystolic: 120, bpDiastolic: 80, sugar: 94 }
];

export const TrendChart = ({ data = trendData }) => {
  return (
    <div className="analytics-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1e293b' }}>Weekly Vitals Trend</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bpSystolic" name="BP Systolic" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="bpDiastolic" name="BP Diastolic" stroke="#f59e0b" strokeWidth={2} />
            <Line type="monotone" dataKey="sugar" name="Sugar Level" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
