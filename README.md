# RESCA MICHIS — MVP

App para rescatistas de gatos: genera chapitas con código QR que muestran datos mínimos de contacto del tutor cuando alguien encuentra un gato perdido.

Este es el **MVP acotado**, distinto de la versión más completa (`resca-michis/`, con mapa, colonias, adopción, etc.) que queda guardada aparte para más adelante.

## Decisiones de diseño

- **Sin hosting para la app en sí.** El alta de tutores/michis corre 100% en el navegador con `localStorage`. No hay backend, no hay base de datos remota — cargar datos no requiere conexión.
- **QR con datos embebidos en la URL (no hay base de datos que "matchear").** El código QR contiene un link a `ficha.html` con todos los datos como parámetros de la URL (nombre, sexo, edad, color, estado, tutor, celular, WhatsApp, zona). Al escanearlo, el celular de quien encuentra al gato abre esa página y la muestra ya formateada, con botones de Llamar/WhatsApp — sin login, sin buscar nada en ningún lado, porque el dato ya viaja en el propio QR. Para que esto funcione al escanear desde otro dispositivo, `ficha.html` tiene que estar publicado en algún hosting estático (ver `QRService.BASE_URL_FICHA`, hoy apunta a GitHub Pages de este repo) — si el repo no tiene Pages habilitado, el QR se genera igual pero el link no abre nada hasta publicarlo.
- **Un solo usuario (admin).** Ale carga los datos de tutores y michis y genera las chapitas. No hay autogestión por parte de los dueños. Hay una pantalla de PIN (`src/core/Auth.js`) que bloquea el acceso — es un candado simple del lado del cliente, no autenticación real (no hay backend que lo valide), pensado para que alguien que agarre el dispositivo no vea de arranque los datos de contacto de los tutores.
- **Solo gatos por ahora.** El modelo de datos se puede extender a otras mascotas más adelante si hace falta.
- **Backup manual.** Como no hay servidor, hay una pantalla para exportar/restaurar un `.json` con todos los datos y no depender solo del navegador.

## Cómo correrlo

No se puede abrir el `index.html` con doble clic (`file://` no sirve para módulos por `<script src>`). Hay que levantar un servidor local:

```bash
cd resca-michis-mvp
python3 -m http.server 8080
```

Y abrir `http://localhost:8080/`.

## Estructura

```
index.html
src/
  core/         Storage (localStorage), Router, App (bootstrap)
  entities/     Tutor, Michi
  repositories/ acceso a los datos guardados
  services/     lógica de negocio (alta, código automático, QR, backup)
  views/        pantallas (Dashboard, Registro, Michis, Backup)
  vendor/       librería QR vendorizada (kazuhikoarase/qrcode-generator, MIT) — offline, sin CDN
assets/css/     estilos (paleta pastel)
```
