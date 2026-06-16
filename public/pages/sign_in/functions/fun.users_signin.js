

const funUsersSignin = async function() {
    let form = Gb.getComponent('frm_signin');
    const values = form.getValues();

    try {
        const response = await fetch(urlUsersSignin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usu_correo: values.usu_correo,
                usu_contrasena: values.usu_contrasena
            })
        });
        const data = await response.json();
        console.log('Response from server:', data);
        if (data.success && data.data) {
            Gb.define('notification', {
                message: 'Inicio de sesión exitoso',
                type: 'success',
                duration: 3000
            }).show();
            form.reset();
            window.location.href = funGetSigninRedirect();
        } else {
            Gb.define('notification', {
                message: data.msg || 'Error en inicio de sesión'
            }).show();
        }
    } catch (err) {
        console.error(err);
        Gb.define('notification', {
            message: 'Error de red o servidor'
        }).show();
    }
}
