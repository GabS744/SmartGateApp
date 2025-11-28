package com.smartgate.condominio_api.controller;

import com.smartgate.condominio_api.request.LoginRequest;
import com.smartgate.condominio_api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("login")
    @ResponseStatus(HttpStatus.OK)
    public Object login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
