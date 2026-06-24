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


/* router.get('/upload', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'pages/videos_subir/index.html'));
}); */

router.get('/video/:video', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'pages/videos_ver_v2/index.html'));
});

router.get('/', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'pages/videos_feed_v2/index.html'));
});

router.get('/signin', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'pages/sign_in/index.html'));
});

router.get('/upload', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'pages/videos_subir_v2/index.html'));
});

router.get('/tv', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'pages/videos_feed_tv/index.html'));
});

router.get('/video_tv/:video', (req, res) => {
    res.sendFile(path.join(config.publicPath, 'pages/videos_ver_tv/index.html'));
});

module.exports = router;