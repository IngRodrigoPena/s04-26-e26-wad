package com.opscore.service;

import com.opscore.dto.assignment.AssignmentRequestDTO;
import com.opscore.dto.assignment.AssignmentResponseDTO;
import com.opscore.entity.Assignment;
import com.opscore.entity.Incident;
import com.opscore.entity.User;
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

    private final IncidentRepository incidentRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    public AssignmentService(IncidentRepository   incidentRepository,
                             AssignmentRepository assignmentRepository,
                             UserRepository       userRepository) {
        this.incidentRepository   = incidentRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository       = userRepository;
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
        //assignment.setAssignedTo(request.getAssignedTo());
        User assignedTo = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Assigned user not found"));

        // 🔥 Simulación de usuario actual
        //assignment.setAssignedBy(SecurityUtils.getCurrentUserEmail());
        String currentEmail = SecurityUtils.getCurrentUserEmail();
        User assignedBy = userRepository.findByEmail(currentEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Current user not found"));

        //Assignment assignment = new Assignment();
        assignment.setIncident(incident);
        assignment.setAssignedTo(assignedTo);
        assignment.setAssignedBy(assignedBy);

        // 4. Guardar assignment
        assignmentRepository.save(assignment);

        // 5. Actualizar incidente principal
        incident.setAssignedTo(assignedTo);
        incident.setSupervisor(assignedBy);
        incident.setStatus(IncidentStatus.ASSIGNED);
        incident.setUpdatedBy(SecurityUtils.getCurrentUserEmail());

        incidentRepository.save(incident);
    }
}
