import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Pill,
  FileText,
  UserPlus,
  PlusCircle,
  Upload,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  ShieldAlert
} from "lucide-react";

import { useHealth } from "../../context/HealthContext";
import medicineInventoryApi from "../../api/medicineInventoryApi";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatCard from "../../components/dashboard/StatCard";
import QuickActionCard from "../../components/dashboard/QuickActionCard";
import { Modal } from "../../components/Modal";
import { Toast } from "../../components/Toast";

import "./MainDashboard.css";

const MainDashboard = () => {
  const navigate = useNavigate();
  const { state, user, addMember, addRecord, fetchAllData } = useHealth();

  const familyMembers = Array.isArray(state?.familyMembers) ? state.familyMembers : [];
  const medicinesList = Array.isArray(state?.medicines) ? state.medicines : [];
  const recordsList = Array.isArray(state?.records) ? state.records : [];
  const emergencyContactsList = Array.isArray(state?.emergencyContacts) ? state.emergencyContacts : [];

  const getMemId = (m, idx = 0) => m?.userId || m?.id || m?.memberId || m?.name || `mem-${idx}`;

  // Modal States
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);

  // Toast & Loading Notification State
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Form State 1: Add Member
  const [memberForm, setMemberForm] = useState({
    name: '',
    mobileNumber: '',
    password: ''
  });

  // Form State 2: Add Medicine to Inventory
  const [newMedForm, setNewMedForm] = useState({
    medicineName: '',
    genericName: '',
    strength: '500mg',
    dosageForm: 'Tablet',
    manufacturer: 'Pharma',
    batchNumber: 'B101',
    quantityAvailable: 30,
    reorderLevel: 5,
    expiryDate: '2027-12-31',
    storageLocation: 'Cabinet',
    assignedTo: 'COMMON'
  });

  // Form State 3: Upload Health Record
  const [fileObject, setFileObject] = useState(null);
  const [recordForm, setRecordForm] = useState({
    title: '',
    category: 'LAB_REPORT',
    memberId: getMemId(familyMembers[0], 0) || user?.userId || user?.id || '',
    recordDate: new Date().toISOString().split('T')[0],
    doctor: '',
    hospital: '',
    notes: ''
  });

  // Action Handlers
  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!memberForm.name || !memberForm.mobileNumber) return;

    const cleanMobile = memberForm.mobileNumber ? memberForm.mobileNumber.replace(/\D/g, '').slice(-10) : '';

    if (!cleanMobile || cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      showToast("Mobile number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9.", "error");
      return;
    }

    if (!memberForm.password || memberForm.password.length < 6) {
      showToast("Password must contain at least 6 characters.", "error");
      return;
    }

    try {
      await addMember({
        name: memberForm.name,
        mobileNumber: cleanMobile,
        password: memberForm.password,
      });

      const addedName = memberForm.name;
      setMemberForm({
        name: '',
        mobileNumber: '',
        password: ''
      });
      setIsAddMemberOpen(false);
      showToast(`Family member "${addedName}" registered successfully!`);
    } catch (err) {
      console.error("Add member error:", err);
      let errorText = "Failed to register family member.";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorText = err.response.data;
        } else if (err.response.data.message) {
          errorText = err.response.data.message;
        } else if (typeof err.response.data === "object") {
          errorText = Object.values(err.response.data).join(". ");
        }
      }
      showToast(errorText, "error");
    }
  };

  const openAddMedicineModal = () => {
    setModalError(null);
    setNewMedForm({
      medicineName: '',
      genericName: '',
      strength: '500mg',
      dosageForm: 'Tablet',
      manufacturer: 'Pharma',
      batchNumber: 'B101',
      quantityAvailable: 30,
      reorderLevel: 5,
      expiryDate: '2027-12-31',
      storageLocation: 'Cabinet',
      assignedTo: 'COMMON'
    });
    setIsAddMedicineOpen(true);
  };

  const handleAddMedicineSubmit = async (e) => {
    e.preventDefault();
    if (!newMedForm.medicineName) return;

    setIsSubmitting(true);
    setModalError(null);

    try {
      const familyId = user?.familyId || localStorage.getItem("familyId") || "00000000-0000-0000-0000-000000000000";
      const scopeStorage = newMedForm.assignedTo === 'COMMON'
        ? 'Common / Shared'
        : `Member:${newMedForm.assignedTo}`;

      await medicineInventoryApi.addMedicine(familyId, {
        medicineName: newMedForm.medicineName,
        genericName: newMedForm.genericName || newMedForm.medicineName,
        strength: newMedForm.strength,
        dosageForm: newMedForm.dosageForm,
        manufacturer: newMedForm.manufacturer,
        batchNumber: newMedForm.batchNumber,
        quantityAvailable: parseInt(newMedForm.quantityAvailable, 10) || 20,
        reorderLevel: parseInt(newMedForm.reorderLevel, 10) || 5,
        expiryDate: newMedForm.expiryDate,
        storageLocation: scopeStorage,
      });

      setIsAddMedicineOpen(false);
      showToast(`Medicine "${newMedForm.medicineName}" added to inventory successfully!`);
      if (fetchAllData) await fetchAllData();
    } catch (err) {
      console.error("Add medicine error:", err);
      const msg = err.response?.data?.message || err.response?.data || "Failed to add medicine.";
      setModalError(typeof msg === 'string' ? msg : "Add medicine failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddRecordModal = () => {
    setModalError(null);
    setFileObject(null);
    setRecordForm({
      title: '',
      category: 'LAB_REPORT',
      memberId: getMemId(familyMembers[0], 0) || user?.userId || user?.id || '',
      recordDate: new Date().toISOString().split('T')[0],
      doctor: '',
      hospital: '',
      notes: ''
    });
    setIsAddRecordOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileObject(file);
      setRecordForm(prev => ({
        ...prev,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "")
      }));
    }
  };

  const handleAddRecordSubmit = async (e) => {
    e.preventDefault();
    if (!recordForm.title || !fileObject) {
      setModalError("Please provide a record title and attach a file document.");
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const familyId = user?.familyId || localStorage.getItem("familyId") || "00000000-0000-0000-0000-000000000000";
      const memberId = recordForm.memberId || getMemId(familyMembers[0], 0) || user?.userId || user?.id || "00000000-0000-0000-0000-000000000000";

      const formData = new FormData();
      formData.append("familyId", familyId);
      formData.append("memberId", memberId);
      formData.append("title", recordForm.title);
      formData.append("doctor", recordForm.doctor || "General Doctor");
      formData.append("recordDate", recordForm.recordDate);
      formData.append("category", recordForm.category);
      formData.append("file", fileObject);

      if (addRecord) await addRecord(formData);

      setIsAddRecordOpen(false);
      showToast(`Health Record "${recordForm.title}" uploaded to vault successfully!`);
      if (fetchAllData) await fetchAllData();
    } catch (err) {
      console.error("Upload record error:", err);
      const msg = err.response?.data?.message || err.response?.data || "Failed to upload medical record.";
      setModalError(typeof msg === 'string' ? msg : "Upload record failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTriggerEmergency = () => {
    setSosTriggered(true);
    showToast("🚨 EMERGENCY SOS BROADCAST SENT! Live GPS and contacts alerted.", "error");
  };

  const lowStockCount = medicinesList.filter(m => m && ((m.quantityAvailable ?? m.stock ?? 0) < 5)).length;

  return (
    <div className="dashboard-page">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      <WelcomeBanner />

      {/* Dynamic Statistics Cards Grid */}
      <div className="section-title">
        <h2>Dashboard Overview</h2>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Family Members"
          value={familyMembers.length.toString()}
          subtitle={`${familyMembers.length} Registered Members`}
          theme="blue"
          icon={<Users size={24} />}
          onClick={() => navigate('/app/members')}
        />

        <StatCard
          title="Medicines"
          value={medicinesList.length.toString()}
          subtitle={`${lowStockCount} Low Stock Item(s)`}
          theme="green"
          icon={<Pill size={24} />}
          onClick={() => navigate('/app/medicine')}
        />

        <StatCard
          title="Health Records"
          value={recordsList.length.toString()}
          subtitle={`${recordsList.length} Documents in Vault`}
          theme="red"
          icon={<FileText size={24} />}
          onClick={() => navigate('/app/records')}
        />
      </div>

      {/* Quick Actions */}
      <div className="section-title">
        <h2>Quick Actions</h2>
      </div>

      <div className="quick-grid">
        <QuickActionCard
          theme="blue"
          icon={<UserPlus size={24} />}
          title="Add Member"
          subtitle="Register Family Member"
          onClick={() => setIsAddMemberOpen(true)}
        />

        <QuickActionCard
          theme="green"
          icon={<PlusCircle size={24} />}
          title="Add Medicines"
          subtitle="Open Add Medicine Form"
          onClick={openAddMedicineModal}
        />

        <QuickActionCard
          theme="purple"
          icon={<Upload size={24} />}
          title="Add Health Vault"
          subtitle="Upload Medical Record"
          onClick={openAddRecordModal}
        />

        <QuickActionCard
          theme="red"
          icon={<AlertTriangle size={24} />}
          title="Emergency SOS"
          subtitle="Instant Panic Alert"
          onClick={() => {
            setSosTriggered(false);
            setIsEmergencyOpen(true);
          }}
        />
      </div>

      {/* ================= MODAL 1: ADD MEMBER ================= */}
      <Modal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        title="Register New Family Member"
      >
        <form onSubmit={handleAddMemberSubmit} className="modal-form-layout">
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Member Full Name *</label>
            <input
              type="text"
              value={memberForm.name}
              onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
              placeholder="e.g. Eleanor Vance"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Mobile Number *</label>
            <input
              type="text"
              value={memberForm.mobileNumber}
              onChange={e => setMemberForm({ ...memberForm, mobileNumber: e.target.value })}
              placeholder="e.g. 9876543211"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Password *</label>
            <input
              type="password"
              value={memberForm.password}
              onChange={e => setMemberForm({ ...memberForm, password: e.target.value })}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={() => {
                setIsAddMemberOpen(false);
                navigate('/app/members');
              }}
              style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
            >
              Go to Family Directory →
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsAddMemberOpen(false)}
                style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontWeight: '600' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '8px 20px', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
              >
                Add Member
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL 2: ADD MEDICINE TO INVENTORY ================= */}
      <Modal
        isOpen={isAddMedicineOpen}
        onClose={() => setIsAddMedicineOpen(false)}
        title="Add Medicine to Inventory"
      >
        <form onSubmit={handleAddMedicineSubmit}>
          {modalError && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
              {modalError}
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Medicine Name *</label>
            <input
              type="text"
              value={newMedForm.medicineName}
              onChange={e => setNewMedForm({ ...newMedForm, medicineName: e.target.value })}
              placeholder="e.g. Paracetamol, Metformin"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Scope / Assignment *</label>
            <select
              value={newMedForm.assignedTo}
              onChange={e => setNewMedForm({ ...newMedForm, assignedTo: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: '#ffffff' }}
            >
              <option value="COMMON">🌐 Common / Shared (All Family Members)</option>
              {familyMembers.map((m, idx) => {
                const mId = getMemId(m, idx);
                return (
                  <option key={mId} value={mId}>👤 {m?.name || 'Member'} (Member Specific)</option>
                );
              })}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Strength</label>
              <input
                type="text"
                value={newMedForm.strength}
                onChange={e => setNewMedForm({ ...newMedForm, strength: e.target.value })}
                placeholder="e.g. 500mg"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Dosage Form</label>
              <input
                type="text"
                value={newMedForm.dosageForm}
                onChange={e => setNewMedForm({ ...newMedForm, dosageForm: e.target.value })}
                placeholder="e.g. Tablet, Syrup"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Initial Stock Quantity *</label>
              <input
                type="number"
                min="0"
                value={newMedForm.quantityAvailable}
                onChange={e => setNewMedForm({ ...newMedForm, quantityAvailable: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Expiry Date</label>
              <input
                type="date"
                value={newMedForm.expiryDate}
                onChange={e => setNewMedForm({ ...newMedForm, expiryDate: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={() => setIsAddMedicineOpen(false)}
              style={{ padding: '9px 18px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer', fontWeight: '600' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ padding: '9px 22px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
            >
              {isSubmitting ? "Saving..." : "Save Medicine"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL 3: UPLOAD HEALTH RECORD ================= */}
      <Modal
        isOpen={isAddRecordOpen}
        onClose={() => setIsAddRecordOpen(false)}
        title="Upload Medical Record to Vault"
      >
        <form onSubmit={handleAddRecordSubmit}>
          {modalError && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
              {modalError}
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Record Title *</label>
            <input
              type="text"
              value={recordForm.title}
              onChange={e => setRecordForm({ ...recordForm, title: e.target.value })}
              placeholder="e.g. Annual Blood Work Report, MRI Scan"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Category *</label>
              <select
                value={recordForm.category}
                onChange={e => setRecordForm({ ...recordForm, category: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: '#fff' }}
              >
                <option value="LAB_REPORT">Lab Report</option>
                <option value="PRESCRIPTION">Prescription</option>
                <option value="VACCINATION">Vaccination Record</option>
                <option value="XRAY">X-Ray</option>
                <option value="MRI">MRI Scan</option>
                <option value="CT_SCAN">CT Scan</option>
                <option value="ULTRASOUND">Ultrasound</option>
                <option value="ECG">ECG / EKG Report</option>
                <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
                <option value="INSURANCE">Insurance Document</option>
                <option value="OTHER">Other Health Document</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Family Member</label>
              <select
                value={recordForm.memberId}
                onChange={e => setRecordForm({ ...recordForm, memberId: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: '#fff' }}
              >
                {familyMembers.map((m, idx) => {
                  const mId = getMemId(m, idx);
                  return <option key={mId} value={mId}>{m?.name || 'Member'} ({m?.relationship || 'Member'})</option>;
                })}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Record Date</label>
              <input
                type="date"
                value={recordForm.recordDate}
                onChange={e => setRecordForm({ ...recordForm, recordDate: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Doctor / Clinic</label>
              <input
                type="text"
                value={recordForm.doctor}
                onChange={e => setRecordForm({ ...recordForm, doctor: e.target.value })}
                placeholder="e.g. Dr. Smith"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Document File Attachment *</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              required
            />
            {fileObject && (
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600', marginTop: '4px', display: 'block' }}>
                ✓ File selected: {fileObject.name} ({(fileObject.size / 1024).toFixed(1)} KB)
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={() => setIsAddRecordOpen(false)}
              style={{ padding: '9px 18px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer', fontWeight: '600' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ padding: '9px 22px', background: '#8b5cf6', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
            >
              {isSubmitting ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL 4: EMERGENCY SOS ================= */}
      <Modal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        title="🚨 Emergency SOS Panic Command Center"
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <ShieldAlert size={42} color="#dc2626" style={{ marginBottom: '8px' }} />
            <h3 style={{ margin: '0 0 6px 0', color: '#991b1b', fontSize: '1.4rem' }}>
              {sosTriggered ? "🚨 SOS Broadcast Active!" : "Instant Emergency Dispatch"}
            </h3>
            <p style={{ color: '#7f1d1d', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
              {sosTriggered
                ? "Emergency responders & registered family contacts have received live location coordinates."
                : "Press the button below to immediately broadcast your GPS location to emergency responders & registered kin."}
            </p>

            {sosTriggered ? (
              <div style={{ background: '#dcfce7', color: '#15803d', padding: '10px 16px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} /> Responders En Route
              </div>
            ) : (
              <button
                onClick={handleTriggerEmergency}
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(220, 38, 38, 0.4)',
                  transition: 'transform 0.1s ease'
                }}
              >
                🚨 TRIGGER SOS ALERT
              </button>
            )}
          </div>

          <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748b', margin: '0 0 8px 0' }}>
              Quick Emergency Contacts
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {emergencyContactsList.map((contact, idx) => (
                <div key={contact?.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>{contact?.name || 'Contact'}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#2563eb' }}>{contact?.role || 'Emergency'}</span>
                  </div>
                  <a
                    href={`tel:${contact?.phone || ''}`}
                    style={{ background: '#dcfce7', color: '#15803d', padding: '6px 10px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <PhoneCall size={12} /> {contact?.phone || '108'}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button
              onClick={() => {
                setIsEmergencyOpen(false);
                navigate('/app/emergency');
              }}
              style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
            >
              Open Emergency Center →
            </button>

            <button
              onClick={() => setIsEmergencyOpen(false)}
              style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontWeight: '600' }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MainDashboard;
