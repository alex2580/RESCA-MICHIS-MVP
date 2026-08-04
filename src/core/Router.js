const Router = {
    RUTAS: {},
    actual: "dashboard",

    registrar(rutas) {
        this.RUTAS = rutas;
    },

    navegar(ruta) {
        if (!this.RUTAS[ruta]) ruta = "dashboard";
        this.actual = ruta;
        if (location.hash.replace("#", "") !== ruta) location.hash = ruta;
        SidebarView.render(ruta);
        TopbarView.render(ruta);
        this.RUTAS[ruta].render();
    },

    iniciar() {
        const inicial = location.hash.replace("#", "") || "dashboard";
        this.navegar(inicial);
        window.addEventListener("hashchange", () => {
            const r = location.hash.replace("#", "");
            if (r !== this.actual) this.navegar(r);
        });
    }
};
