package com.juracema.imoveis.controllers;

import com.juracema.imoveis.models.ImovelModel;
import com.juracema.imoveis.repositories.ImovelRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import java.net.URI;
import java.text.Normalizer;
import java.util.Locale;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.stream.Stream;

@RestController
public class ImovelPageController {

    private final ImovelRepository imovelRepository;

    public ImovelPageController(
            ImovelRepository imovelRepository) {
        this.imovelRepository = imovelRepository;
    }

    @GetMapping(value = "/imoveis/{id}/{slug}", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> paginaImovel(
            @PathVariable Long id,
            @PathVariable String slug) throws IOException {

        ImovelModel imovel = imovelRepository
                .findById(id)
                .orElse(null);

        if (imovel == null ||
                !imovel.isDisponivel()) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        String slugCorreto = gerarSlug(imovel.getTitulo());

        if (!slugCorreto.equals(slug)) {

            String urlCorreta = "/imoveis/"
                    + imovel.getId()
                    + "/"
                    + slugCorreto;

            return ResponseEntity
                    .status(HttpStatus.MOVED_PERMANENTLY)
                    .location(URI.create(urlCorreta))
                    .build();
        }

        String titulo = imovel.getTitulo();

        String cidade = imovel.getCidade();

        String bairro = imovel.getBairro();

        String imagemPrincipal = imovel.getImagens()
                .stream()
                .filter(imagem -> imagem.isPrincipal())
                .map(imagem -> imagem.getUrl())
                .findFirst()
                .orElse("");

        String urlImovel = "https://juracemamotaimoveis.com.br"
                + "/imoveis/"
                + imovel.getId()
                + "/"
                + slugCorreto;

        String localizacao = String.join(
                ", ",
                Stream.of(
                        bairro,
                        cidade,
                        imovel.getUf())
                        .filter(valor -> valor != null &&
                                !valor.isBlank())
                        .toList());

        String descricaoSeo = titulo;

        if (!localizacao.isBlank()) {
            descricaoSeo += " em " + localizacao;
        }

        descricaoSeo += ". Confira detalhes, fotos e informações deste imóvel à venda.";

        ClassPathResource resource = new ClassPathResource(
                "templates/ficha-imovel.html");

        String html = new String(
                resource
                        .getInputStream()
                        .readAllBytes(),
                StandardCharsets.UTF_8);

        html = html
                .replace(
                        "{{SEO_TITLE}}",
                        escaparHtml(
                                titulo
                                        + " | Juracema Mota Imóveis"))
                .replace(
                        "{{SEO_DESCRIPTION}}",
                        escaparHtml(descricaoSeo))
                .replace(
                        "{{SEO_URL}}",
                        escaparHtml(urlImovel))
                .replace(
                        "{{SEO_IMAGE}}",
                        escaparHtml(imagemPrincipal));

        return ResponseEntity
                .ok()
                .contentType(
                        MediaType.parseMediaType(
                                "text/html;charset=UTF-8"))
                .body(html);
    }

    private String escaparHtml(String valor) {

        if (valor == null) {
            return "";
        }

        return valor
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    private String gerarSlug(String texto) {

    if (texto == null || texto.isBlank()) {
        return "";
    }

    String normalizado =
            Normalizer.normalize(
                    texto,
                    Normalizer.Form.NFD
            );

    return normalizado
            .replaceAll("\\p{M}", "")
            .toLowerCase(Locale.ROOT)
            .trim()
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("^-+|-+$", "");
    }
}