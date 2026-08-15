package com.project.grihosheba.controller;

import com.project.grihosheba.model.DomesticWorker;
import com.project.grihosheba.service.WorkerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "*")
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @GetMapping
    public List<DomesticWorker> getAllWorkers() {
        return workerService.getAllWorkers();
    }

    @PostMapping("/add")
    public DomesticWorker addWorker(@RequestBody DomesticWorker newWorker) {
        return workerService.addWorker(newWorker);
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<?> setAvailability(@PathVariable Long id, @RequestBody AvailabilityUpdate update) {
        return ResponseEntity.ok(workerService.setAvailability(id, update.isAvailable));
    }

    public static class AvailabilityUpdate {
        public boolean isAvailable;
    }
}
