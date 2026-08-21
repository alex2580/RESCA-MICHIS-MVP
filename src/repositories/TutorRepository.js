class TutorRepository {
    static all() {
        return Storage.load().tutores;
    }

    static findById(id) {
        return this.all().find(t => t.id === id) || null;
    }

    static save(tutor) {
        const db = Storage.load();
        db.tutores.push(tutor);
        Storage.save(db);
    }

    static update(tutor) {
        const db = Storage.load();
        const i = db.tutores.findIndex(t => t.id === tutor.id);
        if (i === -1) return;
        db.tutores[i] = tutor;
        Storage.save(db);
    }

    static eliminar(id) {
        const db = Storage.load();
        db.tutores = db.tutores.filter(t => t.id !== id);
        Storage.save(db);
    }

    static buscarPorApellido(texto) {
        const t = texto.trim().toLowerCase();
        if (!t) return [];
        return this.all().filter(tu => (tu.apellido || "").toLowerCase().includes(t));
    }
}
