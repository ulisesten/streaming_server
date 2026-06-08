Gb.define('table_grid', {
    type: 'table_grid',
    id: 'grid_videos',
    url: url_videos_table_format,
    result: 'data',
    columns: [
        { key: 'vid_id', label: 'ID' },
        { key: 'vid_id_public', label: 'ID Publico' },
        { key: 'vid_nombre', label: 'Nombre' },
        { key: 'vid_chapter', label: 'Chapter' },
        { key: 'vid_likes', label: 'Likes' },
        { key: 'vid_dislikes', label: 'Dislikes' },
        { key: 'vid_views', label: 'Views' },
        { key: 'vid_descripcion', label: 'Descripcion' },
        { key: 'vid_tags', label: 'Tags' },
        { key: 'vid_tipo', label: 'Tipo' },
        { key: 'vid_fecha', label: 'Fecha' }
    ]
});
