const MichiService = {
    create(data, tutorId) {
        if (!data.nombre) {
            throw new Error("El nombre del michi es obligatorio.");
        }
        const michi = new Michi();
        michi.id = crypto.randomUUID();
        michi.codigo = this.nextCodigo();
        michi.tutorId = tutorId;
        michi.nombre = data.nombre.trim();
        michi.sexo = data.sexo || "";
        michi.edad = data.edad || "";
        michi.color = (data.color || "").trim();
        michi.castrado = data.castrado || "";
        michi.estado = data.estado || "Tiene tutor";
        michi.observaciones = (data.observaciones || "").trim();

        MichiRepository.save(michi);
        EventService.log("Michi registrado", `${michi.codigo} · ${michi.nombre}`);
        return michi;
    },

    nextCodigo() {
        return "MICHI-" + String(MichiRepository.all().length + 1).padStart(6, "0");
    }
};
