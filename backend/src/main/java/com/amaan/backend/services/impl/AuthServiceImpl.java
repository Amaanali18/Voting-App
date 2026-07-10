package com.amaan.backend.services.impl;

import com.amaan.backend.config.AuditLogger;
import com.amaan.backend.config.JwtUtil;
import com.amaan.backend.entities.User;
import com.amaan.backend.helpers.dtos.LoginDTO;
import com.amaan.backend.helpers.dtos.RegisterDTO;
import com.amaan.backend.repo.UserRepo;
import com.amaan.backend.services.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepo userRepo, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public ResponseEntity<?> register(RegisterDTO dto, HttpServletResponse response) {
        if (dto.getName() == null || dto.getEmail() == null || dto.getPassword() == null) {
            return ResponseEntity.badRequest().body("name, email, and password are required");
        }
        if (userRepo.existsByEmail(dto.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("email already exists");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setCreatedAt(new Date());
        userRepo.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        setTokenCookie(response, token);

        AuditLogger.log("REGISTER", "email=" + dto.getEmail());

        return ResponseEntity.ok(Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail()));
    }

    @Override
    public ResponseEntity<?> login(LoginDTO dto, HttpServletResponse response) {
        if (dto.getEmail() == null || dto.getPassword() == null) {
            return ResponseEntity.badRequest().body("email and password are required");
        }

        User user = userRepo.findByEmail(dto.getEmail()).orElse(null);
        if (user == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            AuditLogger.log("LOGIN_FAILED", "email=" + dto.getEmail());
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        setTokenCookie(response, token);

        AuditLogger.log("LOGIN", "email=" + dto.getEmail());

        return ResponseEntity.ok(Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail()));
    }

    @Override
    public ResponseEntity<?> logout(UUID userId, HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        AuditLogger.log("LOGOUT", "userId=" + userId);
        return ResponseEntity.ok("Logged out");
    }

    private void setTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        response.addCookie(cookie);
    }
}
