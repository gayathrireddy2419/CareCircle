import React from 'react';

export const ChartMock = ({ type, data, height = 150 }) => {
  return (
    <div style={{ height, background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', padding: '10px', gap: '8px', position: 'relative', overflow: 'hidden' }}>
      {data.map((item, index) => {
        const heightPercent = item.value || 50;
        return (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 2 }}>
            <div style={{ height: `${heightPercent}%`, width: '100%', background: type === 'area' ? 'rgba(37, 99, 235, 0.7)' : '#10b981', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease' }} />
            <span style={{ fontSize: '10px', color: '#64748b' }}>{item.label}</span>
          </div>
        );
      })}
      <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>
        Dynamic {type.toUpperCase()} Telemetry
      </div>
    </div>
  );
};