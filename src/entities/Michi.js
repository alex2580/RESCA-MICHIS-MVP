const MICHI_ESTADOS = [
    "Tiene tutor",
    "En tránsito",
    "Colonia feral",
    "Rescatado",
    "En adopción"
];

class Michi {
    constructor() {
        this.id = "";
        this.codigo = "";
        this.tutorId = "";
        this.nombre = "";
        this.sexo = "";
        this.edad = "";
        this.color = "";
        this.castrado = "";
        this.estado = "Tiene tutor";
        this.observaciones = "";
        this.fechaAlta = new Date().toISOString();
    }
}
