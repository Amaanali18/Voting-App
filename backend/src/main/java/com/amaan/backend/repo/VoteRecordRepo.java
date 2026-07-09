package com.amaan.backend.repo;

import com.amaan.backend.entities.VoteRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface VoteRecordRepo extends JpaRepository<VoteRecord, UUID> {
    boolean existsByRoomIdAndUserId(UUID roomId, UUID userId);
}
