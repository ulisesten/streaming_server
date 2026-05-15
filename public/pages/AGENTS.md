# Contexto del proyecto

## videos_subir_v2/functions/fun.subir_videos.js

- `funSerieNueva` debe leer datos directamente del formulario `frm_videos_serie_nueva` usando `Gb.getEl(...).getValues()`.
- No usar parámetros de entrada para esta función en este flujo; el origen de `ser_nombre` y `ser_id_thumbnail` es el form.
- La petición debe ir por `POST` a `url_vid_serie_nueva` con `Content-Type: application/json`.
- El payload esperado:
  - `ser_nombre: vals.ser_nombre`
  - `ser_id_thumbnail: vals.ser_id_thumbnail || 0`
- Mantener manejo de errores con `try/catch`, `console.error` y `Gb.define('notification', ...)`.
