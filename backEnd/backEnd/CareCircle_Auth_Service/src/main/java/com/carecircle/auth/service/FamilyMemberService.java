package com.carecircle.auth.service;

import java.util.List;
import java.util.UUID;

import com.carecircle.auth.dto.request.MemberRequest;
import com.carecircle.auth.dto.request.UpdateMemberRequest;
import com.carecircle.auth.dto.response.MemberResponse;

public interface FamilyMemberService {

    MemberResponse addMember(String mobileNumber,
                             MemberRequest request);

    List<MemberResponse> getAllMembers(String mobileNumber);

    MemberResponse updateMember(String mobileNumber,
                                UUID memberId,
                                UpdateMemberRequest request);

    void deleteMember(String mobileNumber,
                      UUID memberId);

}