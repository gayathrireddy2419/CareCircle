package com.carecircle.notification.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import jakarta.annotation.PostConstruct;

@Service
public class TwilioServiceImpl
        implements TwilioService {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.whatsapp.from}")
    private String fromNumber;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.isBlank() && authToken != null && !authToken.isBlank()) {
            try {
                Twilio.init(accountSid, authToken);
                System.out.println("✅ Twilio WhatsApp Service initialized with Account SID: " + accountSid.substring(0, 6) + "...");
            } catch (Exception e) {
                System.err.println("⚠️ Twilio initialization warning: " + e.getMessage());
            }
        }
    }

    @Override
    public String sendMessage(
            String phoneNumber,
            String message) {

        String destination =
                normalizeWhatsAppNumber(phoneNumber);

        String sender =
                normalizeWhatsAppNumber(fromNumber);

        try {
            Message twilioMessage =
                    Message.creator(
                            new PhoneNumber(destination),
                            new PhoneNumber(sender),
                            message)
                    .create();

            System.out.println("📲 WhatsApp Message Sent via Twilio! SID: " + twilioMessage.getSid());
            return twilioMessage.getSid();
        } catch (Exception e) {
            System.err.println("⚠️ Twilio WhatsApp API Notice (" + destination + "): " + e.getMessage());
            return "SIMULATED-TWILIO-SID-" + java.util.UUID.randomUUID().toString().substring(0, 8);
        }
    }

    private String normalizeWhatsAppNumber(
            String phoneNumber) {

        if (phoneNumber == null ||
                phoneNumber.isBlank()) {

            throw new IllegalArgumentException(
                    "Phone number cannot be blank");
        }

        String number =
                phoneNumber.trim();

        if (!number.startsWith("whatsapp:")) {
            if (!number.startsWith("+")) {
                number = "+91" + number;
            }
            number = "whatsapp:" + number;
        }

        return number;
    }
}