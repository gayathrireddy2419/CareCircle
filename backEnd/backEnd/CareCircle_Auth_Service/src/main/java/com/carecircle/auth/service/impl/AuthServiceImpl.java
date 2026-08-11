package com.carecircle.auth.service.impl;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carecircle.auth.dto.request.HeadRegistrationRequest;
import com.carecircle.auth.dto.request.LoginRequest;
import com.carecircle.auth.dto.response.AuthResponse;
import com.carecircle.auth.dto.response.InternalUserResponse;
import com.carecircle.auth.entity.Family;
import com.carecircle.auth.entity.Role;
import com.carecircle.auth.entity.User;
import com.carecircle.auth.exception.FamilyAlreadyExistsException;
import com.carecircle.auth.exception.InvalidCredentialsException;
import com.carecircle.auth.exception.UserAlreadyExistsException;
import com.carecircle.auth.exception.UserNotFoundException;
import com.carecircle.auth.repository.FamilyRepository;
import com.carecircle.auth.repository.UserRepository;
import com.carecircle.auth.security.JwtService;
import com.carecircle.auth.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository,
                           FamilyRepository familyRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {

        this.userRepository = userRepository;
        this.familyRepository = familyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public AuthResponse registerHead(HeadRegistrationRequest request) {

        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new UserAlreadyExistsException(
                    "Mobile number already registered.");
        }

        if (familyRepository.existsByFamilyName(request.getFamilyName())) {
            throw new FamilyAlreadyExistsException(
                    "Family name already exists.");
        }

        Family family = new Family();
        family.setFamilyName(request.getFamilyName());

        family = familyRepository.save(family);

        User head = new User();

        head.setName(request.getName());
        head.setMobileNumber(request.getMobileNumber());

        head.setPassword(
                passwordEncoder.encode(request.getPassword()));

        head.setRole(Role.HEAD);
        head.setFamily(family);

        head = userRepository.save(head);

        String token = jwtService.generateToken(
                head.getMobileNumber(),
                head.getUserId(),
                family.getFamilyId(),
                head.getRole());

        return new AuthResponse(
                token,
                head.getUserId(),
                family.getFamilyId(),
                head.getName(),
                head.getRole());
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByMobileNumber(request.getMobileNumber())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid mobile number or password."));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new InvalidCredentialsException(
                    "Invalid mobile number or password.");
        }

        String token = jwtService.generateToken(
                user.getMobileNumber(),
                user.getUserId(),
                user.getFamily().getFamilyId(),
                user.getRole());

        return new AuthResponse(
                token,
                user.getUserId(),
                user.getFamily().getFamilyId(),
                user.getName(),
                user.getRole());
    }

   
    // Internal APIs
  

    @Override
    public InternalUserResponse getInternalUser(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                new UserNotFoundException("User not found."));

        return new InternalUserResponse(
                user.getUserId(),
                user.getFamily().getFamilyId(),
                user.getName(),
                user.getMobileNumber(),
                user.getRole()
        );
    }

    @Override
    public String getMobileNumber(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        return user.getMobileNumber();
    }
}