# 🎬 Proyecto de Streaming con HLS

Este proyecto implementa un **servidor de streaming de video** que convierte archivos `.mp4` en formato **HLS (HTTP Live Streaming)** mediante **FFmpeg (libavformat, libavcodec)** en **C++**, y los expone a través de un backend en **Node.js** para ser reproducidos en el navegador con **hls.js**.

---

## 🚀 Características
- Conversión de archivos de video (`.mp4`, `.mkv`) a **HLS** (playlist `.m3u8` + segmentos `.ts`).
- Implementación en C++ con **FFmpeg** (`libavformat`, `libavcodec`, `libavutil`).
- Servidor en **Node.js (Express)** para exponer los recursos.
- Reproductor en el navegador con **hls.js**.
- Compatible con navegadores modernos (Chrome, Firefox, Edge).

---

## 📂 Estructura del Proyecto

```bash
streaming_server/
├── public/
│  ├── hls/
|  |  ├── videos/ # Archivos HLS generados (playlist + segmentos) para videos
|  |  └── lives/  # Archivos HLS generados (playlist + segmentos) para lives
│  ├── css/
│  │  └── style.css # Estilos del reproductor
│  ├── js/
│  │  └── player.js # Lógica del reproductor con hls.js
│  └── index.html # Página principal
├── src/
|  ├── native/
|  |  ├── straming_module.cpp
│  |  ├── video_processor.cpp # Clase en C++ que convierte a HLS
│  |  └── video_processor.h
|  └── server/
|       └── app/
|           ├── core/
|           |   └── configuration.js
|           ├── librerias/
|           |   ├── authorization/
|           |   |       └── authorization.js 
|           |   ├── common/
|           |   |       └── images.js
|           |   ├── encrypt/
|           |   |       └── encrypt.js
|           |   ├── jwt/
|           |   |       └── jwt.js
|           |   └── sql_server/
|           |           └── sql_eject.js
|           └── routes/
|                   └── api/
|                       └── v1/
|                           ├── users/
|                           ├── videos/
|
├── server.js # Servidor Express que expone los videos
├── binding.gyp # Configuración para compilar el addon de Node.js
├── package.json
└── README.md
```


---

## ⚙️ Requisitos

- **Node.js** ≥ 18
- **FFmpeg (libav)** con desarrollo (`libavformat`, `libavcodec`, `libavutil`, `libavfilter`)
- **npm** o **yarn**
- **Compilador C++17 (g++, clang o MSVC)**

En Ubuntu/Debian puedes instalar dependencias con:

```bash
sudo apt update
sudo apt install ffmpeg libavformat-dev libavcodec-dev libavutil-dev libavfilter-dev build-essential
```

En Fedora
```bash
sudo dnf install ffmpeg ffmpeg-devel gcc-c++
```

Variables de entorno
```bash
DB_USER=mi_usuario
DB_PASSWORD=mi_contrasena
DB_SERVER=mi_server
DB_DATABASE=soda_stream
DB_ENCRYPT=true
DB_TRUST_CERTIFICATE=true

SERVER_HOST="http://127.0.0.1"
SERVER_PORT="3000"
BACKEND_CORS_ORIGINS="http://localhost:3000"

SECRET_KEY="mi_secret"
EXPIRATION_DAYS=30

USU_ID=53345
USU_CORREO="mi_correo@gmail.com"
USU_NOMBRE="Nombre Usuario"

API_NAS = '/apinas/images/videos'

PUBLIC_ID_LENGTH=11
```
---

## 🛠️ Instalación y Compilación

```bash
npm run build
npm start
```

---

## ▶️ Uso

Coloca tu archivo de video en la carpeta videos/ (ejemplo: video.mp4).
Ejecuta el servidor
http://localhost:3000

El servidor convertirá el video a HLS (si no existe aún) y servirá los archivos .m3u8 y .ts al reproductor.

---

## 🎥 Ejemplo de Flujo Interno

El cliente abre la página → index.html.

player.js usa hls.js para pedir /hls/video/playlist.m3u8.

El backend llama a VideoProcessor::convertToHLS() en C++ para convertir el archivo .mp4.

Se generan:

playlist.m3u8

segment-000.ts, segment-001.ts, …

El navegador reproduce el stream progresivamente.


---

## 🧩 Clase VideoProcessor

La clase en C++ usa FFmpeg para:

Abrir el archivo de entrada con avformat_open_input.

Crear un contexto de salida HLS (avformat_alloc_output_context2 con formato "hls").

Copiar los streams de video/audio al contenedor de salida.

Configurar opciones HLS (duración de segmentos, lista infinita, nombres de archivo).

Escribir los paquetes (AVPacket) desde input → output con av_interleaved_write_frame.

Cerrar los contextos y liberar memoria.


---

## 🔮 Próximas Mejoras

Generar múltiples calidades (ABR - Adaptive Bitrate).

Agregar soporte para subtítulos y metadata.

Implementar caché de transcodificación.

Añadir API REST para subir/borrar videos.


---

## 📜 Licencia

Este proyecto está bajo la licencia MIT.
¡Úsalo, modifícalo y compártelo libremente!