package com.opscore.controller;

import com.opscore.dto.incident.IncidentStatusMetricsDTO;
import com.opscore.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;
    @GetMapping("/incidents/status")
    public ResponseEntity<IncidentStatusMetricsDTO>
    getIncidentStatusMetrics() {
        return ResponseEntity.ok(
                dashboardService.getIncidentStatusMetrics()
        );
    }
}
