package com.carecircle.medicine.exception;

public class MedicineStockTransactionNotFoundException extends RuntimeException {

    public MedicineStockTransactionNotFoundException(String message) {
        super(message);
    }
}