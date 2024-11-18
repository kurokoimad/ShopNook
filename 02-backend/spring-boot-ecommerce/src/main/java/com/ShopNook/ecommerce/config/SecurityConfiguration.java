package com.ShopNook.ecommerce.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        // Configure CORS to allow specific origins and methods
        httpSecurity.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Defining security rules for HTTP requests
                .authorizeHttpRequests(authorize ->
                        authorize
                                .requestMatchers("/api/orders/**").authenticated() // Require authentication for /api/orders/** endpoints
                                .anyRequest().permitAll() // Allow other requests
                )
                // Configure OAuth2 resource server for JWT support
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt -> jwt.decoder(jwtDecoder())) // Configure JWT decoding
                )
                // Disable CSRF protection if not required
                .csrf(AbstractHttpConfigurer::disable);

        // Configure content negotiation strategy to handle various content types
        httpSecurity.setSharedObject(ContentNegotiationStrategy.class,
                new HeaderContentNegotiationStrategy());

        // Configure Okta to ensure non-empty response bodies for 401 Unauthorized responses
        Okta.configureResourceServer401ResponseBody(httpSecurity);

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("https://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE")); // Allow these HTTP methods
        configuration.setAllowedHeaders(List.of("*")); // Allow all headers
        configuration.setAllowCredentials(true);  // Enable credentials like cookies to be sent with CORS requests

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        // Creating a JwtDecoder
        return JwtDecoders.fromOidcIssuerLocation("https://dev-27952537.okta.com/oauth2/default");
    }
}
