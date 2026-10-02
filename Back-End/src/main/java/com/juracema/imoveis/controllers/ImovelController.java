package com.juracema.imoveis.controllers;

import com.juracema.imoveis.dto.ImovelRequest;
import com.juracema.imoveis.dto.ImovelResponse;
import com.juracema.imoveis.services.ImovelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/imoveis")
public class ImovelController {

    private final ImovelService imovelService;

    public ImovelController(ImovelService imovelService) {
        this.imovelService = imovelService;
    }


    /*
     * LISTAR TODOS
     */

    @GetMapping
    public ResponseEntity<List<ImovelResponse>> listarTodos() {

        return ResponseEntity.ok(
                imovelService.listarTodos()
        );
    }


    /*
     * BUSCAR POR ID
     */

    @GetMapping("/{id}")
    public ResponseEntity<ImovelResponse> buscarPorId(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                imovelService.buscarPorId(id)
        );
    }


    /*
     * CRIAR
     */

    @PostMapping
    public ResponseEntity<ImovelResponse> criar(
            @Valid @RequestBody ImovelRequest request
    ) {

        ImovelResponse response =
                imovelService.criar(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    /*
     * ATUALIZAR
     */

    @PutMapping("/{id}")
    public ResponseEntity<ImovelResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ImovelRequest request
    ) {

        return ResponseEntity.ok(
                imovelService.atualizar(id, request)
        );
    }


    /*
     * EXCLUIR
     */

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id
    ) {

        imovelService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}