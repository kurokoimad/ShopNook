package com.ShopNook.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ApplicationConfiguration implements WebMvcConfigurer
{
    @Value("${allowed.origins}")
    private String [] myAllowedOrigins;

    @Value("${spring.data.rest.base-path}")
    private String basePath;

    @Override
    public void addCorsMappings(CorsRegistry cors)
    {
        // cors mapping set up
        cors.addMapping(basePath + "/**").allowedOrigins(myAllowedOrigins);
    }
}
