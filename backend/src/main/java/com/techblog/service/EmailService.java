//package com.techblog.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//public class EmailService {
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    public void sendOtp(String toEmail, String otp) {
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(toEmail);
//        message.setSubject("TechBlog OTP Verification");
//        message.setText("Your OTP is: " + otp);
//
//        mailSender.send(message);
//    }
//}



package com.techblog.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtp(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("TechBlog OTP Verification");
        message.setText(
                "Hello,\n\n" +
                        "Your TechBlog OTP is: " + otp + "\n\n" +
                        "This OTP is valid for 5 minutes.\n\n" +
                        "Thank you,\n" +
                        "TechBlog Team"
        );

        mailSender.send(message);
    }
}