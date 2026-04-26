// SeasonsDTO.js
// Objetos de transferencia de datos para temporadas

class SeasonsDTO {
    // Crear DTO para respuesta de lista de temporadas
    seasons_obtener_response(dao) {
        if (!dao) {
            return {
                status: 404,  
                response: {
                    success: false,
                    error: 1,
                    msg: "No se encontraron temporadas",
                    data: []
                }
            }
        }

        return {
            status: 200,  
            response:{
                success: true,
                error: 0,
                msg: "Temporadas obtenidas exitosamente",
                data: dao.map(season => ({
                    sea_id: season.sea_id,
                    sea_numero: season.sea_numero,
                    sea_id_serie: season.sea_id_serie,
                    sea_id_thumbnail: season.sea_id_thumbnail
                }))
            }
        };
    }

    seasons_new_response(dao) {
        if (!dao) {
            return {
                status: 500,  
                response: {
                    success: false,
                    error: 1,
                    msg: "No se pudo crear la temporada",
                    data: []
                }
            }
        }

        return {
            status: 201,  
            response:{
                success: true,
                error: 0,
                msg: "Temporada creada exitosamente",
                data: []
            }
        };
    }
}

module.exports = new SeasonsDTO();