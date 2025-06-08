package com.example.flat.controller;

import com.example.flat.model.Flat;
import com.example.flat.service.FlatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/flats")
public class FlatController {

    @Autowired
    private FlatService flatService;

    @PostMapping
    public ResponseEntity<Flat> createFlat(@RequestBody Flat flat) {
        Flat createdFlat = flatService.createFlat(flat);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdFlat);
    }

    @GetMapping
    public ResponseEntity<List<Flat>> getAllFlats() {
        List<Flat> flats = flatService.getAllFlats();
        return ResponseEntity.ok(flats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flat> getFlatById(@PathVariable Long id) {
        Optional<Flat> flat = flatService.getFlatById(id);
        return flat.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Flat> updateFlat(
            @PathVariable Long id,
            @RequestBody Flat flatDetails,
            @RequestHeader("X-User-ID") Long userId) {
        Flat updatedFlat = flatService.updateFlat(id, flatDetails, userId);
        return ResponseEntity.ok(updatedFlat);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlat(
            @PathVariable Long id,
            @RequestHeader("X-User-ID") Long userId) {
        flatService.deleteFlat(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Flat>> getFlatsByUserId(@PathVariable Long userId) {
        List<Flat> flats = flatService.getFlatsByUserId(userId);
        return ResponseEntity.ok(flats);
    }

    // TODO: Add endpoints for filtering/finding flats by user, neighborhood, etc.
} 