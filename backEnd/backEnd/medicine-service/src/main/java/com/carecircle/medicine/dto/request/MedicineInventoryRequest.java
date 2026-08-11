package com.carecircle.medicine.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MedicineInventoryRequest {

    @NotBlank(message = "Medicine name is required.")
    @Size(max = 100, message = "Medicine name cannot exceed 100 characters.")
    private String medicineName;

    @Size(max = 100, message = "Generic name cannot exceed 100 characters.")
    private String genericName;

    @Size(max = 50, message = "Strength cannot exceed 50 characters.")
    private String strength;

    @Size(max = 50, message = "Dosage form cannot exceed 50 characters.")
    private String dosageForm;

    @Size(max = 100, message = "Manufacturer name cannot exceed 100 characters.")
    private String manufacturer;

    @Size(max = 50, message = "Batch number cannot exceed 50 characters.")
    private String batchNumber;

    @NotNull(message = "Quantity is required.")
    @Min(value = 0, message = "Quantity cannot be negative.")
    private Integer quantityAvailable;

    @Min(value = 0, message = "Reorder level cannot be negative.")
    private Integer reorderLevel;

    @NotNull(message = "Expiry date is required.")
    private LocalDate expiryDate;

    @Size(max = 100, message = "Storage location cannot exceed 100 characters.")
    private String storageLocation;

    public MedicineInventoryRequest() {
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }

    public String getStrength() {
        return strength;
    }

    public void setStrength(String strength) {
        this.strength = strength;
    }

    public String getDosageForm() {
        return dosageForm;
    }

    public void setDosageForm(String dosageForm) {
        this.dosageForm = dosageForm;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public Integer getQuantityAvailable() {
        return quantityAvailable;
    }

    public void setQuantityAvailable(Integer quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public void setStorageLocation(String storageLocation) {
        this.storageLocation = storageLocation;
    }
}