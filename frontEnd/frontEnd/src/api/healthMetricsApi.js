import apiClient from "./apiClient";

export const healthMetricsApi = {
  // Add Health Metric
  addHealthMetric: async (metricData) => {
    const response = await apiClient.post("/api/v1/health-metrics", metricData);
    return response.data;
  },

  // Update Health Metric
  updateHealthMetric: async (metricId, metricData) => {
    const response = await apiClient.put(`/api/v1/health-metrics/${metricId}`, metricData);
    return response.data;
  },

  // Get Health Metric By ID
  getHealthMetricById: async (metricId) => {
    const response = await apiClient.get(`/api/v1/health-metrics/${metricId}`);
    return response.data;
  },

  // Get Member Health Metrics
  getMemberHealthMetrics: async (memberId) => {
    const response = await apiClient.get(`/api/v1/health-metrics/member/${memberId}`);
    return response.data;
  },

  // Get Family Health Metrics
  getFamilyHealthMetrics: async (familyId) => {
    const response = await apiClient.get(`/api/v1/health-metrics/family/${familyId}`);
    return response.data;
  },

  // Get Member Health History
  getMemberHealthHistory: async (memberId, startDate, endDate) => {
    const response = await apiClient.get(
      `/api/v1/health-metrics/member/${memberId}/history?startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`
    );
    return response.data;
  },

  // Delete Health Metric
  deleteHealthMetric: async (metricId) => {
    const response = await apiClient.delete(`/api/v1/health-metrics/${metricId}`);
    return response.data;
  },
};

export default healthMetricsApi;
