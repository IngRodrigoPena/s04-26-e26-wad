package com.opscore.service;

import com.opscore.dto.assignment.AssignmentRequestDTO;
import com.opscore.dto.assignment.AssignmentResponseDTO;
import com.opscore.entity.Assignment;
import com.opscore.entity.Incident;
import com.opscore.entity.User;
import com.opscore.enums.IncidentAction;
import com.opscore.enums.IncidentStatus;
import com.opscore.exception.BadRequestException;
import com.opscore.exception.ResourceNotFoundException;
import com.opscore.repository.AssignmentRepository;
import com.opscore.repository.IncidentRepository;
import com.opscore.repository.UserRepository;
import com.opscore.security.SecurityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssignmentService {

    private final IncidentRepository    incidentRepository;
    private final AssignmentRepository  assignmentRepository;
    private final UserRepository        userRepository;
    private final IncidentLogService    incidentLogService;

    public AssignmentService(IncidentRepository   incidentRepository,
                             AssignmentRepository assignmentRepository,
                             UserRepository       userRepository,
                             IncidentLogService   incidentLogService) {
        this.incidentRepository   = incidentRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository       = userRepository;
        this.incidentLogService   = incidentLogService;
    }

    public void assignIncident(Long incidentId, AssignmentRequestDTO request) {

        // 1. Validar existencia
        Incident incident = incidentRepository.findById(incidentId)
                //.orElseThrow(() -> new RuntimeException("Incident not found"));
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        // 2. Regla: no asignar CLOSED
        if (incident.getStatus() == IncidentStatus.CLOSED) {
            //throw new RuntimeException("Cannot assign a CLOSED incident");
            throw new BadRequestException("Cannot assign a CLOSED incident");
        }


        // 3. Crear Assignment
        Assignment assignment = new Assignment();
        assignment.setIncident(incident);
        User assignedTo = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Assigned user not found"));

        // 🔥 Simulación de usuario actual
        String currentEmail = SecurityUtils.getCurrentUserEmail();
        User assignedBy = userRepository.findByEmail(currentEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Current user not found"));

        assignment.setIncident(incident);

        User previousAssignee = incident.getAssignedTo();

        assignment.setAssignedTo(assignedTo);

        IncidentAction action =
                previousAssignee == null
                        ? IncidentAction.ASSIGNED
                        : IncidentAction.REASSIGNED;

        /////
        //1. actualizar incident
        //2. guardar incident
        //3. guardar assignment
        //4. crear log
        assignment.setAssignedBy(assignedBy);

        // Actualizar incidente principal
        incident.setAssignedTo(assignedTo);
        incident.setSupervisor(assignedBy);
        incident.setStatus(IncidentStatus.ASSIGNED);
        incident.setUpdatedBy(SecurityUtils.getCurrentUserEmail());
        //guarda incidente
        Incident updatedIncident = incidentRepository.save(incident);
        // Guardar assignment
        assignmentRepository.save(assignment);
        //auditoria
        incidentLogService.logAction(
                incident,
                assignedBy,
                action,
                "Incident assigned to " + assignedTo.getFirstName()
        );
    }
}
