const menuButton =
    document.getElementById(
        "menu-button"
    );


const mobileNav =
    document.getElementById(
        "mobile-nav"
    );


if (
    menuButton &&
    mobileNav
) {

    menuButton.addEventListener(
        "click",
        () => {

            const aberto =
                mobileNav.classList.toggle(
                    "active"
                );


            menuButton.setAttribute(
                "aria-expanded",
                aberto
            );


            menuButton.setAttribute(
                "aria-label",
                aberto
                    ? "Fechar menu"
                    : "Abrir menu"
            );


            menuButton.textContent =
                aberto
                    ? "×"
                    : "☰";

        }
    );


    /*
     * Fecha ao clicar em um link.
     */

    mobileNav
        .querySelectorAll("a")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        mobileNav
                            .classList.remove(
                                "active"
                            );


                        menuButton.textContent =
                            "☰";


                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );


                        menuButton.setAttribute(
                            "aria-label",
                            "Abrir menu"
                        );

                    }
                );

            }
        );

}