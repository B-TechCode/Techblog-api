package com.techblog.entity;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    // ✅ FIXED PASSWORD FIELD
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // 🔥 Accept in request, hide in response
    @Column(nullable = false)
    private String password;

    private String gender;

    private String about;

    // ✅ EMAIL VERIFICATION
    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified;

    // ✅ OTP SYSTEM
    @JsonIgnore   // 🔥 Hide OTP from API response
    private String otp;

    @JsonIgnore
    private LocalDateTime otpExpiry;

    // ✅ PROFILE IMAGE
    @Column(name = "profile_pic")
    private String profilePic;

    // ✅ CREATED TIME
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ✅ AUTO SET CREATED TIME
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}