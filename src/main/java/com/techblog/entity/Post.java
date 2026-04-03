package com.techblog.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder   // 🔥 useful for clean object creation
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // ✅ Validation added
    @NotBlank(message = "Title is required")
    private String title;

    // ✅ Validation added
    @NotBlank(message = "Content is required")
    @Column(length = 5000)
    private String content;

    // 🔗 Many posts → one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // 🔗 One post → many comments
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore   // 🔥 prevents infinite recursion
    private List<Comment> comments;
}