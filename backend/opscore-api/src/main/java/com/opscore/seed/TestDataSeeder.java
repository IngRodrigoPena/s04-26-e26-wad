package com.opscore.seed;

import com.opscore.entity.Area;
import com.opscore.entity.Incident;
import com.opscore.entity.User;
import com.opscore.enums.Category;
import com.opscore.enums.IncidentStatus;
import com.opscore.enums.Priority;
import com.opscore.enums.IncidentType;
import com.opscore.repository.AreaRepository;
import com.opscore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import com.opscore.repository.IncidentRepository;

import java.util.List;
import java.util.Random;

@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class TestDataSeeder implements CommandLineRunner {

    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final AreaRepository areaRepository;

    private final Random random = new Random();

    private static final int INCIDENTS_TO_GENERATE = 25;

    private final List<String> incidentTitles = List.of(
            "VPN connection issue",
            "Email service unavailable",
            "Production machine stopped",
            "Unauthorized access detected",
            "Database latency spike",
            "Network outage in warehouse",
            "Printer not responding",
            "Application login failure",
            "Security camera offline",
            "Quality inspection failed"
    );

    private final List<String> incidentDescriptions = List.of(
            "Users are unable to complete their daily operations.",
            "System performance degradation detected.",
            "Equipment stopped unexpectedly during operation.",
            "Access denied for authorized personnel.",
            "Multiple connection retries detected.",
            "Incident reported by monitoring system.",
            "Intermittent service interruptions observed.",
            "Critical workflow affected by outage.",
            "Issue requires immediate technical review.",
            "Temporary workaround currently in place."
    );

    @Override
    public void run(String... args) {
        long incidentCount = incidentRepository.count();
        //if (incidentCount > 0) { probando el seeder
        if (incidentCount > 150) {
            log.info("Test data already exists. Seeder skipped.");
            return;
        }
        log.info("Starting test data seeder...");
        // TODO generate data
        seedIncidents();
        log.info("Test data seeder finished.");
    }

    private void seedIncidents() {

        List<User> operators =
                userRepository.findByActiveTrueAndRoleNameIn(
                        List.of("OPERATOR")
                );
        List<User> technicians =
                userRepository.findByActiveTrueAndRoleNameIn(
                        List.of("TECHNICIAN")
                );
        List<User> supervisors =
                userRepository.findByActiveTrueAndRoleNameIn(
                        List.of("SUPERVISOR")
                );
        List<Area> areas = areaRepository.findAll();

        if (
                operators.isEmpty() ||
                        technicians.isEmpty() ||
                        supervisors.isEmpty() ||
                        areas.isEmpty()
        ) {
            log.warn("Required seed data not found.");
            return;
        }

        for (int i = 0; i < INCIDENTS_TO_GENERATE; i++) {
            User operator   = randomElement(operators);
            User technician = randomElement(technicians);
            User supervisor = randomElement(supervisors);
            Area area       = randomElement(areas);
            Incident incident = Incident.builder()
                    .title(randomElement(incidentTitles))
                    .description(randomElement(incidentDescriptions))
                    .category(randomCategory())
                    .type(randomIncidentType())
                    .status(randomStatus())
                    .priority(randomPriority())
                    .area(area)
                    .reportedBy(operator)
                    .assignedTo(technician)
                    .supervisor(supervisor)
                    .isFalseAlarm(false)
                    .updatedBy(operator)
                    .build();
            incidentRepository.save(incident);
        }

        //log.info("Seeded incident with id {}", savedIncident.getId());
        log.info("Generated {} incidents", INCIDENTS_TO_GENERATE);
    }

    private <T> T randomElement(List<T> list) {
        return list.get(random.nextInt(list.size()));
    }

    private IncidentStatus randomStatus() {
        int value = random.nextInt(100);
        if (value < 15)
            return IncidentStatus.OPEN;
        if (value < 35)
            return IncidentStatus.ASSIGNED;
        if (value < 60)
            return IncidentStatus.IN_PROGRESS;
        if (value < 65)
            return IncidentStatus.ON_HOLD;
        if (value < 80)
            return IncidentStatus.RESOLVED;
        if (value < 95)
            return IncidentStatus.CLOSED;
        return IncidentStatus.CANCELED;
    }

    private Priority randomPriority() {
        int value = random.nextInt(100);
        if (value < 15)
            return Priority.LOW;
        if (value < 60)
            return Priority.MEDIUM;
        if (value < 90)
            return Priority.HIGH;
        return Priority.CRITICAL;
    }

    private Category randomCategory() {
        return randomElement(
                List.of(
                        Category.OPERATIONS,
                        Category.MAINTENANCE,
                        Category.QUALITY,
                        Category.SAFETY
                )
        );
    }

    private IncidentType randomIncidentType() {
        return randomElement(
                List.of(
                        IncidentType.NETWORK,
                        IncidentType.SOFTWARE,
                        IncidentType.HARDWARE,
                        IncidentType.ACCESS,
                        IncidentType.SECURITY,
                        IncidentType.MACHINE_FAILURE
                )
        );
    }
}
