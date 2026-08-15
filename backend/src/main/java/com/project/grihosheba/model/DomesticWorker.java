package com.project.grihosheba.model;

import jakarta.persistence.*;

@Entity
@Table(name = "workers")
public class DomesticWorker {

    @Id
    @Column(name = "worker_id")
    private Long workerId;

    @Column(name = "nid_number", unique = true)
    private String nidNumber;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    private Double rating = 0.00;

    public DomesticWorker() {
    }

    // --- GETTERS AND SETTERS ---
    public Long getWorkerId() {
        return workerId;
    }

    public void setWorkerId(Long workerId) {
        this.workerId = workerId;
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
}