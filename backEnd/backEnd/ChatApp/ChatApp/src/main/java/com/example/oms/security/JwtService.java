package com.example.oms.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    /**
     * Validate JWT Token.
     */
    public boolean isTokenValid(String token) {

        try {

            extractAllClaims(token);

            System.out.println("JWT VALID");

            return true;

        } catch (Exception ex) {

            System.out.println("JWT INVALID");
            ex.printStackTrace();

            return false;
        }
    }
    /**
     * Extract all claims.
     */
    public Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith((SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extract username (mobile number).
     */
    public String extractUsername(String token) {

        return extractAllClaims(token).getSubject();
    }

    /**
     * Extract User ID.
     */
    public String extractUserId(String token) {

        return extractAllClaims(token)
                .get("userId", String.class);
    }

    /**
     * Extract Family ID.
     */
    public String extractFamilyId(String token) {

        return extractAllClaims(token)
                .get("familyId", String.class);
    }

    /**
     * Extract Role.
     */
    public String extractRole(String token) {

        return extractAllClaims(token)
                .get("role", String.class);
    }

    /**
     * Signing Key.
     */
    private Key getSigningKey() {

        return Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8));
    }

}