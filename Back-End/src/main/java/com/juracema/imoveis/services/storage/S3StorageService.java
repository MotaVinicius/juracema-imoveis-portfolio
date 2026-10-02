package com.juracema.imoveis.services.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@Profile("prod")
public class S3StorageService
        implements StorageService {

    private final S3Client s3Client;

    private final String bucketName;

    private final String publicUrl;


    public S3StorageService(
            S3Client s3Client,
            @Value("${aws.s3.bucket}")
            String bucketName,
            @Value("${aws.s3.public-url}")
            String publicUrl
    ) {

        this.s3Client = s3Client;
        this.bucketName = bucketName;
        this.publicUrl = publicUrl;

    }


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


            String nomeOriginal =
                    arquivo.getOriginalFilename();


            String extensao =
                    obterExtensao(
                            nomeOriginal
                    );


            String nomeArquivo =
                    UUID.randomUUID()
                            + extensao;


            String key =
                    "imoveis/"
                            + imovelId
                            + "/"
                            + nomeArquivo;


            PutObjectRequest request =
                    PutObjectRequest
                            .builder()
                            .bucket(bucketName)
                            .key(key)
                            .contentType(
                                    arquivo.getContentType()
                            )
                            .build();


            s3Client.putObject(
                    request,
                    RequestBody.fromInputStream(
                            arquivo.getInputStream(),
                            arquivo.getSize()
                    )
            );


            return publicUrl
                    + "/"
                    + key;


        } catch (IOException e) {

            throw new RuntimeException(
                    "Erro ao armazenar imagem no S3.",
                    e
            );

        }

    }


    @Override
    public void excluir(
            String url
    ) {

        if (
                url == null ||
                url.isBlank()
        ) {

            return;

        }


        String prefixo =
                publicUrl + "/";


        String key =
                url.replaceFirst(
                        "^"
                                + java.util.regex.Pattern.quote(
                                        prefixo
                                ),
                        ""
                );


        DeleteObjectRequest request =
                DeleteObjectRequest
                        .builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();


        s3Client.deleteObject(
                request
        );

    }


    @Override
    public void excluirDiretorioDoImovel(
            Long imovelId
    ) {

        /*
         * S3 não possui diretórios reais.
         *
         * Depois que as imagens foram
         * excluídas individualmente,
         * não existe uma pasta física
         * para remover.
         */

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

}