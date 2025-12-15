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
          return '<div class="card_date"><small class="exalt">Hoy</small></div>';
      }

    return `<small>${day} ${month_name} ${year} a las ${date.getHours()}:${date.getMinutes()} hrs.</small>`
}

document.addEventListener("DOMContentLoaded", async () => {
    funCargarFeed();
    
});


const funCargarFeed = async function() {
    const feedContainer = document.getElementById("video-feed");
    
    const response = await fetch(url_videos_feed);
    const result = await response.json();

    if (!result || !result.data || result.data.length === 0) {
        feedContainer.innerHTML = "<p>No hay videos disponibles.</p>";
        return;
    }

    feedContainer.innerHTML = "";

    result.data.forEach(video => {
        funCrearVideoCard(video, feedContainer);
    });
}

const funCrearVideoCard = async function(video, feedContainer) {
    const videoCard = document.createElement("div");
    videoCard.classList.add("video-card");

    // Miniatura (usa placeholder si no hay thumb)
    const thumb = video.vid_thumbnail
      ? `${url_videos_feed}/thumbnails/${video.vid_thumbnail}`
      : url_miniatura_default;

    const videoLink = `/video/${video.vid_id_public}`;

    const videoThumbLink = document.createElement('a');
    videoThumbLink.href = videoLink;
    videoThumbLink.className = 'video-thumb';

    const thumbnailImg = document.createElement('img');
    thumbnailImg.src = thumb;
    thumbnailImg.alt = video.vid_nombre;
    thumbnailImg.onerror = ()=> {
      thumbnailImg.src = url_miniatura_default;
    }

    const videoInfo = document.createElement('div');
    videoInfo.className = 'video-info';

    const titleHeading = document.createElement('h3');
    titleHeading.setAttribute('class','text-gradient-green');
    const titleLink = document.createElement('a');
    titleLink.href = videoLink;
    titleLink.textContent = video.vid_nombre;

    const description = document.createElement('p');
    description.textContent = video.vid_descripcion || "Sin descripción";
    //description.setAttribute('class','text-gradient-purple');

    const dateElement = document.createElement('span');
    dateElement.innerHTML = dateFormat(video.vid_fecha);
    //dateElement.setAttribute('class','text-gradient-purple');

    // Ensamblar la estructura
    videoThumbLink.appendChild(thumbnailImg);

    titleHeading.appendChild(titleLink);

    videoInfo.appendChild(titleHeading);
    videoInfo.appendChild(description);
    videoInfo.appendChild(dateElement);

    videoCard.appendChild(videoThumbLink);
    videoCard.appendChild(videoInfo);

    
    feedContainer.appendChild(videoCard);
}

