import apiClient from "./apiClient";

export const medicationApi = {
  // Create Medication Schedule
  createSchedule: async (familyId, scheduleData) => {
    const response = await apiClient.post(
      `/api/v1/medications?familyId=${encodeURIComponent(familyId)}`,
      scheduleData
    );
    return response.data;
  },

  // Get Family Medication Schedules
  getFamilySchedules: async (familyId) => {
    const response = await apiClient.get(
      `/api/v1/medications?familyId=${encodeURIComponent(familyId)}`
    );
    return response.data;
  },

  // Get Medication Schedule By ID
  getScheduleById: async (scheduleId) => {
    const response = await apiClient.get(`/api/v1/medications/${scheduleId}`);
    return response.data;
  },

  // Get Member Medication Schedules
  getMemberSchedules: async (memberId) => {
    const response = await apiClient.get(`/api/v1/medications/member/${memberId}`);
    return response.data;
  },

  // Update Medication Schedule
  updateSchedule: async (scheduleId, scheduleData) => {
    const response = await apiClient.put(`/api/v1/medications/${scheduleId}`, scheduleData);
    return response.data;
  },

  // Delete Medication Schedule
  deleteSchedule: async (scheduleId) => {
    const response = await apiClient.delete(`/api/v1/medications/${scheduleId}`);
    return response.data;
  },
};

export default medicationApi;
