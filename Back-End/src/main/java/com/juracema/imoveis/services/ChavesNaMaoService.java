package com.juracema.imoveis.services;

import com.juracema.imoveis.integration.chavesnamao.ChavesNaMaoXmlMapper;
import com.juracema.imoveis.models.ImovelModel;
import com.juracema.imoveis.repositories.ImovelRepository;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class ChavesNaMaoService {

    private static final Logger logger =
            LoggerFactory.getLogger(ChavesNaMaoService.class);

    private final ImovelRepository imovelRepository;

    private final ChavesNaMaoXmlMapper
            chavesNaMaoXmlMapper;


    public ChavesNaMaoService(
            ImovelRepository imovelRepository,
            ChavesNaMaoXmlMapper chavesNaMaoXmlMapper
    ) {

        this.imovelRepository =
                imovelRepository;

        this.chavesNaMaoXmlMapper =
                chavesNaMaoXmlMapper;

    }


    public String gerarXml() {

        List<ImovelModel> imoveis =
                imovelRepository
                        .findByDisponivelTrueOrderByIdAsc();


        StringBuilder xml =
                new StringBuilder();


        xml.append("""
                <?xml version="1.0" encoding="utf-8"?>
                <Document>
                    <imoveis>
                """);


        for (ImovelModel imovel : imoveis) {

            try {

                xml.append(
                        chavesNaMaoXmlMapper
                                .mapear(imovel)
                );

            } catch (IllegalArgumentException e) {

                logger.warn(
                        "Imóvel JM-{} ignorado no XML do Chaves na Mão: {}",
                        imovel.getId(),
                        e.getMessage()
                );

            }

        }


        xml.append("""
                    </imoveis>
                </Document>
                """);


        return xml.toString();

    }

}