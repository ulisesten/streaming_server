const express = require('express');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const router = express.Router();

const hlsBaseDir = path.join(process.cwd(), 'public/hls');
if (!fs.existsSync(hlsBaseDir)) {
    fs.mkdirSync(hlsBaseDir, { recursive: true });
}

// Importar el módulo nativo - verificar la ruta correcta
let nativeModule;
try {
    nativeModule = require('../../build/Release/video_streamer');
} catch (error) {
    console.warn('[ERROR]: Módulo nativo no disponible.');
    nativeModule = null;
}



// Servir archivos estáticos
/* router.use(express.static(config.publicPath));
router.use('hls/videos', express.static(hlsBaseDir, {
    setHeaders: (res, p) => {
      if (p.endsWith('.m3u8')) res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      if (p.endsWith('.ts'))   res.setHeader('Content-Type', 'video/mp2t');
    }
})); */



// Ruta para obtener información del video
/* router.get('/videoinfo/:videoName', (req, res) => {
    if (!nativeModule) {
        return res.status(500).json({ error: 'Fallo al iniciar proceso de streaming.' });
    }

    const videoName = req.params.videoName;
    const videoPath = path.join(config.videosPath, videoName);
    
    if (!fs.existsSync(videoPath)) {
        return res.status(404).json({ error: 'Video no encontrado' });
    }
    
    const info = nativeModule.getVideoInfo(videoPath);
    res.json(info);
}); */



// Ruta para listar videos disponibles
/* router.get('/videos', (req, res) => {
    fs.readdir(config.videosPath, (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Error leyendo directorio de videos' });
            return;
        }
        
        const videoFiles = files.filter(file => 
            file.endsWith('.mp4') || 
            file.endsWith('.avi') || 
            file.endsWith('.mkv') ||
            file.endsWith('.mov')
        );
        
        res.json(videoFiles);
    });
}); */


/* 
router.get('/stream_sync/:video', async (req, res) => {
    if (!nativeModule) {
        return res.status(500).json({ error: 'Fallo al iniciar proceso de streaming.' });
    }

    const videoName = req.params.video;                 // el nombre tal cual viene del /videos (con extensión)
    const inputPath = path.join(config.videosPath, videoName);

    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: 'Video no encontrado' });
    }
  
    // Carpeta única y segura para este video
    const safeName = videoName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const outDir   = path.join(hlsBaseDir,'videos', path.parse(safeName).name);
  
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  
    // Generar HLS (playlist + segmentos) en outDir
    const ok = await nativeModule.convertToHLS(inputPath, outDir);
    if (!ok) {
        return res.status(500).json({ error: 'Fallo al generar HLS' });
    }

    // Verifica que se creó la playlist
    const playlistDisk = path.join(outDir, 'playlist.m3u8');
    if (!fs.existsSync(playlistDisk)) {
        return res.status(500).json({ error: 'No se generó playlist.m3u8' });
    }

    const streaming_path = config.video_streaming_path;

    // Devuelve URL para HLS.js
    const url = `${streaming_path}/${path.parse(safeName).name}/playlist.m3u8`;
    return res.json({ url });
}); */


/* router.get('/stream/:video', async (req, res) => {
    if (!nativeModule) {
        return res.status(500).json({ error: 'Fallo al iniciar proceso de streaming.' });
    }

    const videoName = req.params.video;                 // el nombre tal cual viene del /videos (con extensión)
    const inputPath = path.join(config.videosPath, videoName);

    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: 'Video no encontrado' });
    }
  
    // Carpeta única y segura para este video
    const safeName = videoName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const outDir   = path.join(hlsBaseDir,'videos', path.parse(safeName).name);
    const playlistDisk = path.join(outDir, 'playlist.m3u8');
    const streaming_path = config.video_streaming_path;
    const url = `${streaming_path}/${path.parse(safeName).name}/playlist.m3u8`;
  
    if (!fs.existsSync(outDir))
        fs.mkdirSync(outDir, { recursive: true });

    if (fs.existsSync(playlistDisk)){
        res.json({ url });
        return;
    }
  
    // Generar HLS (playlist + segmentos) en outDir
    nativeModule.convertToHLSAsync(inputPath, outDir, (err, success) => {
        if (err) {
            console.error("Error en conversión:", err);
            return res.status(500).json({ error: "Error al convertir video" });
        }

        // Verifica que se creó la playlist
        if (!fs.existsSync(playlistDisk)) {
            return res.status(500).json({ error: 'No se generó playlist.m3u8' });
        }

        res.json({ url });
    });
}); */


// Ruta principal - servir el reproductor
router.get('/feed', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'html/index.html'));
});

router.get('/upload', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'pages/videos_subir/index.html'));
});

/* router.get('/video/:video', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'pages/videos_ver/index.html'));
}); */

router.get('/video/:video', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'pages/videos_ver_v2/index.html'));
});

/* router.get('/', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'pages/videos_feed/index.html'));
}); */

router.get('/', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'pages/videos_feed_v2/index.html'));
});

router.get('/signin', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'pages/sign_in/index.html'));
});

router.get('/upload_v2', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'pages/videos_subir_v2/index.html'));
});

module.exports = router;