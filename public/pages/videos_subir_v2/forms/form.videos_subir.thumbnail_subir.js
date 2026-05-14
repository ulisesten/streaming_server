Gb.define('form',{
    type: 'form',
    id: 'frm_videos_thumbnail_subir',
    cls: 'form_signin',
    fields: [
        {
            type: 'file',
            label: 'Imagen miniatura',
            id: 'vid_thumbnail_archivo'
        }
    ],
    buttons: [{
            type: 'button',
            text: 'Subir',
            id: 'btn_thumbnail_subir',
            onClick: function() {
                funVidThumbnailSubir();
            }
        },{
            type: 'button',
            text: 'Limpiar',
            id: 'btn_thumbnail_limpiar',
            onClick: function() {
                let form = Gb.getComponent('frm_videos_thumbnail_subir');
                if (form && typeof form.reset === 'function') {
                    form.reset();
                }
            }
        }
    ]
})
