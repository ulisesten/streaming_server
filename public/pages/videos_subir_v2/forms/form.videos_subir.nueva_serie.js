Gb.define('form',{
    type: 'form',
    id: 'frm_videos_serie_nueva',
    cls: 'form_signin',
    fields: [
        {
            type: 'textfield',
            label: 'Título',
            id: 'ser_nombre'
        },{
            type: 'cbx_thumbnails',
            label: 'Portada',
            id: 'ser_id_thumbnail'
        }
    ],
    buttons: [{
            type: 'button',
            text: 'Subir',
            id: 'btn_videos_series_nueva',
            onClick: function() {
                funSerieNueva();
            }
        },{
            type: 'button',
            text: 'Limpiar',
            id: 'btn_videos_series_subir_limpiar',
            onClick: function() {
                //let form = Gb.getComponent('frm_signin');
                //form.reset()
            }
        }
    ]
})