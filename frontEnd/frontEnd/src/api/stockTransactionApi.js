import apiClient from "./apiClient";

export const stockTransactionApi = {
  // Create Stock Transaction
  createStockTransaction: async (transactionData) => {
    // transactionData: { inventoryId, familyId, memberId, referenceId, quantity, transactionType, remarks }
    const response = await apiClient.post("/api/stock-transactions", transactionData);
    return response.data;
  },

  // Get All Stock Transactions
  getAllStockTransactions: async () => {
    const response = await apiClient.get("/api/stock-transactions");
    return response.data;
  },

  // Get Stock Transaction By ID
  getStockTransactionById: async (transactionId) => {
    const response = await apiClient.get(`/api/stock-transactions/${transactionId}`);
    return response.data;
  },

  // Get Inventory Transactions
  getInventoryTransactions: async (inventoryId) => {
    const response = await apiClient.get(`/api/stock-transactions/inventory/${inventoryId}`);
    return response.data;
  },

  // Get Family Transactions
  getFamilyTransactions: async (familyId) => {
    const response = await apiClient.get(`/api/stock-transactions/family/${familyId}`);
    return response.data;
  },

  // Get Member Transactions
  getMemberTransactions: async (memberId) => {
    const response = await apiClient.get(`/api/stock-transactions/member/${memberId}`);
    return response.data;
  },

  // Get Transactions By Type
  getTransactionsByType: async (transactionType) => {
    const response = await apiClient.get(`/api/stock-transactions/type/${transactionType}`);
    return response.data;
  },

  // Delete Stock Transaction
  deleteStockTransaction: async (transactionId) => {
    const response = await apiClient.delete(`/api/stock-transactions/${transactionId}`);
    return response.data;
  },
};

export default stockTransactionApi;
