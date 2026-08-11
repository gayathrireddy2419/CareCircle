// src/pages/Settings/Settings.jsx
import React, { useState } from 'react';
import AccountSettings from '../../components/settings/AccountSettings';
import SecuritySettings from '../../components/settings/SecuritySettings';
import ThemeSettings from '../../components/settings/ThemeSettings';
import BackupSettings from '../../components/settings/BackupSettings';
import { User, Lock, Sun, Database } from 'lucide-react';
import './Settings.css';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'security', label: 'Security & 2FA', icon: <Lock size={18} /> },
    { id: 'theme', label: 'Theme & Display', icon: <Sun size={18} /> },
    { id: 'backup', label: 'Backup & Export', icon: <Database size={18} /> },
  ];

  return (
    <div className="settings-page-container">
      <div className="settings-header">
        <h1>Application Settings</h1>
        <p>Configure security, themes, and data backup</p>
      </div>

      <div className="settings-wrapper">
        <div className="settings-tabs-sidebar">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`settings-tab-btn ${activeTab === t.id ? 'active' : ''}`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-tab-content">
          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'theme' && <ThemeSettings />}
          {activeTab === 'backup' && <BackupSettings />}
        </div>
      </div>
    </div>
  );
}