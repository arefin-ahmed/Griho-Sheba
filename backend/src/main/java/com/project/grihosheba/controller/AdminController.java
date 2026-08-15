package com.project.grihosheba.controller;

import com.project.grihosheba.model.Complaint;
import com.project.grihosheba.model.User;
import com.project.grihosheba.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsersForAdmin() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        User user = userOpt.get();
        user.setStatus("APPROVED");
        user.setApproved(true);
        userRepository.save(user);
        return ResponseEntity.ok("User approved successfully!");
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        User user = userOpt.get();
        user.setStatus("REJECTED");
        user.setApproved(false);
        userRepository.save(user);
        return ResponseEntity.ok("User rejected successfully!");
    }

    // --- Complaint review (backed directly by JPA here since Complaint has
    // no dedicated repository/service in the requested project structure) ---

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping("/complaints")
    public ResponseEntity<?> getAllComplaints() {
        List<Complaint> complaints = entityManager
                .createQuery("SELECT c FROM Complaint c ORDER BY c.createdAt DESC", Complaint.class)
                .getResultList();
        return ResponseEntity.ok(complaints);
    }

    @PutMapping("/complaints/{id}/status")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> updateComplaintStatus(@PathVariable Long id, @RequestBody StatusUpdate update) {
        Complaint complaint = entityManager.find(Complaint.class, id);
        if (complaint == null) {
            return ResponseEntity.badRequest().body("Complaint not found.");
        }
        complaint.setStatus(update.status);
        entityManager.merge(complaint);
        return ResponseEntity.ok(complaint);
    }

    public static class StatusUpdate {
        public String status;
    }
}
