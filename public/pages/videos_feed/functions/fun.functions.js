const dateFormat = function(prm_date) {
    const date_array = prm_date.split('/')
    const month_number = parseInt(date_array[1]);
    const month_name = month_names.ES[month_number - 1];
    return `${date_array[0]}/${month_name}/${date_array[2]}`
}

document.addEventListener("DOMContentLoaded", async () => {
    const feedContainer = document.getElementById("video-feed");
  
    try {
      const response = await fetch(url_videos_feed);
      const result = await response.json();
  
      if (!result || !result.data || result.data.length === 0) {
        feedContainer.innerHTML = "<p>No hay videos disponibles.</p>";
        return;
      }
  
      feedContainer.innerHTML = "";
  
      result.data.forEach(video => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");
  
        // Miniatura (usa placeholder si no hay thumb)
        const thumb = video.vid_thumbnail
          ? `/api/v1/videos/thumbnails/${video.vid_thumbnail}`
          : url_miniatura_default;
  
        const videoLink = `/video/${video.vid_id_public}`;
  
        videoCard.innerHTML = `
          <a href="${videoLink}" class="video-thumb">
            <img src="${thumb}" alt="${video.vid_nombre}" />
          </a>
          <div class="video-info">
            <h3><a href="${videoLink}">${video.vid_nombre}</a></h3>
            <p>${video.vid_descripcion || "Sin descripción"}</p>
            <small>${dateFormat(new Date(video.vid_fecha).toLocaleString())}</small>
          </div>
        `;
  
        feedContainer.appendChild(videoCard);
      });
    } catch (err) {
      console.error("Error al cargar los videos:", err);
      feedContainer.innerHTML = "<p>Error al cargar los videos.</p>";
    }
});

