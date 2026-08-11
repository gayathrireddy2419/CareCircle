package com.carecircle.medicine.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.carecircle.medicine.dto.request.NotificationRequest;
import com.carecircle.medicine.dto.response.NotificationResponse;

@FeignClient(name = "notification-service")
public interface NotificationFeignClient {

    @PostMapping("/internal/notifications/send")
    void sendNotification(
            @RequestBody NotificationRequest request);

}