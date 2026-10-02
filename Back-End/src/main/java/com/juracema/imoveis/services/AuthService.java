package com.juracema.imoveis.services;

import com.juracema.imoveis.dto.LoginRequest;
import com.juracema.imoveis.models.AdminModel;
import com.juracema.imoveis.repositories.AdminRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String login(LoginRequest request) {

        AdminModel admin = adminRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new BadCredentialsException("Usuário ou senha inválidos")
                );

        if (!admin.isAtivo()) {
            throw new BadCredentialsException(
                    "Usuário ou senha inválidos"
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                admin.getPasswordHash()
        )) {
            throw new BadCredentialsException(
                    "Usuário ou senha inválidos"
            );
        }

        return jwtService.generateToken(admin);
    }
}