const Auth = {
    // Cambiar acá el PIN de administrador.
    PIN: "michis2026",
    SESSION_KEY: "RESCA_MICHIS_UNLOCKED",

    estaDesbloqueado() {
        return sessionStorage.getItem(this.SESSION_KEY) === "1";
    },

    intentar(pin) {
        if (pin === this.PIN) {
            sessionStorage.setItem(this.SESSION_KEY, "1");
            return true;
        }
        return false;
    },

    bloquear() {
        sessionStorage.removeItem(this.SESSION_KEY);
        location.reload();
    }
};
