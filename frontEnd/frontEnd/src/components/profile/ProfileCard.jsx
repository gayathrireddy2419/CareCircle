// src/components/profile/ProfileCard.jsx
import React from 'react';
import { Phone, User, Shield, Key } from 'lucide-react';
import './ProfileCard.css';

export const ProfileCard = ({ user }) => {
  const familyId = user?.familyId || localStorage.getItem("familyId") || 'N/A';
  const memberId = user?.userId || user?.id || 'N/A';

  return (
    <div className="user-profile-card">
      <div className="profile-top">
        <div className="profile-avatar">{user?.role === 'HEAD' ? '👨‍💼' : '👤'}</div>
        <div className="profile-title-block">
          <h2>{user?.name || 'Family Member'}</h2>
          <span className="profile-badge">{user?.role || 'MEMBER'}</span>
        </div>
      </div>

      <div className="profile-details-grid">
        <div className="detail-item">
          <Phone size={16} className="detail-icon" />
          <div>
            <span className="detail-label">Mobile Number</span>
            <p className="detail-value">{user?.mobileNumber || user?.phone || 'N/A'}</p>
          </div>
        </div>

        <div className="detail-item">
          <Shield size={16} className="detail-icon" color="#2563eb" />
          <div>
            <span className="detail-label">User Role</span>
            <p className="detail-value">{user?.role || 'MEMBER'}</p>
          </div>
        </div>

        <div className="detail-item">
          <User size={16} className="detail-icon" color="#10b981" />
          <div>
            <span className="detail-label">Family ID</span>
            <p className="detail-value" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{familyId}</p>
          </div>
        </div>

        <div className="detail-item">
          <Key size={16} className="detail-icon" color="#7c3aed" />
          <div>
            <span className="detail-label">Member ID</span>
            <p className="detail-value" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{memberId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
