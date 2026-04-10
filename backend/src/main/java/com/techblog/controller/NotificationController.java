package com.techblog.controller;

import com.techblog.entity.User;
import com.techblog.repository.UserRepository;
import com.techblog.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService service;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<?> getNotifications(Authentication auth) {

        User user = userRepository.findByEmail(auth.getName()).get();

        return service.get(user);
    }
}