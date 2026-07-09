package com.amaan.backend.repo;

import com.amaan.backend.entities.VoteRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VotingRepo extends JpaRepository<VoteRoom, UUID> {
    List<VoteRoom> findByName(String name);
    boolean existsByName(String name);
}
