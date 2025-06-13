package com.example.heating.repository;

import com.example.heating.model.HeatingSource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HeatingRepository extends JpaRepository<HeatingSource, Long> {
    List<HeatingSource> findByFlatId(Long flatId);
}