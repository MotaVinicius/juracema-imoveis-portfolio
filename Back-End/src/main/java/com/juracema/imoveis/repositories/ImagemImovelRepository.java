package com.juracema.imoveis.repositories;

import com.juracema.imoveis.models.ImagemImovelModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImagemImovelRepository
        extends JpaRepository<ImagemImovelModel, Long> {

    List<ImagemImovelModel>
    findByImovelIdOrderByOrdemAsc(Long imovelId);

    Optional<ImagemImovelModel>
    findByIdAndImovelId(
            Long imagemId,
            Long imovelId
    );
}