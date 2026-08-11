package com.carecircle.emergency;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class EmergencyService1Application {

    public static void main(String[] args) {
        SpringApplication.run(EmergencyService1Application.class, args);
    }

}