package com.carecircle.emergency.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.carecircle.emergency.dto.response.HospitalResponse;
import com.carecircle.emergency.service.EmergencyService;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyController {

    private final EmergencyService emergencyService;

    public EmergencyController(EmergencyService emergencyService) {
        this.emergencyService = emergencyService;
    }

    @GetMapping("/hospitals")
    public List<HospitalResponse> getNearbyHospitals(
            Authentication authentication,
            @RequestParam double lat,
            @RequestParam double lon) {

        UUID userId = UUID.fromString(authentication.getName());

        return emergencyService.getNearbyHospitals(
                userId,
                lat,
                lon);
    }
}