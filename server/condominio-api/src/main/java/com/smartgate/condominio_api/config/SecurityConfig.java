package com.smartgate.condominio_api.config;

import com.smartgate.condominio_api.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Configuração de CORS (Permite conexão com Frontend)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // Desabilita CSRF (Padrão para APIs REST Stateless)
                .csrf(csrf -> csrf.disable())
                
                // Define que não haverá sessão no servidor (Stateless)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // Configura as permissões de acesso
                .authorizeHttpRequests(auth -> auth
                        // 1. REGRA ESPECÍFICA PARA O EMAIL (Método GET)
                        .requestMatchers(HttpMethod.GET, "/v1/auth/confirm").permitAll()
                        
                        // 2. Outras rotas públicas
                        .requestMatchers(
                                "/v1/auth/**",       // Login e Registro
                                "/v1/user/**",
                                "/v1/meetings/**",
                                "/v1/expenses/**",
                                "/v3/api-docs/**",   // Swagger Docs
                                "/swagger-ui/**",    // Swagger UI
                                "/swagger-ui.html"
                        ).permitAll()
                        
                        // 3. Qualquer outra rota exige autenticação (Token JWT)
                        .anyRequest().authenticated()
                )
                // Adiciona o filtro de JWT antes do filtro padrão de usuário/senha
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permite qualquer origem (Frontend React, Postman, Mobile, etc)
        configuration.setAllowedOriginPatterns(List.of("*"));
        // Métodos permitidos
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        // Headers permitidos
        configuration.setAllowedHeaders(List.of("*"));
        // Permite credenciais (Cookies, Authorization Headers)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}