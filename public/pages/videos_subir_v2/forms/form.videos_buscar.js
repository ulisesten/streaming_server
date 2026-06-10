Gb.define('form',{
    type: 'form',
    id: 'frm_videos_buscar',
    no_border: true,
    no_margin: true,
    fields: [
        {
            type: 'textfield',
            label: 'Título',
            id: 'vid_nombre'
        },{
            type: 'textfield',
            label: 'Id Público',
            id: 'vid_id_publico'
        },{
            type: 'textfield',
            label: 'Serie',
            id: 'vid_id_serie'
        }
    ],
    buttons: [{
            type: 'button',
            text: 'Buscar',
            id: 'btn_videos_subir',
            onClick: function() {
                let form = Gb.getComponent('frm_videos_buscar');
                console.log( form.getValues() );
                funVideosSubirCons();
            }
        },{
            type: 'button',
            text: 'Limpiar',
            id: 'btn_videos_subir_limpiar',
            onClick: function() {
                const form = Gb.getComponent('frm_videos_buscar');
                form.reset()
            }
        }
    ]
})