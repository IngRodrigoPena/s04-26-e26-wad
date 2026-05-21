package com.opscore.repository;

import com.opscore.entity.Incident;
import com.opscore.enums.IncidentStatus;
import com.opscore.enums.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    long countByStatus(IncidentStatus status);
    long countByPriority(Priority priority);
}


