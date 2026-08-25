package com.project.grihosheba.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "workers")
public class DomesticWorker {

    @Id
    @Column(name = "worker_id")
    private Long workerId;

    // This securely links the worker profile to their verified user identity
    @OneToOne
    @JoinColumn(name = "worker_id", insertable = false, updatable = false)
    @JsonIgnore // Prevents infinite recursion when converting to JSON
    private User user;

    private String nidNumber;
    private Boolean isVerified;
    private Boolean isAvailable;
    private Double rating;

    // ==========================================
    // Custom Getters for React Frontend
    // Spring Boot will automatically include these in the API response
    // ==========================================

    public Long getId() {
        return workerId;
    }

    public String getName() {
        return user != null ? user.getName() : "Unknown Worker";
    }

    public String getSpecialty() {
        return user != null ? user.getSpecialty() : "General Service";
    }

    public String getExperience() {
        return user != null ? user.getExperience() : "Not specified";
    }

    // ==========================================
    // Standard Getters and Setters
    // ==========================================

    public Long getWorkerId() {
        return workerId;
    }

    public void setWorkerId(Long workerId) {
        this.workerId = workerId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getNidNumber() {
        return nidNumber;
    }

    public void setNidNumber(String nidNumber) {
        this.nidNumber = nidNumber;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getPhotoUrl() {
        return user != null ? user.getPhotoUrl() : null;
    }
}