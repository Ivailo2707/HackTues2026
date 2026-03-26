package com.cm.ecohub.config;

import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;

@Getter @Setter
@Configuration
public class JwtConfig {
    @Value("${JWT_SECRET:randomsecretstring123456789123456789}")
    private String secret;

    @Value("${JWT_ACCESS_EXPIRATION:300}")
    private int accessTokenExpiration;

    @Value("${JWT_REFRESH_EXPIRATION:604800}")
    private int refreshTokenExpiration;

    public SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}
