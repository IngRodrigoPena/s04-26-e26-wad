package com.opscore.service;

import com.opscore.dto.incident.IncidentStatusMetricsDTO;

public interface DashboardService {
    IncidentStatusMetricsDTO getIncidentStatusMetrics();
}
