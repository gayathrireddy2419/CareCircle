// src/components/settings/BackupSettings.jsx
import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { FileText, Check } from 'lucide-react';
import medicationApi from '../../api/medicationApi';
import { generateMemberHealthPDF } from '../../services/pdfExportService';
import './BackupSettings.css';

export const BackupSettings = () => {
  const { user, state } = useHealth();
  const [downloaded, setDownloaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);

      const currentUserId = user?.userId || user?.id;
      const currentMember = (state.familyMembers || []).find(
        (m) => (m.userId || m.id || m.memberId) === currentUserId || m.mobileNumber === user?.mobileNumber
      );

      const targetMemberId = currentMember?.userId || currentMember?.id || currentMember?.memberId || currentUserId;

      // Filter health metrics strictly for logged-in member
      const memberMetrics = (state.healthMetrics || []).filter((m) => {
        const targetId = m.memberId || m.member || m.userId || m.id;
        return (
          targetId === targetMemberId ||
          (currentMember && (targetId === currentMember.id || targetId === currentMember.memberId || targetId === currentMember.userId))
        );
      });

      const latestMetric = memberMetrics.length > 0 ? memberMetrics.slice().sort((a, b) => {
        const timeA = new Date(a.recordedAt || a.createdAt || a.updatedAt || 0).getTime();
        const timeB = new Date(b.recordedAt || b.createdAt || b.updatedAt || 0).getTime();
        return timeB - timeA;
      })[0] : null;

      // 1. Fetch member-specific active medication schedules from medicationApi
      let memberMedicines = [];
      try {
        if (targetMemberId) {
          const schedules = await medicationApi.getMemberSchedules(targetMemberId);
          const schedList = Array.isArray(schedules) ? schedules : schedules?.data || schedules?.schedules || [];
          
          memberMedicines = schedList.map(s => {
            const matchedInv = (state.medicines || []).find(m => (m.inventoryId || m.id) === s.inventoryId);
            return {
              medicineName: s.medicineName || matchedInv?.medicineName || matchedInv?.name || 'Prescription Medicine',
              strength: s.dosage || matchedInv?.strength || 'Standard',
              dosageForm: matchedInv?.dosageForm || 'Tablet',
              frequency: s.frequency || 'Daily',
              instructions: s.beforeFood ? 'Before Food' : 'After Food'
            };
          });
        }
      } catch (schedErr) {
        console.warn("Could not fetch member schedules for PDF:", schedErr.message);
      }

      // 2. Fallback filter state.medicines strictly by member ID (excluding COMMON/SHARED and other members)
      if (memberMedicines.length === 0 && Array.isArray(state.medicines)) {
        memberMedicines = state.medicines.filter(med => {
          const assigned = med.assignedTo || med.memberId;
          if (!assigned || assigned === 'COMMON' || assigned === 'SHARED') return false;
          return (
            assigned === targetMemberId ||
            (currentMember && (assigned === currentMember.id || assigned === currentMember.memberId || assigned === currentMember.userId))
          );
        });
      }

      generateMemberHealthPDF({
        member: {
          name: currentMember?.name || user?.name || "Family User",
          mobileNumber: currentMember?.mobileNumber || user?.mobileNumber || user?.phone || "N/A",
          phone: currentMember?.mobileNumber || user?.mobileNumber || user?.phone || "N/A",
          role: currentMember?.role || user?.role || "MEMBER",
          familyId: user?.familyId || localStorage.getItem("familyId") || "N/A"
        },
        latestMetric,
        medicines: memberMedicines,
        reportDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      });

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3500);
    } catch (err) {
      console.error("PDF Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="settings-section-card">
      <h3>Data Backup & Export</h3>
      <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Download a complete formatted health report PDF of your vitals, notes, and active medicines.</p>

      {downloaded && <div className="alert-saved">✅ Member Health Summary PDF Exported</div>}

      <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
        <button onClick={handleExportPDF} disabled={isExporting} className="btn-save-settings">
          <FileText size={16} /> {isExporting ? "Generating PDF..." : "Export Health Summary (PDF)"}
        </button>
      </div>
    </div>
  );
};

export default BackupSettings;
