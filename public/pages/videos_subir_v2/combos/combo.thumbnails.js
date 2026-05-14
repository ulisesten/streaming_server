

Gb.define('dropdown',{
    type: 'dropdown',
    id: 'cbx_thumbnails',
    label: 'Id Thumbnail',
    url: url_vid_combo_thumbnails,
    remote: true,
    autoload: true,
    result: 'data',
    fields: {
        id: 'thu_id',
        thumbnail: (data) => `/api/v1/videos/thumbnails/${data.thu_path.split('tmb-')[1]}`
    }
})