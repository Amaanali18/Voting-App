package com.amaan.backend.helpers.dtos;

import lombok.Data;

import java.util.List;

@Data
public class voteRoomCreateDTO {
    private String name;
    private String question;
    private List<String> options;
}
