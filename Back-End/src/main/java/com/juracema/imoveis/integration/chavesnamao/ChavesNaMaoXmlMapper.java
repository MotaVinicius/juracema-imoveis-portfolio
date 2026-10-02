package com.juracema.imoveis.integration.chavesnamao;

import com.juracema.imoveis.models.ImagemImovelModel;

import java.text.Normalizer;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import com.juracema.imoveis.models.ImovelModel;
import com.juracema.imoveis.models.TipoImovel;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.Locale;

@Component
public class ChavesNaMaoXmlMapper {

        private static final String SITE_URL = "https://juracemamotaimoveis.com.br";

        private static final DateTimeFormatter DATA_HORA_FORMATTER = DateTimeFormatter.ofPattern(
                        "yyyy-MM-dd HH:mm:ss");

        public String mapear(ImovelModel imovel) {

                validarImovel(imovel);

                StringBuilder xml = new StringBuilder();

                xml.append("        <imovel>\n");

                adicionarTag(
                                xml,
                                "referencia",
                                "JM-" + imovel.getId());

                adicionarTag(
                                xml,
                                "codigo_cliente",
                                "JM-" + imovel.getId());

                adicionarTag(
                                xml,
                                "link_cliente",
                                SITE_URL
                                                + "/imoveis/"
                                                + imovel.getId()
                                                + "/"
                                                + gerarSlug(imovel.getTitulo()));

                adicionarTag(
                                xml,
                                "titulo",
                                imovel.getTitulo());

                adicionarTag(
                                xml,
                                "transacao",
                                "V");

                adicionarTag(
                                xml,
                                "transacao2",
                                "");

                adicionarTag(
                                xml,
                                "finalidade",
                                mapearFinalidade(
                                                imovel));

                adicionarTag(
                                xml,
                                "finalidade2",
                                "");

                adicionarTag(
                                xml,
                                "destaque",
                                imovel.isDestaque()
                                                ? "1"
                                                : "0");

                adicionarTag(
                                xml,
                                "tipo",
                                mapearTipo(
                                                imovel));

                adicionarTag(
                                xml,
                                "tipo2",
                                "");

                adicionarTag(
                                xml,
                                "valor",
                                imovel.getPreco());

                adicionarTag(
                                xml,
                                "valor_locacao",
                                "");

                adicionarTag(
                                xml,
                                "valor_iptu",
                                imovel.getIptu());

                adicionarTag(
                                xml,
                                "valor_condominio",
                                imovel.getCondominio());

                adicionarTag(
                                xml,
                                "area_total",
                                imovel.getTipo() == TipoImovel.APARTAMENTO
                                                ? ""
                                                : imovel.getArea());

                adicionarTag(
                                xml,
                                "area_util",
                                imovel.getAreaConstruida());

                adicionarTag(
                                xml,
                                "conservacao",
                                "");

                adicionarTag(
                                xml,
                                "quartos",
                                imovel.getQuartos());

                adicionarTag(
                                xml,
                                "suites",
                                "");

                adicionarTag(
                                xml,
                                "garagem",
                                imovel.getVagas());

                adicionarTag(
                                xml,
                                "banheiro",
                                imovel.getBanheiros());

                adicionarTag(
                                xml,
                                "closet",
                                "");

                adicionarTag(
                                xml,
                                "salas",
                                "");

                adicionarTag(
                                xml,
                                "despensa",
                                "");

                adicionarTag(
                                xml,
                                "bar",
                                "");

                adicionarTag(
                                xml,
                                "cozinha",
                                "");

                adicionarTag(
                                xml,
                                "quarto_empregada",
                                "");

                adicionarTag(
                                xml,
                                "escritorio",
                                "");

                adicionarTag(
                                xml,
                                "area_servico",
                                "");

                adicionarTag(
                                xml,
                                "lareira",
                                "");

                adicionarTag(
                                xml,
                                "varanda",
                                "");

                adicionarTag(
                                xml,
                                "lavanderia",
                                "");

                adicionarTag(
                                xml,
                                "aceita_pet",
                                "");

                adicionarTag(
                                xml,
                                "estado",
                                imovel.getUf());

                adicionarTag(
                                xml,
                                "cidade",
                                imovel.getCidade());

                adicionarTag(
                                xml,
                                "bairro",
                                imovel.getBairro());

                adicionarTag(
                                xml,
                                "cep",
                                imovel.getCep());

                adicionarTag(
                                xml,
                                "endereco",
                                imovel.getRua());

                adicionarTag(
                                xml,
                                "numero",
                                imovel.getNumero());

                adicionarTag(
                                xml,
                                "complemento",
                                imovel.getComplemento());

                /*
                 * O portal recebe o endereço,
                 * mas não deve exibi-lo publicamente.
                 */
                adicionarTag(
                                xml,
                                "esconder_endereco_imovel",
                                "1");

                adicionarDescritivo(
                                xml,
                                imovel.getDescricao());

                /*
                 * Fotos serão adicionadas
                 * na próxima etapa.
                 */
                adicionarFotos(
                                xml,
                                imovel);

                String dataAtualizacaoImovel = imovel.getDataAtualizacao() != null
                                ? imovel.getDataAtualizacao()
                                                .format(DATA_HORA_FORMATTER)
                                : "";

                adicionarTag(
                                xml,
                                "data_atualizacao",
                                dataAtualizacaoImovel);

                adicionarTag(
                                xml,
                                "latitude",
                                "");

                adicionarTag(
                                xml,
                                "longitude",
                                "");

                adicionarTag(
                                xml,
                                "video",
                                "");

                adicionarTag(
                                xml,
                                "tour_360",
                                "");

                xml.append(
                                "            <area_comum>\n");

                xml.append(
                                "            </area_comum>\n");

                xml.append(
                                "            <area_privativa>\n");

                xml.append(
                                "            </area_privativa>\n");

                adicionarTag(
                                xml,
                                "aceita_troca",
                                imovel.isPermuta()
                                                ? "1"
                                                : "0");

                adicionarTag(
                                xml,
                                "periodo_locacao",
                                "");

                xml.append(
                                "        </imovel>\n");

                return xml.toString();

        }

        private void validarImovel(ImovelModel imovel) {

                if (imovel == null) {
                        throw new IllegalArgumentException(
                                        "Imóvel não pode ser nulo.");
                }

                if (imovel.getTitulo() == null ||
                                imovel.getTitulo().isBlank()) {
                        throw new IllegalArgumentException(
                                        "Título do imóvel é obrigatório.");
                }

                if (imovel.getTipo() == null) {
                        throw new IllegalArgumentException(
                                        "Tipo do imóvel é obrigatório.");
                }

                if (imovel.getPreco() == null) {
                        throw new IllegalArgumentException(
                                        "Valor do imóvel é obrigatório.");
                }

                if (imovel.getPreco().signum() <= 0) {
                        throw new IllegalArgumentException(
                                        "Valor do imóvel deve ser maior que zero.");
                }

                if (imovel.getUf() == null ||
                                imovel.getUf().isBlank()) {
                        throw new IllegalArgumentException(
                                        "Estado do imóvel é obrigatório.");
                }

                if (imovel.getUf().trim().length() != 2) {
                        throw new IllegalArgumentException(
                                        "Estado do imóvel deve ser informado pela sigla de 2 caracteres.");
                }

                if (imovel.getCidade() == null ||
                                imovel.getCidade().isBlank()) {
                        throw new IllegalArgumentException(
                                        "Cidade do imóvel é obrigatória.");
                }

                if (imovel.getBairro() == null ||
                                imovel.getBairro().isBlank()) {
                        throw new IllegalArgumentException(
                                        "Bairro do imóvel é obrigatório.");
                }

                if (imovel.getCep() != null &&
                                !imovel.getCep().isBlank() &&
                                imovel.getCep().trim().length() > 9) {

                        throw new IllegalArgumentException(
                                        "CEP do imóvel deve possuir no máximo 9 caracteres.");
                }

                if (imovel.getRua() != null &&
                                imovel.getRua().trim().length() > 200) {

                        throw new IllegalArgumentException(
                                        "Endereço do imóvel deve possuir no máximo 200 caracteres.");
                }

                if (imovel.getNumero() != null &&
                                imovel.getNumero().trim().length() > 10) {

                        throw new IllegalArgumentException(
                                        "Número do imóvel deve possuir no máximo 10 caracteres.");
                }

                if (imovel.getComplemento() != null &&
                                imovel.getComplemento().trim().length() > 50) {

                        throw new IllegalArgumentException(
                                        "Complemento do imóvel deve possuir no máximo 50 caracteres.");
                }

                if (imovel.getDescricao() == null ||
                                imovel.getDescricao().isBlank()) {
                        throw new IllegalArgumentException(
                                        "Descrição do imóvel é obrigatória.");
                }
        }

        private void adicionarFotos(
                        StringBuilder xml,
                        ImovelModel imovel) {

                xml.append(
                                "            <fotos_imovel>\n");

                if (imovel.getImagens() == null ||
                                imovel.getImagens().isEmpty()) {

                        xml.append(
                                        "            </fotos_imovel>\n");

                        return;
                }

                List<ImagemImovelModel> imagens = imovel.getImagens()
                                .stream()

                                /*
                                 * Primeiro a imagem principal.
                                 */
                                .sorted(
                                                Comparator
                                                                .comparing(
                                                                                ImagemImovelModel::isPrincipal)
                                                                .reversed()

                                                                /*
                                                                 * Depois pela ordem.
                                                                 */
                                                                .thenComparing(
                                                                                imagem -> imagem.getOrdem() != null
                                                                                                ? imagem.getOrdem()
                                                                                                : Integer.MAX_VALUE))

                                /*
                                 * Chaves na Mão aceita
                                 * no máximo 30 fotos.
                                 */
                                .limit(30)

                                .toList();

                for (ImagemImovelModel imagem : imagens) {

                        if (imagem.getUrl() == null ||
                                        imagem.getUrl().isBlank()) {
                                continue;
                        }

                        xml.append(
                                        "                <foto>\n");

                        adicionarTagComIndentacao(
                                        xml,
                                        "url",
                                        imagem.getUrl(),
                                        "                    ");

                        String dataAtualizacao = imagem.getDataAtualizacao() != null

                                        ? imagem
                                                        .getDataAtualizacao()
                                                        .format(
                                                                        DATA_HORA_FORMATTER)

                                        : "";

                        adicionarTagComIndentacao(
                                        xml,
                                        "data_atualizacao",
                                        dataAtualizacao,
                                        "                    ");

                        xml.append(
                                        "                </foto>\n");

                }

                xml.append(
                                "            </fotos_imovel>\n");

        }

        private void adicionarTagComIndentacao(
                        StringBuilder xml,
                        String tag,
                        Object valor,
                        String indentacao) {

                xml.append(indentacao)
                                .append("<")
                                .append(tag)
                                .append(">");

                if (valor != null) {

                        xml.append(
                                        escaparXml(
                                                        valor.toString()));

                }

                xml.append("</")
                                .append(tag)
                                .append(">\n");

        }

        private String mapearFinalidade(
                        ImovelModel imovel) {

                return switch (imovel.getTipo()) {

                        case COMERCIAL ->
                                "CO";

                        default ->
                                "RE";

                };

        }

        private String mapearTipo(
                        ImovelModel imovel) {

                return switch (imovel.getTipo()) {

                        case CASA ->
                                "Casa / Sobrado";

                        case APARTAMENTO ->
                                "Apartamento";

                        case TERRENO ->
                                "Terreno / Lote";

                        case COMERCIAL ->
                                "Loja / Comércio";

                        case CHACARA ->
                                "Sítio / Chácara";

                        case SOBRADO ->
                                "Casa / Sobrado";

                };

        }

        private void adicionarDescritivo(
                        StringBuilder xml,
                        String descricao) {

                if (descricao == null) {
                        descricao = "";
                }

                if (descricao.length() > 3000) {
                        descricao = descricao.substring(0, 3000);
                }

                /*
                 * Evita que a sequência "]]>"
                 * encerre o CDATA antes da hora.
                 */
                descricao = descricao.replace(
                                "]]>",
                                "]]]]><![CDATA[>");

                xml.append("            <descritivo><![CDATA[")
                                .append(descricao)
                                .append("]]></descritivo>\n");
        }

        private void adicionarTag(
                        StringBuilder xml,
                        String tag,
                        Object valor) {

                xml.append("            <")
                                .append(tag)
                                .append(">");

                if (valor != null) {

                        xml.append(
                                        escaparXml(
                                                        valor.toString()));

                }

                xml.append("</")
                                .append(tag)
                                .append(">\n");

        }

        private String escaparXml(
                        String valor) {

                return valor
                                .replace("&", "&amp;")
                                .replace("<", "&lt;")
                                .replace(">", "&gt;")
                                .replace("\"", "&quot;")
                                .replace("'", "&apos;");

        }

        private String gerarSlug(String texto) {

                if (texto == null || texto.isBlank()) {
                        return "";
                }

                String normalizado = Normalizer.normalize(
                                texto,
                                Normalizer.Form.NFD);

                return normalizado
                                .replaceAll("\\p{M}", "")
                                .toLowerCase(Locale.ROOT)
                                .trim()
                                .replaceAll("[^a-z0-9]+", "-")
                                .replaceAll("^-+|-+$", "");
        }

}