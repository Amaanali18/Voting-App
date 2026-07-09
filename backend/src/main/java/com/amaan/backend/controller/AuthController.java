package com.amaan.backend.controller;

import com.amaan.backend.helpers.dtos.LoginDTO;
import com.amaan.backend.helpers.dtos.RegisterDTO;
import com.amaan.backend.services.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO dto, HttpServletResponse response) {
        return authService.register(dto, response);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto, HttpServletResponse response) {
        return authService.login(dto, response);
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        return authService.logout(response);
    }
}
