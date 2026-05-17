package com.opscore.service.impl;

import com.opscore.dto.assignment.AssignmentResponseDTO;
import com.opscore.dto.incident.IncidentRequestDTO;
import com.opscore.dto.incident.IncidentResponseDTO;
import com.opscore.entity.Assignment;
import com.opscore.entity.Incident;
import com.opscore.enums.IncidentStatus;
import com.opscore.exception.BadRequestException;
import com.opscore.exception.ResourceNotFoundException;
import com.opscore.repository.AssignmentRepository;
import com.opscore.repository.IncidentRepository;
import com.opscore.security.SecurityUtils;
import com.opscore.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
//@RequiredArgsConstructor
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;
    private final AssignmentRepository assignmentRepository;

    public IncidentServiceImpl(IncidentRepository incidentRepository,
                               AssignmentRepository assignmentRepository) {
        this.incidentRepository = incidentRepository;
        this.assignmentRepository = assignmentRepository;
    }


    @Override
    public IncidentResponseDTO createIncident(IncidentRequestDTO request) {

        // 🔥 Regla de negocio: valores iniciales
        Incident incident = Incident.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .category(request.getCategory())
                .status(IncidentStatus.OPEN)
                .resolvedAt(null)
                .build();

        Incident saved = incidentRepository.save(incident);

        return mapToResponse(saved);
    }

    // Mapper manual (simple y claro)
    private IncidentResponseDTO mapToResponse(Incident incident) {
        IncidentResponseDTO dto = new IncidentResponseDTO();

        dto.setId(incident.getId());
        dto.setTitle(incident.getTitle());
        dto.setDescription(incident.getDescription());
        dto.setStatus(incident.getStatus());
        dto.setPriority(incident.getPriority());
        dto.setCategory(incident.getCategory());
        dto.setCreatedAt(incident.getCreatedAt());
        dto.setResolvedAt(incident.getResolvedAt());

        return dto;
    }

    @Override
    public List<IncidentResponseDTO> getAllIncidents() {

        return incidentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public IncidentResponseDTO getIncidentById(Long id) {

        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + id));

        return mapToResponse(incident);
    }

    @Override
    public List<AssignmentResponseDTO> getAssignmentHistory(Long incidentId) {

        // 1. Validar que el incidente existe
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Incident with id " + incidentId + " not found"
                ));



        // 2. Obtener asignaciones ordenadas
        List<Assignment> assignments = assignmentRepository
                .findByIncidentIdOrderByAssignedAtDesc(incidentId);

        // 3. Mapear a DTO
        return assignments.stream()
                .map(a -> new AssignmentResponseDTO(
                        a.getAssignedTo(),
                        a.getAssignedBy(),
                        a.getAssignedAt()
                ))
                .toList();
    }

    public void resolveIncident(Long incidentId) {

        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident not found"));

        // Regla: no resolver incidente ya cerrado
        if (incident.getStatus() == IncidentStatus.CLOSED) {
            throw new BadRequestException(
                    "Cannot resolve a CLOSED incident");
        }

        incident.setStatus(IncidentStatus.RESOLVED);

        incident.setResolvedAt(LocalDateTime.now());

        incident.setResolvedBy(SecurityUtils.getCurrentUserEmail());

        incident.setUpdatedBy(SecurityUtils.getCurrentUserEmail());

        incidentRepository.save(incident);
    }

}

