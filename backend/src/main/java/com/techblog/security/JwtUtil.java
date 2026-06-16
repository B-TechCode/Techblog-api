package com.techblog.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component  // ✅ Now injectable
public class JwtUtil {

    // 🔐 Secret key from properties
    @Value("${jwt.secret}")
    private String secret;

    // ⏳ Token validity (1 hour)
    private static final long EXPIRATION_TIME = 1000 * 60 * 60;

    // 🔑 Generate key dynamically
    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // ✅ Generate Token
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getKey())
                .compact();
    }

    // ✅ Extract Email
    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // ✅ Extract Expiration
    public Date extractExpiration(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
    }

    // ✅ Check expiry
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ✅ Validate Token
    public boolean validateToken(String token) {
        try {
            return extractEmail(token) != null && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}