/* =========================================
   CONFIGURAÇÃO
========================================= */

const APIURL = APP_CONFIG.API_URL;


const IMOVEIS_POR_PAGINA =
    15;


/* =========================================
   ELEMENTOS
========================================= */

const container =
    document.getElementById(
        "properties-grid"
    );


const pagination =
    document.getElementById(
        "pagination"
    );


const propertyCount =
    document.getElementById(
        "property-count"
    );


const filterPermuta =
    document.getElementById(
        "filter-permuta"
    );


const filterTipo =
    document.getElementById(
        "filter-tipo"
    );


const filterLocalizacao =
    document.getElementById(
        "filter-localizacao"
    );


const filterPreco =
    document.getElementById(
        "filter-preco"
    );


const searchButton =
    document.getElementById(
        "search-button"
    );


/* =========================================
   ESTADO
========================================= */

let todosImoveis = [];

let imoveisFiltrados = [];

let paginaAtual = 1;

/* =========================================
   FILTROS DA URL
========================================= */

function carregarFiltrosDaUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const tipo =
        params.get("tipo");


    const localizacao =
        params.get("localizacao");


    if (tipo) {

        filterTipo.value =
            tipo;

    }


    if (localizacao) {

        filterLocalizacao.value =
            localizacao;

    }

}

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
   CARREGAR IMÓVEIS
========================================= */

async function carregarImoveis() {

    try {

        container.innerHTML = `
            <div class="properties-message">
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


        const dados =
            await response.json();


        /*
         * O catálogo público deve mostrar
         * apenas imóveis disponíveis.
         */

        todosImoveis =
            dados.filter(
                imovel =>
                    imovel.disponivel === true
            );


        carregarFiltrosDaUrl();

        aplicarFiltros();


    } catch (error) {

        console.error(
            "Erro ao carregar imóveis:",
            error
        );


        propertyCount.textContent =
            "";


        pagination.innerHTML =
            "";


        container.innerHTML = `
            <div class="properties-message properties-error">
                Não foi possível carregar os imóveis.
                Tente novamente mais tarde.
            </div>
        `;

    }

}


/* =========================================
   FILTROS
========================================= */

function aplicarFiltros() {

    const permuta =
        filterPermuta.value;


    const tipo =
        filterTipo.value;


    const localizacao =
        filterLocalizacao
            .value
            .trim()
            .toLowerCase();


    const precoMaximo =
        filterPreco.value
            ? Number(filterPreco.value)
            : null;

    const params =
        new URLSearchParams();


    if (tipo !== "TODOS") {
        params.set("tipo", tipo);
    }


    if (localizacao) {
        params.set(
            "localizacao",
            filterLocalizacao.value.trim()
        );
    }


    if (permuta !== "todos") {
        params.set(
            "permuta",
            permuta
        );
    }


    if (precoMaximo !== null) {
        params.set(
            "precoMaximo",
            precoMaximo
        );
    }


    const novaUrl =
        params.toString()
            ? `${window.location.pathname}?${params.toString()}`
            : window.location.pathname;


    window.history.replaceState(
        {},
        "",
        novaUrl
    );


    imoveisFiltrados =
        todosImoveis.filter(
            imovel => {


                /*
                 * PERMUTA
                 */

                const correspondePermuta =

                    permuta === "todos"

                    ||

                    (
                        permuta === "sim" &&
                        imovel.permuta === true
                    )

                    ||

                    (
                        permuta === "nao" &&
                        imovel.permuta === false
                    );


                /*
                 * TIPO
                 */

                const correspondeTipo =

                    tipo === "TODOS"

                    ||

                    imovel.tipo === tipo;


                /*
                 * LOCALIZAÇÃO
                 */

                const cidade =
                    (
                        imovel.cidade ?? ""
                    ).toLowerCase();


                const bairro =
                    (
                        imovel.bairro ?? ""
                    ).toLowerCase();


                const uf =
                    (
                        imovel.uf ?? ""
                    ).toLowerCase();


                const correspondeLocalizacao =

                    !localizacao

                    ||

                    cidade.includes(
                        localizacao
                    )

                    ||

                    bairro.includes(
                        localizacao
                    )

                    ||

                    uf.includes(
                        localizacao
                    );


                /*
                 * PREÇO
                 */

                const correspondePreco =

                    precoMaximo === null

                    ||

                    Number(imovel.preco)
                    <= precoMaximo;


                return (

                    correspondePermuta &&

                    correspondeTipo &&

                    correspondeLocalizacao &&

                    correspondePreco

                );

            }
        );


    paginaAtual = 1;


    exibirImoveis();

}


/* =========================================
   CARD
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

function criarCard(imovel) {

    const card =
        document.createElement(
            "article"
        );


    card.classList.add(
        "property-card"
    );


    /*
     * Proteção visual adicional.
     *
     * Normalmente esse caso não acontecerá,
     * porque indisponíveis são filtrados
     * antes da renderização.
     */

    if (!imovel.disponivel) {

        card.classList.add(
            "property-unavailable"
        );

    }


    const quartos =

        imovel.quartos != null

            ? `
                <span>
                    ${imovel.quartos}
                    ${imovel.quartos === 1
                ? "quarto"
                : "quartos"}
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
                : "banheiros"}
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
     * Enquanto ainda não integramos
     * as imagens, usamos um placeholder.
     */

    const imagem =
    imovel.imagemPrincipal

        ? imovel.imagemPrincipal

        : "Imagens/placeholder-imovel.jpg";


    const status =

        !imovel.disponivel

            ? `
                <span class="property-status-unavailable">
                    INDISPONÍVEL
                </span>
              `

            : "";
    
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

            ${status}

        </div>


        <div class="property-info">

            <div class="property-location">
                ${formatarLocalizacao(imovel)}
            </div>


            <h3>
                ${imovel.titulo}
            </h3>


            <div class="property-details">

                ${quartos}

                ${banheiros}

                ${area}

            </div>


            <div class="property-price">
                ${formatarPreco(imovel.preco)}
            </div>


            <a
                href="/imoveis/${imovel.id}/${slug}"
                class="property-button"
            >
                Ver imóvel →
            </a>

        </div>

    `;


    return card;

}


/* =========================================
   EXIBIR IMÓVEIS
========================================= */

function exibirImoveis() {

    container.innerHTML =
        "";


    const totalImoveis =
        imoveisFiltrados.length;


    propertyCount.textContent =
        `${totalImoveis} ${totalImoveis === 1
            ? "imóvel encontrado"
            : "imóveis encontrados"
        }`;


    /*
     * Nenhum resultado
     */

    if (totalImoveis === 0) {

        container.innerHTML = `

            <div class="properties-message">

                Nenhum imóvel encontrado
                com os filtros selecionados.

            </div>

        `;


        pagination.innerHTML =
            "";


        return;

    }


    const inicio =
        (
            paginaAtual - 1
        ) * IMOVEIS_POR_PAGINA;


    const fim =
        inicio +
        IMOVEIS_POR_PAGINA;


    const imoveisPagina =
        imoveisFiltrados.slice(
            inicio,
            fim
        );


    imoveisPagina.forEach(
        imovel => {

            container.appendChild(
                criarCard(imovel)
            );

        }
    );


    criarPaginacao();

}


/* =========================================
   PAGINAÇÃO
========================================= */

function criarPaginacao() {

    pagination.innerHTML =
        "";


    const totalPaginas =
        Math.ceil(
            imoveisFiltrados.length /
            IMOVEIS_POR_PAGINA
        );


    if (totalPaginas <= 1) {
        return;
    }


    /*
     * ANTERIOR
     */

    if (paginaAtual > 1) {

        const anterior =
            document.createElement(
                "button"
            );


        anterior.textContent =
            "←";


        anterior.addEventListener(
            "click",
            () => {

                paginaAtual--;


                exibirImoveis();


                voltarAosResultados();

            }
        );


        pagination.appendChild(
            anterior
        );

    }


    /*
     * NÚMEROS
     */

    for (
        let pagina = 1;
        pagina <= totalPaginas;
        pagina++
    ) {

        const botao =
            document.createElement(
                "button"
            );


        botao.textContent =
            pagina;


        if (
            pagina === paginaAtual
        ) {

            botao.classList.add(
                "active"
            );

        }


        botao.addEventListener(
            "click",
            () => {

                paginaAtual =
                    pagina;


                exibirImoveis();


                voltarAosResultados();

            }
        );


        pagination.appendChild(
            botao
        );

    }


    /*
     * PRÓXIMO
     */

    if (
        paginaAtual <
        totalPaginas
    ) {

        const proximo =
            document.createElement(
                "button"
            );


        proximo.textContent =
            "→";


        proximo.addEventListener(
            "click",
            () => {

                paginaAtual++;


                exibirImoveis();


                voltarAosResultados();

            }
        );


        pagination.appendChild(
            proximo
        );

    }

}


/* =========================================
   SCROLL PARA RESULTADOS
========================================= */

function voltarAosResultados() {

    document
        .querySelector(
            ".all-properties"
        )
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


/* =========================================
   EVENTOS
========================================= */

searchButton.addEventListener(
    "click",
    aplicarFiltros
);


filterLocalizacao.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            aplicarFiltros();

        }

    }
);


/* =========================================
   INICIALIZAÇÃO
========================================= */

carregarImoveis();