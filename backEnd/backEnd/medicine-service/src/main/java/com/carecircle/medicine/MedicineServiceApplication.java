package com.carecircle.medicine;

import org.springframework.boot.SpringApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;


@EnableFeignClients
@SpringBootApplication
@EnableScheduling
@EnableDiscoveryClient
public class MedicineServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedicineServiceApplication.class, args);
	}

}
