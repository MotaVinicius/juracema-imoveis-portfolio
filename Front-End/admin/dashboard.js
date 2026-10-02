/* =========================================
   CONFIGURAÇÃO
========================================= */

const APIURL = APP_CONFIG.API_URL;


/* =========================================
   AUTENTICAÇÃO
========================================= */

const token =
    localStorage.getItem("token");


if (!token) {

    window.location.href =
        "/login";

}


/* =========================================
   ELEMENTOS
========================================= */

const tableBody =
    document.getElementById(
        "properties-table-body"
    );

const emptyState =
    document.getElementById(
        "empty-state"
    );

const searchInput =
    document.getElementById(
        "property-search"
    );

const typeFilter =
    document.getElementById(
        "property-filter"
    );

const availableFilter =
    document.getElementById(
        "property-available-filter"
    );

const totalProperties =
    document.getElementById(
        "total-properties"
    );

const featuredProperties =
    document.getElementById(
        "featured-properties"
    );

const availableProperties =
    document.getElementById(
        "available-properties"
    );

const deleteModal =
    document.getElementById(
        "delete-modal"
    );

const cancelDelete =
    document.getElementById(
        "cancel-delete"
    );

const confirmDelete =
    document.getElementById(
        "confirm-delete"
    );

const logoutButton =
    document.getElementById(
        "logout-button"
    );


/* =========================================
   ESTADO
========================================= */

let imoveis = [];

let propertyToDelete = null;


/* =========================================
   API
========================================= */

async function apiFetch(
    endpoint,
    options = {}
) {

    const response =
        await fetch(
            `${APIURL}${endpoint}`,
            {
                ...options,

                headers: {

                    ...options.headers,

                    "Authorization":
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"

                }

            }
        );


    /*
     * Token inválido ou expirado
     */

    if (response.status === 401) {

        localStorage.removeItem(
            "token"
        );

        window.location.href =
            "/login";

        return null;
    }


    return response;
}


/* =========================================
   CARREGAR IMÓVEIS
========================================= */

async function carregarImoveis() {

    try {

        const response =
            await apiFetch(
                "/imoveis"
            );


        if (!response) {
            return;
        }


        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar os imóveis."
            );

        }


        imoveis =
            await response.json();


        atualizarEstatisticas();

        aplicarFiltros();


    } catch (error) {

        console.error(
            "Erro ao carregar imóveis:",
            error
        );

    }

}


/* =========================================
   ESTATÍSTICAS
========================================= */

function atualizarEstatisticas() {

    totalProperties.textContent =
        imoveis.length;


    featuredProperties.textContent =
        imoveis.filter(
            imovel =>
                imovel.destaque === true
        ).length;


    availableProperties.textContent =
        imoveis.filter(
            imovel =>
                imovel.disponivel === true
        ).length;

}


/* =========================================
   FORMATAÇÃO DE PREÇO
========================================= */

function formatarPreco(preco) {

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    ).format(preco);

}


/* =========================================
   RENDERIZAÇÃO
========================================= */

function renderizarImoveis(lista) {

    tableBody.innerHTML = "";


    if (lista.length === 0) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    lista.forEach(
        imovel => {

            const row =
                document.createElement(
                    "tr"
                );

            const imagem =
                imovel.imagemPrincipal
                    ? imovel.imagemPrincipal
                    : "../Imagens/placeholder-imovel.png";

            row.innerHTML = `

                <td>

                    <div class="property-name">

                        <div class="property-thumbnail">
                            <img
        src="${imagem}"
        alt="${imovel.titulo}"
    >
                        </div>

                        <div class="property-name-info">

                            <strong>
                                ${imovel.titulo}
                            </strong>

                            <span>
                                ${imovel.cidade} • ${imovel.uf}
                            </span>

                        </div>

                    </div>

                </td>


                <td>

                    <span class="property-type">
                        ${imovel.tipo}
                    </span>

                </td>


                <td>

                    <span class="property-price">
                        ${formatarPreco(imovel.preco)}
                    </span>

                </td>


<td>

    ${imovel.disponivel

                    ? `
            <span class="available-badge">
                ✓ Disponível
            </span>
          `

                    : `
            <span class="not-available">
                Indisponível
            </span>
          `
                }

</td>


                <td>

                    ${imovel.destaque

                    ? `
                            <span class="featured-badge">
                                ★ Destaque
                            </span>
                          `

                    : `
                            <span class="not-featured">
                                Não
                            </span>
                          `
                }

                </td>


                <td>

<div class="property-actions">

    <button
        class="action-button view"
        onclick="visualizarImovel(${imovel.id})"
    >
        Visualizar
    </button>

    <button
        class="action-button"
        onclick="editarImovel(${imovel.id})"
    >
        Editar
    </button>

    <button
        class="action-button delete"
        onclick="abrirModalExclusao(${imovel.id})"
    >
        Excluir
    </button>

</div>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


/* =========================================
   FILTROS
========================================= */

function aplicarFiltros() {

    const termo =
        searchInput.value
            .toLowerCase()
            .trim();


    const tipo =
        typeFilter.value;


    const disponibilidade =
        availableFilter.value;


    const resultado =
        imoveis.filter(
            imovel => {

                /*
                 * Busca por texto
                 */

                const correspondeBusca =

                    imovel.titulo
                        .toLowerCase()
                        .includes(termo)

                    ||

                    imovel.cidade
                        .toLowerCase()
                        .includes(termo)

                    ||

                    (
                        imovel.bairro &&
                        imovel.bairro
                            .toLowerCase()
                            .includes(termo)
                    );


                /*
                 * Filtro por tipo
                 */

                const correspondeTipo =

                    tipo === "todos"

                    ||

                    imovel.tipo === tipo;


                /*
                 * Filtro por permuta
                 */

                const correspondeDisponibilidade =

                    disponibilidade === "todos"

                    ||

                    (
                        disponibilidade === "disponivel" &&
                        imovel.disponivel === true
                    )

                    ||

                    (
                        disponibilidade === "indisponivel" &&
                        imovel.disponivel === false
                    );


                return (
                    correspondeBusca &&
                    correspondeTipo &&
                    correspondeDisponibilidade
                );

            }
        );


    renderizarImoveis(
        resultado
    );

}


/* =========================================
   EVENTOS DOS FILTROS
========================================= */

searchInput.addEventListener(
    "input",
    aplicarFiltros
);


typeFilter.addEventListener(
    "change",
    aplicarFiltros
);


availableFilter.addEventListener(
    "change",
    aplicarFiltros
);

/* =========================================
   VISUALIZAR
========================================= */

function visualizarImovel(id) {

    window.location.href =
        `visualizar-imovel.html?id=${id}`;

}

/* =========================================
   EDITAR
========================================= */

function editarImovel(id) {

    window.location.href =
        `imovel.html?id=${id}`;

}


/* =========================================
   ABRIR MODAL DE EXCLUSÃO
========================================= */

function abrirModalExclusao(id) {

    propertyToDelete =
        id;


    deleteModal.classList.add(
        "show"
    );

}


/* =========================================
   CANCELAR EXCLUSÃO
========================================= */

cancelDelete.addEventListener(
    "click",
    () => {

        propertyToDelete =
            null;


        deleteModal.classList.remove(
            "show"
        );

    }
);


/* =========================================
   EXCLUIR IMÓVEL
========================================= */

confirmDelete.addEventListener(
    "click",
    async () => {

        if (
            propertyToDelete === null
        ) {
            return;
        }


        try {

            const response =
                await apiFetch(
                    `/imoveis/${propertyToDelete}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response) {
                return;
            }


            if (!response.ok) {

                throw new Error(
                    "Não foi possível excluir o imóvel."
                );

            }


            propertyToDelete =
                null;


            deleteModal.classList.remove(
                "show"
            );


            /*
             * Busca novamente os dados
             * diretamente do banco.
             */

            await carregarImoveis();


        } catch (error) {

            console.error(
                "Erro ao excluir imóvel:",
                error
            );


            alert(
                "Não foi possível excluir o imóvel."
            );

        }

    }
);


/* =========================================
   LOGOUT
========================================= */

logoutButton.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "token"
        );


        window.location.href =
            "/login";

    }
);


/* =========================================
   INICIALIZAÇÃO
========================================= */

carregarImoveis();