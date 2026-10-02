package com.juracema.imoveis.models;
import jakarta.persistence.Column;
import jakarta.persistence.PrePersist;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "imagens_imoveis")
public class ImagemImovelModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private Integer ordem = 0;

    @Column(nullable = false)
    private boolean principal = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "imovel_id",
            nullable = false
    )
    private ImovelModel imovel;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @PrePersist
    public void prePersist() {

        if (dataAtualizacao == null) {
            dataAtualizacao = LocalDateTime.now();
        }

    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(
            LocalDateTime dataAtualizacao
    ) {
        this.dataAtualizacao =
                dataAtualizacao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Integer getOrdem() {
        return ordem;
    }

    public void setOrdem(Integer ordem) {
        this.ordem = ordem;
    }

    public boolean isPrincipal() {
        return principal;
    }

    public void setPrincipal(boolean principal) {
        this.principal = principal;
    }

    public ImovelModel getImovel() {
        return imovel;
    }

    public void setImovel(ImovelModel imovel) {
        this.imovel = imovel;
    }
}