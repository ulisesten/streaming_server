// SeasonsDomain.js
// Lógica de negocio para temporadas

const sqlEject = require("../../../../../librerias/sql_server/sql_eject");
const seasonsDTO = require("../dto/seasons_dto");

class SpProcesos {
    //! CONS
    static CONS_SEASONS_CONS  = 1;

    //! PROC
    static PROC_SEASONS_NEW   = 1;
}

class SeasonsDomain {
    
    static async getAllSeasons(req, res) {
        try {
            const params = {
                tipoConsulta: SpProcesos.CONS_SEASONS_CONS
            }

            const dao = await sqlEject.store_eject("procCatSeasonsCons", params, "soda_stream");
            const dto_res = seasonsDTO.seasons_obtener_response(dao);
            res.status(dto_res.status).json(dto_res.response);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    // Crear una nueva temporada
    static async createSeason(req, res) {
        try {
            const seasonData = req.body;
            const params = {
                tipoRegistro: SpProcesos.PROC_SEASONS_NEW,
                sea_numero: seasonData.sea_numero,
                sea_id_serie: seasonData.sea_id_serie,
                sea_id_thumbnail: seasonData.sea_id_thumbnail
            }

            const dao = await sqlEject.store_eject("procCatSeasonsProc", params, "soda_stream");
            const dto_res = seasonsDTO.seasons_new_response(dao);
            res.status(dto_res.status).json(dto_res.response);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SeasonsDomain;