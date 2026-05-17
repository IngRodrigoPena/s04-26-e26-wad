package com.opscore.service;

import com.opscore.dto.assignment.AssignmentRequestDTO;
import com.opscore.dto.assignment.AssignmentResponseDTO;
import com.opscore.entity.Assignment;
import com.opscore.entity.Incident;
import com.opscore.enums.IncidentStatus;
import com.opscore.exception.BadRequestException;
import com.opscore.exception.ResourceNotFoundException;
import com.opscore.repository.AssignmentRepository;
import com.opscore.repository.IncidentRepository;
import com.opscore.security.SecurityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssignmentService {

    private final IncidentRepository incidentRepository;
    private final AssignmentRepository assignmentRepository;

    public AssignmentService(IncidentRepository incidentRepository,
                             AssignmentRepository assignmentRepository) {
        this.incidentRepository = incidentRepository;
        this.assignmentRepository = assignmentRepository;
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

        /*String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();*/

        // 3. Crear Assignment
        Assignment assignment = new Assignment();
        assignment.setIncident(incident);
        assignment.setAssignedTo(request.getAssignedTo());
        // 🔥 Simulación de usuario actual
        assignment.setAssignedBy(SecurityUtils.getCurrentUserEmail());

        // 4. Guardar assignment
        assignmentRepository.save(assignment);

        // 5. Cambiar estado del incidente
        incident.setStatus(IncidentStatus.IN_PROGRESS);
        //quien cambio el estado
        incident.setUpdatedBy(SecurityUtils.getCurrentUserEmail());

        incidentRepository.save(incident);
    }




}
