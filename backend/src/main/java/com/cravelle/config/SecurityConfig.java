package com.cravelle.config;

import com.cravelle.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType("application/json");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"success\":false,\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Authentication required to access this resource\"}");
                })
            )
            .authorizeHttpRequests(auth -> auth
                // Public Health & Documentation
                .requestMatchers("/health", "/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/swagger-resources/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()

                // Public Auth Endpoints
                .requestMatchers("/api/auth/**").permitAll()

                // Public Food Catalog, Locations & Recommendations
                .requestMatchers(HttpMethod.GET, "/api/restaurants/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/cuisines/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/dishes/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/locations/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/recommendations/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/recommendations/ask").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/orders/*/tracking").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/orders/*/simulate-step").permitAll()

                // Public Chatbot query (Supports guests)
                .requestMatchers(HttpMethod.POST, "/api/chat").permitAll()

                // Public Newsletter
                .requestMatchers(HttpMethod.POST, "/api/newsletter/subscribe").permitAll()

                // Admin Endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // All other API requests require authentication
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
