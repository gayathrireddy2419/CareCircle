package com.carecircle.healthmetrics.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.carecircle.healthmetrics.dto.request.HealthMetricRequest;
import com.carecircle.healthmetrics.dto.response.HealthMetricResponse;

public interface HealthMetricService {

    HealthMetricResponse addHealthMetric(HealthMetricRequest request);

    HealthMetricResponse updateHealthMetric(UUID metricId,
                                            HealthMetricRequest request);

    HealthMetricResponse getHealthMetricById(UUID metricId);

    List<HealthMetricResponse> getMemberHealthMetrics(UUID memberId);

    List<HealthMetricResponse> getFamilyHealthMetrics(UUID familyId);

    List<HealthMetricResponse> getHealthMetricsBetweenDates(
            UUID memberId,
            LocalDateTime startDate,
            LocalDateTime endDate);

    void deleteHealthMetric(UUID metricId);

}