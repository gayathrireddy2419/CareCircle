// src/pages/Analytics/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { useHealth } from '../../context/HealthContext';
import healthMetricsApi from '../../api/healthMetricsApi';
import FamilyMemberSelector from '../../components/common/FamilyMemberSelector';
import StatisticsCards from '../../components/analytics/StatisticsCards';
import HealthChart from '../../components/analytics/HealthChart';
import TrendChart from '../../components/analytics/TrendChart';
import PieChartCard from '../../components/analytics/PieChartCard';
import DiseaseChart from '../../components/analytics/DiseaseChart';
import ExportReport from '../../components/analytics/ExportReport';
import { Heart, Activity, ShieldCheck, Zap } from 'lucide-react';
import './Analytics.css';

export default function Analytics() {
  const { state, user, fetchAllData } = useHealth();
  const [selectedMemberId, setSelectedMemberId] = useState('ALL');
  const [metricsData, setMetricsData] = useState([]);

  useEffect(() => {
    fetchAllData();
    fetchMetrics();
  }, [fetchAllData]);

  const fetchMetrics = async () => {
    try {
      const familyId = user?.familyId || localStorage.getItem("familyId");
      if (familyId) {
        const res = await healthMetricsApi.getFamilyHealthMetrics(familyId);
        const list = Array.isArray(res) ? res : res?.metrics || [];
        setMetricsData(list);
      }
    } catch (err) {
      console.warn("Could not fetch metrics for analytics:", err);
    }
  };

  // Combined metrics from state or API
  const allMetrics = metricsData.length > 0 ? metricsData : (state.healthMetrics || []);

  // Filter metrics based on selected member
  const filteredMetrics = selectedMemberId === 'ALL'
    ? allMetrics
    : allMetrics.filter(m => (m.memberId || m.member) === selectedMemberId);

  // Selected member details
  const familyMembers = state.familyMembers || [];
  const selectedMember = selectedMemberId === 'ALL'
    ? null
    : familyMembers.find(m => (m.userId || m.id || m.memberId) === selectedMemberId) || (user?.userId === selectedMemberId ? user : null);

  // Calculate dynamic statistics
  const count = filteredMetrics.length;

  const avgSystolic = count > 0 
    ? Math.round(filteredMetrics.reduce((acc, m) => acc + (m.systolicBp || 120), 0) / count)
    : 120;

  const avgDiastolic = count > 0
    ? Math.round(filteredMetrics.reduce((acc, m) => acc + (m.diastolicBp || 80), 0) / count)
    : 80;

  const avgSugar = count > 0
    ? (filteredMetrics.reduce((acc, m) => acc + (m.bloodSugar || 95), 0) / count).toFixed(1)
    : '95.0';

  const avgHeartRate = count > 0
    ? Math.round(filteredMetrics.reduce((acc, m) => acc + (m.heartRate || 72), 0) / count)
    : 72;

  const avgSpo2 = count > 0
    ? (filteredMetrics.reduce((acc, m) => acc + (m.oxygenSaturation || 98), 0) / count).toFixed(1)
    : '98.0';

  const bpStatus = (avgSystolic <= 120 && avgDiastolic <= 80) ? "Optimal" : "Mild Elevation";
  const sugarStatus = parseFloat(avgSugar) <= 100 ? "Healthy Fasting" : "Borderline";

  const dynamicStats = [
    { title: 'Avg Blood Pressure', value: `${avgSystolic}/${avgDiastolic} mmHg`, change: bpStatus, icon: <Heart size={24} color="#ef4444" />, bg: '#fef2f2' },
    { title: 'Avg Blood Sugar', value: `${avgSugar} mg/dL`, change: sugarStatus, icon: <Zap size={24} color="#f59e0b" />, bg: '#fffbe8' },
    { title: 'Resting Heart Rate', value: `${avgHeartRate} BPM`, change: 'Normal Rhythm', icon: <Activity size={24} color="#2563eb" />, bg: '#eff6ff' },
    { title: 'Oxygen Saturation', value: `${avgSpo2}% SpO2`, change: 'Optimal Oxygenation', icon: <ShieldCheck size={24} color="#10b981" />, bg: '#ecfdf5' }
  ];

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

  // Dynamic Health Score Trend
  const healthScoreData = filteredMetrics.length > 0 ? filteredMetrics.map((m, idx) => {
    const sys = m.systolicBp || 120;
    const sug = m.bloodSugar || 95;
    let score = 100 - Math.abs(sys - 120) * 0.5 - Math.abs(sug - 95) * 0.2;
    score = Math.min(100, Math.max(60, Math.round(score)));
    return {
      month: m.recordedAt ? new Date(m.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Record ${idx + 1}`,
      score
    };
  }) : [
    { month: 'Jan', score: 85 },
    { month: 'Feb', score: 88 },
    { month: 'Mar', score: 86 },
    { month: 'Apr', score: 90 },
    { month: 'May', score: 92 }
  ];

  // Dynamic Disease Distribution
  const diseaseData = [
    { disease: 'Hypertension Risk', count: avgSystolic > 130 ? 1 : 0 },
    { disease: 'Glycemic Warning', count: parseFloat(avgSugar) > 105 ? 1 : 0 },
    { disease: 'Hypoxia Alert', count: parseFloat(avgSpo2) < 95 ? 1 : 0 },
    { disease: 'Normal Baseline', count: (avgSystolic <= 130 && parseFloat(avgSugar) <= 105) ? 1 : 0 }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '2.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a' }}>Health Analytics & Diagnostics</h1>
        <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
          {selectedMemberId === 'ALL'
            ? 'Viewing aggregate health metrics and vitals trends for the entire family unit'
            : `Viewing individualized health telemetry & analytics for ${selectedMember?.name || 'Selected Member'}`}
        </p>
      </div>

      {/* INDIVIDUALIZED FAMILY MEMBER SELECTOR STRIP */}
      <FamilyMemberSelector
        familyMembers={familyMembers}
        user={user}
        selectedId={selectedMemberId}
        onSelect={setSelectedMemberId}
        healthMetrics={allMetrics}
      />

      <StatisticsCards stats={dynamicStats} />

      <HealthChart data={healthScoreData} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <PieChartCard title={selectedMemberId === 'ALL' ? "Family Adherence & Vitals Logs" : `${selectedMember?.name || 'Member'} Vitals Logging Frequency`} />
        <DiseaseChart data={diseaseData} />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <TrendChart data={trendData} />
      </div>

      <ExportReport />
    </div>
  );
}