// src/pages/Medicine/AddMedicine.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealth } from '../../context/HealthContext';
import medicineInventoryApi from '../../api/medicineInventoryApi';
import { ArrowLeft, Pill, Save } from 'lucide-react';

export const AddMedicine = () => {
  const navigate = useNavigate();
  const { state, user, fetchAllData } = useHealth();

  const [form, setForm] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    stock: 20,
    member: state.familyMembers[0]?.name || 'General Family',
    compliance: 100
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.dosage) return;

    try {
      const familyId = user?.familyId || localStorage.getItem("familyId") || "00000000-0000-0000-0000-000000000000";
      const scopeStorage = form.member === 'General Family'
        ? 'Common / Shared'
        : `Member:${form.member}`;

      await medicineInventoryApi.addMedicine(familyId, {
        medicineName: form.name,
        genericName: form.name,
        strength: form.dosage,
        dosageForm: 'Tablet',
        manufacturer: 'Pharma',
        batchNumber: 'B101',
        quantityAvailable: form.stock || 20,
        reorderLevel: 5,
        expiryDate: '2027-12-31',
        storageLocation: scopeStorage
      });

      if (fetchAllData) await fetchAllData();
      navigate('/app/medicine');
    } catch (err) {
      console.error("Error adding medicine:", err);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/app/medicine')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'transparent', color: '#2563eb', fontWeight: '600', cursor: 'pointer', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={18} /> Back to Medicines
      </button>

      <div style={{ background: '#fff', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <h2 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a' }}>
          <Pill size={24} color="#10b981" /> Add New Medicine
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Medicine Name</label>
            <input
              type="text"
              placeholder="e.g. Paracetamol, Lisinopril"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Dosage</label>
            <input
              type="text"
              placeholder="e.g. 500mg, 10ml, 2 puffs"
              value={form.dosage}
              onChange={e => setForm({ ...form, dosage: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Frequency</label>
              <select
                value={form.frequency}
                onChange={e => setForm({ ...form, frequency: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', boxSizing: 'border-box' }}
              >
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>Thrice daily</option>
                <option>As needed</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Initial Stock (Pills/Units)</label>
              <input
                type="number"
                value={form.stock}
                onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Assigned Family Member</label>
            <select
              value={form.member}
              onChange={e => setForm({ ...form, member: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', boxSizing: 'border-box' }}
            >
              <option value="General Family">🏠 General Family (Shared Supply)</option>
              {state.familyMembers.map(m => (
                <option key={m.id} value={m.name}>{m.name} ({m.relationship})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyRight: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={() => navigate('/app/medicine')}
              style={{ padding: '10px 18px', background: '#f1f5f9', border: 'none', borderRadius: '10px', color: '#475569', cursor: 'pointer', fontWeight: '600' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{ padding: '10px 24px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={16} /> Save Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
