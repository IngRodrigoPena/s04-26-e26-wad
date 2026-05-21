package com.opscore.controller;

import com.opscore.dto.assignment.AssignmentResponseDTO;
import com.opscore.dto.incident.IncidentRequestDTO;
import com.opscore.dto.incident.IncidentResponseDTO;
import com.opscore.dto.incident.IncidentTimelineResponseDTO;
import com.opscore.enums.IncidentStatus;
import com.opscore.enums.Priority;
import com.opscore.service.IncidentLogService;
import com.opscore.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;
    private final IncidentLogService incidentLogService;

    @PostMapping
    public ResponseEntity<IncidentResponseDTO> createIncident(
            @Valid @RequestBody IncidentRequestDTO request
    ) {
        IncidentResponseDTO response = incidentService.createIncident(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<IncidentResponseDTO>>
    getIncidents(
            @RequestParam(required = false)
            IncidentStatus status,
            @RequestParam(required = false)
            Priority priority,
            @RequestParam(required = false)
            Long areaId
    ) {
        return ResponseEntity.ok(
                incidentService.getFilteredIncidents(
                        status,
                        priority,
                        areaId
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponseDTO> getIncidentById(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.getIncidentById(id));
    }

    @GetMapping("/{id}/assignments")
    public ResponseEntity<List<AssignmentResponseDTO>> getAssignmentHistory(@PathVariable Long id) {

        List<AssignmentResponseDTO> history = incidentService.getAssignmentHistory(id);

        return ResponseEntity.ok(history);
    }

    //tecnico resuelve incidente
    //@PreAuthorize("hasRole('TECHNICIAN')")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN')")
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<Void> resolveIncident(@PathVariable Long id) {

        incidentService.resolveIncident(id);

        return ResponseEntity.noContent().build();
    }

    //Start
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN')")
    @PatchMapping("/{id}/start")
    public ResponseEntity<Void> startIncident(@PathVariable Long id) {
        incidentService.startIncident(id);
        return ResponseEntity.noContent().build();
    }

    //hold
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN')")
    @PatchMapping("/{id}/hold")
    public ResponseEntity<Void> holdIncident(@PathVariable Long id) {
        incidentService.holdIncident(id);
        return ResponseEntity.noContent().build();
    }

    //cancel
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'ADMIN')")
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelIncident(@PathVariable Long id) {
        incidentService.cancelIncident(id);
        return ResponseEntity.noContent().build();
    }

    //close
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'ADMIN')")
    @PatchMapping("/{id}/close")
    public ResponseEntity<Void> closeIncident(@PathVariable Long id) {
        incidentService.closeIncident(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<List<IncidentTimelineResponseDTO>>
    getIncidentTimeline(@PathVariable Long id) {
        return ResponseEntity.ok(
                incidentLogService.getIncidentTimeline(id)
        );
    }

}

