const { reject } = require("../../../../../core/errors");
const sqlEject = require("../../../../../librerias/sql_server/sql_eject");
const urlVideo = 'https://sodastream.fun/video';
const path = require("node:path");
const fs = require("node:fs");
const { nanoid } = require('nanoid');
const videos_dto = require("../dto/videos_dto");
const settings = require("../../../../../core/configuration");


class SpConsultas {
    //! CONS
    static CAT_SERIES_VIDEOS_CONS = 1;
    static CAT_VIDEO_BY_ID_CONS = 2;
    static CAT_VID_THUMNAIL_CONS = 3;
    static CAT_VIDEOS_CONS = 4;
    static CAT_VIDEOS_TABLE_FORMAT_CONS = 5;
    static CAT_THUMBNAILS_CONS = 6;
}


/**
 * @brief esta clase hace cosas locochonas
 */
class VideosDomain {

    async get_series_videos(req, res) {
        const vid_id = req.params.vid_id;

        const parametros = {
            tipoConsulta: SpConsultas.CAT_SERIES_VIDEOS_CONS,
            vid_id: vid_id
        };

        const dao = await sqlEject.store_eject("procCatVideosCons", parametros, "soda_stream");

        res.json(videos_dto.get_series_videos_response(dao));
    }



    async video_get_by_id(req, res) {
        const vid_id = req.params.vid_id;
        
        const parametros = {
            tipoConsulta: SpConsultas.CAT_VIDEO_BY_ID_CONS,
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
            vid_id: vid_id
        };

        const dao = await sqlEject.store_eject("procCatVideosProc", parametros, "soda_stream");

        res.json(videos_dto.general_response(dao));
    }



    async get_thumbnail(req, res) {
        const thu_id_public = req.params.thu_id_public;
        const ext = req.params.ext;

        const parametros = {
            tipoConsulta: SpConsultas.CAT_VID_THUMNAIL_CONS,
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
            tipoConsulta: SpConsultas.CAT_VIDEOS_CONS
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
            tipoConsulta: SpConsultas.CAT_VIDEOS_TABLE_FORMAT_CONS,
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
        const vid_id_usuario = req.user.usu_id;

        const parametros = {
            tipoRegistro: "CAT_VIDEOS_INS",
            vid_id_public: req.vid_id_public,
            vid_id_usuario: vid_id_usuario,
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



    /**
     * 
     * @param {vid_id_usuario, vid_id_public, vid_nombre, vid_descripcion, vid_tags, vid_id_serie, vid_temporada, vid_path } videoData 
     * @returns 
     */
    async update_video(req, res) {

        const vid_id = req.params.vid_id;
        const vid_id_usuario = req.user.usu_id;

        console.log('update_video: ', { vid_id, vid_id_usuario, body: req.body })

        const parametros = {
            tipoRegistro: "CAT_VIDEOS_UPDATE",
            vid_id: vid_id,
            vid_id_usuario: vid_id_usuario,
            vid_nombre: req.body.vid_nombre,
            vid_descripcion: req.body.vid_descripcion || "",
            vid_tags: req.body.vid_tags || "",
            vid_id_serie: req.body.vid_id_serie,
            vid_id_temporada: req.body.vid_id_temporada,
            vid_capitulo: req.body.vid_capitulo
        };

        console.log('Parametros para update_video: ', parametros);

        const dao = await sqlEject.store_eject("procCatVideosProc", parametros, "soda_stream");
        const dto = videos_dto.update_response(dao);
        res.status(dto.status).json(dto.response);
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


    /**
     * @brief Inserta un video proveniente de una fuente externa (URL m3u8 y thumbnail externo).
     *        No realiza subida física de archivos. Reutiliza la misma entrada CAT_VIDEOS_INS
     *        del stored procedure procCatVideosProc que insert_video, pasando la URL m3u8
     *        como vid_path y el thu_id seleccionado como vid_id_thumbnail.
     * @returns Resultado del stored procedure del video (con vid_id generado).
     */
    async insert_external_video(req) {
        const vid_id_usuario = req.user.usu_id;
        const id_length = settings.getPublicIdLength();

        req.vid_id_public = nanoid(id_length);

        const parametros = {
            tipoRegistro: "CAT_VIDEOS_INS",
            vid_id_public: req.vid_id_public,
            vid_id_usuario: vid_id_usuario,
            vid_nombre: req.body.vid_nombre,
            vid_path: req.body.vid_path,
            vid_descripcion: req.body.vid_descripcion || "",
            vid_tags: req.body.vid_tags || "",
            //vid_id_serie: req.body.vid_id_serie,
            //vid_id_temporada: req.body.vid_id_temporada,
            //vid_temporada: req.body.vid_temporada,
            //vid_capitulo: req.body.vid_capitulo,
            vid_id_thumbnail: req.body.vid_id_thumbnail || 0
        };

        return sqlEject.store_eject("procCatVideosProc", parametros, "soda_stream");
    }


    /// Obtener thumbnails para combobox
    async get_cat_thumbnails(req, res) {
        const parametros = {
            tipoConsulta: SpConsultas.CAT_THUMBNAILS_CONS
        };

        const dao = await sqlEject.store_eject("procCatVideosCons", parametros, "soda_stream");
        console.log(dao)
        const dto = videos_dto.get_cat_thumbnails_response(dao)
        console.log('------------------------------dto', dto)
        res.status(dto.status).json(dto.response); 
    }
}

module.exports = new VideosDomain();
