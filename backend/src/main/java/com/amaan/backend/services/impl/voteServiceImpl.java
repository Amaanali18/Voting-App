package com.amaan.backend.services.impl;

import com.amaan.backend.entities.VoteRoom;
import com.amaan.backend.helpers.dtos.voteRoomCreateDTO;
import com.amaan.backend.repo.VotingRepo;
import com.amaan.backend.services.voteService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class voteServiceImpl implements voteService {

    private final VotingRepo repository;

    public voteServiceImpl(VotingRepo repository) {
        this.repository = repository;
    }

    @Override
    public boolean getExistingRoomByName(String name) {
        return repository.existsByName(name);
    }

    @Override
    public ResponseEntity<?> getVoteRoom(String name) {
        List<VoteRoom> voteRooms = repository.findByName(name);
        if(voteRooms == null || voteRooms.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(voteRooms);
    }

    @Override
    public ResponseEntity<?> createVotingRoom(voteRoomCreateDTO voteRoom) {
        if (voteRoom.getName() == null || voteRoom.getQuestion() == null || voteRoom.getOptions() == null || voteRoom.getOptions().isEmpty()) {
            return ResponseEntity.badRequest().body("name, question, and options are required");
        }

        VoteRoom room = new VoteRoom();
        room.setName(voteRoom.getName());
        room.setQuestion(voteRoom.getQuestion());
        room.setOptions(voteRoom.getOptions());
        room.setCounter(voteRoom.getOptions().stream().map(_ -> 0L).toList());
        room.setCreatedAt(new Date());

        VoteRoom saved = repository.save(room);
        return ResponseEntity.ok(saved);
    }
}
