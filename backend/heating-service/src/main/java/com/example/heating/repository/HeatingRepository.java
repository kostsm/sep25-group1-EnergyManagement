package com.example.heating.repository;

import com.example.heating.model.HeatingSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HeatingRepository extends JpaRepository<HeatingSource, Long> {
    List<HeatingSource> findByFlatId(Long flatId);

    @Query("SELECT SUM(h.power) FROM HeatingSource h")
    Double getTotalHeatingUsage();

    @Query("SELECT AVG(h.power) FROM HeatingSource h")
    Double getAverageHeatingUsage();
}