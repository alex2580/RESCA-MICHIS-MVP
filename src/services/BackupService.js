const BackupService = {
    exportar() {
        Storage.exportarBackup();
        EventService.log("Backup exportado", new Date().toLocaleString());
    },

    importar(archivo, alTerminar) {
        const lector = new FileReader();
        lector.onload = (e) => {
            try {
                Storage.restaurarBackup(e.target.result);
                EventService.log("Backup restaurado", archivo.name);
                alTerminar(null);
            } catch (err) {
                alTerminar(err);
            }
        };
        lector.readAsText(archivo);
    }
};
