const MichisListView = {
    ESTADO_EMOJI: {
        "Tiene tutor": "🏠",
        "En tránsito": "🚚",
        "Colonia feral": "🏡",
        "Rescatado": "❤️",
        "En adopción": "🎗"
    },

    render() {
        document.getElementById("workspace").innerHTML = `
            <div class="field buscador">
                <input id="txtBuscar" placeholder="🔎 Buscar por nombre o código...">
            </div>
            <div class="michis-grid" id="michisGrid"></div>
        `;

        document.getElementById("txtBuscar").oninput = (e) => this.pintarGrid(e.target.value);
        this.pintarGrid("");
    },

    pintarGrid(texto) {
        const michis = MichiRepository.buscar(texto);
        const grid = document.getElementById("michisGrid");

        if (michis.length === 0) {
            grid.innerHTML = `<p style="color:var(--text-muted)">No se encontraron michis.</p>`;
            return;
        }

        grid.innerHTML = michis.map(m => {
            const tutor = TutorRepository.findById(m.tutorId);
            return `
                <div class="michi-card" data-id="${m.id}">
                    <div class="emoji-grande">${Icons.gatoSiames(32)}</div>
                    <h3>${m.nombre}</h3>
                    <p>${tutor ? tutor.nombre + " " + tutor.apellido : "Sin tutor"}</p>
                    <span class="badge">${this.ESTADO_EMOJI[m.estado] || ""} ${m.estado}</span>
                </div>
            `;
        }).join("");

        grid.querySelectorAll(".michi-card").forEach(card => {
            card.onclick = () => this.abrirFicha(card.dataset.id);
        });
    },

    abrirFicha(michiId) {
        const michi = MichiRepository.findById(michiId);
        const tutor = TutorRepository.findById(michi.tutorId);
        const url = QRService.construirURLFicha(michi, tutor);
        const dataUrl = QRService.generarDataURL(url, 6);

        const overlay = document.createElement("div");
        overlay.className = "modal-overlay no-imprimir";
        overlay.innerHTML = `
            <div class="modal">
                <span class="modal-cerrar" id="btnCerrarModal">✕</span>
                <div class="chapita">
                    <div class="emoji-grande">${Icons.gatoSiames(48)}</div>
                    <h1>${michi.nombre}</h1>
                    <p class="contacto">${tutor ? tutor.nombre + " " + tutor.apellido : ""}</p>
                    <p class="zona">${tutor ? tutor.localidad : ""}</p>
                    <img src="${dataUrl}" alt="Código QR" style="margin:16px auto">
                    <p style="font-size:12px;color:var(--text-muted)">Código: ${michi.codigo}</p>
                </div>
                <div class="wizard-acciones no-imprimir">
                    <button class="btn btn-peligro" id="btnBorrarModal">🗑 Borrar</button>
                    <button class="btn" id="btnImprimirModal">🖨 Imprimir</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById("btnCerrarModal").onclick = () => overlay.remove();
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        document.getElementById("btnImprimirModal").onclick = () => window.print();
        document.getElementById("btnBorrarModal").onclick = () => {
            if (!confirm(`¿Borrar el registro de ${michi.nombre}? Esta acción no se puede deshacer.`)) return;
            MichiRepository.eliminar(michi.id);
            overlay.remove();
            this.pintarGrid(document.getElementById("txtBuscar").value);
        };
    }
};
