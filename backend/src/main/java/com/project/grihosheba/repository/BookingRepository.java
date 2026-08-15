package com.project.grihosheba.repository;

import com.project.grihosheba.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Lets the Customer Dashboard find all jobs booked by this customer
    List<Booking> findByCustomerPhone(String customerPhone);

    // Lets the Worker Dashboard find all jobs assigned to this worker
    List<Booking> findByWorkerId(Long workerId);
}