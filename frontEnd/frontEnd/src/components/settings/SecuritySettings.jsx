// src/components/settings/SecuritySettings.jsx
import React, { useState } from 'react';
import { Lock, Shield, Key } from 'lucide-react';
import './SecuritySettings.css';

export const SecuritySettings = () => {
  const [twoFactor, setTwoFactor] = useState(true);
  const [passwordMsg, setPasswordMsg] = useState('');

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordMsg('Password changed successfully!');
    setTimeout(() => setPasswordMsg(''), 3000);
  };

  return (
    <div className="settings-section-card">
      <h3>Security & Authentication</h3>

      <div className="setting-toggle-row">
        <div>
          <h4>Two-Factor Authentication (2FA)</h4>
          <p>Require SMS or Authenticator App OTP on login</p>
        </div>
        <input
          type="checkbox"
          checked={twoFactor}
          onChange={e => setTwoFactor(e.target.checked)}
          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
        />
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '1.25rem 0' }} />

      <form onSubmit={handleChangePassword}>
        <h4>Change Password</h4>
        {passwordMsg && <div className="alert-saved">✅ {passwordMsg}</div>}
        <div className="input-group">
          <label>Current Password</label>
          <input type="password" placeholder="••••••••" required />
        </div>
        <div className="input-group">
          <label>New Password</label>
          <input type="password" placeholder="••••••••" required />
        </div>
        <button type="submit" className="btn-save-settings">
          <Key size={16} /> Update Password
        </button>
      </form>
    </div>
  );
};

export default SecuritySettings;
