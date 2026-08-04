const QRService = {
    construirPayload(michi, tutor) {
        const lineas = [
            `🐈 ${michi.nombre.toUpperCase()} busca a su familia`,
            `RESCA MICHIS`,
            ``,
            `Tel: ${tutor.celular}`,
        ];
        if (tutor.whatsapp) lineas.push(`WhatsApp: ${tutor.whatsapp}`);
        if (tutor.localidad) lineas.push(`Zona: ${tutor.localidad}`);
        lineas.push(``, `No lo persigas si está asustado.`, `Por favor comunicate con el tutor. ❤️`);
        return lineas.join("\n");
    },

    generarDataURL(texto, cellSize) {
        const qr = qrcode(0, "M");
        qr.addData(texto);
        qr.make();
        return qr.createDataURL(cellSize || 6, 8);
    }
};
