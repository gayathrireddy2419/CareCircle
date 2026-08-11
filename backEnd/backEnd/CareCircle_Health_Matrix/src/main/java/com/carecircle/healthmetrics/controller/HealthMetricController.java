package com.carecircle.healthmetrics.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.carecircle.healthmetrics.dto.request.HealthMetricRequest;
import com.carecircle.healthmetrics.dto.response.ApiResponse;
import com.carecircle.healthmetrics.dto.response.HealthMetricResponse;
import com.carecircle.healthmetrics.service.HealthMetricService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/health-metrics")
@Validated
public class HealthMetricController {

    private final HealthMetricService healthMetricService;

    public HealthMetricController(
            HealthMetricService healthMetricService) {

        this.healthMetricService = healthMetricService;
    }

    /**
     * Add Health Metric
     */
    @PostMapping
    public ResponseEntity<ApiResponse<HealthMetricResponse>> addHealthMetric(
            @Valid @RequestBody HealthMetricRequest request) {

        HealthMetricResponse response =
                healthMetricService.addHealthMetric(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Health metric added successfully.",
                        response));
    }

    /**
     * Update Health Metric
     */
    @PutMapping("/{metricId}")
    public ResponseEntity<ApiResponse<HealthMetricResponse>> updateHealthMetric(
            @PathVariable UUID metricId,
            @Valid @RequestBody HealthMetricRequest request) {

        HealthMetricResponse response =
                healthMetricService.updateHealthMetric(
                        metricId,
                        request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Health metric updated successfully.",
                        response));
    }

    /**
     * Get Health Metric by ID
     */
    @GetMapping("/{metricId}")
    public ResponseEntity<ApiResponse<HealthMetricResponse>> getHealthMetricById(
            @PathVariable UUID metricId) {

        HealthMetricResponse response =
                healthMetricService.getHealthMetricById(metricId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Health metric fetched successfully.",
                        response));
    }

    /**
     * Get Member Health Metrics
     */
    @GetMapping("/member/{memberId}")
    public ResponseEntity<ApiResponse<List<HealthMetricResponse>>> getMemberMetrics(
            @PathVariable UUID memberId) {

        List<HealthMetricResponse> response =
                healthMetricService.getMemberHealthMetrics(memberId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Member health metrics fetched successfully.",
                        response));
    }

    /**
     * Get Family Health Metrics
     */
    @GetMapping("/family/{familyId}")
    public ResponseEntity<ApiResponse<List<HealthMetricResponse>>> getFamilyMetrics(
            @PathVariable UUID familyId) {

        List<HealthMetricResponse> response =
                healthMetricService.getFamilyHealthMetrics(familyId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Family health metrics fetched successfully.",
                        response));
    }

    /**
     * Get Health Metrics Between Dates
     */
    @GetMapping("/member/{memberId}/history")
    public ResponseEntity<ApiResponse<List<HealthMetricResponse>>> getMetricsBetweenDates(
            @PathVariable UUID memberId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {

        List<HealthMetricResponse> response =
                healthMetricService.getHealthMetricsBetweenDates(
                        memberId,
                        startDate,
                        endDate);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Health metrics fetched successfully.",
                        response));
    }

    /**
     * Delete Health Metric (Soft Delete)
     */
    @DeleteMapping("/{metricId}")
    public ResponseEntity<ApiResponse<Void>> deleteHealthMetric(
            @PathVariable UUID metricId) {

        healthMetricService.deleteHealthMetric(metricId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Health metric deleted successfully."));
    }
}