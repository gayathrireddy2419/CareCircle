// src/context/HealthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import authApi from "../api/authApi";
import familyApi from "../api/familyApi";
import healthRecordApi from "../api/healthRecordApi";
import medicineInventoryApi from "../api/medicineInventoryApi";
import medicineIntakeApi from "../api/medicineIntakeApi";
import medicationApi from "../api/medicationApi";
import healthMetricsApi from "../api/healthMetricsApi";

const HealthContext = createContext();

const savedTheme = typeof window !== "undefined" ? localStorage.getItem("CareCircle_theme") || "light" : "light";

export const HealthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [state, setState] = useState({
    familyMembers: [],
    medicines: [],
    records: [],
    healthMetrics: [],
    emergencyContacts: [],
    userSettings: {
      theme: savedTheme,
      language: "English",
      emailNotifications: true,
      smsAlerts: true,
      twoFactor: true,
      dataSharing: false,
      emergencySOSAlert: true,
    },
    loading: false,
    error: null,
  });

  // Apply dark/light theme to document whenever theme changes
  useEffect(() => {
    const currentTheme = state.userSettings?.theme || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("CareCircle_theme", currentTheme);
  }, [state.userSettings?.theme]);

  const toggleTheme = () => {
    setState((prev) => {
      const nextTheme = prev.userSettings?.theme === "dark" ? "light" : "dark";
      return {
        ...prev,
        userSettings: { ...prev.userSettings, theme: nextTheme },
      };
    });
  };

  // Fetch initial family data if authenticated
  const fetchAllData = useCallback(async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) return;

    setState((prev) => ({ ...prev, loading: true }));
    try {
      const familyId = user?.familyId || localStorage.getItem("familyId");

      // 1. Fetch family members
      let members = [];
      try {
        const membersRes = await familyApi.getMembers();
        members = Array.isArray(membersRes) ? membersRes : membersRes?.data || membersRes?.members || [];
      } catch (err) {
        console.warn("Could not fetch family members:", err.message);
      }

      // 2. Fetch records
      let records = [];
      try {
        const recordsRes = familyId 
          ? await healthRecordApi.getFamilyRecords(familyId)
          : await healthRecordApi.getAllRecords();
        records = Array.isArray(recordsRes) ? recordsRes : recordsRes?.data || recordsRes?.records || [];
      } catch (err) {
        console.warn("Could not fetch medical records:", err.message);
      }

      // 3. Fetch medicines if user has familyId
      let medicines = [];
      if (familyId) {
        try {
          const medRes = await medicineInventoryApi.getMedicines(familyId);
          medicines = Array.isArray(medRes) ? medRes : medRes?.data || medRes?.medicines || [];
        } catch (err) {
          console.warn("Could not fetch medicines:", err.message);
        }
      }

      // 4. Fetch health metrics if user has familyId
      let healthMetrics = [];
      if (familyId) {
        try {
          const metricsRes = await healthMetricsApi.getFamilyHealthMetrics(familyId);
          healthMetrics = Array.isArray(metricsRes) ? metricsRes : metricsRes?.data || metricsRes?.metrics || [];
        } catch (err) {
          console.warn("Could not fetch health metrics:", err.message);
        }
      }

      setState((prev) => ({
        ...prev,
        familyMembers: members.length > 0 ? members : prev.familyMembers,
        records: records.length > 0 ? records : prev.records,
        medicines: medicines.length > 0 ? medicines : prev.medicines,
        healthMetrics: healthMetrics.length > 0 ? healthMetrics : prev.healthMetrics,
        loading: false,
      }));
    } catch (err) {
      console.error("Error fetching family data:", err);
      setState((prev) => ({ ...prev, loading: false, error: err.message }));
    }
  }, [user?.familyId]);

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token, fetchAllData]);

  // Auth Operations
  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    const jwt = data.token || data.jwtToken || data.jwt;
    if (jwt) {
      localStorage.setItem("token", jwt);
      setToken(jwt);
    }
    const userData = data.user || data.familyHead || {
      name: data.name || credentials.mobileNumber,
      mobileNumber: credentials.mobileNumber,
      familyId: data.familyId,
      id: data.id || data.memberId,
    };
    if (data.familyId) {
      localStorage.setItem("familyId", data.familyId);
    }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return data;
  };

  const registerHead = async (payload) => {
    const data = await authApi.registerHead(payload);
    // Automatically log in after registration if token provided
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      if (data.familyId) {
        localStorage.setItem("familyId", data.familyId);
      }
      const userData = data.user || {
        name: payload.name,
        mobileNumber: payload.mobileNumber,
        familyId: data.familyId,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("familyId");
    setToken(null);
    setUser(null);
    setState((prev) => ({
      ...prev,
      familyMembers: [],
      notifications: [],
      medicines: [],
      records: [],
      healthMetrics: [],
    }));
  };

  // Member Operations
  const addMember = async (memberData) => {
    try {
      const newMember = await familyApi.addMember(memberData);
      await fetchAllData();
      return newMember;
    } catch (err) {
      console.error("Error adding family member:", err);
      throw err;
    }
  };

  const editMember = async (memberId, memberData) => {
    let updated = null;
    try {
      updated = await familyApi.updateMember(memberId, memberData);
    } catch (err) {
      console.warn("Backend updateMember notice, updating local state:", err);
    }

    setState((prev) => ({
      ...prev,
      familyMembers: (prev.familyMembers || []).map((m) => {
        const mId = m.userId || m.id || m.memberId;
        if (mId === memberId) {
          return { ...m, ...memberData, ...(updated || {}) };
        }
        return m;
      }),
    }));

    try {
      await fetchAllData();
    } catch (e) {
      // Ignore background sync error
    }
    return updated;
  };

  const deleteMember = async (memberId) => {
    try {
      await familyApi.deleteMember(memberId);
      setState((prev) => ({
        ...prev,
        familyMembers: prev.familyMembers.filter((m) => (m.id || m.memberId) !== memberId),
      }));
    } catch (err) {
      console.error("Error deleting member:", err);
      throw err;
    }
  };



  // Record Operations
  const addRecord = async (formData) => {
    try {
      const newRec = await healthRecordApi.uploadRecord(formData);
      await fetchAllData();
      return newRec;
    } catch (err) {
      console.error("Error uploading record:", err);
      throw err;
    }
  };

  const deleteRecord = async (recordId) => {
    try {
      await healthRecordApi.deleteRecord(recordId);
      setState((prev) => ({
        ...prev,
        records: prev.records.filter((r) => (r.id || r.recordId) !== recordId),
      }));
    } catch (err) {
      console.error("Error deleting record:", err);
      throw err;
    }
  };

  // Medicine Operations
  const addMedicine = async (medicineData) => {
    try {
      const familyId = user?.familyId || localStorage.getItem("familyId") || "00000000-0000-0000-0000-000000000000";
      const formattedData = {
        medicineName: medicineData.medicineName || medicineData.name || "Medicine",
        genericName: medicineData.genericName || medicineData.medicineName || medicineData.name || "Generic",
        strength: medicineData.strength || medicineData.dosage || "500mg",
        dosageForm: medicineData.dosageForm || "Tablet",
        manufacturer: medicineData.manufacturer || "Pharma",
        batchNumber: medicineData.batchNumber || "B" + Math.floor(100 + Math.random() * 900),
        quantityAvailable: parseInt(medicineData.quantityAvailable ?? medicineData.stock ?? 30, 10),
        reorderLevel: parseInt(medicineData.reorderLevel ?? 5, 10),
        expiryDate: medicineData.expiryDate || "2027-12-31",
        storageLocation: medicineData.storageLocation || "Medicine Box",
      };
      const newMed = await medicineInventoryApi.addMedicine(familyId, formattedData);
      await fetchAllData();
      return newMed;
    } catch (err) {
      console.error("Error adding medicine:", err);
      throw err;
    }
  };

  const deleteMedicine = async (inventoryId) => {
    try {
      await medicineInventoryApi.deleteMedicine(inventoryId);
      setState((prev) => ({
        ...prev,
        medicines: prev.medicines.filter((m) => (m.id || m.inventoryId) !== inventoryId),
      }));
    } catch (err) {
      console.error("Error deleting medicine:", err);
      throw err;
    }
  };

  const addHealthMetric = async (metricData) => {
    let res = null;
    try {
      res = await healthMetricsApi.addHealthMetric(metricData);
    } catch (err) {
      console.warn("Backend addHealthMetric notice, storing in local state:", err);
    }

    const newMetricObj = {
      id: Date.now().toString(),
      metricId: Date.now().toString(),
      familyId: metricData.familyId,
      memberId: metricData.memberId,
      recordedBy: metricData.recordedBy,
      height: metricData.height,
      weight: metricData.weight,
      systolicBp: metricData.systolicBp,
      diastolicBp: metricData.diastolicBp,
      bloodSugar: metricData.bloodSugar,
      heartRate: metricData.heartRate,
      oxygenSaturation: metricData.oxygenSaturation,
      temperature: metricData.temperature,
      notes: metricData.notes,
      recordedAt: metricData.recordedAt,
    };

    setState((prev) => ({
      ...prev,
      healthMetrics: [...(prev.healthMetrics || []), newMetricObj],
    }));

    try {
      await fetchAllData();
    } catch (e) {
      // Ignore background sync error
    }
    return res || newMetricObj;
  };

  const recordIntake = async (intakeDataOrMedId) => {
    try {
      const familyId = user?.familyId || localStorage.getItem("familyId") || "00000000-0000-0000-0000-000000000000";
      const memberId = state.familyMembers[0]?.userId || state.familyMembers[0]?.id || state.familyMembers[0]?.memberId || "00000000-0000-0000-0000-000000000000";
      const nowStr = new Date().toISOString();

      let payload;
      if (typeof intakeDataOrMedId === "object" && intakeDataOrMedId !== null) {
        payload = intakeDataOrMedId;
      } else {
        payload = {
          scheduleId: intakeDataOrMedId || "00000000-0000-0000-0000-000000000000",
          reminderId: "00000000-0000-0000-0000-000000000000",
          memberId: memberId,
          intakeDate: nowStr.split("T")[0],
          reminderTime: "08:30:00",
          takenTime: nowStr.substring(0, 19),
          status: "TAKEN",
          remarks: "Logged via UI",
        };
      }
      const res = await medicineIntakeApi.recordIntake(familyId, payload);
      await fetchAllData();
      return res;
    } catch (err) {
      console.error("Error recording intake:", err);
      throw err;
    }
  };

  const updateProfile = (updatedProfile) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedProfile };
      localStorage.setItem("user", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const updateSettings = (newSettings) => {
    setState((prev) => ({
      ...prev,
      userSettings: { ...prev.userSettings, ...newSettings },
    }));
  };

  return (
    <HealthContext.Provider
      value={{
        state,
        user,
        setUser,
        token,
        login,
        registerHead,
        logout,
        toggleTheme,
        fetchAllData,
        addMember,
        editMember,
        deleteMember,
        addMedicine,
        deleteMedicine,
        addRecord,
        deleteRecord,
        addHealthMetric,
        recordIntake,
        logDose: recordIntake,
        updateProfile,
        updateSettings,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);