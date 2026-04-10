package com.techblog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String message;

    private LocalDateTime createdAt;

    @ManyToOne
    private User user;

    @PrePersist
    public void time() {
        createdAt = LocalDateTime.now();
    }
}