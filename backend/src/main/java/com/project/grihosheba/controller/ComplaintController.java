package com.project.grihosheba.controller;

import com.project.grihosheba.model.Complaint;
import com.project.grihosheba.repository.ComplaintRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

    private final ComplaintRepository complaintRepository;

    public ComplaintController(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        if (complaint.getStatus() == null) {
            complaint.setStatus("OPEN");
        }
        return complaintRepository.save(complaint);
    }

    @PutMapping("/{id}/status")
    public Complaint updateStatus(@PathVariable Long id, @RequestParam(required = false) String status,
            @RequestBody(required = false) java.util.Map<String, String> body) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow();
        if (status == null && body != null) {
            status = body.get("status");
        }
        complaint.setStatus(status != null ? status : "RESOLVED");
        return complaintRepository.save(complaint);
    }
}