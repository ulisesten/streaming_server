let urlApi = '';

if(window.location.hostname === 'localhost')
    urlApi = 'https://192.168.1.78:3000';

const urlVideosVer = `${urlApi}/api/v1/videos`;
const urlVideosViews = `${urlApi}/api/v1/videos`;
const urlSeriesVideos = (vid_id) => { return `${urlApi}/api/v1/videos/${vid_id}/series/relacionados`;}