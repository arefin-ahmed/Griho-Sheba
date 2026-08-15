package com.project.grihosheba.controller;

import com.project.grihosheba.model.User;
import com.project.grihosheba.repository.UserRepository;
import com.project.grihosheba.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        AuthService.AuthResult result = authService.register(user);
        if (!result.success) {
            return ResponseEntity.badRequest().body(result.message);
        }
        return ResponseEntity.ok(result.user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        String identifier = loginRequest.getPhone() != null && !loginRequest.getPhone().trim().isEmpty()
                ? loginRequest.getPhone()
                : loginRequest.getEmail();

        AuthService.AuthResult result = authService.login(identifier, loginRequest.getPassword());

        if (!result.success) {
            if (result.message != null && (result.message.contains("pending") || result.message.contains("rejected"))) {
                return ResponseEntity.status(403).body(result.message);
            }
            return ResponseEntity.badRequest().body(result.message);
        }
        return ResponseEntity.ok(result.user);
    }

    @GetMapping("/workers")
    public ResponseEntity<?> getAvailableWorkers() {
        return ResponseEntity.ok(authService.getApprovedWorkers());
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User updates) {
        return userRepository.findById(id).<ResponseEntity<?>>map(existingUser -> {
            if (updates.getName() != null)
                existingUser.setName(updates.getName());
            if (updates.getEmail() != null)
                existingUser.setEmail(updates.getEmail());
            if (updates.getPhone() != null)
                existingUser.setPhone(updates.getPhone());
            if (updates.getSpecialty() != null)
                existingUser.setSpecialty(updates.getSpecialty());
            if (updates.getExperience() != null)
                existingUser.setExperience(updates.getExperience());
            if (updates.getPhotoUrl() != null)
                existingUser.setPhotoUrl(updates.getPhotoUrl());
            userRepository.save(existingUser);
            return ResponseEntity.ok(existingUser);
        }).orElse(ResponseEntity.badRequest().body("User not found."));
    }
}