package com.techblog.controller;

import com.techblog.entity.User;
import com.techblog.repository.UserRepository;
import com.techblog.service.LikeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @Autowired
    private UserRepository userRepository;

    // ================= TOGGLE LIKE =================

    @PostMapping("/{postId}")
    public ResponseEntity<String> toggleLike(
            @PathVariable Integer postId,
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        String result =
                likeService.toggleLike(postId, user);

        return ResponseEntity.ok(result);
    }

    // ================= GET LIKE COUNT =================

    @GetMapping("/{postId}")
    public ResponseEntity<Integer> getLikes(
            @PathVariable Integer postId
    ) {

        int count =
                likeService.getLikesCount(postId);

        return ResponseEntity.ok(count);
    }

    // ================= CHECK IF LIKED =================

    @GetMapping("/check/{postId}")
    public ResponseEntity<Boolean> isLiked(
            @PathVariable Integer postId,
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        boolean liked =
                likeService.isPostLikedByUser(
                        postId,
                        user
                );

        return ResponseEntity.ok(liked);
    }

    // ================= COMMON METHOD =================

    private User getLoggedInUser(
            Authentication authentication
    ) {

        if (authentication == null) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));
    }
}