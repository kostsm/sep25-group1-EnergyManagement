package com.example.heating.controller;

import com.example.heating.dto.HeatingCreateDto;
import com.example.heating.model.HeatingSource;
import com.example.heating.model.HeatingType;
import com.example.heating.service.HeatingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/heating")
@CrossOrigin
public class HeatingController {

    private final HeatingService service;

    public HeatingController(HeatingService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public HeatingSource get(@PathVariable Long id) {
        return service.get(id);
    }

    @GetMapping
    public List<HeatingSource> list() {
        return service.list();
    }

    @PutMapping("/{id}")
    public HeatingSource update(@PathVariable Long id,
                                @RequestBody HeatingSource hs) {
        return service.update(id, hs);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }

    @GetMapping("/by-flat/{flatId}")
    public List<HeatingSource> forFlat(@PathVariable Long flatId) {
        return service.listByFlat(flatId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HeatingSource create(@RequestBody HeatingCreateDto dto) {

        HeatingSource hs = new HeatingSource();
        hs.setType(HeatingType.valueOf(dto.getType())); // basic enum check
        hs.setPower(dto.getPower());
        hs.setFlatId(dto.getFlatId());

        return service.create(hs);
    }


}
