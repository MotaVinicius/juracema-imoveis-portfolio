package com.juracema.imoveis.services;

import com.juracema.imoveis.dto.ImovelRequest;
import com.juracema.imoveis.dto.ImovelResponse;
import com.juracema.imoveis.models.ImovelModel;
import com.juracema.imoveis.repositories.ImovelRepository;
import org.springframework.stereotype.Service;
import com.juracema.imoveis.exceptions.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import com.juracema.imoveis.services.storage.StorageService;
import com.juracema.imoveis.dto.ImovelAdminResponse;

import java.util.List;

@Service
public class ImovelService {
    private final StorageService storageService;
    private final ImovelRepository imovelRepository;


    public ImovelService(
            ImovelRepository imovelRepository,
            StorageService storageService
    ) {

        this.imovelRepository =
                imovelRepository;

        this.storageService =
                storageService;
    }


    /*
     * LISTAR TODOS
     */

    public List<ImovelResponse> listarTodos() {

        return imovelRepository
                .findAll()
                .stream()
                .map(ImovelResponse::new)
                .toList();
    }


    /*
     * BUSCAR POR ID
     */

    public ImovelResponse buscarPorId(Long id) {

        ImovelModel imovel = imovelRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Imóvel não encontrado")
                );

        return new ImovelResponse(imovel);
    }

    public ImovelAdminResponse buscarPorIdAdmin(Long id) {

        ImovelModel imovel = imovelRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Imóvel não encontrado")
                );

        return new ImovelAdminResponse(imovel);
    }


    /*
     * CRIAR
     */

    public ImovelResponse criar(ImovelRequest request) {

        ImovelModel imovel = new ImovelModel();

        preencherDados(imovel, request);

        ImovelModel salvo =
                imovelRepository.save(imovel);

        return new ImovelResponse(salvo);
    }


    /*
     * ATUALIZAR
     */

    public ImovelResponse atualizar(
            Long id,
            ImovelRequest request
    ) {

        ImovelModel imovel = imovelRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Imóvel não encontrado")
                );

        preencherDados(imovel, request);

        ImovelModel atualizado =
                imovelRepository.save(imovel);

        return new ImovelResponse(atualizado);
    }


    /*
     * EXCLUIR
     */

    @Transactional
    public void excluir(Long id) {

        ImovelModel imovel =
                imovelRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Imóvel não encontrado"
                                )
                        );

        /*
         * Remove os arquivos físicos.
         */

        imovel.getImagens()
                .forEach(imagem ->
                        storageService.excluir(
                                imagem.getUrl()
                        )
                );

        /*
         * Remove o imóvel.
         *
         * Cascade remove também os registros
         * relacionados em imagens_imoveis.
         */

        imovelRepository.delete(
                imovel
        );

        /*
         * Remove a pasta vazia:
         *
         * uploads/imoveis/{id}
         */

        storageService
                .excluirDiretorioDoImovel(
                        id
                );

    }


    /*
     * PREENCHER MODEL
     */

    private void preencherDados(
            ImovelModel imovel,
            ImovelRequest request
    ) {

        imovel.setTitulo(request.getTitulo());

        imovel.setPreco(request.getPreco());

        imovel.setQuartos(request.getQuartos());

        imovel.setBanheiros(request.getBanheiros());

        imovel.setArea(request.getArea());

        imovel.setVagas(request.getVagas());

        imovel.setTipo(request.getTipo());

        imovel.setCidade(request.getCidade());

        imovel.setBairro(request.getBairro());

        imovel.setUf(request.getUf());

        imovel.setDescricao(request.getDescricao());

        imovel.setDestaque(request.isDestaque());

        imovel.setDisponivel(request.isDisponivel());

        imovel.setPermuta(request.isPermuta());

        imovel.setAreaConstruida(request.getAreaConstruida());

        imovel.setIptu(request.getIptu());

        imovel.setCondominio(request.getCondominio());

        // Endereço interno
        imovel.setCep(request.getCep());
        imovel.setRua(request.getRua());
        imovel.setNumero(request.getNumero());
        imovel.setComplemento(request.getComplemento());

        // Informações internas
        imovel.setNomeProprietario(request.getNomeProprietario());
        imovel.setTelefoneProprietario(request.getTelefoneProprietario());
        imovel.setAnotacoesInternas(request.getAnotacoesInternas());
    }
}