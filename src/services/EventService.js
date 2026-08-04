const EventService = {
    log(accion, detalle) {
        const db = Storage.load();
        db.eventos.unshift({
            fecha: new Date().toISOString(),
            accion,
            detalle
        });
        db.eventos = db.eventos.slice(0, 50);
        Storage.save(db);
    },

    recientes(cantidad) {
        return Storage.load().eventos.slice(0, cantidad || 5);
    }
};
