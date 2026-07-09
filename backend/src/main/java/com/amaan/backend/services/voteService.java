package com.amaan.backend.services;

import com.amaan.backend.helpers.dtos.voteRoomCreateDTO;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

public interface voteService {
    boolean getExistingRoomByName(String name);
    ResponseEntity<?>  getVoteRoom(String name);
    ResponseEntity<?> createVotingRoom(voteRoomCreateDTO voteRoom);
    ResponseEntity<?> castVote(String roomName, Integer optionIndex, UUID userId);
}
