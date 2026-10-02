package com.juracema.imoveis.controllers;

import com.juracema.imoveis.dto.LoginRequest;
import com.juracema.imoveis.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }
}