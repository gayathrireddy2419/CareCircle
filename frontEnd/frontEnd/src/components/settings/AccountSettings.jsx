// src/components/settings/AccountSettings.jsx
import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { User, Phone, Save } from 'lucide-react';
import './AccountSettings.css';

export const AccountSettings = () => {
  const { user, updateProfile } = useHealth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.mobileNumber || user?.phone || ''
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form className="settings-section-card" onSubmit={handleSubmit}>
      <h3>Account Information</h3>
      {saved && <div className="alert-saved">✅ Account updated successfully</div>}
      <div className="input-group">
        <label><User size={16} /> Full Name</label>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className="input-group">
        <label><Phone size={16} /> Mobile Number</label>
        <input
          type="text"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <button type="submit" className="btn-save-settings">
        <Save size={16} /> Save Account Settings
      </button>
    </form>
  );
};

export default AccountSettings;
