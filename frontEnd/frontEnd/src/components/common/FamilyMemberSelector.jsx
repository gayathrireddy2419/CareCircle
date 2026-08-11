// src/components/common/FamilyMemberSelector.jsx
import React from 'react';
import { Users, Crown } from 'lucide-react';

export const FamilyMemberSelector = ({
  familyMembers = [],
  user = null,
  selectedId = 'ALL',
  onSelect,
  healthMetrics = []
}) => {
  // Extract all members including current head user if not in list
  const memberList = [...familyMembers];
  const currentUserId = user?.userId || user?.id;

  if (user && !memberList.some(m => (m.userId || m.id || m.memberId) === currentUserId || m.mobileNumber === user.mobileNumber)) {
    memberList.unshift({
      userId: currentUserId,
      name: user.name || 'Family Head',
      role: user.role || 'HEAD',
      mobileNumber: user.mobileNumber || user.phone
    });
  }

  const getMemId = (m) => m.userId || m.id || m.memberId;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#475569', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Select Member View
        </h3>
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          {selectedId === 'ALL' ? 'Showing Overall Family Unit' : 'Showing Individual Profile'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {/* ALL FAMILY CARD */}
        <div
          onClick={() => onSelect('ALL')}
          style={{
            minWidth: '200px',
            padding: '1rem 1.25rem',
            borderRadius: '16px',
            cursor: 'pointer',
            background: selectedId === 'ALL' ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' : '#ffffff',
            border: selectedId === 'ALL' ? '2px solid #2563eb' : '1px solid #e2e8f0',
            boxShadow: selectedId === 'ALL' ? '0 4px 14px rgba(37,99,235,0.15)' : '0 2px 6px rgba(0,0,0,0.02)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: selectedId === 'ALL' ? '#2563eb' : '#f1f5f9',
            color: selectedId === 'ALL' ? '#ffffff' : '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: '800' }}>
              Overall Family
            </h4>
            <span style={{ fontSize: '0.75rem', color: selectedId === 'ALL' ? '#1e40af' : '#64748b', fontWeight: '600' }}>
              {memberList.length} Member{memberList.length !== 1 ? 's' : ''} Combined
            </span>
          </div>
        </div>

        {/* INDIVIDUAL MEMBER CARDS */}
        {memberList.map((m) => {
          const mId = getMemId(m);
          const isSelected = selectedId === mId;
          const isHead = m.role === 'HEAD';

          // Get latest metric for mini tag
          const memMetrics = healthMetrics.filter(h => (h.memberId || h.member) === mId);
          const latest = memMetrics.length > 0 ? memMetrics[memMetrics.length - 1] : null;

          return (
            <div
              key={mId}
              onClick={() => onSelect(mId)}
              style={{
                minWidth: '210px',
                padding: '1rem 1.25rem',
                borderRadius: '16px',
                cursor: 'pointer',
                background: isSelected ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : '#ffffff',
                border: isSelected ? '2px solid #16a34a' : '1px solid #e2e8f0',
                boxShadow: isSelected ? '0 4px 14px rgba(22,163,74,0.15)' : '0 2px 6px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: isSelected ? '#16a34a' : (isHead ? '#fef3c7' : '#f1f5f9'),
                color: isSelected ? '#ffffff' : (isHead ? '#b45309' : '#64748b'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                {isHead ? '👨‍💼' : '👤'}
              </div>

              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {m.name}
                  {isHead && <Crown size={13} color="#b45309" />}
                </h4>
                <span style={{ fontSize: '0.75rem', color: isSelected ? '#15803d' : '#64748b', fontWeight: '600' }}>
                  {latest && latest.systolicBp ? `BP: ${latest.systolicBp}/${latest.diastolicBp}` : (isHead ? 'Family Head' : 'Member')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FamilyMemberSelector;
