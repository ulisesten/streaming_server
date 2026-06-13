document.addEventListener("DOMContentLoaded", async () => {
    funCargarInfoUsuario((data) => {
        if (!data || data.error) {
            window.location.href = url_login; // Redirige al login si no hay datos de usuario válidos
            return;
        }

        Gb.getComponent('header.videos_subir').setUserValues(
            data.usu_thumbnail || url_miniatura_default,
            data.usu_nombre,
            data.usu_id
        ); 
    });
});


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

    const currentSessionId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    prgres_bar.update(0, files[0].size);
    prgres_bar.setProgressMsg('Subiendo...');

    const subirVideoProgressInterval = setInterval(() => {
        funSubirVideosProgressGet(currentSessionId);
    }, 1000);

    try {
        const res = await funProtectedFetch(urlVideosSubir, {
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
            prgres_bar.close();
        }
        /* const win = Gb.getEl('win_videos_subir') || Gb.getComponent('win_videos_subir');
        if (win && typeof win.close === 'function') {
            win.close();
        } */

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


const funInitComboTemporadasBySerie = function(ser_id, form) {
    const cbxTemporadas = form.getField('cbx_temporadas');
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
            progressBar.close();
        }
        /* const win = Gb.getEl('win_videos_temporada_nueva') || Gb.getComponent('win_videos_temporada_nueva');
        if (win && typeof win.close === 'function') {
            win.close();
        } */

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

const funVideosSubirCons = function() {
    const grid = Gb.getComponent('grid_videos');
    grid.setHeaders({
        'X-CSRF-Token': funObtenerCookie('csrf_token')
    });

    grid.load();
}

const funVentanaEditarVideo = function() {

    const grid = Gb.getComponent('grid_videos');
    const selected = grid.getSelection();

    console.log('Selected video for editing:', selected);

    if (!selected.data || selected.data.length === 0) {
        Gb.define('notification', { message: 'Selecciona un video para editar.' });
        //win.close();
        return;
    }

    const win = Gb.getEl('win_videos_subir_editar');
    win.open();

    const s = selected.data[0];
    //console.log('Video seleccionado para editar, ID:', vid);

    const formVidEdit = Gb.getEl('frm_videos_subir_editar');
    funInitComboTemporadasBySerie(s.vid_id_serie, formVidEdit);

    const video = {
        vid_id: s.vid_id,
        vid_nombre: s.vid_nombre,
        vid_capitulo: s.vid_chapter,
        vid_descripcion: s.vid_descripcion,
        vid_tags: s.vid_tags,
        //vid_id_usuario: s.vid_id_usuario,
        cbx_series: s.vid_id_serie || '',
        cbx_temporadas: s.vid_id_temporada || ''
    };

    formVidEdit.setValues(video)
    //funVideosSubirEditarCargar(vidId);
}

const funVideosSubirEditar = async function() {
    const formCmp = Gb.getEl('frm_videos_subir_editar');
    if (!formCmp) {
        console.error('Formulario de edición no encontrado');
        return;
    }

    const vals = formCmp.getValues();
    const editar_body = {
        vid_nombre: vals.vid_nombre,
        vid_capitulo: vals.vid_capitulo,
        vid_descripcion: vals.vid_descripcion,
        vid_tags: vals.vid_tags,
        vid_id_usuario: vals.vid_id_usuario,
        vid_id_serie: vals.cbx_series || null,
        vid_id_temporada: vals.cbx_temporadas || null
    };
    console.log('Valores a editar:', editar_body);

    try {
        const res = await funProtectedFetch(`${urlVideosSubir}/${vals.vid_id}`, {
            method: 'PUT',
            body: JSON.stringify(editar_body)
        });

        const data = await res.json();

        if (!res.ok || (data && data.error > 0)) {
            const errMsg = data && data.msg ? data.msg : 'No se pudo editar el video.';
            throw new Error(errMsg);
        }

        Gb.define('notification', { message: data.msg || 'Video editado correctamente.' });
        const win = Gb.getEl('win_videos_subir_editar');
        if (win && typeof win.close === 'function') {
            win.close();
        }
        funVideosSubirCons();
    } catch (err) {
        console.error('Error al editar video:', err);
        Gb.define('notification', { message: `Error al editar video: ${err.message}` });
    }
}