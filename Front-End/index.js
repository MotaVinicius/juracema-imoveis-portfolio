/* =========================================
   CONFIGURAÇÃO
========================================= */

const APIURL = APP_CONFIG.API_URL;


const MAX_DESTAQUES = 7;


/* =========================================
   ELEMENTOS
========================================= */

const featuredContainer =
    document.getElementById(
        "featured-properties"
    );


const previousButton =
    document.getElementById(
        "carousel-prev"
    );


const nextButton =
    document.getElementById(
        "carousel-next"
    );

const homeFilterTipo =
    document.getElementById(
        "home-filter-tipo"
    );


const homeFilterLocalizacao =
    document.getElementById(
        "home-filter-localizacao"
    );


const homeSearchButton =
    document.getElementById(
        "home-search-button"
    );

/* =========================================
   ESTADO
========================================= */

let imoveisDestaque = [];

let indiceAtual = 0;


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
   CARREGAR DESTAQUES
========================================= */

async function carregarDestaques() {

    try {

        featuredContainer.innerHTML = `
            <div class="featured-message">
                Carregando imóveis...
            </div>
        `;


        const response =
            await fetch(
                `${APIURL}/imoveis`
            );


        if (!response.ok) {

            throw new Error(
                `Erro HTTP: ${response.status}`
            );

        }


        const imoveis =
            await response.json();


        /*
         * Somente imóveis:
         *
         * - disponíveis
         * - marcados como destaque
         */

        imoveisDestaque =
            imoveis
                .filter(
                    imovel =>
                        imovel.disponivel === true &&
                        imovel.destaque === true
                )
                .slice(
                    0,
                    MAX_DESTAQUES
                );


        indiceAtual = 0;


        criarDestaques();


    } catch (error) {

        console.error(
            "Erro ao carregar destaques:",
            error
        );


        featuredContainer.innerHTML = `
            <div class="featured-message">
                Não foi possível carregar
                os imóveis em destaque.
            </div>
        `;


        esconderBotoesCarrossel();

    }

}


/* =========================================
   CRIAR CARDS
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

function criarDestaques() {

    featuredContainer.innerHTML =
        "";


    /*
     * Nenhum imóvel em destaque
     */

    if (
        imoveisDestaque.length === 0
    ) {

        featuredContainer.innerHTML = `
            <div class="featured-message">
                Nenhum imóvel em destaque
                no momento.
            </div>
        `;


        esconderBotoesCarrossel();


        return;

    }


    imoveisDestaque.forEach(
        imovel => {

            const card =
                document.createElement(
                    "article"
                );


            card.classList.add(
                "property-card"
            );


            const quartos =

                imovel.quartos != null

                    ? `
                        <span>
                            ${imovel.quartos}
                            ${imovel.quartos === 1
                        ? "quarto"
                        : "quartos"
                    }
                        </span>
                      `

                    : "";


            const banheiros =

                imovel.banheiros != null

                    ? `
                        <span>
                            ${imovel.banheiros}
                            ${imovel.banheiros === 1
                        ? "banheiro"
                        : "banheiros"
                    }
                        </span>
                      `

                    : "";


            const area =

                imovel.area != null

                    ? `
                        <span>
                            ${imovel.area} m²
                        </span>
                      `

                    : "";


            /*
             * Placeholder temporário.
             *
             * Depois será substituído pela
             * imagem principal da API.
             */

            const imagem =
                imovel.imagemPrincipal

                    ? imovel.imagemPrincipal

                    : "Imagens/placeholder-imovel.jpg";


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


                    <div class="property-details">

                        ${quartos}

                        ${banheiros}

                        ${area}

                    </div>


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


            featuredContainer
                .appendChild(
                    card
                );

        }
    );


    atualizarCarrossel();

}


/* =========================================
   CARDS POR TELA
========================================= */

function getCardsPorTela() {

    if (
        window.innerWidth <= 768
    ) {

        return 1;

    }


    return 3;

}


/* =========================================
   ATUALIZAR CARROSSEL
========================================= */

function atualizarCarrossel() {

    const cards =
        featuredContainer
            .querySelectorAll(
                ".property-card"
            );


    if (
        cards.length === 0
    ) {
        return;
    }


    /*
     * Impede que o índice fique inválido
     * após redimensionar a tela.
     */

    const cardsPorTela =
        getCardsPorTela();


    const indiceMaximo =
        Math.max(
            0,
            cards.length -
            cardsPorTela
        );


    if (
        indiceAtual >
        indiceMaximo
    ) {

        indiceAtual =
            indiceMaximo;

    }


    const cardWidth =
        cards[0].offsetWidth;


    const gap = 24;


    const deslocamento =
        indiceAtual *
        (
            cardWidth +
            gap
        );


    featuredContainer.style.transform =
        `translateX(-${deslocamento}px)`;


    atualizarBotoes();

}


/* =========================================
   BOTÕES
========================================= */

function atualizarBotoes() {

    const cardsPorTela =
        getCardsPorTela();


    const precisaCarrossel =
        imoveisDestaque.length >
        cardsPorTela;


    /*
     * Se todos os cards já couberem
     * na tela, não precisamos das setas.
     */

    previousButton.style.display =
        precisaCarrossel
            ? ""
            : "none";


    nextButton.style.display =
        precisaCarrossel
            ? ""
            : "none";


    if (!precisaCarrossel) {
        return;
    }


    previousButton.disabled =
        indiceAtual === 0;


    nextButton.disabled =

        indiceAtual +
        cardsPorTela >=
        imoveisDestaque.length;

}


function esconderBotoesCarrossel() {

    previousButton.style.display =
        "none";


    nextButton.style.display =
        "none";

}


/* =========================================
   PRÓXIMO
========================================= */

nextButton.addEventListener(
    "click",
    () => {

        const cardsPorTela =
            getCardsPorTela();


        if (

            indiceAtual +
            cardsPorTela <

            imoveisDestaque.length

        ) {

            indiceAtual++;


            atualizarCarrossel();

        }

    }
);


/* =========================================
   ANTERIOR
========================================= */

previousButton.addEventListener(
    "click",
    () => {

        if (
            indiceAtual > 0
        ) {

            indiceAtual--;


            atualizarCarrossel();

        }

    }
);


/* =========================================
   RESPONSIVIDADE
========================================= */

window.addEventListener(
    "resize",
    () => {

        atualizarCarrossel();

    }
);

/* =========================================
   BUSCA DA HOME
========================================= */

function buscarImoveis() {

    const tipo =
        homeFilterTipo.value;


    const localizacao =
        homeFilterLocalizacao
            .value
            .trim();


    const params =
        new URLSearchParams();


    if (tipo) {

        params.set(
            "tipo",
            tipo
        );

    }


    if (localizacao) {

        params.set(
            "localizacao",
            localizacao
        );

    }


    const query =
        params.toString();


    window.location.href =
        query
            ? `/imoveis?${query}`
            : "/imoveis";

}


homeSearchButton.addEventListener(
    "click",
    buscarImoveis
);


homeFilterLocalizacao.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            buscarImoveis();

        }

    }
);

/* =========================================
   INICIALIZAÇÃO
========================================= */

carregarDestaques();