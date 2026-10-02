package com.juracema.imoveis.services;

import com.juracema.imoveis.models.AdminModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;

    private final long expiration;

    public JwtService(
            JwtEncoder jwtEncoder,
            JwtDecoder jwtDecoder,
            @Value("${jwt.expiration}") long expiration
    ) {
        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
        this.expiration = expiration;
    }

    public String generateToken(AdminModel admin) {

        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("juracema-imoveis-api")
                .subject(admin.getUsername())
                .issuedAt(now)
                .expiresAt(now.plusMillis(expiration))
                .claim("nome", admin.getNome())
                .claim("role", "ADMIN")
                .build();

        JwsHeader header =
                JwsHeader.with(MacAlgorithm.HS256).build();

        JwtEncoderParameters parameters =
                JwtEncoderParameters.from(header, claims);

        return jwtEncoder
                .encode(parameters)
                .getTokenValue();
    }

    public String extractUsername(String token) {

        Jwt jwt = jwtDecoder.decode(token);

        return jwt.getSubject();
    }

    public boolean isTokenValid(String token, String username) {

        try {

            Jwt jwt = jwtDecoder.decode(token);

            String subject = jwt.getSubject();

            return subject != null &&
                    subject.equals(username) &&
                    jwt.getExpiresAt() != null &&
                    jwt.getExpiresAt().isAfter(Instant.now());

        } catch (JwtException e) {

            return false;
        }
    }
}