let currentVidId = null;

const funEsSmartTV = function() {
    const ua = navigator.userAgent;
    const tvPatterns = [
        /SmartHub/i, /SMART-TV/i, /HbbTV/i, /NetCast/i,
        /Tizen/i, /webOS/i, /DuckDuckGo-SSB/i,
        /Viera/i, /Bravia/i, /AFT/i, /AFTS/i, /AFTM/i,
        /Roku/i, /CrKey/i, /AppleTV/i, /tvOS/i,
        /Xbox/i, /PLAYSTATION/i, /Nintendo/i,
        /Android TV/i, /Android\/[0-9]+.*\s\(.*TV/i,
        /Opera TV Store/i, /Opera\/9.80.*Linux/i,
        /Hisense/i, /Changhong/i, /Skyworth/i, /TCL/i
    ];
    if (tvPatterns.some(p => p.test(ua))) return true;

    if (/Android/i.test(ua) && !/Mobile/i.test(ua) && !/Tablet/i.test(ua)) {
        const screenArea = screen.width * screen.height;
        if (screenArea >= 1920 * 1080) return true;
    }

    if (screen.width >= 1920 && !/Mobile|Tablet|iPhone|iPad|iPod/i.test(ua)) {
        if ('ontouchstart' in window && !window.chrome?.runtime) return true;
    }

    return false;
};

document.addEventListener("DOMContentLoaded", async () => {
    if (funEsSmartTV()) {
        const videoId = window.location.pathname.split("/").pop();
        window.location.replace(`/video_tv/${videoId}`);
        return;
    }
    funCargarVideo();
});

const funCargarVideo = async () => {
    const videoId = window.location.pathname.split("/").pop();
    const url = `${url_videos_ver}/${videoId}`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        if (!result || !result.data) {
            Gb.getComponent('video_player').setTitle("Video no encontrado");
            return;
        }

        const videoData = result.data;
        currentVidId = videoData.vid_id;

        Gb.getComponent('video_player').setData(videoData, url_hls_base);
        Gb.getComponent('video_player').opt.onPlay = () => {
            funIncrementarVistas(currentVidId);
        };

        funCargarVideosRelacionados(currentVidId);
    } catch (err) {
        console.error("Error al cargar el video:", err);
        Gb.getComponent('video_player').setTitle("Error al cargar el video.");
    }
};

const funIncrementarVistas = async (prm_vid_id) => {
    try {
        await fetch(`${url_videos_views}/${prm_vid_id}/views`, { method: 'PUT' });
    } catch (error) {
        console.error('Error al incrementar vistas:', error);
    }
};

const funCargarVideosRelacionados = async (prm_vid_id) => {
    try {
        const response = await fetch(url_series_videos(prm_vid_id));
        const result = await response.json();
        const container = document.getElementById('related_videos_container');

        if (!container || !result.data) return;

        container.innerHTML = '';

        result.data.forEach(video => {
            const card = funCrearVideoCard(prm_vid_id, video);
            container.append(card);
        });

        const activeCard = container.querySelector('[data-current-video="true"]');
        if (activeCard) {
            activeCard.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
    } catch (err) {
        console.error("Error al cargar videos relacionados:", err);
    }
};

const funRecargarRelacionados = () => {
    if (currentVidId) {
        funCargarVideosRelacionados(currentVidId);
    }
};

const funCrearVideoCard = (current_id, video) => {
    const isCurrent = current_id === video.vid_id;
    const videoLink = `/video/${video.vid_id_public}`;
    const chapter = video.vid_chapter || video.vid_capitulo;
    const videoTitle = chapter ? `${chapter} - ${video.vid_nombre}` : video.vid_nombre;
    const videoSeries = video.vid_serie ? `${video.vid_serie}` : '';
    const videoSeason = video.vid_temporada ? `T ${video.vid_temporada} - ${videoSeries}` : '';

    const card = document.createElement('a');
    card.classList.add('g_video_related_card');
    if (isCurrent) {
        card.setAttribute('data-current-video', 'true');
        card.href = '';
    } else {
        card.href = videoLink;
    }

    const thumb = document.createElement('div');
    thumb.classList.add('g_video_related_thumb');

    if (isCurrent) {
        const indicator = document.createElement('div');
        indicator.className = 'g_video_play_indicator';
        thumb.append(indicator);
    }

    const placeholder = document.createElement('span');
    placeholder.classList.add('g_video_related_placeholder');
    placeholder.textContent = videoTitle;
    thumb.append(placeholder);

    const title = document.createElement('p');
    title.classList.add('g_video_related_title');
    title.textContent = videoSeason ? `${videoSeason}` : videoTitle;

    card.append(thumb);
    card.append(title);

    return card;
};