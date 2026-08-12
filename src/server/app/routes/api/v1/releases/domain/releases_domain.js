// ReleasesDomain.js
// Lógica de negocio para releases de la aplicación

const sqlEject = require("../../../../../librerias/sql_server/sql_eject");
const releasesDTO = require("../dto/releases_dto");

class SpProcesos {
    //! CONS
    static CONS_RELEASES_CONS = 1;
}

class ReleasesDomain {
    static async getAllReleases(req, res) {
        try {
            const params = {
                tipoConsulta: SpProcesos.CONS_RELEASES_CONS
            }
            const dao = await sqlEject.store_eject("procCatAppReleasesCons", params, "soda_stream");
            const dto_res = releasesDTO.releases_obtener_response(dao);
            res.status(dto_res.status).json(dto_res.response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ReleasesDomain;
