Gb.define('form',{
    type: 'form',
    id: 'frm_videos_subir_externo',
    no_border: true,
    no_margin: true,
    fields: [
        {
            type: 'textfield',
            label: 'Título',
            id: 'vid_nombre'
        },{
            type: 'textfield',
            label: 'Capítulo',
            id: 'vid_capitulo'
        },{
            type: 'textfield',
            label: 'Descripción',
            id: 'vid_descripcion'
        }, {
            type: 'textfield',
            label: 'tags',
            id: 'vid_tags'
        },{
            type: 'textfield',
            label: 'URL m3u8',
            id: 'vid_path'
        },{
            type: 'cbx_thumbnails',
            label: 'Miniatura',
            id: 'vid_id_thumbnail'
        },{
            type: 'cbx_series',
            label: 'Serie',
            id: 'cbx_series'
        },{
            type: 'cbx_temporadas',
            label: 'Temporada',
            id: 'cbx_temporadas'
        }
    ],
    buttons: [{
            type: 'button',
            text: 'Guardar',
            id: 'btn_videos_subir_externo',
            onClick: function() {
                funVideosSubirExterno();
            }
        },{
            type: 'button',
            text: 'Limpiar',
            id: 'btn_videos_subir_externo_limpiar',
            onClick: function() {
                let form = Gb.getComponent('frm_videos_subir_externo');
                if (form && typeof form.reset === 'function') {
                    form.reset();
                }
            }
        }
    ]
})