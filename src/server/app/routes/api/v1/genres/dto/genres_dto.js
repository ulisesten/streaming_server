// GenresDTO.js
// Objetos de transferencia de datos para géneros

class GenresDTO {
    // Crear DTO para respuesta de lista de géneros
    genres_obtener_response(dao) {
        if (!dao) {
            return {
                status: 404,
                response: {
                    success: false,
                    error: 1,
                    msg: "No se encontraron géneros",
                    data: []
                }
            }
        }
        return {
            status: 200,
            response: {
                success: true,
                error: 0,
                msg: "Géneros obtenidos exitosamente",
                data: dao.map(genre => ({
                    gen_id: genre.gen_id,
                    gen_nombre: genre.gen_nombre
                }))
            }
        };
    }

    genres_new_response(dao) {
        if (!dao) {
            return {
                status: 500,
                response: {
                    success: false,
                    error: 1,
                    msg: "No se pudo crear el género",
                    data: []
                }
            }
        }
        return {
            status: 201,
            response: {
                success: true,
                error: 0,
                msg: "Género creado exitosamente",
                data: dao
            }
        };
    }
}

module.exports = new GenresDTO();
