document.addEventListener("DOMContentLoaded", async () => {
    funCargarInfoUsuario();
    funCargarFeed();
    
});

const funObtenerCookie = function(nombre) {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(item => item.startsWith(`${nombre}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : '';
}

const funRefrescarToken = async function() {
    
    const csrfToken = funObtenerCookie('csrf_token');
    const response = await fetch(url_users_refresh, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
        }
    });

    if (!response.ok) {
        console.error('No se pudo refrescar la sesión');
        return false;
    }

    return true;
}

const funCargarInfoUsuario = async function() {
    try {
        let csrfToken = funObtenerCookie('csrf_token');
        let response = await fetch(url_users_info, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            }
        });

        if (response.status === 401) {
            const refreshSuccess = await funRefrescarToken();

            if (!refreshSuccess) {
                return;
            }

            csrfToken = funObtenerCookie('csrf_token');
            response = await fetch(url_users_info, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                }
            });
        }

        const result = await response.json();
        console.log('Info de usuario:', result);

        const data = result.data;

        Gb.getComponent('header.home').setUserValues(
            data.usu_thumbnail || url_miniatura_default,
            data.usu_nombre,
            data.usu_id
        );
    } catch (err) {
        console.error(err);
    }
}