Gb.define('form',{
    type: 'form',
    id: 'frm_videos_subir_editar',
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
            label: 'Id de usuario',
            id: 'vid_id_usuario'
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
            text: 'Editar',
            id: 'btn_videos_subir_editar',
            onClick: function() {
                funVideosSubirEditar();
            }
        },{
            type: 'button',
            text: 'Limpiar',
            id: 'btn_videos_subir_limpiar',
            onClick: function() {
                let form = Gb.getComponent('frm_signin');
                //form.reset()
            }
        }
    ]
})