package com.juracema.imoveis.services;

import com.juracema.imoveis.dto.ImagemImovelResponse;
import com.juracema.imoveis.models.ImagemImovelModel;
import com.juracema.imoveis.models.ImovelModel;
import com.juracema.imoveis.repositories.ImagemImovelRepository;
import com.juracema.imoveis.repositories.ImovelRepository;
import com.juracema.imoveis.services.storage.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.juracema.imoveis.exceptions.ResourceNotFoundException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImagemImovelService {

        private final ImagemImovelRepository imagemRepository;

        private final ImovelRepository imovelRepository;

        private final StorageService storageService;

        public ImagemImovelService(
                        ImagemImovelRepository imagemRepository,
                        ImovelRepository imovelRepository,
                        StorageService storageService) {

                this.imagemRepository = imagemRepository;

                this.imovelRepository = imovelRepository;

                this.storageService = storageService;
        }

        @Transactional
        public List<ImagemImovelResponse> salvar(
                        Long imovelId,
                        List<MultipartFile> arquivos) {

                ImovelModel imovel = imovelRepository
                                .findById(imovelId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Imóvel não encontrado."));

                if (arquivos == null ||
                                arquivos.isEmpty()) {

                        throw new IllegalArgumentException(
                                        "Nenhuma imagem foi enviada.");

                }

                List<ImagemImovelModel> existentes = imagemRepository
                                .findByImovelIdOrderByOrdemAsc(
                                                imovelId);

                int proximaOrdem = existentes.size();

                boolean possuiPrincipal = existentes.stream()
                                .anyMatch(
                                                ImagemImovelModel::isPrincipal);

                List<ImagemImovelResponse> respostas = new ArrayList<>();

                for (MultipartFile arquivo : arquivos) {

                        validarImagem(
                                        arquivo);

                        String url = storageService.salvar(
                                        arquivo,
                                        imovelId);

                        ImagemImovelModel imagem = new ImagemImovelModel();

                        imagem.setUrl(
                                        url);

                        imagem.setOrdem(
                                        proximaOrdem++);

                        /*
                         * A primeira imagem do imóvel
                         * automaticamente vira principal.
                         */

                        imagem.setPrincipal(
                                        !possuiPrincipal);

                        imagem.setImovel(
                                        imovel);

                        ImagemImovelModel salva = imagemRepository.save(
                                        imagem);

                        respostas.add(
                                        new ImagemImovelResponse(
                                                        salva));

                        /*
                         * As próximas imagens deste mesmo
                         * upload não podem virar principais.
                         */

                        possuiPrincipal = true;

                }
                atualizarDataImovel(imovel);

                return respostas;

        }

        private void validarImagem(
                        MultipartFile arquivo) {

                if (arquivo == null ||
                                arquivo.isEmpty()) {

                        throw new IllegalArgumentException(
                                        "Uma das imagens está vazia.");

                }

                String contentType = arquivo.getContentType();

                if (contentType == null ||
                                !contentType.startsWith(
                                                "image/")) {

                        throw new IllegalArgumentException(
                                        "O arquivo enviado não é uma imagem.");

                }

        }

        @Transactional
        public void excluir(
                        Long imovelId,
                        Long imagemId) {

                ImagemImovelModel imagem = imagemRepository
                                .findByIdAndImovelId(
                                                imagemId,
                                                imovelId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Imagem não encontrada."));

                ImovelModel imovel = imagem.getImovel();

                boolean eraPrincipal = imagem.isPrincipal();

                String url = imagem.getUrl();

                /*
                 * Remove primeiro o registro.
                 */

                imagemRepository.delete(
                                imagem);

                /*
                 * Remove o arquivo físico.
                 */

                storageService.excluir(
                                url);

                /*
                 * Se excluímos a imagem principal,
                 * escolhemos a primeira restante
                 * como nova principal.
                 */

                if (eraPrincipal) {

                        List<ImagemImovelModel> restantes = imagemRepository
                                        .findByImovelIdOrderByOrdemAsc(
                                                        imovelId);

                        if (!restantes.isEmpty()) {

                                ImagemImovelModel novaPrincipal = restantes.get(0);

                                novaPrincipal.setPrincipal(
                                                true);

                                imagemRepository.save(
                                                novaPrincipal);

                        }

                }

                /*
                 * Reorganiza as ordens.
                 */

                reorganizarOrdem(
                                imovelId);

                atualizarDataImovel(imovel);

        }

        @Transactional
        public ImagemImovelResponse definirPrincipal(
                        Long imovelId,
                        Long imagemId) {

                ImagemImovelModel novaPrincipal = imagemRepository
                                .findByIdAndImovelId(
                                                imagemId,
                                                imovelId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Imagem não encontrada."));

                ImovelModel imovel = novaPrincipal.getImovel();

                List<ImagemImovelModel> imagens = imagemRepository
                                .findByImovelIdOrderByOrdemAsc(
                                                imovelId);

                /*
                 * Remove o principal de todas.
                 */

                imagens.forEach(
                                imagem -> imagem.setPrincipal(
                                                false));

                /*
                 * Define a escolhida.
                 */

                novaPrincipal.setPrincipal(
                                true);

                /*
                 * Opcionalmente colocamos
                 * a principal como ordem 0.
                 */

                novaPrincipal.setOrdem(
                                0);

                /*
                 * Reorganiza as demais.
                 */

                int ordem = 1;

                for (ImagemImovelModel imagem : imagens) {

                        if (imagem.getId()
                                        .equals(imagemId)) {
                                continue;
                        }

                        imagem.setOrdem(
                                        ordem++);

                }

                imagemRepository.saveAll(
                                imagens);

                imagemRepository.save(
                                novaPrincipal);

                atualizarDataImovel(imovel);

                return new ImagemImovelResponse(
                                novaPrincipal);

        }

        @Transactional
        public List<ImagemImovelResponse> reordenar(
                        Long imovelId,
                        List<Long> ordemIds) {

                List<ImagemImovelModel> imagens = imagemRepository
                                .findByImovelIdOrderByOrdemAsc(
                                                imovelId);

                if (imagens == null ||
                                imagens.isEmpty()) {
                        throw new ResourceNotFoundException(
                                        "O imóvel não possui imagens.");
                }

                if (ordemIds == null ||
                                ordemIds.size() != imagens.size()) {
                        throw new IllegalArgumentException(
                                        "A ordem deve conter todas as imagens do imóvel.");
                }

                /*
                 * Verifica se não existem IDs duplicados.
                 */
                if (ordemIds.size() != new java.util.HashSet<>(
                                ordemIds).size()) {
                        throw new IllegalArgumentException(
                                        "A ordem contém imagens duplicadas.");
                }

                /*
                 * Mapa das imagens existentes.
                 */
                java.util.Map<Long, ImagemImovelModel> imagensPorId = imagens.stream()
                                .collect(
                                                java.util.stream.Collectors
                                                                .toMap(
                                                                                ImagemImovelModel::getId,
                                                                                imagem -> imagem));

                /*
                 * Verifica se todos os IDs
                 * realmente pertencem ao imóvel.
                 */
                for (Long imagemId : ordemIds) {

                        if (!imagensPorId.containsKey(
                                        imagemId)) {
                                throw new IllegalArgumentException(
                                                "Uma das imagens informadas não pertence ao imóvel.");
                        }
                }

                /*
                 * A imagem principal sempre será
                 * a primeira da sequência.
                 */
                ImagemImovelModel principal = imagens.stream()
                                .filter(
                                                ImagemImovelModel::isPrincipal)
                                .findFirst()
                                .orElseThrow(() -> new IllegalStateException(
                                                "O imóvel não possui imagem principal."));

                /*
                 * A principal recebe ordem 0.
                 */
                principal.setOrdem(0);

                int ordem = 1;

                /*
                 * As demais seguem exatamente
                 * a sequência enviada pelo frontend.
                 */
                for (Long imagemId : ordemIds) {

                        ImagemImovelModel imagem = imagensPorId.get(
                                        imagemId);

                        if (imagem
                                        .getId()
                                        .equals(
                                                        principal.getId())) {
                                continue;
                        }

                        imagem.setOrdem(
                                        ordem++);
                }

                imagemRepository.saveAll(
                                imagens);

                /*
                 * Retorna as imagens já ordenadas.
                 */
                return imagemRepository
                                .findByImovelIdOrderByOrdemAsc(
                                                imovelId)
                                .stream()
                                .map(
                                                ImagemImovelResponse::new)
                                .toList();
        }

        private void reorganizarOrdem(
                        Long imovelId) {

                List<ImagemImovelModel> imagens = imagemRepository
                                .findByImovelIdOrderByOrdemAsc(
                                                imovelId);

                for (int i = 0; i < imagens.size(); i++) {

                        imagens
                                        .get(i)
                                        .setOrdem(i);

                }

                imagemRepository.saveAll(
                                imagens);
        }

        private void atualizarDataImovel(ImovelModel imovel) {
                imovel.setDataAtualizacao(LocalDateTime.now());
                imovelRepository.save(imovel);
        }
}