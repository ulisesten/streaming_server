Gb.define('form',{
    type: 'form',
    id: 'frm_videos_buscar',
    title: 'Subir video',
    cls: 'form_signin',
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
            text: 'Subir',
            id: 'btn_videos_subir',
            onClick: function() {
                let form = Gb.getComponent('frm_videos_buscar');
                console.log( form.getValues() );
            }
        },{
            type: 'button',
            text: 'Limpiar',
            id: 'btn_videos_subir_limpiar',
            onClick: function() {
                //let form = Gb.getComponent('frm_signin');
                //form.reset()
            }
        }
    ]
})