package com.carecircle.healthrecords.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.carecircle.healthrecords.dto.request.NotificationRequest;

@FeignClient(name = "NOTIFICATION-SERVICE")
public interface NotificationFeignClient {

    @PostMapping("/internal/notifications/send")
    void sendNotification(
            @RequestBody NotificationRequest request);
}