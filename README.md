# RESCA MICHIS — MVP

App para rescatistas de gatos: genera chapitas con código QR que muestran datos mínimos de contacto del tutor cuando alguien encuentra un gato perdido.

Este es el **MVP acotado**, distinto de la versión más completa (`resca-michis/`, con mapa, colonias, adopción, etc.) que queda guardada aparte para más adelante.

## Decisiones de diseño

- **Sin hosting.** Todo corre en el navegador con `localStorage`. No hay backend, no hay base de datos remota.
- **QR 100% offline.** El código QR contiene directamente el texto con nombre, teléfono/WhatsApp y zona del tutor — no un link a un servidor. Cualquier lector de QR lo muestra sin necesitar conexión.
- **Un solo usuario (admin).** Ale carga los datos de tutores y michis y genera las chapitas. No hay login ni autogestión por parte de los dueños.
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
