import apiClient from "./apiClient";

export const reminderApi = {
  // Add Reminder
  addReminder: async (scheduleId, reminderData) => {
    // reminderData: { reminderTime, enabled }
    const response = await apiClient.post(
      `/api/v1/medications/${scheduleId}/reminders`,
      reminderData
    );
    return response.data;
  },

  // Get Schedule Reminders
  getScheduleReminders: async (scheduleId) => {
    const response = await apiClient.get(`/api/v1/medications/${scheduleId}/reminders`);
    return response.data;
  },

  // Get Reminders By Time
  getRemindersByTime: async (reminderTime) => {
    const response = await apiClient.get(
      `/api/v1/medications/reminders?reminderTime=${encodeURIComponent(reminderTime)}`
    );
    return response.data;
  },

  // Update Reminder
  updateReminder: async (reminderId, reminderData) => {
    const response = await apiClient.put(
      `/api/v1/medications/reminders/${reminderId}`,
      reminderData
    );
    return response.data;
  },

  // Delete Reminder
  deleteReminder: async (reminderId) => {
    const response = await apiClient.delete(`/api/v1/medications/reminders/${reminderId}`);
    return response.data;
  },
};

export default reminderApi;
