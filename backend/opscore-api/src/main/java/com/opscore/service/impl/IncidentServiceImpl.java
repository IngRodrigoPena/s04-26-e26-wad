package com.opscore.service.impl;

import com.opscore.dto.assignment.AssignmentResponseDTO;
import com.opscore.dto.incident.IncidentRequestDTO;
import com.opscore.dto.incident.IncidentResponseDTO;
import com.opscore.entity.Area;
import com.opscore.entity.Assignment;
import com.opscore.entity.Incident;
import com.opscore.entity.User;
//import com.opscore.enums.Category;
import com.opscore.enums.IncidentStatus;
import com.opscore.exception.BadRequestException;
import com.opscore.exception.ResourceNotFoundException;
import com.opscore.repository.AreaRepository;
import com.opscore.repository.AssignmentRepository;
import com.opscore.repository.IncidentRepository;
import com.opscore.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final AreaRepository areaRepository;


    public IncidentServiceImpl(IncidentRepository   incidentRepository,
                               AssignmentRepository assignmentRepository,
                               UserRepository       userRepository,
                               AreaRepository       areaRepository
    ) {
        this.incidentRepository   = incidentRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository       = userRepository;
        this.areaRepository       = areaRepository;
    }


    @Override
    public IncidentResponseDTO createIncident(IncidentRequestDTO request) {

        Area area = null;

        if (request.getAreaId() != null) {
            area = areaRepository.findById(request.getAreaId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Area not found"));
        }

        User reportedBy = null;

        if (request.getReportedById() != null) {
            reportedBy = userRepository.findById(request.getReportedById())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Reported user not found"));
        }

        User assignedTo = null;

        if (request.getAssignedToId() != null) {
            assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Assigned user not found"));
        }

        User supervisor = null;

        if (request.getSupervisorId() != null) {
            supervisor = userRepository.findById(request.getSupervisorId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Supervisor not found"));
        }

        // 🔥 Regla de negocio: valores iniciales
        Incident incident = Incident.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .type(request.getType())
                .status(IncidentStatus.OPEN)
                .isFalseAlarm(
                        request.getIsFalseAlarm() != null
                                ? request.getIsFalseAlarm()
                                : false                )
                .area(area)
                .reportedBy(reportedBy)
                .assignedTo(assignedTo)
                .supervisor(supervisor)
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

        dto.setType(incident.getType());
        dto.setIsFalseAlarm(incident.getIsFalseAlarm());

        if (incident.getArea() != null) {
            dto.setAreaId(incident.getArea().getId());
            dto.setAreaName(incident.getArea().getName());
        }

        if (incident.getReportedBy() != null) {
            dto.setReportedById(incident.getReportedBy().getId());
            dto.setReportedByName(
                    incident.getReportedBy().getFirstName()
            );
        }

        if (incident.getAssignedTo() != null) {
            dto.setAssignedToId(incident.getAssignedTo().getId());
            dto.setAssignedToName(
                    incident.getAssignedTo().getFirstName()
            );
        }

        if (incident.getSupervisor() != null) {
            dto.setSupervisorId(incident.getSupervisor().getId());
            dto.setSupervisorName(
                    incident.getSupervisor().getFirstName()
            );
        }

        dto.setCreatedAt(incident.getCreatedAt());
        dto.setUpdatedAt(incident.getUpdatedAt());

        //dto.setResolvedAt(incident.getResolvedAt());

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

