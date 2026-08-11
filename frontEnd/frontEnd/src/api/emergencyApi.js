import apiClient from "./apiClient";

export const emergencyApi = {
  // Find Nearby Hospitals
  getNearbyHospitals: async (lat, lon) => {
    const response = await apiClient.get(
      `/api/emergency/hospitals?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
    );
    return response.data;
  },
};

export default emergencyApi;
