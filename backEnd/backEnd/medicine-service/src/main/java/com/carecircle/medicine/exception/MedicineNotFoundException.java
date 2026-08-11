package com.carecircle.medicine.exception;

public class MedicineNotFoundException extends RuntimeException {

    public MedicineNotFoundException() {
        super();
    }

    public MedicineNotFoundException(String message) {
        super(message);
    }
}