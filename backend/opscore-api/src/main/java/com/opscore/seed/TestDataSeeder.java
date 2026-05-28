package com.opscore.seed;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import com.opscore.repository.IncidentRepository;

@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class TestDataSeeder implements CommandLineRunner {

    private final IncidentRepository incidentRepository;

    @Override
    public void run(String... args) {
        long incidentCount = incidentRepository.count();
        if (incidentCount > 0) {
            log.info("Test data already exists. Seeder skipped.");
            return;
        }
        log.info("Starting test data seeder...");
        // TODO generate data
        log.info("Test data seeder finished.");
    }
}
