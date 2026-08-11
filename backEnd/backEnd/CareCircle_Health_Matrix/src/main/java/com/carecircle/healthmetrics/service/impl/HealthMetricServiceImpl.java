package com.carecircle.healthmetrics.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.carecircle.healthmetrics.dto.request.HealthMetricRequest;
import com.carecircle.healthmetrics.dto.response.HealthMetricResponse;
import com.carecircle.healthmetrics.entity.HealthMetric;
import com.carecircle.healthmetrics.exception.BadRequestException;
import com.carecircle.healthmetrics.exception.ResourceNotFoundException;
import com.carecircle.healthmetrics.repository.HealthMetricRepository;
import com.carecircle.healthmetrics.service.HealthMetricService;

@Service
public class HealthMetricServiceImpl implements HealthMetricService {

    private final HealthMetricRepository repository;

    public HealthMetricServiceImpl(
            HealthMetricRepository repository) {

        this.repository = repository;
    }

    @Override
    public HealthMetricResponse addHealthMetric(
            HealthMetricRequest request) {

        validateRequest(request);

        HealthMetric metric = new HealthMetric();

        mapRequestToEntity(request, metric);

        metric.setActive(true);

        HealthMetric savedMetric = repository.save(metric);

        return convertToResponse(savedMetric);
    }

    @Override
    public HealthMetricResponse updateHealthMetric(
            UUID metricId,
            HealthMetricRequest request) {

        validateRequest(request);

        HealthMetric metric = repository
                .findByMetricIdAndActive(metricId, true)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Health Metric not found."));

        mapRequestToEntity(request, metric);

        HealthMetric updatedMetric = repository.save(metric);

        return convertToResponse(updatedMetric);
    }

    @Override
    public HealthMetricResponse getHealthMetricById(
            UUID metricId) {

        HealthMetric metric = repository
                .findByMetricIdAndActive(metricId, true)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Health Metric not found."));

        return convertToResponse(metric);
    }

    @Override
    public List<HealthMetricResponse> getMemberHealthMetrics(
            UUID memberId) {

        List<HealthMetric> metrics =
                repository.findByMemberIdAndActiveOrderByRecordedAtDesc(
                        memberId,
                        true);

        List<HealthMetricResponse> responses =
                new ArrayList<>();

        for (HealthMetric metric : metrics) {

            responses.add(convertToResponse(metric));
        }

        return responses;
    }

    @Override
    public List<HealthMetricResponse> getFamilyHealthMetrics(
            UUID familyId) {

        List<HealthMetric> metrics =
                repository.findByFamilyIdAndActiveOrderByRecordedAtDesc(
                        familyId,
                        true);

        List<HealthMetricResponse> responses =
                new ArrayList<>();

        for (HealthMetric metric : metrics) {

            responses.add(convertToResponse(metric));
        }

        return responses;
    }

    @Override
    public List<HealthMetricResponse> getHealthMetricsBetweenDates(
            UUID memberId,
            LocalDateTime startDate,
            LocalDateTime endDate) {

        List<HealthMetric> metrics =
                repository
                        .findByMemberIdAndRecordedAtBetweenAndActiveOrderByRecordedAtDesc(
                                memberId,
                                startDate,
                                endDate,
                                true);

        List<HealthMetricResponse> responses =
                new ArrayList<>();

        for (HealthMetric metric : metrics) {

            responses.add(convertToResponse(metric));
        }

        return responses;
    }

    @Override
    public void deleteHealthMetric(
            UUID metricId) {

        HealthMetric metric = repository
                .findByMetricIdAndActive(metricId, true)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Health Metric not found."));

        metric.setActive(false);

        repository.save(metric);
    }

    /**
     * Validate request.
     */
    private void validateRequest(
            HealthMetricRequest request) {

        if (request.getHeight() != null &&
                request.getHeight().compareTo(BigDecimal.ZERO) <= 0) {

            throw new BadRequestException(
                    "Height must be greater than zero.");
        }

        if (request.getWeight() != null &&
                request.getWeight().compareTo(BigDecimal.ZERO) <= 0) {

            throw new BadRequestException(
                    "Weight must be greater than zero.");
        }

        if (request.getTemperature() != null &&
                request.getTemperature().compareTo(BigDecimal.ZERO) <= 0) {

            throw new BadRequestException(
                    "Temperature must be greater than zero.");
        }

        if (request.getRecordedAt() != null &&
                request.getRecordedAt().isAfter(LocalDateTime.now())) {

            throw new BadRequestException(
                    "Recorded date cannot be in the future.");
        }
    }





/**
 * Maps request DTO to entity.
 */
private void mapRequestToEntity(
        HealthMetricRequest request,
        HealthMetric metric) {

    metric.setFamilyId(request.getFamilyId());
    metric.setMemberId(request.getMemberId());
    metric.setRecordedBy(request.getRecordedBy());

    metric.setHeight(request.getHeight());
    metric.setWeight(request.getWeight());

    metric.setBmi(calculateBMI(
            request.getHeight(),
            request.getWeight()));

    metric.setSystolicBp(request.getSystolicBp());
    metric.setDiastolicBp(request.getDiastolicBp());

    metric.setBloodSugar(request.getBloodSugar());

    metric.setHeartRate(request.getHeartRate());

    metric.setOxygenSaturation(
            request.getOxygenSaturation());

    metric.setTemperature(request.getTemperature());

    metric.setNotes(request.getNotes());

    metric.setRecordedAt(request.getRecordedAt());
}

/**
 * Calculates BMI.
 * Height is expected in centimeters.
 */
private BigDecimal calculateBMI(
        BigDecimal height,
        BigDecimal weight) {

    if (height == null || weight == null) {
        return null;
    }

    if (height.compareTo(BigDecimal.ZERO) <= 0) {
        return null;
    }

    BigDecimal heightInMeters =
            height.divide(
                    BigDecimal.valueOf(100),
                    6,
                    RoundingMode.HALF_UP);

    return weight.divide(
            heightInMeters.multiply(heightInMeters),
            2,
            RoundingMode.HALF_UP);
}

/**
 * Converts entity to response DTO.
 */
private HealthMetricResponse convertToResponse(
        HealthMetric metric) {

    HealthMetricResponse response =
            new HealthMetricResponse();

    response.setMetricId(metric.getMetricId());
    response.setFamilyId(metric.getFamilyId());
    response.setMemberId(metric.getMemberId());
    response.setRecordedBy(metric.getRecordedBy());

    response.setHeight(metric.getHeight());
    response.setWeight(metric.getWeight());
    response.setBmi(metric.getBmi());

    response.setSystolicBp(metric.getSystolicBp());
    response.setDiastolicBp(metric.getDiastolicBp());

    response.setBloodSugar(metric.getBloodSugar());

    response.setHeartRate(metric.getHeartRate());

    response.setOxygenSaturation(
            metric.getOxygenSaturation());

    response.setTemperature(metric.getTemperature());

    response.setNotes(metric.getNotes());

    response.setRecordedAt(metric.getRecordedAt());
    response.setCreatedAt(metric.getCreatedAt());
    response.setUpdatedAt(metric.getUpdatedAt());

    return response;
}

}