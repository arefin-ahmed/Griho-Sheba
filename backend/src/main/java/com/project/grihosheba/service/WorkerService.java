package com.project.grihosheba.service;

import com.project.grihosheba.model.DomesticWorker;
import com.project.grihosheba.model.User;
import com.project.grihosheba.repository.UserRepository;
import com.project.grihosheba.repository.WorkerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final UserRepository userRepository;

    // Constructor injection for both repositories
    public WorkerService(WorkerRepository workerRepository, UserRepository userRepository) {
        this.workerRepository = workerRepository;
        this.userRepository = userRepository;
    }

    public List<DomesticWorker> getAllWorkers() {
        return workerRepository.findAll();
    }

    public DomesticWorker addWorker(DomesticWorker worker) {
        return workerRepository.save(worker);
    }

    public DomesticWorker setAvailability(Long workerId, boolean isAvailable) {
        DomesticWorker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new IllegalArgumentException("Worker not found: " + workerId));
        worker.setIsAvailable(isAvailable);
        return workerRepository.save(worker);
    }

    // Method to register a worker and save to both tables
    @Transactional
    public DomesticWorker registerWorkerWithDetails(User user, String nidNumber) {
        // 1. Save User basic info
        user.setRole("WORKER");
        User savedUser = userRepository.save(user);

        // 2. Save linked Worker record in workers table
        DomesticWorker worker = new DomesticWorker();
        worker.setWorkerId(savedUser.getId());
        worker.setNidNumber(nidNumber);
        worker.setIsVerified(false); // Default to false until admin approval for safety
        worker.setIsAvailable(true);
        worker.setRating(5.0);

        return workerRepository.save(worker);
    }
}