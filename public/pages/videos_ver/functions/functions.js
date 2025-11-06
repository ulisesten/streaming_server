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

        funcCargarVideosRelacionados(vid_id)
  
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

const funcCargarVideosRelacionados = async function(prm_vid_id) {
    const response = await fetch(urlSeriesVideos(prm_vid_id));
    const result = await response.json();

    const feedContainer = document.getElementById("related_videos");
    result.data.forEach(video => {
        funCrearVideoCard(prm_vid_id, video, feedContainer);
    });
}

const funCrearVideoCard = async function(current_id, video, feedContainer) {
    const videoCard = document.createElement("div");
    videoCard.classList.add("video-card");

    // Miniatura (usa placeholder si no hay thumb)
    const thumb = `https://placehold.co/400x225?text=${video.vid_nombre}`;

    const videoLink = `/video/${video.vid_id_public}`;

    let videoThumbLink = document.createElement('a');
    videoThumbLink.href = videoLink;
    if(current_id === video.vid_id)
        videoThumbLink = document.createElement('div');

    videoThumbLink.className = 'video-thumb';

    const thumbnailImg = document.createElement("div");
    thumbnailImg.className = "video-thumb";
  
    // placeholder interior
    const placeholder = document.createElement("div");
    placeholder.className = "placeholder";
  
    // texto dentro del placeholder
    const text = document.createElement("span");
    text.className = "placeholder-text";
    text.textContent = video.vid_nombre;
  
    // anidar elementos
    placeholder.appendChild(text);
    thumbnailImg.appendChild(placeholder);/* document.createElement('img');
    thumbnailImg.src = thumb;
    thumbnailImg.alt = video.vid_nombre;
    thumbnailImg.onerror = ()=> {
      thumbnailImg.src = url_miniatura_default;
    } */

    const videoInfo = document.createElement('div');
    videoInfo.className = 'video-info';

    const titleHeading = document.createElement('h3');
    let titleLink = document.createElement('a');
    titleLink.href = videoLink;

    if(current_id === video.vid_id){
        titleLink = {};
        titleLink = document.createElement('div');
    }

    console.log(current_id, video.vid_id)

    titleLink.textContent = video.vid_nombre;

    const description = document.createElement('p');
    description.textContent = video.vid_descripcion || "Sin descripción";

    /* const dateElement = document.createElement('span');
    dateElement.innerHTML = dateFormat(video.vid_fecha); */

    // Ensamblar la estructura
    videoThumbLink.appendChild(thumbnailImg);

    titleHeading.appendChild(titleLink);

    videoInfo.appendChild(titleHeading);
    videoInfo.appendChild(description);
    /* videoInfo.appendChild(dateElement); */

    videoCard.appendChild(videoThumbLink);
    /* videoCard.appendChild(videoInfo); */

    
    feedContainer.appendChild(videoCard);
}

  