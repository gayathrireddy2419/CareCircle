// src/pages/Medicine/MedicineManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealth } from '../../context/HealthContext';
import medicineInventoryApi from '../../api/medicineInventoryApi';
import medicineIntakeApi from '../../api/medicineIntakeApi';
import medicationApi from '../../api/medicationApi';
import stockTransactionApi from '../../api/stockTransactionApi';
import {
  Pill,
  Plus,
  Clock,
  CheckCircle,
  Trash2,
  Edit2,
  Users,
  Search,
  Calendar,
  User,
  Activity,
  Check,
  X,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';

export const MedicineManager = () => {
  const navigate = useNavigate();
  const { state, user, fetchAllData, deleteMedicine } = useHealth();

  const familyMembers = state?.familyMembers || [];
  const medicines = state?.medicines || [];

  // Navigation & Selection States
  const [selectedMemberId, setSelectedMemberId] = useState('ALL');
  const [activeTab, setActiveTab] = useState('schedules'); // 'schedules' | 'intakes' | 'transactions'
  const [searchTerm, setSearchTerm] = useState('');

  // Member-Specific Data States
  const [memberSchedules, setMemberSchedules] = useState([]);
  const [memberIntakes, setMemberIntakes] = useState([]);
  const [memberTransactions, setMemberTransactions] = useState([]);
  const [loadingMemberData, setLoadingMemberData] = useState(false);

  // Modal & Toast States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editInventoryId, setEditInventoryId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const getMemId = (m) => m?.userId || m?.id || m?.memberId;

  // Edit Medicine Form State
  const [editMedForm, setEditMedForm] = useState({
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

  // Add Inventory Medicine Form
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
    assignedTo: 'COMMON' // 'COMMON' or memberId
  });

  // Direct Member Medicine Entry Form
  const [scheduleForm, setScheduleForm] = useState({
    medicineName: '',
    dosage: '500mg',
    frequency: 'DAILY',
    beforeFood: false,
    quantityAvailable: 30,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2027-12-31',
    expiryDate: '2027-12-31',
    instructions: 'Take with warm water after breakfast',
  });

  const fetchMemberMedicineData = useCallback(async (memId) => {
    setLoadingMemberData(true);
    try {
      // 1. Fetch Member Medication Schedules
      try {
        const schedulesRes = await medicationApi.getMemberSchedules(memId);
        const scheds = Array.isArray(schedulesRes) ? schedulesRes : schedulesRes?.data || [];
        setMemberSchedules(scheds);
      } catch (err) {
        console.warn("Could not fetch member schedules:", err);
        setMemberSchedules([]);
      }

      // 2. Fetch Member Intake History
      try {
        const intakesRes = await medicineIntakeApi.getMemberIntakeHistory(memId);
        const intakes = Array.isArray(intakesRes) ? intakesRes : intakesRes?.data || [];
        setMemberIntakes(intakes);
      } catch (err) {
        console.warn("Could not fetch member intake history:", err);
        setMemberIntakes([]);
      }

      // 3. Fetch Member Stock Transactions
      try {
        const txRes = await stockTransactionApi.getMemberTransactions(memId);
        const txs = Array.isArray(txRes) ? txRes : txRes?.data || [];
        setMemberTransactions(txs);
      } catch (err) {
        console.warn("Could not fetch member stock transactions:", err);
        setMemberTransactions([]);
      }
    } finally {
      setLoadingMemberData(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (selectedMemberId && selectedMemberId !== 'ALL') {
      fetchMemberMedicineData(selectedMemberId);
    }
  }, [selectedMemberId, fetchMemberMedicineData]);

  // Scope Parser Helper
  const getScopeInfo = (med) => {
    const loc = med.storageLocation || '';
    if (loc.startsWith('Member:')) {
      const targetId = loc.replace('Member:', '').trim();
      const member = familyMembers.find(m => getMemId(m) === targetId || m.name === targetId);
      return {
        isShared: false,
        ownerName: member ? member.name : 'Individual Member',
        memberId: targetId
      };
    }
    return {
      isShared: true,
      ownerName: 'Common / Shared',
      memberId: null
    };
  };

  const openAddModal = () => {
    setErrorMsg(null);
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
      assignedTo: selectedMemberId !== 'ALL' ? selectedMemberId : 'COMMON'
    });
    setIsAddModalOpen(true);
  };

  const openEditMedicineModal = (med) => {
    if (!med) return;
    setErrorMsg(null);
    const invId = med.inventoryId || med.id;
    setEditInventoryId(invId);
    const scope = getScopeInfo(med);

    setEditMedForm({
      medicineName: med.medicineName || med.name || '',
      genericName: med.genericName || med.medicineName || med.name || '',
      strength: med.strength || med.dosage || '500mg',
      dosageForm: med.dosageForm || 'Tablet',
      manufacturer: med.manufacturer || 'Pharma',
      batchNumber: med.batchNumber || 'B101',
      quantityAvailable: med.quantityAvailable ?? med.stock ?? 30,
      reorderLevel: med.reorderLevel ?? 5,
      expiryDate: med.expiryDate || '2027-12-31',
      storageLocation: med.storageLocation || (scope.isShared ? 'Common / Shared' : `Member:${scope.memberId}`),
      assignedTo: scope.isShared ? 'COMMON' : (scope.memberId || 'COMMON')
    });
    setIsEditModalOpen(true);
  };

  const handleEditMedicineSubmit = async (e) => {
    e.preventDefault();
    if (!editMedForm.medicineName || !editInventoryId) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const scopeStorage = editMedForm.assignedTo === 'COMMON'
        ? 'Common / Shared'
        : `Member:${editMedForm.assignedTo}`;

      await medicineInventoryApi.updateMedicine(editInventoryId, {
        medicineName: editMedForm.medicineName,
        genericName: editMedForm.genericName || editMedForm.medicineName,
        strength: editMedForm.strength,
        dosageForm: editMedForm.dosageForm,
        manufacturer: editMedForm.manufacturer,
        batchNumber: editMedForm.batchNumber,
        quantityAvailable: parseInt(editMedForm.quantityAvailable, 10) || 0,
        reorderLevel: parseInt(editMedForm.reorderLevel, 10) || 5,
        expiryDate: editMedForm.expiryDate,
        storageLocation: scopeStorage,
      });

      setIsEditModalOpen(false);
      setToastMsg(`Medicine "${editMedForm.medicineName}" updated successfully!`);
      setTimeout(() => setToastMsg(null), 3500);
      if (selectedMemberId !== 'ALL') {
        fetchMemberMedicineData(selectedMemberId);
      }
      await fetchAllData();
    } catch (err) {
      console.error("Edit medicine error:", err);
      const msg = err.response?.data?.message || err.response?.data || "Failed to update medicine.";
      setErrorMsg(typeof msg === 'string' ? msg : "Update medicine failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openScheduleModal = () => {
    setErrorMsg(null);
    setScheduleForm({
      medicineName: '',
      dosage: '500mg',
      frequency: 'DAILY',
      beforeFood: false,
      quantityAvailable: 30,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2027-12-31',
      expiryDate: '2027-12-31',
      instructions: 'Take with warm water after breakfast',
    });
    setIsScheduleModalOpen(true);
  };

  const handleAddMedicineSubmit = async (e) => {
    e.preventDefault();
    if (!newMedForm.medicineName) return;

    setIsSubmitting(true);
    setErrorMsg(null);

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

      setIsAddModalOpen(false);
      setToastMsg(`Medicine "${newMedForm.medicineName}" added successfully!`);
      setTimeout(() => setToastMsg(null), 3500);
      await fetchAllData();
    } catch (err) {
      console.error("Add medicine error:", err);
      const msg = err.response?.data?.message || err.response?.data || "Failed to add medicine.";
      setErrorMsg(typeof msg === 'string' ? msg : "Add medicine failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.medicineName || selectedMemberId === 'ALL') {
      setErrorMsg("Please enter a medicine name.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const familyId = user?.familyId || localStorage.getItem("familyId") || "00000000-0000-0000-0000-000000000000";
      const inputName = scheduleForm.medicineName.trim();

      // Step 1: Check if medicine already exists or register it automatically under member scope
      let targetInventoryId = null;

      const existingMed = medicines.find(m => 
        (m.medicineName || m.name || '').toLowerCase() === inputName.toLowerCase()
      );

      if (existingMed) {
        targetInventoryId = existingMed.inventoryId || existingMed.id;
      } else {
        const scopeStorage = `Member:${selectedMemberId}`;
        const newInvRes = await medicineInventoryApi.addMedicine(familyId, {
          medicineName: inputName,
          genericName: inputName,
          strength: scheduleForm.dosage || 'Standard',
          dosageForm: 'Tablet',
          manufacturer: 'Pharma',
          batchNumber: 'B101',
          quantityAvailable: parseInt(scheduleForm.quantityAvailable, 10) || 30,
          reorderLevel: 5,
          expiryDate: scheduleForm.expiryDate || scheduleForm.endDate || '2027-12-31',
          storageLocation: scopeStorage
        });

        const newInv = newInvRes?.data || newInvRes;
        targetInventoryId = newInv?.inventoryId || newInv?.id;
      }

      if (!targetInventoryId) {
        throw new Error("Could not register medicine in inventory.");
      }

      // Step 2: Create Medication Schedule
      await medicationApi.createSchedule(familyId, {
        memberId: selectedMemberId,
        inventoryId: targetInventoryId,
        dosage: scheduleForm.dosage,
        frequency: scheduleForm.frequency,
        beforeFood: scheduleForm.beforeFood,
        familyId: familyId,
        startDate: scheduleForm.startDate,
        endDate: scheduleForm.expiryDate || scheduleForm.endDate || '2027-12-31',
        instructions: scheduleForm.instructions,
        status: 'ACTIVE'
      });

      setIsScheduleModalOpen(false);
      setToastMsg(`Medicine "${inputName}" added for ${selectedMemberObject?.name || 'member'}!`);
      setTimeout(() => setToastMsg(null), 3500);
      await fetchAllData();
      fetchMemberMedicineData(selectedMemberId);
    } catch (err) {
      console.error("Create schedule error:", err);
      const msg = err.response?.data?.message || err.response?.data || "Failed to add medication.";
      setErrorMsg(typeof msg === 'string' ? msg : "Medication creation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (inventoryId) => {
    if (window.confirm("Are you sure you want to delete this medicine from inventory and database?")) {
      try {
        await deleteMedicine(inventoryId);
        setToastMsg("Medicine deleted from database.");
        setTimeout(() => setToastMsg(null), 3000);
        await fetchAllData();
      } catch (err) {
        console.error("Delete medicine error:", err);
        setErrorMsg("Failed to delete medicine from database.");
      }
    }
  };

  const handleDeletePersonalMedicine = async (scheduleId, inventoryId) => {
    if (window.confirm("Are you sure you want to delete this personal medicine from database?")) {
      try {
        if (scheduleId) {
          await medicationApi.deleteSchedule(scheduleId);
        }
        if (inventoryId) {
          await medicineInventoryApi.deleteMedicine(inventoryId);
        }
        setToastMsg("Personal medicine deleted from database.");
        setTimeout(() => setToastMsg(null), 3000);
        if (selectedMemberId !== 'ALL') {
          fetchMemberMedicineData(selectedMemberId);
        }
        await fetchAllData();
      } catch (err) {
        console.error("Error deleting personal medicine:", err);
        setErrorMsg("Failed to delete medicine from database. Please try again.");
      }
    }
  };

  const getExpiryStatus = (expiryDateStr) => {
    if (!expiryDateStr) return null;
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (expiry < today) {
      return { isExpired: true, isExpiringSoon: false, text: `EXPIRED (${expiryDateStr})` };
    }
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 30) {
      return { isExpired: false, isExpiringSoon: true, text: `Expires in ${daysLeft}d (${expiryDateStr})` };
    }
    return { isExpired: false, isExpiringSoon: false, text: `Exp: ${expiryDateStr}` };
  };

  const handleLogCommonMedicineIntake = async (inventoryId) => {
    const targetInv = medicines.find(m => (m.inventoryId || m.id) === inventoryId);
    if (!targetInv) return;

    const currentQty = targetInv.quantityAvailable ?? targetInv.stock ?? 0;
    if (currentQty <= 0) {
      alert("⚠️ Cannot log dose: Medicine is OUT OF STOCK. Please refill inventory first!");
      return;
    }

    try {
      const newQty = Math.max(0, currentQty - 1);
      const rawExp = targetInv.expiryDate;
      const cleanExp = rawExp ? String(rawExp).split("T")[0] : "2027-12-31";
      const scopeStorage = targetInv.storageLocation || (getScopeInfo(targetInv).isShared ? 'Common / Shared' : `Member:${getScopeInfo(targetInv).memberId}`);

      await medicineInventoryApi.updateMedicine(inventoryId, {
        medicineName: targetInv.medicineName || targetInv.name,
        genericName: targetInv.genericName || targetInv.medicineName || targetInv.name,
        strength: targetInv.strength || '500mg',
        dosageForm: targetInv.dosageForm || 'Tablet',
        manufacturer: targetInv.manufacturer || 'Pharma',
        batchNumber: targetInv.batchNumber || 'B101',
        quantityAvailable: newQty,
        reorderLevel: targetInv.reorderLevel ?? 5,
        expiryDate: cleanExp,
        storageLocation: scopeStorage
      });

      targetInv.quantityAvailable = newQty;
      setToastMsg(`Dose logged as TAKEN! Common inventory stock reduced by 1.`);
      setTimeout(() => setToastMsg(null), 3500);

      await fetchAllData();
    } catch (err) {
      console.error("Common medicine stock update error:", err);
      setErrorMsg("Failed to reduce stock for common medicine.");
    }
  };

  const handleLogMemberIntake = async (scheduleOrInvId, status = 'TAKEN') => {
    // Resolve target inventory item whether scheduleOrInvId is inventoryId or scheduleId
    let targetInv = medicines.find(m => (m.inventoryId || m.id) === scheduleOrInvId);
    let targetInventoryId = targetInv?.inventoryId || targetInv?.id;
    let targetScheduleId = scheduleOrInvId;

    if (!targetInv && memberSchedules.length > 0) {
      const sched = memberSchedules.find(s => (s.scheduleId || s.id) === scheduleOrInvId);
      if (sched) {
        targetInventoryId = sched.inventoryId;
        targetInv = medicines.find(m => (m.inventoryId || m.id) === sched.inventoryId);
      }
    }

    const currentQty = targetInv?.quantityAvailable ?? targetInv?.stock ?? 1;

    if (status === 'TAKEN' && currentQty <= 0) {
      alert("⚠️ Cannot log dose: Medicine is OUT OF STOCK. Please refill inventory first!");
      return;
    }

    try {
      const familyId = user?.familyId || localStorage.getItem("familyId") || "00000000-0000-0000-0000-000000000000";
      const memId = selectedMemberId !== 'ALL' ? selectedMemberId : (getMemId(familyMembers[0]) || user?.userId || user?.id || "00000000-0000-0000-0000-000000000000");
      const nowStr = new Date().toISOString();

      // 1. Record Intake History & Stock Transaction
      await medicineIntakeApi.recordIntake(familyId, {
        scheduleId: targetScheduleId || targetInventoryId || "00000000-0000-0000-0000-000000000000",
        reminderId: "00000000-0000-0000-0000-000000000000",
        memberId: memId,
        intakeDate: nowStr.split("T")[0],
        reminderTime: "08:30:00",
        takenTime: nowStr.substring(0, 19),
        status: status,
        remarks: `Logged as ${status} via UI`
      });

      // 2. Ensure Inventory database record quantity is reduced by 1 for TAKEN status
      if (status === 'TAKEN' && targetInventoryId && targetInv) {
        const newQty = Math.max(0, currentQty - 1);
        try {
          const rawExp = targetInv.expiryDate;
          const cleanExp = rawExp ? String(rawExp).split("T")[0] : "2027-12-31";
          const scopeStorage = targetInv.storageLocation || (getScopeInfo(targetInv).isShared ? 'Common / Shared' : `Member:${getScopeInfo(targetInv).memberId}`);
          
          await medicineInventoryApi.updateMedicine(targetInventoryId, {
            medicineName: targetInv.medicineName || targetInv.name,
            genericName: targetInv.genericName || targetInv.medicineName || targetInv.name,
            strength: targetInv.strength || '500mg',
            dosageForm: targetInv.dosageForm || 'Tablet',
            manufacturer: targetInv.manufacturer || 'Pharma',
            batchNumber: targetInv.batchNumber || 'B101',
            quantityAvailable: newQty,
            reorderLevel: targetInv.reorderLevel ?? 5,
            expiryDate: cleanExp,
            storageLocation: scopeStorage
          });
          targetInv.quantityAvailable = newQty;
        } catch (updateErr) {
          console.warn("Direct inventory update notice (intake API handled stock deduction):", updateErr);
        }
      }

      if (status === 'TAKEN') {
        setToastMsg(`Dose logged as TAKEN! Inventory stock reduced by 1.`);
      } else {
        setToastMsg(`Intake status (${status}) recorded.`);
      }

      setTimeout(() => setToastMsg(null), 3500);

      if (selectedMemberId !== 'ALL') {
        fetchMemberMedicineData(selectedMemberId);
      }
      await fetchAllData();
    } catch (err) {
      console.error("Intake logging error:", err);
      setErrorMsg("Failed to record dose intake. Stock was not modified.");
    }
  };

  const selectedMemberObject = familyMembers.find(m => getMemId(m) === selectedMemberId);

  // Filter medicines for display
  const filteredMedicines = medicines.filter(med => {
    const name = (med.medicineName || med.name || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase());
    const scope = getScopeInfo(med);

    if (selectedMemberId === 'ALL') {
      // In "All Medicines" section: ONLY show common / shared medicines (exclude member-specific medicines)
      return matchesSearch && scope.isShared;
    } else {
      // In individual member view: show if shared OR explicitly owned by selected member
      return matchesSearch && (scope.isShared || scope.memberId === selectedMemberId);
    }
  });

  const commonCount = medicines.filter(med => getScopeInfo(med).isShared).length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '2.5rem' }}>
      {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Pill size={28} color="#10b981" /> Family & Individual Medication Tracking
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
            Independent member schedules, stock inventory levels, and automated dose deduction
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/app/medicine/log')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
          >
            <Clock size={18} /> Global Intake Log
          </button>

          <button
            onClick={openAddModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Plus size={18} /> Add Medicine
          </button>
        </div>
      </div>

      {/* MEMBER SELECTION STRIP (INDIVIDUAL PERSON TRACKING SELECTOR) */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#10b981" /> Select Family Member for Independent Management
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Card option: All Inventory */}
          <div
            onClick={() => setSelectedMemberId('ALL')}
            style={{
              background: selectedMemberId === 'ALL' ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' : '#ffffff',
              border: selectedMemberId === 'ALL' ? '2.5px solid #10b981' : '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                💊
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a', fontWeight: '700' }}>All Medicines</h3>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>{commonCount} Common Medicines</span>
              </div>
            </div>
          </div>

          {/* Cards for each registered Family Member */}
          {familyMembers.map((member) => {
            const memId = getMemId(member);
            const isSelected = selectedMemberId === memId;

            return (
              <div
                key={memId}
                onClick={() => setSelectedMemberId(memId)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' : '#ffffff',
                  border: isSelected ? '2.5px solid #10b981' : '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                    👤
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a', fontWeight: '700' }}>{member.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Personal Tracking</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONDITIONAL DISPLAY: INDIVIDUAL MEMBER TRACKING vs GENERAL INVENTORY */}
      {selectedMemberId !== 'ALL' ? (
        /* INDIVIDUAL MEMBER TRACKING DASHBOARD */
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={24} color="#10b981" /> Personal Medication Manager: {selectedMemberObject?.name || 'Member'}
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Independent schedules and dose history for {selectedMemberObject?.name}
              </p>
            </div>

            <button
              onClick={openScheduleModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} /> Add Medicine for {selectedMemberObject?.name?.split(' ')[0] || 'Member'}
            </button>
          </div>

          {/* INDIVIDUAL TRACKING TABS */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            <button
              onClick={() => setActiveTab('schedules')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'schedules' ? '#10b981' : '#f1f5f9',
                color: activeTab === 'schedules' ? '#ffffff' : '#475569',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Calendar size={16} /> Personal Schedules ({memberSchedules.length})
            </button>

            <button
              onClick={() => setActiveTab('intakes')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'intakes' ? '#10b981' : '#f1f5f9',
                color: activeTab === 'intakes' ? '#ffffff' : '#475569',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Clock size={16} /> Dose History ({memberIntakes.length})
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'transactions' ? '#10b981' : '#f1f5f9',
                color: activeTab === 'transactions' ? '#ffffff' : '#475569',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Activity size={16} /> Stock Deduction Logs ({memberTransactions.length})
            </button>
          </div>

          {loadingMemberData ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Loading member tracking data...</p>
          ) : activeTab === 'schedules' ? (
            /* TAB A: INDIVIDUAL MEMBER SCHEDULES */
            memberSchedules.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {memberSchedules.map(sched => {
                  const schedId = sched.scheduleId || sched.id;
                  const med = medicines.find(m => (m.inventoryId || m.id) === sched.inventoryId) || {};
                  const qty = med.quantityAvailable ?? med.stock ?? 0;
                  const isOutOfStock = qty <= 0;
                  const expInfo = getExpiryStatus(med.expiryDate || sched.endDate);

                  return (
                    <div
                      key={schedId}
                      style={{
                        background: isOutOfStock || expInfo?.isExpired ? '#fff5f5' : '#f8fafc',
                        borderRadius: '14px',
                        padding: '1.25rem',
                        border: isOutOfStock || expInfo?.isExpired ? '1.5px solid #fca5a5' : '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
                            {sched.status || 'ACTIVE'}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Frequency: {sched.frequency}</span>
                            <button
                              onClick={() => openEditMedicineModal(med.inventoryId ? med : { ...med, inventoryId: sched.inventoryId })}
                              style={{ padding: '4px 8px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: '600' }}
                              title="Edit Medicine Details"
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeletePersonalMedicine(schedId, med.inventoryId || sched.inventoryId)}
                              style={{ padding: '4px 8px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '6px', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: '600' }}
                              title="Delete Personal Medicine"
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </div>

                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: '#0f172a' }}>
                          {med.medicineName || med.name || 'Prescription Medication'}
                        </h3>

                        {/* Stock & Expiry status pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                          {isOutOfStock ? (
                            <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <AlertTriangle size={12} /> Out of Stock (Refill Required)
                            </span>
                          ) : qty <= 5 ? (
                            <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              ⚠️ Low Stock ({qty} left)
                            </span>
                          ) : (
                            <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', background: '#dcfce7', color: '#15803d' }}>
                              Stock: {qty} available
                            </span>
                          )}

                          {expInfo && (
                            expInfo.isExpired ? (
                              <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                🚨 {expInfo.text}
                              </span>
                            ) : expInfo.isExpiringSoon ? (
                              <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', background: '#fffbe6', color: '#d97706', border: '1px solid #ffe58f', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                ⚠️ {expInfo.text}
                              </span>
                            ) : (
                              <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', background: '#f1f5f9', color: '#475569' }}>
                                📅 {expInfo.text}
                              </span>
                            )
                          )}
                        </div>

                        <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#475569' }}>
                          Dosage: <strong>{sched.dosage || '500mg'}</strong> • {sched.beforeFood ? 'Before Food' : 'After Food'}
                        </p>

                        {sched.instructions && (
                          <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#64748b', background: '#fff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                            💡 {sched.instructions}
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                        <button
                          disabled={isOutOfStock}
                          onClick={() => handleLogMemberIntake(schedId, 'TAKEN')}
                          style={{
                            flex: 1,
                            padding: '7px',
                            background: isOutOfStock ? '#94a3b8' : '#10b981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            fontSize: '0.8rem'
                          }}
                        >
                          <Check size={14} /> {isOutOfStock ? "Refill Needed" : "Log Dose Taken (-1 Stock)"}
                        </button>
                        <button
                          onClick={() => {
                            alert("You missed your medicine. Please check and take it as advised.");
                            setToastMsg("You missed your medicine. Please check and take it as advised.");
                            setTimeout(() => setToastMsg(null), 4000);
                          }}
                          style={{ padding: '7px 12px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          <X size={14} /> Missed
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <Calendar size={40} color="#94a3b8" style={{ marginBottom: '8px' }} />
                <h3 style={{ margin: '0 0 4px 0', color: '#334155' }}>No Active Medicines For {selectedMemberObject?.name}</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1.25rem 0' }}>Add personal medicines and set daily dosage reminders for this member.</p>
                <button onClick={openScheduleModal} style={{ padding: '9px 18px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                  + Add Member Medicine
                </button>
              </div>
            )
          ) : activeTab === 'intakes' ? (
            /* TAB B: INDIVIDUAL INTAKE HISTORY LOG */
            memberIntakes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {memberIntakes.map(intake => (
                  <div key={intake.intakeId || intake.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>Date: {intake.intakeDate}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '12px' }}>Time: {intake.takenTime || intake.reminderTime}</span>
                      {intake.remarks && <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#475569' }}>Remarks: {intake.remarks}</p>}
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      background: intake.status === 'TAKEN' ? '#dcfce7' : intake.status === 'MISSED' ? '#fef2f2' : '#fffbe6',
                      color: intake.status === 'TAKEN' ? '#15803d' : intake.status === 'MISSED' ? '#dc2626' : '#d97706'
                    }}>
                      {intake.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <Clock size={40} color="#94a3b8" style={{ marginBottom: '8px' }} />
                <h3 style={{ margin: 0, color: '#334155' }}>No Recorded Dose Logs For {selectedMemberObject?.name}</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>Recorded intake doses will appear here automatically.</p>
              </div>
            )
          ) : (
            /* TAB C: INDIVIDUAL STOCK TRANSACTIONS */
            memberTransactions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {memberTransactions.map(tx => (
                  <div key={tx.transactionId || tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>Type: {tx.transactionType}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '12px' }}>Qty: {tx.quantity}</span>
                      {tx.remarks && <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#475569' }}>{tx.remarks}</p>}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{tx.transactionDate}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <Activity size={40} color="#94a3b8" style={{ marginBottom: '8px' }} />
                <h3 style={{ margin: 0, color: '#334155' }}>No Stock Deduction Transactions Recorded</h3>
              </div>
            )
          )}
        </div>
      ) : (
        /* GENERAL MEDICINE INVENTORY SECTION (ALL MEMBERS VIEW) */
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#0f172a' }}>All Medicines Inventory</h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Showing common medicines and member-specific medicine assignments
              </p>
            </div>

            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {filteredMedicines.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {filteredMedicines.map(med => {
                const invId = med.inventoryId || med.id;
                const name = med.medicineName || med.name || 'Medicine';
                const qty = med.quantityAvailable ?? med.stock ?? 0;
                const scope = getScopeInfo(med);
                const isOutOfStock = qty <= 0;
                const expInfo = getExpiryStatus(med.expiryDate);

                return (
                  <div
                    key={invId}
                    style={{
                      background: isOutOfStock || expInfo?.isExpired ? '#fff5f5' : '#ffffff',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      border: isOutOfStock || expInfo?.isExpired ? '1.5px solid #fca5a5' : '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '12px' }}>
                          <Pill size={24} color="#10b981" />
                        </div>

                        {/* Scope pill (Shared vs Member) */}
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          background: scope.isShared ? '#eff6ff' : '#f3e8ff',
                          color: scope.isShared ? '#1d4ed8' : '#7e22ce',
                          border: scope.isShared ? '1px solid #bfdbfe' : '1px solid #e9d5ff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {scope.isShared ? <Globe size={12} /> : <User size={12} />}
                          {scope.isShared ? 'Common / Shared' : `Member: ${scope.ownerName}`}
                        </span>
                      </div>

                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#0f172a', fontWeight: '700' }}>{name}</h3>

                      {/* Stock & Expiry availability status */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                        {isOutOfStock ? (
                          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={13} /> Out of Stock (Refill Required)
                          </span>
                        ) : qty <= 5 ? (
                          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            ⚠️ Low Stock: {qty} Left (Refill Soon)
                          </span>
                        ) : (
                          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', background: '#dcfce7', color: '#15803d' }}>
                            Stock: {qty} available
                          </span>
                        )}

                        {expInfo && (
                          expInfo.isExpired ? (
                            <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              🚨 {expInfo.text}
                            </span>
                          ) : expInfo.isExpiringSoon ? (
                            <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', background: '#fffbe6', color: '#d97706', border: '1px solid #ffe58f', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              ⚠️ {expInfo.text}
                            </span>
                          ) : (
                            <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600', background: '#f1f5f9', color: '#475569' }}>
                              📅 {expInfo.text}
                            </span>
                          )
                        )}
                      </div>

                      <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#64748b' }}>
                        Strength: <strong>{med.strength || med.dosage || 'Standard'}</strong> • Form: {med.dosageForm || 'Tablet'}
                      </p>

                      <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.8rem', color: '#475569' }}>
                        <div>Manufacturer: <strong>{med.manufacturer || 'Pharma'}</strong></div>
                        {med.expiryDate && <div>Expiry Date: <strong>{med.expiryDate}</strong></div>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                      <button
                        disabled={isOutOfStock}
                        onClick={() => handleLogCommonMedicineIntake(invId)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: isOutOfStock ? '#94a3b8' : '#10b981',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          fontSize: '0.85rem'
                        }}
                      >
                        <CheckCircle size={14} /> {isOutOfStock ? "Refill Needed" : "Log Dose Taken (-1 Stock)"}
                      </button>

                      <button
                        onClick={() => openEditMedicineModal(med)}
                        style={{ padding: '8px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Edit Medicine Details"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(invId)}
                        style={{ padding: '8px 12px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Remove Medicine"
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
              <Pill size={44} color="#94a3b8" style={{ marginBottom: '12px' }} />
              <h3 style={{ margin: '0 0 6px 0', color: '#334155', fontSize: '1.2rem' }}>
                No Medicines In Inventory
              </h3>
              <button
                onClick={openAddModal}
                style={{ padding: '10px 20px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', marginTop: '1rem' }}
              >
                <Plus size={16} /> Add Medicine
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ADD MEDICINE TO INVENTORY */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Medicine to Inventory">
        <form onSubmit={handleAddMedicineSubmit}>
          {errorMsg && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
              {errorMsg}
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Medicine Name *</label>
            <input
              type="text"
              value={newMedForm.medicineName}
              onChange={e => setNewMedForm({ ...newMedForm, medicineName: e.target.value })}
              placeholder="e.g. Paracetamol"
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
              {familyMembers.map(m => {
                const mId = getMemId(m);
                return (
                  <option key={mId} value={mId}>👤 {m.name} (Member Specific)</option>
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
              onClick={() => setIsAddModalOpen(false)}
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

      {/* MODAL 2: ADD / SCHEDULE MEDICINE DIRECTLY FOR INDIVIDUAL MEMBER */}
      <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} title={`Add Medicine for ${selectedMemberObject?.name || 'Member'}`}>
        <form onSubmit={handleCreateScheduleSubmit}>
          {errorMsg && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
              {errorMsg}
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Medicine Name *</label>
            <input
              type="text"
              value={scheduleForm.medicineName}
              onChange={e => setScheduleForm({ ...scheduleForm, medicineName: e.target.value })}
              placeholder="e.g. Paracetamol, Metformin, Amoxicillin"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Dosage & Strength *</label>
              <input
                type="text"
                value={scheduleForm.dosage}
                onChange={e => setScheduleForm({ ...scheduleForm, dosage: e.target.value })}
                placeholder="e.g. 500mg, 1 Tablet"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Initial Stock Quantity *</label>
              <input
                type="number"
                min="1"
                value={scheduleForm.quantityAvailable}
                onChange={e => setScheduleForm({ ...scheduleForm, quantityAvailable: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Frequency</label>
              <select
                value={scheduleForm.frequency}
                onChange={e => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              >
                <option value="DAILY">Once Daily</option>
                <option value="TWICE_DAILY">Twice Daily</option>
                <option value="THREE_TIMES_DAILY">Three Times Daily</option>
                <option value="FOUR_TIMES_DAILY">Four Times Daily</option>
                <option value="AS_NEEDED">As Needed</option>
                <option value="WEEKLY">Weekly</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Start Date *</label>
              <input
                type="date"
                value={scheduleForm.startDate}
                onChange={e => setScheduleForm({ ...scheduleForm, startDate: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Expiry Date *</label>
              <input
                type="date"
                value={scheduleForm.expiryDate}
                onChange={e => setScheduleForm({ ...scheduleForm, expiryDate: e.target.value, endDate: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={scheduleForm.beforeFood}
                onChange={e => setScheduleForm({ ...scheduleForm, beforeFood: e.target.checked })}
              />
              Take Before Food (Empty Stomach)
            </label>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Instructions</label>
            <textarea
              rows="2"
              value={scheduleForm.instructions}
              onChange={e => setScheduleForm({ ...scheduleForm, instructions: e.target.value })}
              placeholder="e.g. Take with warm water after breakfast"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(false)}
              style={{ padding: '9px 18px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer', fontWeight: '600' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ padding: '9px 22px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
            >
              {isSubmitting ? "Adding..." : "Add Medicine"}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: EDIT MEDICINE INVENTORY */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Medicine Details">
        <form onSubmit={handleEditMedicineSubmit}>
          {errorMsg && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
              {errorMsg}
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Medicine Name *</label>
            <input
              type="text"
              value={editMedForm.medicineName}
              onChange={e => setEditMedForm({ ...editMedForm, medicineName: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Scope / Assignment *</label>
            <select
              value={editMedForm.assignedTo}
              onChange={e => setEditMedForm({ ...editMedForm, assignedTo: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: '#ffffff' }}
            >
              <option value="COMMON">🌐 Common / Shared (All Family Members)</option>
              {familyMembers.map(m => {
                const mId = getMemId(m);
                return (
                  <option key={mId} value={mId}>👤 {m.name} (Member Specific)</option>
                );
              })}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Strength / Dosage</label>
              <input
                type="text"
                value={editMedForm.strength}
                onChange={e => setEditMedForm({ ...editMedForm, strength: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Dosage Form</label>
              <input
                type="text"
                value={editMedForm.dosageForm}
                onChange={e => setEditMedForm({ ...editMedForm, dosageForm: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Stock Quantity *</label>
              <input
                type="number"
                min="0"
                value={editMedForm.quantityAvailable}
                onChange={e => setEditMedForm({ ...editMedForm, quantityAvailable: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Expiry Date *</label>
              <input
                type="date"
                value={editMedForm.expiryDate}
                onChange={e => setEditMedForm({ ...editMedForm, expiryDate: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              style={{ padding: '9px 18px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer', fontWeight: '600' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ padding: '9px 22px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MedicineManager;