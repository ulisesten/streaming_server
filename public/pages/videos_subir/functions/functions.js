const form = document.getElementById('uploadForm');
    const status = document.getElementById('status');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      status.textContent = "Subiendo y procesando video...";

      try {
            const res = await fetch('/api/v1/videos/', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.error > 0) {
                console.error(err);
                status.textContent = `⚠️ Error: ${data.msg}`;
                return;
            }
                /* status.innerHTML = `
                ✅ ${data.msg}<br>
                <a href="${data.data.playlist}" target="_blank">Ver playlist .m3u8</a>
                `; */

            
            status.textContent = `✅  ${data.msg}`;
            
    } catch (err) {
        console.error(err);
        status.textContent = "❌ Error al subir el video.";
    }
});