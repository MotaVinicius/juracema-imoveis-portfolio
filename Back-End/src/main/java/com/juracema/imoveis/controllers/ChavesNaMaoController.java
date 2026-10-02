package com.juracema.imoveis.controllers;

import com.juracema.imoveis.services.ChavesNaMaoService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/integracoes/chaves-na-mao")
public class ChavesNaMaoController {

    private final ChavesNaMaoService chavesNaMaoService;


    public ChavesNaMaoController(
            ChavesNaMaoService chavesNaMaoService
    ) {
        this.chavesNaMaoService =
                chavesNaMaoService;
    }


    @GetMapping(
            value = "/imoveis.xml",
            produces = MediaType.APPLICATION_XML_VALUE
    )
    public ResponseEntity<String> gerarXml() {

        return ResponseEntity.ok(
                chavesNaMaoService.gerarXml()
        );

    }

}