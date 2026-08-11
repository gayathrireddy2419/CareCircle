package com.carecircle.medicine.service;

import java.util.List;
import java.util.UUID;

import com.carecircle.medicine.dto.request.MedicineInventoryRequest;
import com.carecircle.medicine.dto.response.MedicineInventoryResponse;

public interface MedicineInventoryService {

    MedicineInventoryResponse addMedicine(UUID familyId,
            MedicineInventoryRequest request);

    List<MedicineInventoryResponse> getAllMedicines(UUID familyId);

    MedicineInventoryResponse getMedicineById(UUID inventoryId);

    MedicineInventoryResponse updateMedicine(UUID inventoryId,
            MedicineInventoryRequest request);

    void deleteMedicine(UUID inventoryId);

    List<MedicineInventoryResponse> searchMedicine(String medicineName);

    List<MedicineInventoryResponse> getExpiredMedicines();

    List<MedicineInventoryResponse> getLowStockMedicines();
}