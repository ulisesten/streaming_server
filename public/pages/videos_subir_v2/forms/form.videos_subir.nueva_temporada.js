Gb.define('frm_videos_temporada_nueva',{
    type: 'form',
    id: 'frm_videos_temporada_nueva',
    cls: 'form_signin',
    fields: [
        {
            type: 'textfield',
            label: 'Número',
            id: 'sea_numero'
        },{
            type: 'cbx_series',
            label: 'Serie',
            id: 'sea_id_serie'
        },{
            type: 'cbx_thumbnails',
            label: 'Miniatura',
            id: 'sea_id_thumbnail'
        }
    ],
    buttons: [{
            type: 'button',
            text: 'Subir',
            id: 'btn_videos_temporada_nueva',
            onClick: function() {
                funVidSubTemporadaNueva();
            }
        },{
            type: 'button',
            text: 'Limpiar',
            id: 'btn_videos_temporada_limpiar',
            onClick: function() {
                //let form = Gb.getComponent('frm_signin');
                //form.reset()
            }
        }
    ]
})