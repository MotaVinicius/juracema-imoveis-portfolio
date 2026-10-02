package com.juracema.imoveis.models;

import jakarta.persistence.*;

import java.math.BigDecimal;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import java.time.LocalDateTime;

@Entity
@Table(name = "imoveis")
public class ImovelModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal preco;

    private Integer quartos;

    private Integer banheiros;

    @Column(precision = 10, scale = 2)
    private BigDecimal area;

    private Integer vagas;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoImovel tipo;

    @Column(nullable = false)
    private String cidade;

    private String bairro;

    @Column(nullable = false, length = 2)
    private String uf;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private boolean destaque = false;

    @Column(nullable = false)
    private boolean disponivel = true;

    @Column(nullable = false)
    private boolean permuta = false;

    @Column
    private BigDecimal areaConstruida;

    @Column
    private BigDecimal iptu;

    @Column
    private BigDecimal condominio;

    private String cep;

    private String rua;

    private String numero;

    private String complemento;

    private String nomeProprietario;

    private String telefoneProprietario;

    @Column(columnDefinition = "TEXT")
    private String anotacoesInternas;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getRua() {
        return rua;
    }

    public void setRua(String rua) {
        this.rua = rua;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public String getNomeProprietario() {
        return nomeProprietario;
    }

    public void setNomeProprietario(String nomeProprietario) {
        this.nomeProprietario = nomeProprietario;
    }

    public String getTelefoneProprietario() {
        return telefoneProprietario;
    }

    public void setTelefoneProprietario(String telefoneProprietario) {
        this.telefoneProprietario = telefoneProprietario;
    }

    public String getAnotacoesInternas() {
        return anotacoesInternas;
    }

    public void setAnotacoesInternas(String anotacoesInternas) {
        this.anotacoesInternas = anotacoesInternas;
    }

    @OneToMany(mappedBy = "imovel", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordem ASC")
    private List<ImagemImovelModel> imagens = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public Integer getQuartos() {
        return quartos;
    }

    public void setQuartos(Integer quartos) {
        this.quartos = quartos;
    }

    public Integer getBanheiros() {
        return banheiros;
    }

    public void setBanheiros(Integer banheiros) {
        this.banheiros = banheiros;
    }

    public BigDecimal getArea() {
        return area;
    }

    public void setArea(BigDecimal area) {
        this.area = area;
    }

    public Integer getVagas() {
        return vagas;
    }

    public void setVagas(Integer vagas) {
        this.vagas = vagas;
    }

    public TipoImovel getTipo() {
        return tipo;
    }

    public void setTipo(TipoImovel tipo) {
        this.tipo = tipo;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public boolean isDestaque() {
        return destaque;
    }

    public void setDestaque(boolean destaque) {
        this.destaque = destaque;
    }

    public boolean isDisponivel() {
        return disponivel;
    }

    public void setDisponivel(boolean disponivel) {
        this.disponivel = disponivel;
    }

    public boolean isPermuta() {
        return permuta;
    }

    public void setPermuta(boolean permuta) {
        this.permuta = permuta;
    }

    public BigDecimal getAreaConstruida() {
        return areaConstruida;
    }

    public void setAreaConstruida(
            BigDecimal areaConstruida) {
        this.areaConstruida = areaConstruida;
    }

    public BigDecimal getIptu() {
        return iptu;
    }

    public void setIptu(BigDecimal iptu) {
        this.iptu = iptu;
    }

    public BigDecimal getCondominio() {
        return condominio;
    }

    public void setCondominio(
            BigDecimal condominio) {
        this.condominio = condominio;
    }

    public List<ImagemImovelModel> getImagens() {
        return imagens;
    }

    public void setImagens(
            List<ImagemImovelModel> imagens) {
        this.imagens = imagens;
    }

    @PrePersist
    public void prePersist() {

        if (dataAtualizacao == null) {
            dataAtualizacao = LocalDateTime.now();
        }

    }

    @PreUpdate
    public void preUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(
            LocalDateTime dataAtualizacao
    ) {
        this.dataAtualizacao = dataAtualizacao;
    }
}
