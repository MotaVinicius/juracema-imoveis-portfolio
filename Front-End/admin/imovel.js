/* =========================================
   CONFIGURAÇÃO
========================================= */

const APIURL = APP_CONFIG.API_URL;


const params =
    new URLSearchParams(
        window.location.search
    );


const id =
    params.get("id");


/* =========================================
   AUTENTICAÇÃO
========================================= */

const token =
    localStorage.getItem("token");


if (!token) {

    window.location.href =
        "login.html";

}


/* =========================================
   ELEMENTOS
========================================= */

const form =
    document.getElementById(
        "property-form"
    );


const formTitle =
    document.getElementById(
        "form-title"
    );


const formDescription =
    document.getElementById(
        "form-description"
    );


const saveButton =
    document.getElementById(
        "save-button"
    );


const saveButtonText =
    document.getElementById(
        "save-button-text"
    );


const imageInput =
    document.getElementById(
        "imagens"
    );


const imagePreview =
    document.getElementById(
        "image-preview"
    );


const logoutButton =
    document.getElementById(
        "logout-button"
    );


const precoInput =
    document.getElementById(
        "preco"
    );

const condominioInput =
    document.getElementById(
        "condominio"
    );

const iptuInput =
    document.getElementById(
        "iptu"
    );

const cepInput =
    document.getElementById(
        "cep"
    );

const telefoneProprietarioInput =
    document.getElementById(
        "telefoneProprietario"
    );

const feedbackModal =
    document.getElementById(
        "feedback-modal"
    );


const feedbackModalIcon =
    document.getElementById(
        "feedback-modal-icon"
    );


const feedbackModalTitle =
    document.getElementById(
        "feedback-modal-title"
    );


const feedbackModalMessage =
    document.getElementById(
        "feedback-modal-message"
    );


const feedbackModalButton =
    document.getElementById(
        "feedback-modal-button"
    );

const confirmModal =
    document.getElementById(
        "confirm-modal"
    );


const confirmModalTitle =
    document.getElementById(
        "confirm-modal-title"
    );


const confirmModalMessage =
    document.getElementById(
        "confirm-modal-message"
    );


const confirmCancelButton =
    document.getElementById(
        "confirm-cancel-button"
    );


const confirmActionButton =
    document.getElementById(
        "confirm-action-button"
    );

function mostrarFeedback({
    tipo = "sucesso",
    titulo,
    mensagem,
    aoFechar
}) {

    if (tipo === "sucesso") {

        feedbackModalIcon.textContent =
            "✓";

    } else {

        feedbackModalIcon.textContent =
            "!";

    }


    feedbackModalTitle.textContent =
        titulo;


    feedbackModalMessage.textContent =
        mensagem;


    feedbackModal.classList.add(
        "show"
    );


    feedbackModalButton.onclick =
        () => {

            feedbackModal.classList.remove(
                "show"
            );


            if (aoFechar) {

                aoFechar();

            }

        };

}

function confirmarAcao({
    titulo = "Confirmar ação",
    mensagem = "Deseja continuar?",
    textoConfirmar = "Confirmar"
}) {

    return new Promise(
        resolve => {

            confirmModalTitle.textContent =
                titulo;


            confirmModalMessage.textContent =
                mensagem;


            confirmActionButton.textContent =
                textoConfirmar;


            confirmModal.classList.add(
                "show"
            );


            function fechar(
                resultado
            ) {

                confirmModal.classList.remove(
                    "show"
                );


                confirmCancelButton.onclick =
                    null;


                confirmActionButton.onclick =
                    null;


                resolve(
                    resultado
                );

            }


            confirmCancelButton.onclick =
                () => {

                    fechar(
                        false
                    );

                };


            confirmActionButton.onclick =
                () => {

                    fechar(
                        true
                    );

                };

        }
    );

}
/* =========================================
   ESTADO DAS IMAGENS
========================================= */

/*
 * Imagens que já existem no banco.
 */

let imagensExistentes = [];


/*
 * Novas imagens selecionadas pelo
 * administrador, mas ainda não enviadas.
 *
 * Não usamos diretamente imageInput.files
 * porque queremos permitir que uma imagem
 * seja removida do preview antes do upload.
 */

let novasImagens = [];

/*
 * Arquivo selecionado como imagem principal
 * antes de ser enviado ao backend.
 */
let imagemPrincipalNova = null;


/* =========================================
   MÁSCARA MONETÁRIA
========================================= */

function formatarMoeda(valor) {

    const apenasNumeros =
        valor.replace(
            /\D/g,
            ""
        );


    if (!apenasNumeros) {
        return "";
    }


    const numero =
        Number(apenasNumeros) / 100;


    return numero.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


[
    precoInput,
    condominioInput,
    iptuInput
].forEach(
    input => {

        input.addEventListener(
            "input",
            event => {

                event.target.value =
                    formatarMoeda(
                        event.target.value
                    );

            }
        );

    }
);


function converterMoedaParaNumero(
    valor
) {

    if (!valor) {
        return null;
    }


    const valorLimpo =
        valor
            .replace(/\s/g, "")
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".");


    return Number(
        valorLimpo
    );

}


function formatarNumeroComoMoeda(
    valor
) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return "";
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

function formatarCep(valor) {

    const numeros =
        valor
            .replace(/\D/g, "")
            .slice(0, 8);


    if (numeros.length <= 5) {
        return numeros;
    }


    return (
        numeros.slice(0, 5) +
        "-" +
        numeros.slice(5)
    );

}


cepInput.addEventListener(
    "input",
    event => {

        event.target.value =
            formatarCep(
                event.target.value
            );

    }
);

function formatarTelefone(valor) {

    const numeros =
        valor
            .replace(/\D/g, "")
            .slice(0, 11);


    if (numeros.length === 0) {
        return "";
    }


    if (numeros.length <= 2) {

        return `(${numeros}`;

    }


    if (numeros.length <= 6) {

        return (
            `(${numeros.slice(0, 2)}) ` +
            numeros.slice(2)
        );

    }


    /*
     * Telefone fixo:
     * (19) 3333-4444
     */
    if (numeros.length <= 10) {

        return (
            `(${numeros.slice(0, 2)}) ` +
            numeros.slice(2, 6) +
            "-" +
            numeros.slice(6)
        );

    }


    /*
     * Celular:
     * (19) 99999-9999
     */
    return (
        `(${numeros.slice(0, 2)}) ` +
        numeros.slice(2, 7) +
        "-" +
        numeros.slice(7)
    );

}


telefoneProprietarioInput.addEventListener(
    "input",
    event => {

        event.target.value =
            formatarTelefone(
                event.target.value
            );

    }
);


/* =========================================
   API
========================================= */

async function apiFetch(
    endpoint,
    options = {}
) {

    const headers = {

        ...options.headers,

        "Authorization":
            `Bearer ${token}`

    };


    /*
     * JSON somente quando o body
     * não for FormData.
     */

    if (
        options.body &&
        !(options.body instanceof FormData)
    ) {

        headers["Content-Type"] =
            "application/json";

    }


    const response =
        await fetch(
            `${APIURL}${endpoint}`,
            {
                ...options,
                headers
            }
        );


    /*
     * Token inválido / expirado
     */

    if (
        response.status === 401
    ) {

        localStorage.removeItem(
            "token"
        );


        window.location.href =
            "login.html";


        return null;

    }


    return response;

}


/* =========================================
   PREENCHER CAMPO
========================================= */

function preencherCampo(
    campoId,
    valor
) {

    const campo =
        document.getElementById(
            campoId
        );


    if (!campo) {
        return;
    }


    campo.value =
        valor ?? "";

}


/* =========================================
   RENDERIZAR IMAGENS
========================================= */

function renderizarImagens() {

    imagePreview.innerHTML =
        "";


    /*
     * IMAGENS EXISTENTES
     */

    imagensExistentes
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
                    "preview-item"
                );

                item.dataset.tipo = "existente";
                item.dataset.imagemId = imagem.id;
                item.draggable = !imagem.principal;

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

                        : `
                                <button
                                    type="button"
                                    class="set-main-image"
                                >
                                    Tornar principal
                                </button>
                              `
                    }

                    <button
                        type="button"
                        class="remove-preview"
                        title="Excluir imagem"
                    >
                        ×
                    </button>

                `;


                /*
                 * EXCLUIR
                 */

                item
                    .querySelector(
                        ".remove-preview"
                    )
                    .addEventListener(
                        "click",
                        () => {

                            excluirImagemExistente(
                                imagem.id
                            );

                        }
                    );


                /*
                 * DEFINIR PRINCIPAL
                 */

                const principalButton =
                    item.querySelector(
                        ".set-main-image"
                    );


                if (principalButton) {

                    principalButton
                        .addEventListener(
                            "click",
                            () => {

                                definirImagemPrincipal(
                                    imagem.id
                                );

                            }
                        );

                }
                configurarDragAndDrop(
                    item
                );

                imagePreview.appendChild(
                    item
                );

            }
        );



    /*
 * NOVAS IMAGENS
 */

    novasImagens.forEach(
        (arquivo, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.classList.add(
                "preview-item"
            );

            item.dataset.tipo = "nova";
            item.dataset.novaIndex = index;
            item.draggable =
                imagemPrincipalNova !== arquivo;


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const principal =
                        imagemPrincipalNova ===
                        arquivo;


                    item.innerHTML = `

                    <img
                        src="${event.target.result}"
                        alt="${arquivo.name}"
                    >

                    ${principal

                            ? `
                                <span class="main-image-badge">
                                    Principal
                                </span>
                              `

                            : `
                                <button
                                    type="button"
                                    class="set-main-image"
                                >
                                    Tornar principal
                                </button>
                              `
                        }

                    <span class="new-image-badge">
                        Nova
                    </span>

                    <button
                        type="button"
                        class="remove-preview"
                        title="Remover imagem"
                    >
                        ×
                    </button>

                `;


                    /*
                     * REMOVER
                     */

                    item
                        .querySelector(
                            ".remove-preview"
                        )
                        .addEventListener(
                            "click",
                            () => {

                                removerNovaImagem(
                                    index
                                );

                            }
                        );


                    /*
                     * DEFINIR COMO PRINCIPAL
                     */

                    const principalButton =
                        item.querySelector(
                            ".set-main-image"
                        );


                    if (principalButton) {

                        principalButton
                            .addEventListener(
                                "click",
                                () => {

                                    imagemPrincipalNova =
                                        arquivo;


                                    renderizarImagens();

                                }
                            );

                    }

                };


            reader.readAsDataURL(
                arquivo
            );

            configurarDragAndDrop(
                item
            );

            imagePreview.appendChild(
                item
            );

        }
    );

}

/* =========================================
   ARRASTAR E SOLTAR IMAGENS
========================================= */

function configurarDragAndDrop(item) {

    if (!item.draggable) {
        return;
    }


    item.addEventListener(
        "dragstart",
        event => {

            item.classList.add(
                "dragging"
            );

            event.dataTransfer.effectAllowed =
                "move";

        }
    );


    item.addEventListener(
        "dragend",
        () => {

            item.classList.remove(
                "dragging"
            );

        }
    );


    item.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            const itemArrastado =
                imagePreview.querySelector(
                    ".dragging"
                );

            if (
                !itemArrastado ||
                itemArrastado === item
            ) {
                return;
            }


            const rect =
                item.getBoundingClientRect();

            const pontoCentral =
                rect.left +
                rect.width / 2;


            if (
                event.clientX <
                pontoCentral
            ) {

                imagePreview.insertBefore(
                    itemArrastado,
                    item
                );

            } else {

                imagePreview.insertBefore(
                    itemArrastado,
                    item.nextSibling
                );

            }

        }
    );

}

/* =========================================
   CARREGAR IMAGENS EXISTENTES
========================================= */

function carregarImagensExistentes(
    imagens
) {

    imagensExistentes =
        Array.isArray(imagens)
            ? [...imagens]
            : [];


    renderizarImagens();

}


/* =========================================
   RECARREGAR SOMENTE IMAGENS
========================================= */

async function recarregarImagensExistentes() {

    if (!id) {
        return;
    }


    try {

        const response =
            await apiFetch(
                `/imoveis/${id}`
            );


        if (
            !response ||
            !response.ok
        ) {
            return;
        }


        const imovel =
            await response.json();


        imagensExistentes =
            Array.isArray(
                imovel.imagens
            )
                ? [...imovel.imagens]
                : [];


        /*
         * Não mexemos nos outros campos
         * do formulário.
         *
         * Isso evita perder alterações
         * ainda não salvas.
         */

        renderizarImagens();


    } catch (error) {

        console.error(
            "Erro ao recarregar imagens:",
            error
        );

    }

}


/* =========================================
   EXCLUIR IMAGEM EXISTENTE
========================================= */

async function excluirImagemExistente(
    imagemId
) {

    const confirmar =
        await confirmarAcao({

            titulo:
                "Excluir imagem?",

            mensagem:
                "Tem certeza que deseja excluir esta imagem? Esta ação não poderá ser desfeita.",

            textoConfirmar:
                "Excluir imagem"

        });


    if (!confirmar) {
        return;
    }


    try {

        const response =
            await apiFetch(
                `/imoveis/${id}/imagens/${imagemId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response) {
            return;
        }


        if (
            response.status === 404
        ) {

            mostrarFeedback({
                tipo: "erro",
                titulo: "Imagem não encontrada",
                mensagem:
                    "A imagem que você tentou excluir não foi encontrada no servidor."
            });


            await recarregarImagensExistentes();


            return;

        }


        if (!response.ok) {

            throw new Error(
                "Não foi possível excluir a imagem."
            );

        }


        /*
         * Recarregamos porque, se a imagem
         * excluída era a principal, o backend
         * automaticamente escolheu outra.
         */

        await recarregarImagensExistentes();


    } catch (error) {

        console.error(
            "Erro ao excluir imagem:",
            error
        );


        mostrarFeedback({
            tipo: "erro",
            titulo: "Não foi possível excluir",
            mensagem:
                "Ocorreu um erro ao excluir a imagem. Tente novamente."
        });

    }

}


/* =========================================
   DEFINIR IMAGEM PRINCIPAL
========================================= */

async function definirImagemPrincipal(
    imagemId
) {

    try {

        const response =
            await apiFetch(
                `/imoveis/${id}/imagens/${imagemId}/principal`,
                {
                    method: "PUT"
                }
            );


        if (!response) {
            return;
        }


        if (
            response.status === 404
        ) {

            mostrarFeedback({
                tipo: "erro",
                titulo: "Imagem não encontrada",
                mensagem:
                    "A imagem que você tentou excluir não foi encontrada no servidor."
            });


            return;

        }


        if (!response.ok) {

            throw new Error(
                "Não foi possível definir a imagem principal."
            );

        }


        /*
         * Busca novamente o estado do backend,
         * incluindo a ordem reorganizada.
         */

        await recarregarImagensExistentes();


    } catch (error) {

        console.error(
            "Erro ao definir imagem principal:",
            error
        );


        mostrarFeedback({
            tipo: "erro",
            titulo: "Não foi possível definir imagem principal",
            mensagem:
                "Ocorreu um erro ao definir a imagem principal. Tente novamente."
        });

    }

}


/* =========================================
   NOVAS IMAGENS
========================================= */

imageInput.addEventListener(
    "change",
    () => {

        const arquivos =
            Array.from(
                imageInput.files
            );


        arquivos.forEach(
            arquivo => {

                if (
                    !arquivo.type.startsWith(
                        "image/"
                    )
                ) {
                    return;
                }


                novasImagens.push(
                    arquivo
                );


                /*
                 * Se ainda não existe imagem principal,
                 * a primeira imagem adicionada assume
                 * automaticamente essa função.
                 */

                const jaExistePrincipal =
                    imagensExistentes.some(
                        imagem =>
                            imagem.principal === true
                    );


                if (
                    !imagemPrincipalNova &&
                    !jaExistePrincipal
                ) {

                    imagemPrincipalNova =
                        arquivo;

                }

            }
        );


        /*
         * Limpamos o input para permitir,
         * inclusive, selecionar novamente
         * um arquivo com o mesmo nome.
         */

        imageInput.value =
            "";


        renderizarImagens();

    }
);


/* =========================================
   REMOVER NOVA IMAGEM
========================================= */

function removerNovaImagem(
    index
) {

    const imagemRemovida =
        novasImagens[index];


    novasImagens.splice(
        index,
        1
    );


    /*
     * Se a imagem removida era a principal,
     * a primeira imagem restante assume
     * automaticamente.
     */

    if (
        imagemPrincipalNova ===
        imagemRemovida
    ) {

        imagemPrincipalNova =
            novasImagens.length > 0
                ? novasImagens[0]
                : null;

    }


    renderizarImagens();

}

/* =========================================
   OBTER ORDEM VISUAL DAS IMAGENS
========================================= */

function obterOrdemImagensVisual() {

    const itens =
        Array.from(
            imagePreview.querySelectorAll(
                ".preview-item"
            )
        );

    return itens.map(
        item => {

            if (
                item.dataset.tipo ===
                "existente"
            ) {

                return {
                    tipo: "existente",
                    id: Number(
                        item.dataset.imagemId
                    )
                };

            }

            if (
                item.dataset.tipo ===
                "nova"
            ) {

                return {
                    tipo: "nova",
                    index: Number(
                        item.dataset.novaIndex
                    )
                };

            }

            return null;

        }
    ).filter(Boolean);

}

/* =========================================
   UPLOAD DE IMAGENS
========================================= */

async function enviarImagens(
    imovelId,
    arquivos
) {

    if (
        !arquivos ||
        arquivos.length === 0
    ) {
        return [];
    }


    const formData =
        new FormData();


    arquivos.forEach(
        arquivo => {

            formData.append(
                "imagens",
                arquivo
            );

        }
    );


    const response =
        await apiFetch(
            `/imoveis/${imovelId}/imagens`,
            {
                method: "POST",
                body: formData
            }
        );


    if (!response) {
        return [];
    }


    if (!response.ok) {

        throw new Error(
            "Não foi possível enviar as imagens."
        );

    }


    const imagensSalvas =
        await response.json();


    return imagensSalvas;

}

/* =========================================
   SALVAR ORDEM DAS IMAGENS
========================================= */

async function salvarOrdemImagens(
    imovelId,
    ordemVisual,
    imagensNovasSalvas
) {

    /*
     * Mapeia cada imagem nova para
     * o ID que o backend acabou de criar.
     */
    const mapaNovasImagens =
        new Map();


    imagensNovasSalvas.forEach(
        (imagemSalva, index) => {

            mapaNovasImagens.set(
                index,
                imagemSalva.id
            );

        }
    );


    /*
     * Converte a ordem visual para
     * uma lista somente de IDs.
     */
    const ordemIds =
        ordemVisual.map(
            item => {

                if (
                    item.tipo ===
                    "existente"
                ) {

                    return item.id;

                }


                if (
                    item.tipo ===
                    "nova"
                ) {

                    return mapaNovasImagens.get(
                        item.index
                    );

                }

            }
        );


    /*
     * Garante que não exista
     * nenhum ID inválido.
     */
    if (
        ordemIds.some(
            imagemId =>
                !imagemId
        )
    ) {

        throw new Error(
            "Não foi possível identificar todas as imagens."
        );

    }


    /*
     * No cadastro de um imóvel novo,
     * não existe imagem anterior.
     *
     * Nesse caso o próprio upload
     * já criou as imagens na ordem correta.
     */
    if (
        ordemIds.length === 0
    ) {
        return;
    }


    const response =
        await apiFetch(
            `/imoveis/${imovelId}/imagens/ordem`,
            {
                method: "PUT",
                body: JSON.stringify(
                    ordemIds
                )
            }
        );


    if (!response) {
        return;
    }


    if (!response.ok) {

        throw new Error(
            "Não foi possível salvar a ordem das imagens."
        );

    }

}

/* =========================================
   CARREGAR IMÓVEL PARA EDIÇÃO
========================================= */

async function carregarImovel() {

    if (!id) {
        return;
    }


    try {

        const response =
            await apiFetch(
                `/admin/imoveis/${id}`
            );


        if (!response) {
            return;
        }


        /*
         * Imóvel não encontrado
         */

        if (
            response.status === 404
        ) {

            mostrarFeedback({
                tipo: "erro",
                titulo: "Imóvel não encontrado",
                mensagem:
                    "Imóvel não encontrado."
            });


            window.location.href =
                "dashboard.html";


            return;

        }


        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar o imóvel."
            );

        }


        const imovel =
            await response.json();


        /*
         * MODO EDIÇÃO
         */

        formTitle.textContent =
            "Editar imóvel";


        formDescription.textContent =
            "Atualize as informações deste imóvel.";


        saveButtonText.textContent =
            "Salvar alterações";


        /*
         * CAMPOS
         */

        preencherCampo(
            "titulo",
            imovel.titulo
        );


        preencherCampo(
            "cidade",
            imovel.cidade
        );


        preencherCampo(
            "bairro",
            imovel.bairro
        );


        preencherCampo(
            "uf",
            imovel.uf
        );


        preencherCampo(
            "preco",
            formatarNumeroComoMoeda(
                imovel.preco
            )
        );


        preencherCampo(
            "quartos",
            imovel.quartos
        );


        preencherCampo(
            "banheiros",
            imovel.banheiros
        );


        preencherCampo(
            "area",
            imovel.area
        );


        preencherCampo(
            "vagas",
            imovel.vagas
        );


        preencherCampo(
            "tipo",
            imovel.tipo
        );


        preencherCampo(
            "descricao",
            imovel.descricao
        );


        preencherCampo(
            "areaConstruida",
            imovel.areaConstruida
        );


        preencherCampo(
            "iptu",
            formatarNumeroComoMoeda(
                imovel.iptu
            )
        );


        preencherCampo(
            "condominio",
            formatarNumeroComoMoeda(
                imovel.condominio
            )
        );

        preencherCampo(
            "cep",
            imovel.cep
        );

        preencherCampo(
            "rua",
            imovel.rua
        );

        preencherCampo(
            "numero",
            imovel.numero
        );

        preencherCampo(
            "complemento",
            imovel.complemento
        );

        preencherCampo(
            "nomeProprietario",
            imovel.nomeProprietario
        );

        preencherCampo(
            "telefoneProprietario",
            imovel.telefoneProprietario
        );

        preencherCampo(
            "anotacoesInternas",
            imovel.anotacoesInternas
        );


        document
            .getElementById(
                "destaque"
            )
            .checked =
            imovel.destaque === true;


        document
            .getElementById(
                "disponivel"
            )
            .checked =
            imovel.disponivel === true;


        document
            .getElementById(
                "permuta"
            )
            .checked =
            imovel.permuta === true;


        /*
         * IMAGENS EXISTENTES
         */

        carregarImagensExistentes(
            imovel.imagens
        );


    } catch (error) {

        console.error(
            "Erro ao carregar imóvel:",
            error
        );


        mostrarFeedback({
            tipo: "erro",
            titulo: "Não foi possível carregar o imóvel",
            mensagem:
                "Ocorreu um erro ao carregar o imóvel. Tente novamente."
        });

    }

}


/* =========================================
   CONVERTER CAMPO OPCIONAL
========================================= */

function numeroOuNull(
    campoId
) {

    const valor =
        document
            .getElementById(
                campoId
            )
            .value;


    if (valor === "") {
        return null;
    }


    return Number(
        valor
    );

}


/* =========================================
   MONTAR JSON
========================================= */

function montarDadosImovel() {

    return {

        titulo:
            document
                .getElementById(
                    "titulo"
                )
                .value
                .trim(),

        preco:
            converterMoedaParaNumero(
                document
                    .getElementById(
                        "preco"
                    )
                    .value
            ),

        quartos:
            numeroOuNull(
                "quartos"
            ),

        banheiros:
            numeroOuNull(
                "banheiros"
            ),

        vagas:
            numeroOuNull(
                "vagas"
            ),

        tipo:
            document
                .getElementById(
                    "tipo"
                )
                .value,

        cidade:
            document
                .getElementById(
                    "cidade"
                )
                .value
                .trim(),

        bairro:
            document
                .getElementById(
                    "bairro"
                )
                .value
                .trim(),

        uf:
            document
                .getElementById(
                    "uf"
                )
                .value
                .trim()
                .toUpperCase(),

        descricao:
            document
                .getElementById(
                    "descricao"
                )
                .value
                .trim(),

        destaque:
            document
                .getElementById(
                    "destaque"
                )
                .checked,

        disponivel:
            document
                .getElementById(
                    "disponivel"
                )
                .checked,

        permuta:
            document
                .getElementById(
                    "permuta"
                )
                .checked,

        area:
            Number(
                document
                    .getElementById("area")
                    .value
            ),

        areaConstruida:
            numeroOuNull(
                "areaConstruida"
            ),

        iptu:
            converterMoedaParaNumero(
                document
                    .getElementById("iptu")
                    .value
            ),

        condominio:
            converterMoedaParaNumero(
                document
                    .getElementById("condominio")
                    .value
            ),

        cep:
            document
                .getElementById(
                    "cep"
                )
                .value
                .trim(),

        rua:
            document
                .getElementById(
                    "rua"
                )
                .value
                .trim(),

        numero:
            document
                .getElementById(
                    "numero"
                )
                .value
                .trim(),

        complemento:
            document
                .getElementById(
                    "complemento"
                )
                .value
                .trim(),

        nomeProprietario:
            document
                .getElementById(
                    "nomeProprietario"
                )
                .value
                .trim(),

        telefoneProprietario:
            document
                .getElementById(
                    "telefoneProprietario"
                )
                .value
                .trim(),

        anotacoesInternas:
            document
                .getElementById(
                    "anotacoesInternas"
                )
                .value
                .trim()

    };

}


/* =========================================
   ERROS DE VALIDAÇÃO
========================================= */

function montarMensagemValidacao(
    data
) {

    if (!data.errors) {

        return (
            data.message ||
            "Dados inválidos."
        );

    }


    return Object
        .values(
            data.errors
        )
        .join("\n");

}


/* =========================================
   SALVAR
========================================= */

form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const dados =
            montarDadosImovel();

        const ordemVisual =
            obterOrdemImagensVisual();

        const endpoint =
            id
                ? `/imoveis/${id}`
                : "/imoveis";


        const method =
            id
                ? "PUT"
                : "POST";


        try {

            saveButton.disabled =
                true;


            saveButtonText.textContent =
                id
                    ? "Salvando alterações..."
                    : "Salvando imóvel...";


            /*
             * 1. SALVA DADOS DO IMÓVEL
             */

            const response =
                await apiFetch(
                    endpoint,
                    {
                        method,

                        body:
                            JSON.stringify(
                                dados
                            )
                    }
                );


            if (!response) {
                return;
            }


            /*
             * VALIDAÇÃO
             */

            if (
                response.status === 400
            ) {

                const data =
                    await response.json();


                alert(
                    montarMensagemValidacao(
                        data
                    )
                );


                return;

            }


            /*
             * NÃO ENCONTRADO
             */

            if (
                response.status === 404
            ) {

                mostrarFeedback({
                    tipo: "erro",
                    titulo: "Imóvel não encontrado",
                    mensagem:
                        "O imóvel que você tentou editar não foi encontrado no servidor."
                });


                window.location.href =
                    "dashboard.html";


                return;

            }


            if (!response.ok) {

                throw new Error(
                    "Não foi possível salvar o imóvel."
                );

            }


            /*
             * RESPOSTA DO BACKEND
             */

            const imovelSalvo =
                await response.json();


            const imovelId =
                imovelSalvo.id;


            /*
             * 2. UPLOAD DAS NOVAS IMAGENS
             */

            let imagensNovasSalvas = [];


            const novasImagensOrdenadas =
                ordemVisual
                    .filter(
                        item =>
                            item.tipo === "nova"
                    )
                    .map(
                        item =>
                            novasImagens[
                            item.index
                            ]
                    );


            if (
                novasImagensOrdenadas.length > 0
            ) {

                saveButtonText.textContent =
                    "Enviando imagens...";


                imagensNovasSalvas =
                    await enviarImagens(
                        imovelId,
                        novasImagensOrdenadas
                    );

            }

            /*
            * 3. SALVAR ORDEM DAS IMAGENS
            */

            if (
                ordemVisual.length > 0
            ) {

                saveButtonText.textContent =
                    "Organizando imagens...";


                await salvarOrdemImagens(
                    imovelId,
                    ordemVisual,
                    imagensNovasSalvas
                );

            }


            /*
             * 4. SUCESSO
             */

            mostrarFeedback({

                tipo:
                    "sucesso",

                titulo:
                    id
                        ? "Imóvel atualizado"
                        : "Imóvel cadastrado",

                mensagem:
                    id
                        ? "As alterações foram salvas com sucesso."
                        : "O imóvel foi adicionado ao seu portfólio com sucesso.",

                aoFechar:
                    () => {

                        window.location.href =
                            "dashboard.html";

                    }

            });

        } catch (error) {

            console.error(
                "Erro ao salvar imóvel:",
                error
            );


            mostrarFeedback({
                tipo: "erro",
                titulo: "Não foi possível salvar",
                mensagem:
                    "Ocorreu um erro ao salvar o imóvel. Tente novamente."
            });


        } finally {

            saveButton.disabled =
                false;


            saveButtonText.textContent =
                id
                    ? "Salvar alterações"
                    : "Salvar imóvel";

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
            "login.html";

    }
);


/* =========================================
   INICIALIZAÇÃO
========================================= */

carregarImovel();