/*
 * Sección "Populares": consume el endpoint extra de cws
 * (GET https://cws.sodastream.fun/api/v1/videos/popular).
 * No sustituye al feed principal (que sigue en el server Node).
 */
const funCargarPopulares = async function() {
    try {
        const response = await fetch(url_videos_popular);
        if (!response.ok) {
            console.error('No se pudo cargar populares:', response.status);
            return;
        }
        const result = await response.json();
        /* cws devuelve un array plano de filas; el grid espera { data }. */
        const data = Array.isArray(result) ? { data: result } : result;
        Gb.getComponent('grid.populares').loadData(data);
    } catch (err) {
        console.error('Error cargando populares:', err);
    }
}
