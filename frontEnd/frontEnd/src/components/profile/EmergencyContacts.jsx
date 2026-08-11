// src/components/profile/EmergencyContacts.jsx
import React from 'react';
import { PhoneCall, ShieldAlert, Plus } from 'lucide-react';
import './EmergencyContacts.css';

export const EmergencyContacts = ({ contacts = [], onAddContact }) => {
  return (
    <div className="emergency-contacts-card">
      <div className="ec-header">
        <h3><ShieldAlert size={20} color="#ef4444" /> Emergency Contacts</h3>
        {onAddContact && (
          <button onClick={onAddContact} className="btn-add-ec">
            <Plus size={16} /> Add Contact
          </button>
        )}
      </div>

      <div className="ec-list">
        {contacts.map(c => (
          <div key={c.id} className="ec-item">
            <div className="ec-info">
              <h4>{c.name}</h4>
              <span className="ec-role">{c.role}</span>
              <p className="ec-loc">{c.location}</p>
            </div>
            <a href={`tel:${c.phone}`} className="btn-call-ec">
              <PhoneCall size={16} /> {c.phone}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyContacts;
