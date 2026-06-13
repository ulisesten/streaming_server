

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


const funProtectedFetch = async (url, opt = {}) => {
  let csrfToken = funObtenerCookie('csrf_token');
  const __body = opt.body ? opt.body : null;
  const isFormData = __body instanceof FormData;

  const baseHeaders = {
    'X-CSRF-Token': csrfToken,
    ...opt.headers
  };
  if (!isFormData) {
    baseHeaders['Content-Type'] = 'application/json';
  }

  let response = await fetch(url, {
    method: opt.method || 'GET',
    credentials: 'include',
    body: __body,
    headers: baseHeaders
  })

  if (response.status === 200) {
    return response;
  }

  const refreshSuccess = await funRefrescarToken();

  if (!refreshSuccess) {
    window.location.href = url_login;
    return null;
  }

  csrfToken = funObtenerCookie('csrf_token');
  const retryHeaders = {
    'X-CSRF-Token': csrfToken,
    ...opt.headers
  };
  if (!isFormData) {
    retryHeaders['Content-Type'] = 'application/json';
  }

  response = await fetch(url, {
    method: opt.method || 'GET',
    credentials: 'include',
    body: __body,
    headers: retryHeaders
  });

  return response;
}


const funCargarInfoUsuario = async function(cb) {
    try {
        const response = await funProtectedFetch(url_users_info, {
            method: 'GET'
        });

        if (!response.ok) {
            console.error('No se pudo obtener la información del usuario');
            cb(null);
            return;
        }

        const result = await response.json();
        const data = result.data;

        cb(data)

    } catch (err) {
        console.error(err);
    }
}