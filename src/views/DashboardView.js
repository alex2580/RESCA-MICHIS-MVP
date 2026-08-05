const DashboardView = {
    saludo() {
        const hora = new Date().getHours();
        if (hora < 12) return "Buenos días";
        if (hora < 20) return "Buenas tardes";
        return "Buenas noches";
    },

    render() {
        const michis = MichiRepository.all();
        const tutores = TutorRepository.all();
        const haceUnaSemana = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const estaSemana = michis.filter(m => new Date(m.fechaAlta).getTime() > haceUnaSemana).length;
        const eventos = EventService.recientes(6);

        document.getElementById("workspace").innerHTML = `
            <h2 class="saludo">${this.saludo()}, Alejandro</h2>
            <p class="frase">"Cada chapita puede significar un reencuentro."</p>

            <div class="kpis">
                <div class="kpi"><div class="emoji">${Icons.gatoSiames(26)}</div><h3>Michis</h3><h1>${michis.length}</h1></div>
                <div class="kpi"><div class="emoji">👤</div><h3>Tutores</h3><h1>${tutores.length}</h1></div>
                <div class="kpi"><div class="emoji">🎟</div><h3>QR generados</h3><h1>${michis.length}</h1></div>
                <div class="kpi"><div class="emoji">📈</div><h3>Esta semana</h3><h1>${estaSemana}</h1></div>
            </div>

            <div class="panel">
                <h2>Actividad reciente</h2>
                ${eventos.length ? eventos.map(e => `
                    <div class="actividad-item">
                        ✔ ${e.accion} — ${e.detalle}
                        <div class="fecha">${new Date(e.fecha).toLocaleString()}</div>
                    </div>
                `).join("") : `<p style="color:var(--text-muted)">Todavía no hay actividad. Empezá registrando tu primer michi.</p>`}
            </div>

            ${michis.length === 0 ? `
                <div class="panel" style="text-align:center">
                    <p style="margin-bottom:16px">Todavía no registraste ningún michi.</p>
                    <button class="btn" data-route="registro">📝 Registrar el primero</button>
                </div>
            ` : ""}
        `;

        const btnIr = document.querySelector('[data-route="registro"]');
        if (btnIr) btnIr.onclick = () => Router.navegar("registro");
    }
};
