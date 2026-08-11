package com.carecircle.healthrecords.security;

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

    private Key getSigningKey() {

        return Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public Claims extractAllClaims(String token) {

        return Jwts.parser()

                .verifyWith((SecretKey) getSigningKey())

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }

    public boolean isTokenValid(String token) {

        try {

            extractAllClaims(token);

            return true;

        } catch (Exception ex) {

            return false;
        }
    }

    public String extractUserId(String token) {

        return extractAllClaims(token)

                .get("userId", String.class);
    }

    public String extractFamilyId(String token) {

        return extractAllClaims(token)

                .get("familyId", String.class);
    }

    public String extractRole(String token) {

        return extractAllClaims(token)

                .get("role", String.class);
    }

}