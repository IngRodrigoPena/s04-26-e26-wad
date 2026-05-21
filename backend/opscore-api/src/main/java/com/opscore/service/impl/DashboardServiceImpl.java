package com.opscore.service.impl;



import com.opscore.dto.incident.IncidentStatusMetricsDTO;
import com.opscore.enums.IncidentStatus;
import com.opscore.repository.IncidentRepository;
import com.opscore.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final IncidentRepository incidentRepository;
    @Override
    public IncidentStatusMetricsDTO getIncidentStatusMetrics() {
        return new IncidentStatusMetricsDTO(
                incidentRepository.count(),
                incidentRepository.countByStatus(IncidentStatus.OPEN),
                incidentRepository.countByStatus(IncidentStatus.ASSIGNED),
                incidentRepository.countByStatus(IncidentStatus.IN_PROGRESS),
                incidentRepository.countByStatus(IncidentStatus.ON_HOLD),
                incidentRepository.countByStatus(IncidentStatus.RESOLVED),
                incidentRepository.countByStatus(IncidentStatus.CLOSED),
                incidentRepository.countByStatus(IncidentStatus.CANCELED)
        );
    }
}