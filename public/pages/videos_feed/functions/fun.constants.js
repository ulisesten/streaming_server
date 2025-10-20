let urlApi = '';

if(window.location.hostname === 'localhost')
    urlApi = 'http://189.157.205.246:3000';

const url_videos_feed = `${urlApi}/api/v1/videos`;
const url_miniatura_default = "https://placehold.co/400x225?text=Sin+Miniatura";

const fecha_std = (new Date()).toISOString()
const fechaActual = (new Date(fecha_std));

const month_names = {
    'ES':[
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
    ]
}