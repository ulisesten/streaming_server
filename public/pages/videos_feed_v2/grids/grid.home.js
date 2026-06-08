Gb.define('card_grid', {
    type: 'card_grid',
    id: 'grid.home',
    cls: 'grid_home',
    card_cls: 'grid_home_card',
    result: 'data',
    theme: 'dark',
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

const funCargarFeed = function() {
    Gb.getComponent('grid.home').setUrl(url_videos_feed);
    Gb.getComponent('grid.home').load();
}
