const sqlEject = require("../../../../../librerias/sql_server/sql_eject");
//const telegram_bot = require('../../general/services/service_telegram_bot')
const urlVideo = 'https://sodastream.fun/video';
const path = require("node:path");


/**
 * @brief esta clase hace cosas locochonas
 */
class VideosDomain {
    /**
     * @brief Esta funcion es para obtener los videos ...
     * @param {*} req contiene los datos para hacer la consulta
     * @returns Array, retorna un array con los videos
     */
    async get_videos(req) {
        const parametros = {
            tipoConsulta: "CAT_VIDEOS_CONS"
        };

        return sqlEject.store_eject("procCatVideosCons", parametros, "soda_stream");
    }

    async get_series_videos(params) {
        const parametros = {
            tipoConsulta: "CAT_SERIES_VIDEOS_CONS",
            vid_id: params.vid_id
        };

        return sqlEject.store_eject("procCatVideosCons", parametros, "soda_stream");
    }


    async getById(data) {
        const parametros = {
            tipoConsulta: "CAT_VIDEO_BY_ID_CONS",
            vid_id_public: data.vid_id
        };

        return sqlEject.store_eject("procCatVideosCons", parametros, "soda_stream");
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
            vid_temporada: req.body.vid_temporada
        };

        return sqlEject.store_eject("procCatVideosProc", parametros, "soda_stream");
    }

    async thumb_insert(data) {
        const parametros = {
            tipoRegistro: "CAT_VID_THUMBNAIL_INS",
            vid_id: data.vid_id,
            vid_id_thu_public: data.vid_id_thu_public,
            vid_thumb_path: data.vid_thumb_path
        };

        return sqlEject.store_eject("procCatVideosProc", parametros, "soda_stream");
    }

    async images_get_one(thu_id_public, cb) {

        const parametros = {
            tipoConsulta: "CAT_VID_THUMNAIL_CONS",
            thu_id_public: thu_id_public
        };

        return sqlEject.store_eject("procCatVideosCons", parametros, "soda_stream");
    };


    async insert_view(videoData) {
        const parametros = {
            tipoRegistro: "CAT_VIDEOS_VIEW",
            vid_id: videoData.vid_id
        };

        return sqlEject.store_eject("procCatVideosProc", parametros, "soda_stream");
    }
}

module.exports = new VideosDomain();