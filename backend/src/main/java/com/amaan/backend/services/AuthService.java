package com.amaan.backend.services;

import com.amaan.backend.helpers.dtos.LoginDTO;
import com.amaan.backend.helpers.dtos.RegisterDTO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<?> register(RegisterDTO dto, HttpServletResponse response);
    ResponseEntity<?> login(LoginDTO dto, HttpServletResponse response);
    ResponseEntity<?> logout(HttpServletResponse response);
}
