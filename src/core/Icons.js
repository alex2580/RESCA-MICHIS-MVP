const Icons = {
    // Gatito color point siamés — no existe emoji para esto, así que se dibuja.
    // Escala como el emoji que reemplaza: recibe el tamaño en px y se pinta a ese tamaño exacto.
    gatoSiames(size = 40) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:inline-block;vertical-align:middle">
            <path d="M20 38 L29 8 L42 34 Z" fill="#4A2C1D"/>
            <path d="M80 38 L71 8 L58 34 Z" fill="#4A2C1D"/>
            <ellipse cx="50" cy="58" rx="33" ry="29" fill="#F3E2C8"/>
            <path d="M50 30 C67 30 78 44 76 60 C74 76 62 84 50 84 C38 84 26 76 24 60 C22 44 33 30 50 30 Z" fill="#4A2C1D"/>
            <ellipse cx="50" cy="80" rx="16" ry="7" fill="#F3E2C8"/>
            <ellipse cx="40" cy="56" rx="6" ry="8" fill="#6FD3F0"/>
            <ellipse cx="60" cy="56" rx="6" ry="8" fill="#6FD3F0"/>
            <ellipse cx="40" cy="58" rx="2.2" ry="4" fill="#1B1B1B"/>
            <ellipse cx="60" cy="58" rx="2.2" ry="4" fill="#1B1B1B"/>
            <circle cx="41.5" cy="54" r="1" fill="#FFFFFF"/>
            <circle cx="61.5" cy="54" r="1" fill="#FFFFFF"/>
            <path d="M46 68 L54 68 L50 73 Z" fill="#E7A9A0"/>
            <path d="M50 73 C48 76 45 77 42 76" stroke="#2A1810" stroke-width="1.4" fill="none" stroke-linecap="round"/>
            <path d="M50 73 C52 76 55 77 58 76" stroke="#2A1810" stroke-width="1.4" fill="none" stroke-linecap="round"/>
            <path d="M14 60 L27 58" stroke="#4A2C1D" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M14 66 L27 64" stroke="#4A2C1D" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M86 60 L73 58" stroke="#4A2C1D" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M86 66 L73 64" stroke="#4A2C1D" stroke-width="1.2" stroke-linecap="round"/>
        </svg>`;
    }
};
