package com.project.grihosheba.repository;

import com.project.grihosheba.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByPhone(String phone);

    Optional<User> findByEmail(String email);

    boolean existsByPhone(String phone);

    // Fetch workers by role and status (used for public catalog)
    List<User> findByRoleAndStatus(String role, String status);
}