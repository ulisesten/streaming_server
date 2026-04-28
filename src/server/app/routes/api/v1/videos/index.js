const { Router } = require("express");
const videos = Router();
const videos_dto = require("./dto/videos_dto.js");
const videos_domain = require("./domain/videos_domain.js");
const videos_service = require("./service/videos_service.js");
const fs = require("fs");
const path = require("path");
const settings = require("../../../../core/configuration.js");
const telegram_bot = require('../general/services/service_telegram_bot');
const { reject } = require("../../../../core/errors.js");

// www.dominio.com/api/v1/users

//! Obtener videos para el feed
videos.get("/", async function (req, res) {
    const query = await videos_domain.get_videos();
    res.json(videos_dto.get_videos_response(query));
});


//! Obtener videos de la serie relacionada al video
videos.get("/:vid_id/series/relacionados", async function (req, res) {
    const vid_id = req.params.vid_id;
    const query = await videos_domain.get_series_videos({ vid_id });
    res.json(videos_dto.get_series_videos_response(query));
});


videos.get("/:vid_id", async function (req, res) {
    const vid_id = req.params.vid_id;
    const query = await videos_domain.getById({ vid_id });
    res.json(videos_dto.get_by_id_response(query));
});


/// Subir videos
videos.post('/', videos_service.progress_handler, videos_service.upload_video.single("video"), async (req, res) => {
    try {
        const video_status = await videos_service.process_uploaded(req)

        if (video_status != 0) {
            reject(res, 500, "Error procesando video");
            return;
        }

        const result = await videos_domain.insert_video(req);

        const dto_result = videos_dto.subir_video_response(result);

        telegram_bot.sendNewVideoNotification({
            vid_title: req.body.vid_nombre,
            vid_id_public: req.vid_id_public,
            vid_thumbnail: dto_result.data['vid_thumbnail']
        });

        res.json(dto_result);

    } catch (exc) {
        console.log('Subir videos: [ERROR] ', exc)
        reject(res, 500, "Error en el proceso");
    }
})

videos.get('/progress/:session_id', async (req, res) => {
    const { session_id } = req.params;
    const progress = videos_service.getProgress().get(session_id) || { progress: 0, status: 'unknown' };

    res.json({
        sessionId: session_id,
        progress: progress.progress,
        loaded: progress.loaded,
        total: progress.total,
        status: progress.status
    });
})


videos.put('/:vid_id/views', async (req, res) => {
    const vid_id = req.params.vid_id;
    //const { rep_nombre, rep_msg } = req.body;

    const result = await videos_domain.insert_view({ vid_id: vid_id });

    res.json(videos_dto.general_response(result));
})

videos.post('/:vid_id/report', async (req, res) => {
    const vid_id = req.params.vid_id;
    const { rep_nombre, rep_msg } = req.body;

    return res.status(200).json({ msg: "Under Maintenance" });
    /* const result = await videos_domain.insert(
        { 
            rep_id_video: vid_id,
            rep_nombre: rep_nombre,
            rep_msg: rep_msg
        }
    );
  
    res.json(videos_dto.subir_video_response(result)); */
})


videos.post('/:vid_id/thumbnails', videos_service.upload_thumbnail.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: "No se recibió archivo" });
    }

    const vid_id = req.params.vid_id;
    const filename = req.file.filename;
    const vid_id_thu_public = req.vid_id_thu_public;

    if (!filename) {
        return res.status(500).json({ msg: "Error interno." });
    }

    const img_path = settings.getApiNAS();

    const result = await videos_domain.thumb_insert({
        vid_id: vid_id,
        vid_id_thu_public: vid_id_thu_public,
        vid_thumb_path: `${img_path}/${filename}`
    });

    res.json(videos_dto.general_response(result));
})


// Handler compartido para thumbnails con o sin extensión
async function serveThumbnail(req, res) {
    const thu_id_public = req.params.thu_id_public;
    const ext = req.params.ext;
    console.log('GET /api/v1/videos/thumbnails/:thu_id_public:ext', req.params);

    const result = await videos_domain.images_get_one(thu_id_public);

     console.log('Imagen encontrada:', result);

    if (!result || !result[0]) {
        res.json({
            msg: "Ocurrió un error al consultar la imagen.",
            success: false,
            error: 1,
        });
        return;
    }

    const imagen = result[0];
    let imagePath = imagen.thu_path;

    const pathObj = path.parse(imagePath);
    const fallbackExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    // Si se solicita una extensión específica, intenta buscar el archivo con esa extensión
    if (ext) {
        imagePath = path.join(pathObj.dir, `${pathObj.name}.${ext}`);
        if (!fs.existsSync(imagePath)) {
            for (const fallbackExt of fallbackExts) {
                if (fallbackExt === ext.toLowerCase()) continue;
                const candidate = path.join(pathObj.dir, `${pathObj.name}.${fallbackExt}`);
                if (fs.existsSync(candidate)) {
                    imagePath = candidate;
                    break;
                }
            }
        }
    } else {
        // Si no hay extensión en la URL, prueba la ruta original y algunas extensiones comunes.
        if (!fs.existsSync(imagePath)) {
            for (const fallbackExt of fallbackExts) {
                const candidate = path.join(pathObj.dir, `${pathObj.name}.${fallbackExt}`);
                if (fs.existsSync(candidate)) {
                    imagePath = candidate;
                    break;
                }
            }
        }
    }

    // Verificar si la imagen existe
    fs.stat(imagePath, (err, stats) => {
        console.log('Verificando existencia de imagen en path:', imagePath);
        if (err) {
            return res.status(404).json({ msg: 'Imagen no encontrada' });
        }

        const extension = path.parse(imagePath).ext.toLowerCase().replace('.', '');
        const mimeTypes = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp'
        };
        const type = mimeTypes[extension];
        if (type) {
            res.setHeader('Content-Type', type);
        }

        const imageStream = fs.createReadStream(imagePath);
        imageStream.pipe(res);
    });
}

// Primero la ruta con extensión, luego la ruta sin extensión
videos.get("/thumbnails/:thu_id_public.:ext", serveThumbnail);
videos.get("/thumbnails/:thu_id_public", serveThumbnail);

module.exports = videos;