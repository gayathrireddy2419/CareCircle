package com.carecircle.healthmetrics.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.carecircle.healthmetrics.entity.HealthMetric;

@Repository
public interface HealthMetricRepository
        extends JpaRepository<HealthMetric, UUID> {

    /**
     * Find an active health metric by Metric ID.
     */
    Optional<HealthMetric> findByMetricIdAndActive(
            UUID metricId,
            Boolean active);

    /**
     * Get all active health metrics of a member.
     */
    List<HealthMetric> findByMemberIdAndActiveOrderByRecordedAtDesc(
            UUID memberId,
            Boolean active);

    /**
     * Get all active health metrics of a family.
     */
    List<HealthMetric> findByFamilyIdAndActiveOrderByRecordedAtDesc(
            UUID familyId,
            Boolean active);

    /**
     * Get metrics of a member within a date range.
     */
    List<HealthMetric> findByMemberIdAndRecordedAtBetweenAndActiveOrderByRecordedAtDesc(
            UUID memberId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Boolean active);

}