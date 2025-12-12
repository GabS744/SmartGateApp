package com.smartgate.condominio_api.controller;

import com.smartgate.condominio_api.request.LoginRequest;
import com.smartgate.condominio_api.request.RegisterRequest;
import com.smartgate.condominio_api.response.LoginResponse; // Import adicionado
import com.smartgate.condominio_api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Retorna diretamente o LoginResponse
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("register")
    public ResponseEntity<String> registration(@RequestBody @Valid RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("Cadastro realizado! Verifique seu e-mail.");
    }

    @GetMapping("confirm")
    public ResponseEntity<String> confirm(@RequestParam("token") String token) {
        return ResponseEntity.ok(authService.confirmToken(token));
    }
}