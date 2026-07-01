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
    private EmailService emailService;

    @Autowired
    private RateLimiterService rateLimiterService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ================= REGISTER USER =================

    public User registerUser(User user) {

        logger.info("Registering user with email: {}", user.getEmail());

        // Check duplicate
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with this email");
        }

        // Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Generate OTP
        String otp = generateOtp();

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setIsVerified(false);

        // Save first
        User savedUser = userRepository.save(user);

        try {

            emailService.sendOtp(
                    savedUser.getEmail(),
                    otp
            );

            logger.info("OTP sent successfully");

        } catch (Exception e) {

            logger.error("Email sending failed", e);

        }

        System.out.println("🔥 OTP = " + otp);

        return savedUser;
    }

    // ================= GENERATE OTP =================

    public String generateOtp() {
        return String.valueOf((int) (Math.random() * 900000) + 100000);
    }

    // ================= VERIFY OTP =================

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

        user.setIsVerified(true);

        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        return "Account verified successfully";
    }

    // ================= LOGIN USER =================

    public User loginUser(String email, String password) {

        logger.info("Login attempt for email: {}", email);

        if (rateLimiterService.isBlocked(email)) {
            logger.warn("User blocked due to too many attempts: {}", email);
            throw new RuntimeException("Too many login attempts. Try later.");
        }

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {

            User user = userOptional.get();

            if (!Boolean.TRUE.equals(user.getIsVerified())) {
                throw new RuntimeException("Please verify your email first");
            }

            if (passwordEncoder.matches(password, user.getPassword())) {

                rateLimiterService.resetAttempts(email);

                logger.info("Login successful for email: {}", email);

                return user;
            }
        }

        rateLimiterService.recordFailedAttempt(email);

        logger.error("Invalid login attempt for email: {}", email);

        throw new RuntimeException("Invalid Email or Password");
    }

    // ================= FORGOT PASSWORD =================

    public String sendResetOtp(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String otp = generateOtp();

        user.setResetOtp(otp);
        user.setResetOtpExpiry(
                LocalDateTime.now().plusMinutes(5)
        );

        userRepository.save(user);

        try {

            emailService.sendOtp(email, otp);

            logger.info("Reset OTP sent successfully");

        } catch (Exception e) {

            logger.error("Reset OTP email failed", e);

        }

        System.out.println("🔥 RESET OTP = " + otp);

        return "Reset OTP sent successfully";
    }

    // ================= RESET PASSWORD =================

    public String resetPassword(
            String email,
            String otp,
            String newPassword
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.getResetOtp() == null) {
            throw new RuntimeException("OTP not generated");
        }

        if (user.getResetOtpExpiry() != null &&
                user.getResetOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!user.getResetOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        user.setResetOtp(null);
        user.setResetOtpExpiry(null);

        userRepository.save(user);

        return "Password reset successful";
    }

    // ================= UPDATE PROFILE =================

    public User updateProfile(
            String email,
            User updatedUser
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setName(updatedUser.getName());

        user.setAbout(updatedUser.getAbout());

        user.setGender(updatedUser.getGender());

        return userRepository.save(user);
    }

}