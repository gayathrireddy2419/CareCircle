// src/pages/Records/RecordsVault.jsx
import React, { useState, useEffect } from 'react';
import { useHealth } from '../../context/HealthContext';
import healthRecordApi from '../../api/healthRecordApi';
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  Eye,
  Download,
  Search,
  Users,
  Save
} from 'lucide-react';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';

export const RecordsVault = () => {
  const { state, user, addRecord, deleteRecord, fetchAllData } = useHealth();
  const familyMembers = state?.familyMembers || [];
  const records = state?.records || [];

  const [selectedMemberId, setSelectedMemberId] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Toast States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [fileObject, setFileObject] = useState(null);
  const [newRecordForm, setNewRecordForm] = useState({
    title: '',
    category: 'LAB_REPORT',
    memberId: '',
    recordDate: new Date().toISOString().split('T')[0],
    doctor: '',
    hospital: '',
    notes: ''
  });

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const categories = [
    'All',
    'LAB_REPORT',
    'PRESCRIPTION',
    'VACCINATION',
    'XRAY',
    'MRI',
    'CT_SCAN',
    'ULTRASOUND',
    'ECG',
    'DISCHARGE_SUMMARY',
    'INSURANCE',
    'OTHER'
  ];

  const getMemId = (m) => m?.userId || m?.id || m?.memberId;

  const openAddModal = (initialMemberId) => {
    const defaultMemId = initialMemberId && initialMemberId !== 'ALL' 
      ? initialMemberId 
      : (getMemId(familyMembers[0]) || user?.userId || user?.id || '');
    
    setFileObject(null);
    setErrorMsg(null);
    setNewRecordForm({
      title: '',
      category: 'LAB_REPORT',
      memberId: defaultMemId,
      recordDate: new Date().toISOString().split('T')[0],
      doctor: '',
      hospital: '',
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileObject(file);
      setNewRecordForm(prev => ({
        ...prev,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "")
      }));
    }
  };

  const handleAddRecordSubmit = async (e) => {
    e.preventDefault();
    if (!newRecordForm.title || !fileObject) {
      setErrorMsg("Please provide a record title and attach a document file.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const familyId = user?.familyId || localStorage.getItem("familyId") || "00000000-0000-0000-0000-000000000000";
      const memberId = newRecordForm.memberId || getMemId(familyMembers[0]) || user?.userId || user?.id || "00000000-0000-0000-0000-000000000000";

      const formData = new FormData();
      formData.append("familyId", familyId);
      formData.append("memberId", memberId);
      formData.append("title", newRecordForm.title);
      formData.append("doctor", newRecordForm.doctor || "General Doctor");
      formData.append("recordDate", newRecordForm.recordDate);
      formData.append("category", newRecordForm.category);
      formData.append("file", fileObject);

      await addRecord(formData);

      setIsAddModalOpen(false);
      setToastMsg(`Health Record "${newRecordForm.title}" uploaded successfully!`);
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err) {
      console.error("Upload record error:", err);
      const msg = err.response?.data?.message || err.response?.data || "Failed to upload health record.";
      setErrorMsg(typeof msg === 'string' ? msg : "Upload failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (recordId, rec) => {
    try {
      const responseData = await healthRecordApi.downloadRecord(recordId);
      const targetBlob = responseData instanceof Blob ? responseData : new Blob([responseData]);
      const url = window.URL.createObjectURL(targetBlob);
      const link = document.createElement('a');
      link.href = url;
      const downloadName = rec?.fileName || (rec?.title ? `${rec.title}.pdf` : `medical-record-${recordId}.pdf`);
      link.setAttribute('download', downloadName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error("Download record error:", err);
      alert("Failed to download record file.");
    }
  };

  const handlePreview = async (recordId, rec) => {
    try {
      const responseData = await healthRecordApi.downloadRecord(recordId);
      let mimeType = rec?.contentType || responseData.type;
      if (!mimeType || mimeType === 'application/octet-stream') {
        const name = (rec?.fileName || rec?.title || '').toLowerCase();
        if (name.endsWith('.png')) mimeType = 'image/png';
        else if (name.endsWith('.jpg') || name.endsWith('.jpeg')) mimeType = 'image/jpeg';
        else if (name.endsWith('.svg')) mimeType = 'image/svg+xml';
        else mimeType = 'application/pdf';
      }

      const targetBlob = responseData instanceof Blob
        ? (mimeType ? responseData.slice(0, responseData.size, mimeType) : responseData)
        : new Blob([responseData], { type: mimeType });

      const url = window.URL.createObjectURL(targetBlob);
      window.open(url, '_blank');
    } catch (err) {
      console.error("Preview record error:", err);
      alert("Failed to preview record file.");
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm("Are you sure you want to delete this health record?")) {
      try {
        await deleteRecord(recordId);
        setToastMsg("Health record deleted.");
        setTimeout(() => setToastMsg(null), 3000);
      } catch (err) {
        alert("Failed to delete health record.");
      }
    }
  };

  // Count records for member
  const countRecordsForMember = (memId) => {
    return records.filter(r => (r.memberId === memId || r.member === memId)).length;
  };

  // Filter records
  const filteredRecords = records.filter(rec => {
    const recMemberId = rec.memberId || rec.member;
    const matchesMember = selectedMemberId === 'ALL' || recMemberId === selectedMemberId;
    const recCat = rec.category || rec.type || '';
    const matchesCategory = selectedCategory === 'All' || recCat === selectedCategory;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      (rec.title && rec.title.toLowerCase().includes(query)) ||
      (rec.name && rec.name.toLowerCase().includes(query)) ||
      (rec.doctor && rec.doctor.toLowerCase().includes(query)) ||
      (rec.hospital && rec.hospital.toLowerCase().includes(query));

    return matchesMember && matchesCategory && matchesSearch;
  });

  const selectedMemberObject = familyMembers.find(m => getMemId(m) === selectedMemberId);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '2.5rem' }}>
      {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={28} color="#2563eb" /> Encrypted Health Records Vault
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
            Secure repository for lab tests, prescriptions, doctor notes, and medical documents
          </p>
        </div>

        <button
          onClick={() => openAddModal(selectedMemberId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
          }}
        >
          <Plus size={18} /> Upload Health Record
        </button>
      </div>

      {/* MEMBER SELECTION CARDS GRID */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="#2563eb" /> Select Family Member
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          {/* Card option: All Members Vault */}
          <div
            onClick={() => setSelectedMemberId('ALL')}
            style={{
              background: selectedMemberId === 'ALL' ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' : '#ffffff',
              border: selectedMemberId === 'ALL' ? '2.5px solid #2563eb' : '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                👨‍👩‍👧‍👦
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: '700' }}>All Records</h3>
                <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '600' }}>Complete Vault</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Documents:</span>
              <strong style={{ fontSize: '0.9rem', color: '#2563eb' }}>{records.length}</strong>
            </div>
          </div>

          {/* Cards for each registered Family Member */}
          {familyMembers.map(member => {
            const memId = getMemId(member) || user?.userId || user?.id;
            const isSelected = selectedMemberId === memId;
            const recCount = countRecordsForMember(memId);
            return (
              <div
                key={memId}
                onClick={() => setSelectedMemberId(memId)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' : '#ffffff',
                  border: isSelected ? '2.5px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    👤
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: '700' }}>{member.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{member.mobileNumber || member.phone || ''}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Records:</span>
                  <strong style={{ fontSize: '0.9rem', color: '#2563eb' }}>{recCount}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HEALTH RECORDS VAULT LIST */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#0f172a' }}>
              {selectedMemberId === 'ALL' ? 'All Family Health Records' : `${selectedMemberObject?.name || 'Member'}'s Medical Records`}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search title or doctor..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '1.5rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: selectedCategory === cat ? '2px solid #2563eb' : '1px solid #e2e8f0',
                background: selectedCategory === cat ? '#eff6ff' : '#f8fafc',
                color: selectedCategory === cat ? '#1d4ed8' : '#475569',
                fontWeight: '700',
                fontSize: '0.825rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* RECORDS GRID */}
        {filteredRecords.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.25rem' }}>
            {filteredRecords.map(rec => {
              const recId = rec.id || rec.recordId;
              const recTitle = rec.title || rec.name || 'Medical Document';
              const recDoctor = rec.doctor || 'Healthcare Provider';
              const recCat = rec.category || rec.type || 'DOCUMENT';
              const recDate = rec.recordDate || rec.date || '';

              return (
                <div
                  key={recId}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '12px' }}>
                        <FileText size={22} color="#2563eb" />
                      </div>
                      <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
                        {recCat}
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: '700' }}>{recTitle}</h3>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.825rem', color: '#64748b' }}>
                      Date: {recDate}
                    </p>

                    <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', marginBottom: '12px', fontSize: '0.8rem', color: '#334155' }}>
                      <div><span style={{ color: '#64748b' }}>Doctor/Clinic:</span> <strong>{recDoctor}</strong></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <button
                      onClick={() => handlePreview(recId, rec)}
                      style={{ flex: 1, padding: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '600' }}
                    >
                      <Eye size={14} /> Preview
                    </button>

                    <button
                      onClick={() => handleDownload(recId, rec)}
                      style={{ padding: '8px 12px', background: '#dbeafe', border: 'none', borderRadius: '8px', color: '#1e40af', cursor: 'pointer' }}
                      title="Download File"
                    >
                      <Download size={14} />
                    </button>

                    <button
                      onClick={() => handleDeleteRecord(recId)}
                      style={{ padding: '8px 12px', background: '#fef2f2', border: 'none', borderRadius: '8px', color: '#dc2626', cursor: 'pointer' }}
                      title="Delete Record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <FileText size={44} color="#94a3b8" style={{ marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 6px 0', color: '#334155', fontSize: '1.2rem' }}>
              No Medical Records Found
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>
              Upload lab reports, prescriptions, or doctor notes to store them securely.
            </p>
            <button
              onClick={() => openAddModal(selectedMemberId)}
              style={{ padding: '10px 20px', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Upload Health Record
            </button>
          </div>
        )}
      </div>

      {/* MODAL: UPLOAD HEALTH RECORD */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Upload Medical Record">
        <form onSubmit={handleAddRecordSubmit}>
          {errorMsg && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
              {errorMsg}
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Record Title *</label>
            <input
              type="text"
              value={newRecordForm.title}
              onChange={e => setNewRecordForm({ ...newRecordForm, title: e.target.value })}
              placeholder="e.g. Diabetes Blood Test Report"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Category</label>
              <select
                value={newRecordForm.category}
                onChange={e => setNewRecordForm({ ...newRecordForm, category: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              >
                <option value="LAB_REPORT">Lab Report</option>
                <option value="PRESCRIPTION">Prescription</option>
                <option value="VACCINATION">Vaccination</option>
                <option value="XRAY">X-Ray</option>
                <option value="MRI">MRI</option>
                <option value="CT_SCAN">CT Scan</option>
                <option value="ULTRASOUND">Ultrasound</option>
                <option value="ECG">ECG</option>
                <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
                <option value="INSURANCE">Insurance</option>
                <option value="OTHER">Other Document</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Family Member</label>
              <select
                value={newRecordForm.memberId}
                onChange={e => setNewRecordForm({ ...newRecordForm, memberId: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              >
                {familyMembers.map(m => {
                  const mId = getMemId(m) || user?.userId || user?.id;
                  return (
                    <option key={mId} value={mId}>{m.name}</option>
                  );
                })}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Record Date</label>
              <input
                type="date"
                value={newRecordForm.recordDate}
                onChange={e => setNewRecordForm({ ...newRecordForm, recordDate: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Doctor Name</label>
              <input
                type="text"
                value={newRecordForm.doctor}
                onChange={e => setNewRecordForm({ ...newRecordForm, doctor: e.target.value })}
                placeholder="e.g. Dr. Sharma"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* File Input */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Upload File (PDF/Image) *</label>
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '1.25rem', textAlign: 'center', background: '#f8fafc' }}>
              <input
                type="file"
                id="vault-file-upload"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".pdf,.png,.jpg,.jpeg"
                required
              />
              <label htmlFor="vault-file-upload" style={{ cursor: 'pointer' }}>
                <Upload size={28} color="#2563eb" style={{ marginBottom: '6px' }} />
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#0f172a', fontWeight: '600' }}>
                  {fileObject ? `Selected: ${fileObject.name}` : 'Click to select file'}
                </p>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              style={{ padding: '9px 18px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer', fontWeight: '600' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ padding: '9px 22px', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
            >
              {isSubmitting ? "Uploading..." : "Save Record"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecordsVault;