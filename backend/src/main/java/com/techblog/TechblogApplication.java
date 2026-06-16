package com.techblog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TechblogApplication {

    public static void main(String[] args) {

        System.out.println("MAIL_USERNAME = " + System.getenv("MAIL_USERNAME"));
        System.out.println("MAIL_PASSWORD = " + System.getenv("MAIL_PASSWORD"));

        SpringApplication.run(TechblogApplication.class, args);
    }
}
