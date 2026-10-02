package com.juracema.imoveis.repositories;

import com.juracema.imoveis.models.AdminModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<AdminModel, Long> {

    Optional<AdminModel> findByUsername(String username);

    boolean existsByUsername(String username);
}