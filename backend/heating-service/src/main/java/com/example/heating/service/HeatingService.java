package com.example.heating.service;

import com.example.heating.exception.HeatingException;
import com.example.heating.model.HeatingSource;
import com.example.heating.repository.HeatingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HeatingService {

    private final HeatingRepository repo;

    public HeatingService(HeatingRepository repo) {
        this.repo = repo;
    }

    public HeatingSource create(HeatingSource hs) {
        return repo.save(hs);
    }

    public HeatingSource get(Long id) {
        return repo.findById(id)
                .orElseThrow(() ->
                        new HeatingException("Heating source not found: " + id));
    }

    public List<HeatingSource> list() {
        return repo.findAll();
    }

    public List<HeatingSource> listByFlat(Long flatId) {
        return repo.findByFlatId(flatId);
    }


    public HeatingSource update(Long id, HeatingSource data) {
        HeatingSource existing = get(id);
        existing.setType(data.getType());
        existing.setPower(data.getPower());
        existing.setFlatId(data.getFlatId());
        return repo.save(existing);
    }

    public void delete(Long id) { repo.deleteById(id); }

    public Double getTotalHeatingUsage() {
        return repo.getTotalHeatingUsage();
    }

    public Double getAverageHeatingUsage() {
        return repo.getAverageHeatingUsage();
    }

    public Long getTotalHeatingCount() {
        return repo.count();
    }
}
