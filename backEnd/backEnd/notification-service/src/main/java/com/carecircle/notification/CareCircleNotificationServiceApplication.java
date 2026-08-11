package com.carecircle.notification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CareCircleNotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CareCircleNotificationServiceApplication.class, args);
    }

}