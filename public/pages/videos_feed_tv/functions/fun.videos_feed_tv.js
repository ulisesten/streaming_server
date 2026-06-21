let tvFeedFocusManager = null;

document.addEventListener("DOMContentLoaded", async () => {
    funCargarInfoUsuario((data) => {
        const userSpan = document.createElement('span');
        userSpan.classList.add('g_tv_header_user');
        userSpan.textContent = data.usu_nombre || '';
        document.querySelector('.g_tv_header').append(userSpan);
    });
    funCargarFeedTV();

    tvFeedFocusManager = new TVFeedFocusManager();
});

const funCargarFeedTV = async function(search) {
    try {
        let fetchUrl = url_videos_feed_tv;
        if (search) {
            const params = new URLSearchParams({ search });
            fetchUrl += `?${params.toString()}`;
        }

        const response = await funProtectedFetch(fetchUrl, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response || !response.ok) {
            console.error('No se pudo cargar el feed TV');
            return;
        }

        const result = await response.json();
        funRenderFeedTV(result.data || []);
    } catch (err) {
        console.error(err);
    }
};

const funRenderFeedTV = function(videos) {
    const container = document.getElementById('tv_feed_container');
    container.innerHTML = '';

    if (videos.length === 0) {
        const empty = document.createElement('div');
        empty.classList.add('g_tv_feed_empty');
        empty.textContent = 'No se encontraron videos';
        container.append(empty);
        return;
    }

    const cols = Math.max(3, Math.min(6, Math.floor(window.innerWidth / 300)));

    for (let i = 0; i < videos.length; i += cols) {
        const row = document.createElement('div');
        row.classList.add('g_tv_feed_row');

        for (let j = i; j < Math.min(i + cols, videos.length); j++) {
            const video = videos[j];
            const card = funCrearFeedCardTV(video);
            row.append(card);
        }

        container.append(row);
    }

    if (tvFeedFocusManager) tvFeedFocusManager.refresh();
};

const funCrearFeedCardTV = function(video) {
    const videoLink = `/video_tv/${video.vid_id_public}`;
    const chapter = video.vid_chapter || video.vid_capitulo;
    const videoTitle = chapter ? `${chapter} - ${video.vid_nombre}` : video.vid_nombre;

    const card = document.createElement('a');
    card.classList.add('g_tv_feed_card', 'g_tv_focusable');
    card.href = videoLink;

    const thumb = document.createElement('div');
    thumb.classList.add('g_tv_feed_card_thumb');

    if (video.vid_thumbnail) {
        const img = document.createElement('img');
        img.classList.add('g_tv_feed_card_img');
        img.src = `${url_videos_feed_tv}/thumbnails/${video.vid_thumbnail}`;
        img.alt = videoTitle;
        img.loading = 'lazy';
        thumb.append(img);
    } else {
        const placeholder = document.createElement('span');
        placeholder.classList.add('g_tv_feed_card_placeholder');
        placeholder.textContent = videoTitle;
        thumb.append(placeholder);
    }

    const cardTitle = document.createElement('p');
    cardTitle.classList.add('g_tv_feed_card_title');
    cardTitle.textContent = videoTitle;

    const cardDesc = document.createElement('p');
    cardDesc.classList.add('g_tv_feed_card_desc');
    cardDesc.textContent = video.vid_descripcion || '';

    card.append(thumb);
    card.append(cardTitle);
    card.append(cardDesc);

    return card;
};

class TVFeedFocusManager {
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

    focus(index) {
        this.focusables.forEach(el => el.classList.remove('g_tv_focused'));
        if (index < 0 || index >= this.focusables.length) return;
        this.currentIndex = index;
        const el = this.focusables[this.currentIndex];
        el.classList.add('g_tv_focused');
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
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

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        let bestIndex = -1;
        let bestDist = Infinity;

        const directionMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

        const direction = directionMap[e.key];
        if (!direction) return;

        e.preventDefault();

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
                const isHorizontal = direction === 'left' || direction === 'right';
                const weight = isHorizontal
                    ? Math.abs(candCy - cy) * 3
                    : Math.abs(candCx - cx) * 3;
                const score = dist + weight;
                if (score < bestDist) {
                    bestDist = score;
                    bestIndex = idx;
                }
            }
        });

        if (bestIndex >= 0) this.focus(bestIndex);
    }
}
