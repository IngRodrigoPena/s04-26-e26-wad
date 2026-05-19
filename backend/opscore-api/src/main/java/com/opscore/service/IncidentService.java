package com.opscore.service;

import com.opscore.dto.assignment.AssignmentResponseDTO;
import com.opscore.dto.incident.IncidentRequestDTO;
import com.opscore.dto.incident.IncidentResponseDTO;

import java.util.List;

public interface IncidentService {
    IncidentResponseDTO createIncident(IncidentRequestDTO request);

    List<IncidentResponseDTO> getAllIncidents();
    IncidentResponseDTO getIncidentById(Long id);
    List<AssignmentResponseDTO> getAssignmentHistory(Long incidentId);
    //public void resolveIncident(Long incidentId);
    void resolveIncident(Long incidentId);

    void startIncident(Long incidentId);
    void holdIncident(Long incidentId);
    void cancelIncident(Long incidentId);
    void closeIncident(Long incidentId);


}

