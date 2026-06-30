package com.techblog.config;

import java.util.Properties;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {

    private final Environment env;

    public MailConfig(Environment env) {
        this.env = env;
    }

    @Bean
    public JavaMailSender javaMailSender() {

        JavaMailSenderImpl sender = new JavaMailSenderImpl();

        sender.setHost(env.getProperty("spring.mail.host", "smtp.gmail.com"));
        sender.setPort(Integer.parseInt(env.getProperty("spring.mail.port", "587")));
        sender.setUsername(env.getProperty("spring.mail.username"));
        sender.setPassword(env.getProperty("spring.mail.password"));

        Properties props = sender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        return sender;
    }
}