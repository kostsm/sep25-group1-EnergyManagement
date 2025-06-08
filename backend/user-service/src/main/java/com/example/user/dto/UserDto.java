package com.example.user.dto;

public class UserDto {
    private Long id;
    private String email;

    // Constructor
    public UserDto(Long id, String email) {
        this.id = id;
        this.email = email;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }
} 