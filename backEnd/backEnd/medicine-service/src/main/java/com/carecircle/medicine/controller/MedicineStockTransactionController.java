package com.carecircle.medicine.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.carecircle.medicine.dto.request.MedicineStockTransactionRequest;
import com.carecircle.medicine.dto.response.MedicineStockTransactionResponse;
import com.carecircle.medicine.enums.TransactionType;
import com.carecircle.medicine.service.MedicineStockTransactionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/stock-transactions")
public class MedicineStockTransactionController {

    private final MedicineStockTransactionService stockTransactionService;

    public MedicineStockTransactionController(
            MedicineStockTransactionService stockTransactionService) {

        this.stockTransactionService = stockTransactionService;
    }

    /**
     * Create a manual stock transaction.
     */
    @PostMapping
    public ResponseEntity<MedicineStockTransactionResponse> createTransaction(
            @Valid @RequestBody MedicineStockTransactionRequest request) {

        return new ResponseEntity<>(
                stockTransactionService.createTransaction(request),
                HttpStatus.CREATED);
    }

    /**
     * Get all stock transactions.
     */
    @GetMapping
    public ResponseEntity<List<MedicineStockTransactionResponse>> getAllTransactions() {

        return ResponseEntity.ok(
                stockTransactionService.getAllTransactions());
    }

    /**
     * Get stock transaction by ID.
     */
    @GetMapping("/{transactionId}")
    public ResponseEntity<MedicineStockTransactionResponse> getTransactionById(
            @PathVariable UUID transactionId) {

        return ResponseEntity.ok(
                stockTransactionService.getTransactionById(transactionId));
    }

    /**
     * Get transactions by inventory.
     */
    @GetMapping("/inventory/{inventoryId}")
    public ResponseEntity<List<MedicineStockTransactionResponse>> getTransactionsByInventory(
            @PathVariable UUID inventoryId) {

        return ResponseEntity.ok(
                stockTransactionService.getTransactionsByInventory(inventoryId));
    }

    /**
     * Get transactions by family.
     */
    @GetMapping("/family/{familyId}")
    public ResponseEntity<List<MedicineStockTransactionResponse>> getTransactionsByFamily(
            @PathVariable UUID familyId) {

        return ResponseEntity.ok(
                stockTransactionService.getTransactionsByFamily(familyId));
    }

    /**
     * Get transactions by member.
     */
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<MedicineStockTransactionResponse>> getTransactionsByMember(
            @PathVariable UUID memberId) {

        return ResponseEntity.ok(
                stockTransactionService.getTransactionsByMember(memberId));
    }

    /**
     * Get transactions by transaction type.
     */
    @GetMapping("/type/{transactionType}")
    public ResponseEntity<List<MedicineStockTransactionResponse>> getTransactionsByType(
            @PathVariable TransactionType transactionType) {

        return ResponseEntity.ok(
                stockTransactionService.getTransactionsByType(transactionType));
    }

    /**
     * Delete a stock transaction.
     */
    @DeleteMapping("/{transactionId}")
    public ResponseEntity<String> deleteTransaction(
            @PathVariable UUID transactionId) {

        stockTransactionService.deleteTransaction(transactionId);

        return ResponseEntity.ok(
                "Medicine stock transaction deleted successfully.");
    }
}