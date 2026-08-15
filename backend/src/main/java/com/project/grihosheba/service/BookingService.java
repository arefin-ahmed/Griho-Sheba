package com.project.grihosheba.service;

import com.project.grihosheba.model.Booking;
import com.project.grihosheba.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(Booking booking) {
        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsForCustomer(String customerPhone) {
        return bookingRepository.findByCustomerPhone(customerPhone);
    }

    public List<Booking> getBookingsForWorker(Long workerId) {
        return bookingRepository.findByWorkerId(workerId);
    }

    public Booking updateStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}
