package com.techblog.config;

import com.techblog.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // ❌ Disable CSRF (for APIs)
                .csrf(csrf -> csrf.disable())

                // 🔥 Enable CORS
                .cors(cors -> {})

                // 🔐 Stateless session (JWT)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 🔐 Authorization rules
                .authorizeHttpRequests(auth -> auth

                        // ✅ VERY IMPORTANT: Allow preflight requests (FIX)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ✅ Public APIs
                        .requestMatchers(
                                "/api/users/login",
                                "/api/users/register",
                                "/api/users/verify",
                                "/uploads/**"
                        ).permitAll()

                        // 🔐 All others secured
                        .anyRequest().authenticated()
                )

                // 🔥 JWT filter
                .addFilterBefore(new JwtFilter(),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}