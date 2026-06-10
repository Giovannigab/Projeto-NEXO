fetch("navbar.html")
.then(res => res.text())
.then(data => {
    document.getElementById("navbar").innerHTML = data;

    // Só executa depois que a navbar carregar
    const links = document.querySelectorAll(".nav-links a");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    const closeMenu = () => {
        navLinks.classList.remove("menu-open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    };

    links.forEach(link => {
        if(link.getAttribute("href") === currentPage){
            link.classList.add("ativo");
        }

        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("menu-open");
        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    document.addEventListener("click", event => {
        if (window.innerWidth > 768 || !navLinks.classList.contains("menu-open")) {
            return;
        }

        if (!event.target.closest(".navbar")) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });
});
