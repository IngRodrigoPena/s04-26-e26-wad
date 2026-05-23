package com.opscore.service.impl;

import com.opscore.dto.assignment.AssignmentResponseDTO;
import com.opscore.dto.incident.IncidentRequestDTO;
import com.opscore.dto.incident.IncidentResponseDTO;
import com.opscore.entity.Area;
import com.opscore.entity.Assignment;
import com.opscore.entity.Incident;
import com.opscore.entity.User;
import com.opscore.enums.IncidentAction;
import com.opscore.enums.IncidentStatus;
import com.opscore.exception.BadRequestException;
import com.opscore.exception.ResourceNotFoundException;
import com.opscore.repository.AreaRepository;
import com.opscore.repository.AssignmentRepository;
import com.opscore.repository.IncidentRepository;
import com.opscore.repository.UserRepository;
import com.opscore.security.SecurityUtils;
import com.opscore.service.IncidentLogService;
import com.opscore.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import com.opscore.enums.IncidentStatus;
import com.opscore.enums.Priority;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
//@RequiredArgsConstructor
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository    incidentRepository;
    private final AssignmentRepository  assignmentRepository;
    private final UserRepository        userRepository;
    private final AreaRepository        areaRepository;
    private final IncidentLogService    incidentLogService;


    public IncidentServiceImpl(IncidentRepository   incidentRepository,
                               AssignmentRepository assignmentRepository,
                               UserRepository       userRepository,
                               AreaRepository       areaRepository,
                               IncidentLogService   incidentLogService
    ) {
        this.incidentRepository   = incidentRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository       = userRepository;
        this.areaRepository       = areaRepository;
        this.incidentLogService   = incidentLogService;

    }

    //helper
    private User getCurrentAuthenticatedUser() {
        String currentEmail = SecurityUtils.getCurrentUserEmail();
        return userRepository.findByEmail(currentEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Current user not found"));
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
        //auditoria
        incidentLogService.logAction(
                saved,
                saved.getReportedBy(),
                IncidentAction.INCIDENT_CREATED,
                "Incidente creado por " + (saved.getReportedBy() != null ? saved.getReportedBy().getFirstName() : "Sistema")
        );

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
                        a.getId(),
                        a.getIncident().getId(),
                        a.getAssignedTo().getId(),
                        a.getAssignedTo().getFirstName(),
                        a.getAssignedBy().getId(),
                        a.getAssignedBy().getFirstName(),
                        a.getAssignedAt()
                ))
                .toList();
    }

    public IncidentResponseDTO resolveIncident(Long incidentId, String comment) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident not found"));

        // Regla: no resolver incidente ya cerrado
        if (incident.getStatus() == IncidentStatus.CLOSED) {
            throw new BadRequestException(
                    "Cannot resolve a CLOSED incident");
        }

        User currentUser = getCurrentAuthenticatedUser();

        incident.setStatus(IncidentStatus.RESOLVED);
        incident.setResolvedAt(LocalDateTime.now());
        incident.setResolvedBy(SecurityUtils.getCurrentUserEmail());
        incident.setUpdatedBy(SecurityUtils.getCurrentUserEmail());

        Incident updatedIncident = incidentRepository.save(incident);

        //auditoria
        incidentLogService.logAction(
                incident,
                currentUser,
                IncidentAction.RESOLVED,
                comment != null ? comment : "Incidente resuelto"
        );

        return mapToResponse(updatedIncident);
    }

    @Override
    public IncidentResponseDTO startIncident(Long incidentId, String comment) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident not found"));
        if (   incident.getStatus() != IncidentStatus.ASSIGNED &&
               incident.getStatus() != IncidentStatus.ON_HOLD
        ) {
            throw new BadRequestException(
                    "Only ASSIGNED or ON_HOLD incidents can be started");
        }

        User currentUser = getCurrentAuthenticatedUser();
        incident.setStatus(IncidentStatus.IN_PROGRESS);
        incident.setUpdatedBy(SecurityUtils.getCurrentUserEmail());

        Incident updatedIncident = incidentRepository.save(incident);

        //auditoria
        incidentLogService.logAction(
                incident,
                currentUser,
                IncidentAction.STARTED,
                comment != null ? comment : "Trabajo iniciado"
        );

        return mapToResponse(updatedIncident);
    }

    @Override
    public IncidentResponseDTO holdIncident(Long incidentId, String comment) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident not found"));
        if (incident.getStatus() != IncidentStatus.IN_PROGRESS) {
            throw new BadRequestException(
                    "Only IN_PROGRESS incidents can be put on hold");
        }

        User currentUser = getCurrentAuthenticatedUser();

        incident.setStatus(IncidentStatus.ON_HOLD);
        incident.setUpdatedBy(SecurityUtils.getCurrentUserEmail());

        Incident updatedIncident = incidentRepository.save(incident);

        //auditoria
        incidentLogService.logAction(
                incident,
                currentUser,
                IncidentAction.PUT_ON_HOLD,
                comment != null ? comment : "Incidente en espera"
        );

        return mapToResponse(updatedIncident);
    }

    @Override
    public IncidentResponseDTO cancelIncident(Long incidentId, String comment) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident not found"));
        if (
                incident.getStatus() == IncidentStatus.CLOSED ||
                        incident.getStatus() == IncidentStatus.RESOLVED
        ) {
            throw new BadRequestException(
                    "Cannot cancel resolved or closed incidents");
        }

        User currentUser = getCurrentAuthenticatedUser();

        incident.setStatus(IncidentStatus.CANCELED);
        incident.setUpdatedBy(SecurityUtils.getCurrentUserEmail());


        Incident updatedIncident = incidentRepository.save(incident);

        //auditoria
        incidentLogService.logAction(
                incident,
                currentUser,
                IncidentAction.CANCELED,
                comment != null ? comment : "Incidente cancelado"
        );

        return mapToResponse(updatedIncident);
    }

    @Override
    public IncidentResponseDTO closeIncident(Long incidentId, String comment) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident not found"));
        if (incident.getStatus() != IncidentStatus.RESOLVED) {
            throw new BadRequestException(
                    "Only RESOLVED incidents can be closed");
        }

        User currentUser = getCurrentAuthenticatedUser();

        incident.setStatus(IncidentStatus.CLOSED);
        incident.setUpdatedBy(SecurityUtils.getCurrentUserEmail());

        Incident updatedIncident = incidentRepository.save(incident);

        //auditoria
        incidentLogService.logAction(
                incident,
                currentUser,
                IncidentAction.CLOSED,
                comment != null ? comment : "Incidente cerrado"
        );

        return mapToResponse(updatedIncident);
    }

    @Override
    public List<IncidentResponseDTO> getFilteredIncidents(
            IncidentStatus status,
            Priority priority,
            Long areaId
    ) {
        List<Incident> incidents;
        // status + priority
        if (status != null && priority != null) {
            incidents = incidentRepository
                    .findByStatusAndPriority(status, priority);
        }
        // status
        else if (status != null) {
            incidents = incidentRepository.findByStatus(status);
        }
        // priority
        else if (priority != null) {
            incidents = incidentRepository.findByPriority(priority);
        }
        // area
        else if (areaId != null) {
            incidents = incidentRepository.findByAreaId(areaId);
        }
        // all
        else {
            incidents = incidentRepository.findAll();
        }
        return incidents.stream()
                .map(this::mapToResponse)
                .toList();
    }

    //paginacion
    @Override
    public Page<IncidentResponseDTO>
    getIncidentsPaginated(Pageable pageable) {
        return incidentRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

}

