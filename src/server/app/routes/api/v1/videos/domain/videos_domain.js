const { reject } = require("../../../../../core/errors");
const sqlEject = require("../../../../../librerias/sql_server/sql_eject");
const urlVideo = 'https://sodastream.fun/video';
const path = require("node:path");
const fs = require("node:fs");
const videos_dto = require("../dto/videos_dto");
const settings = require("../../../../../core/configuration");


/**
 * @brief esta clase hace cosas locochonas
 */
class VideosDomain {

    async get_series_videos(req, res) {
        const vid_id = req.params.vid_id;

        const parametros = {
            tipoConsulta: "CAT_SERIES_VIDEOS_CONS",
            vid_id: vid_id
        };

        const dao = await sqlEject.store_eject("procCatVideosCons", parametros, "soda_stream");

        res.json(videos_dto.get_series_videos_response(dao));
    }



    async video_get_by_id(req, res) {
        const vid_id = req.params.vid_id;
        
        const parametros = {
            tipoConsulta: "CAT_VIDEO_BY_ID_CONS",
            vid_id_public: vid_id
        };

        const dao = await sqlEject.store_eject("procCatVideosCons", parametros, "soda_stream");

        res.json(videos_dto.get_by_id_response(dao));
    }



    async insert_view(req, res) {
        const vid_id = req.params.vid_id;
        //const result = await this.insert_view_query({ vid_id });

        const parametros = {
            tipoRegistro: "CAT_VIDEOS_VIEW",
            vid_id: videoData.vid_id
        };

        const dao = await sqlEject.store_eject("procCatVideosProc", parametros, "soda_stream");

        res.json(videos_dto.general_response(dao));
    }



    async get_thumbnail(req, res) {
        const thu_id_public = req.params.thu_id_public;
        const ext = req.params.ext;

        const parametros = {
            tipoConsulta: "CAT_VID_THUMNAIL_CONS",
            thu_id_public: thu_id_public
        };

        const result = await sqlEject.store_eject("procCatVideosCons", parametros, "soda_stream");

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
        if(settings.NODE_ENV != 'production'){ 
            imagePath = imagePath.replace('../../nas/images/videos', settings.getApiNAS());
        }
        console.log('image path',imagePath)

        const pathObj = path.parse(imagePath);
        const fallbackExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

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
        } else if (!fs.existsSync(imagePath)) {
            for (const fallbackExt of fallbackExts) {
                const candidate = path.join(pathObj.dir, `${pathObj.name}.${fallbackExt}`);
                if (fs.existsSync(candidate)) {
                    imagePath = candidate;
                    break;
                }
            }
        }

        fs.stat(imagePath, (err) => {
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



    /**
     * @brief Esta funcion es para obtener los videos ...
     * @param {*} req contiene los datos para hacer la consulta
     * @returns Array, retorna un array con los videos
     */
    async get_videos(req, res) {
        const parametros = {
            tipoConsulta: "CAT_VIDEOS_CONS"
        };

        const dao = await sqlEject.store_eject("procCatVideosCons", parametros, "soda_stream");
        
        res.json(videos_dto.get_videos_response(dao));
    }


    /**
     * @brief Esta funcion es para obtener los videos ...
     * @param {*} req contiene los datos para hacer la consulta
     * @returns Array, retorna un array con los videos
     */
    async get_table_format_videos(req, res) {
        const parametros = {
            tipoConsulta: "CAT_VIDEOS_TABLE_FORMAT_CONS",
            usuario_alta: 1
        };

        const dao = await sqlEject.store_eject("procCatVideosCons", parametros, "soda_stream");
        
        res.json(videos_dto.get_videos_response(dao));
    }



    /**
     * 
     * @param {vid_id_usuario, vid_id_public, vid_nombre, vid_descripcion, vid_tags, vid_id_serie, vid_temporada, vid_path } videoData 
     * @returns 
     */
    async insert_video(req) {
        const parametros = {
            tipoRegistro: "CAT_VIDEOS_INS",
            vid_id_public: req.vid_id_public,
            vid_id_usuario: req.body.vid_id_usuario,
            vid_nombre: req.body.vid_nombre,
            vid_path: `/${path.parse(req.file.filename).name}/playlist.m3u8`,
            vid_descripcion: req.body.vid_descripcion || "",
            vid_tags: req.body.vid_tags || "",
            vid_id_serie: req.body.vid_id_serie,
            vid_id_temporada: req.body.vid_id_temporada,
            vid_temporada: req.body.vid_temporada,
            vid_capitulo: req.body.vid_capitulo
        };

        return sqlEject.store_eject("procCatVideosProc", parametros, "soda_stream");
    }



    /// Inserta una nueva vista para un video relacionada a un video
    async video_thumb_insert(data) {
        const parametros = {
            tipoRegistro: "CAT_VID_THUMBNAIL_INS",
            vid_id: data.vid_id,
            vid_id_thu_public: data.vid_id_thu_public,
            vid_thumb_path: data.vid_thumb_path
        };

        return sqlEject.store_eject("procCatVideosProc", parametros, "soda_stream");
    }



    /// Inserta una nueva vista para un video o series, sin relación
    async thumb_insert(req, res) {
        if (!req.file) {
            return res.status(400).json({ msg: "No se recibió archivo" });
        }

        if (!req.file.filename) {
            return res.status(500).json({ msg: "Error interno." });
        }

        const filename = req.file.filename;
        const vid_id_thu_public = req.vid_id_thu_public;
        const vid_thumb_path = settings.getApiNAS();

        const parametros = {
            tipoRegistro: "CAT_THUMBNAIL_INS",
            vid_id_thu_public: vid_id_thu_public,
            vid_thumb_path: vid_thumb_path + "/" + filename
        };

        const dao = await sqlEject.store_eject("procCatVideosProc", parametros, "soda_stream");
        res.json(videos_dto.general_response(dao));
    }


    /// Obtener thumbnails para combobox
    async get_cat_thumbnails(req, res) {
        const parametros = {
            tipoConsulta: "CAT_THUMBNAILS_CONS"
        };

        const dao = await sqlEject.store_eject("procCatVideosCons", parametros, "soda_stream");
        console.log(dao)
        const dto = videos_dto.get_cat_thumbnails_response(dao)
        console.log('------------------------------dto', dto)
        res.status(dto.status).json(dto.response); 
    }
}

module.exports = new VideosDomain();
