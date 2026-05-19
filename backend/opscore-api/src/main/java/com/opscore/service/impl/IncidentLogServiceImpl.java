package com.opscore.service.impl;

import com.opscore.entity.Incident;
import com.opscore.enums.IncidentAction;
import com.opscore.entity.IncidentLog;
import com.opscore.entity.User;
import com.opscore.repository.IncidentLogRepository;
import com.opscore.service.IncidentLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class IncidentLogServiceImpl implements IncidentLogService {
    private final IncidentLogRepository incidentLogRepository;

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
}