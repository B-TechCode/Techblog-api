package com.techblog.controller;

import com.techblog.entity.User;
import com.techblog.repository.UserRepository;
import com.techblog.service.FollowService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{userId}")
    public String follow(@PathVariable Integer userId,
                         Authentication authentication) {

        String email = authentication.getName();

        User follower = userRepository.findByEmail(email).get();
        User following = userRepository.findById(userId).get();

        return followService.toggleFollow(follower, following);
    }
}