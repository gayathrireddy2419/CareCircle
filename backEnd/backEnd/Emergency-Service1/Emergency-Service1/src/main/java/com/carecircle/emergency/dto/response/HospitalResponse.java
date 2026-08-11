package com.carecircle.emergency.dto.response;

public class HospitalResponse {

    private String name;
    private String address;
    private String phone;
    private Double rating;
    private Double latitude;
    private Double longitude;
    private Double distance;
    private String navigationLink;

    public HospitalResponse() {
    }

    public HospitalResponse(String name, String address, String phone,
                            Double rating, Double latitude,
                            Double longitude, Double distance,
                            String navigationLink) {

        this.name = name;
        this.address = address;
        this.phone = phone;
        this.rating = rating;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distance = distance;
        this.navigationLink = navigationLink;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public String getNavigationLink() {
        return navigationLink;
    }

    public void setNavigationLink(String navigationLink) {
        this.navigationLink = navigationLink;
    }
}