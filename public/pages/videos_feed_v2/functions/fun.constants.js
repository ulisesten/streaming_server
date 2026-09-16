let urlApi = '';
var urlApiCws = 'https://cws.sodastream.fun';

const url_videos_feed = `${urlApi}/api/v1/videos`;
var url_videos_cws = `${urlApiCws}/api/v1/videos`;      // listado completo en cws
var url_videos_popular = `${urlApiCws}/api/v1/videos/popular`;  // extra (implementado en cws)
var url_users_info = `${urlApiCws}/api/v1/users/me`;
var url_users_refresh = `${urlApiCws}/api/v1/users/refresh_token`;
var url_miniatura_default = "https://placehold.co/400x225?text=User";