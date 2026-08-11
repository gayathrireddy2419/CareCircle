import apiClient from "./apiClient";

export const medicineInventoryApi = {
  // Add Medicine
  addMedicine: async (familyId, medicineData) => {
    const response = await apiClient.post(
      `/api/v1/medicines?familyId=${encodeURIComponent(familyId)}`,
      medicineData
    );
    return response.data;
  },

  // Get Medicines
  getMedicines: async (familyId) => {
    const response = await apiClient.get(
      `/api/v1/medicines?familyId=${encodeURIComponent(familyId)}`
    );
    return response.data;
  },

  // Get Medicine By ID
  getMedicineById: async (inventoryId) => {
    const response = await apiClient.get(`/api/v1/medicines/${inventoryId}`);
    return response.data;
  },

  // Update Medicine
  updateMedicine: async (inventoryId, medicineData) => {
    const response = await apiClient.put(`/api/v1/medicines/${inventoryId}`, medicineData);
    return response.data;
  },

  // Delete Medicine
  deleteMedicine: async (inventoryId) => {
    const response = await apiClient.delete(`/api/v1/medicines/${inventoryId}`);
    return response.data;
  },

  // Search Medicine
  searchMedicine: async (medicineName) => {
    const response = await apiClient.get(
      `/api/v1/medicines/search?medicineName=${encodeURIComponent(medicineName)}`
    );
    return response.data;
  },

  // Get Expired Medicines
  getExpiredMedicines: async () => {
    const response = await apiClient.get("/api/v1/medicines/expired");
    return response.data;
  },

  // Get Low Stock Medicines
  getLowStockMedicines: async () => {
    const response = await apiClient.get("/api/v1/medicines/low-stock");
    return response.data;
  },
};

export default medicineInventoryApi;
