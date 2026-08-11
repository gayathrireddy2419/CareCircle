package com.carecircle.medicine.serviceimpl;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.carecircle.medicine.dto.request.MedicineIntakeHistoryRequest;
import com.carecircle.medicine.dto.response.MedicineIntakeHistoryResponse;
import com.carecircle.medicine.entity.MedicationReminder;
import com.carecircle.medicine.entity.MedicationSchedule;
import com.carecircle.medicine.entity.MedicineIntakeHistory;
import com.carecircle.medicine.entity.MedicineInventory;
import com.carecircle.medicine.enums.Frequency;
import com.carecircle.medicine.enums.IntakeStatus;
import com.carecircle.medicine.enums.TransactionType;
import com.carecircle.medicine.exception.MedicationReminderNotFoundException;
import com.carecircle.medicine.exception.MedicationScheduleNotFoundException;
import com.carecircle.medicine.exception.MedicineIntakeHistoryNotFoundException;
import com.carecircle.medicine.exception.MedicineNotFoundException;
import com.carecircle.medicine.repository.MedicationReminderRepository;
import com.carecircle.medicine.repository.MedicationScheduleRepository;
import com.carecircle.medicine.repository.MedicineIntakeHistoryRepository;
import com.carecircle.medicine.repository.MedicineInventoryRepository;
import com.carecircle.medicine.service.MedicineIntakeHistoryService;
import com.carecircle.medicine.service.MedicineStockTransactionService;

@Service
public class MedicineIntakeHistoryServiceImpl implements MedicineIntakeHistoryService {

    private final MedicineIntakeHistoryRepository intakeRepository;
    private final MedicationScheduleRepository scheduleRepository;
    private final MedicationReminderRepository reminderRepository;
    private final MedicineInventoryRepository inventoryRepository;
    private final MedicineStockTransactionService stockTransactionService;

    public MedicineIntakeHistoryServiceImpl(
            MedicineIntakeHistoryRepository intakeRepository,
            MedicationScheduleRepository scheduleRepository,
            MedicationReminderRepository reminderRepository,
            MedicineInventoryRepository inventoryRepository,
            MedicineStockTransactionService stockTransactionService) {

        this.intakeRepository = intakeRepository;
        this.scheduleRepository = scheduleRepository;
        this.reminderRepository = reminderRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockTransactionService = stockTransactionService;
    }

    @Override
    public MedicineIntakeHistoryResponse recordMedicineIntake(
            UUID familyId,
            MedicineIntakeHistoryRequest request) {

        if (request.getStatus() == null) {
            request.setStatus(IntakeStatus.TAKEN);
        }

        MedicationSchedule schedule = null;
        if (request.getScheduleId() != null) {
            schedule = scheduleRepository.findById(request.getScheduleId()).orElse(null);
        }

        MedicineInventory inventory = null;

        if (schedule != null) {
            inventory = inventoryRepository.findById(schedule.getInventoryId()).orElse(null);
        } else if (request.getScheduleId() != null) {
            // Check if request.getScheduleId() was actually an inventoryId passed directly from frontend
            inventory = inventoryRepository.findById(request.getScheduleId()).orElse(null);
        }

        if (inventory == null && familyId != null) {
            List<MedicineInventory> familyMeds = inventoryRepository.findByFamilyId(familyId);
            if (!familyMeds.isEmpty()) {
                inventory = familyMeds.get(0);
            }
        }

        if (schedule == null && inventory != null) {
            // Find existing schedule for this inventory or create an active schedule
            List<MedicationSchedule> existingSchedules = scheduleRepository.findByInventoryId(inventory.getInventoryId());
            if (!existingSchedules.isEmpty()) {
                schedule = existingSchedules.get(0);
            } else {
                schedule = new MedicationSchedule();
                schedule.setScheduleId(UUID.randomUUID());
                schedule.setFamilyId(familyId != null ? familyId : inventory.getFamilyId());
                schedule.setMemberId(request.getMemberId() != null ? request.getMemberId() : (familyId != null ? familyId : inventory.getFamilyId()));
                schedule.setInventoryId(inventory.getInventoryId());
                schedule.setDosage(inventory.getStrength() != null ? inventory.getStrength() : "500mg");
                schedule.setFrequency(Frequency.DAILY);
                schedule.setBeforeFood(false);
                schedule.setStartDate(LocalDate.now());
                schedule.setEndDate(inventory.getExpiryDate() != null ? inventory.getExpiryDate() : LocalDate.now().plusYears(1));
                schedule.setStatus(com.carecircle.medicine.enums.MedicationStatus.ACTIVE);
                schedule = scheduleRepository.save(schedule);
            }
        }

        if (schedule == null) {
            throw new MedicationScheduleNotFoundException("Medication Schedule or Inventory record not found.");
        }

        if (inventory == null) {
            inventory = inventoryRepository.findById(schedule.getInventoryId())
                    .orElseThrow(() -> new MedicineNotFoundException("Medicine inventory not found."));
        }

        if (request.getStatus() == IntakeStatus.TAKEN) {
            if (inventory.getQuantityAvailable() <= 0) {
                throw new RuntimeException("Medicine is out of stock.");
            }

            inventory.setQuantityAvailable(inventory.getQuantityAvailable() - 1);
            inventoryRepository.save(inventory);
        }

        MedicineIntakeHistory history = new MedicineIntakeHistory();

        history.setScheduleId(schedule.getScheduleId());
        history.setReminderId(request.getReminderId());
        history.setFamilyId(schedule.getFamilyId());
        history.setMemberId(request.getMemberId() != null ? request.getMemberId() : schedule.getMemberId());
        history.setIntakeDate(request.getIntakeDate() != null ? request.getIntakeDate() : LocalDate.now());
        history.setReminderTime(request.getReminderTime() != null ? request.getReminderTime() : java.time.LocalTime.of(8, 30));
        history.setTakenTime(request.getTakenTime() != null ? request.getTakenTime() : java.time.LocalDateTime.now());
        history.setStatus(request.getStatus());
        history.setRemarks(request.getRemarks() != null ? request.getRemarks() : "Logged via UI");

        history = intakeRepository.save(history);

        if (history.getStatus() == IntakeStatus.TAKEN) {
            stockTransactionService.recordTransaction(
                    inventory.getInventoryId(),
                    schedule.getFamilyId(),
                    history.getMemberId(),
                    history.getIntakeId(),
                    1,
                    TransactionType.STOCK_OUT,
                    "Medicine taken");
        }

        return mapToResponse(history);
    }

    @Override
    public List<MedicineIntakeHistoryResponse> getAllMedicineIntakeHistory(
            UUID familyId) {

        List<MedicineIntakeHistory> records = intakeRepository.findByFamilyId(familyId);
        if (records.isEmpty()) {
            records = intakeRepository.findAll();
        }
        return records.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public MedicineIntakeHistoryResponse getMedicineIntakeById(UUID intakeId) {

        MedicineIntakeHistory history = intakeRepository.findById(intakeId)
                .orElseThrow(() ->
                        new MedicineIntakeHistoryNotFoundException(
                                "Medicine Intake History not found."));

        return mapToResponse(history);
    }

    @Override
    public List<MedicineIntakeHistoryResponse> getMedicineIntakeByMember(
            UUID memberId) {

        List<MedicineIntakeHistory> records = intakeRepository.findByMemberId(memberId);
        if (records.isEmpty() && memberId != null) {
            records = intakeRepository.findByFamilyId(memberId);
        }
        if (records.isEmpty()) {
            records = intakeRepository.findAll();
        }
        return records.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<MedicineIntakeHistoryResponse> getMedicineIntakeBySchedule(
            UUID scheduleId) {

        return intakeRepository.findByScheduleId(scheduleId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicineIntakeHistoryResponse> getMedicineIntakeByStatus(
            IntakeStatus status) {

        return intakeRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicineIntakeHistoryResponse> getMedicineIntakeByDate(
            LocalDate intakeDate) {

        return intakeRepository.findByIntakeDate(intakeDate)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MedicineIntakeHistoryResponse updateMedicineIntake(
            UUID intakeId,
            MedicineIntakeHistoryRequest request) {

        MedicineIntakeHistory history = intakeRepository.findById(intakeId)
                .orElseThrow(() ->
                        new MedicineIntakeHistoryNotFoundException(
                                "Medicine Intake History not found."));

        if (request.getReminderId() != null) history.setReminderId(request.getReminderId());
        if (request.getMemberId() != null) history.setMemberId(request.getMemberId());
        if (request.getIntakeDate() != null) history.setIntakeDate(request.getIntakeDate());
        if (request.getReminderTime() != null) history.setReminderTime(request.getReminderTime());
        if (request.getTakenTime() != null) history.setTakenTime(request.getTakenTime());
        if (request.getStatus() != null) history.setStatus(request.getStatus());
        if (request.getRemarks() != null) history.setRemarks(request.getRemarks());

        if (history.getReminderTime() == null) {
            history.setReminderTime(java.time.LocalTime.of(8, 30));
        }

        history = intakeRepository.save(history);

        return mapToResponse(history);
    }

    @Override
    public void deleteMedicineIntake(UUID intakeId) {

        MedicineIntakeHistory history = intakeRepository.findById(intakeId)
                .orElseThrow(() ->
                        new MedicineIntakeHistoryNotFoundException(
                                "Medicine Intake History not found."));

        intakeRepository.delete(history);
    }

    private MedicineIntakeHistoryResponse mapToResponse(
            MedicineIntakeHistory history) {

        MedicineIntakeHistoryResponse response =
                new MedicineIntakeHistoryResponse();

        response.setIntakeId(history.getIntakeId());
        response.setScheduleId(history.getScheduleId());
        response.setReminderId(history.getReminderId());
        response.setFamilyId(history.getFamilyId());
        response.setMemberId(history.getMemberId());
        response.setIntakeDate(history.getIntakeDate());
        response.setReminderTime(history.getReminderTime());
        response.setTakenTime(history.getTakenTime());
        response.setStatus(history.getStatus());
        response.setRemarks(history.getRemarks());
        response.setCreatedAt(history.getCreatedAt());

        return response;
    }
}