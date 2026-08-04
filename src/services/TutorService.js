const TutorService = {
    create(data) {
        if (!data.nombre || !data.celular) {
            throw new Error("Nombre y celular del tutor son obligatorios.");
        }
        const tutor = new Tutor();
        tutor.id = crypto.randomUUID();
        tutor.codigo = this.nextCodigo();
        tutor.nombre = data.nombre.trim();
        tutor.apellido = (data.apellido || "").trim();
        tutor.celular = data.celular.trim();
        tutor.whatsapp = (data.whatsapp || data.celular).trim();
        tutor.localidad = (data.localidad || "").trim();

        TutorRepository.save(tutor);
        EventService.log("Tutor registrado", `${tutor.codigo} · ${tutor.nombre}`);
        return tutor;
    },

    nextCodigo() {
        return "GUA-" + String(TutorRepository.all().length + 1).padStart(6, "0");
    }
};
