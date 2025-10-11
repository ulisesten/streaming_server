const path = require('path');

module.exports = {
    port: process.env.PORT || 3000,
    videosPath: path.join(__dirname, '..', '..', 'videos'),
    publicPath: path.join(__dirname, '..', '..', 'public'),
    video_streaming_path: '/hls/videos',
    live_streaming_path: '/hls/lives',
    video_output_path: '../../../../../../../public/hls/videos/'
};