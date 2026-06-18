package com.techblog.config;

import com.techblog.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

                // ❌ Disable CSRF
                .csrf(csrf -> csrf.disable())

                // ✅ Enable CORS
                .cors(cors -> {})

                // ✅ Stateless JWT
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 🔐 Authorization
                .authorizeHttpRequests(auth -> auth

                        // ✅ Allow OPTIONS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ✅ PUBLIC APIs
                        .requestMatchers(

                                "/api/users/login",
                                "/api/users/register",
                                "/api/users/verify",
                                "/api/users/forgot-password",
                                "/api/users/reset-password",

                                "/uploads/**",

                                // WebSocket
                                "/ws/**",

                                // SockJS internal endpoints
                                "/ws/info/**",
                                "/ws/**",

                                "/api/files/**"

                        ).permitAll()

                        // ✅ SECURE ALL OTHER APIs
                        .anyRequest().authenticated()
                )

                // ✅ JWT FILTER
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // 🔐 PASSWORD ENCODER
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}