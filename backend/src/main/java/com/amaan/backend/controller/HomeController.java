package com.amaan.backend.controller;

import com.amaan.backend.helpers.dtos.voteRoomCreateDTO;
import com.amaan.backend.services.voteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/voting/")
public class HomeController {

    private final voteService voteService;
    public HomeController(voteService voteService) {
        this.voteService = voteService;
    }

    @GetMapping("/{name}")
    public ResponseEntity<?> getVotingRoom(@PathVariable String name) {
        return voteService.getVoteRoom(name);
    }
    @GetMapping("/existsByName")
    public boolean getVotingRoomByName(@RequestBody String name){
        return voteService.getExistingRoomByName(name);
    }
    @PostMapping("/create")
    public ResponseEntity<?> createVotingRoom(@RequestBody voteRoomCreateDTO voteRoom) {
        return voteService.createVotingRoom(voteRoom);
    }
}
