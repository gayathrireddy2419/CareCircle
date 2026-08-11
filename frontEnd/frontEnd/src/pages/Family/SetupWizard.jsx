// src/pages/Family/SetupWizard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealth } from '../../context/HealthContext';
import { Check, UserPlus, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';

export const SetupWizard = () => {
  const navigate = useNavigate();
  const { addMember, addEmergencyContact } = useHealth();
  const [step, setStep] = useState(1);

  const [member, setMember] = useState({ name: '', relationship: 'Spouse', age: 30, bloodGroup: 'O+', photo: '👩‍💼', chronic: 'None', allergies: 'None' });
  const [contact, setContact] = useState({ name: '', role: 'Family Doctor', phone: '', location: 'Local Hospital' });

  const handleNextStep = () => {
    if (step === 1 && member.name) {
      addMember(member);
    } else if (step === 2 && contact.name) {
      addEmergencyContact(contact);
    }
    if (step < 3) setStep(step + 1);
    else navigate('/app/dashboard');
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>Family Account Onboarding Wizard</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Set up your primary family profile and emergency network in 3 quick steps.</p>

        {/* Wizard Steps indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
          <div style={{ color: step >= 1 ? '#2563eb' : '#94a3b8', fontWeight: '700' }}>1. Add Member</div>
          <div style={{ color: step >= 2 ? '#2563eb' : '#94a3b8', fontWeight: '700' }}>2. Emergency Contacts</div>
          <div style={{ color: step >= 3 ? '#2563eb' : '#94a3b8', fontWeight: '700' }}>3. Complete</div>
        </div>

        {step === 1 && (
          <div>
            <h3>Add Secondary Family Member</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Name</label>
              <input type="text" value={member.name} onChange={e => setMember({ ...member, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="e.g. Sarah Doe" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Relationship</label>
                <select value={member.relationship} onChange={e => setMember({ ...member, relationship: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option>Spouse</option><option>Child</option><option>Parent</option><option>Sibling</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Blood Group</label>
                <select value={member.bloodGroup} onChange={e => setMember({ ...member, bloodGroup: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option>A+</option><option>B+</option><option>O+</option><option>AB+</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Add Primary Emergency Contact</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Contact / Doctor Name</label>
              <input type="text" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="e.g. Dr. Mark Vance" required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Phone Number</label>
              <input type="text" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="+1 555-0199" required />
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ background: '#dcfce7', width: '60px', height: '60px', borderRadius: '50%', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Check size={32} />
            </div>
            <h2>Setup Completed!</h2>
            <p style={{ color: '#64748b' }}>Your family health portal is fully configured and ready to use.</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          {step > 1 && step < 3 && (
            <button onClick={() => setStep(step - 1)} style={{ padding: '10px 18px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Back
            </button>
          )}
          <button onClick={handleNextStep} style={{ marginLeft: 'auto', padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            {step === 3 ? 'Go to Dashboard' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
