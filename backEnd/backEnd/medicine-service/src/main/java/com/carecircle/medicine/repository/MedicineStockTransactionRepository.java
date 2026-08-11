package com.carecircle.medicine.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.carecircle.medicine.entity.MedicineStockTransaction;
import com.carecircle.medicine.enums.TransactionType;

@Repository
public interface MedicineStockTransactionRepository
        extends JpaRepository<MedicineStockTransaction, UUID> {

    /**
     * Get all transactions for a medicine inventory.
     */
    List<MedicineStockTransaction> findByInventoryId(UUID inventoryId);

    /**
     * Get all transactions for a family.
     */
    List<MedicineStockTransaction> findByFamilyId(UUID familyId);

    /**
     * Get all transactions for a member.
     */
    List<MedicineStockTransaction> findByMemberId(UUID memberId);

    /**
     * Get transactions by type.
     */
    List<MedicineStockTransaction> findByTransactionType(
            TransactionType transactionType);

    /**
     * Get transactions for a particular medicine of a family.
     */
    List<MedicineStockTransaction> findByFamilyIdAndInventoryId(
            UUID familyId,
            UUID inventoryId);

}