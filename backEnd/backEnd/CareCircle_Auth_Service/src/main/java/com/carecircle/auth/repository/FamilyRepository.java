package com.carecircle.auth.repository;



import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.carecircle.auth.entity.Family;

@Repository
public interface FamilyRepository extends JpaRepository<Family, UUID> {

    Optional<Family> findByFamilyName(String familyName);

    boolean existsByFamilyName(String familyName);

}
