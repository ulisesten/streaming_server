class VideoPlayer {
    constructor() {
        this.videoElement = document.getElementById('videoPlayer');
        this.videoSelector = document.getElementById('videoSelector');
        this.playBtn = document.getElementById('playBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.status = document.getElementById('status');
        
        this.hls = new Hls();
        this.currentVideo = '';
        
        this.initializeEvents();
        this.loadAvailableVideos();
    }
    
    initializeEvents() {
        //this.playBtn.addEventListener('click', () => this.playVideo());
        //this.stopBtn.addEventListener('click', () => this.stopVideo());
        
        this.hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('Error con HLS.js:', data);
            this.updateStatus('Error: ' + data.details);
        });
        
        this.videoElement.addEventListener('play', () => {
            this.updateStatus('Reproduciendo: ' + this.currentVideo);
        });
        
        this.videoElement.addEventListener('pause', () => {
            this.updateStatus('Pausado');
        });
        
        this.videoElement.addEventListener('ended', () => {
            this.updateStatus('Video finalizado');
        });
    }
    
    async loadAvailableVideos() {
        try {
            const response = await fetch('/videos');
            const videos = await response.json();
            
            videos.forEach(video => {
                const option = document.createElement('div');
                option.setAttribute('class','video_list_element');
                option.value = video;
                option.textContent = video;
                option.addEventListener('click', this.clickListVideo.bind(this));
                this.videoSelector.appendChild(option);
            });
            
            this.updateStatus(`${videos.length} videos disponibles`);
        } catch (error) {
            console.error('Error cargando videos:', error);
            this.updateStatus('Error cargando la lista de videos');
        }
    }

    clickListVideo(el) {
        this.currentVideo = el.target.value;
        this.playVideo();
    }
    
    async playVideo() {
        const selectedVideo = this.currentVideo;
        if (!selectedVideo) {
            alert('Por favor selecciona un video');
            return;
        }
    
        this.stopVideo();
    
        try {
            const response = await fetch(`/stream/${selectedVideo}`);
            const data = await response.json();
            const streamUrl = data.url; // ejemplo: /hls/video.mp4.m3u8
    
            if (Hls.isSupported()) {
                this.hls.loadSource(streamUrl);
                this.hls.attachMedia(this.videoElement);
                this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    this.videoElement.play();
                });
            } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                this.videoElement.src = streamUrl;
                this.videoElement.addEventListener('loadedmetadata', () => {
                    this.videoElement.play();
                });
            } else {
                this.updateStatus('Tu navegador no soporta HLS streaming');
            }
        } catch (err) {
            console.error(err);
            this.updateStatus('Error iniciando la reproducción');
        }
    }
    
    stopVideo() {
        this.videoElement.pause();
        this.videoElement.src = '';
        this.hls.detachMedia();
        this.updateStatus('Video detenido');
    }
    
    updateStatus(message) {
        this.status.textContent = message;
        console.log(message);
    }
}

// Inicializar el reproductor cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new VideoPlayer();
});