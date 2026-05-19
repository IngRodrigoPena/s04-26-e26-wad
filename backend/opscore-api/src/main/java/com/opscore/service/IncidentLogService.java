package com.opscore.service;

import com.opscore.entity.Incident;
import com.opscore.enums.IncidentAction;
import com.opscore.entity.User;

public interface IncidentLogService {
    void logAction(
            Incident incident,
            User user,
            IncidentAction action,
            String comment
    );
}
