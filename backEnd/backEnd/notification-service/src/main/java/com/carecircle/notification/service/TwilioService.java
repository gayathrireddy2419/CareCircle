package com.carecircle.notification.service;

public interface TwilioService {

    String sendMessage(
            String phoneNumber,
            String message);
}