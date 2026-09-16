let urlApi = '';
const urlApiCws = 'https://cws.sodastream.fun';

const url_videos_feed = `${urlApi}/api/v1/videos`;
const url_videos_popular = `${urlApiCws}/api/v1/videos/popular`;  // extra (implementado en cws)
const url_users_info = `${urlApiCws}/api/v1/users/me`;
const url_users_refresh = `${urlApiCws}/api/v1/users/refresh_token`;
const url_miniatura_default = "https://placehold.co/400x225?text=User";