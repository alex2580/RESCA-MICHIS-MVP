const RegistroWizardView = {
    DRAFT_KEY: "RESCA_MICHIS_DRAFT",

    state: {
        paso: 1,
        tutor: {},
        michi: {},
        tutorExistente: false
    },

    reiniciar() {
        this.state = { paso: 1, tutor: {}, michi: {}, tutorExistente: false };
        localStorage.removeItem(this.DRAFT_KEY);
    },

    elegirTutorExistente(tutorId) {
        const tutor = TutorRepository.findById(tutorId);
        if (!tutor) return;
        this.state.tutor = tutor;
        this.state.tutorExistente = true;
        this.state.michi = { estado: "Tiene tutor" };
        this.state.paso = 2;
        this.guardarBorrador();
        this.pintar();
    },

    pintarResultadosTutor(texto) {
        const cont = document.getElementById("resultadosTutor");
        if (!cont) return;
        const t = texto.trim();
        if (t.length < 2) { cont.innerHTML = ""; return; }

        const matches = TutorRepository.buscarPorApellido(t);
        if (matches.length === 0) {
            cont.innerHTML = `<p style="font-size:12px;color:var(--text-muted);margin-top:6px">Sin coincidencias — se va a crear un tutor nuevo.</p>`;
            return;
        }
        cont.innerHTML = matches.map(tu => `
            <div class="tutor-resultado" data-id="${tu.id}">
                <strong>${tu.nombre} ${tu.apellido}</strong>
                <span>${tu.celular}${tu.localidad ? " · " + tu.localidad : ""}</span>
            </div>
        `).join("");
        cont.querySelectorAll(".tutor-resultado").forEach(el => {
            el.onclick = () => this.elegirTutorExistente(el.dataset.id);
        });
    },

    guardarBorrador() {
        localStorage.setItem(this.DRAFT_KEY, JSON.stringify(this.state));
    },

    cargarBorrador() {
        const raw = localStorage.getItem(this.DRAFT_KEY);
        if (raw) this.state = JSON.parse(raw);
    },

    render() {
        const hayBorrador = localStorage.getItem(this.DRAFT_KEY);
        if (hayBorrador) {
            this.cargarBorrador();
        } else if (this.state.paso === 4) {
            this.reiniciar();
        }
        this.pintar();
    },

    pintar() {
        const { paso } = this.state;
        const pct = (paso / 4) * 100;

        let contenido = "";
        if (paso === 1) contenido = this.pasoTutor();
        if (paso === 2) contenido = this.pasoMichi();
        if (paso === 3) contenido = this.pasoPreview();
        if (paso === 4) contenido = this.pasoQR();

        document.getElementById("workspace").innerHTML = `
            <div class="panel">
                <div class="wizard-header">
                    <span class="wizard-paso">PASO ${Math.min(paso, 4)} de 4</span>
                    <span class="wizard-paso">${["Tutor", "Michi", "Vista previa", "Chapita"][paso - 1]}</span>
                </div>
                <div class="wizard-progreso"><div class="wizard-progreso-fill" style="width:${pct}%"></div></div>
                ${contenido}
            </div>
        `;

        this.conectarEventos();
    },

    // ---------- PASO 1 ----------
    pasoTutor() {
        const t = this.state.tutor;
        return `
            <h2 style="margin-bottom:18px">Datos del tutor</h2>

            <div class="field">
                <label>¿Ya cargaste a este tutor? Buscar por apellido</label>
                <input id="txtBuscarTutor" placeholder="Escribí el apellido para reusar sus datos...">
                <div id="resultadosTutor"></div>
            </div>

            <div class="grid-2">
                <div class="field"><label>Nombre *</label><input id="txtNombre" value="${t.nombre || ""}"></div>
                <div class="field"><label>Apellido</label><input id="txtApellido" value="${t.apellido || ""}"></div>
                <div class="field"><label>Celular *</label><input id="txtCelular" value="${t.celular || ""}" placeholder="11 2345 6789"></div>
                <div class="field"><label>WhatsApp</label><input id="txtWhatsapp" value="${t.whatsapp || ""}" placeholder="igual al celular si vacío"></div>
            </div>
            <div class="field"><label>Zona / Barrio</label><input id="txtLocalidad" value="${t.localidad || ""}" placeholder="No pidas dirección exacta, por seguridad"></div>
            <div class="wizard-acciones">
                <span></span>
                <button class="btn" id="btnContinuar1">Continuar →</button>
            </div>
        `;
    },

    // ---------- PASO 2 ----------
    pasoMichi() {
        const m = this.state.michi;
        const t = this.state.tutor;

        if (this.state.tutorExistente) {
            return `
                <h2 style="margin-bottom:6px">Datos del michi</h2>
                <p style="color:var(--text-muted);font-size:13px;margin-bottom:18px">
                    🔁 Tutor: <strong>${t.nombre} ${t.apellido}</strong> (${t.celular}) — reusando sus datos
                </p>
                <div class="field"><label>Nombre *</label><input id="txtMichiNombre" value="${m.nombre || ""}"></div>
                <div class="field">
                    <label>Situación</label>
                    <textarea id="txtObs" rows="3" placeholder="ej. Se perdió, toma medicación, es VIF+, VILeF+...">${m.observaciones || ""}</textarea>
                </div>
                <div class="wizard-acciones">
                    <button class="btn btn-secundario" id="btnAtras2">← Atrás</button>
                    <button class="btn" id="btnContinuar2">Continuar →</button>
                </div>
            `;
        }

        const chip = (grupo, valor, actual, texto) =>
            `<button type="button" class="chip ${actual === valor ? "activo" : ""}" data-grupo="${grupo}" data-valor="${valor}">${texto}</button>`;

        return `
            <h2 style="margin-bottom:18px">Datos del michi</h2>
            <div class="field"><label>Nombre *</label><input id="txtMichiNombre" value="${m.nombre || ""}"></div>

            <div class="field">
                <label>Sexo</label>
                <div class="chip-group">
                    ${chip("sexo", "Macho", m.sexo, "♂ Macho")}
                    ${chip("sexo", "Hembra", m.sexo, "♀ Hembra")}
                </div>
            </div>

            <div class="field">
                <label>Castrado</label>
                <div class="chip-group">
                    ${chip("castrado", "Sí", m.castrado, "✅ Sí")}
                    ${chip("castrado", "No", m.castrado, "❌ No")}
                </div>
            </div>

            <div class="grid-2">
                <div class="field"><label>Edad aproximada</label><input id="txtEdad" value="${m.edad || ""}" placeholder="ej. 2 años"></div>
                <div class="field"><label>Color / Pelaje</label><input id="txtColor" value="${m.color || ""}"></div>
            </div>

            <div class="field">
                <label>Situación actual</label>
                <select id="selEstado">
                    ${MICHI_ESTADOS.map(e => `<option ${m.estado === e ? "selected" : ""}>${e}</option>`).join("")}
                </select>
            </div>

            <div class="field">
                <label>Observaciones</label>
                <textarea id="txtObs" rows="3" placeholder="ej. Se asusta fácil, es sordo, no perseguir...">${m.observaciones || ""}</textarea>
            </div>

            <div class="wizard-acciones">
                <button class="btn btn-secundario" id="btnAtras2">← Atrás</button>
                <button class="btn" id="btnContinuar2">Continuar →</button>
            </div>
        `;
    },

    // ---------- PASO 3 ----------
    pasoPreview() {
        const { tutor: t, michi: m } = this.state;
        return `
            <h2 style="margin-bottom:18px">Confirmá los datos</h2>
            <div class="preview-card">
                <dl>
                    <dt>Tutor</dt><dd>${t.nombre || ""} ${t.apellido || ""}</dd>
                    <dt>Celular</dt><dd>${t.celular || ""}</dd>
                    <dt>WhatsApp</dt><dd>${t.whatsapp || t.celular || ""}</dd>
                    <dt>Zona</dt><dd>${t.localidad || "—"}</dd>
                    <dt>Michi</dt><dd>${m.nombre || ""}</dd>
                    <dt>Sexo</dt><dd>${m.sexo || "—"}</dd>
                    <dt>Castrado</dt><dd>${m.castrado || "—"}</dd>
                    <dt>Edad</dt><dd>${m.edad || "—"}</dd>
                    <dt>Color</dt><dd>${m.color || "—"}</dd>
                    <dt>Estado</dt><dd>${m.estado || "—"}</dd>
                    <dt>Observaciones</dt><dd>${m.observaciones || "—"}</dd>
                </dl>
            </div>
            <div class="wizard-acciones">
                <button class="btn btn-secundario" id="btnAtras3">← Atrás</button>
                <button class="btn" id="btnGenerar">🎟 Generar chapita</button>
            </div>
        `;
    },

    // ---------- PASO 4 ----------
    pasoQR() {
        const { tutor, michi } = this.state;
        const payload = QRService.construirPayload(michi, tutor);
        const dataUrl = QRService.generarDataURL(payload, 6);

        return `
            <div class="chapita">
                <div class="emoji-grande">🐈</div>
                <h1>${michi.nombre}</h1>
                <p class="contacto">${tutor.nombre} ${tutor.apellido}</p>
                <p class="zona">${tutor.localidad || ""}</p>
                <img src="${dataUrl}" alt="Código QR" style="margin:16px auto">
                <div class="aviso">
                    ✔ No lo persigas.<br>
                    ✔ Llamá o escribí al tutor.<br>
                    ✔ Si está en peligro, ayudalo solo si podés hacerlo con seguridad.
                </div>
                <p style="font-size:12px;color:var(--text-muted)">Código: ${michi.codigo}</p>
            </div>
            <div class="wizard-acciones no-imprimir">
                <button class="btn btn-secundario" id="btnOtroTutor">🔁 Otro con este tutor</button>
                <button class="btn btn-secundario" id="btnOtro">📝 Nuevo tutor</button>
                <button class="btn" id="btnImprimir">🖨 Imprimir</button>
            </div>
        `;
    },

    // ---------- eventos ----------
    conectarEventos() {
        const s = this.state;

        const bindInput = (id, campo, obj) => {
            const el = document.getElementById(id);
            if (el) el.oninput = () => { obj[campo] = el.value; this.guardarBorrador(); };
        };

        if (s.paso === 1) {
            // Si venía de "Otro con este tutor" y volvió acá a editar a mano,
            // dejar de tratarlo como tutor existente — si no, el michi podría
            // quedar linkeado al tutor viejo con datos que ya no coinciden.
            const desvincularSiEdita = (id, campo) => {
                const el = document.getElementById(id);
                if (!el) return;
                el.oninput = () => {
                    s.tutor[campo] = el.value;
                    s.tutorExistente = false;
                    delete s.tutor.id;
                    this.guardarBorrador();
                };
            };
            desvincularSiEdita("txtNombre", "nombre");
            desvincularSiEdita("txtApellido", "apellido");
            desvincularSiEdita("txtCelular", "celular");
            desvincularSiEdita("txtWhatsapp", "whatsapp");
            desvincularSiEdita("txtLocalidad", "localidad");

            document.getElementById("txtBuscarTutor").oninput = (e) => this.pintarResultadosTutor(e.target.value);

            document.getElementById("btnContinuar1").onclick = () => {
                if (!s.tutor.nombre || !s.tutor.celular) {
                    alert("Nombre y celular son obligatorios.");
                    return;
                }
                s.paso = 2;
                this.guardarBorrador();
                this.pintar();
            };
        }

        if (s.paso === 2) {
            bindInput("txtEdad", "edad", s.michi);
            bindInput("txtColor", "color", s.michi);
            bindInput("txtObs", "observaciones", s.michi);
            bindInput("txtMichiNombre", "nombre", s.michi);

            const selEstado = document.getElementById("selEstado");
            if (selEstado) {
                selEstado.onchange = (e) => {
                    s.michi.estado = e.target.value;
                    this.guardarBorrador();
                };
            }

            document.querySelectorAll(".chip").forEach(chip => {
                chip.onclick = () => {
                    const grupo = chip.dataset.grupo;
                    const valor = chip.dataset.valor;
                    s.michi[grupo] = valor;
                    document.querySelectorAll(`.chip[data-grupo="${grupo}"]`).forEach(c =>
                        c.classList.toggle("activo", c.dataset.valor === valor)
                    );
                    this.guardarBorrador();
                };
            });

            document.getElementById("btnAtras2").onclick = () => { s.paso = 1; this.pintar(); };
            document.getElementById("btnContinuar2").onclick = () => {
                if (!s.michi.nombre) {
                    alert("El nombre del michi es obligatorio.");
                    return;
                }
                s.paso = 3;
                this.guardarBorrador();
                this.pintar();
            };
        }

        if (s.paso === 3) {
            document.getElementById("btnAtras3").onclick = () => { s.paso = 2; this.pintar(); };
            document.getElementById("btnGenerar").onclick = () => {
                try {
                    // Si es un tutor ya existente (viene con id del repo), no crear uno nuevo.
                    const tutor = (s.tutorExistente && s.tutor.id) ? s.tutor : TutorService.create(s.tutor);
                    const michi = MichiService.create(s.michi, tutor.id);
                    s.tutor = tutor;
                    s.michi = michi;
                    s.paso = 4;
                    localStorage.removeItem(this.DRAFT_KEY);
                    this.pintar();
                } catch (err) {
                    alert(err.message);
                }
            };
        }

        if (s.paso === 4) {
            document.getElementById("btnImprimir").onclick = () => window.print();
            document.getElementById("btnOtroTutor").onclick = () => {
                const tutorActual = s.tutor;
                this.state = { paso: 2, tutor: tutorActual, tutorExistente: true, michi: { estado: "Tiene tutor" } };
                this.guardarBorrador();
                this.pintar();
            };
            document.getElementById("btnOtro").onclick = () => {
                this.reiniciar();
                this.pintar();
            };
        }
    }
};
