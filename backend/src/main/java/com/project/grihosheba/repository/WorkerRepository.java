package com.project.grihosheba.repository;

import com.project.grihosheba.model.DomesticWorker;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkerRepository extends JpaRepository<DomesticWorker, Long> {
}
