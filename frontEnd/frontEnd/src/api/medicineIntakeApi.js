import apiClient from "./apiClient";

export const medicineIntakeApi = {
  // Record Medicine Intake
  recordIntake: async (familyId, intakeData) => {
    try {
      const response = await apiClient.post(
        `/api/v1/medications/intake?familyId=${encodeURIComponent(familyId)}`,
        intakeData
      );
      return response.data;
    } catch (e) {
      const response = await apiClient.post(
        `/api/medicine-intake/${encodeURIComponent(familyId)}`,
        intakeData
      );
      return response.data;
    }
  },

  // Get Family Intake History
  getFamilyIntakeHistory: async (familyId) => {
    try {
      const response = await apiClient.get(
        `/api/v1/medications/intake?familyId=${encodeURIComponent(familyId)}`
      );
      return response.data;
    } catch (e) {
      const response = await apiClient.get(
        `/api/medicine-intake/family/${encodeURIComponent(familyId)}`
      );
      return response.data;
    }
  },

  // Get Intake By ID
  getIntakeById: async (intakeId) => {
    try {
      const response = await apiClient.get(`/api/v1/medications/intake/${intakeId}`);
      return response.data;
    } catch (e) {
      const response = await apiClient.get(`/api/medicine-intake/${intakeId}`);
      return response.data;
    }
  },

  // Get Member Intake History
  getMemberIntakeHistory: async (memberId) => {
    try {
      const response = await apiClient.get(`/api/v1/medications/intake/member/${memberId}`);
      return response.data;
    } catch (e) {
      const response = await apiClient.get(`/api/medicine-intake/member/${memberId}`);
      return response.data;
    }
  },

  // Get Schedule Intake History
  getScheduleIntakeHistory: async (scheduleId) => {
    try {
      const response = await apiClient.get(`/api/v1/medications/intake/schedule/${scheduleId}`);
      return response.data;
    } catch (e) {
      const response = await apiClient.get(`/api/medicine-intake/schedule/${scheduleId}`);
      return response.data;
    }
  },

  // Get Intake By Status
  getIntakeByStatus: async (status) => {
    try {
      const response = await apiClient.get(
        `/api/v1/medications/intake/status?status=${encodeURIComponent(status)}`
      );
      return response.data;
    } catch (e) {
      const response = await apiClient.get(
        `/api/medicine-intake/status/${encodeURIComponent(status)}`
      );
      return response.data;
    }
  },

  // Get Intake By Date
  getIntakeByDate: async (intakeDate) => {
    try {
      const response = await apiClient.get(
        `/api/v1/medications/intake/date?intakeDate=${encodeURIComponent(intakeDate)}`
      );
      return response.data;
    } catch (e) {
      const response = await apiClient.get(
        `/api/medicine-intake/date/${encodeURIComponent(intakeDate)}`
      );
      return response.data;
    }
  },

  // Update Medicine Intake
  updateIntake: async (intakeId, intakeData) => {
    try {
      const response = await apiClient.put(`/api/v1/medications/intake/${intakeId}`, intakeData);
      return response.data;
    } catch (e) {
      const response = await apiClient.put(`/api/medicine-intake/${intakeId}`, intakeData);
      return response.data;
    }
  },

  // Delete Medicine Intake
  deleteIntake: async (intakeId) => {
    try {
      const response = await apiClient.delete(`/api/v1/medications/intake/${intakeId}`);
      return response.data;
    } catch (e) {
      const response = await apiClient.delete(`/api/medicine-intake/${intakeId}`);
      return response.data;
    }
  },
};

export default medicineIntakeApi;
