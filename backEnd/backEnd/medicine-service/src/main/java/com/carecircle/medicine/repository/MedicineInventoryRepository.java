package com.carecircle.medicine.repository;
import com.carecircle.medicine.entity.MedicineInventory;
import com.carecircle.medicine.enums.TransactionType;
import com.carecircle.medicine.exception.MedicineNotFoundException;
import com.carecircle.medicine.repository.MedicineInventoryRepository;
import com.carecircle.medicine.service.MedicineStockTransactionService;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.carecircle.medicine.entity.MedicineInventory;

@Repository
public interface MedicineInventoryRepository extends JpaRepository<MedicineInventory, UUID> {

    List<MedicineInventory> findByFamilyId(UUID familyId);

    List<MedicineInventory> findByMedicineNameContainingIgnoreCase(String medicineName);

    List<MedicineInventory> findByExpiryDateBefore(LocalDate date);

    List<MedicineInventory> findByQuantityAvailableLessThanEqual(Integer quantity);

    
   
}