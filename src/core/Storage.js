const Storage = {
    KEY: "RESCA_MICHIS_MVP_DB",

    initialize() {
        if (localStorage.getItem(this.KEY)) return;
        this.save({
            tutores: [],
            michis: [],
            eventos: []
        });
    },

    load() {
        return JSON.parse(localStorage.getItem(this.KEY));
    },

    save(db) {
        localStorage.setItem(this.KEY, JSON.stringify(db));
    },

    exportarBackup() {
        const db = this.load();
        const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const fecha = new Date().toISOString().slice(0, 10);
        const a = document.createElement("a");
        a.href = url;
        a.download = `resca-michis-backup-${fecha}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    restaurarBackup(jsonTexto) {
        const db = JSON.parse(jsonTexto);
        if (!db.tutores || !db.michis) {
            throw new Error("El archivo no tiene el formato esperado.");
        }
        this.save(db);
    }
};
