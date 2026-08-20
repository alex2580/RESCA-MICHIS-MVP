const QRService = {
    BASE_URL_FICHA: "https://alex2580.github.io/RESCA-MICHIS-MVP/ficha.html",

    construirURLFicha(michi, tutor) {
        const p = new URLSearchParams();
        p.set("n", michi.nombre || "");
        if (michi.sexo) p.set("s", michi.sexo);
        if (michi.castrado) p.set("cs", michi.castrado);
        if (michi.edad) p.set("e", michi.edad);
        if (michi.color) p.set("c", michi.color);
        if (michi.estado) p.set("es", michi.estado);
        if (tutor.nombre || tutor.apellido) p.set("tn", `${tutor.nombre || ""} ${tutor.apellido || ""}`.trim());
        if (tutor.celular) p.set("t", tutor.celular);
        if (tutor.whatsapp) p.set("w", tutor.whatsapp);
        if (tutor.localidad) p.set("z", tutor.localidad);
        return `${this.BASE_URL_FICHA}?${p.toString()}`;
    },

    generarDataURL(texto, cellSize) {
        const qr = qrcode(0, "M");
        qr.addData(texto);
        qr.make();
        return qr.createDataURL(cellSize || 6, 8);
    }
};
