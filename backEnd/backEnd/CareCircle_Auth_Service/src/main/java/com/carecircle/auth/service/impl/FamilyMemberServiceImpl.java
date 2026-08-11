package com.carecircle.auth.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.carecircle.auth.dto.request.MemberRequest;
import com.carecircle.auth.dto.request.UpdateMemberRequest;
import com.carecircle.auth.dto.response.MemberResponse;
import com.carecircle.auth.entity.Role;
import com.carecircle.auth.entity.User;
import com.carecircle.auth.exception.InvalidCredentialsException;
import com.carecircle.auth.exception.ResourceNotFoundException;
import com.carecircle.auth.exception.UserAlreadyExistsException;
import com.carecircle.auth.repository.UserRepository;
import com.carecircle.auth.service.FamilyMemberService;

@Service
public class FamilyMemberServiceImpl implements FamilyMemberService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public FamilyMemberServiceImpl(UserRepository userRepository,
                                   PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public MemberResponse addMember(String mobileNumber,
                                    MemberRequest request) {

        User loggedInUser = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (loggedInUser.getRole() != Role.HEAD) {
            throw new InvalidCredentialsException(
                    "Only family head can add members.");
        }

        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new UserAlreadyExistsException(
                    "Mobile number already exists.");
        }

        User member = new User();

        member.setName(request.getName());
        member.setMobileNumber(request.getMobileNumber());
        member.setPassword(passwordEncoder.encode(request.getPassword()));
        member.setRole(Role.MEMBER);
        member.setFamily(loggedInUser.getFamily());

        member = userRepository.save(member);

        return mapToResponse(member);
    }

    @Override
    public List<MemberResponse> getAllMembers(String mobileNumber) {

        User loggedInUser = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return userRepository
                .findByFamily_FamilyId(loggedInUser.getFamily().getFamilyId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MemberResponse updateMember(String mobileNumber,
                                       UUID memberId,
                                       UpdateMemberRequest request) {

        User loggedInUser = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        User member = userRepository.findById(memberId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Member not found"));

        if (!member.getFamily().getFamilyId()
                .equals(loggedInUser.getFamily().getFamilyId())) {

            throw new InvalidCredentialsException(
                    "Member does not belong to your family.");
        }

        // Allow Head users to update their details, only block non-head from editing another head
        if (member.getRole() == Role.HEAD && !loggedInUser.getUserId().equals(member.getUserId()) && loggedInUser.getRole() != Role.HEAD) {
            throw new InvalidCredentialsException(
                    "Only Head can update Head details.");
        }

        if (!member.getMobileNumber()
                .equals(request.getMobileNumber())
                && userRepository.existsByMobileNumber(request.getMobileNumber())) {

            throw new UserAlreadyExistsException(
                    "Mobile number already exists.");
        }

        member.setName(request.getName());
        member.setMobileNumber(request.getMobileNumber());

        member = userRepository.save(member);

        return mapToResponse(member);
    }

    @Override
    public void deleteMember(String mobileNumber,
                             UUID memberId) {

        User loggedInUser = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (loggedInUser.getRole() != Role.HEAD) {
            throw new InvalidCredentialsException(
                    "Only family head can delete members.");
        }

        User member = userRepository.findById(memberId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Member not found"));

        if (!member.getFamily().getFamilyId()
                .equals(loggedInUser.getFamily().getFamilyId())) {

            throw new InvalidCredentialsException(
                    "Member does not belong to your family.");
        }

        if (member.getRole() == Role.HEAD) {
            throw new InvalidCredentialsException(
                    "Head cannot be deleted.");
        }

        userRepository.delete(member);
    }

    private MemberResponse mapToResponse(User user) {

        return new MemberResponse(
                user.getUserId(),
                user.getName(),
                user.getMobileNumber(),
                user.getRole()
        );
    }
}