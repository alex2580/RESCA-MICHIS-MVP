const TopbarView = {
    TITULOS: {
        dashboard: "Centro de Operaciones",
        registro: "Nuevo Registro",
        michis: "Michis",
        backup: "Backup"
    },

    render(rutaActiva) {
        document.getElementById("topbar").innerHTML = `
            <div>
                <h1>${this.TITULOS[rutaActiva] || ""}</h1>
                <p>RESCA MICHIS · v0.1.0</p>
            </div>
        `;
    }
};
