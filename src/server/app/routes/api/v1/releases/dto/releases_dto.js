// ReleasesDTO.js
// Objetos de transferencia de datos para releases de la aplicación

class ReleasesDTO {
    // Crear DTO para respuesta de lista de releases
    releases_obtener_response(dao) {
        if (!dao) {
            return {
                status: 404,
                response: {
                    success: false,
                    error: 1,
                    msg: "No se encontraron releases",
                    data: []
                }
            }
        }
        return {
            status: 200,
            response: {
                success: true,
                error: 0,
                msg: "Releases obtenidos exitosamente",
                data: dao.map(release => ({
                    rel_id: release.rel_id,
                    rel_version: release.rel_version,
                    rel_path: release.rel_path,
                    rel_type: release.rel_type,
                    rel_date: release.rel_date,
                    rel_description: release.rel_description
                }))
            }
        };
    }
}

module.exports = new ReleasesDTO();
