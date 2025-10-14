document.addEventListener("DOMContentLoaded", async () => {
    const videoId = window.location.pathname.split("/").pop();
    const apiUrl = `http://localhost:3000/api/v1/videos/${videoId}`;
  
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
  
      if (!result || !result.data || result.data.length === 0) {
        document.getElementById("video_title").textContent = "Video no encontrado";
        return;
      }
  
      const videoData = result.data[0];
  
      // Mostrar info del video
      document.getElementById("video_title").textContent = videoData.vid_nombre;
      document.getElementById("video_description").textContent = videoData.vid_descripcion;
      document.getElementById("video_likes").textContent = `👍 ${videoData.vid_likes || 0}`;
      document.getElementById("video_dislikes").textContent = `${videoData.vid_dislikes || 0} 👎`;
  
      // Reproducir video con HLS.js
      const video = document.getElementById("video_player");
      const videoSrc = videoData.vid_path;
  
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
        video.addEventListener("loadedmetadata", () => video.play());
      }
    } catch (err) {
      console.error("Error al cargar el video:", err);
      document.getElementById("video_title").textContent = "Error al cargar el video.";
    }
  });
  