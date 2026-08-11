// src/components/analytics/StatisticsCards.jsx
import React from 'react';
import { Activity, Heart, ShieldCheck, Zap } from 'lucide-react';

export const StatisticsCards = ({ stats }) => {
  const defaultStats = [
    { title: 'Avg Blood Pressure', value: '120/80', change: 'Normal', icon: <Heart size={24} color="#ef4444" />, bg: '#fef2f2' },
    { title: 'Avg Sugar Level', value: '98 mg/dL', change: '-4% this month', icon: <Activity size={24} color="#2563eb" />, bg: '#eff6ff' },
    { title: 'Adherence Rate', value: '92%', change: '+5% improvement', icon: <ShieldCheck size={24} color="#10b981" />, bg: '#ecfdf5' },
    { title: 'Emergency Risk', value: 'Low', change: 'Stable', icon: <Zap size={24} color="#f59e0b" />, bg: '#fffbe8' }
  ];

  const items = stats || defaultStats;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: item.bg, padding: '12px', borderRadius: '14px' }}>
            {item.icon}
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>{item.title}</span>
            <h3 style={{ margin: '2px 0 0 0', fontSize: '1.4rem', color: '#0f172a', fontWeight: '700' }}>{item.value}</h3>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>{item.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;
