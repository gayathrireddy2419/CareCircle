package com.carecircle.medicine.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.carecircle.medicine.dto.request.MedicineInventoryRequest;
import com.carecircle.medicine.dto.response.MedicineInventoryResponse;
import com.carecircle.medicine.service.MedicineInventoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/medicines")
@Validated
public class MedicineInventoryController {

    private final MedicineInventoryService medicineInventoryService;

    public MedicineInventoryController(
            MedicineInventoryService medicineInventoryService) {

        this.medicineInventoryService = medicineInventoryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MedicineInventoryResponse addMedicine(
            @RequestParam UUID familyId,
            @Valid @RequestBody MedicineInventoryRequest request) {

        return medicineInventoryService.addMedicine(familyId, request);
    }

    @GetMapping
    public List<MedicineInventoryResponse> getAllMedicines(
            @RequestParam UUID familyId) {

        return medicineInventoryService.getAllMedicines(familyId);
    }

    @GetMapping("/{inventoryId}")
    public MedicineInventoryResponse getMedicineById(
            @PathVariable UUID inventoryId) {

        return medicineInventoryService.getMedicineById(inventoryId);
    }

    @PutMapping("/{inventoryId}")
    public MedicineInventoryResponse updateMedicine(
            @PathVariable UUID inventoryId,
            @Valid @RequestBody MedicineInventoryRequest request) {

        return medicineInventoryService.updateMedicine(inventoryId, request);
    }

    @DeleteMapping("/{inventoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMedicine(
            @PathVariable UUID inventoryId) {

        medicineInventoryService.deleteMedicine(inventoryId);
    }

    @GetMapping("/search")
    public List<MedicineInventoryResponse> searchMedicine(
            @RequestParam String medicineName) {

        return medicineInventoryService.searchMedicine(medicineName);
    }

    @GetMapping("/expired")
    public List<MedicineInventoryResponse> getExpiredMedicines() {

        return medicineInventoryService.getExpiredMedicines();
    }

    @GetMapping("/low-stock")
    public List<MedicineInventoryResponse> getLowStockMedicines() {

        return medicineInventoryService.getLowStockMedicines();
    }
}