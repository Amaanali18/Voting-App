package com.amaan.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"roomId", "userId"}))
public class VoteRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private UUID roomId;
    @Column(nullable = false)
    private UUID userId;
    @Column(nullable = false)
    private int optionIndex;
    private Date votedAt;
}
