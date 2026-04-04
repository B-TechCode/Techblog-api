package com.techblog.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;

public class JwtUtil {

    // 🔐 Strong secret key (must be at least 32+ chars)
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(
            "mysecretkeymysecretkeymysecretkey12345".getBytes()
    );

    // ⏳ Token validity (1 hour)
    private static final long EXPIRATION_TIME = 1000 * 60 * 60;

    // ✅ Generate Token
    public static String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    // ✅ Extract Email (Subject)
    public static String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // ✅ Extract Expiration Date
    public static Date extractExpiration(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
    }

    // ✅ Check if token expired
    public static boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ✅ Validate Token (🔥 THIS FIXES YOUR ERROR)
    public static boolean validateToken(String token) {
        try {
            return extractEmail(token) != null && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}