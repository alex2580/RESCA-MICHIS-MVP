const BackupView = {
    render() {
        const db = Storage.load();
        document.getElementById("workspace").innerHTML = `
            <div class="panel">
                <h2>Backup de datos</h2>
                <p style="color:var(--text-muted);margin-bottom:18px">
                    Todo se guarda solo en este navegador. Si cambiás de dispositivo o borrás
                    los datos del navegador, vas a perder la información salvo que tengas un backup.
                </p>
                <p id="contadorBackup" style="margin-bottom:18px">📦 ${db.tutores.length} tutores · ${db.michis.length} michis</p>
                <button class="btn" id="btnExportar">⬇️ Descargar backup (.json)</button>
            </div>

            <div class="panel">
                <h2>Restaurar backup</h2>
                <input type="file" id="fileRestaurar" accept="application/json">
                <p id="msgRestaurar" style="margin-top:10px;font-size:13px"></p>
            </div>

            <div class="panel">
                <h2>Importar michis desde CSV</h2>
                <p style="color:var(--text-muted);margin-bottom:18px">
                    Para cargar varios michis de una — no reemplaza nada, solo agrega tutores y michis nuevos.
                    Si varias filas tienen el mismo celular de tutor, se reusa el mismo tutor en vez de duplicarlo.
                </p>
                <button class="btn btn-secundario" id="btnPlantillaCSV" style="margin-bottom:12px">⬇️ Descargar plantilla CSV</button>
                <input type="file" id="fileImportarCSV" accept=".csv,text/csv">
                <div id="msgImportarCSV" style="margin-top:10px;font-size:13px"></div>
            </div>
        `;

        document.getElementById("btnExportar").onclick = () => BackupService.exportar();

        document.getElementById("fileRestaurar").onchange = (e) => {
            const archivo = e.target.files[0];
            if (!archivo) return;
            if (!confirm("Esto reemplaza todos los datos actuales por los del backup. ¿Continuar?")) return;
            BackupService.importar(archivo, (err) => {
                const msg = document.getElementById("msgRestaurar");
                if (err) {
                    msg.style.color = "var(--danger-dark)";
                    msg.textContent = "Error: " + err.message;
                } else {
                    msg.style.color = "var(--mint-dark)";
                    msg.textContent = "Backup restaurado correctamente.";
                    setTimeout(() => Router.navegar("dashboard"), 1000);
                }
            });
        };

        document.getElementById("btnPlantillaCSV").onclick = () => ImportService.descargarPlantilla();

        document.getElementById("fileImportarCSV").onchange = (e) => {
            const archivo = e.target.files[0];
            if (!archivo) return;
            const msg = document.getElementById("msgImportarCSV");
            msg.style.color = "var(--text-muted)";
            msg.textContent = "Importando...";

            ImportService.importarArchivo(archivo, (err, resultado) => {
                e.target.value = "";
                if (err) {
                    msg.style.color = "var(--danger-dark)";
                    msg.textContent = "Error: " + err.message;
                    return;
                }
                const resumen = `✔ ${resultado.michisCreados} michis importados · ${resultado.tutoresCreados} tutores nuevos · ${resultado.tutoresReusados} tutores reusados`;
                let html = `<span style="color:var(--mint-dark)">${resumen}</span>`;

                if (resultado.advertencias.length > 0) {
                    const listaAdvertencias = resultado.advertencias.map(a => `<li>${a}</li>`).join("");
                    html += `<br><span style="color:var(--text-muted)">⚠ ${resultado.advertencias.length} advertencias:</span><ul style="margin:6px 0 0 18px;color:var(--text-muted)">${listaAdvertencias}</ul>`;
                }
                if (resultado.errores.length > 0) {
                    const listaErrores = resultado.errores.map(er => `<li>Fila ${er.fila}: ${er.motivo}</li>`).join("");
                    html += `<br><span style="color:var(--danger-dark)">✖ ${resultado.errores.length} filas con error:</span><ul style="margin:6px 0 0 18px;color:var(--danger-dark)">${listaErrores}</ul>`;
                }
                msg.style.color = "";
                msg.innerHTML = html;
                if (resultado.michisCreados > 0 || resultado.tutoresCreados > 0) {
                    const db = Storage.load();
                    document.getElementById("contadorBackup").textContent = `📦 ${db.tutores.length} tutores · ${db.michis.length} michis`;
                }
            });
        };
    }
};
