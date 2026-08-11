// src/components/settings/ThemeSettings.jsx
import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { Sun, Moon } from 'lucide-react';
import './ThemeSettings.css';

export const ThemeSettings = () => {
  const { state, updateSettings } = useHealth();
  const settings = state.userSettings || {};

  return (
    <div className="settings-section-card">
      <h3>Theme & Display</h3>
      <div style={{ display: 'flex', gap: '16px', marginTop: '1rem' }}>
        <button
          onClick={() => updateSettings({ theme: 'light' })}
          style={{
            flex: 1,
            padding: '1.25rem',
            borderRadius: '12px',
            border: (settings.theme || 'light') === 'light' ? '2px solid #2563eb' : '1px solid #e2e8f0',
            background: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: '600'
          }}
        >
          <Sun size={20} color="#f59e0b" /> Light Mode
        </button>

        <button
          onClick={() => updateSettings({ theme: 'dark' })}
          style={{
            flex: 1,
            padding: '1.25rem',
            borderRadius: '12px',
            border: settings.theme === 'dark' ? '2px solid #2563eb' : '1px solid #e2e8f0',
            background: '#0f172a',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: '600'
          }}
        >
          <Moon size={20} color="#38bdf8" /> Dark Mode
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings;
