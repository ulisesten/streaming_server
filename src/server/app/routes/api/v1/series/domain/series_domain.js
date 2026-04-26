// SeriesDomain.js
// Lógica de negocio para series

const sqlEject = require("../../../../../librerias/sql_server/sql_eject");
const seriesDTO = require("../dto/series_dto");

class SpProcesos {
    //! CONS
    static CONS_SERIES_CONS  = 1;

    //! PROC
    static PROC_SERIES_NEW   = 1;
}

class SeriesDomain {
    
    static async getAllSeries(req, res) {
        try {
            const params = {
                tipoConsulta: SpProcesos.CONS_SERIES_CONS
            }

            const dao = await sqlEject.store_eject("procCatSeriesCons", params, "soda_stream");
            const dto_res = seriesDTO.series_obtener_response(dao);
            res.status(dto_res.status).json(dto_res.response);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    // Crear una nueva serie
    static async createSeries(req, res) {
        try {
            const seriesData = req.body;
            const params = {
                tipoRegistro: SpProcesos.PROC_SERIES_NEW,
                ser_nombre: seriesData.ser_nombre,
                ser_id_thumbnail: seriesData.ser_id_thumbnail
            }

            const dao = await sqlEject.store_eject("procCatSeriesProc", params, "soda_stream");
            const dto_res = seriesDTO.series_new_response(dao);
            res.status(dto_res.status).json(dto_res.response);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Actualizar una serie
    static async updateSeries(req, res) {
        try {
            const { id } = req.params;
            const seriesData = req.body;
            const updatedSeries = await SeriesService.updateSeries(id, seriesData);
            if (!updatedSeries) {
                return res.status(404).json({ error: 'Serie no encontrada' });
            }
            res.json(updatedSeries);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Eliminar una serie
    static async deleteSeries(req, res) {
        try {
            const { id } = req.params;
            const result = await SeriesService.deleteSeries(id);
            if (!result) {
                return res.status(404).json({ error: 'Serie no encontrada' });
            }
            res.json({ message: 'Serie eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SeriesDomain;