package com.smartgate.condominio_api.utils;

import com.smartgate.condominio_api.config.JwtProperties;
import com.smartgate.condominio_api.domain.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expirationTime;

    public JwtUtil(JwtProperties properties) {
        byte[] keyBytes = Base64.getDecoder().decode(properties.getSecret());
        this.secretKey = new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());
        this.expirationTime = properties.getExpiration();
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

}
