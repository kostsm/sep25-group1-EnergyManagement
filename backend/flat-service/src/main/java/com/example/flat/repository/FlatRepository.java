package com.example.flat.repository;

import com.example.flat.model.Flat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlatRepository extends JpaRepository<Flat, Long> {
    // Custom query methods can be added here if needed, e.g., findByUserId
    List<Flat> findByUserId(Long userId);
} 