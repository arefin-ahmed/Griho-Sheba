package com.project.grihosheba.repository;

import com.project.grihosheba.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Lets the Customer Dashboard show the payment history for a booking
    List<Payment> findByBookingId(Long bookingId);
}
