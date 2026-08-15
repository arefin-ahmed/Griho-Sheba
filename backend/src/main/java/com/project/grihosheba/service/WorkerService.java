package com.project.grihosheba.service;

import com.project.grihosheba.model.DomesticWorker;
import com.project.grihosheba.repository.WorkerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;

    public WorkerService(WorkerRepository workerRepository) {
        this.workerRepository = workerRepository;
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
}
