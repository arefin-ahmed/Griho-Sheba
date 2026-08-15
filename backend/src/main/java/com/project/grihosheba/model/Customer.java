package com.project.grihosheba.model;

/**
 * Griho Sheba stores every account (customer, worker, admin) in a single
 * "users" table distinguished by the `role` field on {@link User}, rather
 * than using JPA table-per-class inheritance. Customer is therefore a thin,
 * non-persisted view/DTO representing the customer-facing subset of a User's
 * data - useful for service-layer methods and for keeping the Class Diagram
 * honest about the Customer role described in the requirements.
 */
public class Customer {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;

    public Customer() {
    }

    public Customer(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
