const { Router } = require("express");
const videos = Router();
const videos_dto = require("./dto/videos_dto.js");
const videos_domain = require("./domain/videos_domain.js");
const videos_service = require("./service/videos_service.js");
const fs = require("fs");
const path = require("path");
const config = require("../../../../../config");
const settings = require("../../../../core/configuration.js");
const telegram_bot = require('../general/services/service_telegram_bot')
//const authService = require("../../../../librerias/authorization/authorization.js");

// www.dominio.com/api/v1/users

/* users.post("/", async function (req, res) {
    const db_res = await usersDomain.users_new(req);
    res.json(usersDto.user_new_response(db_res));
});

users.put("/:usu_id", async function (req, res) {
    const db_res = await usersDomain.users_update(req);
    res.json(usersDto.user_update_response(db_res));
});



users.post("/signin", async function (req, res) {
    const contrasena = req.body.usu_contrasena;
    const db_res = await usersDomain.user_singin(req);

    const request = {
        ip: req.ip,
        user_agent: req.headers['user-agent']
    };

    const service_response = usersService.user_signin(request, db_res, contrasena);
    res.json(usersDto.user_signin_response(service_response));
});


users.get("/:usu_id/address", async function (req, res) {
    const db_res = await usersDomain.users_address_get_one(req);
    res.json(db_res);
}); */

//! Obtener videos para el feed
videos.get("/",async function (req, res) {
    const query = await videos_domain.get_videos();
    res.json(videos_dto.get_videos_response(query));
});


//! Obtener videos de la serie relacionada al video
videos.get("/:vid_id/series/relacionados",async function (req, res) {
    const vid_id = req.params.vid_id;
    const query = await videos_domain.get_series_videos({vid_id});
    res.json(videos_dto.get_series_videos_response(query));
});


videos.get("/:vid_id",async function (req, res) {
    const vid_id = req.params.vid_id;
    const query = await videos_domain.getById({vid_id});
    res.json(videos_dto.get_by_id_response(query));
});


/// Subir videos
videos.post('/',
        videos_service.progress_handler,
        videos_service.upload_video.single("video"),
    async (req, res)=> {

    if (!req.file) {
        return res.status(400).json({ msg: "No se recibió archivo" });
    }

    const {
        vid_nombre,
        vid_descripcion,
        vid_tags,
        vid_id_usuario,
        vid_id_serie,
        vid_temporada
    } = req.body;
    const vid_id_public = req.vid_id_public;
    const filePath = req.file.path;
    const fileName = req.file.filename;

    // Crear carpeta HLS para este video
    const hlsDir = path.join(__dirname, config.video_output_path, path.parse(fileName).name);
    fs.mkdirSync(hlsDir, { recursive: true });

    if (!fs.existsSync(hlsDir)) {
        console.log(hlsDir, 'Error al crear carpeta video output.')
        return res.status(500).json({ error: 'Error al procesar el video.' });
    }

    // Ejecutar procesamiento nativo
    const success = await videos_service.processToHLS(filePath, hlsDir);

    if (!success) {
        return res.status(500).json({ msg: "Error procesando video" });
    }

    const result = await videos_domain.insert({
        vid_id_usuario,
        vid_id_public,
        vid_nombre,
        vid_descripcion,
        vid_tags,
        vid_id_serie,
        vid_temporada,
        vid_path: `/hls/videos/${path.parse(fileName).name}/playlist.m3u8`,
    });
  
    const dto_result = videos_dto.subir_video_response(result);

    telegram_bot.sendNewVideoNotification({
        title:      vid_nombre,
        url:        `${settings.DOMAIN_NAME}/video/${vid_id_public}`,
        thumbnail:  `${settings.DOMAIN_NAME}/api/v1/videos/thumbnails/${dto_result.data.vid_thumbnail}`
    });

    res.json(videos_dto.subir_video_response(dto_result));
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


videos.post('/:vid_id/thumbnails', videos_service.upload_thumbnail.single("image"), async (req, res)=> {
    if (!req.file) {
        return res.status(400).json({ msg: "No se recibió archivo" });
    }

    const vid_id            = req.params.vid_id;
    const filename          = req.file.filename;
    const vid_id_thu_public = req.vid_id_thu_public;

    if(!filename) {
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

videos.get("/thumbnails/:thu_id_public", async function(req, res) {

    const thu_id_public = req.params.thu_id_public;

    const result = await videos_domain.images_get_one( thu_id_public );

    if (!result || !result[0]){
        res.json({
            msg: "Ocurrió un error al consultar la imagen.",
            success: false,
            error: 1,
        });
        return;
    }

    const imagen = result[0];
    const imagePath = imagen.thu_path;

    // Verificar si la imagen existe
    fs.stat(imagePath, (err, stats) => {
        if (err) {
            return res.status(404).json({ msg: 'Imagen no encontrada' });
        }

        const imageStream = fs.createReadStream(imagePath);

        //res.setHeader('Content-Type', 'image/jpg'); // Ajustar según el tipo de imagen

        imageStream.pipe(res);
    });

});

module.exports = videos;