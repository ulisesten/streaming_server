

const funVideosSubir = async () => {
    const formCmp = Gb.getEl('frm_videos_subir') || Gb.getComponent('frm_videos_subir');
    if (!formCmp) {
        console.error('Formulario no encontrado');
        return;
    }

    const prgres_bar = Gb.define('progress_bar', {
        type: 'progress_bar',
        id: 'progress_bar_videos_subir',
        progress: 35,
        file_size: 734003200, // 700 MB aprox
        success_msg: 'Subida completada',
        error_msg: 'Falló la subida',
        window: true
    });

    const vals = formCmp.getValues();

    const fd = new FormData();
    fd.append('vid_nombre', vals.vid_nombre || '');
    fd.append('vid_capitulo', vals.vid_capitulo || '');
    fd.append('vid_descripcion', vals.vid_descripcion || '');
    fd.append('vid_tags', vals.vid_tags || '');
    fd.append('vid_id_usuario', vals.vid_id_usuario || '');
    fd.append('vid_id_serie', vals.cbx_series || '');
    fd.append('vid_id_temporada', vals.cbx_temporadas || '');

    // file -> FileList
    const files = vals.vid_archivo;
    if (!files || files.length == 0) {
        console.error('No seleccionaste archivo');
        return;
    }
    
    fd.append('video', files[0]); // primer archivo

    prgres_bar.update(0, files[0].size);
    prgres_bar.setProgressMsg('Subiendo...');

    const subirVideoProgressInterval = setInterval(() => {
        funSubirVideosProgressGet(currentSessionId);
    }, 1000);

    const currentSessionId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    try {
        const res = await fetch(urlVideosSubir, {
            method: 'POST',
            body: fd,
            headers: {
                'X-Upload-Session': currentSessionId
            }
        });

        clearInterval(subirVideoProgressInterval);

        if (!res.ok) {
            const txt = await res.text();
            prgres_bar.update(0, files[0].size);
            prgres_bar.setStatus('error');
            throw new Error(`HTTP ${res.status} - ${txt}`);
        }
        
        const data = await res.json();
        console.log('Subida OK:', data);

        prgres_bar.update(100, files[0].size);
        prgres_bar.setStatus('success');
        Gb.define('notification', { message: data.msg || 'Video subido correctamente.' });
        if (typeof formCmp.reset === 'function') {
            formCmp.reset();
        }
        if (typeof prgres_bar.reset === 'function') {
            prgres_bar.reset();
        }
        const win = Gb.getEl('win_videos_subir') || Gb.getComponent('win_videos_subir');
        if (win && typeof win.close === 'function') {
            win.close();
        }

    } catch (err) {
        prgres_bar.update(0, files[0].size);
        prgres_bar.setStatus('error');
        console.error('Error al subir:', err);
    }
}


const funSubirVideosProgressGet = async (sessionId) => {
    try {
        const response = await fetch(`${urlVideosSubir}/progress/${sessionId}`);
        if (response.ok) {
            const progress = await response.json();
            Gb.getEl('progress_bar_videos_subir').update(progress.progress, progress.total);
        }
    } catch (error) {
        console.error('Error checking progress:', error);
    }
}


const funRenderComboSeries = (data) => {
    
}

const funVidThumbnailSubir = async () => {
    const formCmp = Gb.getEl('frm_videos_thumbnail_subir') || Gb.getComponent('frm_videos_thumbnail_subir');
    if (!formCmp) {
        console.error('Formulario de miniatura no encontrado');
        return;
    }

    const vals = formCmp.getValues();
    const files = vals.vid_thumbnail_archivo;

    if (!files || files.length === 0) {
        Gb.define('notification', { message: 'Debes seleccionar una imagen.' });
        return;
    }

    const fd = new FormData();
    fd.append('image', files[0]);

    try {
        const res = await fetch(url_vid_subir_thumbnails, {
            method: 'POST',
            body: fd
        });

        const data = await res.json();

        if (!res.ok || (data && data.error > 0)) {
            const errMsg = data && data.msg ? data.msg : 'No se pudo guardar la miniatura.';
            throw new Error(errMsg);
        }

        Gb.define('notification', { message: data.msg || 'Miniatura guardada correctamente.' });
        if (typeof formCmp.reset === 'function') {
            formCmp.reset();
        }
        const progressBar = Gb.getEl('progress_bar_videos_thumbnail_subir') || Gb.getComponent('progress_bar_videos_thumbnail_subir');
        if (progressBar && typeof progressBar.reset === 'function') {
            progressBar.reset();
        }
        const win = Gb.getEl('win_videos_thumbnail_subir') || Gb.getComponent('win_videos_thumbnail_subir');
        if (win && typeof win.close === 'function') {
            win.close();
        }
    } catch (err) {
        console.error('Error al subir miniatura:', err);
        Gb.define('notification', { message: `Error al guardar miniatura: ${err.message}` });
    }
}


const funSerieNueva = async function() {
    const formCmp = Gb.getEl('frm_videos_serie_nueva');
    if (!formCmp) {
        console.error('Formulario de miniatura no encontrado');
        return;
    }

    const vals = formCmp.getValues();

    try {
        const payload = {
            ser_nombre: vals.ser_nombre,
            ser_id_thumbnail: vals.ser_id_thumbnail || 0
        };

        const res = await fetch(url_vid_serie_nueva, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok || (data && data.error > 0)) {
            const errMsg = data && data.msg ? data.msg : 'No se pudo crear la serie.';
            throw new Error(errMsg);
        }

        Gb.define('notification', { message: data.msg || 'Serie creada correctamente.' });
        if (typeof formCmp.reset === 'function') {
            formCmp.reset();
        }
        const progressBar = Gb.getEl('progress_bar_videos_serie_nueva') || Gb.getComponent('progress_bar_videos_serie_nueva');
        if (progressBar && typeof progressBar.reset === 'function') {
            progressBar.reset();
        }
        const win = Gb.getEl('win_videos_serie_nueva') || Gb.getComponent('win_videos_serie_nueva');
        if (win && typeof win.close === 'function') {
            win.close();
        }
        return data;
    } catch (err) {
        console.error('Error al crear serie:', err);
        Gb.define('notification', { message: `Error al crear serie: ${err.message}` });
        throw err;
    }
}


const funInitComboTemporadasBySerie = function(ser_id) {
    const cbxTemporadas = Gb.getEl('cbx_temporadas');
    console.log('connected', cbxTemporadas.getEl()?.isConnected);
    console.log('options', cbxTemporadas.getEl()?.options?.length);
    console.log('html', cbxTemporadas.getEl()?.outerHTML);

    if (!cbxTemporadas) {
        console.log('Combo temporadas null');
        return;
    }

    if (!ser_id) {
        console.log('ser_id null')
        cbxTemporadas.setOptions([]);
        return;
    }

    const url_temporadas = `${url_vid_series_temporadas}/${ser_id}`;
    cbxTemporadas.setUrl(url_temporadas);
    cbxTemporadas.load()
}


const funVidSubTemporadaNueva = async function() {
    const formCmp = Gb.getEl('frm_videos_temporada_nueva');
    if (!formCmp) {
        console.error('Formulario de temporada no encontrado');
        return;
    }

    const vals = formCmp.getValues();

    try {
        const payload = {
            sea_numero: vals.sea_numero,
            sea_id_serie: vals.sea_id_serie || 0,
            sea_id_thumbnail: vals.sea_id_thumbnail || 0
        };

        const res = await fetch(url_vid_temporadas, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok || (data && data.error > 0)) {
            const errMsg = data && data.msg ? data.msg : 'No se pudo crear la temporada.';
            throw new Error(errMsg);
        }

        Gb.define('notification', { message: data.msg || 'Temporada creada correctamente.' });

        if (typeof formCmp.reset === 'function') {
            formCmp.reset();
        }
        const progressBar = Gb.getEl('progress_bar_videos_temporada_nueva') || Gb.getComponent('progress_bar_videos_temporada_nueva');
        if (progressBar && typeof progressBar.reset === 'function') {
            progressBar.reset();
        }
        const win = Gb.getEl('win_videos_temporada_nueva') || Gb.getComponent('win_videos_temporada_nueva');
        if (win && typeof win.close === 'function') {
            win.close();
        }

        const idSerie = payload.sea_id_serie;
        if (idSerie) {
            funInitComboTemporadasBySerie(idSerie);
        }

        return data;
    } catch (err) {
        console.error('Error al crear temporada:', err);
        Gb.define('notification', { message: `Error al crear temporada: ${err.message}` });
        throw err;
    }
}
