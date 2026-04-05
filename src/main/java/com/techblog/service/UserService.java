package com.techblog.service;

import com.techblog.entity.User;
import com.techblog.repository.UserRepository;
import com.techblog.security.RateLimiterService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RateLimiterService rateLimiterService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ✅ REGISTER USER (OTP + expiry)
    public User registerUser(User user) {

        logger.info("Registering user with email: {}", user.getEmail());

        // ✅ Check duplicate
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with this email");
        }

        // 🔐 Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 🔥 Generate OTP
        String otp = generateOtp();

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setIsVerified(false);

        // 👉 PRINT OTP (IMPORTANT)
        System.out.println("🔥 OTP for " + user.getEmail() + " = " + otp);

        return userRepository.save(user);
    }

    // ✅ GENERATE OTP
    public String generateOtp() {
        return String.valueOf((int) (Math.random() * 900000) + 100000);
    }

    // ✅ VERIFY OTP
    public String verifyOtp(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtp() == null) {
            throw new RuntimeException("OTP not generated");
        }

        if (user.getOtpExpiry() != null &&
                user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        // ✅ FIX HERE
        user.setIsVerified(true);   // 🔥 IMPORTANT

        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        return "Account verified successfully";
    }

    // ✅ LOGIN USER
    public User loginUser(String email, String password) {

        logger.info("Login attempt for email: {}", email);

        // 🔥 Rate limiting
        if (rateLimiterService.isBlocked(email)) {
            logger.warn("User blocked due to too many attempts: {}", email);
            throw new RuntimeException("Too many login attempts. Try later.");
        }

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // 🔥 Check verified
            if (!Boolean.TRUE.equals(user.getIsVerified())) {
                throw new RuntimeException("Please verify your email first");
            }

            // 🔐 Password match
            if (passwordEncoder.matches(password, user.getPassword())) {

                rateLimiterService.resetAttempts(email);

                logger.info("Login successful for email: {}", email);
                return user;
            }
        }

        // ❌ Failed login
        rateLimiterService.recordFailedAttempt(email);

        logger.error("Invalid login attempt for email: {}", email);
        throw new RuntimeException("Invalid Email or Password");
    }
}