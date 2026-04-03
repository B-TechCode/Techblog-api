package com.techblog.controller;

import com.techblog.dto.LoginResponse;
import com.techblog.entity.LoginRequest;
import com.techblog.entity.User;
import com.techblog.repository.UserRepository;
import com.techblog.security.JwtUtil;
import com.techblog.service.FileService;
import com.techblog.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private FileService fileService;

    @Autowired
    private UserRepository userRepository;

    // ✅ REGISTER (OTP generated)
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {

        userService.registerUser(user);

        return Map.of(
                "message", "User registered successfully. OTP sent to your email"
        );
    }

    // ✅ VERIFY OTP (🔥 MAIN API)
    @PostMapping("/verify")
    public String verifyOtp(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String otp = request.get("otp");

        return userService.verifyOtp(email, otp);
    }

    // ✅ LOGIN (only after verification)
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        User user = userService.loginUser(request.getEmail(), request.getPassword());

        String token = JwtUtil.generateToken(user.getEmail());

        return new LoginResponse(token, user);
    }

    // ✅ FILE UPLOAD
    @PostMapping("/upload")
    public Map<String, String> uploadProfile(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fileName = fileService.uploadFile(file);

        user.setProfilePic(fileName);
        userRepository.save(user);

        return Map.of(
                "fileName", fileName,
                "url", "http://localhost:8080/uploads/" + fileName
        );
    }

    // ✅ TEST API
    @GetMapping("/test")
    public String test() {
        return "Protected API working!";
    }
}