package com.carecircle.healthrecords.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.carecircle.healthrecords.document.MedicalRecord;
import com.carecircle.healthrecords.document.RecordCategory;

@Repository
public interface MedicalRecordRepository extends MongoRepository<MedicalRecord, UUID> {

    // All records belonging to a family
    List<MedicalRecord> findByFamilyId(UUID familyId);

    // All records belonging to a member
    List<MedicalRecord> findByMemberId(UUID memberId);

    // Records of a particular category
    List<MedicalRecord> findByCategory(RecordCategory category);

    // Records for a member filtered by category
    List<MedicalRecord> findByMemberIdAndCategory(UUID memberId, RecordCategory category);

    // Active records for a member
    List<MedicalRecord> findByMemberIdAndActiveTrue(UUID memberId);

    // Active records for a family
    List<MedicalRecord> findByFamilyIdAndActiveTrue(UUID familyId);

}