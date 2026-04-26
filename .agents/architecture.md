## Arquitectura

- Arquitectura basada en dominio.
- Se usa DTO para adaptar la respuesta y Services para tareas ajenas al modelo de negocio (ej. envío de notificaciones o configuraciones técnicas).
- Para cada módulo se ubica todo lo correspondiente en ese mismo folder, estructurado en:
  - `domain/` - Lógica de negocio y modelos
  - `service/` - Servicios técnicos y externos (notificaciones, configuraciones)
  - `dto/` - Objetos de transferencia de datos para adaptar respuestas
- Para funcionalidades generales (compartidas entre múltiples módulos), ubicarlas en el folder `generales/`.

## Base de datos

- Basada en **procedimientos almacenados**.
- Los procedimientos tienen procesos internos controlados por:
  - `tipoProceso` → Para operaciones de **alta** (INSERT, UPDATE, DELETE)
  - `tipoConsulta` → Para operaciones de **select** (consultas)
- La conexión a la base de datos se realiza a través del adaptador `store_eject`.

## Reglas de generación de código

- Al generar un nuevo módulo, crear automáticamente la estructura `domain/`, `service/`, `dto/`.
- Al generar un procedimiento almacenado, preguntar si es `tipoProceso` o `tipoConsulta`.
- Usar siempre `store_eject` como único punto de acceso a la base de datos, nunca SQL directo en el código.
- Los DTO deben reflejar la estructura de respuesta esperada por el frontend, no directamente las tablas.