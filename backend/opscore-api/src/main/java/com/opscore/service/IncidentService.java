package com.opscore.service;

import com.opscore.dto.assignment.AssignmentResponseDTO;
import com.opscore.dto.incident.IncidentRequestDTO;
import com.opscore.dto.incident.IncidentResponseDTO;
import com.opscore.enums.IncidentStatus;
import com.opscore.enums.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IncidentService {
    IncidentResponseDTO createIncident(IncidentRequestDTO request);

    List<IncidentResponseDTO> getAllIncidents();
    IncidentResponseDTO getIncidentById(Long id);
    List<AssignmentResponseDTO> getAssignmentHistory(Long incidentId);
    void resolveIncident(Long incidentId);
    void startIncident(Long incidentId);
    void holdIncident(Long incidentId);
    void cancelIncident(Long incidentId);
    void closeIncident(Long incidentId);

    List<IncidentResponseDTO> getFilteredIncidents(
            IncidentStatus status,
            Priority priority,
            Long areaId
    );

    Page<IncidentResponseDTO> getIncidentsPaginated(
            Pageable pageable
    );


}

