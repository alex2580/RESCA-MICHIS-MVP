const ImportService = {
    CAMPOS: [
        "tutor_nombre", "tutor_apellido", "tutor_celular", "tutor_whatsapp", "tutor_localidad",
        "michi_nombre", "michi_sexo", "michi_castrado", "michi_edad", "michi_color", "michi_estado", "michi_observaciones"
    ],
    OBLIGATORIOS: ["tutor_nombre", "tutor_celular", "michi_nombre"],

    escaparCampo(valor) {
        const v = String(valor ?? "");
        if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
        return v;
    },

    plantilla() {
        const header = this.CAMPOS.join(",");
        const ejemplo = [
            "Alejandro", "Laporte", "54 9 11 3948 5712", "", "San Miguel, Buenos Aires",
            "Sam", "Macho", "Sí", "4-5 años", "Gris y blanco, M en la frente", "Tiene tutor", "Collar violeta con chapita"
        ].map(v => this.escaparCampo(v)).join(",");
        return header + "\n" + ejemplo + "\n";
    },

    descargarPlantilla() {
        const blob = new Blob([this.plantilla()], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resca-michis-plantilla.csv";
        a.click();
        URL.revokeObjectURL(url);
    },

    // Parser CSV con soporte de comillas (RFC4180-like) — evita romperse
    // con comas u observaciones largas dentro de un campo entre comillas.
    parsear(texto) {
        const filas = [];
        let fila = [];
        let campo = "";
        let enComillas = false;
        let inicioDeCampo = true; // una comilla solo abre modo-comillas si es el primer char del campo
        const s = texto.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

        for (let i = 0; i < s.length; i++) {
            const c = s[i];
            if (enComillas) {
                if (c === '"') {
                    if (s[i + 1] === '"') { campo += '"'; i++; }
                    else enComillas = false;
                } else {
                    campo += c;
                }
            } else if (c === '"' && inicioDeCampo) {
                enComillas = true;
                inicioDeCampo = false;
            } else if (c === ",") {
                fila.push(campo); campo = ""; inicioDeCampo = true;
            } else if (c === "\n") {
                fila.push(campo); campo = "";
                filas.push(fila); fila = [];
                inicioDeCampo = true;
            } else {
                campo += c;
                inicioDeCampo = false;
            }
        }
        if (campo.length > 0 || fila.length > 0) { fila.push(campo); filas.push(fila); }
        return filas;
    },

    normalizarCelular(v) {
        return String(v || "").replace(/[^\d+]/g, "");
    },

    // Si el estado del CSV no coincide con ninguno de los que la app conoce
    // (MICHI_ESTADOS), se guarda igual pero se avisa — si no, MichisListView
    // no le encuentra emoji y queda fuera de cualquier filtro por estado.
    resolverEstado(valorCrudo, numFila, advertencias) {
        if (!valorCrudo) return "Tiene tutor";
        const match = MICHI_ESTADOS.find(e => e.toLowerCase() === valorCrudo.toLowerCase());
        if (match) return match;
        advertencias.push(`Fila ${numFila}: michi_estado "${valorCrudo}" no es uno de los valores esperados (${MICHI_ESTADOS.join(", ")}) — se guardó igual, revisalo.`);
        return valorCrudo;
    },

    procesar(texto) {
        const filas = this.parsear(texto);
        if (filas.length === 0) throw new Error("El archivo está vacío.");

        const header = filas[0].map(h => h.trim().toLowerCase());
        const filasDatos = filas.slice(1);

        const idx = {};
        this.CAMPOS.forEach(campo => { idx[campo] = header.indexOf(campo); });

        const faltantes = this.OBLIGATORIOS.filter(c => idx[c] === -1);
        if (faltantes.length > 0) {
            throw new Error(`Faltan columnas obligatorias en el CSV: ${faltantes.join(", ")}.`);
        }

        // Tutores existentes en la base, indexados por celular normalizado
        // para reusarlos en vez de duplicarlos (ej. las 30 filas del mismo tutor).
        const tutoresPorCelular = new Map();
        TutorRepository.all().forEach(t => {
            const key = this.normalizarCelular(t.celular);
            if (key) tutoresPorCelular.set(key, t);
        });

        const resultado = { tutoresCreados: 0, tutoresReusados: 0, michisCreados: 0, errores: [], advertencias: [] };

        filasDatos.forEach((cols, i) => {
            const numFila = i + 2; // +1 por el header, +1 porque las planillas arrancan en 1
            if (cols.every(c => c.trim() === "")) return; // fila en blanco, no cuenta como error

            const valor = (campo) => (idx[campo] === -1 ? "" : (cols[idx[campo]] || "").trim());
            let tutorCreadoEnEstaFila = null;
            let celularKeyDeEstaFila = null;

            try {
                const nombreMichi = valor("michi_nombre");
                if (!nombreMichi) throw new Error("michi_nombre vacío");

                const celular = valor("tutor_celular");
                const celularKey = this.normalizarCelular(celular);
                let tutor = celularKey ? tutoresPorCelular.get(celularKey) : null;

                if (!tutor) {
                    const nombreTutor = valor("tutor_nombre");
                    if (!nombreTutor || !celular) {
                        throw new Error("tutor_nombre y tutor_celular son obligatorios para dar de alta un tutor nuevo");
                    }
                    tutor = TutorService.create({
                        nombre: nombreTutor,
                        apellido: valor("tutor_apellido"),
                        celular,
                        whatsapp: valor("tutor_whatsapp"),
                        localidad: valor("tutor_localidad")
                    });
                    if (celularKey) tutoresPorCelular.set(celularKey, tutor);
                    tutorCreadoEnEstaFila = tutor;
                    celularKeyDeEstaFila = celularKey;
                }

                const estado = this.resolverEstado(valor("michi_estado"), numFila, resultado.advertencias);

                MichiService.create({
                    nombre: nombreMichi,
                    sexo: valor("michi_sexo"),
                    castrado: valor("michi_castrado"),
                    edad: valor("michi_edad"),
                    color: valor("michi_color"),
                    estado,
                    observaciones: valor("michi_observaciones")
                }, tutor.id);

                if (tutorCreadoEnEstaFila) resultado.tutoresCreados++;
                else resultado.tutoresReusados++;
                resultado.michisCreados++;
            } catch (err) {
                // Si el tutor se acaba de crear en esta fila y el michi falló después,
                // no dejarlo huérfano en la base — deshacer y sacarlo del cache de celulares.
                if (tutorCreadoEnEstaFila) {
                    TutorRepository.eliminar(tutorCreadoEnEstaFila.id);
                    if (celularKeyDeEstaFila) tutoresPorCelular.delete(celularKeyDeEstaFila);
                }
                resultado.errores.push({ fila: numFila, motivo: err.message });
            }
        });

        EventService.log("Importación CSV", `${resultado.michisCreados} michis · ${resultado.tutoresCreados} tutores nuevos · ${resultado.errores.length} errores · ${resultado.advertencias.length} advertencias`);
        return resultado;
    },

    importarArchivo(archivo, alTerminar) {
        const lector = new FileReader();
        lector.onload = (e) => {
            try {
                const resultado = this.procesar(e.target.result);
                alTerminar(null, resultado);
            } catch (err) {
                alTerminar(err);
            }
        };
        lector.onerror = () => alTerminar(new Error("No se pudo leer el archivo."));
        lector.readAsText(archivo, "UTF-8");
    }
};
