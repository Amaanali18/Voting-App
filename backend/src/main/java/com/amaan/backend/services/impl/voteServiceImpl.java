package com.amaan.backend.services.impl;

import com.amaan.backend.entities.VoteRecord;
import com.amaan.backend.entities.VoteRoom;
import com.amaan.backend.helpers.dtos.voteRoomCreateDTO;
import com.amaan.backend.repo.VoteRecordRepo;
import com.amaan.backend.repo.VotingRepo;
import com.amaan.backend.services.voteService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class voteServiceImpl implements voteService {

    private final VotingRepo repository;
    private final VoteRecordRepo voteRecordRepo;

    public voteServiceImpl(VotingRepo repository, VoteRecordRepo voteRecordRepo) {
        this.repository = repository;
        this.voteRecordRepo = voteRecordRepo;
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

    @Override
    public ResponseEntity<?> castVote(String roomName, Integer optionIndex, UUID userId) {
        List<VoteRoom> voteRooms = repository.findByName(roomName);
        if (voteRooms == null || voteRooms.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        VoteRoom room = voteRooms.get(0);

        long ageMs = System.currentTimeMillis() - room.getCreatedAt().getTime();
        if (ageMs > 24 * 60 * 60 * 1000) {
            return ResponseEntity.status(410).body("This voting room has expired");
        }

        if (optionIndex < 0 || optionIndex >= room.getOptions().size()) {
            return ResponseEntity.badRequest().body("Invalid option index");
        }

        if (voteRecordRepo.existsByRoomIdAndUserId(room.getId(), userId)) {
            return ResponseEntity.status(409).body("You have already voted in this room");
        }

        List<Long> counter = room.getCounter();
        counter.set(optionIndex, counter.get(optionIndex) + 1);
        room.setCounter(counter);
        repository.save(room);

        VoteRecord record = new VoteRecord(null, room.getId(), userId, optionIndex, new Date());
        voteRecordRepo.save(record);

        return ResponseEntity.ok("Vote recorded");
    }
}
