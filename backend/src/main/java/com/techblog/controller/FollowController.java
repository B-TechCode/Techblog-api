package com.techblog.controller;

import com.techblog.entity.User;
import com.techblog.repository.UserRepository;
import com.techblog.service.FollowService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import com.techblog.entity.Follow;
import com.techblog.repository.FollowRepository;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/follow")
public class FollowController {


    @Autowired
    private FollowService followService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowRepository followRepository;


    @PostMapping("/{userId}")
    public String follow(@PathVariable Integer userId,
                         Authentication authentication) {

        String email = authentication.getName();

        User follower = userRepository.findByEmail(email).get();
        User following = userRepository.findById(userId).get();

        return followService.toggleFollow(follower, following);
    }

    @GetMapping("/followers")
    public List<User> getFollowers(Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email).get();

        return followRepository.findAll()
                .stream()
                .filter(f -> f.getFollowing() != null &&
                        f.getFollowing().getId().equals(user.getId()))
                .map(Follow::getFollower)
                .collect(Collectors.toList());
    }

    @GetMapping("/following")
    public List<User> getFollowing(Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email).get();

        return followRepository.findAll()
                .stream()
                .filter(f -> f.getFollower() != null &&
                        f.getFollower().getId().equals(user.getId()))
                .map(Follow::getFollowing)
                .collect(Collectors.toList());
    }

}

