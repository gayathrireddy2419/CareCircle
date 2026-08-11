// src/pages/Family/FamilyDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealth } from '../../context/HealthContext';
import { Users, Heart, ShieldAlert, Plus, UserPlus } from 'lucide-react';

export const FamilyDashboard = () => {
  const navigate = useNavigate();
  const { state } = useHealth();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a' }}>Family Health Hub</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Overview of all registered family members and their vitals</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/app/setup-wizard')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}
          >
            Setup Wizard
          </button>
          <button
            onClick={() => navigate('/app/members')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}
          >
            <UserPlus size={16} /> Manage Members
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {state.familyMembers.map(member => (
          <div
            key={member.id}
            onClick={() => navigate(`/app/members/${member.id}`)}
            style={{
              background: '#fff',
              padding: '1.5rem',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2.5rem', background: '#eff6ff', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {member.photo || '👤'}
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#0f172a' }}>{member.name}</h3>
                <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '600' }}>{member.relationship} ({member.age} yrs)</span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Health Index Score</span>
              <strong style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Heart size={16} /> {member.healthScore || 90}/100
              </strong>
            </div>

            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
              <p style={{ margin: '2px 0' }}>Blood Group: <strong style={{ color: '#ef4444' }}>{member.bloodGroup}</strong></p>
              <p style={{ margin: '2px 0' }}>Chronic Condition: <strong>{member.chronic || 'None'}</strong></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyDashboard;
