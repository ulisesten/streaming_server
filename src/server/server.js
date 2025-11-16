require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const videos = require('./app/routes/api/v1/videos/');
//const telegram_bot = require('./app/routes/api/v1/general/services/service_telegram_bot')
const PORT = process.env.PORT || config.port;
const NODE_ENV = process.env.NODE_ENV || 'development';
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
if (NODE_ENV === 'production') {

    startHttpsServer(app);
    
} else {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`[DEVELOPMENT] Servidor de streaming ejecutándose en el puerto ${PORT}`);
        console.log(`Directorio de videos: ${config.videosPath}`);
    });
}


function startHttpsServer(prm_app) {
    const https = require('https');
    const fs = require('fs');

    try {
        const sslOptions = {
            key: fs.readFileSync(process.env.SSL_KEY_PATH),
            cert: fs.readFileSync(process.env.SSL_CERT_PATH),
            ciphers: [
                'ECDHE-ECDSA-AES128-GCM-SHA256',
                'ECDHE-ECDSA-AES256-GCM-SHA384', 
                'ECDHE-ECDSA-CHACHA20-POLY1305',
                'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!3DES'
            ].join(':'),
            honorCipherOrder: true
        };

        https.createServer(sslOptions, prm_app).listen(SSL_PORT, '0.0.0.0', () => {
            console.log(`🔒 Servidor HTTPS ejecutándose en puerto ${SSL_PORT}`);
            console.log(`📁 Directorio de videos: ${config.videosPath}`);
            console.log(`🌍 Entorno: ${NODE_ENV}`);
            console.log(`🔗 URL: https://localhost:${SSL_PORT}`);
            console.log(`🔐 Algoritmo: ECDSA prime256v1`);
        });

        // También iniciar HTTP para redirección (opcional)
        if (config.redirectHttpToHttps) {
            const http = require('http');
            http.createServer((req, res) => {
                res.writeHead(301, { 
                    Location: `https://${req.headers.host}${req.url}` 
                });
                res.end();
            }).listen(PORT, '0.0.0.0', () => {
                console.log(`🔄 Redirección HTTP→HTTPS en puerto ${PORT}`);
            });
        }

    } catch (error) {
        console.warn('❌ No se pudo iniciar HTTPS, usando HTTP:', error.message);
    }
}



module.exports = app;