Gb.define('toolbar',{
    type: 'toolbar',
    id: 'tlb_videos_subir',
    items: [{
            type: 'button',
            text: 'Editar Video',
            id: 'tlb_video_editar',
            color:'purple',
            onClick: function() {
                funVentanaEditarVideo();
            }
        },{
            type: '-'
        },{
            type: 'button',
            text: 'Nuevo Video',
            id: 'tlb_video_subir',
            onClick: function() {
                Gb.getEl('win_videos_subir').open();
            }
        },
        {
            type: '-'
        },
        {
            type: 'button',
            text: 'Externo nuevo',
            id: 'tlb_video_subir_externo',
            onClick: function() {
                Gb.getEl('win_videos_subir_externo').open();
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
            text: 'Nueva Temporada',
            id: 'tlb_temporada_nueva',
            onClick: function() {
                Gb.getEl('win_videos_temporada_nueva').open();
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
