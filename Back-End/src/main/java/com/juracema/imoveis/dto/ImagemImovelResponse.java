package com.juracema.imoveis.dto;

import com.juracema.imoveis.models.ImagemImovelModel;

public class ImagemImovelResponse {

    private Long id;

    private String url;

    private Integer ordem;

    private boolean principal;


    public ImagemImovelResponse(
            ImagemImovelModel imagem
    ) {

        this.id = imagem.getId();
        this.url = imagem.getUrl();
        this.ordem = imagem.getOrdem();
        this.principal = imagem.isPrincipal();
    }


    public Long getId() {
        return id;
    }

    public String getUrl() {
        return url;
    }

    public Integer getOrdem() {
        return ordem;
    }

    public boolean isPrincipal() {
        return principal;
    }
}