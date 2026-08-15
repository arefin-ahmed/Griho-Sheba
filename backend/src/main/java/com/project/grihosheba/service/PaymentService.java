package com.project.grihosheba.service;

import com.project.grihosheba.model.Payment;
import com.project.grihosheba.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment recordPayment(Payment payment) {
        payment.setStatus("PAID");
        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentsForBooking(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }
}
