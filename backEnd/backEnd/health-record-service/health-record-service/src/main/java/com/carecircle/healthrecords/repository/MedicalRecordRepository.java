package com.carecircle.healthrecords.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.carecircle.healthrecords.document.MedicalRecord;

@Repository
public interface MedicalRecordRepository
        extends MongoRepository<MedicalRecord, String> {

}