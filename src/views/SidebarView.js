const SidebarView = {
    render(rutaActiva) {
        const item = (ruta, emoji, texto) =>
            `<button data-route="${ruta}" class="${rutaActiva === ruta ? "activo" : ""}">
                <span>${emoji}</span> ${texto}
            </button>`;

        document.getElementById("sidebar").innerHTML = `
            <div class="logo">
                <div class="emoji">🐈</div>
                <h2>RESCA</h2>
                <span>MICHIS</span>
            </div>
            <nav class="menu">
                ${item("dashboard", "🏠", "Dashboard")}
                ${item("registro", "📝", "Registro")}
                ${item("michis", "🐾", "Michis")}
                ${item("backup", "💾", "Backup")}
            </nav>
        `;

        document.getElementById("sidebar").querySelectorAll("button[data-route]").forEach(btn => {
            btn.onclick = () => Router.navegar(btn.dataset.route);
        });
    }
};
