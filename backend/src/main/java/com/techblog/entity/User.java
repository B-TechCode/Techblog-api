package com.techblog.entity;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    // ✅ PASSWORD HIDDEN
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    private String gender;

    private String about;

    private String resetOtp;

    private LocalDateTime resetOtpExpiry;

    private Boolean isVerified;

    // ✅ OTP HIDDEN
    @JsonIgnore
    private String otp;

    @JsonIgnore
    private LocalDateTime otpExpiry;

    // ✅ PROFILE IMAGE
    private String profilePic;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // ================= POSTS =================

    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JsonIgnore
    @ToString.Exclude
    private List<Post> posts;

    // ================= LIKES =================

    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JsonIgnore
    @ToString.Exclude
    private List<Like> likes;

    // ✅ VERY IMPORTANT (MISSING)

    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JsonIgnore
    @ToString.Exclude
    private List<Comment> comments;

    // ================= AUTO TIME =================

    @PrePersist
    public void prePersist() {

        this.createdAt = LocalDateTime.now();

        // ✅ DEFAULT VERIFIED FALSE
        if (this.isVerified == null) {
            this.isVerified = false;
        }
    }
}