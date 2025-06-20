package com.example.statistics;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
public class StatisticsController {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String HEATING_SERVICE_URL = "http://localhost:8083/api/heating";
    private final String FLAT_SERVICE_URL = "http://localhost:8082/api/flats";

    @GetMapping("/api/statistics/total-flats")
    public Map<String, Object> getTotalFlats() {
        Map<String, Object> result = new HashMap<>();
        try {
            ResponseEntity<Object[]> response = restTemplate.getForEntity(FLAT_SERVICE_URL, Object[].class);
            int count = response.getBody() != null ? response.getBody().length : 0;
            result.put("totalFlats", count);
        } catch (Exception e) {
            result.put("totalFlats", null);
            result.put("error", "Failed to fetch total flats");
        }
        return result;
    }

    @GetMapping("/api/statistics/total-heating-usage")
    public Map<String, Object> getTotalHeatingUsage() {
        Map<String, Object> result = new HashMap<>();
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(HEATING_SERVICE_URL + "/total-usage", Map.class);
            result.put("totalHeatingUsage", response.getBody().get("totalHeatingUsage"));
        } catch (Exception e) {
            result.put("totalHeatingUsage", null);
            result.put("error", "Failed to fetch total heating usage");
        }
        return result;
    }

    @GetMapping("/api/statistics/average-heating-usage")
    public Map<String, Object> getAverageHeatingUsage() {
        Map<String, Object> result = new HashMap<>();
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(HEATING_SERVICE_URL + "/average-usage", Map.class);
            result.put("averageHeatingUsage", response.getBody().get("averageHeatingUsage"));
        } catch (Exception e) {
            result.put("averageHeatingUsage", null);
            result.put("error", "Failed to fetch average heating usage");
        }
        return result;
    }
} 