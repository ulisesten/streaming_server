require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
//const config = require('./config');
const routes = require('./client_routes');
const settings = require('./app/core/configuration.js');
/** API  */
const users = require('./app/routes/api/v1/users/')
const videos = require('./app/routes/api/v1/videos/');
const series = require('./app/routes/api/v1/series/');
const seasons = require('./app/routes/api/v1/seasons/');
const genres = require('./app/routes/api/v1/genres/');


//const telegram_bot = require('./app/routes/api/v1/general/services/service_telegram_bot')
const PORT = process.env.PORT || settings.SERVER_PORT;
const NODE_ENV = process.env.NODE_ENV || 'development';
const hlsBaseDir = path.join(process.cwd(), 'public/hls');
const app = express();

// Middlewares
app.use(morgan('combined'));
app.use(cors({
    origin: settings.BACKEND_CORS_ORIGINS,
    credentials: true
}));
app.use(express.json());
app.use(express.json({ limit: '10gb' }));
app.use(express.urlencoded({ extended: true, limit: '10gb' }));
app.use("/pages", express.static(path.join(__dirname, "../../public/pages")));
app.use("/hls/videos", express.static(path.join(__dirname, "../../public/hls/videos")));
app.use("/hls/lives", express.static(path.join(__dirname, "../../public/hls/lives")));

//app.use(express.static(config.publicPath));
app.use('hls/videos', express.static(hlsBaseDir, {
    setHeaders: (res, p) => {
        if (p.endsWith('.m3u8')) res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        if (p.endsWith('.ts')) res.setHeader('Content-Type', 'video/mp2t');
    }
}));

// Rutas
app.use('/', routes);
app.use('/api/v1/users', users)
app.use('/api/v1/videos', videos);
app.use('/api/v1/series', series);
app.use('/api/v1/seasons', seasons);
app.use('/api/v1/genres', genres);

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
    });
}


function startHttpsServer(prm_app) {
    const https = require('https');
    const http = require('http');
    const fs = require('fs');

    // Certificados Let’s Encrypt (fullchain + key)
    const keyPath = process.env.SSL_KEY_PATH;        // ej: /etc/letsencrypt/live/sodastream.fun/privkey.pem
    const certPath = process.env.SSL_CERT_PATH;       // ej: /etc/letsencrypt/live/sodastream.fun/fullchain.pem

    try {
        if (!fs.existsSync(keyPath)) {
            throw new Error(`No existe la clave privada en: ${keyPath}`);
        }
        if (!fs.existsSync(certPath)) {
            throw new Error(`No existe el certificado fullchain en: ${certPath}`);
        }

        const sslOptions = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
            // Con Let’s Encrypt, Node usa automáticamente suites modernas.
            honorCipherOrder: true,
        };

        https.createServer(sslOptions, prm_app).listen(PORT, '0.0.0.0', () => {
            console.log(`🔒 HTTPS arriba en puerto ${PORT}`);
            console.log(`📄 Cert: ${certPath}`);
            console.log(`🔑 Key : ${keyPath}`);
        });

        // Redirección HTTP → HTTPS
        if (settings.REDIRECT_HTTP_TO_HTTPS) {
            http.createServer((req, res) => {
                const host = req.headers.host.replace(/:\d+$/, `:${PORT}`);
                res.writeHead(301, { Location: `https://${host}${req.url}` });
                res.end();
            }).listen(80, '0.0.0.0', () => {
                console.log(`🔄 Redirección HTTP→HTTPS activa en puerto 80`);
            });
        }

    } catch (error) {
        console.error('❌ Error iniciando HTTPS:', error.message);
        console.error('⚠️ Usando HTTP sin SSL temporalmente.');
        prm_app.listen(PORT, () => console.log(`🟡 HTTP en puerto ${PORT}`));
    }
}



module.exports = app;