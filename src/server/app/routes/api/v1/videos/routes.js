const { Router } = require("express");
const videos = Router();
const videos_dto = require("./dto/videos_dto.js");
const videos_domain = require("./domain/videos_domain.js");
const videos_service = require("./service/videos_service.js");
const telegram_bot = require('../general/services/service_telegram_bot.js');
const { reject } = require("../../../../core/errors.js");
const settings = require("../../../../core/configuration.js");
const authService = require("../../../../core/authorization.js");


//! Obtener videos para el feed
videos.get("/", videos_domain.get_videos);
// Obtener thumbnails para combobox
videos.get("/thumbnails", videos_domain.get_cat_thumbnails.bind(videos_domain));
//! Obtener videos para el feed
videos.get("/table_format", authService.verify.bind(authService),videos_domain.get_table_format_videos.bind(videos_domain));
//! Obtener videos de la serie relacionada al video
videos.get("/:vid_id/series/relacionados", videos_domain.get_series_videos);
// Obtener video por id
videos.get("/:vid_id", videos_domain.video_get_by_id);


/// Subir videos
videos.post('/', authService.verify.bind(authService), videos_service.progress_handler, videos_service.upload_video.single("video"), async (req, res) => {
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

/// Actualizar vistas de video
videos.put('/:vid_id/views', videos_domain.insert_view.bind(videos_domain))

videos.put('/:vid_id', authService.verify.bind(authService), videos_domain.update_video.bind(videos_domain))

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


/// Reportar video
videos.post('/:vid_id/report', async (req, res) => {
    const vid_id = req.params.vid_id;
    const { rep_nombre, rep_msg } = req.body;

    return res.status(200).json({ msg: "Under Maintenance" });
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

    const result = await videos_domain.video_thumb_insert({
        vid_id: vid_id,
        vid_id_thu_public: vid_id_thu_public,
        vid_thumb_path: `${img_path}/${filename}`
    });

    res.json(videos_dto.general_response(result));
})


videos.post('/thumbnails', videos_service.upload_thumbnail.single("image"), videos_domain.thumb_insert);

// Primero la ruta con extensión, luego la ruta sin extensión
videos.get("/thumbnails/:thu_id_public.:ext", videos_domain.get_thumbnail.bind(videos_domain));
videos.get("/thumbnails/:thu_id_public", videos_domain.get_thumbnail.bind(videos_domain));



module.exports = videos;
