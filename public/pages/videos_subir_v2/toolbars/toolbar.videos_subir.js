Gb.define('toolbar',{
    type: 'toolbar',
    id: 'tlb_videos_subir',
    items: [
        {
            type: 'button',
            text: 'Nueva Serie',
            id: 'tlb_serie_nueva',
            onClick: function() {
                
                //console.log( 'hi toolbar');
                Gb.getEl('win_videos_subir').open();
            }
        },
        {
            type: 'button',
            text: 'Nueva Serie',
            id: 'tlb_serie_nueva',
            onClick: function() {
                Gb.getEl('win_videos_serie_nueva').open();
            }
        },
        {
            type: 'button',
            text: 'Subir Miniatura',
            id: 'tlb_thumbnail_subir',
            onClick: function() {
                Gb.getEl('win_videos_thumbnail_subir').open();
            }
        }
    ]
})
