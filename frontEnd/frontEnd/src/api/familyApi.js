import apiClient from "./apiClient";

export const familyApi = {
  // Add Family Member
  addMember: async (memberData) => {
    // memberData: { name, mobileNumber, password }
    const response = await apiClient.post("/family/members", memberData);
    return response.data;
  },

  // Get Family Members
  getMembers: async () => {
    const response = await apiClient.get("/family/members");
    return response.data;
  },

  // Update Family Member
  updateMember: async (memberId, memberData) => {
    // memberData: { name, mobileNumber }
    const response = await apiClient.put(`/family/members/${memberId}`, memberData);
    return response.data;
  },

  // Delete Family Member
  deleteMember: async (memberId) => {
    const response = await apiClient.delete(`/family/members/${memberId}`);
    return response.data;
  },
};

export default familyApi;
