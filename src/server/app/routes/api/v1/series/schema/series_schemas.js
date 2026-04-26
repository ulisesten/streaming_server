
class SeriesSchema {
    // Validar datos de serie
    static validateSeriesData(seriesData) {
        if (!seriesData || typeof seriesData !== 'object') {
            throw new Error('Datos de serie inválidos');
        }

        if (!seriesData.title || typeof seriesData.title !== 'string') {
            throw new Error('El título de la serie es obligatorio');
        }

        if (!seriesData.description || typeof seriesData.description !== 'string') {
            throw new Error('La descripción de la serie es obligatoria');
        }

        if (!seriesData.seasons || !Array.isArray(seriesData.seasons)) {
            throw new Error('Las temporadas de la serie son obligatorias');
        }

        return true;
    }

    // Formatear datos de serie para respuesta
    static formatSeriesForResponse(series) {
        return {
            id: series.id,
            title: series.title,
            description: series.description,
            seasons: series.seasons,
            createdAt: series.createdAt,
            updatedAt: series.updatedAt
        };
    }
}