

Gb.define('form',{
    type: 'form',
    id: 'frm_signin',
    //cls: 'form_signin',
    no_border: true,
    no_margin: true,
    fields: [
        {
            type: 'textfield',
            label: 'Correo',
            id: 'usu_correo'
        },{
            type: 'password',
            label: 'Contraseña',
            id: 'usu_contrasena'
        }
    ],
    buttons: [{
            type: 'button',
            text: 'Enviar',
            id: 'my_button',
            onClick: function() {
                funUsersSignin();
            }
        },{
            type: 'button',
            text: 'Limpiar',
            id: 'my_button_limpiar',
            onClick: function() {
                let form = Gb.getComponent('frm_signin');
                //form.reset()
            }
        }
    ]
})