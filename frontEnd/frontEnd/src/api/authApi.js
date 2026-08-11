import apiClient from "./apiClient";

export const authApi = {
  // Register Family Head
  registerHead: async (data) => {
    // data: { familyName, name, mobileNumber, password }
    const response = await apiClient.post("/auth/register-head", data);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    // credentials: { mobileNumber, password }
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },
};

export default authApi;
