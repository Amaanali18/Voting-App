package com.amaan.backend.helpers.dtos;

import lombok.Data;

@Data
public class RegisterDTO {
    private String username;
    private String email;
    private String password;
}
