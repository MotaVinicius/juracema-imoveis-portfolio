package com.juracema.imoveis.dto;

import com.juracema.imoveis.models.ImovelModel;
import com.juracema.imoveis.models.TipoImovel;

import java.math.BigDecimal;
import java.util.List;

import com.juracema.imoveis.models.ImagemImovelModel;

public class ImovelResponse {

    private Long id;

    private String titulo;

    private BigDecimal preco;

    private Integer quartos;

    private Integer banheiros;

    private BigDecimal area;

    private Integer vagas;

    private TipoImovel tipo;

    private String cidade;

    private String bairro;

    private String uf;

    private String descricao;

    private boolean destaque;

    private boolean disponivel;

    private boolean permuta;

    private BigDecimal areaConstruida;

    private BigDecimal iptu;

    private BigDecimal condominio;

    private String imagemPrincipal;

    private List<ImagemImovelResponse> imagens;


    public ImovelResponse(ImovelModel imovel) {

        this.id = imovel.getId();
        this.titulo = imovel.getTitulo();
        this.preco = imovel.getPreco();
        this.quartos = imovel.getQuartos();
        this.banheiros = imovel.getBanheiros();
        this.area = imovel.getArea();
        this.vagas = imovel.getVagas();
        this.tipo = imovel.getTipo();
        this.cidade = imovel.getCidade();
        this.bairro = imovel.getBairro();
        this.uf = imovel.getUf();
        this.descricao = imovel.getDescricao();
        this.destaque = imovel.isDestaque();
        this.disponivel = imovel.isDisponivel();
        this.permuta = imovel.isPermuta();
        this.areaConstruida = imovel.getAreaConstruida();
        this.iptu = imovel.getIptu();
        this.condominio = imovel.getCondominio();
        this.imagens = imovel.getImagens()
                        .stream()
                        .map(ImagemImovelResponse::new)
                        .toList();
        this.imagemPrincipal = imovel.getImagens()
                        .stream()
                        .filter(
                                ImagemImovelModel::isPrincipal
                        )
                        .findFirst()
                        .map(
                                ImagemImovelModel::getUrl
                        )
                        .orElseGet(() ->
                                imovel.getImagens()
                                        .stream()
                                        .findFirst()
                                        .map(
                                                ImagemImovelModel::getUrl
                                        )
                                        .orElse(null)
                        );
    }


    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public Integer getQuartos() {
        return quartos;
    }

    public Integer getBanheiros() {
        return banheiros;
    }

    public BigDecimal getArea() {
        return area;
    }

    public Integer getVagas() {
        return vagas;
    }

    public TipoImovel getTipo() {
        return tipo;
    }

    public String getCidade() {
        return cidade;
    }

    public String getBairro() {
        return bairro;
    }

    public String getUf() {
        return uf;
    }

    public String getDescricao() {
        return descricao;
    }

    public boolean isDestaque() {
        return destaque;
    }

    public boolean isDisponivel() {
        return disponivel;
    }

    public boolean isPermuta() {
        return permuta;
    }

    public BigDecimal getAreaConstruida() {
        return areaConstruida;
    }

    public BigDecimal getIptu() {
        return iptu;
    }

    public BigDecimal getCondominio() {
        return condominio;
    }

    public String getImagemPrincipal() {
        return imagemPrincipal;
    }

    public List<ImagemImovelResponse> getImagens() {
        return imagens;
    }
}