package com.example.user.service;

import com.example.user.model.User;
import com.example.user.repository.UserRepository;
import com.example.user.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String register(String email, String password) {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser != null) {
            return "Email already exists";
        }
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        userRepository.save(user);
        return "User registered successfully";
    }

    public UserDto login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null || !user.getPassword().equals(password)) {
            return null; // Indicate login failure
        }
        return new UserDto(user.getId(), user.getEmail()); // Return UserDto on success
    }

    public String getCurrentUser() {
        return "Current user info";
    }
} 