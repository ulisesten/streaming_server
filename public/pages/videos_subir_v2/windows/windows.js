Gb.define('window', {
    type: 'window',
    id: 'win_videos_subir',
    title: 'Subir video',
    width: 700,
    height: 450,
    'x-align': 'center',
    'y-align': 'center',
    items: [
        Gb.getComponent('frm_videos_subir').getEl()
    ]
})

Gb.define('window', {
    type: 'window',
    id: 'win_videos_serie_nueva',
    title: 'Nueva serie',
    width: 700,
    height: 200,
    'x-align': 'center',
    'y-align': 'center',
    items: [
        Gb.getComponent('frm_videos_serie_nueva').getEl()
    ]
})

Gb.define('window', {
    type: 'window',
    id: 'win_videos_thumbnail_subir',
    title: 'Subir miniatura',
    width: 700,
    height: 240,
    'x-align': 'center',
    'y-align': 'center',
    items: [
        Gb.getComponent('frm_videos_thumbnail_subir').getEl()
    ]
})
