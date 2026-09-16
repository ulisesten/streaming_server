Gb.define('card_grid', {
    type: 'card_grid',
    id: 'grid.home',
    cls: 'grid_home',
    card_cls: 'grid_home_card',
    result: 'data',
    theme: 'dark',
    no_border: true,
    fields: {
        image: function(video) {
            return video.vid_thumbnail
                ? `${url_videos_feed}/thumbnails/${video.vid_thumbnail}`
                : url_miniatura_default;
        },
        title: 'vid_nombre',
        description: function(video) {
            return video.vid_descripcion || 'Sin descripcion';
        },
        link: function(video) {
            return `/video/${video.vid_id_public}`;
        }
    },
    items: []
});

const funCargarFeed = async function(search) {
    try {
        let response;

        if (search) {
            /* Búsqueda: sigue en el server Node (cws /popular no filtra). */
            const params = new URLSearchParams({ search });
            response = await funProtectedFetch(`${url_videos_feed}?${params.toString()}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response || !response.ok) {
                console.error('No se pudo cargar el feed');
                return;
            }
        } else {
            /* Listado público y directo desde cws (array de filas). */
            response = await fetch(url_videos_cws);
            if (!response.ok) {
                console.error('No se pudo cargar el feed:', response.status);
                return;
            }
        }

        /* CardGrid.onLoadData acepta el array directo (cws) o { data } (Node). */
        const result = await response.json();
        Gb.getComponent('grid.home').loadData(result);
    } catch (err) {
        console.error(err);
    }
}
