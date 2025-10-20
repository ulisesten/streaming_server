let viewsCounted = false;

document.addEventListener("DOMContentLoaded", async () => {
    funCargarVideo();
});

const incrementViews = async (prm_vid_id) => {
    try {
        await fetch(`${urlVideosViews}/${prm_vid_id}/views`, {
            method: 'PUT'
        });
    } catch (error) {
        console.error('Error al incrementar vistas:', error);
    }
};

const funCargarVideo = async function() {
    const videoId = window.location.pathname.split("/").pop();
    const url = `${urlVideosVer}/${videoId}`;
  
    try {
        const response = await fetch(url);
        const result = await response.json();
    
        if (!result || !result.data || result.data.length === 0) {
            document.getElementById("video_title").textContent = "Video no encontrado";
            return;
        }
    
        const videoData = result.data[0];
        const vid_id = videoData.vid_id;
    
        // Mostrar info del video
        document.getElementById("video_title").textContent = videoData.vid_nombre;
        document.getElementById("video_description").textContent = videoData.vid_descripcion;
        document.getElementById("video_views").textContent = `${videoData.vid_views || 0} vistas `;
        document.getElementById("video_likes").textContent = `👍 ${videoData.vid_likes || 0}`;
        document.getElementById("video_dislikes").textContent = `${videoData.vid_dislikes || 0} 👎`;
    
        // Reproducir video con HLS.js
        const video = document.getElementById("video_player");
        const videoSrc = `${urlApi}${videoData.vid_path}`;
  
        /// Validando sopote nativo
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play()
                if (!viewsCounted){
                    incrementViews(vid_id);
                    viewsCounted = true;
                }
            });
            return;
        } 
      
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoSrc;
            video.addEventListener("loadedmetadata", () => video.play());
            video.addEventListener('play', function() {
                if (!viewsCounted){
                    incrementViews(vid_id);
                    viewsCounted = true;
                }
            });
        }
    } catch (err) {
      console.error("Error al cargar el video:", err);
      document.getElementById("video_title").textContent = "Error al cargar el video.";
    }
}



  