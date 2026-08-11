package com.carecircle.medicine.serviceimpl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.carecircle.medicine.client.NotificationFeignClient;
import com.carecircle.medicine.dto.request.MedicineInventoryRequest;
import com.carecircle.medicine.dto.request.NotificationRequest;
import com.carecircle.medicine.dto.response.MedicineInventoryResponse;
import com.carecircle.medicine.entity.MedicineInventory;
import com.carecircle.medicine.enums.NotificationType;
import com.carecircle.medicine.exception.MedicineNotFoundException;
import com.carecircle.medicine.repository.MedicineInventoryRepository;
import com.carecircle.medicine.service.MedicineInventoryService;

@Service
public class MedicineInventoryServiceImpl implements MedicineInventoryService {

    @Autowired
    private MedicineInventoryRepository repository;

    @Autowired(required = false)
    private NotificationFeignClient notificationFeignClient;

    @Override
    public MedicineInventoryResponse addMedicine(UUID familyId, MedicineInventoryRequest request) {

        MedicineInventory medicine = new MedicineInventory();

        medicine.setFamilyId(familyId);
        medicine.setMedicineName(request.getMedicineName());
        medicine.setGenericName(request.getGenericName());
        medicine.setStrength(request.getStrength());
        medicine.setDosageForm(request.getDosageForm());
        medicine.setManufacturer(request.getManufacturer());
        medicine.setBatchNumber(request.getBatchNumber());
        medicine.setQuantityAvailable(request.getQuantityAvailable());
        medicine.setReorderLevel(request.getReorderLevel());
        medicine.setExpiryDate(request.getExpiryDate());
        medicine.setStorageLocation(request.getStorageLocation());

        MedicineInventory savedMedicine = repository.save(medicine);

        checkAndTriggerLowStockAlert(savedMedicine);

        return convertToResponse(savedMedicine);
    }

    @Override
    public List<MedicineInventoryResponse> getAllMedicines(UUID familyId) {

        List<MedicineInventory> medicines = repository.findByFamilyId(familyId);

        List<MedicineInventoryResponse> responseList = new ArrayList<>();

        for (MedicineInventory medicine : medicines) {
            responseList.add(convertToResponse(medicine));
        }

        return responseList;
    }

    @Override
    public MedicineInventoryResponse getMedicineById(UUID inventoryId) {

        MedicineInventory medicine = repository.findById(inventoryId)
                .orElseThrow(() ->
                        new MedicineNotFoundException("Medicine not found with ID: " + inventoryId));

        return convertToResponse(medicine);
    }

    @Override
    public MedicineInventoryResponse updateMedicine(UUID inventoryId,
                                                    MedicineInventoryRequest request) {

        MedicineInventory medicine = repository.findById(inventoryId)
                .orElseThrow(() ->
                        new MedicineNotFoundException("Medicine not found with ID: " + inventoryId));

        if (request.getMedicineName() != null && !request.getMedicineName().isBlank()) {
            medicine.setMedicineName(request.getMedicineName());
        }
        if (request.getGenericName() != null) medicine.setGenericName(request.getGenericName());
        if (request.getStrength() != null) medicine.setStrength(request.getStrength());
        if (request.getDosageForm() != null) medicine.setDosageForm(request.getDosageForm());
        if (request.getManufacturer() != null) medicine.setManufacturer(request.getManufacturer());
        if (request.getBatchNumber() != null) medicine.setBatchNumber(request.getBatchNumber());
        if (request.getQuantityAvailable() != null) {
            medicine.setQuantityAvailable(request.getQuantityAvailable());
        }
        if (request.getReorderLevel() != null) medicine.setReorderLevel(request.getReorderLevel());
        if (request.getExpiryDate() != null) medicine.setExpiryDate(request.getExpiryDate());
        if (request.getStorageLocation() != null) medicine.setStorageLocation(request.getStorageLocation());

        MedicineInventory updatedMedicine = repository.save(medicine);

        checkAndTriggerLowStockAlert(updatedMedicine);

        return convertToResponse(updatedMedicine);
    }

    @Override
    public void deleteMedicine(UUID inventoryId) {

        MedicineInventory medicine = repository.findById(inventoryId)
                .orElseThrow(() ->
                        new MedicineNotFoundException("Medicine not found with ID: " + inventoryId));

        repository.delete(medicine);
    }

    @Override
    public List<MedicineInventoryResponse> searchMedicine(String medicineName) {

        List<MedicineInventory> medicines =
                repository.findByMedicineNameContainingIgnoreCase(medicineName);

        List<MedicineInventoryResponse> responseList = new ArrayList<>();

        for (MedicineInventory medicine : medicines) {
            responseList.add(convertToResponse(medicine));
        }

        return responseList;
    }

    @Override
    public List<MedicineInventoryResponse> getExpiredMedicines() {

        List<MedicineInventory> medicines =
                repository.findByExpiryDateBefore(LocalDate.now());

        List<MedicineInventoryResponse> responseList = new ArrayList<>();

        for (MedicineInventory medicine : medicines) {
            checkAndTriggerExpiryAlert(medicine);
            responseList.add(convertToResponse(medicine));
        }

        return responseList;
    }

    @Override
    public List<MedicineInventoryResponse> getLowStockMedicines() {

        List<MedicineInventory> medicines =
                repository.findByQuantityAvailableLessThanEqual(5);

        List<MedicineInventoryResponse> responseList = new ArrayList<>();

        for (MedicineInventory medicine : medicines) {
            checkAndTriggerLowStockAlert(medicine);
            responseList.add(convertToResponse(medicine));
        }

        return responseList;
    }

    private void checkAndTriggerLowStockAlert(MedicineInventory medicine) {
        if (medicine == null || notificationFeignClient == null) return;
        int threshold = medicine.getReorderLevel() != null ? medicine.getReorderLevel() : 5;
        if (medicine.getQuantityAvailable() <= threshold) {
            try {
                String message = String.format(
                    "⚠️ *CareCircle Low Stock Alert*\n\nMedicine: *%s*\nRemaining Stock: *%d tablets*\nStorage: %s\n\nPlease reorder soon to avoid missing scheduled doses!",
                    medicine.getMedicineName(), medicine.getQuantityAvailable(),
                    medicine.getStorageLocation() != null ? medicine.getStorageLocation() : "Cabinet"
                );

                NotificationRequest req = new NotificationRequest();
                req.setFamilyId(medicine.getFamilyId());
                req.setMemberId(medicine.getFamilyId());
                req.setPhoneNumber("+919876543210");
                req.setNotificationType(NotificationType.MEDICINE_REFILL_ALERT);
                req.setReferenceId(medicine.getInventoryId());
                req.setMessage(message);

                notificationFeignClient.sendNotification(req);
                System.out.println("🚨 Triggered WhatsApp Low Stock Alert for " + medicine.getMedicineName());
            } catch (Exception e) {
                System.err.println("Could not send WhatsApp low stock alert: " + e.getMessage());
            }
        }
    }

    private void checkAndTriggerExpiryAlert(MedicineInventory medicine) {
        if (medicine == null || notificationFeignClient == null) return;
        try {
            String message = String.format(
                "🚨 *CareCircle Medicine Expiry Alert*\n\nMedicine: *%s* (Batch %s)\nExpiry Date: *%s*\n\nThis medicine has expired. Please dispose of it safely and replace if necessary.",
                medicine.getMedicineName(),
                medicine.getBatchNumber() != null ? medicine.getBatchNumber() : "N/A",
                medicine.getExpiryDate()
            );

            NotificationRequest req = new NotificationRequest();
            req.setFamilyId(medicine.getFamilyId());
            req.setMemberId(medicine.getFamilyId());
            req.setPhoneNumber("+919876543210");
            req.setNotificationType(NotificationType.MEDICINE_EXPIRY_ALERT);
            req.setReferenceId(medicine.getInventoryId());
            req.setMessage(message);

            notificationFeignClient.sendNotification(req);
            System.out.println("🚨 Triggered WhatsApp Expiry Alert for " + medicine.getMedicineName());
        } catch (Exception e) {
            System.err.println("Could not send WhatsApp expiry alert: " + e.getMessage());
        }
    }

    private MedicineInventoryResponse convertToResponse(MedicineInventory medicine) {

        MedicineInventoryResponse response = new MedicineInventoryResponse();

        response.setInventoryId(medicine.getInventoryId());
        response.setFamilyId(medicine.getFamilyId());
        response.setMedicineName(medicine.getMedicineName());
        response.setGenericName(medicine.getGenericName());
        response.setStrength(medicine.getStrength());
        response.setDosageForm(medicine.getDosageForm());
        response.setManufacturer(medicine.getManufacturer());
        response.setBatchNumber(medicine.getBatchNumber());
        response.setQuantityAvailable(medicine.getQuantityAvailable());
        response.setReorderLevel(medicine.getReorderLevel());
        response.setExpiryDate(medicine.getExpiryDate());
        response.setStorageLocation(medicine.getStorageLocation());
        response.setCreatedAt(medicine.getCreatedAt());
        response.setUpdatedAt(medicine.getUpdatedAt());

        return response;
    }
}