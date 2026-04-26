// GenresDomain.js
// Lógica de negocio para géneros

const sqlEject = require("../../../../../librerias/sql_server/sql_eject");
const genresDTO = require("../dto/genres_dto");

class SpProcesos {
    //! CONS
    static CONS_GENRES_CONS  = 1;

    //! PROC
    static PROC_GENRES_NEW   = 1;
}

class GenresDomain {
    static async getAllGenres(req, res) {
        try {
            const params = {
                tipoConsulta: SpProcesos.CONS_GENRES_CONS
            }
            const dao = await sqlEject.store_eject("procCatGenresCons", params, "soda_stream");
            const dto_res = genresDTO.genres_obtener_response(dao);
            res.status(dto_res.status).json(dto_res.response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Crear un nuevo género
    static async createGenre(req, res) {
        try {
            const genreData = req.body;
            const params = {
                tipoRegistro: SpProcesos.PROC_GENRES_NEW,
                gen_nombre: genreData.gen_nombre
            }
            const dao = await sqlEject.store_eject("procCatGenresProc", params, "soda_stream");
            const dto_res = genresDTO.genres_new_response(dao);
            res.status(dto_res.status).json(dto_res.response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = GenresDomain;
