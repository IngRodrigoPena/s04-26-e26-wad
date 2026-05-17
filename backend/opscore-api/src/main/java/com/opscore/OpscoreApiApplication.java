package com.opscore;

import com.opscore.entity.Area;
import com.opscore.entity.User;
import com.opscore.entity.Role;
//import com.opscore.enums.Role;
import com.opscore.repository.AreaRepository;
import com.opscore.repository.RoleRepository;
import com.opscore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@EnableJpaAuditing
@SpringBootApplication
@RequiredArgsConstructor
public class OpscoreApiApplication {

	private final RoleRepository roleRepository;
	private final AreaRepository areaRepository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;


	public static void main(String[] args) {
		SpringApplication.run(OpscoreApiApplication.class, args);
	}

	@Bean
	CommandLineRunner init() {

		return args -> {

			// =========================
			// ROLES
			// =========================

			Role adminRole = roleRepository.findByName("ADMIN")
					.orElseGet(() -> {
						Role role = new Role();
						role.setName("ADMIN");
						role.setDescription("System administrator");
						return roleRepository.save(role);
					});

			Role supervisorRole = roleRepository.findByName("SUPERVISOR")
					.orElseGet(() -> {
						Role role = new Role();
						role.setName("SUPERVISOR");
						role.setDescription("Supervisor");
						return roleRepository.save(role);
					});

			Role technicianRole = roleRepository.findByName("TECHNICIAN")
					.orElseGet(() -> {
						Role role = new Role();
						role.setName("TECHNICIAN");
						role.setDescription("Technician");
						return roleRepository.save(role);
					});

			/*Role userRole = roleRepository.findByName("USER")
					.orElseGet(() -> {
						Role role = new Role();
						role.setName("USUARIO");
						role.setDescription("Usuario");
						return roleRepository.save(role);
					});*/

			// =========================
			// AREA
			// =========================

			Area productionArea = areaRepository.findByName("PRODUCTION")
					.orElseGet(() -> {
						Area area = new Area();
						area.setName("PRODUCTION");
						area.setDescription("Production area");
						area.setColor("#FF5733");
						return areaRepository.save(area);
					});

			// =========================
			// ADMIN USER
			// =========================

			if (!userRepository.existsByEmail("admin@opscore.com")) {

				User admin = User.builder()
						.firstName("System")
						.lastName("Admin")
						.email("admin@opscore.com")
						.password(passwordEncoder.encode("abcd1234"))
						.role(adminRole)
						.area(productionArea)
						.createdAt(LocalDateTime.now())
						.build();

				userRepository.save(admin);
			}
		};
	}



	/*@Bean
	CommandLineRunner init(UserRepository repo, PasswordEncoder encoder) {
		return args -> {

			if (repo.findByUsername("admin").isEmpty()) {

				User user = new User();
				user.setUsername("admin");

				user.setRole(Role.ADMIN);

				user.setPassword(encoder.encode("1234"));

                user.setEnabled(true);

				repo.save(user);
			}
		};
	}*/


}
