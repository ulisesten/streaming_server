const form = document.getElementById('uploadForm');
const vid_status = document.getElementById('status');
const image_form = document.getElementById('image_form');
const frm_id_video = document.getElementById('frm_id_video');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    vid_status.textContent = "Subiendo y procesando video...";

    try {
        const res = await fetch('/api/v1/videos/', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (data.error > 0) {
            console.error(err);
            vid_status.textContent = `⚠️ Error: ${data.msg}`;
            return;
        }

        vid_status.textContent = `✅  ${data.msg}`;


        frm_id_video.value = data.data.vid_id;
            
    } catch (err) {
        console.error(err);
        vid_status.textContent = "❌ Error al subir el video.";
    }
});


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