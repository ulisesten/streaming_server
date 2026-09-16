Gb.define('card_grid', {
    type: 'card_grid',
    id: 'grid.populares',
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
