// src/pages/Medicine/MedicineConsumption.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealth } from '../../context/HealthContext';
import { ArrowLeft, CheckCircle2, Clock, Pill } from 'lucide-react';

export const MedicineConsumption = () => {
  const navigate = useNavigate();
  const { state, recordIntake } = useHealth();

  const handleMarkTaken = async (medId) => {
    try {
      await recordIntake(medId);
    } catch (err) {
      console.error("Error marking dose taken:", err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/app/medicine')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'transparent', color: '#2563eb', fontWeight: '600', cursor: 'pointer', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={18} /> Back to Medicines
      </button>

      <div style={{ background: '#fff', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <h2 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a' }}>
          <Clock size={24} color="#2563eb" /> Daily Medicine Intake Tracker
        </h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Click "Mark as Taken" to record medication intake and adjust inventory stock.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {state.medicines && state.medicines.length > 0 ? (
            state.medicines.map((med) => {
              const medId = med.inventoryId || med.id;
              const medName = med.medicineName || med.name || 'Medicine';
              const medDosage = med.strength || med.dosage || 'Standard';
              const medStock = med.quantityAvailable ?? med.stock ?? 0;
              const medPatient = med.member || 'Family Member';
              const medFreq = med.frequency || 'Daily';

              return (
                <div
                  key={medId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    background: '#f8fafc',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Pill size={20} color="#10b981" />
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>{medName}</h3>
                      <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600' }}>
                        {medDosage}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                      Patient: <strong>{medPatient}</strong> | Frequency: {medFreq} | Stock: <strong style={{ color: medStock < 5 ? '#ef4444' : '#10b981' }}>{medStock} available</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleMarkTaken(medId)}
                    disabled={medStock <= 0}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: medStock <= 0 ? '#cbd5e1' : '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      fontWeight: '600',
                      cursor: medStock <= 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <CheckCircle2 size={16} /> {medStock <= 0 ? 'Out of Stock' : 'Mark Taken'}
                  </button>
                </div>
              );
            })
          ) : (
            <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>No medicines found in inventory.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineConsumption;
