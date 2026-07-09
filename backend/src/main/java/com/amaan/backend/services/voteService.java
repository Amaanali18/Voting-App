package com.amaan.backend.services;

import com.amaan.backend.helpers.dtos.voteRoomCreateDTO;
import org.springframework.http.ResponseEntity;


public interface voteService {
    boolean getExistingRoomByName(String name);
    ResponseEntity<?>  getVoteRoom(String name);
    ResponseEntity<?> createVotingRoom(voteRoomCreateDTO voteRoom);
}
