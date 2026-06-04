package com.opscore.dto.incident;

import com.opscore.enums.Category;
import com.opscore.enums.IncidentStatus;
import com.opscore.enums.IncidentType;
import com.opscore.enums.Priority;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IncidentResponseDTO {

    private Long id;
    private String title;
    private String description;
    private Category category;

    private Long reportedById;
    private String reportedByName;

    private Long assignedToId;
    private String assignedToName;

    private Long supervisorId;
    private String supervisorName;

    private Long resolvedById;
    private String resolvedByName;

    private Long updatedById;
    private String updatedByName;

    private IncidentType type;
    private IncidentStatus status;
    private Priority priority;
    private Boolean isFalseAlarm;

    private Long areaId;
    private String areaName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}

