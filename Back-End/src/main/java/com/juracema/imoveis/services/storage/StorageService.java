package com.juracema.imoveis.services.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    String salvar(
            MultipartFile arquivo,
            Long imovelId
    );

    void excluir(String url);

    void excluirDiretorioDoImovel(
            Long imovelId
    );
}