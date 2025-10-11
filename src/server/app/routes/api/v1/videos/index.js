const { Router } = require("express");
const videos = Router();
const videos_dto = require("./dto/videos_dto.js");
const videos_domain = require("./domain/videos_domain.js");
const videos_service = require("./service/videos_service.js");
const fs = require("fs");
const path = require("path");
const config = require("../../../../../config");
const settings = require("../../../../core/configuration.js");
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


videos.get("/",async function (req, res) {
    const query = await videos_domain.get();
    res.json(videos_dto.get_response(query));
});

videos.get("/:vid_id",async function (req, res) {
    const vid_id = req.params.vid_id;
    const query = await videos_domain.getById({vid_id});
    res.json(videos_dto.get_by_id_response(query));
});

videos.post('/', videos_service.upload_video.single("video"),async (req, res)=> {
    if (!req.file) {
        return res.status(400).json({ msg: "No se recibió archivo" });
    }

    const { vid_nombre, vid_descripcion, vid_tags, vid_id_usuario } = req.body;
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
        vid_path: `/hls/videos/${path.parse(fileName).name}/playlist.m3u8`,
    });
  
    res.json(videos_dto.general_response(result));
})


videos.post('/:vid_id/thumbnails', videos_service.upload_thumbnail.single("image"),async (req, res)=> {
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

videos.get("/thumbnails/:thu_id_public", async function (req, res) {

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

    //const filename = imagen.ima_arc_nombre;
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