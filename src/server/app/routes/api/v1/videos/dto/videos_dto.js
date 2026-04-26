class VideosDTO {
    general_response(data) {
        if (!data || data[0] == null)
            return {
                msg: "Error al procesar información.",
                success: false,
                error: 1,
            };

        return {
            msg: data[0].msg,
            success: data[0].success,
            error: data[0].error
        };
    }

    get_by_id_response(data) {
        if (!data || data[0] == null)
            return {
                msg: "Error al obtener la información del video.",
                success: false,
                error: 1,
            };

        return {
            msg: data[0].msg || "Se obtuvo el video correctamente.",
            success: data[0].success || true,
            error: data[0].error || 0,
            data: data[0]
        };
    }

    get_videos_response(data) {
        if (!data || data[0] == null)
            return {
                msg: "Sin resultados.",
                success: true,
                error: 0,
                data: null
            };

        return {
            msg: data[0].msg || 'Se obtuvieron los videos correctamente.',
            success: data[0].success || true,
            error: data[0].error || 0,
            data: data // []
        };
    }

    get_series_videos_response(data) {
        if (!data || data[0] == null)
            return {
                msg: "Sin resultados.",
                success: true,
                error: 0,
                data: null
            };

        return {
            msg: data[0].msg || 'Se obtuvieron los videos relacionados correctamente.',
            success: data[0].success || true,
            error: data[0].error || 0,
            data: data
        };
    }

    subir_video_response(data) {
        if (!data || data[0] == null)
            return {
                msg: "Error al procesar el resultado.",
                success: false,
                error: 1,
                data: null
            };

        console.log('subir_video_response', data)

        return {
            msg: data[0].msg,
            success: data[0].success,
            error: data[0].error,
            data: {
                vid_id: data[0].vid_id,
                vid_thumbnail: data[0].vid_id_thu_public
            }

        };
    }
}

module.exports = new VideosDTO();