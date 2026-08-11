// src/pages/Members/FamilyMembers.jsx
import React, { useState, useEffect } from 'react';
import { useHealth } from '../../context/HealthContext';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Edit2, Trash2, Heart, Activity, User, Info, Zap, Moon, Thermometer, Scale } from 'lucide-react';
import './members.css';

export const FamilyMembers = () => {
  const { state, user, addMember, editMember, deleteMember, addHealthMetric, fetchAllData } = useHealth();
  
  // Modal Control Matrix States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form Input Telemetry States (Auth Service)
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  // Health Matrix Service Entity States (HealthMetricRequest)
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [systolicBp, setSystolicBp] = useState('');
  const [diastolicBp, setDiastolicBp] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [oxygenSaturation, setOxygenSaturation] = useState('');
  const [temperature, setTemperature] = useState('');
  const [notes, setNotes] = useState('');

  const familyMembers = state.familyMembers || [];

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentMemberId(null);
    setName('');
    setMobileNumber('');
    setPassword('');
    // Reset Health Matrix fields
    setHeight('');
    setWeight('');
    setSystolicBp('');
    setDiastolicBp('');
    setBloodSugar('');
    setHeartRate('');
    setOxygenSaturation('');
    setTemperature('');
    setNotes('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const getLatestMetric = (mId) => {
    const memberMetrics = (state.healthMetrics || []).filter(
      (m) => (m.memberId || m.member) === mId
    );
    if (!memberMetrics.length) return null;
    return memberMetrics.slice().sort((a, b) => {
      const timeA = new Date(a.recordedAt || a.createdAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.recordedAt || b.createdAt || b.updatedAt || 0).getTime();
      return timeB - timeA;
    })[0];
  };

  const openEditModal = (e, member) => {
    e.stopPropagation();
    setIsEditMode(true);
    const mId = member.userId || member.id || member.memberId;
    setCurrentMemberId(mId);
    setName(member.name || '');
    setMobileNumber(member.mobileNumber || member.phone || '');
    setPassword('');

    // Fetch existing latest metric for member from HealthContext state
    const latest = getLatestMetric(mId);

    setHeight(latest?.height !== undefined && latest?.height !== null ? latest.height.toString() : '');
    setWeight(latest?.weight !== undefined && latest?.weight !== null ? latest.weight.toString() : '');
    setSystolicBp(latest?.systolicBp !== undefined && latest?.systolicBp !== null ? latest.systolicBp.toString() : '');
    setDiastolicBp(latest?.diastolicBp !== undefined && latest?.diastolicBp !== null ? latest.diastolicBp.toString() : '');
    setBloodSugar(latest?.bloodSugar !== undefined && latest?.bloodSugar !== null ? latest.bloodSugar.toString() : '');
    setHeartRate(latest?.heartRate !== undefined && latest?.heartRate !== null ? latest.heartRate.toString() : '');
    setOxygenSaturation(latest?.oxygenSaturation !== undefined && latest?.oxygenSaturation !== null ? latest.oxygenSaturation.toString() : '');
    setTemperature(latest?.temperature !== undefined && latest?.temperature !== null ? latest.temperature.toString() : '');
    setNotes(latest?.notes || '');

    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenProfileDeepDive = (member) => {
    setSelectedMember(member);
    setIsProfileOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    // Sanitize mobile number to 10 digits
    const cleanMobile = mobileNumber ? mobileNumber.replace(/\D/g, '').slice(-10) : '';

    if (!cleanMobile || cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg("Mobile number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9 (e.g. 9876543210).");
      setIsSubmitting(false);
      return;
    }

    if (!isEditMode && (!password || password.length < 6)) {
      setErrorMsg("Password must contain at least 6 characters.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditMode) {
        // 1. Update basic member info in Auth Service (PUT /family/members/{memberId})
        try {
          await editMember(currentMemberId, {
            name,
            mobileNumber: cleanMobile,
          });
        } catch (authErr) {
          console.warn("Auth service edit member notice:", authErr);
        }

        // 2. Save Health Metrics entity to Health Matrix Service (POST /api/v1/health-metrics)
        const isValidUUID = (str) => typeof str === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);
        const rawFamilyId = user?.familyId || localStorage.getItem("familyId");
        const familyId = isValidUUID(rawFamilyId) ? rawFamilyId : "00000000-0000-0000-0000-000000000000";
        const targetMemberId = isValidUUID(currentMemberId) ? currentMemberId : "00000000-0000-0000-0000-000000000000";
        const rawRecordedBy = user?.userId || user?.id || currentMemberId;
        const recordedBy = isValidUUID(rawRecordedBy) ? rawRecordedBy : targetMemberId;

        if (height || weight || systolicBp || diastolicBp || bloodSugar || heartRate || oxygenSaturation || temperature || notes) {
          await addHealthMetric({
            familyId,
            memberId: targetMemberId,
            recordedBy,
            height: height ? parseFloat(height) : null,
            weight: weight ? parseFloat(weight) : null,
            systolicBp: systolicBp ? parseInt(systolicBp, 10) : null,
            diastolicBp: diastolicBp ? parseInt(diastolicBp, 10) : null,
            bloodSugar: bloodSugar ? parseFloat(bloodSugar) : null,
            heartRate: heartRate ? parseInt(heartRate, 10) : null,
            oxygenSaturation: oxygenSaturation ? parseFloat(oxygenSaturation) : null,
            temperature: temperature ? parseFloat(temperature) : null,
            notes: notes || "Updated via Family Members",
            recordedAt: new Date().toISOString().substring(0, 19),
          });
        }

        if (fetchAllData) await fetchAllData();
      } else {
        // Add member in Auth Service (POST /family/members) - Only Name, Mobile, Password
        await addMember({
          name,
          mobileNumber: cleanMobile,
          password: password,
        });
        if (fetchAllData) await fetchAllData();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error submitting member form:", err);
      let errorText = "Operation failed. Please verify inputs.";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorText = err.response.data;
        } else if (err.response.data.message) {
          errorText = err.response.data.message;
        } else if (typeof err.response.data === "object") {
          errorText = Object.values(err.response.data).join(". ");
        }
      }
      setErrorMsg(errorText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Breadcrumbs />
      <div className="section-header">
        <div>
          <h2>Family Members Management</h2>
          <p>View, add, update, and manage your family unit profiles and health vitals.</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>+ Add Family Member</button>
      </div>

      {/* --- Dynamic Grid Cards Panel Layer --- */}
      <div className="grid grid-3" style={{ marginTop: '1.5rem' }}>
        {familyMembers.length > 0 ? (
          familyMembers.map((member) => {
            const memberId = member.userId || member.id || member.memberId;
            const latest = getLatestMetric(memberId);

            return (
              <div key={memberId} className="clickable-card-wrapper" onClick={() => handleOpenProfileDeepDive(member)}>
                <Card 
                  title={member.name} 
                  extra={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button className="icon-action-btn" onClick={(e) => openEditModal(e, member)} title="Edit Member & Health Metrics">
                        <Edit2 size={13} />
                      </button>
                    </div>
                  }
                >
                  <div className="member-card-body">
                    <span className="avatar">👤</span>
                    <div className="meta-details">
                      <p><strong>Mobile:</strong> <span>{member.mobileNumber || member.phone || 'N/A'}</span></p>
                      <p><strong>Role:</strong> <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{member.role || 'MEMBER'}</span></p>
                    </div>
                  </div>

                  <div className="vitals-summary-strip">
                    <div className="vital-tag">BP <span>{latest?.systolicBp || 120}/{latest?.diastolicBp || 80}</span></div>
                    <div className="vital-tag">Glucose <span>{latest?.bloodSugar || 95} mg/dL</span></div>
                    <div className="vital-tag">Weight <span>{latest?.weight || 70} kg</span></div>
                  </div>
                  <div style={{marginTop: '0.9rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <Info size={14} color="var(--primary)" /> Click card to view member profile details.
                  </div>
                </Card>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <User size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h3 style={{ margin: 0, color: '#334155' }}>No Family Members Found</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem 0' }}>Add your family members to manage their health records and medication schedules.</p>
            <button className="btn-primary" onClick={openAddModal}>+ Add Family Member</button>
          </div>
        )}
      </div>

      {/* MODAL 1: MEMBER PROFILE DOSSIER */}
      <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} title="Family Member Profile & Vitals">
        {selectedMember && (() => {
          const mId = selectedMember.userId || selectedMember.id || selectedMember.memberId;
          const latest = getLatestMetric(mId);

          return (
            <div className="profile-deep-dive" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="profile-hero-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '3rem' }}>👤</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>{selectedMember.name}</h3>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span className="badge badge-success">Mobile: {selectedMember.mobileNumber || selectedMember.phone || 'N/A'}</span>
                    <span className="badge badge-warning" style={{ background: '#e0e7ff', color: '#3730a3' }}>Role: {selectedMember.role || 'MEMBER'}</span>
                  </div>
                </div>
              </div>

              <h4 style={{ margin: '0', fontSize: '0.9rem', textTransform: 'uppercase', color: '#475569', letterSpacing: '0.05em' }}>Health Matrix Vitals</h4>

              <div className="vitals-extended-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div className="vital-large-card" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}><Activity size={14} /> Blood Pressure</div>
                  <p style={{ fontSize: '1.3rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-main)' }}>{latest?.systolicBp || 120}/{latest?.diastolicBp || 80} mmHg</p>
                </div>

                <div className="vital-large-card" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}><Zap size={14} /> Blood Sugar</div>
                  <p style={{ fontSize: '1.3rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-main)' }}>{latest?.bloodSugar || 95} mg/dL</p>
                </div>

                <div className="vital-large-card" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}><Heart size={14} /> Heart Rate</div>
                  <p style={{ fontSize: '1.3rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-main)' }}>{latest?.heartRate || 72} BPM</p>
                </div>

                <div className="vital-large-card" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7c3aed', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}><Moon size={14} /> SpO2 Oxygen</div>
                  <p style={{ fontSize: '1.3rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-main)' }}>{latest?.oxygenSaturation || 98}%</p>
                </div>

                <div className="vital-large-card" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ea580c', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}><Thermometer size={14} /> Temperature</div>
                  <p style={{ fontSize: '1.3rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-main)' }}>{latest?.temperature || 98.6} °F</p>
                </div>

                <div className="vital-large-card" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}><Scale size={14} /> Weight / Height</div>
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-main)' }}>{latest?.weight || 70} kg / {latest?.height || 170} cm</p>
                </div>
              </div>

              {latest?.notes && (
                <div style={{ background: '#f1f5f9', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', color: '#334155' }}>
                  <strong>Notes:</strong> {latest.notes}
                </div>
              )}

              <button className="btn-primary" style={{ background: '#e2e8f0', color: 'var(--text-main)', marginTop: '0.5rem' }} onClick={() => setIsProfileOpen(false)}>
                Close Profile
              </button>
            </div>
          );
        })()}
      </Modal>

      {/* MODAL 2: ADD / EDIT MEMBER FORM */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Update Member & Health Metrics" : "Add New Family Member"}>
        <form onSubmit={handleSubmit} className="modal-form-layout" style={{maxHeight:'75vh', overflowY:'auto', paddingRight:'5px'}}>
          {errorMsg && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '10px' }}>
              {errorMsg}
            </div>
          )}

          <div className="form-group">
            <label>Member Full Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Amit Sharma" required />
          </div>

          <div className="form-group">
            <label>Mobile Number *</label>
            <input type="text" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} placeholder="e.g. 9876543211" required />
          </div>

          {!isEditMode ? (
            /* ADD MEMBER MODE: Show ONLY Name, Mobile Number, Password */
            <div className="form-group">
              <label>Password *</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
          ) : (
            /* EDIT MEMBER MODE: Show Health Matrix Service Entity fields */
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#2563eb', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginTop: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={16} /> Health Matrix Metrics (Biometric Entity)
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Height (cm)</label>
                  <input type="number" step="0.1" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 175" />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Weight (kg)</label>
                  <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 70" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Systolic BP (mmHg)</label>
                  <input type="number" value={systolicBp} onChange={e => setSystolicBp(e.target.value)} placeholder="e.g. 120" />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Diastolic BP (mmHg)</label>
                  <input type="number" value={diastolicBp} onChange={e => setDiastolicBp(e.target.value)} placeholder="e.g. 80" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Fasting Blood Sugar (mg/dL)</label>
                  <input type="number" step="0.1" value={bloodSugar} onChange={e => setBloodSugar(e.target.value)} placeholder="e.g. 95" />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Heart Rate (BPM)</label>
                  <input type="number" value={heartRate} onChange={e => setHeartRate(e.target.value)} placeholder="e.g. 72" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Oxygen Saturation (% SpO2)</label>
                  <input type="number" step="0.1" value={oxygenSaturation} onChange={e => setOxygenSaturation(e.target.value)} placeholder="e.g. 98" />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Temperature (°F)</label>
                  <input type="number" step="0.1" value={temperature} onChange={e => setTemperature(e.target.value)} placeholder="e.g. 98.6" />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Clinical Notes / Observations</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Health vitals recorded..." rows={2} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>
          )}

          <button type="submit" className="auth-btn" style={{ marginTop: '1.25rem' }} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : isEditMode ? "Save Changes & Health Metrics" : "Add Member"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default FamilyMembers;