const form = document.getElementById('uploadForm');
const vid_status = document.getElementById('status');
const image_form = document.getElementById('image_form');
const frm_id_video = document.getElementById('frm_id_video');
let currentSessionId = null;

// HTML para la barra de progreso (agrégalo a tu HTML existente)
const progressHTML = `<div id="progress-container" style="display: none; margin: 15px 0;">
<div class="progress_status">
    <span id="progress-status">Subiendo...</span>
    <span id="progress-percent">0%</span>
</div>
<div class="progress-bar progress_bar">
    <div id="progress-fill"></div>
</div>
<div id="progress-details" class="progress_details">0 MB / 0 MB</div>
</div>`;

/* = `
<div id="progress-container" style="display: none; margin: 15px 0;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
        <span id="progress-status">Subiendo...</span>
        <span id="progress-percent">0%</span>
    </div>
    <div class="progress-bar" style="width: 100%; height: 20px; background-color: #f0f0f0; border-radius: 10px; overflow: hidden;">
        <div id="progress-fill" style="height: 100%; background-color: #2196F3; width: 0%; transition: width 0.3s ease; border-radius: 10px;"></div>
    </div>
    <div id="progress-details" style="font-size: 12px; color: #666; margin-top: 5px;">0 MB / 0 MB</div>
</div>
`; */

// Insertar la barra de progreso después del formulario
form.insertAdjacentHTML('afterend', progressHTML);

const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const progressDetails = document.getElementById('progress-details');
const progressStatus = document.getElementById('progress-status');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const videoFile = formData.get('video'); // Asumiendo que el input se llama "video"
    
    if (!videoFile || videoFile.size === 0) {
        vid_status.textContent = "❌ Por favor selecciona un archivo de video.";
        return;
    }

    // Generar session ID único
    currentSessionId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Mostrar barra de progreso
    progressContainer.style.display = 'block';
    vid_status.textContent = "Preparando subida...";
    updateProgress(0, 0, videoFile.size, 'Preparando...');

    // Deshabilitar el formulario durante la subida
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Subiendo...";
    submitButton.disabled = true;

    // Iniciar polling de progreso
    const progressInterval = setInterval(() => {
        checkProgress(currentSessionId);
    }, 500);

    try {
        const res = await fetch(urlVideos, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Upload-Session': currentSessionId
            }
        });
        
        clearInterval(progressInterval);
        
        const data = await res.json();

        if (data.error > 0) {
            vid_status.textContent = `⚠️ Error: ${data.msg}`;
            updateProgress(0, 0, videoFile.size, 'Error');
            progressFill.style.backgroundColor = '#f44336';
        } else {
            vid_status.textContent = `✅ ${data.msg}`;
            updateProgress(100, videoFile.size, videoFile.size, 'Completado');
            progressFill.style.backgroundColor = '#4CAF50';
            frm_id_video.value = data.data.vid_id;
        }
            
    } catch (err) {
        console.error(err);
        clearInterval(progressInterval);
        vid_status.textContent = "❌ Error al subir el video.";
        updateProgress(0, 0, videoFile.size, 'Error');
        progressFill.style.backgroundColor = '#f44336';
    } finally {
        // Rehabilitar el botón
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        
        // Ocultar progreso después de 5 segundos
        setTimeout(() => {
            progressContainer.style.display = 'none';
        }, 5000);
    }
});

// Función para verificar el progreso
async function checkProgress(sessionId) {
    try {
        const response = await fetch(`${urlVideos}/progress/${sessionId}`);
        if (response.ok) {
            const progress = await response.json();
            updateProgress(progress.progress, progress.loaded, progress.total, progress.status);
        }
    } catch (error) {
        console.error('Error checking progress:', error);
    }
}

// Función para actualizar la UI del progreso
function updateProgress(percent, loaded, total, status = 'uploading') {
    progressFill.style.width = percent + '%';
    progressPercent.textContent = percent + '%';
    
    const loadedMB = (loaded / (1024 * 1024)).toFixed(2);
    const totalMB = (total / (1024 * 1024)).toFixed(2);
    
    progressDetails.textContent = `${loadedMB} MB / ${totalMB} MB`;
    progressStatus.textContent = getStatusText(status);
    
    // Actualizar color basado en el estado
    if (status === 'completed' || percent === 100) {
        progressFill.style.backgroundColor = '#4CAF50';
    } else if (status === 'error') {
        progressFill.style.backgroundColor = '#f44336';
    } else {
        progressFill.style.backgroundColor = '#2196F3';
    }
}

// Función para traducir estados
function getStatusText(status) {
    const statusMap = {
        'uploading': 'Subiendo...',
        'completed': 'Completado',
        'error': 'Error',
        'preparing': 'Preparando...',
        'processing': 'Procesando...'
    };
    return statusMap[status] || status;
}

// Código existente para la miniatura (sin cambios)
const img_form = document.getElementById('uploadThumb');
const img_status = document.getElementById('img_status');    

img_form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(img_form);
    img_status.textContent = "Subiendo y procesando miniatura...";
    console.log(formData)
    try {
            const res = await fetch(`/api/v1/videos/${formData.get('vid_id')}/thumbnails`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.error > 0) {
                console.error(err);
                img_status.textContent = `⚠️ Error: ${data.msg}`;
                return;
            }

            img_status.textContent = `✅  ${data.msg}`;
            
    } catch (err) {
        console.error(err);
        img_status.textContent = "❌ Error al subir la miniatura.";
    }
});
