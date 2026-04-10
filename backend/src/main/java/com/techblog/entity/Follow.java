package com.techblog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "follows")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // follower
    @ManyToOne
    @JoinColumn(name = "follower_id")
    private User follower;

    // following
    @ManyToOne
    @JoinColumn(name = "following_id")
    private User following;
}