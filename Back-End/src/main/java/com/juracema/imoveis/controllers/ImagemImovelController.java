package com.juracema.imoveis.controllers;

import com.juracema.imoveis.dto.ImagemImovelResponse;
import com.juracema.imoveis.services.ImagemImovelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/imoveis/{imovelId}/imagens")
public class ImagemImovelController {

        private final ImagemImovelService imagemService;

        public ImagemImovelController(
                        ImagemImovelService imagemService) {

                this.imagemService = imagemService;

        }

        @PostMapping
        public ResponseEntity<List<ImagemImovelResponse>> upload(
                        @PathVariable Long imovelId,

                        @RequestParam("imagens") List<MultipartFile> imagens) {

                List<ImagemImovelResponse> resposta = imagemService.salvar(
                                imovelId,
                                imagens);

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(resposta);

        }

        @DeleteMapping("/{imagemId}")
        public ResponseEntity<Void> excluir(
                        @PathVariable Long imovelId,
                        @PathVariable Long imagemId) {

                imagemService.excluir(
                                imovelId,
                                imagemId);

                return ResponseEntity
                                .noContent()
                                .build();
        }

        @PutMapping("/{imagemId}/principal")
        public ResponseEntity<ImagemImovelResponse> definirPrincipal(
                        @PathVariable Long imovelId,
                        @PathVariable Long imagemId) {

                return ResponseEntity.ok(
                                imagemService.definirPrincipal(
                                                imovelId,
                                                imagemId));
        }

        @PutMapping("/ordem")
        public ResponseEntity<List<ImagemImovelResponse>> reordenar(
                        @PathVariable Long imovelId,
                        @RequestBody List<Long> ordemIds) {

                return ResponseEntity.ok(
                                imagemService.reordenar(
                                                imovelId,
                                                ordemIds));
        }
}