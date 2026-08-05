const LoginView = {
    render(onDesbloqueo) {
        const overlay = document.createElement("div");
        overlay.className = "login-overlay";
        overlay.innerHTML = `
            <div class="login-card">
                <div class="emoji">🐈</div>
                <h2>RESCA MICHIS</h2>
                <p class="login-sub">Ingresá el PIN de administrador</p>
                <div class="field">
                    <input type="password" id="txtPin" placeholder="PIN" inputmode="numeric">
                </div>
                <p class="login-error" id="loginError"></p>
                <button class="btn btn-block" id="btnEntrar">Entrar</button>
            </div>
        `;
        document.body.appendChild(overlay);

        const txtPin = document.getElementById("txtPin");
        const loginError = document.getElementById("loginError");
        txtPin.focus();

        const intentarEntrar = () => {
            if (Auth.intentar(txtPin.value)) {
                overlay.remove();
                onDesbloqueo();
            } else {
                loginError.textContent = "PIN incorrecto";
                txtPin.value = "";
                txtPin.focus();
            }
        };

        document.getElementById("btnEntrar").onclick = intentarEntrar;
        txtPin.addEventListener("keydown", (e) => {
            if (e.key === "Enter") intentarEntrar();
        });
    }
};
