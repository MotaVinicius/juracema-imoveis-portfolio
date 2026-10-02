/* =========================================
   CONFIGURAÇÃO
========================================= */

const API_URL =
    APP_CONFIG.API_URL;


const GOOGLE_MAPS_API_KEY =
    APP_CONFIG.GOOGLE_MAPS_API_KEY;


const WHATSAPP_NUMBER =
    "5519993316550";


/* =========================================
   ID DO IMÓVEL
========================================= */

const partesUrl =
    window.location.pathname
        .split("/")
        .filter(Boolean);

let id;

if (
    partesUrl[0] === "imoveis" &&
    partesUrl[1]
) {
    id = partesUrl[1];
} else {
    const params =
        new URLSearchParams(
            window.location.search
        );

    id = params.get("id");
}

/* =========================================
   ELEMENTOS
========================================= */

const mainImage =
    document.getElementById(
        "property-main-image"
    );


const thumbnails =
    document.getElementById(
        "property-thumbnails"
    );


const propertyTag =
    document.getElementById(
        "property-tag"
    );


const propertyLocation =
    document.getElementById(
        "property-location"
    );


const propertyTitle =
    document.getElementById(
        "property-title"
    );


const propertyPrice =
    document.getElementById(
        "property-price"
    );


const propertyBedrooms =
    document.getElementById(
        "property-bedrooms"
    );


const propertyBathrooms =
    document.getElementById(
        "property-bathrooms"
    );


const propertyArea =
    document.getElementById(
        "property-area"
    );


const propertyDescription =
    document.getElementById(
        "property-description"
    );

const descriptionToggle =
    document.getElementById(
        "description-toggle"
    );

const propertyBuiltArea =
    document.getElementById(
        "property-built-area"
    );

const characteristicBedrooms =
    document.getElementById(
        "characteristic-bedrooms"
    );


const characteristicBathrooms =
    document.getElementById(
        "characteristic-bathrooms"
    );


const characteristicArea =
    document.getElementById(
        "characteristic-area"
    );

const characteristicBuiltArea =
    document.getElementById(
        "characteristic-built-area"
    );

const characteristicCondominio =
    document.getElementById(
        "characteristic-condominio"
    );


const characteristicIptu =
    document.getElementById(
        "characteristic-iptu"
    );

const builtAreaFeature =
    document.getElementById(
        "built-area-feature"
    );

const characteristicGarage =
    document.getElementById(
        "characteristic-garage"
    );


const characteristicType =
    document.getElementById(
        "characteristic-type"
    );


const characteristicExchange =
    document.getElementById(
        "characteristic-exchange"
    );

const shareWhatsapp =
    document.getElementById(
        "share-whatsapp"
    );

const shareFacebook =
    document.getElementById(
        "share-facebook"
    );

const shareX =
    document.getElementById(
        "share-x"
    );

const shareLink =
    document.getElementById(
        "share-link"
    );


const propertyAddress =
    document.getElementById(
        "property-address"
    );


const whatsappButton =
    document.getElementById(
        "whatsapp-button"
    );

const relatedContainer =
    document.getElementById(
        "related-properties"
    );

const relatedPrev =
    document.getElementById(
        "related-prev"
    );

const copyFeedback =
    document.getElementById(
        "copy-feedback"
    );

const propertyMapFrame =
    document.getElementById(
        "property-map-frame"
    );

const totalAreaFeature =
    document.getElementById(
        "total-area-feature"
    );


const builtAreaLabel =
    document.getElementById(
        "built-area-label"
    );


const characteristicTotalArea =
    document.getElementById(
        "characteristic-total-area"
    );


const characteristicBuiltAreaLabel =
    document.getElementById(
        "characteristic-built-area-label"
    );

const galleryPrev =
    document.getElementById(
        "gallery-prev"
    );


const galleryNext =
    document.getElementById(
        "gallery-next"
    );

let galleryImages = [];
let galleryIndex = 0;

const relatedNext =
    document.getElementById(
        "related-next"
    );

let relatedIndex = 0;
let relatedProperties = [];


/* =========================================
   FORMATAÇÕES
========================================= */

function formatarPreco(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return "Consulte";
    }


    return Number(valor)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


function formatarTipo(tipo) {

    const tipos = {

        CASA:
            "Casa",

        APARTAMENTO:
            "Apartamento",

        TERRENO:
            "Terreno",

        COMERCIAL:
            "Comercial",

        CHACARA:
            "Chácara",

        SOBRADO:
            "Sobrado"

    };


    return tipos[tipo] ?? tipo;

}


function formatarLocalizacao(imovel) {

    const partes = [];


    if (imovel.bairro) {

        partes.push(
            imovel.bairro
        );

    }


    if (imovel.cidade) {

        partes.push(
            imovel.cidade
        );

    }


    if (imovel.uf) {

        partes.push(
            imovel.uf
        );

    }


    return partes.join(" • ");

}


/* =========================================
   PREENCHER FICHA
========================================= */

function preencherFicha(imovel) {

    const localizacao =
        formatarLocalizacao(imovel);


    /*
     * Cabeçalho
     */

    propertyTag.textContent =
        formatarTipo(imovel.tipo)
            .toUpperCase();


    propertyLocation.textContent =
        localizacao.toUpperCase();


    propertyTitle.textContent =
        imovel.titulo;


    propertyPrice.textContent =
        formatarPreco(imovel.preco);


    /*
     * Informações principais
     */

    propertyBedrooms.textContent =
        imovel.quartos ?? "—";


    propertyBathrooms.textContent =
        imovel.banheiros ?? "—";


    const ehApartamento =
        imovel.tipo === "APARTAMENTO";


    /*
     * ÁREA TOTAL
     */

    propertyArea.textContent =
        imovel.area != null
            ? `${imovel.area} m²`
            : "—";


    /*
     * Apartamento não exibe área total.
     */

    totalAreaFeature.style.display =
        ehApartamento
            ? "none"
            : "";


    /*
     * ÁREA CONSTRUÍDA / ÁREA ÚTIL
     */

    if (imovel.areaConstruida != null) {

        propertyBuiltArea.textContent =
            `${imovel.areaConstruida} m²`;

        builtAreaFeature.style.display =
            "";

    } else {

        builtAreaFeature.style.display =
            "none";

    }


    /*
     * Para apartamento, areaConstruida
     * é apresentada como Área útil.
     */

    builtAreaLabel.textContent =
        ehApartamento
            ? "Área útil"
            : "Área construída";

    /*
     * Descrição
     */

    propertyDescription.textContent =
        imovel.descricao ||
        "Entre em contato para mais informações sobre este imóvel.";

    configurarDescricao();


    /*
     * Características
     */

    characteristicBedrooms.textContent =
        imovel.quartos ?? "—";


    characteristicBathrooms.textContent =
        imovel.banheiros ?? "—";


    characteristicArea.textContent =
        imovel.area != null
            ? `${imovel.area} m²`
            : "—";

    characteristicTotalArea.style.display =
        ehApartamento
            ? "none"
            : "";

    characteristicGarage.textContent =
        imovel.vagas ?? "—";


    characteristicType.textContent =
        formatarTipo(imovel.tipo);


    characteristicExchange.textContent =
        imovel.permuta === true
            ? "Sim"
            : "Não";

    characteristicCondominio.textContent =
        imovel.condominio != null
            ? formatarPreco(
                imovel.condominio
            )
            : "—";


    characteristicIptu.textContent =
        imovel.iptu != null
            ? formatarPreco(
                imovel.iptu
            )
            : "—";


    characteristicBuiltArea.textContent =
        imovel.areaConstruida != null
            ? `${imovel.areaConstruida} m²`
            : "—";


    characteristicBuiltAreaLabel.textContent =
        ehApartamento
            ? "Área útil"
            : "Área construída";


    /*
     * Localização
     */

    propertyAddress.textContent =
        localizacao;


    /*
     * Título da página
     */

    document.title =
        `${imovel.titulo} | Juracema Mota Imóveis`;


    /*
     * WhatsApp
     */
    configurarCompartilhamento(imovel);
    configurarWhatsapp(imovel);

}
/* =========================================
   DESCRIÇÃO EXPANDIDA
========================================= */

function configurarDescricao() {

    /*
     * Começamos expandido apenas para descobrir
     * a altura real do conteúdo.
     */

    propertyDescription.classList.remove(
        "collapsed"
    );


    const alturaCompleta =
        propertyDescription.scrollHeight;


    const estilos =
        window.getComputedStyle(
            propertyDescription
        );


    const lineHeight =
        parseFloat(
            estilos.lineHeight
        );


    const alturaCincoLinhas =
        lineHeight * 5;


    /*
     * Só mostra "Ver mais" se realmente
     * ultrapassar 5 linhas.
     */

    if (
        alturaCompleta >
        alturaCincoLinhas + 2
    ) {

        propertyDescription.classList.add(
            "collapsed"
        );


        descriptionToggle.style.display =
            "inline-block";


        descriptionToggle.textContent =
            "Ver mais ↓";

    } else {

        propertyDescription.classList.remove(
            "collapsed"
        );


        descriptionToggle.style.display =
            "none";

    }

}

descriptionToggle.addEventListener(
    "click",
    () => {

        const estaFechado =
            propertyDescription.classList.contains(
                "collapsed"
            );


        if (estaFechado) {

            propertyDescription.classList.remove(
                "collapsed"
            );

            descriptionToggle.textContent =
                "Ver menos ↑";

        } else {

            propertyDescription.classList.add(
                "collapsed"
            );

            descriptionToggle.textContent =
                "Ver mais ↓";

        }

    }
);

/* =========================================
   WHATSAPP e COMPARTILHAMENTO
========================================= */

function configurarCompartilhamento(
    imovel
) {

    const link =
        window.location.href;


    const texto =
        `Confira este imóvel: ${imovel.titulo}`;


    shareWhatsapp.href =
        `https://wa.me/?text=${encodeURIComponent(
            `${texto}\n${link}`
        )}`;


    shareFacebook.href =
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            link
        )}`;


    shareX.href =
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            texto
        )}&url=${encodeURIComponent(link)}`;


    shareLink.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    window.location.href
                );


                copyFeedback.classList.add(
                    "show"
                );


                setTimeout(
                    () => {

                        copyFeedback.classList.remove(
                            "show"
                        );

                    },
                    2000
                );


            } catch (error) {

                console.error(
                    "Erro ao copiar link:",
                    error
                );

            }

        }
    );

}

function configurarWhatsapp(imovel) {

    const linkImovel =
        window.location.href;


    const mensagem =
        `Olá! Tenho interesse no imóvel "${imovel.titulo}" ` +
        `que vi no site da Juracema Mota Imóveis. ` +
        `Gostaria de mais informações.\n\n` +
        `Link do imóvel: ${linkImovel}`;


    whatsappButton.href =
        `https://wa.me/${WHATSAPP_NUMBER}` +
        `?text=${encodeURIComponent(mensagem)}`;

}

/* =========================================
   MAPA
========================================= */

function configurarMapa(imovel) {

    const localizacao =
        [
            imovel.bairro,
            imovel.cidade,
            imovel.uf,
            "Brasil"
        ]
            .filter(Boolean)
            .join(", ");


    propertyMapFrame.src =
        "https://www.google.com/maps/embed/v1/place" +
        `?key=${GOOGLE_MAPS_API_KEY}` +
        `&q=${encodeURIComponent(localizacao)}`;

}


/* =========================================
   IMOVEIS RELACIONADOS
========================================= */

function gerarSlug(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function carregarImoveisRelacionados(
    imovelAtual
) {

    try {

        const response =
            await fetch(
                `${API_URL}/imoveis`
            );


        if (!response.ok) {
            return;
        }


        const todos =
            await response.json();


        const disponiveis =
            todos.filter(
                imovel =>
                    imovel.disponivel === true &&
                    imovel.id !== imovelAtual.id
            );


        const mesmoTipo =
            disponiveis.filter(
                imovel =>
                    imovel.tipo === imovelAtual.tipo
            );


        const outros =
            disponiveis.filter(
                imovel =>
                    imovel.tipo !== imovelAtual.tipo
            );


        relatedProperties =
            [
                ...mesmoTipo,
                ...outros
            ].slice(
                0,
                8
            );


        renderizarRelacionados();


    } catch (error) {

        console.error(
            "Erro ao carregar imóveis relacionados:",
            error
        );

    }

}

function renderizarRelacionados() {

    relatedContainer.innerHTML =
        "";


    relatedProperties.forEach(
        imovel => {

            const imagem =
                imovel.imagemPrincipal
                    ? imovel.imagemPrincipal
                    : "imagens/placeholder-imovel.png";


            const card =
                document.createElement(
                    "article"
                );


            card.classList.add(
                "property-card"
            );

            const slug = gerarSlug(imovel.titulo);


            card.innerHTML = `

                <div class="property-image">

                    <img
                        src="${imagem}"
                        alt="${imovel.titulo}"
                    >

                    <span class="property-tag">
                        ${formatarTipo(imovel.tipo)}
                    </span>

                </div>


                <div class="property-info">

                    <p class="property-location">
                        ${formatarLocalizacao(imovel)}
                    </p>


                    <h3>
                        ${imovel.titulo}
                    </h3>


                    <strong class="property-price">
                        ${formatarPreco(imovel.preco)}
                    </strong>


                    <a
                        href="/imoveis/${imovel.id}/${slug}"
                        class="property-button"
                    >
                        Ver imóvel →
                    </a>

                </div>

            `;


            relatedContainer.appendChild(
                card
            );

        }
    );

    function getRelatedCardsPorTela() {

        if (window.innerWidth <= 650) {
            return 1;
        }

        if (window.innerWidth <= 1000) {
            return 2;
        }

        return 3;
    }


    function atualizarRelacionados() {

        const cards =
            relatedContainer.querySelectorAll(
                ".property-card"
            );


        if (cards.length === 0) {
            return;
        }


        const cardsPorTela =
            getRelatedCardsPorTela();


        const indiceMaximo =
            Math.max(
                0,
                cards.length - cardsPorTela
            );


        if (relatedIndex > indiceMaximo) {
            relatedIndex = indiceMaximo;
        }


        const cardWidth =
            cards[0].offsetWidth;


        const gap =
            24;


        const deslocamento =
            relatedIndex *
            (
                cardWidth +
                gap
            );


        relatedContainer.style.transform =
            `translateX(-${deslocamento}px)`;


        relatedPrev.disabled =
            relatedIndex === 0;


        relatedNext.disabled =
            relatedIndex >= indiceMaximo;


        const precisaCarrossel =
            cards.length > cardsPorTela;


        relatedPrev.style.display =
            precisaCarrossel
                ? ""
                : "none";


        relatedNext.style.display =
            precisaCarrossel
                ? ""
                : "none";

    }

    relatedNext.addEventListener(
        "click",
        () => {

            const cardsPorTela =
                getRelatedCardsPorTela();


            if (
                relatedIndex +
                cardsPorTela <
                relatedProperties.length
            ) {

                relatedIndex++;

                atualizarRelacionados();

            }

        }
    );


    relatedPrev.addEventListener(
        "click",
        () => {

            if (relatedIndex > 0) {

                relatedIndex--;

                atualizarRelacionados();

            }

        }
    );


    window.addEventListener(
        "resize",
        () => {

            atualizarRelacionados();

        }
    );


    atualizarRelacionados();

}

/* =========================================
   GALERIA
========================================= */

function carregarGaleria(
    imagens
) {

    thumbnails.innerHTML =
        "";


    /*
     * Sem imagens
     */

    if (
        !Array.isArray(imagens) ||
        imagens.length === 0
    ) {

        mainImage.src =
            "imagens/placeholder-imovel.png";


        galleryPrev.style.display =
            "none";


        galleryNext.style.display =
            "none";


        return;
    }


    /*
     * Ordena conforme definido no backend.
     */

    galleryImages =
        [...imagens].sort(
            (a, b) =>
                a.ordem - b.ordem
        );


    /*
     * Localiza a principal.
     */

    const indicePrincipal =
        galleryImages.findIndex(
            imagem =>
                imagem.principal === true
        );


    galleryIndex =
        indicePrincipal >= 0
            ? indicePrincipal
            : 0;


    /*
     * Se houver apenas uma imagem,
     * não precisamos mostrar as setas.
     */

    const temMaisDeUmaImagem =
        galleryImages.length > 1;


    galleryPrev.style.display =
        temMaisDeUmaImagem
            ? ""
            : "none";


    galleryNext.style.display =
        temMaisDeUmaImagem
            ? ""
            : "none";


    /*
     * Cria as miniaturas.
     */

    galleryImages.forEach(
        (imagem, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                imagem.url;


            img.alt =
                propertyTitle.textContent;


            button.appendChild(
                img
            );


            button.addEventListener(
                "click",
                () => {

                    galleryIndex =
                        index;


                    atualizarImagemGaleria();

                }
            );


            thumbnails.appendChild(
                button
            );

        }
    );


    atualizarImagemGaleria();

}

function atualizarImagemGaleria() {

    if (
        galleryImages.length === 0
    ) {
        return;
    }


    const imagemAtual =
        galleryImages[
        galleryIndex
        ];


    mainImage.src =
        imagemAtual.url;


    /*
     * Atualiza miniatura ativa.
     */

    const botoes =
        thumbnails.querySelectorAll(
            "button"
        );


    botoes.forEach(
        (button, index) => {

            button.classList.toggle(
                "active",
                index === galleryIndex
            );

        }
    );

}

galleryNext.addEventListener(
    "click",
    () => {

        if (
            galleryImages.length <= 1
        ) {
            return;
        }


        galleryIndex++;


        if (
            galleryIndex >=
            galleryImages.length
        ) {

            galleryIndex =
                0;

        }


        atualizarImagemGaleria();

    }
);


galleryPrev.addEventListener(
    "click",
    () => {

        if (
            galleryImages.length <= 1
        ) {
            return;
        }


        galleryIndex--;


        if (
            galleryIndex < 0
        ) {

            galleryIndex =
                galleryImages.length - 1;

        }


        atualizarImagemGaleria();

    }
);


/* =========================================
   IMÓVEL NÃO ENCONTRADO
========================================= */

function mostrarImovelNaoEncontrado() {

    document.querySelector(
        ".property-detail-container"
    ).innerHTML = `

        <div class="property-not-found">

            <p class="eyebrow">
                IMÓVEL NÃO ENCONTRADO
            </p>

            <h1>
                Este imóvel não está disponível.
            </h1>

            <p>
                O imóvel pode ter sido removido
                ou não estar mais disponível
                para visualização.
            </p>

            <a
                href="imoveis.html"
                class="property-contact-button"
            >
                Ver outros imóveis →
            </a>

        </div>

    `;

}


/* =========================================
   CARREGAR IMÓVEL
========================================= */

async function carregarImovel() {

    /*
     * URL sem ID
     */

    if (!id) {

        mostrarImovelNaoEncontrado();

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/imoveis/${id}`
            );


        /*
         * Imóvel inexistente
         */

        if (response.status === 404) {

            mostrarImovelNaoEncontrado();

            return;

        }


        if (!response.ok) {

            throw new Error(
                `Erro HTTP: ${response.status}`
            );

        }


        const imovel =
            await response.json();

        const slugCorreto = gerarSlug(imovel.titulo);

        const urlCorreta =
            `/imoveis/${imovel.id}/${slugCorreto}`;

        if (window.location.pathname !== urlCorreta) {
            window.history.replaceState(
                null,
                "",
                urlCorreta
            );
        }

        const canonical =
            document.getElementById("canonical-imovel");

        if (canonical) {
            canonical.href =
                `https://juracemamotaimoveis.com.br${urlCorreta}`;
        }

        document.title =
            `${imovel.titulo} | Juracema Mota Imóveis`;

        const localizacao = [
            imovel.bairro,
            imovel.cidade,
            imovel.uf
        ]
            .filter(Boolean)
            .join(", ");

        let descricaoSeo =
            `${imovel.titulo}`;

        if (localizacao) {
            descricaoSeo +=
                ` em ${localizacao}`;
        }

        if (imovel.preco != null) {
            descricaoSeo +=
                `. Confira detalhes, fotos e informações deste imóvel à venda.`;
        } else {
            descricaoSeo +=
                `. Confira fotos, características e mais informações sobre este imóvel.`;
        }

        const metaDescription =
            document.getElementById(
                "meta-description-imovel"
            );

        if (metaDescription) {
            metaDescription.content =
                descricaoSeo;
        }

        const urlCompleta =
            `https://juracemamotaimoveis.com.br${urlCorreta}`;

        const ogTitle =
            document.getElementById("og-title");

        const ogDescription =
            document.getElementById("og-description");

        const ogUrl =
            document.getElementById("og-url");

        const ogImage =
            document.getElementById("og-image");

        if (ogTitle) {
            ogTitle.content =
                `${imovel.titulo} | Juracema Mota Imóveis`;
        }

        if (ogDescription) {
            ogDescription.content =
                descricaoSeo;
        }

        if (ogUrl) {
            ogUrl.content =
                urlCompleta;
        }

        if (ogImage && imovel.imagemPrincipal) {
            ogImage.content =
                imovel.imagemPrincipal;
        }


        /*
         * A ficha pública não deve exibir
         * imóveis indisponíveis.
         */

        if (
            imovel.disponivel === false
        ) {

            mostrarImovelNaoEncontrado();

            return;

        }


        preencherFicha(imovel);

        configurarMapa(imovel);

        carregarGaleria(
            imovel.imagens
        );

        await carregarImoveisRelacionados(
            imovel
        );


    } catch (error) {

        console.error(
            "Erro ao carregar imóvel:",
            error
        );


        mostrarImovelNaoEncontrado();

    }

}


/* =========================================
   INICIALIZAÇÃO
========================================= */

carregarImovel();