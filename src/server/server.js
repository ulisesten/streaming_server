const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const videos = require('./app/routes/api/v1/videos/');
const PORT = process.env.PORT || config.port;
const app = express();

// Middlewares
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use("/hls/videos", express.static(path.join(__dirname, "../../public/hls/videos")));
app.use("/hls/lives", express.static(path.join(__dirname, "../../public/hls/lives")));

// Rutas
app.use('/', routes);

app.use('/api/v1/videos',videos);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor de streaming ejecutándose en http://localhost:${PORT}`);
    console.log(`Directorio de videos: ${config.videosPath}`);
});

module.exports = app;