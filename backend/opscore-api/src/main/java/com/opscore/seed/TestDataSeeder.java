package com.opscore.seed;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class TestDataSeeder implements CommandLineRunner {
    @Override
    public void run(String... args) {
        log.info("Starting test data seeder...");
        // TODO:
        // generate test incidents
        // generate assignments
        // generate timelines
        // generate realistic metrics
        log.info("Test data seeder finished.");
    }
}
