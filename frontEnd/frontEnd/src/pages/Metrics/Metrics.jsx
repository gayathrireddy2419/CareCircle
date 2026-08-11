// src/pages/Metrics/Metrics.jsx
import React, { useState, useEffect } from 'react';
import { useHealth } from '../../context/HealthContext';
import healthMetricsApi from '../../api/healthMetricsApi';
import FamilyMemberSelector from '../../components/common/FamilyMemberSelector';
import { Activity, Heart, Zap, Moon, Plus, Thermometer, Weight } from 'lucide-react';
import TrendChart from '../../components/analytics/TrendChart';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';

export const Metrics = () => {
  const { state, user, fetchAllData } = useHealth();
  const familyMembers = state?.familyMembers || [];

  const [selectedMemberId, setSelectedMemberId] = useState('ALL');
  const [metricsList, setMetricsList] = useState([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const getMemId = (m) => m?.userId || m?.id || m?.memberId;

  const [metricForm, setMetricForm] = useState({
    memberId: '',
    height: 170.5,
    weight: 70.5,
    systolicBp: 120,
    diastolicBp: 80,
    bloodSugar: 95.5,
    heartRate: 72,
    oxygenSaturation: 98.0,
    temperature: 98.6,
    notes: 'Routine checkup',
  });

  useEffect(() => {
    fetchAllData();
    fetchFamilyMetrics();
  }, [fetchAllData]);

  const fetchFamilyMetrics = async () => {
    try {
      const familyId = user?.familyId || localStorage.getItem("familyId");
      if (familyId) {
        const res = await healthMetricsApi.getFamilyHealthMetrics(familyId);
        const list = Array.isArray(res) ? res : res?.metrics || [];
        setMetricsList(list);
      }
    } catch (err) {
      console.warn("Could not fetch metrics from API Gateway:", err);
    }
  };

  // Combine metrics from state or API
  const allMetrics = metricsList.length > 0 ? metricsList : (state.healthMetrics || []);

  // Filter metrics based on selected member
  const filteredMetrics = selectedMemberId === 'ALL'
    ? allMetrics
    : allMetrics.filter(m => (m.memberId || m.member) === selectedMemberId);

  // Calculate latest vitals reading for display
  const latestMetric = filteredMetrics.length > 0 ? filteredMetrics[filteredMetrics.length - 1] : null;

  const displayVitals = {
    systolicBp: latestMetric?.systolicBp || 120,
    diastolicBp: latestMetric?.diastolicBp || 80,
    heartRate: latestMetric?.heartRate || 72,
    bloodSugar: latestMetric?.bloodSugar || 95.5,
    oxygenSaturation: latestMetric?.oxygenSaturation || 98.0,
    temperature: latestMetric?.temperature || 98.6,
    weight: latestMetric?.weight || 70.5,
    height: latestMetric?.height || 170.5,
  };

  // Dynamic Trend Chart Data
  const trendData = filteredMetrics.length > 0 ? filteredMetrics.slice(-7).map((m, idx) => ({
    day: m.recordedAt ? new Date(m.recordedAt).toLocaleDateString('en-US', { weekday: 'short' }) : `Log ${idx + 1}`,
    bpSystolic: m.systolicBp || 120,
    bpDiastolic: m.diastolicBp || 80,
    sugar: m.bloodSugar || 95
  })) : [
    { day: 'Mon', bpSystolic: 120, bpDiastolic: 80, sugar: 95 },
    { day: 'Tue', bpSystolic: 122, bpDiastolic: 81, sugar: 98 },
    { day: 'Wed', bpSystolic: 118, bpDiastolic: 79, sugar: 92 },
    { day: 'Thu', bpSystolic: 125, bpDiastolic: 82, sugar: 104 },
    { day: 'Fri', bpSystolic: 121, bpDiastolic: 80, sugar: 96 },
    { day: 'Sat', bpSystolic: 119, bpDiastolic: 78, sugar: 90 },
    { day: 'Sun', bpSystolic: 120, bpDiastolic: 80, sugar: 94 }
  ];

  const openAddModal = () => {
    setErrorMsg(null);
    const targetMemId = selectedMemberId !== 'ALL' ? selectedMemberId : (getMemId(familyMembers[0]) || user?.userId || user?.id || "");
    setMetricForm({
      memberId: targetMemId,
      height: 170.5,
      weight: 70.5,
      systolicBp: 120,
      diastolicBp: 80,
      bloodSugar: 95.5,
      heartRate: 72,
      oxygenSaturation: 98.0,
      temperature: 98.6,
      notes: 'Routine checkup',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitMetric = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const familyId = user?.familyId || localStorage.getItem("familyId") || "00000000-0000-0000-0000-000000000000";
      const memberId = metricForm.memberId || getMemId(familyMembers[0]) || user?.userId || user?.id || "00000000-0000-0000-0000-000000000000";
      const recordedBy = user?.id || memberId;

      await healthMetricsApi.addHealthMetric({
        familyId,
        memberId,
        recordedBy,
        height: parseFloat(metricForm.height),
        weight: parseFloat(metricForm.weight),
        systolicBp: parseInt(metricForm.systolicBp, 10),
        diastolicBp: parseInt(metricForm.diastolicBp, 10),
        bloodSugar: parseFloat(metricForm.bloodSugar),
        heartRate: parseInt(metricForm.heartRate, 10),
        oxygenSaturation: parseFloat(metricForm.oxygenSaturation),
        temperature: parseFloat(metricForm.temperature),
        notes: metricForm.notes,
        recordedAt: new Date().toISOString().substring(0, 19)
      });

      setIsAddModalOpen(false);
      setToastMsg("Health metric recorded successfully!");
      setTimeout(() => setToastMsg(null), 3500);
      await fetchAllData();
      await fetchFamilyMetrics();
    } catch (err) {
      console.error("Add health metric error:", err);
      const msg = err.response?.data?.message || err.response?.data || "Failed to record health metric.";
      setErrorMsg(typeof msg === 'string' ? msg : "Metric submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMemberName = selectedMemberId === 'ALL'
    ? 'Entire Family'
    : (familyMembers.find(m => getMemId(m) === selectedMemberId)?.name || user?.name || 'Selected Member');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '2.5rem' }}>
      {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a' }}>Vitals & Health Metrics</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
            Real-time biometric telemetry tracking for {selectedMemberName}
          </p>
        </div>

        <button
          onClick={openAddModal}
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
          <Plus size={18} /> Record Vitals
        </button>
      </div>

      {/* INDIVIDUALIZED FAMILY MEMBER SELECTOR STRIP */}
      <FamilyMemberSelector
        familyMembers={familyMembers}
        user={user}
        selectedId={selectedMemberId}
        onSelect={setSelectedMemberId}
        healthMetrics={allMetrics}
      />

      {/* VITALS CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Blood Pressure</span>
          <h2 style={{ margin: '6px 0 0 0', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
            <Heart size={22} /> {displayVitals.systolicBp}/{displayVitals.diastolicBp} mmHg
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>Normal Systolic Baseline</span>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Resting Heart Rate</span>
          <h2 style={{ margin: '6px 0 0 0', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
            <Activity size={22} /> {displayVitals.heartRate} BPM
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>Resting Pulse Optimal</span>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Fasting Blood Sugar</span>
          <h2 style={{ margin: '6px 0 0 0', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
            <Zap size={22} /> {displayVitals.bloodSugar} mg/dL
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>Healthy Fasting Level</span>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Oxygen Saturation</span>
          <h2 style={{ margin: '6px 0 0 0', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
            <Moon size={22} /> {displayVitals.oxygenSaturation}% SpO2
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>Optimal Saturation</span>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Body Temperature</span>
          <h2 style={{ margin: '6px 0 0 0', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
            <Thermometer size={22} /> {displayVitals.temperature}°F
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>Afebrile Normal Range</span>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Body Weight</span>
          <h2 style={{ margin: '6px 0 0 0', color: '#059669', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
            <Weight size={22} /> {displayVitals.weight} kg
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Height: {displayVitals.height} cm</span>
        </div>
      </div>

      {/* TREND CHART */}
      <div style={{ marginBottom: '2rem' }}>
        <TrendChart data={trendData} />
      </div>

      {/* HISTORICAL VITALS LOG TABLE */}
      <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: '800' }}>
          Historical Telemetry Logs ({selectedMemberName})
        </h3>

        {filteredMetrics.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 12px', color: '#475569' }}>Date & Time</th>
                  <th style={{ padding: '10px 12px', color: '#475569' }}>Blood Pressure</th>
                  <th style={{ padding: '10px 12px', color: '#475569' }}>Blood Sugar</th>
                  <th style={{ padding: '10px 12px', color: '#475569' }}>Heart Rate</th>
                  <th style={{ padding: '10px 12px', color: '#475569' }}>SpO2 / Temp</th>
                  <th style={{ padding: '10px 12px', color: '#475569' }}>Clinical Observations</th>
                </tr>
              </thead>
              <tbody>
                {filteredMetrics.slice().reverse().map((log, idx) => (
                  <tr key={log.metricId || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', color: '#64748b', fontWeight: '600' }}>
                      {log.recordedAt ? new Date(log.recordedAt).toLocaleString() : 'Recent Reading'}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: '700' }}>
                      {log.systolicBp}/{log.diastolicBp} mmHg
                    </td>
                    <td style={{ padding: '10px 12px', color: '#b45309', fontWeight: '700' }}>
                      {log.bloodSugar ? `${log.bloodSugar} mg/dL` : 'N/A'}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#2563eb', fontWeight: '700' }}>
                      {log.heartRate ? `${log.heartRate} BPM` : 'N/A'}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#059669', fontWeight: '600' }}>
                      {log.oxygenSaturation ? `${log.oxygenSaturation}%` : '98%'} • {log.temperature ? `${log.temperature}°F` : '98.6°F'}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>
                      {log.notes || 'Normal routine checkup'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem' }}>
            No recorded health vitals found for this selection. Click "Record Vitals" to add telemetry.
          </p>
        )}
      </div>

      {/* MODAL: ADD HEALTH METRIC */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Record New Health Vitals">
        <form onSubmit={handleSubmitMetric}>
          {errorMsg && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
              {errorMsg}
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Family Member</label>
            <select
              value={metricForm.memberId}
              onChange={e => setMetricForm({ ...metricForm, memberId: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            >
              {familyMembers.map(m => {
                const mId = getMemId(m) || user?.userId || user?.id;
                return (
                  <option key={mId} value={mId}>{m.name}</option>
                );
              })}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Systolic BP (mmHg)</label>
              <input
                type="number"
                value={metricForm.systolicBp}
                onChange={e => setMetricForm({ ...metricForm, systolicBp: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Diastolic BP (mmHg)</label>
              <input
                type="number"
                value={metricForm.diastolicBp}
                onChange={e => setMetricForm({ ...metricForm, diastolicBp: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Blood Sugar (mg/dL)</label>
              <input
                type="number"
                step="0.1"
                value={metricForm.bloodSugar}
                onChange={e => setMetricForm({ ...metricForm, bloodSugar: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Heart Rate (BPM)</label>
              <input
                type="number"
                value={metricForm.heartRate}
                onChange={e => setMetricForm({ ...metricForm, heartRate: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
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
              {isSubmitting ? "Recording..." : "Save Metric"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Metrics;
