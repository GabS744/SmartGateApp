package com.smartgate.condominio_api.config;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Component
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtProperties {
    private String secret;

    private long expiration = 1000 * 60 * 60;

    public SecretKey getSecretKey() {
        if (secret == null) {
            throw new IllegalStateException("jwt.secret is not configured (put a base64 key in application.yml)");
        }
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
