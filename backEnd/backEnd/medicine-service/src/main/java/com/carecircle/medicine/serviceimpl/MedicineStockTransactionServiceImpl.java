package com.carecircle.medicine.serviceimpl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.carecircle.medicine.dto.request.MedicineStockTransactionRequest;
import com.carecircle.medicine.dto.response.MedicineStockTransactionResponse;
import com.carecircle.medicine.entity.MedicineStockTransaction;
import com.carecircle.medicine.enums.TransactionType;
import com.carecircle.medicine.exception.MedicineStockTransactionNotFoundException;
import com.carecircle.medicine.repository.MedicineStockTransactionRepository;
import com.carecircle.medicine.service.MedicineStockTransactionService;

@Service
public class MedicineStockTransactionServiceImpl
        implements MedicineStockTransactionService {

    private final MedicineStockTransactionRepository transactionRepository;

    public MedicineStockTransactionServiceImpl(
            MedicineStockTransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public MedicineStockTransactionResponse recordTransaction(
            UUID inventoryId,
            UUID familyId,
            UUID memberId,
            UUID referenceId,
            Integer quantity,
            TransactionType transactionType,
            String remarks) {

        MedicineStockTransaction transaction = new MedicineStockTransaction();

        transaction.setInventoryId(inventoryId);
        transaction.setFamilyId(familyId);
        transaction.setMemberId(memberId);

        // referenceId maps to intakeId in your entity
        transaction.setIntakeId(referenceId);

        transaction.setQuantity(quantity);
        transaction.setTransactionType(transactionType);
        transaction.setRemarks(remarks);

        transaction = transactionRepository.save(transaction);

        return mapToResponse(transaction);
    }

    @Override
    public MedicineStockTransactionResponse createTransaction(
            MedicineStockTransactionRequest request) {

        MedicineStockTransaction transaction = new MedicineStockTransaction();

        transaction.setInventoryId(request.getInventoryId());
        transaction.setFamilyId(request.getFamilyId());
        transaction.setMemberId(request.getMemberId());

        // referenceId maps to intakeId
        transaction.setIntakeId(request.getReferenceId());

        transaction.setQuantity(request.getQuantity());
        transaction.setTransactionType(request.getTransactionType());
        transaction.setRemarks(request.getRemarks());

        transaction = transactionRepository.save(transaction);

        return mapToResponse(transaction);
    }

    @Override
    public List<MedicineStockTransactionResponse> getAllTransactions() {

        return transactionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MedicineStockTransactionResponse getTransactionById(
            UUID transactionId) {

        MedicineStockTransaction transaction = transactionRepository
                .findById(transactionId)
                .orElseThrow(() ->
                        new MedicineStockTransactionNotFoundException(
                                "Stock transaction not found."));

        return mapToResponse(transaction);
    }

    @Override
    public List<MedicineStockTransactionResponse> getTransactionsByInventory(
            UUID inventoryId) {

        return transactionRepository.findByInventoryId(inventoryId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicineStockTransactionResponse> getTransactionsByFamily(
            UUID familyId) {

        return transactionRepository.findByFamilyId(familyId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicineStockTransactionResponse> getTransactionsByMember(
            UUID memberId) {

        return transactionRepository.findByMemberId(memberId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicineStockTransactionResponse> getTransactionsByType(
            TransactionType transactionType) {

        return transactionRepository.findByTransactionType(transactionType)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTransaction(UUID transactionId) {

        MedicineStockTransaction transaction = transactionRepository
                .findById(transactionId)
                .orElseThrow(() ->
                        new MedicineStockTransactionNotFoundException(
                                "Stock transaction not found."));

        transactionRepository.delete(transaction);
    }

    private MedicineStockTransactionResponse mapToResponse(
            MedicineStockTransaction transaction) {

        MedicineStockTransactionResponse response =
                new MedicineStockTransactionResponse();

        response.setTransactionId(transaction.getTransactionId());
        response.setInventoryId(transaction.getInventoryId());
        response.setFamilyId(transaction.getFamilyId());
        response.setMemberId(transaction.getMemberId());

        // intakeId -> referenceId in response
        response.setReferenceId(transaction.getIntakeId());

        response.setQuantity(transaction.getQuantity());
        response.setTransactionType(transaction.getTransactionType());
        response.setRemarks(transaction.getRemarks());

        // transactionDate -> transactionTime
        response.setTransactionTime(transaction.getTransactionDate());

        return response;
    }
}