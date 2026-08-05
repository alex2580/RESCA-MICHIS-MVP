class MichiRepository {
    static all() {
        return Storage.load().michis;
    }

    static findById(id) {
        return this.all().find(m => m.id === id) || null;
    }

    static save(michi) {
        const db = Storage.load();
        db.michis.push(michi);
        Storage.save(db);
    }

    static update(michi) {
        const db = Storage.load();
        const i = db.michis.findIndex(m => m.id === michi.id);
        if (i === -1) return;
        db.michis[i] = michi;
        Storage.save(db);
    }

    static eliminar(id) {
        const db = Storage.load();
        db.michis = db.michis.filter(m => m.id !== id);
        Storage.save(db);
    }

    static buscar(texto) {
        const t = texto.trim().toLowerCase();
        if (!t) return this.all();
        return this.all().filter(m =>
            m.nombre.toLowerCase().includes(t) ||
            m.codigo.toLowerCase().includes(t)
        );
    }
}
