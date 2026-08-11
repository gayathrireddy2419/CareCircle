package com.carecircle.emergency.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class OSMService {

    private final RestTemplate restTemplate;

    public OSMService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getNearbyHospitals(double lat, double lon) {

//    	String overpassQuery =
//    		    "[out:json][timeout:10];" +
//    		    "(" +
//    		    "node[amenity=hospital](around:1000," + lat + "," + lon + ");" +
//    		    "way[amenity=hospital](around:1000," + lat + "," + lon + ");" +
//    		    "relation[amenity=hospital](around:1000," + lat + "," + lon + ");" +
//    		    ");" +
//    		    "out center tags 5;";
//    	String overpassQuery =
//    	        "[out:json][timeout:10];" +
//    	        "node[amenity=hospital](around:1000," + lat + "," + lon + ");" +
//    	        "out body;";
    	String overpassQuery =
    	        "[out:json][timeout:10];" +
    	        "(" +
    	        "node[amenity=hospital](around:3000," + lat + "," + lon + ");" +
    	        "way[amenity=hospital](around:3000," + lat + "," + lon + ");" +
    	        ");" +
    	        "out center;";

//        String url = "https://overpass-api.de/api/interpreter";
        String url = "https://overpass.kumi.systems/api/interpreter";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("data", overpassQuery);

        HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(body, headers);

        return restTemplate.postForObject(url, request, String.class);
    }
}