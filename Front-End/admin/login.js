const APIURL = APP_CONFIG.API_URL;

const form = document.getElementById("login-form");

const passwordInput = document.getElementById("password");

const togglePassword = document.getElementById("toggle-password");

const message = document.getElementById("login-message");


/*
 * Mostrar / esconder senha
 */

togglePassword.addEventListener("click", () => {

    const senhaVisivel =
        passwordInput.type === "text";

    passwordInput.type =
        senhaVisivel ? "password" : "text";

    togglePassword.textContent =
        senhaVisivel ? "Mostrar" : "Ocultar";

});


/*
 * Login
 */

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        passwordInput.value;

    message.textContent = "";


    if (!email || !password) {

        message.textContent =
            "Preencha todos os campos.";

        return;
    }


    try {

        const response = await fetch(
            `${APIURL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: email,
                    password: password
                })
            }
        );


        /*
         * Login inválido
         */

        if (!response.ok) {

            if (response.status === 401) {

                message.textContent =
                    "E-mail ou senha inválidos.";

            } else {

                message.textContent =
                    "Não foi possível realizar o login.";
            }

            return;
        }


        /*
         * Login realizado com sucesso
         */

        const token = await response.text();


        /*
         * Salva o JWT no navegador
         */

        localStorage.setItem("token", token);


        /*
         * Redireciona para o dashboard
         */

        window.location.href =
            "dashboard.html";


    } catch (error) {

        console.error(
            "Erro ao realizar login:",
            error
        );

        message.textContent =
            "Não foi possível conectar ao servidor.";
    }

});