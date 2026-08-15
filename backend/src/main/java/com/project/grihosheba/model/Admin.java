package com.project.grihosheba.model;

/**
 * Same design note as {@link Customer}: admins are stored as regular rows
 * in the "users" table with role = "ADMIN". This class models the
 * admin-facing subset of that data and the actions an admin can take
 * (approving/rejecting registrations, resolving complaints, etc.) at the
 * service layer.
 */
public class Admin {

    private Long id;
    private String name;
    private String email;
    private String accessLevel = "STANDARD"; // STANDARD, SUPER

    public Admin() {
    }

    public Admin(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
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

    public String getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(String accessLevel) {
        this.accessLevel = accessLevel;
    }
}
