package com.carecircle.emergency.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.carecircle.emergency.entity.Hospital;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

}