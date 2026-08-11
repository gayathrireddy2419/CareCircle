// src/pages/Profile/Profile.jsx
import React, { useEffect } from 'react';
import { useHealth } from '../../context/HealthContext';
import ProfileCard from '../../components/profile/ProfileCard';
import MedicalSummary from '../../components/profile/MedicalSummary';
import InsuranceCard from '../../components/profile/InsuranceCard';
import './Profile.css';

export default function Profile() {
  const { user, state, fetchAllData } = useHealth();

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Current logged in user ID
  const currentUserId = user?.userId || user?.id;

  // Find member details from familyMembers list
  const currentMember = (state.familyMembers || []).find(
    (m) => (m.userId || m.id || m.memberId) === currentUserId || m.mobileNumber === user?.mobileNumber
  );

  const targetMemberId = currentMember?.userId || currentMember?.id || currentMember?.memberId || currentUserId;

  // Find latest health vitals from HealthContext healthMetrics state matching FamilyMemberCard logic exactly
  const getLatestMetric = (mId) => {
    if (!mId) return null;
    const memberMetrics = (state.healthMetrics || []).filter((m) => {
      const targetId = m.memberId || m.member || m.userId || m.id;
      return (
        targetId === mId ||
        (currentMember && (targetId === currentMember.id || targetId === currentMember.memberId || targetId === currentMember.userId))
      );
    });
    if (!memberMetrics.length) return null;
    return memberMetrics.slice().sort((a, b) => {
      const timeA = new Date(a.recordedAt || a.createdAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.recordedAt || b.createdAt || b.updatedAt || 0).getTime();
      return timeB - timeA;
    })[0];
  };

  const latestMetric = getLatestMetric(targetMemberId);

  // Real profile data object
  const profileUser = {
    name: currentMember?.name || user?.name || "Family User",
    role: currentMember?.role || user?.role || "MEMBER",
    mobileNumber: currentMember?.mobileNumber || user?.mobileNumber || user?.phone || "N/A",
    phone: currentMember?.mobileNumber || user?.mobileNumber || user?.phone || "N/A",
    familyId: user?.familyId || localStorage.getItem("familyId") || "N/A",
    userId: targetMemberId || "N/A",
    id: targetMemberId || "N/A"
  };

  // Match Family Member Card format & fallbacks exactly
  const displayBp = `${latestMetric?.systolicBp || 120}/${latestMetric?.diastolicBp || 80} mmHg`;
  const displaySugar = `${latestMetric?.bloodSugar || 95} mg/dL`;

  return (
    <div className="profile-page-container">
      <div className="profile-page-header">
        <h1>User Profile & Health ID</h1>
        <p>Manage personal credentials and medical overview</p>
      </div>

      <div className="profile-layout-grid">
        <div className="profile-main-column">
          <ProfileCard user={profileUser} />
          <MedicalSummary
            bp={displayBp}
            sugar={displaySugar}
          />
        </div>

        <div className="profile-side-column">
          <InsuranceCard
            provider="CareCircle Microservices Pass"
            policyNo={`POL-${(profileUser.familyId || '0000').substring(0, 8).toUpperCase()}`}
            groupNo={`GRP-${(profileUser.userId || '0000').substring(0, 6).toUpperCase()}`}
            validTill="12/2030"
          />
        </div>
      </div>
    </div>
  );
}