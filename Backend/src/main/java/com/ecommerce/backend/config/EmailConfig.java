package com.ecommerce.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for email functionality including verification settings.
 *
 * @author Taoufiq
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "app.email")
public class EmailConfig {
    private String from;
    private String verificationUrl;
    private long tokenExpiration;
}
