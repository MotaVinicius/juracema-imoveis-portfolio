package com.juracema.imoveis.config;

import com.juracema.imoveis.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> {})

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/auth/login")
                        .permitAll()

                        /*
                         * Consulta pública dos imóveis
                         */

                        .requestMatchers(
                                "/uploads/**"
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/imoveis",
                                "/imoveis/**"
                        )
                        .permitAll()

                        .requestMatchers(
                                "/integracoes/chaves-na-mao/imoveis.xml"
                        ).permitAll()

                        .requestMatchers("/imoveis/**").permitAll()

                        /*
                         * Todo o restante exige JWT
                         */
                        .anyRequest()
                        .authenticated()
                )

                .exceptionHandling(exception -> exception

                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendError(
                                    HttpServletResponse.SC_UNAUTHORIZED,
                                    "Unauthorized"
                            );
                        })

                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.sendError(
                                    HttpServletResponse.SC_FORBIDDEN,
                                    "Forbidden"
                            );
                        })
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5500",
                        "http://127.0.0.1:5500",
                        "https://juracemamotaimoveis.com.br",
                        "https://www.juracemamotaimoveis.com.br"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}