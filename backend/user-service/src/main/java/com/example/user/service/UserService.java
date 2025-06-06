package com.example.user.service;

import com.example.user.model.User;
import com.example.user.repository.UserRepository;
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
        user.setPassword(password); // TODO: Encrypt password
        userRepository.save(user);
        return "User registered successfully";
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null || !user.getPassword().equals(password)) { // TODO: Encrypt password
            return "Invalid email or password";
        }
        return "User logged in successfully";
    }

    public String getCurrentUser() {
        // TODO: Implement get current user logic
        return "Current user info";
    }
} 