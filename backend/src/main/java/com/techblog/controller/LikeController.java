package com.techblog.controller;

import com.techblog.entity.User;
import com.techblog.repository.UserRepository;
import com.techblog.service.LikeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @Autowired
    private UserRepository userRepository;

    //  TOGGLE LIKE
    @PostMapping("/{postId}")
    public String toggleLike(@PathVariable Integer postId,
                             Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return likeService.toggleLike(postId, user);
    }

    // ❤ GET LIKE COUNT
    @GetMapping("/{postId}")
    public int getLikes(@PathVariable Integer postId) {
        return likeService.getLikesCount(postId);
    }
}