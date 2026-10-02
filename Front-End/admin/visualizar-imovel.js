const APIURL = APP_CONFIG.API_URL;

const params =
    new URLSearchParams(
        window.location.search
    );

const id =
    params.get("id");


const token =
    localStorage.getItem("token");


if (!token) {

    window.location.href =
        "/login";

}


const logoutButton =
    document.getElementById(
        "logout-button"
    );


const editButton =
    document.getElementById(
        "edit-button"
    );


const imagesContainer =
    document.getElementById(
        "property-images"
    );


function preencherTexto(
    elementoId,
    valor,
    sufixo = ""
) {

    const elemento =
        document.getElementById(
            elementoId
        );

    if (!elemento) {
        return;
    }


    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        elemento.textContent =
            "Não informado";

        return;

    }


    elemento.textContent =
        `${valor}${sufixo}`;

}


function formatarMoeda(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "Não informado";

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

    if (!tipo) {
        return "Não informado";
    }


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
            "Chácara"

    };


    return tipos[tipo] || tipo;

}


function formatarBooleano(valor) {

    return valor
        ? "Sim"
        : "Não";

}


function renderizarImagens(imagens) {

    imagesContainer.innerHTML =
        "";


    if (
        !Array.isArray(imagens) ||
        imagens.length === 0
    ) {

        imagesContainer.innerHTML = `
            <p class="no-images">
                Nenhuma imagem cadastrada.
            </p>
        `;

        return;

    }


    [...imagens]
        .sort(
            (a, b) =>
                a.ordem - b.ordem
        )
        .forEach(
            imagem => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.classList.add(
                    "property-image-item"
                );


                item.innerHTML = `

                    <img
                        src="${imagem.url}"
                        alt="Imagem do imóvel"
                    >

                    ${imagem.principal
                        ? `
                                <span class="main-image-badge">
                                    Principal
                                </span>
                              `
                        : ""
                    }

                `;


                imagesContainer.appendChild(
                    item
                );

            }
        );

}


async function carregarImovel() {

    if (!id) {

        window.location.href =
            "dashboard.html";

        return;

    }


    try {

        const response =
            await fetch(
                `${APIURL}/admin/imoveis/${id}`,
                {
                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }
                }
            );


        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "/login";

            return;

        }


        if (
            response.status === 404
        ) {

            throw new Error(
                "Imóvel não encontrado."
            );

        }


        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar o imóvel."
            );

        }


        const imovel =
            await response.json();


        document.title =
            `${imovel.titulo} | Área Administrativa`;


        preencherTexto(
            "titulo",
            imovel.titulo
        );


        preencherTexto(
            "id-imovel",
            imovel.id
        );


        preencherTexto(
            "tipo",
            formatarTipo(
                imovel.tipo
            )
        );


        preencherTexto(
            "preco",
            formatarMoeda(
                imovel.preco
            )
        );


        preencherTexto(
            "area",
            imovel.area,
            " m²"
        );


        preencherTexto(
            "areaConstruida",
            imovel.areaConstruida,
            " m²"
        );


        preencherTexto(
            "quartos",
            imovel.quartos
        );


        preencherTexto(
            "banheiros",
            imovel.banheiros
        );


        preencherTexto(
            "vagas",
            imovel.vagas
        );


        preencherTexto(
            "condominio",
            formatarMoeda(
                imovel.condominio
            )
        );


        preencherTexto(
            "iptu",
            formatarMoeda(
                imovel.iptu
            )
        );


        preencherTexto(
            "cep",
            imovel.cep
        );


        preencherTexto(
            "rua",
            imovel.rua
        );


        preencherTexto(
            "numero",
            imovel.numero
        );


        preencherTexto(
            "complemento",
            imovel.complemento
        );


        preencherTexto(
            "bairro",
            imovel.bairro
        );


        preencherTexto(
            "cidade",
            imovel.cidade
        );


        preencherTexto(
            "uf",
            imovel.uf
        );


        preencherTexto(
            "descricao",
            imovel.descricao
        );


        preencherTexto(
            "nomeProprietario",
            imovel.nomeProprietario
        );


        const telefoneProprietario =
            document.getElementById(
                "telefoneProprietario"
            );

        if (
            imovel.telefoneProprietario &&
            imovel.telefoneProprietario.trim() !== ""
        ) {

            const telefone =
                imovel.telefoneProprietario.trim();

            const apenasNumeros =
                telefone.replace(/\D/g, "");

            const telefoneWhatsapp =
                apenasNumeros.startsWith("55")
                    ? apenasNumeros
                    : `55${apenasNumeros}`;

            telefoneProprietario.textContent =
                telefone;

            telefoneProprietario.href =
                `https://wa.me/${telefoneWhatsapp}`;

        } else {

            telefoneProprietario.textContent =
                "—";

            telefoneProprietario.removeAttribute(
                "href"
            );

        }


        preencherTexto(
            "anotacoesInternas",
            imovel.anotacoesInternas
        );


        preencherTexto(
            "disponivel",
            formatarBooleano(
                imovel.disponivel
            )
        );


        preencherTexto(
            "destaque",
            formatarBooleano(
                imovel.destaque
            )
        );


        preencherTexto(
            "permuta",
            formatarBooleano(
                imovel.permuta
            )
        );


        const localizacao =
            [
                imovel.bairro,
                imovel.cidade,
                imovel.uf
            ]
                .filter(Boolean)
                .join(" • ");


        preencherTexto(
            "localizacao",
            localizacao
        );


        editButton.href =
            `imovel.html?id=${imovel.id}`;


        renderizarImagens(
            imovel.imagens
        );


    } catch (error) {

        console.error(
            "Erro ao carregar imóvel:",
            error
        );


        document
            .getElementById(
                "feedback-message"
            )
            .textContent =
            error.message;


        document
            .getElementById(
                "feedback-modal"
            )
            .classList.add(
                "show"
            );

    }

}


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


carregarImovel();