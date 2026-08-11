package com.carecircle.auth.repository;



import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.carecircle.auth.entity.Role;
import com.carecircle.auth.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByMobileNumber(String mobileNumber);

    boolean existsByMobileNumber(String mobileNumber);

    List<User> findByFamily_FamilyId(UUID familyId);

    List<User> findByFamily_FamilyIdAndRole(UUID familyId, Role role);

}