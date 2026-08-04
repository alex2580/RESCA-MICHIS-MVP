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
                <p style="margin-bottom:18px">📦 ${db.tutores.length} tutores · ${db.michis.length} michis</p>
                <button class="btn" id="btnExportar">⬇️ Descargar backup (.json)</button>
            </div>

            <div class="panel">
                <h2>Restaurar backup</h2>
                <input type="file" id="fileRestaurar" accept="application/json">
                <p id="msgRestaurar" style="margin-top:10px;font-size:13px"></p>
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
    }
};
