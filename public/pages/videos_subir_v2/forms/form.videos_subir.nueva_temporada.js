Gb.define('form',{
    type: 'form',
    id: 'frm_videos_temporada_nueva',
    cls: 'form_signin',
    fields: [
        {
            type: 'textfield',
            label: 'Título',
            id: 'tem_numero'
        },{
            type: 'cbx_series',
            label: 'Serie',
            id: 'tem_id_serie'
        },{
            type: 'cbx_thumbnails',
            label: 'Thumbnail',
            id: 'tem_id_thumbnail'
        }
    ],
    buttons: [{
            type: 'button',
            text: 'Subir',
            id: 'btn_videos_temporada_nueva',
            onClick: function() {
                //funVideosSubir();
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