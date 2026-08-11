package com.carecircle.medicine.service;

import java.util.List;
import java.util.UUID;

import com.carecircle.medicine.dto.request.MedicineStockTransactionRequest;
import com.carecircle.medicine.dto.response.MedicineStockTransactionResponse;
import com.carecircle.medicine.enums.TransactionType;

public interface MedicineStockTransactionService {

    /**
     * Internal method used by other services
     * (Medicine Intake, Inventory, etc.)
     */
    MedicineStockTransactionResponse recordTransaction(
            UUID inventoryId,
            UUID familyId,
            UUID memberId,
            UUID referenceId,
            Integer quantity,
            TransactionType transactionType,
            String remarks);

    /**
     * Manual transaction entry.
     */
    MedicineStockTransactionResponse createTransaction(
            MedicineStockTransactionRequest request);

    /**
     * Get all transactions.
     */
    List<MedicineStockTransactionResponse> getAllTransactions();

    /**
     * Get transaction by ID.
     */
    MedicineStockTransactionResponse getTransactionById(
            UUID transactionId);

    /**
     * Get transactions by inventory.
     */
    List<MedicineStockTransactionResponse> getTransactionsByInventory(
            UUID inventoryId);

    /**
     * Get transactions by family.
     */
    List<MedicineStockTransactionResponse> getTransactionsByFamily(
            UUID familyId);

    /**
     * Get transactions by member.
     */
    List<MedicineStockTransactionResponse> getTransactionsByMember(
            UUID memberId);

    /**
     * Get transactions by transaction type.
     */
    List<MedicineStockTransactionResponse> getTransactionsByType(
            TransactionType transactionType);

    /**
     * Delete transaction.
     */
    void deleteTransaction(
            UUID transactionId);

}