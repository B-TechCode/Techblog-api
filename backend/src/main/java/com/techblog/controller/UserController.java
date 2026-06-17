package com.techblog.controller;

import com.techblog.dto.LoginResponse;
import com.techblog.entity.LoginRequest;
import com.techblog.entity.User;
import com.techblog.repository.UserRepository;
import com.techblog.security.JwtUtil;
import com.techblog.service.FileService;
import com.techblog.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.techblog.dto.ForgotPasswordRequest;

import java.util.List;
import java.util.Map;

import com.techblog.repository.FollowRepository;

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

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // ================= REGISTER =================

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {

        userService.registerUser(user);

        return Map.of(
                "message",
                "User registered successfully. OTP sent to your email"
        );
    }

    // ================= VERIFY OTP =================

    @PostMapping("/verify")
    public String verifyOtp(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String otp = request.get("otp");

        return userService.verifyOtp(email, otp);
    }

    // ================= LOGIN =================

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        User user = userService.loginUser(
                request.getEmail(),
                request.getPassword()
        );

        String token =
                jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(token, user);
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ) {

        return ResponseEntity.ok(
                userService.sendResetOtp(
                        request.getEmail()
                )
        );
    }

    // ================= PROFILE IMAGE UPLOAD =================

    @PostMapping("/upload")
    public Map<String, String> uploadProfile(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // ✅ UPLOAD FILE
        String fileName = fileService.uploadFile(file);

        // ✅ SAVE IMAGE
        user.setProfilePic(fileName);

        userRepository.save(user);

        // ✅ RETURN IMAGE URL
        return Map.of(
                "fileName", fileName,
                "url",
                "http://localhost:8080/uploads/" + fileName
        );
    }

    // ================= CURRENT USER =================

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        int followersCount =
                followRepository.countByFollowing(user);

        int followingCount =
                followRepository.countByFollower(user);

        Map<String, Object> response = new java.util.HashMap<>();

        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("about", user.getAbout());
        response.put("gender", user.getGender());
        response.put("profilePic", user.getProfilePic());
        response.put("followersCount", followersCount);
        response.put("followingCount", followingCount);

        return ResponseEntity.ok(response);
    }

// ================= UPDATE PROFILE =================

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @RequestBody User updatedUser,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user =
                userService.updateProfile(email, updatedUser);

        return ResponseEntity.ok(user);
    }


    // ================= TEST =================

    @GetMapping("/test")
    public String test() {
        return "Protected API working!";
    }



    // create api to search users by keyword using existing UserRepository only
    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String keyword) {
        return userRepository.findByNameContainingIgnoreCase(keyword);
    }

}