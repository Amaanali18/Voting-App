package com.amaan.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VoteRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(unique = true)
    private String name;
    private String question;
    private Date createdAt;
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> options;
    @ElementCollection(fetch = FetchType.EAGER)
    private List<Long> counter;
}
