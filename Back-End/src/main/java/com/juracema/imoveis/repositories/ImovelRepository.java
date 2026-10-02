package com.juracema.imoveis.repositories;

import com.juracema.imoveis.models.ImovelModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImovelRepository extends JpaRepository<ImovelModel, Long> {
    List<ImovelModel> findByDisponivelTrueOrderByIdAsc();


}