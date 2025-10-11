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
            msg: data[0].msg,
            success: data[0].success,
            error: data[0].error,
            data: data
        };
    }

    get_response(data) {
        console.log('data', data)
        if (!data || data[0] == null)
            return {
              msg: "Sin resultados.",
              success: true,
              error: 0,
            };
      
        return {
            msg: data[0].msg,
            success: data[0].success,
            error: data[0].error,
            data: data
        };
    }
}

module.exports = new VideosDTO();