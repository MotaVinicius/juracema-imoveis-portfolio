package com.juracema.imoveis.services.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.context.annotation.Profile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Profile("dev")
public class LocalStorageService
        implements StorageService {

    private final Path raiz =
            Paths.get("uploads/imoveis");


    @Override
    public String salvar(
            MultipartFile arquivo,
            Long imovelId
    ) {

        try {

            if (
                    arquivo == null ||
                            arquivo.isEmpty()
            ) {
                throw new IllegalArgumentException(
                        "Arquivo vazio."
                );
            }


            /*
             * Diretório específico
             * para o imóvel.
             */

            Path diretorio =
                    raiz.resolve(
                            imovelId.toString()
                    );


            Files.createDirectories(
                    diretorio
            );


            /*
             * Preserva somente a extensão.
             * O nome original não será usado
             * como nome físico do arquivo.
             */

            String nomeOriginal =
                    arquivo.getOriginalFilename();


            String extensao =
                    obterExtensao(
                            nomeOriginal
                    );


            String nomeArquivo =
                    UUID.randomUUID()
                            + extensao;


            Path destino =
                    diretorio.resolve(
                            nomeArquivo
                    );


            Files.copy(
                    arquivo.getInputStream(),
                    destino,
                    StandardCopyOption.REPLACE_EXISTING
            );


            /*
             * URL que será salva
             * no PostgreSQL.
             */

            return "/uploads/imoveis/"
                    + imovelId
                    + "/"
                    + nomeArquivo;


        } catch (IOException e) {

            throw new RuntimeException(
                    "Erro ao armazenar imagem.",
                    e
            );

        }

    }


    @Override
    public void excluir(String url) {

        if (
                url == null ||
                        url.isBlank()
        ) {
            return;
        }


        try {

            String caminhoRelativo =
                    url.replaceFirst(
                            "^/uploads/",
                            ""
                    );


            Path arquivo =
                    Paths.get("uploads")
                            .resolve(
                                    caminhoRelativo
                            )
                            .normalize();


            Files.deleteIfExists(
                    arquivo
            );


        } catch (IOException e) {

            throw new RuntimeException(
                    "Erro ao excluir imagem.",
                    e
            );

        }

    }


    private String obterExtensao(
            String nomeArquivo
    ) {

        if (
                nomeArquivo == null ||
                        !nomeArquivo.contains(".")
        ) {

            return "";

        }


        return nomeArquivo.substring(
                nomeArquivo.lastIndexOf(".")
        );

    }

    @Override
    public void excluirDiretorioDoImovel(
            Long imovelId
    ) {

        try {

            Path diretorio =
                    raiz.resolve(
                            imovelId.toString()
                    );


            if (
                    Files.exists(diretorio) &&
                            Files.isDirectory(diretorio)
            ) {

                /*
                 * Só remove se estiver vazio.
                 */

                try (
                        var arquivos =
                                Files.list(diretorio)
                ) {

                    if (
                            arquivos.findAny().isEmpty()
                    ) {

                        Files.delete(
                                diretorio
                        );

                    }

                }

            }


        } catch (IOException e) {

            throw new RuntimeException(
                    "Erro ao excluir diretório do imóvel.",
                    e
            );

        }

    }
}