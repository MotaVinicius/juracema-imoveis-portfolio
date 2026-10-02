package com.juracema.imoveis.dto;

import com.juracema.imoveis.models.TipoImovel;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class ImovelRequest {

    @NotBlank(message = "O título é obrigatório")
    private String titulo;

    @NotNull(message = "O preço é obrigatório")
    @Positive(message = "O preço deve ser maior que zero")
    private BigDecimal preco;

    @PositiveOrZero(message = "A quantidade de quartos não pode ser negativa")
    private Integer quartos;

    @PositiveOrZero(message = "A quantidade de banheiros não pode ser negativa")
    private Integer banheiros;

    @NotNull(message = "A área é obrigatória")
    @Positive(message = "A área deve ser maior que zero")
    private BigDecimal area;

    @PositiveOrZero(message = "A quantidade de vagas não pode ser negativa")
    private Integer vagas;

    @NotNull(message = "O tipo do imóvel é obrigatório")
    private TipoImovel tipo;

    @NotBlank(message = "A cidade é obrigatória")
    private String cidade;

    private String bairro;

    @NotBlank(message = "A UF é obrigatória")
    @Size(min = 2, max = 2, message = "A UF deve possuir 2 caracteres")
    private String uf;

    @Positive(message = "A área construída deve ser maior que zero")
    private BigDecimal areaConstruida;

    @PositiveOrZero(message = "O IPTU não pode ser negativo")
    private BigDecimal iptu;

    @PositiveOrZero(message = "O condomínio não pode ser negativo")
    private BigDecimal condominio;

    private String descricao;

    private boolean destaque;

    private boolean disponivel = true;

    private boolean permuta;

    private String cep;

    private String rua;

    private String numero;

    private String complemento;

    private String nomeProprietario;

    private String telefoneProprietario;

    private String anotacoesInternas;

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

    public void setAreaConstruida(BigDecimal areaConstruida) {
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

    public void setCondominio(BigDecimal condominio) {
        this.condominio = condominio;
    }
}