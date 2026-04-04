package com.techblog.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {

    private Integer id;
    private String content;

    // 🔥 user info (clean + secure)
    private Integer userId;
    private String userName;
    private String userEmail;

    // 🔥 proper timestamp
    private LocalDateTime createdAt;
}