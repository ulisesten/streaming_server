let urlApi = '';

if(window.location.hostname === 'localhost')
    urlApi = 'http://189.157.193.110:3000';

const url_videos_feed = `${urlApi}/api/v1/videos`;
const url_miniatura_default = "https://placehold.co/400x225?text=Sin+Miniatura";

const fecha_std = (new Date()).toISOString()
const fechaActual = (new Date(fecha_std));

const month_names = {
    'ES':[
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic'
    ]
}