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
        console.log('[UPLOAD] Iniciando upload de video');
        console.log('[UPLOAD] req.file:', req.file ? { filename: req.file.filename, size: req.file.size, path: req.file.path } : 'NO FILE');
        console.log('[UPLOAD] req.body:', { vid_nombre: req.body.vid_nombre, vid_id_serie: req.body.vid_id_serie, vid_id_temporada: req.body.vid_id_temporada });
        console.log('[UPLOAD] req.vid_id_public:', req.vid_id_public);
        console.log('[UPLOAD] req.user:', req.user ? { usu_id: req.user.usu_id, usu_nombre: req.user.usu_nombre } : 'NO USER');

        const video_status = await videos_service.process_uploaded(req)
        console.log('[UPLOAD] video_status:', video_status);

        if (video_status != 0) {
            console.error('[UPLOAD] Error procesando video, status:', video_status);
            reject(res, 500, "Error procesando video");
            return;
        }

        console.log('[UPLOAD] Insertando video en BD...');
        const result = await videos_domain.insert_video(req);
        console.log('[UPLOAD] Result insert_video:', result);

        const dto_result = videos_dto.subir_video_response(result);
        console.log('[UPLOAD] DTO result:', dto_result);

        telegram_bot.sendNewVideoNotification({
            vid_title: req.body.vid_nombre,
            vid_id_public: req.vid_id_public,
            vid_thumbnail: dto_result.data['vid_thumbnail']
        });

        console.log('[UPLOAD] Enviando respuesta OK');
        res.json(dto_result);

    } catch (exc) {
        console.error('[UPLOAD] Excepción:', exc)
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
