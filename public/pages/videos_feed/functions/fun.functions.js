const dateFormat = function(prm_date) {
    const date = new Date(prm_date);
    const year = date.getUTCFullYear();
    const month_number = date.getUTCMonth();
    const month_name = month_names.ES[month_number];
    const day = date.getUTCDate();

    if(
        day == fechaActual.getDate()
        &&
        month_number == fechaActual.getMonth()
        &&
        year == fechaActual.getFullYear()
      ) {
          return '<div class="card_date"><small>Hoy</small></div>';
      }

    return `<small>${day} ${month_name} ${year} a las ${date.getHours()}:${date.getMinutes()} hrs.</small>`
}

document.addEventListener("DOMContentLoaded", async () => {
    const feedContainer = document.getElementById("video-feed");
  
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
        ? `${url_videos_feed}/thumbnails/${video.vid_thumbnail}`
        : url_miniatura_default;

      const videoLink = `/video/${video.vid_id_public}`;

      videoCard.innerHTML = `
        <a href="${videoLink}" class="video-thumb">
          <img id="${video.vid_thumbnail}" src="${thumb}" alt="${video.vid_nombre}" />
        </a>
        <div class="video-info">
          <h3><a href="${videoLink}">${video.vid_nombre}</a></h3>
          <p>${video.vid_descripcion || "Sin descripción"}</p>
          ${dateFormat(video.vid_fecha)}
        </div>
      `;

      const thumb_container = document.getElementById(video.vid_thumbnail);

      feedContainer.appendChild(videoCard);

      const img = new Image();
      img.src = thumb;
      
      img.onload = function() {
        // La imagen existe, proceder normalmente
        thumb_container.src = `${url_videos_feed}/thumbnails/${video.vid_thumbnail}`
      };
      
      img.onerror = function() {
        // La imagen no existe, usar imagen por defecto
        thumb_container.src = url_miniatura_default;
      };

      
    });
    
});


const createVideoCard = function(videoCard, videoLink, thumb, video) {
    videoCard.innerHTML = `
    <a href="${videoLink}" class="video-thumb">
      <img src="${thumb}" alt="${video.vid_nombre}" />
    </a>
    <div class="video-info">
      <h3><a href="${videoLink}">${video.vid_nombre}</a></h3>
      <p>${video.vid_descripcion || "Sin descripción"}</p>
      ${dateFormat(video.vid_fecha)}
    </div>
  `;
}

