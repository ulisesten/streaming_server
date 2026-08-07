let currentVidId = null;
let tvFocusManager = null;

const funRequestFullscreen = function(el) {
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
};

document.addEventListener("DOMContentLoaded", async () => {
    const videoId = window.location.pathname.split("/").pop();
    await funCargarVideoTV(videoId);
});

const funCargarVideoTV = async (videoId) => {
    const url = `${url_videos_ver_tv}/${videoId}`;

    try {
        const response = await funProtectedFetch(url, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response || !response.ok) {
            funMostrarErrorTV('Video no encontrado');
            return;
        }

        const result = await response.json();

        if (!result || !result.data) {
            funMostrarErrorTV('Video no encontrado');
            return;
        }

        const videoData = result.data;
        currentVidId = videoData.vid_id;

        funConstruirPaginaTV(videoData);
        funCargarVideosRelacionadosTV(currentVidId);
    } catch (err) {
        console.error("Error al cargar el video:", err);
        funMostrarErrorTV('Error al cargar el video.');
    }
};

const funMostrarErrorTV = (msg) => {
    const container = Gb.getComponent('container_tv').getEl();
    container.innerHTML = '';

    const errorDiv = document.createElement('div');
    errorDiv.classList.add('g_tv_error');
    errorDiv.textContent = msg;
    container.append(errorDiv);
};

const funConstruirPaginaTV = (videoData) => {
    const container = Gb.getComponent('container_tv').getEl();
    container.innerHTML = '';

    if (videoData.vid_path && videoData.vid_path.startsWith('http://')) {
        funMostrarErrorTV('Solo Disponible en la App');
        return;
    }

    const playerSection = document.createElement('div');
    playerSection.classList.add('g_tv_player_section');

    const videoContainer = document.createElement('div');
    videoContainer.classList.add('g_tv_video_container', 'g_tv_focusable');
    videoContainer.setAttribute('tabindex', '0');

    const video = document.createElement('video');
    video.classList.add('g_tv_video');
    video.controls = true;
    video.autoplay = true;
    video.id = 'tv_video_el';

    const hlsUrl = `${url_hls_base_tv}/${(videoData.vid_path || '').replace('/hls/videos', '')}`;

    if (Hls.isSupported()) {
        const hls = new Hls({
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
            maxBufferSize: 60 * 1000 * 1000,
            maxBufferHole: 0.5,
            lowLatencyMode: false,
            backBufferLength: 30,
            fragLoadingMaxRetry: 2,
            fragLoadingRetryDelay: 500,
            manifestLoadingMaxRetry: 2,
            manifestLoadingRetryDelay: 500,
            levelLoadingMaxRetry: 2,
            levelLoadingRetryDelay: 500,
            enableWorker: true
        });
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().then(() => {
                funRequestFullscreen(video);
            }).catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch(data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error('[HLS TV] Error fatal de red:', data.details);
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error('[HLS TV] Error fatal de media:', data.details);
                        hls.recoverMediaError();
                        break;
                    default:
                        console.error('[HLS TV] Error fatal:', data.details);
                        hls.destroy();
                        break;
                }
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.setAttribute('src', hlsUrl);
        video.addEventListener('loadedmetadata', () => {
            video.play().then(() => {
                funRequestFullscreen(video);
            }).catch(() => {});
        });
    }

    video.addEventListener('play', () => {
        funIncrementarVistasTV(currentVidId);
    });

    videoContainer.append(video);
    playerSection.append(videoContainer);

    const infoSection = document.createElement('div');
    infoSection.classList.add('g_tv_info_section');

    const title = document.createElement('h1');
    title.classList.add('g_tv_title');
    title.textContent = videoData.vid_nombre;

    const description = document.createElement('p');
    description.classList.add('g_tv_description');
    description.textContent = videoData.vid_descripcion || '';

    const stats = document.createElement('div');
    stats.classList.add('g_tv_stats');

    const chapter = videoData.vid_chapter || videoData.vid_capitulo;
    if (chapter) {
        const chapterSpan = document.createElement('span');
        chapterSpan.classList.add('g_tv_chapter');
        chapterSpan.textContent = chapter;
        stats.append(chapterSpan);
    }

    const views = document.createElement('span');
    views.classList.add('g_tv_views');
    views.innerHTML = `<i class="icon-eye"></i> ${videoData.vid_views || 0}`;

    const likes = document.createElement('span');
    likes.classList.add('g_tv_likes');
    likes.innerHTML = `<i class="icon-thumbs-up"></i> ${videoData.vid_likes || 0}`;

    const dislikes = document.createElement('span');
    dislikes.classList.add('g_tv_dislikes');
    dislikes.innerHTML = `<i class="icon-thumbs-down"></i> ${videoData.vid_dislikes || 0}`;

    stats.append(views);
    stats.append(likes);
    stats.append(dislikes);

    infoSection.append(title);
    if (videoData.vid_descripcion) infoSection.append(description);
    infoSection.append(stats);

    const relatedSection = document.createElement('div');
    relatedSection.classList.add('g_tv_related_section');

    const relatedHeader = document.createElement('div');
    relatedHeader.classList.add('g_tv_related_header');

    const relatedTitle = document.createElement('h2');
    relatedTitle.textContent = 'Videos relacionados';

    const refreshBtn = document.createElement('button');
    refreshBtn.type = 'button';
    refreshBtn.classList.add('g_tv_btn', 'g_tv_focusable');
    refreshBtn.innerHTML = '<i class="icon-arrows-ccw"></i>';
    refreshBtn.addEventListener('click', () => {
        if (currentVidId) funCargarVideosRelacionadosTV(currentVidId);
    });

    relatedHeader.append(relatedTitle);
    relatedHeader.append(refreshBtn);

    const relatedRow = document.createElement('div');
    relatedRow.classList.add('g_tv_related_row');
    relatedRow.id = 'tv_related_row';

    relatedSection.append(relatedHeader);
    relatedSection.append(relatedRow);

    container.append(playerSection);
    container.append(infoSection);
    container.append(relatedSection);

    tvFocusManager = new TVFocusManager();
};

const funIncrementarVistasTV = async (prm_vid_id) => {
    try {
        await funProtectedFetch(`${url_videos_views_tv}/${prm_vid_id}/views`, {
            method: 'PUT',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Error al incrementar vistas:', error);
    }
};

const funCargarVideosRelacionadosTV = async (prm_vid_id) => {
    try {
        const response = await funProtectedFetch(url_series_videos_tv(prm_vid_id), {
            method: 'GET',
            credentials: 'include'
        });

        if (!response || !response.ok) return;

        const result = await response.json();
        const row = document.getElementById('tv_related_row');

        if (!row || !result.data) return;

        row.innerHTML = '';

        result.data.forEach(video => {
            const card = funCrearVideoCardTV(video);
            row.append(card);
        });

        if (tvFocusManager) tvFocusManager.refresh();

        const activeCard = row.querySelector('[data-current-video="true"]');
        if (activeCard) {
            activeCard.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
    } catch (err) {
        console.error("Error al cargar videos relacionados:", err);
    }
};

const funCrearVideoCardTV = (video) => {
    const isCurrent = currentVidId === video.vid_id;
    const videoLink = `/video_tv/${video.vid_id_public}`;
    const chapter = video.vid_chapter || video.vid_capitulo;
    const videoTitle = chapter ? `${chapter} - ${video.vid_nombre}` : video.vid_nombre;

    const card = document.createElement('a');
    card.classList.add('g_tv_card', 'g_tv_focusable');
    if (isCurrent) {
        card.setAttribute('data-current-video', 'true');
        card.href = '';
    } else {
        card.href = videoLink;
    }

    const thumb = document.createElement('div');
    thumb.classList.add('g_tv_card_thumb');

    if (isCurrent) {
        const indicator = document.createElement('div');
        indicator.className = 'g_tv_play_indicator';
        thumb.append(indicator);
    }

    if (video.vid_thumbnail) {
        const img = document.createElement('img');
        img.classList.add('g_tv_card_img');
        img.src = `${url_videos_ver_tv}/thumbnails/${video.vid_thumbnail}`;
        img.alt = videoTitle;
        thumb.append(img);
    } else {
        const placeholder = document.createElement('span');
        placeholder.classList.add('g_tv_card_placeholder');
        placeholder.textContent = videoTitle;
        thumb.append(placeholder);
    }

    const cardTitle = document.createElement('p');
    cardTitle.classList.add('g_tv_card_title');
    cardTitle.textContent = videoTitle;

    card.append(thumb);
    card.append(cardTitle);

    return card;
};

class TVFocusManager {
    constructor() {
        this.focusables = [];
        this.currentIndex = 0;
        this._mouseActive = false;
        this._mouseTimer = null;
        this.init();
    }

    init() {
        this.refresh();
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseover', (e) => this.handleMouseOver(e));

        if (this.focusables.length > 0) {
            this.focus(0);
        }
    }

    refresh() {
        this.focusables = Array.from(document.querySelectorAll('.g_tv_focusable'));
        if (this.currentIndex >= this.focusables.length) {
            this.currentIndex = 0;
        }
        this.focusables.forEach((el, idx) => {
            el.setAttribute('data-tv-idx', idx);
        });
    }

    focus(index, skipVideoFocus) {
        this.focusables.forEach(el => el.classList.remove('g_tv_focused'));
        if (index < 0 || index >= this.focusables.length) return;
        this.currentIndex = index;
        const el = this.focusables[this.currentIndex];
        el.classList.add('g_tv_focused');
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

        if (!skipVideoFocus && el.classList.contains('g_tv_video_container')) {
            const vid = el.querySelector('video');
            if (vid) vid.focus();
        }
    }

    handleMouseMove(e) {
        this._mouseActive = true;
        clearTimeout(this._mouseTimer);
        this._mouseTimer = setTimeout(() => {
            this._mouseActive = false;
        }, 2000);
    }

    handleMouseOver(e) {
        if (!this._mouseActive) return;
        const target = e.target.closest('.g_tv_focusable');
        if (!target) return;
        const idx = parseInt(target.getAttribute('data-tv-idx'), 10);
        if (!isNaN(idx) && idx !== this.currentIndex) {
            this.focus(idx);
        }
    }

    handleKeyDown(e) {
        this._mouseActive = false;

        const el = this.focusables[this.currentIndex];
        if (!el) return;

        if (el.classList.contains('g_tv_video_container')) {
            const vid = el.querySelector('video');
            if (vid && document.activeElement === vid) {
                if (e.key === 'ArrowDown' && !document.fullscreenElement) {
                    e.preventDefault();
                    vid.blur();
                    const nextIdx = this.findNext('down');
                    if (nextIdx >= 0) this.focus(nextIdx, true);
                    return;
                }
                if (e.key === 'ArrowDown' && document.fullscreenElement) {
                    if (document.exitFullscreen) document.exitFullscreen();
                    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                    return;
                }
                return;
            }
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            el.click();
            return;
        }
        if (e.key === 'Backspace' || e.key === 'Escape') {
            e.preventDefault();
            window.history.back();
            return;
        }

        const directionMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

        const direction = directionMap[e.key];
        if (direction) {
            e.preventDefault();
            const nextIdx = this.findNext(direction);
            if (nextIdx >= 0) this.focus(nextIdx);
        }
    }

    findNext(direction) {
        const el = this.focusables[this.currentIndex];
        if (!el) return -1;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        let bestIndex = -1;
        let bestDist = Infinity;

        this.focusables.forEach((candidate, idx) => {
            if (idx === this.currentIndex) return;
            const r = candidate.getBoundingClientRect();
            const candCx = r.left + r.width / 2;
            const candCy = r.top + r.height / 2;

            let valid = false;
            if (direction === 'up' && candCy < cy - 10) valid = true;
            if (direction === 'down' && candCy > cy + 10) valid = true;
            if (direction === 'left' && candCx < cx - 10) valid = true;
            if (direction === 'right' && candCx > cx + 10) valid = true;

            if (valid) {
                const dist = Math.sqrt((candCx - cx) ** 2 + (candCy - cy) ** 2);
                const weight = direction === 'left' || direction === 'right'
                    ? Math.abs(candCy - cy) * 3
                    : Math.abs(candCx - cx) * 3;
                const score = dist + weight;
                if (score < bestDist) {
                    bestDist = score;
                    bestIndex = idx;
                }
            }
        });

        return bestIndex;
    }
}
