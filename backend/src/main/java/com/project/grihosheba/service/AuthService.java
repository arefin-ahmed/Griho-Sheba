package com.project.grihosheba.service;

import com.project.grihosheba.model.User;
import com.project.grihosheba.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;

/**
 * Encapsulates registration, login, and admin approval/rejection logic that
 * previously lived directly inside the controller. Keeping it here lets
 * AuthController stay thin and lets AdminController reuse the same
 * approve/reject rules.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public static class AuthResult {
        public boolean success;
        public String message;
        public User user;

        public static AuthResult ok(User user) {
            AuthResult r = new AuthResult();
            r.success = true;
            r.user = user;
            return r;
        }

        public static AuthResult fail(String message) {
            AuthResult r = new AuthResult();
            r.success = false;
            r.message = message;
            return r;
        }
    }

    public AuthResult register(User user) {
        try {
            LocalDate birthDate = LocalDate.parse(user.getDob());
            int age = Period.between(birthDate, LocalDate.now()).getYears();
            if (age < 18) {
                return AuthResult.fail("Security Block: User must be 18 or older to register.");
            }
        } catch (Exception e) {
            return AuthResult.fail("Invalid Date of Birth format.");
        }

        if (user.getPhone() != null && userRepository.existsByPhone(user.getPhone())) {
            return AuthResult.fail("This phone number is already registered.");
        }

        String normalizedRole = user.getRole() != null ? user.getRole().trim().toUpperCase() : "CUSTOMER";
        user.setRole(normalizedRole);
        user.setStatus("PENDING");
        user.setApproved(false);

        return AuthResult.ok(userRepository.save(user));
    }

    public AuthResult login(String identifier, String password) {
        if (identifier == null || identifier.trim().isEmpty()) {
            return AuthResult.fail("Please enter your email or phone number.");
        }

        Optional<User> userOptional = userRepository.findByPhone(identifier);
        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByEmail(identifier);
        }

        if (userOptional.isEmpty()) {
            return AuthResult.fail("Account not found. Please register first.");
        }

        User existingUser = userOptional.get();
        if (!existingUser.getPassword().equals(password)) {
            return AuthResult.fail("Incorrect password. Please try again.");
        }

        if ("PENDING".equals(existingUser.getStatus())) {
            return AuthResult.fail(
                    "Your account is pending Admin approval. Please wait until an administrator reviews your details and NID.");
        }

        if ("REJECTED".equals(existingUser.getStatus())) {
            return AuthResult.fail(
                    "Registration rejected: National ID mismatch or incorrect details found. Please contact support.");
        }

        return AuthResult.ok(existingUser);
    }

    public List<User> getApprovedWorkers() {
        return userRepository.findByRoleAndStatus("WORKER", "APPROVED");
    }
}
