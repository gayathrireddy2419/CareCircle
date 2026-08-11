package com.carecircle.emergency.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.carecircle.emergency.Util.DistanceUtil;
import com.carecircle.emergency.client.AuthFeignClient;
import com.carecircle.emergency.dto.Center;
import com.carecircle.emergency.dto.Element;
import com.carecircle.emergency.dto.Tags;
import com.carecircle.emergency.dto.response.HospitalResponse;
import com.carecircle.emergency.dto.response.InternalUserResponse;
import com.carecircle.emergency.dto.response.OverpassResponse;
import com.carecircle.emergency.entity.Hospital;
import com.carecircle.emergency.repository.HospitalRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EmergencyService {

    private final OSMService osmService;
    private final HospitalRepository hospitalRepository;
    private final AuthFeignClient authFeignClient;

    public EmergencyService(OSMService osmService,
                            HospitalRepository hospitalRepository,
                            AuthFeignClient authFeignClient) {

        this.osmService = osmService;
        this.hospitalRepository = hospitalRepository;
        this.authFeignClient = authFeignClient;
    }

    public List<HospitalResponse> getNearbyHospitals(UUID userId,
                                                     double lat,
                                                     double lon) {

        List<HospitalResponse> hospitals = new ArrayList<>();

        try {

            /*
             * Validate user with Authentication Service
             */
            InternalUserResponse user =
                    authFeignClient.getInternalUser(userId);

            if (user == null) {
                throw new RuntimeException("User not found.");
            }

            /*
             * Fetch nearby hospitals from OpenStreetMap
             */
            String jsonResponse =
                    osmService.getNearbyHospitals(lat, lon);

            ObjectMapper mapper = new ObjectMapper();

            OverpassResponse response =
                    mapper.readValue(jsonResponse,
                            OverpassResponse.class);

            if (response.getElements() == null) {
                return hospitals;
            }

            for (Element element : response.getElements()) {

                HospitalResponse hospital = new HospitalResponse();

                Tags tags = element.getTags();

                if (tags != null) {

                    hospital.setName(
                            tags.getName() != null
                                    ? tags.getName()
                                    : "Unknown Hospital");

                    hospital.setAddress(
                            tags.getAddress() != null
                                    ? tags.getAddress()
                                    : "Address Not Available");

                    hospital.setPhone(
                            tags.getPhone() != null
                                    ? tags.getPhone()
                                    : "Not Available");
                }

                double hospitalLat;
                double hospitalLon;

                if (element.getLat() != 0 &&
                        element.getLon() != 0) {

                    hospitalLat = element.getLat();
                    hospitalLon = element.getLon();

                } else {

                    Center center = element.getCenter();

                    if (center == null) {
                        continue;
                    }

                    hospitalLat = center.getLat();
                    hospitalLon = center.getLon();
                }

                hospital.setLatitude(hospitalLat);
                hospital.setLongitude(hospitalLon);

                double distance =
                        DistanceUtil.calculateDistance(
                                lat,
                                lon,
                                hospitalLat,
                                hospitalLon);

                hospital.setDistance(distance);

                hospital.setNavigationLink(
                        "https://www.google.com/maps?q="
                                + hospitalLat
                                + ","
                                + hospitalLon);

                if (distance <= 2.0) {

                    Hospital entity = new Hospital();

                    entity.setName(hospital.getName());
                    entity.setAddress(hospital.getAddress());
                    entity.setPhone(hospital.getPhone());
                    entity.setLatitude(hospitalLat);
                    entity.setLongitude(hospitalLon);
                    entity.setDistance(distance);
                    entity.setNavigationLink(
                            hospital.getNavigationLink());

                    hospitalRepository.save(entity);

                    hospitals.add(hospital);
                }
            }

            hospitals.sort(
                    Comparator.comparingDouble(
                            HospitalResponse::getDistance));

            if (hospitals.size() > 5) {

                hospitals = new ArrayList<>(
                        hospitals.subList(0, 5));
            }

        } catch (Exception ex) {

            ex.printStackTrace();
        }

        return hospitals;
    }
}