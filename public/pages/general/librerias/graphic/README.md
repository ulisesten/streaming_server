# Combobox

## Crear un combobox

```js
Gb.define('cbx_series', {
  type: 'combobox',
  id: 'cbx_series',
  cls: 'mi_combo',
  options: [
    { id: 1, name: 'Serie 1' },
    { id: 2, name: 'Serie 2' }
  ],
  fields: {
    id: 'id',
    name: 'name'
  },
  onSelect: (value, el) => {
    console.log('Seleccionado:', value, el);
  }
});
```

## Opciones soportadas

- `type`: Debe ser `combobox`.
- `id`: ID del elemento `<select>`.
- `cls`: Clase CSS adicional.
- `options`: Opciones locales.
- `fields.id`: Campo para el `value` de cada opción (default: `id`).
- `fields.name`: Campo para el texto visible de cada opción (default: `name`).
- `url`: Endpoint para carga remota.
- `remote`: Habilita flujo remoto.
- `autoload`: Si es `true`, carga automáticamente con `load()`.
- `result`: Clave del arreglo dentro de la respuesta JSON.
- `onSelect`: Callback al cambiar selección. Recibe `(value, element)`.

## Métodos disponibles

- `getEl()`: Retorna el elemento `<select>`.
- `getValue()`: Retorna el valor seleccionado.
- `setUrl(url)`: Define la URL de carga remota.
- `setOptions(options)`: Reemplaza opciones actuales.
- `load(extraParams)`: Carga opciones desde `url` (opcionalmente con query params).

## Ejemplo remoto

```js
Gb.define('cbx_series_remote', {
  type: 'combobox',
  id: 'cbx_series_remote',
  url: '/api/series/listar',
  remote: true,
  autoload: true,
  result: 'series',
  fields: {
    id: 'ser_id',
    name: 'ser_nombre'
  },
  onSelect: (value) => {
    console.log('Serie seleccionada:', value);
  }
});
```
