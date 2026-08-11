import apiClient from "./apiClient";

export const healthRecordApi = {
  // Upload Medical Record (multipart/form-data)
  uploadRecord: async (formData) => {
    // formData fields: familyId, memberId, title, doctor, recordDate, category, file
    const response = await apiClient.post("/api/records/upload", formData, {
      headers: {
        "Content-Type": undefined, // Let Axios/browser set multipart boundary automatically
      },
    });
    return response.data;
  },

  // Get All Medical Records
  getAllRecords: async () => {
    const response = await apiClient.get("/api/records");
    return response.data;
  },

  // Get Medical Record By ID
  getRecordById: async (recordId) => {
    const response = await apiClient.get(`/api/records/${recordId}`);
    return response.data;
  },

  // Get Family Medical Records
  getFamilyRecords: async (familyId) => {
    const response = await apiClient.get(`/api/records/family/${familyId}`);
    return response.data;
  },

  // Get Member Medical Records
  getMemberRecords: async (memberId) => {
    const response = await apiClient.get(`/api/records/member/${memberId}`);
    return response.data;
  },

  // Download Medical Record (returns blob)
  downloadRecord: async (recordId) => {
    const response = await apiClient.get(`/api/records/download/${recordId}`, {
      responseType: "blob",
    });
    return response.data;
  },

  // Delete Medical Record
  deleteRecord: async (recordId) => {
    const response = await apiClient.delete(`/api/records/${recordId}`);
    return response.data;
  },
};

export default healthRecordApi;
