package com.opscore.service.impl;

import com.opscore.dto.incident.IncidentTimelineResponseDTO;
import com.opscore.entity.Incident;
import com.opscore.enums.IncidentAction;
import com.opscore.entity.IncidentLog;
import com.opscore.entity.User;
import com.opscore.exception.ResourceNotFoundException;
import com.opscore.repository.IncidentLogRepository;
import com.opscore.repository.IncidentRepository;
import com.opscore.service.IncidentLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentLogServiceImpl implements IncidentLogService {
    private final IncidentLogRepository incidentLogRepository;
    private final IncidentRepository incidentRepository;

    @Override
    public void logAction(
            Incident incident,
            User user,
            IncidentAction action,
            String comment
    ) {
        IncidentLog log = IncidentLog.builder()
                .incident(incident)
                .user(user)
                .action(action)
                .comment(comment)
                .createdAt(LocalDateTime.now())
                .build();
        incidentLogRepository.save(log);
    }

    @Override
    public List<IncidentTimelineResponseDTO> getIncidentTimeline(Long incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident not found"));
        List<IncidentLog> logs =
                incidentLogRepository.findByIncidentOrderByCreatedAtAsc(incident);
        return logs.stream()
                .map(this::mapToTimelineDTO)
                .toList();
    }

    private IncidentTimelineResponseDTO mapToTimelineDTO(IncidentLog log) {
        return new IncidentTimelineResponseDTO(
                log.getAction(),
                log.getUser() != null
                        ? log.getUser().getId()
                        : null,
                log.getUser() != null
                        ? log.getUser().getFirstName()
                        : "System",
                log.getComment(),
                log.getCreatedAt()
        );
    }

}