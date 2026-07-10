package com.amaan.backend.services;

import com.amaan.backend.helpers.dtos.LoginDTO;
import com.amaan.backend.helpers.dtos.RegisterDTO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

public interface AuthService {
    ResponseEntity<?> register(RegisterDTO dto, HttpServletResponse response);
    ResponseEntity<?> login(LoginDTO dto, HttpServletResponse response);
    ResponseEntity<?> logout(UUID userId, HttpServletResponse response);
}
