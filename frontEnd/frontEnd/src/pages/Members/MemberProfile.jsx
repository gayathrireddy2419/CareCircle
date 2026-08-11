// src/pages/Members/MemberProfile.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHealth } from '../../context/HealthContext';
import { ArrowLeft, User, Heart, Activity, Droplet, Pill, FileText, AlertTriangle } from 'lucide-react';

export const MemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useHealth();

  const member = state.familyMembers.find(m => m.id === parseInt(id) || m.id === id) || state.familyMembers[0];

  if (!member) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Member Not Found</h2>
        <button onClick={() => navigate('/app/members')}>Back to Family Members</button>
      </div>
    );
  }

  const memberMedicines = (state.medicines || []).filter(m => m.member === member.name);
  const memberRecords = (state.records || []).filter(r => r.member === member.name);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/app/members')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'transparent', color: '#2563eb', fontWeight: '600', cursor: 'pointer', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={18} /> Back to Family Members
      </button>

      <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3.5rem', background: '#eff6ff', width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #2563eb' }}>
            {member.photo || '👤'}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a' }}>{member.name}</h1>
            <span style={{ display: 'inline-block', background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', marginTop: '6px' }}>
              {member.relationship} • {member.age} Years Old
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Blood Group</span>
            <h3 style={{ margin: '2px 0 0 0', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Droplet size={18} /> {member.bloodGroup}
            </h3>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Health Score</span>
            <h3 style={{ margin: '2px 0 0 0', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Heart size={18} /> {member.healthScore || 90}/100
            </h3>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Chronic Conditions</span>
            <h4 style={{ margin: '2px 0 0 0', color: '#334155' }}>{member.chronic || 'None'}</h4>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Known Allergies</span>
            <h4 style={{ margin: '2px 0 0 0', color: '#ef4444' }}>{member.allergies || 'None'}</h4>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Pill size={18} color="#10b981" /> Active Medications ({memberMedicines.length})
          </h3>
          {memberMedicines.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No active prescriptions logged.</p>
          ) : (
            memberMedicines.map(m => (
              <div key={m.id} style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px', marginBottom: '8px' }}>
                <strong style={{ color: '#1e293b' }}>{m.name} ({m.dosage})</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Frequency: {m.frequency} | Stock: {m.stock} pills</p>
              </div>
            ))
          )}
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#2563eb" /> Medical Records ({memberRecords.length})
          </h3>
          {memberRecords.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No records uploaded for this member.</p>
          ) : (
            memberRecords.map(r => (
              <div key={r.id} style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px', marginBottom: '8px' }}>
                <strong style={{ color: '#1e293b' }}>{r.name}</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Type: {r.type} | Date: {r.date}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
