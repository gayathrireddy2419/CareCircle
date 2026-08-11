package com.carecircle.medicine.serviceimpl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.carecircle.medicine.client.AuthFeignClient;
import com.carecircle.medicine.dto.request.MedicationScheduleRequest;
import com.carecircle.medicine.dto.response.InternalUserResponse;
import com.carecircle.medicine.dto.response.MedicationScheduleResponse;
import com.carecircle.medicine.entity.MedicationSchedule;
import com.carecircle.medicine.exception.MedicationScheduleNotFoundException;
import com.carecircle.medicine.repository.MedicationScheduleRepository;
import com.carecircle.medicine.service.MedicationScheduleService;

@Service
public class MedicationScheduleServiceImpl implements MedicationScheduleService {

    private final MedicationScheduleRepository repository;
    private final AuthFeignClient authFeignClient;

    public MedicationScheduleServiceImpl(
            MedicationScheduleRepository repository,
            AuthFeignClient authFeignClient) {

        this.repository = repository;
        this.authFeignClient = authFeignClient;
    }

    @Override
    public MedicationScheduleResponse createMedicationSchedule(MedicationScheduleRequest request) {

        // Validate member with Authentication Service if available
        try {
            InternalUserResponse user = authFeignClient.getInternalUser(request.getMemberId());
            if (user != null && user.getFamilyId() != null && request.getFamilyId() != null) {
                if (!user.getFamilyId().equals(request.getFamilyId())) {
                    System.err.println("Selected member familyId does not match request familyId.");
                }
            }
        } catch (Exception e) {
            System.err.println("Could not validate member via AuthFeignClient: " + e.getMessage());
        }

        MedicationSchedule schedule = new MedicationSchedule();

        schedule.setFamilyId(request.getFamilyId());
        schedule.setMemberId(request.getMemberId());
        schedule.setInventoryId(request.getInventoryId());
        schedule.setDosage(request.getDosage());
        schedule.setFrequency(request.getFrequency());
        schedule.setBeforeFood(request.getBeforeFood());
        schedule.setStartDate(request.getStartDate());
        schedule.setEndDate(request.getEndDate());
        schedule.setInstructions(request.getInstructions());
        schedule.setStatus(request.getStatus());

        MedicationSchedule saved = repository.save(schedule);

        return mapToResponse(saved);
    }

    @Override
    public MedicationScheduleResponse updateMedicationSchedule(
            UUID scheduleId,
            MedicationScheduleRequest request) {

        // Validate member with Authentication Service if available
        try {
            InternalUserResponse user = authFeignClient.getInternalUser(request.getMemberId());
            if (user != null && user.getFamilyId() != null && request.getFamilyId() != null) {
                if (!user.getFamilyId().equals(request.getFamilyId())) {
                    System.err.println("Selected member familyId does not match request familyId.");
                }
            }
        } catch (Exception e) {
            System.err.println("Could not validate member via AuthFeignClient: " + e.getMessage());
        }

        MedicationSchedule schedule = repository.findById(scheduleId)
                .orElseThrow(() ->
                        new MedicationScheduleNotFoundException(
                                "Medication Schedule not found with ID: " + scheduleId));

        schedule.setFamilyId(request.getFamilyId());
        schedule.setMemberId(request.getMemberId());
        schedule.setInventoryId(request.getInventoryId());
        schedule.setDosage(request.getDosage());
        schedule.setFrequency(request.getFrequency());
        schedule.setBeforeFood(request.getBeforeFood());
        schedule.setStartDate(request.getStartDate());
        schedule.setEndDate(request.getEndDate());
        schedule.setInstructions(request.getInstructions());
        schedule.setStatus(request.getStatus());

        MedicationSchedule updated = repository.save(schedule);

        return mapToResponse(updated);
    }

    @Override
    public void deleteMedicationSchedule(UUID scheduleId) {

        MedicationSchedule schedule = repository.findById(scheduleId)
                .orElseThrow(() ->
                        new MedicationScheduleNotFoundException(
                                "Medication Schedule not found with ID: " + scheduleId));

        repository.delete(schedule);
    }

    @Override
    public MedicationScheduleResponse getMedicationScheduleById(UUID scheduleId) {

        MedicationSchedule schedule = repository.findById(scheduleId)
                .orElseThrow(() ->
                        new MedicationScheduleNotFoundException(
                                "Medication Schedule not found with ID: " + scheduleId));

        return mapToResponse(schedule);
    }

    @Override
    public List<MedicationScheduleResponse> getMedicationSchedulesByMemberId(UUID memberId) {

        return repository.findByMemberId(memberId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationScheduleResponse> getMedicationSchedulesByFamilyId(UUID familyId) {

        return repository.findByFamilyId(familyId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MedicationScheduleResponse mapToResponse(MedicationSchedule schedule) {

        MedicationScheduleResponse response = new MedicationScheduleResponse();

        response.setScheduleId(schedule.getScheduleId());
        response.setFamilyId(schedule.getFamilyId());
        response.setMemberId(schedule.getMemberId());
        response.setInventoryId(schedule.getInventoryId());
        response.setDosage(schedule.getDosage());
        response.setFrequency(schedule.getFrequency());
        response.setBeforeFood(schedule.getBeforeFood());
        response.setStartDate(schedule.getStartDate());
        response.setEndDate(schedule.getEndDate());
        response.setInstructions(schedule.getInstructions());
        response.setStatus(schedule.getStatus());
        response.setCreatedAt(schedule.getCreatedAt());
        response.setUpdatedAt(schedule.getUpdatedAt());

        return response;
    }
}