package com.juracema.imoveis.controllers;

import com.juracema.imoveis.dto.ImovelAdminResponse;
import com.juracema.imoveis.services.ImovelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/imoveis")
public class ImovelAdminController {

    private final ImovelService imovelService;

    public ImovelAdminController(
            ImovelService imovelService
    ) {
        this.imovelService = imovelService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImovelAdminResponse> buscarPorId(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                imovelService.buscarPorIdAdmin(id)
        );
    }
}