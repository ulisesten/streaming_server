/*
 * Sección "Populares" (extra): consume cws /api/v1/videos/popular.
 * No sustituye al listado principal (que es cws /api/v1/videos).
 */
const funCargarPopulares = async function() {
    try {
        const response = await fetch(url_videos_popular);
        if (!response.ok) {
            console.error('No se pudo cargar populares:', response.status);
            return;
        }
        /* cws devuelve un array plano; CardGrid.onLoadData lo acepta directo. */
        const result = await response.json();
        Gb.getComponent('grid.populares').loadData(result);
    } catch (err) {
        console.error('Error cargando populares:', err);
    }
}
