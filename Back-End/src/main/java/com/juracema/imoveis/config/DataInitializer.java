package com.juracema.imoveis.config;

import com.juracema.imoveis.models.AdminModel;
import com.juracema.imoveis.repositories.AdminRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Profile;

@Configuration

public class DataInitializer {

    @Value("${admin.name}")
    private String adminName;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;


    @Bean
    CommandLineRunner initAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (!adminRepository.existsByUsername(adminUsername)) {

                AdminModel admin = new AdminModel();

                admin.setNome(adminName);

                admin.setUsername(adminUsername);

                admin.setPasswordHash(
                        passwordEncoder.encode(adminPassword)
                );

                admin.setAtivo(true);

                adminRepository.save(admin);

                System.out.println(
                        "Administrador criado com sucesso!"
                );

            } else {

                System.out.println(
                        "Administrador já existe."
                );

            }
        };
    }
}
