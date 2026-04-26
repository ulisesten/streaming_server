// SeriesDTO.js
// Objetos de transferencia de datos para series

class SeriesDTO {
    // Crear DTO para respuesta de lista de series
    series_obtener_response(dao) {
        if (!dao) {
            return {
                status: 404,  
                response: {
                    success: false,
                    error: 1,
                    msg: "No se encontraron series",
                    data: []
                }
            }
        }

        return {
            status: 200,  
            response:{
                success: true,
                error: 0,
                msg: "Series obtenidas exitosamente",
                data: dao.map(serie => ({
                    ser_id: serie.ser_id,
                    ser_nombre: serie.ser_nombre
                }))
            }
        };
    }

    series_new_response(dao) {
        if (!dao) {
            return {
                status: 500,  
                response: {
                    success: false,
                    error: 1,
                    msg: "No se pudo crear la serie",
                    data: []
                }
            }
        }

        return {
            status: 201,  
            response:{
                success: true,
                error: 0,
                msg: "Serie creada exitosamente",
                data: []
            }
        };
    }

    // Crear DTO para respuesta de serie individual
    createSeriesResponse(series) {
        return {
            success: true,
            data: {
                id: series.id,
                title: series.title,
                description: series.description,
                seasons: series.seasons,
                createdAt: series.createdAt,
                updatedAt: series.updatedAt
            }
        };
    }

    // Crear DTO para creación de serie
    static createSeriesRequest(seriesData) {
        return {
            title: seriesData.title,
            description: seriesData.description,
            seasons: seriesData.seasons
        };
    }
}

module.exports = new SeriesDTO();