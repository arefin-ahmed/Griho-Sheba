package com.project.grihosheba.controller;

import com.project.grihosheba.model.User;
import com.project.grihosheba.repository.ComplaintRepository;
import com.project.grihosheba.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/debug")
public class DebugController {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;

    public DebugController(UserRepository userRepository, ComplaintRepository complaintRepository) {
        this.userRepository = userRepository;
        this.complaintRepository = complaintRepository;
    }

    @GetMapping("/users")
    public List<User> showUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/nuke")
    public String nukeDatabase() {
        complaintRepository.deleteAll();
        userRepository.deleteAll();
        return "🔥 Database has been completely nuked (all users and complaints deleted)!";
    }
}