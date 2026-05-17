# Reglas del proyecto

## Estilo de funciones

- Deben leer datos directamente de los formularios usando `Gb.getEl(...).getValues()`.
- No usar parámetros de entrada para mejor abstracción.
- La petición debe ir a una url en fun.constants.js con `Content-Type: application/json`.
- Mantener manejo de errores con `try/catch`, `console.error` y `Gb.define('notification', ...)`.
- En caso de éxito cerrar las ventanas de los forms y usar reset, igual para los progressBar.
- Mantener las funciones simples sin agregar complejidad o modularización innecesaria.
