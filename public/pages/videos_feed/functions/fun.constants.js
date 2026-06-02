let urlApi = '';

const url_videos_feed = `${urlApi}/api/v1/videos`;
const url_users_info = `${urlApi}/api/v1/users/info`;
const url_users_refresh = `${urlApi}/api/v1/users/refresh_token`;
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
