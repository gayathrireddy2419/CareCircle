package com.carecircle.healthrecords;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class HealthRecordServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                HealthRecordServiceApplication.class,
                args);
    }
}