package com.example.flat.service;

import com.example.flat.exception.FlatException;
import com.example.flat.model.Flat;
import com.example.flat.repository.FlatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import com.example.flat.dto.HeatingSourceDto;

import java.util.List;
import java.util.Optional;

@Service
public class FlatService {

    @Autowired
    private FlatRepository flatRepository;

    @Autowired
    private WebClient webClient;

    public Flat createFlat(Flat flat) {
        validateFlat(flat);
        return flatRepository.save(flat);
    }

    public List<Flat> getAllFlats() {
        return flatRepository.findAll();
    }

    public Optional<Flat> getFlatById(Long id) {
        return flatRepository.findById(id);
    }

    public Flat updateFlat(Long id, Flat flatDetails, Long requestingUserId) {
        validateFlat(flatDetails);
        
        Optional<Flat> flatOptional = flatRepository.findById(id);
        if (flatOptional.isEmpty()) {
            throw new FlatException("Flat not found with id: " + id);
        }

        Flat existingFlat = flatOptional.get();
        
        // Authorization check
        if (!existingFlat.getUserId().equals(requestingUserId)) {
            throw new FlatException("You are not authorized to update this flat");
        }

        // Update only non-null fields
        if (StringUtils.hasText(flatDetails.getAddress())) {
            existingFlat.setAddress(flatDetails.getAddress());
        }
        if (StringUtils.hasText(flatDetails.getCity())) {
            existingFlat.setCity(flatDetails.getCity());
        }
        
        return flatRepository.save(existingFlat);
    }

    public void deleteFlat(Long id, Long requestingUserId) {
        Optional<Flat> flatOptional = flatRepository.findById(id);
        if (flatOptional.isEmpty()) {
            throw new FlatException("Flat not found with id: " + id);
        }

        Flat flat = flatOptional.get();
        
        // Authorization check
        if (!flat.getUserId().equals(requestingUserId)) {
            throw new FlatException("You are not authorized to delete this flat");
        }

        // Cascade delete: delete all heating sources for this flat
        String url = "http://localhost:8083/api/heating/by-flat/" + id;
        // Get all heating sources for this flat
        HeatingSourceDto[] sources = webClient.get().uri(url).retrieve().bodyToMono(HeatingSourceDto[].class).block();
        if (sources != null) {
            for (HeatingSourceDto source : sources) {
                webClient.delete().uri("http://localhost:8083/api/heating/" + source.getId()).retrieve().toBodilessEntity().block();
            }
        }

        flatRepository.deleteById(id);
    }

    public List<Flat> getFlatsByUserId(Long userId) {
        return flatRepository.findByUserId(userId);
    }

    private void validateFlat(Flat flat) {
        if (flat == null) {
            throw new FlatException("Flat cannot be null");
        }
        if (!StringUtils.hasText(flat.getAddress())) {
            throw new FlatException("Address is required");
        }
        if (!StringUtils.hasText(flat.getCity())) {
            throw new FlatException("City is required");
        }
        if (flat.getUserId() == null) {
            throw new FlatException("User ID is required");
        }
    }
} 