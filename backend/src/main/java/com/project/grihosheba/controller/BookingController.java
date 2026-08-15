package com.project.grihosheba.controller;

import com.project.grihosheba.model.Booking;
import com.project.grihosheba.model.Payment;
import com.project.grihosheba.service.BookingService;
import com.project.grihosheba.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;
    private final PaymentService paymentService;

    public BookingController(BookingService bookingService, PaymentService paymentService) {
        this.bookingService = bookingService;
        this.paymentService = paymentService;
    }

    @PostMapping("/book")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        Booking savedBooking = bookingService.createBooking(booking);
        return ResponseEntity.ok(savedBooking);
    }

    @GetMapping("/bookings/customer/{phone}")
    public ResponseEntity<?> getCustomerBookings(@PathVariable String phone) {
        return ResponseEntity.ok(bookingService.getBookingsForCustomer(phone));
    }

    @GetMapping("/bookings/worker/{workerId}")
    public ResponseEntity<?> getWorkerBookings(@PathVariable Long workerId) {
        return ResponseEntity.ok(bookingService.getBookingsForWorker(workerId));
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestBody StatusUpdate update) {
        return ResponseEntity.ok(bookingService.updateStatus(id, update.status));
    }

    @PostMapping("/payments")
    public ResponseEntity<?> recordPayment(@RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.recordPayment(payment));
    }

    public static class StatusUpdate {
        public String status;
    }
}
