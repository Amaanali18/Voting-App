package com.amaan.backend.helpers.dtos;

import lombok.Data;

@Data
public class RegisterDTO {
    private String name;
    private String email;
    private String password;
}
