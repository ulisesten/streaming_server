let urlApi = '';

const url_videos_ver = `${urlApi}/api/v1/videos`;
const url_videos_views = `${urlApi}/api/v1/videos`;
const url_series_videos = (vid_id) => `${urlApi}/api/v1/videos/${vid_id}/series/relacionados`;
const url_hls_base = `${urlApi}/hls/videos`;

let v_season_stored = 0;