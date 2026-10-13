package com.cravelle.config;

import com.cravelle.entity.Role;
import com.cravelle.entity.User;
import com.cravelle.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        initUsers();
    }

    private void initUsers() {
        createOrUpdateUser("Cravelle Administrator", "admin@cravelle.com", "Cravelle123!", Role.ROLE_ADMIN);
        createOrUpdateUser("Rahul Sharma (Student @ PES)", "rahul@example.com", "Cravelle123!", Role.ROLE_CUSTOMER);
        createOrUpdateUser("Priya Nair (Techie @ Prestige Tech Park)", "priya@example.com", "Cravelle123!", Role.ROLE_CUSTOMER);
    }

    private void createOrUpdateUser(String name, String email, String password, Role role) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isEmpty()) {
            User user = new User(name, email, passwordEncoder.encode(password), role);
            userRepository.save(user);
            logger.info("Initialized user account: {} [{}]", email, role);
        } else {
            // Update password hash to guarantee successful login
            User user = existing.get();
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            userRepository.save(user);
        }
    }
}
