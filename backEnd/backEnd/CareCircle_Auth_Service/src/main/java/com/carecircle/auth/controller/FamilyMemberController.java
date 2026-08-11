package com.carecircle.auth.controller;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.carecircle.auth.dto.request.MemberRequest;
import com.carecircle.auth.dto.request.UpdateMemberRequest;
import com.carecircle.auth.dto.response.MemberResponse;
import com.carecircle.auth.service.FamilyMemberService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/family/members")
@Validated
public class FamilyMemberController {

    private final FamilyMemberService familyMemberService;

    public FamilyMemberController(FamilyMemberService familyMemberService) {
        this.familyMemberService = familyMemberService;
    }

    @PostMapping
    public ResponseEntity<MemberResponse> addMember(
            Principal principal,
            @Valid @RequestBody MemberRequest request) {

        return new ResponseEntity<>(
                familyMemberService.addMember(
                        principal.getName(),
                        request),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MemberResponse>> getMembers(
            Principal principal) {

        return ResponseEntity.ok(
                familyMemberService.getAllMembers(
                        principal.getName()));
    }

    @PutMapping("/{memberId}")
    public ResponseEntity<MemberResponse> updateMember(
            Principal principal,
            @PathVariable UUID memberId,
            @Valid @RequestBody UpdateMemberRequest request) {

        return ResponseEntity.ok(
                familyMemberService.updateMember(
                        principal.getName(),
                        memberId,
                        request));
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> deleteMember(
            Principal principal,
            @PathVariable UUID memberId) {

        familyMemberService.deleteMember(
                principal.getName(),
                memberId);

        return ResponseEntity.noContent().build();
    }
}